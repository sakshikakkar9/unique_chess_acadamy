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
  deleteEnrollment
} from '../controllers/course.controller.js';

const router = express.Router();

// ── Multer Configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Separate folders for courses vs student docs for better organization
    const folder = file.fieldname === 'image' ? 'uploads/courses/' : 'uploads/enrollments/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Allow PDFs and Images for proofs, but only images for course banners
  const isImage = /jpeg|jpg|png|webp|gif/.test(path.extname(file.originalname).toLowerCase());
  const isDoc = /pdf/.test(path.extname(file.originalname).toLowerCase());

  if (file.fieldname === 'image') {
    return isImage ? cb(null, true) : cb(new Error('Course banner must be an image!'), false);
  }
  
  // For enrollments (ageProof/paymentProof), allow images and PDFs
  if (isImage || isDoc) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed for documents!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ── Specialized Middlewares ──────────────────────────────────────────────────

// Handles Course Banner (Single Image)
const handleCourseUpload = (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

// Handles Enrollment Proofs (Multiple Files)
const handleEnrollmentUpload = (req, res, next) => {
  const uploadFields = upload.fields([
    { name: 'ageProof', maxCount: 1 },
    { name: 'paymentProof', maxCount: 1 }
  ]);

  uploadFields(req, res, (err) => {
    if (err) return res.status(400).json({ error: `Document upload error: ${err.message}` });
    next();
  });
};

// ── Enrollment Management (Admin) ─────────────────────────────────────────────
router.get('/enrollments', verifyAdmin, getAllEnrollments);
router.patch('/enrollments/:enrollmentId', verifyAdmin, updateEnrollmentStatus);
router.delete('/enrollments/:enrollmentId', verifyAdmin, deleteEnrollment);

// ── Course Discovery & Public Routes ─────────────────────────────────────────
router.get('/', getAllCourses);
router.get('/age-group/:ageGroup', getCoursesByAgeGroup);
router.get('/:id', getCourseById);

// Update: Public Enrollment route now handles files
router.post('/:id/enroll', handleEnrollmentUpload, enrollInCourse);

// ── Admin Course CRUD ────────────────────────────────────────────────────────
// We use handleCourseUpload for POST and PUT so the image is processed alongside the data
router.post('/', verifyAdmin, handleCourseUpload, createCourse);
router.put('/:id', verifyAdmin, handleCourseUpload, updateCourse);
router.delete('/:id', verifyAdmin, deleteCourse);

// Legacy/Secondary endpoint
router.post('/upload-image', verifyAdmin, handleCourseUpload, uploadCourseImage);

export default router;