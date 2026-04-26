import prisma from '../../lib/prisma.js';

export const createDemoRequest = async (data) => {
  const { studentName, email, phone, scheduledAt } = data;
  if (!studentName || !email || !phone || !scheduledAt) {
    throw new Error('studentName, email, phone, and scheduledAt are required.');
  }
  return await prisma.demoRegistration.create({
    data: {
      studentName,
      email,
      phone,
      scheduledAt: new Date(scheduledAt),
      status: 'PENDING',
    },
  });
};