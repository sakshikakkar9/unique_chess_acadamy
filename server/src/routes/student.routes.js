import express from 'express';
import { verifyAdmin } from '../middleware/auth.middleware.js';
import * as studentController from '../controllers/student.controller.js';

const router = express.Router();

router.get('/', verifyAdmin, studentController.getAllStudents);
router.get('/:id', verifyAdmin, studentController.getStudentById);
router.post('/', verifyAdmin, studentController.createStudent);
router.patch('/:id', verifyAdmin, studentController.updateStudent);
router.delete('/:id', verifyAdmin, studentController.deleteStudent);

export default router;
