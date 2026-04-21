import 'dotenv/config'; // Must be at the very top to load env vars first
import express from 'express';
import cors from 'cors';

// 👉 ADDED MISSING IMPORT: Bring in the database connection
import prisma from './lib/prisma.js';

// Import Routes (Ensure the .js extension is present for ES Modules)
import adminRoutes from './src/routes/admin.routes.js';
import tournamentRoutes from './src/routes/tournament.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import galleryRoutes from './src/routes/gallery.routes.js';
import contactRoutes from './src/routes/contact.routes.js';

// Initialize Express App
const app = express();

// ------------------------------------------------------
// GLOBAL MIDDLEWARE
// ------------------------------------------------------

// Enable CORS for all routes (Allows your frontend to make requests here)
app.use(cors()); 

// Parse incoming JSON payloads
app.use(express.json()); 

// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------

// Upgraded health check route to verify the server AND database are running
app.get('/', async (req, res) => {
  try {
    // Ping the database
    await prisma.$queryRaw`SELECT 1`; 
    res.status(200).json({ 
      api: 'Online',
      database: 'Connected 🟢',
      message: '♟️ Unique Chess Academy API is online and ready!' 
    });
  } catch (error) {
    res.status(500).json({ 
      api: 'Online',
      database: 'Disconnected 🔴',
      error: 'Cannot reach the database' 
    });
  }
});

// Mount domain-specific routes
app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// ------------------------------------------------------
// GLOBAL ERROR HANDLER
// ------------------------------------------------------

// Catches any unhandled errors so the server doesn't crash entirely
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went critically wrong on the server.' });
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------

// 👉 ADDED MISSING PORT VARIABLE
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