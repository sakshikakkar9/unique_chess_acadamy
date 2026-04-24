import prisma from '../../lib/prisma.js';
import * as galleryService from '../services/gallery.service.js';

export const getGalleryImages = async (req, res) => {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(images);
  } catch (error) {
    console.error("GET_GALLERY_ERROR:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    // Check terminal for this log to confirm Multer saved the file
    console.log("SUCCESS: File saved by Multer:", req.file); 
    
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const { caption, category } = req.body;

    const newImage = await prisma.gallery.create({
      data: {
        imageUrl: `/uploads/${req.file.filename}`,
        caption: caption || "",
        category: (category || "ACADEMY").toUpperCase(),
      },
    });

    console.log("SUCCESS: Saved to Database:", newImage);
    return res.status(201).json(newImage);
  } catch (error) {
    // If you see this in terminal, your Prisma Schema fields might not match
    console.error("PRISMA_DATABASE_ERROR:", error); 
    return res.status(500).json({ error: "Failed to save image to database" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use the ID directly as a string (UUID) instead of parseInt
    await prisma.gallery.delete({
      where: { id: id }
    });
    
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};