import express from 'express';
import * as tournamentController from '../controllers/tournament.controller.js';

const router = express.Router();

// --- Public ---
router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.post('/:id/register', tournamentController.registerForTournament);

// --- Admin (Student Management) ---
router.get('/admin/registrations/all', tournamentController.getAllRegistrations);
router.patch('/admin/registrations/:registrationId', tournamentController.updateRegistrationStatus);
router.delete('/admin/registrations/:registrationId', tournamentController.deleteRegistration);

// --- Admin (Tournament Management) ---
router.post('/admin/create', tournamentController.createTournament);
router.put('/admin/update/:id', tournamentController.updateTournament);
router.delete('/admin/delete/:id', tournamentController.deleteTournament);

export default router;