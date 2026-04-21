import express from 'express';
import * as tournamentController from '../controllers/tournament.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Anyone can view tournaments and their results
router.get('/', tournamentController.getAllTournaments); 
router.get('/:id', tournamentController.getTournamentById);

// Protected: Only Admin can create, edit, delete, or post results
router.post('/', verifyAdmin, tournamentController.createTournament);
router.put('/:id', verifyAdmin, tournamentController.updateTournament);
router.delete('/:id', verifyAdmin, tournamentController.deleteTournament);
router.post('/:id/results', verifyAdmin, tournamentController.addTournamentResult);

export default router;