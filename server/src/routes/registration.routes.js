import express from 'express';
import { verifyAdmin } from '../middleware/auth.middleware.js';
import {
  createRegistration,
  createDemoRegistration,
  getAllRegistrations,
  getAllDemoRegistrations,
  updateDemoStatus,
} from '../controllers/registrationController.js';

const router = express.Router();

// Public: Student tournament/course enrollment
router.post('/register', createRegistration);

// Public: Free demo class signup
router.post('/demo', createDemoRegistration);

// Admin: Get all course/tournament enrollments
router.get('/admin/list', verifyAdmin, getAllRegistrations);

// Admin: Get all demo requests
router.get('/admin/demos', verifyAdmin, getAllDemoRegistrations);

// Admin: Update demo status (PENDING → CONFIRMED → COMPLETED)
router.patch('/admin/demo/:id', verifyAdmin, updateDemoStatus);

export default router;
