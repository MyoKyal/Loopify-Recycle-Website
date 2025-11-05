// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import admin from 'firebase-admin';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin (use env vars for production)
let serviceAccount;
try {
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
} catch (err) {
  console.error('Firebase config failed');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Vercel serverless: Export for /api endpoints
const apiApp = express();
apiApp.use(express.json({ limit: '10mb' }));

// API: Save return + generate PDF
apiApp.post('/return', async (req, res) => {
  try {
    const { selected, shipping, photo } = req.body;

    const returnRef = await db.collection('returns').add({
      ...selected,
      shipping,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      rewardAmount: selected.rewardAmount
    });

    let photoUrl = null;
    if (photo) {
      const file = bucket.file(`returns/${returnRef.id}/photo.jpg`);
      const buffer = Buffer.from(photo.split(',')[1], 'base64');
      await file.save(buffer, { contentType: 'image/jpeg' });
      photoUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_PROJECT_ID}.appspot.com/o/returns%2F${returnRef.id}%2Fphoto.jpg?alt=media`;
      await returnRef.update({ photoUrl });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('RETURN LABEL – Loopify Recycle', { x: 50, y: 350, size: 24, font, color: rgb(0.1, 0.37, 0.24) });
    page.drawText('To: Loopify Hub, Yangon', { x: 50, y: 300, size: 14, font });
    page.drawText(`From: ${shipping.name}`, { x: 50, y: 270, size: 12, font });
    page.drawText(`${shipping.street}, ${shipping.city}`, { x: 50, y: 250, size: 12, font });
    page.drawText(`Return ID: ${returnRef.id.slice(0, 8)}`, { x: 50, y: 220, size: 10, font });
    page.drawText(`Reward: ${selected.rewardAmount} MMK`, { x: 50, y: 190, size: 11, font });
    if (photoUrl) page.drawText('Photo uploaded', { x: 50, y: 160, size: 10, font, color: rgb(0, 0.5, 0) });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=loopify-return-label.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Return failed:', error);
    res.status(500).json({ error: 'Failed to process return' });
  }
});

// Vercel: Export API handler
export default apiApp;

// For local dev: Full server
if (process.env.NODE_ENV !== 'production') {
  const fullApp = express();
  fullApp.use('/api', apiApp);
  fullApp.use(express.static(path.join(__dirname, 'dist')));
  fullApp.use('/public', express.static(path.join(__dirname, 'public')));
  fullApp.listen(3000, () => {
    console.log('Local dev: http://localhost:3000/public/return');
  });
}