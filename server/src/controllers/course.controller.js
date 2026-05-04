import * as courseService from '../services/course.service.js';

const VALID_AGE_GROUPS = ['CHILDREN', 'TEENAGERS', 'ADULTS'];
const VALID_ENROLLMENT_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED'];
import { uploadToCloudinary } from '../utils/cloudinary.js';
// ── Courses ───────────────────────────────────────────────────────────────────

export const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('GET_COURSES_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCoursesByAgeGroup = async (req, res) => {
  try {
    const ageGroup = req.params.ageGroup.toUpperCase();
    if (!VALID_AGE_GROUPS.includes(ageGroup)) {
      return res.status(400).json({ error: `ageGroup must be one of: ${VALID_AGE_GROUPS.join(', ')}` });
    }
    const courses = await courseService.getCoursesByAgeGroup(ageGroup);
    res.json(courses);
  } catch (error) {
    console.error('GET_COURSES_BY_AGE_GROUP_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch courses by age group' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('GET_COURSE_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, ageGroup, level, duration, price, fee, classTime, contactDetails, mode, days } = req.body;

    let imageUrl = '';
    let scannerUrl = '';

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        imageUrl = await uploadToCloudinary(req.files.image[0].buffer, "courses");
      }
      if (req.files.scanner && req.files.scanner[0]) {
        scannerUrl = await uploadToCloudinary(req.files.scanner[0].buffer, "courses");
      }
    }

    const mappedData = {
      title,
      ageGroup: ageGroup || 'CHILDREN',
      skillLevel: level ? level.toUpperCase() : 'BEGINNER',
      duration: duration || '',
      fee: fee || price,
      classTime: classTime || "TBD",
      contactDetails: contactDetails || "Unique Chess Academy",
      mode: mode || "ONLINE",
      days: days, 
      custom_banner_url: imageUrl,
      scannerUrl: scannerUrl,
    };

    const course = await courseService.createCourse(mappedData);
    res.status(201).json(course);
  } catch (error) {
    console.error('CREATE_CONTROLLER_ERROR:', error.message);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let imageUrl = undefined;
    let scannerUrl = undefined;

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        imageUrl = await uploadToCloudinary(req.files.image[0].buffer, "courses");
      }
      if (req.files.scanner && req.files.scanner[0]) {
        scannerUrl = await uploadToCloudinary(req.files.scanner[0].buffer, "courses");
      }
    }

    const updateData = {
      ...req.body,
      skillLevel: req.body.level ? req.body.level.toUpperCase() : undefined,
      fee: req.body.fee || req.body.price,
      custom_banner_url: imageUrl,
      scannerUrl: scannerUrl
    };

    const course = await courseService.updateCourse(id, updateData);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('DELETE_COURSE_ERROR:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

// ── Course Enrollments ────────────────────────────────────────────────────────

export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id; 

    const proofs = { ageProofUrl: null, paymentProofUrl: null };

    if (req.files) {
      if (req.files.ageProof && req.files.ageProof[0]) {
        proofs.ageProofUrl = await uploadToCloudinary(req.files.ageProof[0].buffer, "enrollments");
      }
      if (req.files.paymentProof && req.files.paymentProof[0]) {
        proofs.paymentProofUrl = await uploadToCloudinary(req.files.paymentProof[0].buffer, "enrollments");
      }
    }

    // 3. Validation: Ensure we actually got the URLs from Cloudinary
    if (!proofs.ageProofUrl || !proofs.paymentProofUrl) {
      return res.status(400).json({ 
        error: 'File upload failed. Please ensure Age Proof and Payment Proof are valid images.' 
      });
    }

    // 4. Calling the hardened service we created in the previous step
    const enrollment = await courseService.createEnrollment(courseId, req.body, proofs);
    
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    // This will now log the EXACT Prisma error in your Render console
    console.error('ENROLL_ERROR_LOG:', error.message); 
    res.status(500).json({ 
      error: 'Failed to enroll', 
      details: error.message // Sending this helps you see the error in the frontend console
    });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await courseService.getAllEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error('GET_ENROLLMENTS_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

export const updateEnrollmentStatus = async (req, res) => {
  try {
    const id = req.params.enrollmentId;
    const { status } = req.body;
    if (!VALID_ENROLLMENT_STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({ error: `status must be one of: ${VALID_ENROLLMENT_STATUSES.join(', ')}` });
    }
    const enrollment = await courseService.updateEnrollmentStatus(id, status.toUpperCase());
    res.json({ success: true, data: enrollment });
  } catch (error) {
    console.error('UPDATE_ENROLLMENT_STATUS_ERROR:', error);
    res.status(500).json({ error: 'Failed to update enrollment status' });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const id = req.params.enrollmentId;
    await courseService.deleteEnrollment(id);
    res.json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('DELETE_ENROLLMENT_ERROR:', error);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
};

export const uploadCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const imageUrl = `/uploads/courses/${req.file.filename}`;
    res.status(201).json({ 
      success: true,
      imageUrl: imageUrl 
    });
  } catch (error) {
    console.error('UPLOAD_COURSE_IMAGE_ERROR:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};