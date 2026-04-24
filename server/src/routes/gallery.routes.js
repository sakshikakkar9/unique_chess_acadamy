import express from 'express';
import multer from 'multer';
import path from 'path';
import * as galleryController from '../controllers/gallery.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. CONFIGURE STORAGE (This defines where and how files are saved)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This string 'uploads/' must match the folder name in your server root
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Creates a unique name: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. INITIALIZE MULTER (This creates the 'upload' variable you were missing)
const upload = multer({ storage: storage });

// 3. DEFINE ROUTES
router.get('/', galleryController.getGalleryImages);

// Now 'upload' is defined and will work!
router.post('/', verifyAdmin, upload.single('image'), galleryController.uploadImage);

router.delete('/:id', verifyAdmin, galleryController.deleteImage);

export default router;