/**
 * generateUcaId
 *
 * Generates a unique, human-friendly Enrollment ID for Unique Chess Academy.
 * Format: UCA-DDMMYY-N
 *
 * ONLY called for COURSE enrollments. Never called for tournament enrollments.
 *
 * @param {number} courseEnrollmentCount - COUNT of existing COURSE enrollments BEFORE
 *                                this one. Tournament enrollments are excluded
 *                                from this count entirely.
 * @param {Date} enrollmentDate        - Date of enrollment. Defaults to current UTC date.
 * @returns {string}                   - Formatted UCA-ID e.g. "UCA-070625-1"
 */
export function generateUcaId(
  courseEnrollmentCount,
  enrollmentDate = new Date()
) {
  const dd = String(enrollmentDate.getUTCDate()).padStart(2, '0');
  const mm = String(enrollmentDate.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(enrollmentDate.getUTCFullYear()).slice(-2);
  const n  = courseEnrollmentCount + 1;

  return `UCA-${dd}${mm}${yy}-${n}`;
}
