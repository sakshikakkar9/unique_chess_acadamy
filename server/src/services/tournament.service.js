import prisma from '../../lib/prisma.js';

// --- GET ALL TOURNAMENTS ---
export const getAllTournaments = async () => {
  return await prisma.tournament.findMany({
    include: { results: true },
    orderBy: { date: 'asc' },
  });
};

// --- GET SINGLE TOURNAMENT ---
export const getTournamentById = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) return null;
  return await prisma.tournament.findUnique({
    where: { id: numericId },
    include: { results: { orderBy: { position: 'asc' } } },
  });
};

// ✅ ADDED: CREATE TOURNAMENT
export const createTournament = async (data) => {
  return await prisma.tournament.create({
    data: {
      title: data.title,
      location: data.location,
      date: new Date(data.date), // Ensure it's a valid Date object
      status: data.status || 'UPCOMING',
      entryFee: parseFloat(data.entryFee || 0),
      description: data.description || "",
    }
  });
};

// ✅ ADDED: UPDATE TOURNAMENT
export const updateTournament = async (id, data) => {
  const numericId = parseInt(id);
  return await prisma.tournament.update({
    where: { id: numericId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      entryFee: data.entryFee ? parseFloat(data.entryFee) : undefined,
    }
  });
};

// ✅ ADDED: DELETE TOURNAMENT
export const deleteTournament = async (id) => {
  const numericId = parseInt(id);
  return await prisma.tournament.delete({
    where: { id: numericId }
  });
};

// --- HANDLE REGISTRATION ---
export const registerForTournament = async (tournamentId, data) => {
  const numericTournamentId = parseInt(tournamentId);
  if (isNaN(numericTournamentId)) throw new Error("Invalid Tournament ID");

  return await prisma.registration.create({
    data: {
      studentName: data.studentName || "Guest Player",
      email: data.email && data.email.trim() !== "" ? data.email : null,
      phone: String(data.phone || data.contact || "0000000000"),
      fideId: data.fideId || null,
      transactionId: data.transactionId || "OFFLINE_PENDING",
      status: 'PENDING',
      tournament: {
        connect: { id: numericTournamentId }
      }
    }
  });
};