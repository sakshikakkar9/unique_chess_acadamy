import prisma from '../../lib/prisma.js';
import { generateUniqueId } from '../utils/idGenerator.js';
import { generateUcaId } from '../utils/generateUcaId.js';

/**
 * Shared service to find an existing student by Email, Phone, or Name+DOB,
 * or create a new one with a unique 7-character alphanumeric ID and a UCA ID.
 */
export const getOrCreateStudent = async (tx, studentData) => {
  const { phone, email, fullName, gender, dob, address, fideId, fideRating, discoverySource, experienceLevel } = studentData;

  const formattedDob = dob ? new Date(dob) : null;

  // 1. Try to find existing student by priority
  let existingStudent = null;

  // Priority 1: Email match
  if (email) {
    existingStudent = await tx.student.findFirst({
      where: { email: email }
    });
  }

  // Priority 2: Phone match
  if (!existingStudent && phone) {
    existingStudent = await tx.student.findUnique({
      where: { phone: phone }
    });
  }

  // Priority 3: Name + DOB match
  if (!existingStudent && fullName && formattedDob && !isNaN(formattedDob.getTime())) {
    existingStudent = await tx.student.findFirst({
      where: {
        fullName: fullName,
        dob: formattedDob
      }
    });
  }

  if (existingStudent) {
    // Update existing student with latest info
    const updatedStudent = await tx.student.update({
      where: { id: existingStudent.id },
      data: {
        fullName: fullName || existingStudent.fullName,
        gender: gender || existingStudent.gender,
        dob: (formattedDob && !isNaN(formattedDob.getTime())) ? formattedDob : existingStudent.dob,
        address: address || existingStudent.address,
        fideId: fideId || existingStudent.fideId,
        fideRating: fideRating !== undefined ? parseInt(fideRating) : existingStudent.fideRating,
        discoverySource: discoverySource || existingStudent.discoverySource,
        experienceLevel: experienceLevel || existingStudent.experienceLevel,
        email: email || existingStudent.email
      }
    });

    // Ensure UCA ID exists
    if (!updatedStudent.ucaId) {
      const ucaId = await generateUcaId(tx);
      return await tx.student.update({
        where: { id: updatedStudent.id },
        data: { ucaId: ucaId }
      });
    }

    return updatedStudent;
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

  const ucaId = await generateUcaId(tx);

  return await tx.student.create({
    data: {
      id: newId,
      ucaId: ucaId,
      fullName: fullName || "Unknown Student",
      phone: phone,
      email: email || null,
      gender: gender || "Other",
      dob: (formattedDob && !isNaN(formattedDob.getTime())) ? formattedDob : new Date(),
      address: address || "NA",
      fideId: fideId || "NA",
      fideRating: parseInt(fideRating) || 0,
      discoverySource: discoverySource || "NA",
      experienceLevel: (experienceLevel || "BEGINNER").toUpperCase().replace(/\s+/g, '_'),
      accountStatus: "ACTIVE"
    }
  });
};
