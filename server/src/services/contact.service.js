import prisma from '../../lib/prisma.js';

// export const createMessage = async (data) => {
//   return await prisma.contactMessage.create({ data });
// };
export const createMessage = async (data) => {
  return await prisma.contactMessage.create({ // Changed 'contact' to 'contactMessage'
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message, 
    },
  });
};

export const getAllMessages = async () => {
  return await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
};

export const markMessageAsRead = async (id) => {
  return await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
};

export const deleteMessage = async (id) => {
  return await prisma.contactMessage.delete({ where: { id } });
};