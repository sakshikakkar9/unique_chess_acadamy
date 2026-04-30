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
app.use(cors()); 

// ✅ FIXED: Increased limits for large image payloads
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// ------------------------------------------------------
// STATIC FILES & DIRECTORY SETUP
// ------------------------------------------------------
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created "uploads" directory');
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
      message: '♟️ Unique Chess Academy API is online!' 
    });
  } catch (error) {
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
// GLOBAL ERROR HANDLER
// ------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went critically wrong on the server.' });
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('🟢 Successfully connected to the PostgreSQL database!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();