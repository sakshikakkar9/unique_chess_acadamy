import express from 'express';
import * as eventController from '../controllers/event.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Anyone can view classes and workshops
router.get('/', eventController.getAllEvents);

// Protected: Only Admin can manage events
router.post('/', verifyAdmin, eventController.createEvent);
router.put('/:id', verifyAdmin, eventController.updateEvent);
router.delete('/:id', verifyAdmin, eventController.deleteEvent);

export default router;