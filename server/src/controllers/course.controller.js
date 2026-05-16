import prisma from '../../lib/prisma.js';
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
    console.error('GET_COURSES_ERROR_FULL:', error.stack || error);
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
    const { 
      title, description, ageGroup, skillLevel, classTime,
      duration, fee, days, contactDetails, mode, posterOrientation
    } = req.body;

    const courseData = {
      title,
      description,
      ageGroup,
      contactDetails,
      classTime,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      duration,
      // 1. Force Float for Fee with fallback
      fee: parseFloat(fee) || 0,
      // 2. Pass days as is (service handles string/array)
      days: days,
      // 3. Match Schema Enums (Upper Case)
      skillLevel: skillLevel ? skillLevel.toUpperCase() : "BEGINNER",
      mode: mode ? mode.toUpperCase() : "ONLINE",
      posterOrientation: posterOrientation || "LANDSCAPE",
      // 4. Image handling (checks both 'image' and 'banner' fields)
      custom_banner_url: (req.files?.image?.[0] || req.files?.banner?.[0])
        ? await uploadToCloudinary((req.files.image || req.files.banner)[0].buffer)
        : null,
      brochureUrl: req.files?.brochure?.[0]
        ? await uploadToCloudinary(req.files.brochure[0].buffer, "brochures")
        : null,
    };

    const newCourse = await courseService.createCourse(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updateData = {
      ...req.body,
      // Ensure numeric types (check for undefined to allow 0)
      fee: req.body.fee !== undefined ? parseFloat(req.body.fee) : undefined,
      // Ensure Enum types
      skillLevel: req.body.skillLevel ? req.body.skillLevel.toUpperCase() : undefined,
      mode: req.body.mode ? req.body.mode.toUpperCase() : undefined,
      // Pass raw days
      days: req.body.days,
      custom_banner_url: (req.files?.image?.[0] || req.files?.banner?.[0])
        ? await uploadToCloudinary((req.files.image || req.files.banner)[0].buffer)
        : undefined,
      brochureUrl: req.files?.brochure?.[0]
        ? await uploadToCloudinary(req.files.brochure[0].buffer, "brochures")
        : undefined,
    };

    // Clean up undefined so we don't accidentally overwrite with undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updated = await courseService.updateCourse(id, updateData);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

export const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // status can be null (restore) or a valid string
    const validValues = [
      null, 'completed', 'rejected', 'cancelled'
    ];
    if (!validValues.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    console.error('PATCH error:', error);
    res.status(500).json({ error: 'Update failed' });
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
    const courseId = req.query.courseId;
    const enrollments = await courseService.getAllEnrollments(courseId);
    res.json(enrollments);
  } catch (error) {
    console.error('GET_ENROLLMENTS_ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

export const updateEnrollmentStatus = async (req, res) => {
  try {
    const id = req.params.enrollmentId;
    const { status, paymentStatus } = req.body;

    if (status && !VALID_ENROLLMENT_STATUSES.includes(status.toUpperCase())) {
      return res.status(400).json({ error: `status must be one of: ${VALID_ENROLLMENT_STATUSES.join(', ')}` });
    }

    const enrollment = await courseService.updateEnrollment(id, {
      status: status ? status.toUpperCase() : undefined,
      paymentStatus: paymentStatus ? paymentStatus.toUpperCase() : undefined
    });
    res.json({ success: true, data: enrollment });
  } catch (error) {
    console.error('UPDATE_ENROLLMENT_ERROR:', error);
    res.status(500).json({ error: 'Failed to update enrollment' });
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
