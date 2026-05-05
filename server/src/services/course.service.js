import prisma from '../../lib/prisma.js';

// --- Course Services ---

/**
 * Retrieves all courses ordered by creation date.
 */
export const getAllCourses = async () => {
  return await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Filters courses by age group.
 */
export const getCoursesByAgeGroup = async (ageGroup) => {
  return await prisma.course.findMany({
    where: { ageGroup },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Retrieves a single course by its CUID.
 */
export const getCourseById = async (id) => {
  return await prisma.course.findUnique({
    where: { id },
  });
};

/**
 * Creates a new course with strict type casting and Enum normalization.
 */
export const createCourse = async (data) => {
  // Handle days array parsing (supports JSON string or comma-separated string)
  let parsedDays = data.days;
  if (typeof data.days === 'string') {
    try { 
      parsedDays = JSON.parse(data.days); 
    } catch (e) { 
      parsedDays = data.days.split(',').map(f => f.trim()); 
    }
  }

  return await prisma.course.create({
    data: {
      title: data.title || "Untitled Course",
      description: data.description || null,
      ageGroup: data.ageGroup || 'ADULTS',
      // Force Uppercase to match Prisma SkillLevel Enum
      skillLevel: (data.skillLevel || "BEGINNER").toUpperCase().replace(/\s+/g, '_'),
      duration: data.duration || "N/A",
      custom_banner_url: data.custom_banner_url || null,
      // Ensure Float type for PostgreSQL
      fee: parseFloat(data.fee) || 0.0,
      days: Array.isArray(parsedDays) ? parsedDays : [],
      classTime: data.classTime || "TBD", 
      // Force Uppercase to match Prisma ClassMode Enum
      mode: (data.mode || "ONLINE").toUpperCase(),
      contactDetails: data.contactDetails || "Contact Academy Admin",
    },
  });
};

/**
 * Updates an existing course using a dynamic payload to prevent overwriting 
 * existing data with undefined/null.
 */
export const updateCourse = async (id, data) => {
  let parsedDays = data.days;
  if (data.days && typeof data.days === 'string') {
    try { 
      parsedDays = JSON.parse(data.days); 
    } catch (e) { 
      parsedDays = data.days.split(',').map(f => f.trim()); 
    }
  }

  // Constructing a clean update object
  const updatePayload = {};
  if (data.title) updatePayload.title = data.title;
  if (data.description !== undefined) updatePayload.description = data.description;
  if (data.ageGroup) updatePayload.ageGroup = data.ageGroup;
  if (data.skillLevel) updatePayload.skillLevel = data.skillLevel.toUpperCase().replace(/\s+/g, '_');
  if (data.duration) updatePayload.duration = data.duration;
  if (data.custom_banner_url) updatePayload.custom_banner_url = data.custom_banner_url;
  
  // Explicitly check for fee to allow updating to 0 but avoiding 'undefined'
  if (data.fee !== undefined && data.fee !== null) {
    updatePayload.fee = parseFloat(data.fee);
  }
  
  if (parsedDays) updatePayload.days = parsedDays;
  if (data.classTime) updatePayload.classTime = data.classTime;
  if (data.mode) updatePayload.mode = data.mode.toUpperCase();
  if (data.contactDetails) updatePayload.contactDetails = data.contactDetails;

  return await prisma.course.update({
    where: { id },
    data: updatePayload,
  });
};

/**
 * Deletes a course.
 */
export const deleteCourse = async (id) => {
  return await prisma.course.delete({ where: { id } });
};

// --- Enrollment Services ---

/**
 * Handles student enrollment into courses with file proof URLs.
 */
export const createEnrollment = async (courseId, data, proofs) => {
  const ageProofUrl = proofs?.ageProofUrl || "";
  const paymentProofUrl = proofs?.paymentProofUrl || "";

  // Robust Date parsing for PostgreSQL DateTime compatibility
  let formattedDob = null;
  if (data.dob && typeof data.dob === 'string' && data.dob.trim() !== "") {
    const parsedDate = new Date(data.dob);
    if (!isNaN(parsedDate.getTime())) {
      formattedDob = parsedDate;
    }
  }

  try {
    return await prisma.courseEnrollment.create({
      data: {
        courseId,
        studentName: data.studentName || "Unknown Student",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "Other",
        dob: formattedDob || new Date(),
        fideId: data.fideId || "NA",
        fideRating: parseInt(data.fideRating) || 0,
        address: data.address || "NA",
        discoverySource: data.discoverySource || "NA",
        category: data.category || "General",
        ageProofUrl: ageProofUrl,
        paymentProofUrl: paymentProofUrl,
        transactionId: data.transactionId || "",
        experienceLevel: (data.experienceLevel || data.skillLevel || "BEGINNER").toUpperCase().replace(/\s+/g, '_'),
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error("Prisma Enrollment Error:", error);
    throw new Error("Database insertion failed: " + error.message);
  }
};

/**
 * Fetches all enrollments including basic course details.
 */
export const getAllEnrollments = async () => {
  return await prisma.courseEnrollment.findMany({
    include: {
      course: {
        select: {
          title: true,
          ageGroup: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Updates the status or paymentStatus of an enrollment.
 */
export const updateEnrollment = async (id, data) => {
  const updateData = {};
  if (data.status) updateData.status = data.status;
  if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;

  return await prisma.courseEnrollment.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Deletes an enrollment record.
 */
export const deleteEnrollment = async (id) => {
  return await prisma.courseEnrollment.delete({
    where: { id },
  });
};