// server/app.js (or firebase.js)

// --- MODULE IMPORTS ---
import fs from 'fs'; // Required to read the local JSON file
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import admin from 'firebase-admin';
import { Buffer } from 'node:buffer'; // Ensure Buffer is available if needed

// --- FILE PATH SETUP for ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FIREBASE ADMIN INITIALIZATION ---
let serviceAccount;

try {
    // 1. ATTEMPT TO READ LOCAL SERVICE ACCOUNT FILE
    const serviceAccountPath = './firebase-service-account.json';
    const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountData);
    
    console.log("Firebase Admin: Initialized using local service account file.");
    
} catch (fileError) {
    // 2. FALLBACK to Environment Variables (for deployment/production)
    console.warn("Could not find/read firebase-service-account.json. Falling back to environment variables.", fileError);
    
    // Check if the required variable exists BEFORE calling .replace()
    if (!process.env.FIREBASE_PRIVATE_KEY) {
        console.error("Firebase init failed: FIREBASE_PRIVATE_KEY environment variable is missing.");
        process.exit(1);
    }
    
    try {
        serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            // The check above prevents the 'replace' error here
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };
    } catch (envError) {
        console.error("Firebase init failed: Environment variables are invalid.", envError.message);
        process.exit(1);
    }
}

// Initialize the Firebase app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();


// --- API APP SETUP (For Serverless & Local /api Route) ---
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
            
            photoUrl = `https://firebasestorage.googleapis.com/v0/b/${serviceAccount.project_id}.appspot.com/o/returns%2F${returnRef.id}%2Fphoto.jpg?alt=media`;
            
            await returnRef.update({ photoUrl });
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // PDF Drawing Logic
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


// --- VERSEL EXPORT & LOCAL DEV SERVER ---

// Vercel: Export API handler
export default apiApp;

// For local dev: Full server wrapper
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    const fullApp = express();
    
    // Mount the API handler under /api
    fullApp.use('/api', apiApp); 
    
    // Serve frontend static files from the 'dist' folder
    fullApp.use(express.static(path.join(__dirname, 'dist')));
    fullApp.use('/public', express.static(path.join(__dirname, 'public')));
    
    // SPA Fallback (to serve index.html for all non-API routes)
    fullApp.use((req, res) => {
        // Skip files with extensions or API calls (already handled)
        if (req.path.match(/\.\w+$/)) return;
        
        // Serve the single entry point for React Router
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
    
    fullApp.listen(PORT, () => {
        console.log(`Local dev server listening at http://localhost:${PORT}`);
    });
}