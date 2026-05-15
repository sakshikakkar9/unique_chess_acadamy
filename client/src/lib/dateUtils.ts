/**
 * ISO "YYYY-MM-DD" → display "DD/MM/YYYY"
 */
export const toDisplayDate = (iso: string): string => {
  if (!iso) return '—';
  // Handle full ISO datetime strings by splitting at 'T'
  const dateOnly = iso.split('T')[0];
  const [y, m, d] = dateOnly.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};

/**
 * Today as ISO string "YYYY-MM-DD"
 */
export const todayISO = (): string =>
  new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"

/**
 * Convert DateTime from DB to form ISO string
 */
export const dbDateToISO = (
  date?: Date | string | null
): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
};

/**
 * Days remaining until a date
 */
export const daysUntil = (iso?: string | null): number | null => {
  if (!iso) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso.split('T')[0]);
  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
};

/**
 * Check date A is not after date B (both ISO)
 */
export const isNotAfter = (a: string, b: string): boolean =>
  new Date(a) <= new Date(b);

/**
 * Check ISO date is today or future
 */
export const isNotPast = (iso: string): boolean => {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return d >= t;
};
