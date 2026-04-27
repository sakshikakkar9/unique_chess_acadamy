import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyAdmin } from '../middleware/auth.middleware.js';
import {
  getAllCourses,
  getCoursesByAgeGroup,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage,
  enrollInCourse,
  getAllEnrollments,
  updateEnrollmentStatus,
} from '../controllers/course.controller.js';

const router = express.Router();

// ── Multer Configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Unique filenames prevent cache issues and overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, webp) are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to handle Multer errors gracefully
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');
  
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// ── Enrollment Management (For Admin Dashboard) ──────────────────────────────
// These must be ABOVE the /:id route
router.get('/enrollments', verifyAdmin, getAllEnrollments);
router.patch('/enrollments/:enrollmentId', verifyAdmin, updateEnrollmentStatus);

// ── Course Discovery & Public Routes ─────────────────────────────────────────
router.get('/', getAllCourses);
router.get('/age-group/:ageGroup', getCoursesByAgeGroup);
router.get('/:id', getCourseById);
router.post('/:id/enroll', enrollInCourse);

// ── Admin Course CRUD ────────────────────────────────────────────────────────
router.post('/upload-image', verifyAdmin, handleUpload, uploadCourseImage);
router.post('/', verifyAdmin, createCourse);
router.put('/:id', verifyAdmin, updateCourse);
router.delete('/:id', verifyAdmin, deleteCourse);

export default router;