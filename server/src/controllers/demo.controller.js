import * as demoService from '../services/demo.service.js';

export const handleDemoSignup = async (req, res) => {
  try {
    const registration = await demoService.createDemoRequest(req.body);
    res.status(201).json({ message: 'Demo booked successfully!', registration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book demo' });
  }
};