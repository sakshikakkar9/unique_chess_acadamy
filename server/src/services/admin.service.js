import prisma from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerAdmin = async (adminData) => {
  const { username, password } = adminData;
  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  
  if (existingAdmin) throw new Error('Username already taken');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await prisma.admin.create({
    data: { 
      username, 
      passwordHash: hashedPassword // ✅ Matches Schema
    },
  });
};

export const loginAdmin = async (credentials) => {
  const { username, password } = credentials;
  const admin = await prisma.admin.findUnique({ where: { username } });
  
  if (!admin || !admin.passwordHash) {
    throw new Error('Invalid credentials');
  }

  // ✅ Compare against passwordHash
  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: admin.id }, 
    process.env.JWT_SECRET || 'secret_key', 
    { expiresIn: '1d' }
  );
  
  return token;
};

export const getAdminById = async (id) => {
  return await prisma.admin.findUnique({
    where: { id },
    select: { id: true, username: true, createdAt: true }
  });
};