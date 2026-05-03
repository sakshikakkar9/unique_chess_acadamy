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
  // 1. Safety check for proofs object to prevent "cannot read property of undefined"
  const ageProofUrl = proofs?.ageProofUrl || "";
  const paymentProofUrl = proofs?.paymentProofUrl || "";

  // 2. Robust Date parsing to prevent "Invalid Date" crash
  let formattedDob = null;
  if (data.dob && data.dob.trim() !== "") {
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
        dob: formattedDob,
        fideId: data.fideId || "NA",
        category: data.category || "General",
        // Ensure mode matches your enum (ONLINE/OFFLINE)
        mode: (data.mode || "OFFLINE").toUpperCase(), 
        message: data.message || "",
        ageProof: ageProofUrl,
        paymentProof: paymentProofUrl,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error("Prisma Enrollment Error:", error);
    throw new Error("Database insertion failed: " + error.message);
  }
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