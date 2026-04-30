import { cn } from "@/lib/utils";
import ScrollReveal from "./ScrollReveal";
import { Sparkles } from "lucide-react";

interface SectionHeadingProps {
  label?: string;
  title: string | React.ReactNode;
  description?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading = ({
  label,
  title,
  description,
  centered = true,
  className,
}: SectionHeadingProps) => {
  return (
    <div className={cn("mb-16", centered && "text-center", className)}>
      <ScrollReveal>
        {label && (
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-gold mb-6",
            centered && "mx-auto"
          )}>
            <Sparkles className="h-3 w-3 text-[#f59e0b]" />
            <span className="accent-label text-[#f59e0b] font-black">{label}</span>
          </div>
        )}

        <h2 className="font-black text-4xl md:text-5xl lg:text-6xl mb-8 relative inline-block">
          {typeof title === 'string' ? (
            title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]" : ""}>
                {word}{' '}
              </span>
            ))
          ) : title}

          {/* Animated Expanding Underline */}
          <div className={cn(
            "absolute -bottom-4 left-1/2 -translate-x-1/2 h-[3px] bg-[#f59e0b] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]",
            "w-24 group-hover:w-48 transition-all duration-700 ease-out"
          )} />
        </h2>

        {description && (
          <p className={cn(
            "text-[#94a3b8] max-w-2xl text-lg leading-relaxed mt-4",
            centered && "mx-auto"
          )}>
            {description}
          </p>
        )}
      </ScrollReveal>
    </div>
  );
};

export default SectionHeading;
