import express from 'express';
import * as tournamentController from '../controllers/tournament.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Registration Management (For Admin Dashboard) ───────────────────────────
// These must be defined BEFORE /:id to prevent routing conflicts
router.get('/registrations', verifyAdmin, tournamentController.getAllRegistrations);
router.patch('/registrations/:registrationId', verifyAdmin, tournamentController.updateRegistrationStatus);

// ── Public Routes ────────────────────────────────────────────────────────────
// Anyone can view tournaments and their results
router.get('/', tournamentController.getAllTournaments); 
router.get('/:id', tournamentController.getTournamentById);

// ── User Actions ─────────────────────────────────────────────────────────────
// Anyone can register for a tournament
router.post('/:id/register', tournamentController.registerForTournament);

// ── Admin CRUD & Results ─────────────────────────────────────────────────────
// Only Admin can create, edit, delete, or post results
router.post('/', verifyAdmin, tournamentController.createTournament);
router.put('/:id', verifyAdmin, tournamentController.updateTournament);
router.delete('/:id', verifyAdmin, tournamentController.deleteTournament);
router.post('/:id/results', verifyAdmin, tournamentController.addTournamentResult);

export default router;