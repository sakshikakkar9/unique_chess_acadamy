import prisma from '../../lib/prisma.js';

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
    where: { id }, // id is a CUID string
  });
};

export const createCourse = async (data) => {
  // Logic: Ensure 'days' is a proper array for Prisma
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

export const createEnrollment = async (courseId, data, proofs) => {
  return await prisma.courseEnrollment.create({
    data: {
      courseId,
      studentName: data.studentName,
      gender: data.gender,
      category: data.category || "General",
      dob: data.dob ? new Date(data.dob) : new Date(),
      email: data.email,
      phone: data.phone,
      address: data.address || "N/A",
      fideId: data.fideId || "NA",
      fideRating: parseInt(data.fideRating, 10) || 0,
      ageProofUrl: proofs.ageProofUrl || "",
      paymentProofUrl: proofs.paymentProofUrl || "",
      discoverySource: data.discoverySource || "Website",
      status: 'PENDING',
    },
  });
};

// --- Updated Enrollments ---
export const createEnrollment = async (courseId, data, proofs) => {
  return await prisma.courseEnrollment.create({
    data: {
      courseId,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dob: data.dob ? new Date(data.dob) : null,
      fideId: data.fideId,
      category: data.category,
      mode: data.mode || "OFFLINE",
      message: data.message,
      // Use the URLs from the 'proofs' object we created in the controller
      ageProof: proofs.ageProofUrl,
      paymentProof: proofs.paymentProofUrl,
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