import prisma from '../../lib/prisma.js';

export const createDemoRegistration = async (data) => {
  return await prisma.demoRegistration.create({
    data: {
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      scheduledAt: new Date(data.scheduledAt),
      status: 'PENDING',
    },
  });
};

export const getAllDemoRegistrations = async () => {
  return await prisma.demoRegistration.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const updateDemoStatus = async (id, status) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) throw new Error("Invalid Demo ID");
  return await prisma.demoRegistration.update({
    where: { id: numericId },
    data: { status },
  });
};

export const deleteDemoRegistration = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) throw new Error("Invalid Demo ID");
  return await prisma.demoRegistration.delete({
    where: { id: numericId },
  });
};
