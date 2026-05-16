import * as demoService from '../services/demo.service.js';

export const createDemoRegistration = async (req, res) => {
  try {
    const { studentName, email, phone, scheduledAt } = req.body;

    if (!studentName || !email || !phone || !scheduledAt) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const demo = await demoService.createDemoRegistration(req.body);
    res.status(201).json({ success: true, message: 'Demo booked successfully!', data: demo });
  } catch (error) {
    console.error('Demo Registration Error:', error);
    res.status(500).json({ error: 'Failed to book demo class' });
  }
};

export const getAllDemoRegistrations = async (req, res) => {
  try {
    const demos = await demoService.getAllDemoRegistrations();
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

    const allowed = ['PENDING', 'APPROVED', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const updated = await demoService.updateDemoStatus(id, status);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Demo Status Error:', error);
    res.status(500).json({ error: 'Failed to update demo status' });
  }
};

export const deleteDemoRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    await demoService.deleteDemoRegistration(id);
    res.json({ success: true, message: 'Demo request deleted successfully' });
  } catch (error) {
    console.error('Delete Demo Error:', error);
    res.status(500).json({ error: 'Failed to delete demo request' });
  }
};
