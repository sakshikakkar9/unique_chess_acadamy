import prisma from '../../lib/prisma.js';

export const createDemoRequest = async (data) => {
  return await prisma.demoRegistration.create({ data });
};