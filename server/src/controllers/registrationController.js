import prisma from '../../lib/prisma.js';

// ── FREE DEMO REGISTRATIONS ──────────────────────────────────────────────────

export const createDemoRegistration = async (req, res) => {
  try {
    const { studentName, email, phone, scheduledAt } = req.body;

    if (!studentName || !email || !phone || !scheduledAt) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const demo = await prisma.demoRegistration.create({
      data: {
        studentName,
        email,
        phone,
        scheduledAt: new Date(scheduledAt),
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, message: 'Demo booked successfully!', data: demo });
  } catch (error) {
    console.error('Demo Registration Error:', error);
    res.status(500).json({ error: 'Failed to book demo class' });
  }
};

export const getAllDemoRegistrations = async (req, res) => {
  try {
    const demos = await prisma.demoRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(demos);
  } catch (error) {
    console.error('Fetch Demos Error:', error);
    res.status(500).json({ error: 'Failed to fetch demo requests' });
  }
};

export const updateDemoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'CONFIRMED', 'COMPLETED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const updated = await prisma.demoRegistration.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Demo Status Error:', error);
    res.status(500).json({ error: 'Failed to update demo status' });
  }
};

// ── TOURNAMENT / COURSE ENROLLMENTS ─────────────────────────────────────────

export const createRegistration = async (req, res) => {
  try {
    const { studentName, email, phone, tournamentId } = req.body;

    if (!studentName || !email || !phone || !tournamentId) {
      return res.status(400).json({ error: 'All fields including tournamentId are required.' });
    }

    const registration = await prisma.registration.create({
      data: {
        studentName,
        email,
        phone,
        tournamentId: parseInt(tournamentId),
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        tournament: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(registrations);
  } catch (error) {
    console.error('Fetch Registrations Error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};
