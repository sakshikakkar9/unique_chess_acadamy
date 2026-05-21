import prisma from '../../lib/prisma.js';

/**
 * generateUcaId
 *
 * Queries DB for the latest UCA ID of the current year,
 * increments sequence, returns formatted string.
 *
 * Format: UCA-{YEAR}-{5-digit sequence}, e.g. UCA-2025-00001
 *
 * @param {Object} tx - Prisma transaction client (optional)
 * @returns {Promise<string>} - Formatted UCA ID
 */
export async function generateUcaId(tx = prisma) {
  const currentYear = new Date().getFullYear();
  const prefix = `UCA-${currentYear}-`;

  // Find the student with the highest sequence number for the current year
  // We use findFirst with desc order on ucaId to get the latest sequence
  const lastStudent = await tx.student.findFirst({
    where: {
      ucaId: {
        startsWith: prefix,
      },
    },
    orderBy: {
      ucaId: 'desc',
    },
    select: {
      ucaId: true,
    },
  });

  let nextSequence = 1;

  if (lastStudent && lastStudent.ucaId) {
    const parts = lastStudent.ucaId.split('-');
    if (parts.length === 3) {
      const lastSequence = parseInt(parts[2], 10);
      if (!isNaN(lastSequence)) {
        nextSequence = lastSequence + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(5, '0');
  return `${prefix}${paddedSequence}`;
}
