import * as galleryService from '../services/gallery.service.js';

export const getGalleryImages = async (req, res) => {
  try {
    const images = await galleryService.getGalleryImages(req.query.category);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const newImage = await galleryService.addImage(req.body);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save image record' });
  }
};

export const deleteImage = async (req, res) => {
  try {
    await galleryService.deleteImage(parseInt(req.params.id));
    res.status(200).json({ message: 'Image deleted from database' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
};