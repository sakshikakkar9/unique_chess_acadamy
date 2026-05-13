'use client';
import { FILTER_TABS, ItemStatus, resolveStatus }
  from '@/lib/statusUtils';

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
    <div className="flex flex-col sm:flex-row items-start
                    sm:items-center justify-between gap-3 mb-5">

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTER_TABS.map(tab => {
          const n = count(tab.value);
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5
                          rounded-lg text-xs font-semibold
                          border transition-all duration-150
                          ${isActive
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                          }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5
                                rounded-full min-w-[18px] text-center
                                ${isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-400'
                                }`}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      {onSearchChange && (
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border border-slate-200 rounded-xl
                       pl-9 pr-4 py-2 text-sm bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500/20 focus:border-blue-500
                       placeholder:text-slate-300"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2
                          size-4 text-slate-400"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )}
    </div>
  );
}
