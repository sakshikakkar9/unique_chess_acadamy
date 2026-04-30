import express from 'express';
import * as demoController from '../controllers/demo.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Student demo signup
router.post('/register', demoController.createDemoRegistration);

// Admin: Get all demo requests
router.get('/admin/list', verifyAdmin, demoController.getAllDemoRegistrations);

// Admin: Update demo status
router.patch('/admin/:id', verifyAdmin, demoController.updateDemoStatus);

// Admin: Delete demo request
router.delete('/admin/:id', verifyAdmin, demoController.deleteDemoRegistration);

export default router;