import prisma from '../../lib/prisma.js';

export const getGalleryImages = async (category) => {
  const whereClause = category ? { category: category.toUpperCase() } : {};
  return await prisma.gallery.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const addImage = async (data) => {
  return await prisma.gallery.create({ data });
};

export const deleteImage = async (id) => {
  return await prisma.gallery.delete({ where: { id } });
};