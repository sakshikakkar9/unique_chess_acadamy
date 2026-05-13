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
  new Date().toISOString().split('T')[0];

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
