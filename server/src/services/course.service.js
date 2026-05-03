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

export const createCourse = async (data, imageUrl) => {
  try {
    let parsedFeatures = data.features;
    if (typeof data.features === 'string') {
      try { 
        parsedFeatures = JSON.parse(data.features); 
      } catch (e) { 
        parsedFeatures = data.features.split(',').map(f => f.trim()); 
      }
    }

    return await prisma.course.create({
      data: {
        title: data.title || "Untitled Course",
        ageGroup: data.ageGroup ? data.ageGroup.toUpperCase() : 'ADULTS',
        minAge: data.minAge ? parseInt(data.minAge, 10) : null,
        maxAge: data.maxAge ? parseInt(data.maxAge, 10) : null,
        level: data.level || "Beginner",
        duration: data.duration || "N/A",
        description: data.description || "",
        // Save the Cloudinary URL directly here
        image: imageUrl || data.image || "", 
        price: data.price ? data.price.toString() : "0",
        features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      },
    });
  } catch (error) {
    console.error("CREATE_COURSE_PRISMA_ERROR:", error);
    throw error;
  }
};

export const updateCourse = async (id, data, imageUrl) => {
  try {
    let parsedFeatures = data.features;
    if (typeof data.features === 'string') {
      try { 
        parsedFeatures = JSON.parse(data.features); 
      } catch (e) { 
        parsedFeatures = data.features.split(',').map(f => f.trim()); 
      }
    }

    return await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        ageGroup: data.ageGroup ? data.ageGroup.toUpperCase() : undefined,
        minAge: data.minAge ? parseInt(data.minAge, 10) : undefined,
        maxAge: data.maxAge ? parseInt(data.maxAge, 10) : undefined,
        level: data.level,
        duration: data.duration,
        description: data.description,
        // Only include the image field if a new imageUrl exists
        ...(imageUrl && { image: imageUrl }), 
        price: data.price ? data.price.toString() : undefined,
        features: Array.isArray(parsedFeatures) ? parsedFeatures : undefined,
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