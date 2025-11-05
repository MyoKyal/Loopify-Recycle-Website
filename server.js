// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' })); // For photo base64
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'dist/public')));

// Initialize Firebase Admin (ESM + Env Vars/Local File)
let db, bucket;
try {
  // Try local file first (for dev)
  let serviceAccount;
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile('./firebase-service-account.json', 'utf8');
    serviceAccount = JSON.parse(data);
  } catch (e) {
    // Fallback to env vars for Vercel
    serviceAccount = {
      type: process.env.FIREBASE_TYPE || 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };
  }

  const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`
  });

  db = getFirestore(firebaseApp);
  bucket = getStorage(firebaseApp).bucket();
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error);
  process.exit(1);
}

// API: Save Return + Generate PDF
app.post('/api/return', async (req, res) => {
  try {
    const { selected, shipping, photo } = req.body;

    // 1. Save to Firestore
    const returnRef = await db.collection('returns').add({
      ...selected,
      shipping,
      status: 'pending',
      createdAt: new Date(),
      rewardAmount: selected.rewardAmount
    });
    console.log('✅ Saved return to Firestore:', returnRef.id);

    // 2. Upload photo if provided
    let photoUrl = null;
    if (photo) {
      const file = bucket.file(`returns/${returnRef.id}/photo.jpg`);
      const buffer = Buffer.from(photo.split(',')[1], 'base64');
      await file.save(buffer, { contentType: 'image/jpeg' });
      photoUrl = `https://firebasestorage.googleapis.com/v0/b/${serviceAccount.project_id}.appspot.com/o/returns%2F${returnRef.id}%2Fphoto.jpg?alt=media`;
      await db.collection('returns').doc(returnRef.id).update({ photoUrl });
      console.log('✅ Uploaded photo to Storage:', photoUrl);
    }

    // 3. Generate PDF Label
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('RETURN LABEL – Loopify Recycle', {
      x: 50, y: 350, size: 24, font,
      color: rgb(0.1, 0.37, 0.24)
    });
    page.drawText('To: Loopify Hub, Yangon', { x: 50, y: 300, size: 14, font });
    page.drawText(`From: ${shipping.name}`, { x: 50, y: 270, size: 12, font });
    page.drawText(`${shipping.street}, ${shipping.city}`, { x: 50, y: 250, size: 12, font });
    page.drawText(`Return ID: ${returnRef.id.slice(0, 8)}`, { x: 50, y: 220, size: 10, font });
    page.drawText(`Reward: ${selected.rewardAmount} MMK`, { x: 50, y: 190, size: 11, font });
    if (photoUrl) page.drawText('Photo uploaded', { x: 50, y: 160, size: 10, font, color: rgb(0, 0.5, 0) });

    const pdfBytes = await pdfDoc.save();

    // 4. Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=loopify-return-label.pdf');
    res.send(Buffer.from(pdfBytes));

    console.log('✅ PDF sent + return processed');
  } catch (error) {
    console.error('❌ Return API error:', error);
    res.status(500).json({ error: 'Failed to process return', details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`→ Landing: http://localhost:${PORT}`);
  console.log(`→ Wizard: http://localhost:${PORT}/public/return`);
  console.log(`→ Admin: http://localhost:${PORT}/public/admin`);
});

