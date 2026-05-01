import prisma from '../../lib/prisma.js';
import { uploadToCloudinary } from '../utils/cloudinary.js'; // Import your new utility

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
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const { caption, category } = req.body;

    // 1. Upload the file from the local 'uploads' folder to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file.path);

    if (!cloudinaryUrl) {
      return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
    }

    // 2. Save the Cloudinary URL (https://...) to the database
    const newImage = await prisma.gallery.create({
      data: {
        imageUrl: cloudinaryUrl, // This is now a full https link
        caption: caption || "",
        category: (category || "ACADEMY").toUpperCase(),
      },
    });

    console.log("SUCCESS: Saved to Database with Cloudinary URL:", newImage);
    return res.status(201).json(newImage);
  } catch (error) {
    console.error("UPLOAD_CONTROLLER_ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.gallery.delete({
      where: { id: id }
    });
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("DELETE_ERROR:", error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};