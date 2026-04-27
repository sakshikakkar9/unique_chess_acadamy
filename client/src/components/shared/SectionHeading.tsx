import { cn } from "@/lib/utils";
import ScrollReveal from "./ScrollReveal";

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
          <span className="inline-block text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-primary mb-4 bg-primary/10 px-4 py-1 rounded-full">
            {label}
          </span>
        )}
        <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
          {title}
        </h2>
        <div className="accent-line" />
        {description && (
          <p className={cn(
            "text-muted-foreground text-lg max-w-2xl leading-relaxed mt-6",
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
