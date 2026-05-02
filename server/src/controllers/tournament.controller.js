import prisma from '../../lib/prisma.js'; 
import * as tournamentService from '../services/tournament.service.js';

// --- Public Functions ---
export const getAllTournaments = async (req, res) => {
  try {
    const data = await tournamentService.getAllTournaments();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const data = await tournamentService.getTournamentById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerForTournament = async (req, res) => {
  try {
    // 1. Prepare data for the service
    // Text fields are in req.body. File info is in req.files (from Multer)
    const registrationData = {
      ...req.body,
      // Pass file identifiers or temporary paths if you aren't using a cloud provider yet
      ageProofUrl: req.files?.['ageProof']?.[0]?.originalname || "pending_upload",
      paymentProofUrl: req.files?.['paymentProof']?.[0]?.originalname || "pending_upload"
    };

    const data = await tournamentService.registerForTournament(req.params.id, registrationData);
    res.status(201).json(data);
  } catch (error) {
    console.error("Prisma Error Details:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- Admin Tournament Announcement Management ---

// ✅ FIXED: Now actually creates a tournament
export const createTournament = async (req, res) => {
  try {
    const data = await tournamentService.createTournament(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ FIXED: Now actually updates a tournament
export const updateTournament = async (req, res) => {
  try {
    const data = await tournamentService.updateTournament(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ FIXED: Now actually deletes a tournament
export const deleteTournament = async (req, res) => {
  try {
    await tournamentService.deleteTournament(req.params.id);
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Admin Student Registration Management ---
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: { tournament: { select: { title: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
};

export const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;
    const data = await prisma.registration.update({
      where: { id: registrationId },
      data: { status: status.toUpperCase() }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    await prisma.registration.delete({ where: { id: registrationId } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const addTournamentResult = async (req, res) => res.status(200).json({ msg: "Result" });