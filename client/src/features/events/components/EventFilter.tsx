import { cn } from "@/lib/utils";

interface EventFilterProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const EventFilter = ({ categories, activeFilter, onFilterChange }: EventFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-16">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={cn(
            "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-smooth border-none backdrop-blur-xl",
            activeFilter === cat
              ? "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-110"
              : "glass-card text-[#94a3b8] hover:text-white hover:bg-white/10"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default EventFilter;
