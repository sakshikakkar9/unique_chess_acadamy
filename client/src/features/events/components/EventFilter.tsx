import { cn } from "@/lib/utils";

interface EventFilterProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const EventFilter = ({ categories, activeFilter, onFilterChange }: EventFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
            activeFilter === cat
              ? "bg-primary text-primary-foreground gold-glow"
              : "bg-card border border-border hover:border-primary/50 text-muted-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default EventFilter;
