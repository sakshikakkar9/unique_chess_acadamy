import * as adminService from '../services/admin.service.js';

export const registerAdmin = async (req, res) => {
  try {
    const newAdmin = await adminService.registerAdmin(req.body);
    res.status(201).json({ message: 'Admin created successfully', adminId: newAdmin.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const token = await adminService.loginAdmin(req.body);
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};