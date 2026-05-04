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
      entryFee: data.entryFee !== undefined ? parseFloat(data.entryFee) : undefined,
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
export const registerForTournament = async (tournamentId, registrationData) => {
  const id = parseInt(tournamentId);
  if (isNaN(id)) throw new Error("Invalid Tournament ID");

  return await prisma.registration.create({
    data: {
      studentName: registrationData.studentName,
      gender: registrationData.gender,
      dob: new Date(registrationData.dob),
      phone: registrationData.phone,
      email: registrationData.email || null,
      address: registrationData.address,
      fideId: registrationData.fideId || "NA",
      // Convert to Number to satisfy Prisma's Int requirement
      fideRating: parseInt(registrationData.fideRating) || 0,
      discoverySource: registrationData.discoverySource,
      category: registrationData.category || null,
      transactionId: registrationData.transactionId || null,
      
      // ✅ MATCHING YOUR SCHEMA VERBATIM
      ageProofUrl: registrationData.ageProofUrl || "", 
      paymentProofUrl: registrationData.paymentProofUrl || "",
      
      status: "PENDING",
      tournament: {
        connect: { id: id }
      }
    }
  });
};