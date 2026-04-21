import prisma from '../../lib/prisma.js';

export const getAllTournaments = async () => {
  return await prisma.tournament.findMany({ orderBy: { date: 'asc' } });
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
  return await prisma.tournament.update({ where: { id }, data });
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