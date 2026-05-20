import prisma from '../../lib/prisma.js';

/**
 * checkDuplicateStudent
 *
 * Checks whether a student already exists in the database before creating
 * a new record. Must be called at the entry point of:
 *   - User-side course enrollment
 *   - User-side tournament enrollment
 *   - Admin-side course enrollment
 *   - Admin-side manual student creation
 *
 * Matching logic (in priority order):
 *   1. Email match (most reliable unique identifier)
 *   2. Phone number match (if email is absent)
 *   3. Full name + date of birth match (fallback)
 *
 * @param {Object} studentData - The incoming student data from the form/request
 * @returns {Promise<Object>}  - { isDuplicate: boolean, existingStudent: Student | null }
 */
export async function checkDuplicateStudent(studentData) {
  const { email, phone, fullName, dob } = studentData;

  // Priority 1: Email match
  if (email) {
    const byEmail = await prisma.student.findFirst({
      where: { email: email }
    });
    if (byEmail) return { isDuplicate: true, existingStudent: byEmail };
  }

  // Priority 2: Phone number match
  if (phone) {
    const byPhone = await prisma.student.findUnique({
      where: { phone: phone }
    });
    if (byPhone) return { isDuplicate: true, existingStudent: byPhone };
  }

  // Priority 3: Full name + date of birth match
  if (fullName && dob) {
    const formattedDob = new Date(dob);
    if (!isNaN(formattedDob.getTime())) {
      const byNameDob = await prisma.student.findFirst({
        where: {
          fullName: fullName,
          dob: formattedDob
        }
      });
      if (byNameDob) return { isDuplicate: true, existingStudent: byNameDob };
    }
  }

  return { isDuplicate: false, existingStudent: null };
}
