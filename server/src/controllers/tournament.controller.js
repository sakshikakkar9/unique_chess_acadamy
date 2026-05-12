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

    // Check enrollment window
    const tournament = await tournamentService.getTournamentById(id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const now = new Date();
    if (tournament.regStartDate && now < new Date(tournament.regStartDate)) {
      return res.status(400).json({ error: "Registration has not started yet for this tournament." });
    }
    if (tournament.regEndDate) {
      const regEndDate = new Date(tournament.regEndDate);
      // Set to end of the day (23:59:59.999) to allow registration on the last day
      regEndDate.setHours(23, 59, 59, 999);
      if (now > regEndDate) {
        return res.status(400).json({ error: "Registration has been closed for this tournament." });
      }
    }
    
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
    let imageUrl = req.body.imageUrl;
    let brochureUrl = req.body.brochureUrl;

    if (req.files) {
      if (req.files['image']?.[0]) {
        imageUrl = await uploadToCloudinary(req.files['image'][0].buffer, "tournaments");
      }
      if (req.files['brochure']?.[0]) {
        brochureUrl = await uploadToCloudinary(req.files['brochure'][0].buffer, "brochures");
      }
    }

    const data = await tournamentService.createTournament({ ...req.body, imageUrl, brochureUrl });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ FIXED: Now actually updates a tournament
export const updateTournament = async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    let brochureUrl = req.body.brochureUrl;

    if (req.files) {
      if (req.files['image']?.[0]) {
        imageUrl = await uploadToCloudinary(req.files['image'][0].buffer, "tournaments");
      }
      if (req.files['brochure']?.[0]) {
        brochureUrl = await uploadToCloudinary(req.files['brochure'][0].buffer, "brochures");
      }
    }

    const data = await tournamentService.updateTournament(req.params.id, { ...req.body, imageUrl, brochureUrl });
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
      include: {
        tournament: { select: { title: true } },
        student: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status.toUpperCase();
    if (paymentStatus) updateData.paymentStatus = paymentStatus.toUpperCase();

    const data = await prisma.registration.update({
      where: { id: registrationId },
      data: updateData
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

export const updateTournamentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Only status updates via PATCH' });
    }

    const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'REJECTED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await prisma.tournament.update({
      where: { id: parseInt(id) },
      data: { status: status.toUpperCase() },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Update failed: ' + error.message });
  }
};

export const getRegistrationsByTournamentId = async (req, res) => {
  try {
    const { tournamentId } = req.query;
    if (!tournamentId) return res.status(400).json({ error: "tournamentId query parameter is required" });

    const registrations = await prisma.registration.findMany({
      where: { tournamentId: parseInt(tournamentId) },
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addTournamentResult = async (req, res) => res.status(200).json({ msg: "Result" });