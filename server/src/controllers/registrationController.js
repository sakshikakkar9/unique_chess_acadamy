const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ------------------------------------------------------
// 1. FREE DEMO REGISTRATIONS (New Feature)
// ------------------------------------------------------

// Handle "Book Free Demo" from Landing Page
exports.createDemoRegistration = async (req, res) => {
  try {
    const { studentName, email, phone, scheduledAt } = req.body;

    const demo = await prisma.demoRegistration.create({
      data: {
        studentName,
        email,
        phone,
        scheduledAt: new Date(scheduledAt), // Ensure string is converted to Date object
        status: "PENDING"
      }
    });

    res.status(201).json({ success: true, message: "Demo booked successfully!", data: demo });
  } catch (error) {
    console.error("Demo Registration Error:", error);
    res.status(500).json({ error: "Failed to book demo class" });
  }
};

// Get all Demo Requests for Admin Dashboard
exports.getAllDemoRegistrations = async (req, res) => {
  try {
    const demos = await prisma.demoRegistration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(demos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch demo requests" });
  }
};

// Update Demo Status (e.g., Pending -> Confirmed)
exports.updateDemoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedDemo = await prisma.demoRegistration.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ success: true, data: updatedDemo });
  } catch (error) {
    res.status(500).json({ error: "Failed to update demo status" });
  }
};


// ------------------------------------------------------
// 2. COURSE/TOURNAMENT REGISTRATIONS (Existing)
// ------------------------------------------------------

// Handle "Join Now" for specific tournaments/courses
exports.createRegistration = async (req, res) => {
  try {
    const { studentName, email, phone, tournamentId } = req.body;

    const registration = await prisma.registration.create({
      data: {
        studentName,
        email,
        phone,
        tournamentId: tournamentId ? parseInt(tournamentId) : null, 
        status: "PENDING"
      }
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    console.error("Detailed Server Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all registrations for Admin Panel
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        tournament: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};