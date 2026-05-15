'use client';
import { FILTER_TABS, ItemStatus, resolveStatus }
  from '../../lib/statusUtils';

interface Item {
  startDate?: string;
  endDate?: string;
  status?: string | null;
}

interface Props {
  items: Item[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export default function StatusFilterBar({
  items,
  activeFilter,
  onFilterChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
}: Props) {

  // Count per tab
  const count = (filterVal: string): number => {
    if (filterVal === 'all') return items.length;
    return items.filter(item =>
      resolveStatus(item.startDate, item.endDate, item.status)
      === filterVal
    ).length;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-uca-bg-surface border border-uca-border p-4 rounded-xl mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
        {onSearchChange && (
          <div className="relative flex-1 w-full lg:max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-uca-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 bg-uca-bg-base border-uca-border text-sm focus:ring-uca-accent-blue rounded-lg pl-10 pr-4 outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap w-full lg:w-auto justify-center lg:justify-end">
        <div className="flex bg-uca-bg-base p-1 rounded-lg h-10 border border-uca-border">
          {FILTER_TABS.map((tab) => {
            const n = count(tab.value);
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onFilterChange(tab.value)}
                className={`rounded-md px-3 sm:px-4 text-[10px] font-black uppercase tracking-widest h-8 flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-uca-navy text-white"
                    : "text-uca-text-muted hover:text-uca-text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    isActive ? "bg-white/20 text-white" : "bg-uca-bg-elevated text-uca-text-muted"
                  }`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
