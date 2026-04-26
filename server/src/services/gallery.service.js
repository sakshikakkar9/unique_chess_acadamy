import prisma from '../../lib/prisma.js';

export const getGalleryImages = async (category) => {
  // Ensure the category is uppercase if provided to match Prisma ENUMs
  const whereClause = category ? { category: category.toUpperCase() } : {};
  return await prisma.gallery.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const addImage = async (data) => {
  return await prisma.gallery.create({
    data: {
      imageUrl: data.imageUrl,
      caption: data.caption,
      // Force uppercase to prevent "Invalid Enum Value" errors
      category: data.category.toUpperCase(), 
    }
  });
};

export const deleteImage = async (id) => {
  return await prisma.gallery.delete({ where: { id } });
};