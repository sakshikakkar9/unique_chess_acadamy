import prisma from '../../lib/prisma.js';

export const getAllTournaments = async () => {
  return await prisma.tournament.findMany({ 
    include: { results: true }, // Results bhi saath mein bhej rahe hain
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
  // Convert ID and handle optional fields
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