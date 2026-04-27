import * as tournamentService from '../services/tournament.service.js';

export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(parseInt(req.params.id));
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTournament = async (req, res) => {
  try {
    const newTournament = await tournamentService.createTournament(req.body);
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tournament' });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await tournamentService.updateTournament(id, req.body);
    res.status(200).json({
      message: 'Tournament updated successfully',
      tournament: updated
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: 'Failed to update tournament.' });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    await tournamentService.deleteTournament(parseInt(req.params.id));
    res.status(200).json({ message: 'Tournament deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
};

// ── NEW: Handle User Registration from Public Page ──────────────────────────
export const registerForTournament = async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.id);
    const registration = await tournamentService.registerForTournament(tournamentId, req.body);
    res.status(201).json({
      message: 'Registration successful!',
      registration
    });
  } catch (error) {
    console.error('REGISTRATION_ERROR:', error);
    res.status(500).json({ error: 'Failed to register for tournament' });
  }
};

// ── NEW: Fetch All Registrations for Admin Dashboard ────────────────────────
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await tournamentService.getAllRegistrations();
    res.json(registrations || []);
  } catch (error) {
    console.error('FETCH_REGISTRATIONS_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch tournament registrations' });
  }
};

// ── NEW: Update Status (Confirm/Reject) from Admin Dashboard ────────────────
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;
    const updated = await tournamentService.updateRegistrationStatus(registrationId, status);
    res.json({ message: 'Status updated', registration: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

export const addTournamentResult = async (req, res) => {
  try {
    const result = await tournamentService.addTournamentResult(parseInt(req.params.id), req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add result' });
  }
};