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
    <div className={cn("mb-12", centered && "text-center", className)}>
      <ScrollReveal>
        {label && (
          <span className="inline-block text-xs font-heading font-semibold uppercase tracking-[0.3em] text-primary mb-3">
            {label}
          </span>
        )}
        <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
          {title}
        </h2>
        {description && (
          <p className={cn(
            "text-muted-foreground max-w-2xl leading-relaxed",
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
