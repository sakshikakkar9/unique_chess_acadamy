import prisma from '../../lib/prisma.js';

export const getAllEvents = async (category) => {
  const whereClause = category ? { category: category.toUpperCase() } : {};
  return await prisma.event.findMany({
    where: whereClause,
    orderBy: { date: 'asc' },
  });
};

export const createEvent = async (data) => {
  return await prisma.event.create({ data });
};

export const updateEvent = async (id, data) => {
  return await prisma.event.update({ where: { id }, data });
};

export const deleteEvent = async (id) => {
  return await prisma.event.delete({ where: { id } });
};