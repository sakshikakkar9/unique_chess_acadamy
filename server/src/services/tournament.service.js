import prisma from '../../lib/prisma.js';

// --- GET ALL TOURNAMENTS ---
export const getAllTournaments = async () => {
  return await prisma.tournament.findMany({
    include: {
      results: true,
      _count: {
        select: { registrations: true }
      }
    },
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
    include: {
      results: { orderBy: { position: 'asc' } },
      _count: {
        select: { registrations: true }
      }
    },
  });
};

const parseDate = (date) => {
  if (!date || date === "null" || date === "undefined" || date === "") return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
};

const parseFloatSafe = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

const parseIntSafe = (val, fallback = 0) => {
  const parsed = parseInt(val);
  return isNaN(parsed) ? fallback : parsed;
};

// ✅ UPDATED: CREATE TOURNAMENT WITH NEW FIELDS
export const createTournament = async (data) => {
  return await prisma.tournament.create({
    data: {
      title: data.title,
      location: data.location,
      description: data.description || "",
      // Mapped new schema fields
      startDate: parseDate(data.startDate) || new Date(),
      endDate: parseDate(data.endDate),
      regStartDate: parseDate(data.regStartDate),
      regEndDate: parseDate(data.regEndDate),
      posterOrientation: data.posterOrientation || 'LANDSCAPE',
      category: data.category || null,
      totalPrizePool: data.totalPrizePool || null,
      discountDetails: data.discountDetails || null,
      brochureUrl: data.brochureUrl || null,
      otherDetails: data.otherDetails || null,
      contactDetails: data.contactDetails || null,
      status: data.status || 'UPCOMING',
      entryFee: parseFloatSafe(data.entryFee),
      imageUrl: data.imageUrl || null,
    }
  });
};

// ✅ UPDATED: UPDATE TOURNAMENT WITH NEW FIELDS
export const updateTournament = async (id, data) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) throw new Error("Invalid Tournament ID");

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
      entryFee: data.entryFee !== undefined ? parseFloatSafe(data.entryFee) : undefined,
      // Fixed field names for update logic
      startDate: (data.startDate !== undefined && data.startDate !== "") ? parseDate(data.startDate) : undefined,
      endDate: (data.endDate !== undefined && data.endDate !== "") ? parseDate(data.endDate) : undefined,
      regStartDate: (data.regStartDate !== undefined && data.regStartDate !== "") ? parseDate(data.regStartDate) : undefined,
      regEndDate: (data.regEndDate !== undefined && data.regEndDate !== "") ? parseDate(data.regEndDate) : undefined,
      posterOrientation: data.posterOrientation || undefined,
    }
  });
};

// --- DELETE TOURNAMENT (No changes needed) ---
export const deleteTournament = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) throw new Error("Invalid Tournament ID");
  return await prisma.tournament.delete({ where: { id: numericId } });
};

// --- HANDLE REGISTRATION ---
export const registerForTournament = async (tournamentId, registrationData) => {
  const id = parseInt(tournamentId);
  if (isNaN(id)) throw new Error("Invalid Tournament ID");

  return await prisma.$transaction(async (tx) => {
    // Smart Sync: Create or Update Student
    const student = await tx.student.upsert({
      where: { phone: registrationData.phone },
      update: {
        fullName: registrationData.studentName,
        gender: registrationData.gender,
        dob: parseDate(registrationData.dob) || new Date(),
        email: registrationData.email || null,
        address: registrationData.address,
        fideId: registrationData.fideId || "NA",
        fideRating: parseIntSafe(registrationData.fideRating),
        discoverySource: registrationData.discoverySource,
      },
      create: {
        fullName: registrationData.studentName,
        phone: registrationData.phone,
        gender: registrationData.gender,
        dob: parseDate(registrationData.dob) || new Date(),
        email: registrationData.email || null,
        address: registrationData.address,
        fideId: registrationData.fideId || "NA",
        fideRating: parseIntSafe(registrationData.fideRating),
        discoverySource: registrationData.discoverySource,
      }
    });

    return await tx.registration.create({
      data: {
        student: {
          connect: { id: student.id }
        },
        category: registrationData.category || null,
        transactionId: registrationData.transactionId || null,
        ageProofUrl: registrationData.ageProofUrl || "",
        paymentProofUrl: registrationData.paymentProofUrl || "",
        status: "PENDING",
        tournament: {
          connect: { id: id }
        }
      }
    });
  });
};