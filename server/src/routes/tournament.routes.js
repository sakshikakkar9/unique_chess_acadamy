import express from 'express';
import multer from 'multer'; // 1. Import Multer
import * as tournamentController from '../controllers/tournament.controller.js';

const router = express.Router();

// 2. Configure Multer (Using memory or disk storage)
// For Vercel/Render, memoryStorage is often safest for temporary file handling
const upload = multer({ storage: multer.memoryStorage() });

// --- Public ---
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);

// 3. ✅ FIX: Add upload.fields to capture the files and the text data
router.post(
  '/:id/register', 
  upload.fields([
    { name: 'ageProof', maxCount: 1 }, 
    { name: 'paymentProof', maxCount: 1 }
  ]), 
  tournamentController.registerForTournament
);

// --- Admin (Student Management) ---
router.get('/admin/registrations/all', tournamentController.getAllRegistrations);
router.patch('/admin/registrations/:registrationId', tournamentController.updateRegistrationStatus);
router.delete('/admin/registrations/:registrationId', tournamentController.deleteRegistration);

// --- Admin (Tournament Management) ---
router.post('/admin/create', tournamentController.createTournament);
router.put('/admin/update/:id', tournamentController.updateTournament);
router.delete('/admin/delete/:id', tournamentController.deleteTournament);

export default router;