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
  updateEnrollmentStatus, // Matches the renamed function in your controller
  deleteEnrollment
} from '../controllers/course.controller.js';

const router = express.Router();

// ── Multer Configuration ─────────────────────────────────────────────────────
const storage = multer.memoryStorage();

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
  const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]);

  uploadFields(req, res, (err) => {
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

// FIXED: Changed updateEnrollment to updateEnrollmentStatus to match import/controller
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
