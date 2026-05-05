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
import settingsRoutes from './src/routes/settings.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------------------------------------------
// GLOBAL MIDDLEWARE
// ------------------------------------------------------
// ✅ UPDATED: Added your specific Vercel deployment URL to stop CORS errors
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5176',
  'https://unique-chess-academy.vercel.app',
  'https://unique-chess-acadamy-tqe5.vercel.app' // 👈 Added this exactly as seen in your screenshot
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api/settings', settingsRoutes);

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('🟢 Database connected successfully!');
  } catch (err) {
    console.error('🔴 Database connection failed:', err);
  }
});