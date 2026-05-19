import prisma from '../../lib/prisma.js';
import { generateUniqueId } from '../utils/idGenerator.js';

/**
 * Shared service to find an existing student by phone or email,
 * or create a new one with a unique 7-character alphanumeric ID.
 */
export const getOrCreateStudent = async (tx, studentData) => {
  const { phone, email, fullName, gender, dob, address, fideId, fideRating, discoverySource, experienceLevel } = studentData;

  // 1. Try to find existing student by phone or email
  let existingStudent = await tx.student.findFirst({
    where: {
      OR: [
        { phone: phone },
        ...(email ? [{ email: email }] : [])
      ]
    }
  });

  if (existingStudent) {
    // Update existing student with latest info
    return await tx.student.update({
      where: { id: existingStudent.id },
      data: {
        fullName: fullName || existingStudent.fullName,
        gender: gender || existingStudent.gender,
        dob: dob ? new Date(dob) : existingStudent.dob,
        address: address || existingStudent.address,
        fideId: fideId || existingStudent.fideId,
        fideRating: fideRating !== undefined ? parseInt(fideRating) : existingStudent.fideRating,
        discoverySource: discoverySource || existingStudent.discoverySource,
        experienceLevel: experienceLevel || existingStudent.experienceLevel,
        email: email || existingStudent.email
      }
    });
  }

  // 2. Create new student if not found
  // Generate a unique 7-char ID and ensure it doesn't collide
  let newId;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    newId = generateUniqueId();
    const collision = await tx.student.findUnique({ where: { id: newId } });
    if (!collision) isUnique = true;
    attempts++;
  }

  return await tx.student.create({
    data: {
      id: newId,
      fullName: fullName || "Unknown Student",
      phone: phone,
      email: email || null,
      gender: gender || "Other",
      dob: dob ? new Date(dob) : new Date(),
      address: address || "NA",
      fideId: fideId || "NA",
      fideRating: parseInt(fideRating) || 0,
      discoverySource: discoverySource || "NA",
      experienceLevel: (experienceLevel || "BEGINNER").toUpperCase().replace(/\s+/g, '_'),
      accountStatus: "ACTIVE"
    }
  });
};
