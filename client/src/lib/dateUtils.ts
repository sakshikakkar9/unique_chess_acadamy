// ─── Format Helpers ───────────────────────────────────────────

/**
 * Converts ISO date string "YYYY-MM-DD" → display "DD/MM/YYYY"
 */
export const formatDateDisplay = (iso: string): string => {
  if (!iso) return '—';
  // Handle ISO datetime strings too
  const dateOnly = iso.split('T')[0];
  const [y, m, d] = dateOnly.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};

/**
 * Converts display "DD/MM/YYYY" → ISO "YYYY-MM-DD" for API
 */
export const formatDateISO = (display: string): string => {
  if (!display) return '';
  const [d, m, y] = display.split('/');
  if (!d || !m || !y) return display;
  return `${y}-${m}-${d}`;
};

/**
 * Converts "HH:MM" 24hr → "hh:MM AM/PM" for display
 */
export const formatTimeDisplay = (time24: string): string => {
  if (!time24) return '—';
  const [hourStr, min] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${String(h).padStart(2, '0')}:${min} ${ampm}`;
};

/**
 * Today's date as ISO string "YYYY-MM-DD"
 */
export const todayISO = (): string =>
  new Date().toISOString().split('T')[0];

/**
 * Today's date as display string "DD/MM/YYYY"
 */
export const todayDisplay = (): string =>
  formatDateDisplay(todayISO());

/**
 * Validate: date A is not after date B
 */
export const isNotAfter = (
  dateA: string,  // ISO
  dateB: string   // ISO
): boolean => {
    if (!dateA || !dateB) return true;
    return new Date(dateA) <= new Date(dateB);
};

/**
 * Validate: date is not in the past
 */
export const isNotPast = (dateISO: string): boolean => {
  if (!dateISO) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateISO);
  date.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Combine date ISO + time "HH:MM" → ISO datetime string
 */
export const combineDatetime = (
  dateISO: string,
  time: string
): string => {
    if (!dateISO) return '';
    if (!time) return `${dateISO}T00:00:00`;
    return `${dateISO}T${time}:00`;
};

/**
 * Status from dates
 */
export type ItemStatus =
  'upcoming' | 'ongoing' | 'completed' | 'rejected' | 'cancelled';

export const getStatusFromDates = (
  startDate: string | Date,
  endDate: string | Date | null,
  manualStatus?: string
): ItemStatus => {
  const status = manualStatus?.toLowerCase();
  if (status === 'rejected') return 'rejected';
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(0, 0, 0, 0);

  if (end && end < today) return 'completed';
  if (start <= today && (!end || end >= today)) return 'ongoing';
  return 'upcoming';
};
