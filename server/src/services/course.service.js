import prisma from '../../lib/prisma.js';

// ── Courses ───────────────────────────────────────────────────────────────────

export const getAllCourses = async () => {
  return prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getCoursesByAgeGroup = async (ageGroup) => {
  return prisma.course.findMany({
    where: { ageGroup },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCourseById = async (id) => {
  return prisma.course.findUnique({ where: { id } });
};

export const createCourse = async (data) => {
  return prisma.course.create({
    data: {
      title: data.title,
      ageGroup: data.ageGroup || 'ADULTS',
      minAge: data.minAge != null ? parseInt(data.minAge, 10) : null,
      maxAge: data.maxAge != null ? parseInt(data.maxAge, 10) : null,
      level: data.level,
      duration: data.duration,
      description: data.description || null,
      image: data.image || null,
      price: data.price || null,
      features: Array.isArray(data.features) ? data.features : [],
    },
  });
};

export const updateCourse = async (id, data) => {
  const update = {
    title: data.title,
    level: data.level,
    duration: data.duration,
    description: data.description ?? undefined,
    image: data.image ?? undefined,
    price: data.price ?? undefined,
    features: Array.isArray(data.features) ? data.features : undefined,
  };
  if (data.ageGroup !== undefined) update.ageGroup = data.ageGroup;
  if (data.minAge !== undefined) update.minAge = data.minAge ? parseInt(data.minAge, 10) : null;
  if (data.maxAge !== undefined) update.maxAge = data.maxAge ? parseInt(data.maxAge, 10) : null;
  return prisma.course.update({ where: { id }, data: update });
};

export const deleteCourse = async (id) => {
  return prisma.course.delete({ where: { id } });
};

// ── Course Enrollments ────────────────────────────────────────────────────────

export const createEnrollment = async (courseId, data) => {
  return prisma.courseEnrollment.create({
    data: {
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      message: data.message || null,
      courseId,
      status: 'PENDING',
    },
    include: { course: { select: { title: true } } },
  });
};

export const getAllEnrollments = async () => {
  return prisma.courseEnrollment.findMany({
    include: { course: { select: { id: true, title: true, ageGroup: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateEnrollmentStatus = async (id, status) => {
  return prisma.courseEnrollment.update({
    where: { id },
    data: { status },
    include: { course: { select: { title: true } } },
  });
};
