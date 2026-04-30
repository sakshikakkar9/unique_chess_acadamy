import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import fs from 'fs'; 
import { fileURLToPath } from 'url'; 

// 👉 DATABASE CONNECTION
import prisma from './lib/prisma.js';

// 👉 ROUTES IMPORT
import adminRoutes from './src/routes/admin.routes.js';
import tournamentRoutes from './src/routes/tournament.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import galleryRoutes from './src/routes/gallery.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import demoRoutes from './src/routes/demo.routes.js';
import courseRoutes from './src/routes/course.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------------------------------------------
// GLOBAL MIDDLEWARE
// ------------------------------------------------------
// ✅ UPDATED: Allow local development AND your Vercel frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Default for Vite
  'https://unique-chess-academy.vercel.app' // 👈 Replace with your actual Vercel URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
})); 

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// ------------------------------------------------------
// STATIC FILES & DIRECTORY SETUP
// ------------------------------------------------------
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir)); 

// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------
app.get('/', async (req, res) => {
  try {
    // Quick health check for the DB
    await prisma.$queryRaw`SELECT 1`; 
    res.status(200).json({ 
      api: 'Online',
      database: 'Connected 🟢',
      message: '♟️ Unique Chess Academy API is live!' 
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ api: 'Online', database: 'Disconnected 🔴' });
  }
});

app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/courses', courseRoutes);

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
const PORT = process.env.PORT || 5000;

// Render needs the server to start even if DB is slow, 
// so we connect but don't block the app.listen if possible.
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('🟢 Database connected successfully!');
  } catch (err) {
    console.error('🔴 Database connection failed:', err);
  }
});