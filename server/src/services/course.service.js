import prisma from '../../lib/prisma.js';

// --- Course Services ---

export const getAllCourses = async () => {
  return await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getCoursesByAgeGroup = async (ageGroup) => {
  return await prisma.course.findMany({
    where: { ageGroup },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCourseById = async (id) => {
  return await prisma.course.findUnique({
    where: { id },
  });
};

export const createCourse = async (data) => {
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
      ageGroup: data.ageGroup || 'ADULTS',
      skillLevel: data.skillLevel || "BEGINNER",
      duration: data.duration || "N/A",
      bannerUrl: data.bannerUrl || "",
      fee: parseFloat(data.fee) || 0,
      days: Array.isArray(parsedDays) ? parsedDays : [],
      classTime: data.classTime || "TBD", 
      mode: data.mode || "ONLINE",
      contactDetails: data.contactDetails || "Contact Academy Admin",
    },
  });
};

export const updateCourse = async (id, data) => {
  let parsedDays = data.days;
  if (data.days && typeof data.days === 'string') {
    try { parsedDays = JSON.parse(data.days); } 
    catch (e) { parsedDays = data.days.split(',').map(f => f.trim()); }
  }

  return await prisma.course.update({
    where: { id },
    data: {
      title: data.title,
      ageGroup: data.ageGroup,
      skillLevel: data.skillLevel, 
      duration: data.duration,
      bannerUrl: data.bannerUrl, 
      fee: data.fee ? parseFloat(data.fee) : undefined,
      days: Array.isArray(parsedDays) ? parsedDays : undefined,
      classTime: data.classTime,
      mode: data.mode,
      contactDetails: data.contactDetails,
    },
  });
};

export const deleteCourse = async (id) => {
  return await prisma.course.delete({ where: { id } });
};

// --- Enrollment Services (FIXED: Only One Export) ---

export const createEnrollment = async (courseId, data, proofs) => {
  return await prisma.courseEnrollment.create({
    data: {
      courseId,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dob: data.dob ? new Date(data.dob) : null,
      fideId: data.fideId || "NA",
      category: data.category || "General",
      mode: data.mode || "OFFLINE",
      message: data.message || "",
      // Aligning these with your Prisma schema field names
      ageProof: proofs.ageProofUrl || "",
      paymentProof: proofs.paymentProofUrl || "",
      status: 'PENDING',
    },
  });
};

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

export const updateEnrollmentStatus = async (id, status) => {
  return await prisma.courseEnrollment.update({
    where: { id },
    data: { status },
  });
};

export const deleteEnrollment = async (id) => {
  return await prisma.courseEnrollment.delete({
    where: { id },
  });
};