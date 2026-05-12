import prisma from '../../lib/prisma.js';

export const createMessage = async (data) => {
  return await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      message: data.message,
      status: 'unread'
    },
  });
};

export const getAllMessages = async () => {
  return await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
};

export const markMessageAsRead = async (id) => {
  return await prisma.contactMessage.update({
    where: { id },
    data: { status: 'read' },
  });
};

export const deleteMessage = async (id) => {
  return await prisma.contactMessage.delete({ where: { id } });
};