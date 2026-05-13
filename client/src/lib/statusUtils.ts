export type ItemStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'rejected'
  | 'cancelled';

// Manual statuses — set by admin only
export const MANUAL_STATUSES: ItemStatus[] = [
  'completed', 'rejected', 'cancelled'
];

/**
 * Resolves the display status of a record.
 * Manual admin status always wins over auto-date logic.
 */
export function resolveStatus(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  manualStatus?: string | null
): ItemStatus {

  // Manual override wins — if admin explicitly set it
  if (manualStatus && MANUAL_STATUSES.includes(
    manualStatus as ItemStatus
  )) {
    return manualStatus as ItemStatus;
  }

  // Auto logic from dates
  if (!startDate) return 'upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (end && end < today) return 'completed';   // auto-complete
  if (start <= today && (!end || end >= today)) return 'ongoing';
  return 'upcoming';
}

/**
 * Status badge config
 */
export const STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; dot: string; badge: string }
> = {
  upcoming: {
    label: 'Upcoming',
    dot:   'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  ongoing: {
    label: 'Ongoing',
    dot:   'bg-green-500 animate-pulse',
    badge: 'bg-green-50 text-green-700 border border-green-200',
  },
  completed: {
    label: 'Completed',
    dot:   'bg-slate-400',
    badge: 'bg-slate-50 text-slate-600 border border-slate-200',
  },
  rejected: {
    label: 'Rejected',
    dot:   'bg-red-500',
    badge: 'bg-red-50 text-red-700 border border-red-200',
  },
  cancelled: {
    label: 'Cancelled',
    dot:   'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 border border-orange-200',
  },
};

/**
 * Filter tab definitions — order matters
 */
export const FILTER_TABS = [
  { value: 'all',       label: 'All' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'ongoing',   label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;
