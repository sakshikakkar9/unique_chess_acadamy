import prisma from '../../lib/prisma.js';

export const getAllStudents = async (req, res) => {
  try {
    const { tournamentId, courseId } = req.query;

    const where = {};
    if (tournamentId) {
      where.registrations = {
        some: { tournamentId: parseInt(tournamentId) }
      };
    }
    if (courseId) {
      where.enrollments = {
        some: { courseId: courseId }
      };
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        registrations: {
          include: { tournament: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        enrollments: {
          include: { course: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        registrations: {
          include: { tournament: { select: { title: true } } },
          orderBy: { createdAt: 'desc' }
        },
        enrollments: {
          include: { course: { select: { title: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = await prisma.student.create({
      data: {
        ...req.body,
        dob: req.body.dob ? new Date(req.body.dob) : new Date(),
        fideRating: parseInt(req.body.fideRating) || 0
      }
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.dob) updateData.dob = new Date(updateData.dob);
    if (updateData.fideRating !== undefined) updateData.fideRating = parseInt(updateData.fideRating) || 0;

    const student = await prisma.student.update({
      where: { id },
      data: updateData
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
