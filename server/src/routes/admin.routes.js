import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Login to get the token
router.post('/login', adminController.loginAdmin);

// Public/Protected: Logout
router.post('/logout', adminController.logoutAdmin);

// Protected: Only an existing logged-in admin can create another admin
router.post('/register', adminController.registerAdmin);

// Protected: Get current admin profile
router.get('/me', verifyAdmin, adminController.getAdminProfile);

export default router;