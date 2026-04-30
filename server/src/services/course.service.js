// IMPORT the shared instance, DO NOT create a new one here
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
    where: { id },
  });
};

export const createCourse = async (data) => {
  // Check your terminal for this log! It will show if fields are missing.
  console.log("Incoming Course Data:", data);

  try {
    return await prisma.course.create({
      data: {
        title: data.title || "Untitled Course",
        // CRITICAL: Ensure ageGroup is Uppercase to match Prisma Enum
        ageGroup: data.ageGroup ? data.ageGroup.toUpperCase() : 'ADULTS',
        minAge: data.minAge && data.minAge !== "" ? parseInt(data.minAge, 10) : null,
        maxAge: data.maxAge && data.maxAge !== "" ? parseInt(data.maxAge, 10) : null,
        level: data.level || "Beginner",
        duration: data.duration || "N/A",
        description: data.description || "",
        image: data.image || "", 
        price: data.price ? data.price.toString() : "0",
        // Ensure features is always an array
        features: Array.isArray(data.features) ? data.features : (data.features ? [data.features] : []),
      },
    });
  } catch (error) {
    console.error("CREATE_COURSE_PRISMA_ERROR:", error);
    throw error; // Rethrow so the controller catches it
  }
};

export const updateCourse = async (id, data) => {
  try {
    return await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        ageGroup: data.ageGroup ? data.ageGroup.toUpperCase() : undefined,
        minAge: data.minAge && data.minAge !== "" ? parseInt(data.minAge, 10) : null,
        maxAge: data.maxAge && data.maxAge !== "" ? parseInt(data.maxAge, 10) : null,
        level: data.level,
        duration: data.duration,
        description: data.description,
        image: data.image,
        price: data.price ? data.price.toString() : '',
        features: Array.isArray(data.features) ? data.features : (data.features ? [data.features] : []),
      },
    });
  } catch (error) {
    console.error("UPDATE_COURSE_PRISMA_ERROR:", error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  return await prisma.course.delete({
    where: { id },
  });
};

// --- Enrollments ---
export const createEnrollment = async (courseId, data) => {
  return await prisma.courseEnrollment.create({
    data: {
      courseId,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      mode: data.mode || "OFFLINE",
      message: data.message,
      status: 'PENDING',
    },
  });
};

export const getAllEnrollments = async () => {
  return await prisma.courseEnrollment.findMany({
    include: {
      course: {
        select: {
          title: true, // This allows the Admin to see WHICH course the student joined
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