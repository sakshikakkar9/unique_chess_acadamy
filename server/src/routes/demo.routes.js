import express from 'express';
import { handleDemoSignup } from '../controllers/demo.controller.js';

const router = express.Router();
router.post('/register', handleDemoSignup);
export default router;