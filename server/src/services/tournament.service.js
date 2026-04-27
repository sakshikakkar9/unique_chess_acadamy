import prisma from '../../lib/prisma.js';

export const getAllTournaments = async () => {
  return await prisma.tournament.findMany({ 
    include: { results: true }, 
    orderBy: { date: 'asc' } 
  });
};

export const getTournamentById = async (id) => {
  return await prisma.tournament.findUnique({
    where: { id },
    include: { results: { orderBy: { position: 'asc' } } }
  });
};

export const createTournament = async (data) => {
  return await prisma.tournament.create({ data });
};

export const updateTournament = async (id, data) => {
  const formattedData = { ...data };
  if (formattedData.date) formattedData.date = new Date(formattedData.date);
  
  return await prisma.tournament.update({
    where: { id: parseInt(id) },
    data: formattedData,
  });
};

export const deleteTournament = async (id) => {
  return await prisma.tournament.delete({ where: { id } });
};

// ── NEW: Handle Public Registration ──────────────────────────────────────────
export const registerForTournament = async (tournamentId, data) => {
  return await prisma.registration.create({
    data: {
      // Use logical OR (||) to catch different naming conventions from frontend
      studentName: data.studentName || data.fullName || data.name,
      email: data.email || "not-provided@example.com", 
      phone: data.phone || data.phoneNumber || "",
      tournamentId: parseInt(tournamentId),
      status: 'PENDING'
    }
  });
};

export const addTournamentResult = async (tournamentId, resultData) => {
  return await prisma.tournamentResult.create({
    data: {
      tournamentId,
      position: parseInt(resultData.position),
      playerName: resultData.playerName,
      score: parseFloat(resultData.score),
      prize: resultData.prize
    }
  });
};

export const getAllRegistrations = async () => {
  return await prisma.registration.findMany({
    include: {
      tournament: {
        select: {
          title: true, 
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateRegistrationStatus = async (id, status) => {
  return await prisma.registration.update({
    where: { id },
    data: { status },
  });
};