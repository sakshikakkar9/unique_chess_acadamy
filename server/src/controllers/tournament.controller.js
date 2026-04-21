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
    const updated = await tournamentService.updateTournament(parseInt(req.params.id), req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tournament' });
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

export const addTournamentResult = async (req, res) => {
  try {
    const result = await tournamentService.addTournamentResult(parseInt(req.params.id), req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add result' });
  }
};