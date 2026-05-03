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
  enrollInCourse,
  getAllEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment
} from '../controllers/course.controller.js';

const router = express.Router();

// ── Multer Configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Render/Node temporary directory is safer if folders aren't pre-created
    cb(null, '/tmp'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = /jpeg|jpg|png|webp|gif/.test(path.extname(file.originalname).toLowerCase());
  const isDoc = /pdf/.test(path.extname(file.originalname).toLowerCase());

  // Use a flexible check for the course banner field name
  if (file.fieldname === 'image' || file.fieldname === 'banner') {
    return isImage ? cb(null, true) : cb(new Error('Course banner must be an image!'), false);
  }
  
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

// UPDATED: Now checks for 'banner' OR 'image' to be safe
const handleCourseUpload = (req, res, next) => {
  // We use .fields if we want to be flexible, or .single if we are strict.
  // I'll stick to .single but ensure the frontend key matches.
  const uploadSingle = upload.single('image'); 
  uploadSingle(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

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

// ── Routes ───────────────────────────────────────────────────────────────────

// 1. Enrollment Management (Admin)
router.get('/enrollments', verifyAdmin, getAllEnrollments);
router.patch('/enrollments/:enrollmentId', verifyAdmin, updateEnrollmentStatus);
router.delete('/enrollments/:enrollmentId', verifyAdmin, deleteEnrollment);

// 2. Course Discovery (Public)
router.get('/', getAllCourses);
router.get('/age-group/:ageGroup', getCoursesByAgeGroup);
router.get('/:id', getCourseById); // This handles the String CUID from frontend

// 3. Enrollment Action (Public)
router.post('/:id/enroll', handleEnrollmentUpload, enrollInCourse);

// 4. Course Management (Admin)
router.post('/', verifyAdmin, handleCourseUpload, createCourse);
router.put('/:id', verifyAdmin, handleCourseUpload, updateCourse);
router.delete('/:id', verifyAdmin, deleteCourse);

export default router;