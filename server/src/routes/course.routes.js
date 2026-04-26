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

// ── Multer (image upload) ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ── Static routes (must be before /:id) ──────────────────────────────────────
router.get('/age-group/:ageGroup', getCoursesByAgeGroup);
router.get('/enrollments', verifyAdmin, getAllEnrollments);
router.patch('/enrollments/:enrollmentId', verifyAdmin, updateEnrollmentStatus);
router.post('/upload-image', verifyAdmin, upload.single('image'), uploadCourseImage);

// ── Dynamic routes ────────────────────────────────────────────────────────────
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/:id/enroll', enrollInCourse);

// ── Admin CRUD ────────────────────────────────────────────────────────────────
router.post('/', verifyAdmin, createCourse);
router.put('/:id', verifyAdmin, updateCourse);
router.delete('/:id', verifyAdmin, deleteCourse);

export default router;
