import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as contactController from '../controllers/contact.controller.js';
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

// Protected: Contact Messages
router.get('/messages', verifyAdmin, contactController.getAllMessages);
router.delete('/messages/:id', verifyAdmin, contactController.deleteMessage);
router.patch('/messages/:id/read', verifyAdmin, contactController.markAsRead);

export default router;