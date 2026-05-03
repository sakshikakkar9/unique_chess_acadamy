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

export const createCourse = async (data, imageFile) => {
  console.log("Incoming Course Data:", data);

  try {
    // 1. If features comes from FormData, it might be a JSON string. Parse it.
    let parsedFeatures = data.features;
    if (typeof data.features === 'string') {
      try { parsedFeatures = JSON.parse(data.features); } 
      catch (e) { parsedFeatures = data.features.split(',').map(f => f.trim()); }
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
        // 2. Use the file path from your upload middleware (e.g., Multer)
        image: imageFile ? `/uploads/courses/${imageFile.filename}` : (data.image || ""),
        price: data.price ? data.price.toString() : "0",
        features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      },
    });
  } catch (error) {
    console.error("CREATE_COURSE_PRISMA_ERROR:", error);
    throw error;
  }
};

export const updateCourse = async (id, data, imageFile) => {
  try {
    let parsedFeatures = data.features;
    if (typeof data.features === 'string') {
      try { parsedFeatures = JSON.parse(data.features); } 
      catch (e) { parsedFeatures = data.features.split(',').map(f => f.trim()); }
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
        // 3. Only update image if a new file was uploaded
        ...(imageFile && { image: `/uploads/courses/${imageFile.filename}` }),
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
export const createEnrollment = async (courseId, data, files) => {
  // files will contain ageProof and paymentProof from your controller
  return await prisma.courseEnrollment.create({
    data: {
      courseId,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      // 4. Handle the new fields we added to the Frontend Modal
      gender: data.gender,
      dob: data.dob ? new Date(data.dob) : null,
      fideId: data.fideId,
      category: data.category,
      mode: data.mode || "OFFLINE",
      message: data.message,
      // 5. Store file paths for the proofs
      ageProof: files?.ageProof ? `/uploads/enrollments/${files.ageProof[0].filename}` : null,
      paymentProof: files?.paymentProof ? `/uploads/enrollments/${files.paymentProof[0].filename}` : null,
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