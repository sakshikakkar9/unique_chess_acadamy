import prisma from '../../lib/prisma.js'; 
import * as tournamentService from '../services/tournament.service.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
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
    const { id } = req.params;
    
    const ageProofFile = req.files?.['ageProof']?.[0];
    const paymentProofFile = req.files?.['paymentProof']?.[0];

    if (!ageProofFile || !paymentProofFile) {
      return res.status(400).json({ error: "Both Age Proof and Payment Proof are required." });
    }

    // FIX: Use .buffer instead of .path for MemoryStorage
    const ageProofUrl = await uploadToCloudinary(ageProofFile.buffer);
    const paymentProofUrl = await uploadToCloudinary(paymentProofFile.buffer);

    if (!ageProofUrl || !paymentProofUrl) {
      throw new Error("Failed to upload documents to Cloudinary");
    }

    const registrationData = {
      ...req.body,
      ageProofUrl,
      paymentProofUrl
    };

    const data = await tournamentService.registerForTournament(id, registrationData);
    res.status(201).json(data);
  } catch (error) {
    console.error("Registration Error:", error);
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