import { STATUS_CONFIG, ItemStatus } from '@/lib/statusUtils';

export default function StatusBadge({
  status
}: { status: ItemStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5
                      text-[10px] font-bold uppercase tracking-wide
                      px-2.5 py-1 rounded-full ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full
                        flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
