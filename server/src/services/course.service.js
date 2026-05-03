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
        
        // --- SCHEMA ALIGNMENT FIXES ---
        skillLevel: data.level || "BEGINNER",     // level -> skillLevel
        duration: data.duration || "N/A",
        description: data.description || "",
        bannerUrl: imageUrl || data.image || "",   // image -> bannerUrl
        fee: parseFloat(data.price) || 0,          // price -> fee (Float)
        days: Array.isArray(parsedFeatures) ? parsedFeatures : [], // features -> days
        
        // --- ADDING REQUIRED MISSING FIELDS ---
        classTime: data.classTime || "TBD", 
        contactDetails: data.contactDetails || "Contact Academy Admin",
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
        
        // --- SCHEMA ALIGNMENT FIXES ---
        skillLevel: data.level, 
        duration: data.duration,
        description: data.description,
        ...(imageUrl && { bannerUrl: imageUrl }), 
        fee: data.price ? parseFloat(data.price) : undefined,
        days: Array.isArray(parsedFeatures) ? parsedFeatures : undefined,
        classTime: data.classTime,
        contactDetails: data.contactDetails,
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