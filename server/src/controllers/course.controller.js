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
    const course = await courseService.getCourseById(parseInt(req.params.id, 10));
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('GET_COURSE_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, ageGroup, level, duration, price, classTime, contactDetails, mode, days } = req.body;

    let imageUrl = '';
    if (req.file) {
      // Use your utility to upload the local path to Cloudinary
      imageUrl = await uploadToCloudinary(req.file.path, "courses");
    }

    const mappedData = {
      title,
      ageGroup: ageGroup || 'CHILDREN',
      skillLevel: level ? level.toUpperCase() : 'BEGINNER',
      duration: duration || '',
      fee: price,
      classTime: classTime || "TBD",
      contactDetails: contactDetails || "Unique Chess Academy",
      mode: mode || "ONLINE",
      days: days, 
      bannerUrl: imageUrl,
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

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path, "courses");
    }

    const updateData = {
      ...req.body,
      skillLevel: req.body.level ? req.body.level.toUpperCase() : undefined,
      fee: req.body.price,
      bannerUrl: imageUrl
    };

    const course = await courseService.updateCourse(id, updateData);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(parseInt(req.params.id, 10));
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

    if (req.files?.ageProof) {
      proofs.ageProofUrl = await uploadToCloudinary(req.files.ageProof[0].path, "enrollments");
    }
    if (req.files?.paymentProof) {
      proofs.paymentProofUrl = await uploadToCloudinary(req.files.paymentProof[0].path, "enrollments");
    }

    const enrollment = await courseService.createEnrollment(courseId, req.body, proofs);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    console.error('ENROLL_ERROR:', error);
    res.status(500).json({ error: 'Failed to enroll' });
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
    const id = parseInt(req.params.enrollmentId, 10);
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
    const id = parseInt(req.params.enrollmentId, 10);
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