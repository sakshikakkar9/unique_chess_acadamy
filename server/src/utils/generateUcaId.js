import prisma from '../../lib/prisma.js';

/**
 * generateUcaId
 *
 * Queries DB for the count of UCA IDs of the current day,
 * increments sequence, returns formatted string.
 *
 * New Format: UCA-{DD}{MM}{YY}-{2-digit counter}
 * e.g. UCA-220525-01
 *
 * @param {Object} tx - Prisma transaction client (optional)
 * @returns {Promise<string>} - Formatted UCA ID
 */
export async function generateUcaId(tx = prisma) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);

  const dateStr = `${dd}${mm}${yy}`;
  const prefix = `UCA-${dateStr}-`;

  // Count how many uca_id values already exist for today
  const count = await tx.student.count({
    where: {
      ucaId: {
        startsWith: prefix,
      },
    },
  });

  const nextSequence = count + 1;
  const paddedSequence = String(nextSequence).padStart(2, '0');

  return `${prefix}${paddedSequence}`;
}
