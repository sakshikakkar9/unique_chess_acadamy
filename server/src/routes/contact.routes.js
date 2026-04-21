import express from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Anyone can submit a contact form
router.post('/', contactController.submitMessage);

// Protected: Only Admin can read, manage, or delete messages
router.get('/', verifyAdmin, contactController.getAllMessages);
router.patch('/:id/read', verifyAdmin, contactController.markAsRead);
router.delete('/:id', verifyAdmin, contactController.deleteMessage);

export default router;