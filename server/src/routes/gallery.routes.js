import express from 'express';
import * as galleryController from '../controllers/gallery.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Anyone can view the gallery
router.get('/', galleryController.getGalleryImages);

// Protected: Only Admin can upload or delete images
router.post('/', verifyAdmin, galleryController.uploadImage);
router.delete('/:id', verifyAdmin, galleryController.deleteImage);

export default router;