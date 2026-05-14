/**
 * Format number as Indian currency
 * 200000 → ₹2,00,000
 */
export const formatINR = (amount: number | string): string => {
  const num = typeof amount === 'string'
    ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format time "18:00" → "6:00 PM"
 */
export const formatTime = (time24: string): string => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/**
 * Format ISO date → "14 May 2026"
 */
export const formatDate = (iso: string | Date): string => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format date range → "14 May – 23 May 2026"
 */
export const formatDateRange = (
  start: string | Date,
  end?: string | Date
): string => {
  if (!start) return '';
  const s = new Date(start);
  const startStr = s.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
  if (!end) return startStr;
  const e = new Date(end);
  const endStr = e.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
};
