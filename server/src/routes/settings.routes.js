import express from 'express';
import multer from 'multer';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getSettings);
router.patch('/', verifyAdmin, upload.fields([{ name: 'scanner', maxCount: 1 }]), updateSettings);

export default router;