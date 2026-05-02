import prisma from '../../lib/prisma.js';

// --- GET ALL TOURNAMENTS ---
export const getAllTournaments = async () => {
  return await prisma.tournament.findMany({
    include: { results: true },
    // Changed 'date' to 'startDate' to match your new schema
    orderBy: { startDate: 'asc' },
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

// ✅ UPDATED: CREATE TOURNAMENT WITH NEW FIELDS
export const createTournament = async (data) => {
  return await prisma.tournament.create({
    data: {
      title: data.title,
      location: data.location,
      description: data.description || "",
      // Mapped new schema fields
      startDate: new Date(data.startDate), 
      endDate: data.endDate ? new Date(data.endDate) : null,
      category: data.category || null,
      totalPrizePool: data.totalPrizePool || null,
      discountDetails: data.discountDetails || null,
      brochureUrl: data.brochureUrl || null,
      otherDetails: data.otherDetails || null,
      contactDetails: data.contactDetails || null,
      status: data.status || 'UPCOMING',
      entryFee: parseFloat(data.entryFee || 0),
      imageUrl: data.imageUrl || null,
    }
  });
};

// ✅ UPDATED: UPDATE TOURNAMENT WITH NEW FIELDS
export const updateTournament = async (id, data) => {
  const numericId = parseInt(id);
  return await prisma.tournament.update({
    where: { id: numericId },
    data: {
      title: data.title,
      location: data.location,
      description: data.description,
      status: data.status,
      imageUrl: data.imageUrl,
      category: data.category,
      totalPrizePool: data.totalPrizePool,
      discountDetails: data.discountDetails,
      brochureUrl: data.brochureUrl,
      otherDetails: data.otherDetails,
      contactDetails: data.contactDetails,
      entryFee: data.entryFee ? parseFloat(data.entryFee) : undefined,
      // Fixed field names for update logic
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : null,
    }
  });
};

// --- DELETE TOURNAMENT (No changes needed) ---
export const deleteTournament = async (id) => {
  const numericId = parseInt(id);
  return await prisma.tournament.delete({ where: { id: numericId } });
};

// --- HANDLE REGISTRATION (No changes needed) ---
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