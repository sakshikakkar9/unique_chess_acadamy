import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface PageHeaderProps {
  label?: string;
  title: string | React.ReactNode;
  description?: string;
  className?: string;
}

const PageHeader = ({ label, title, description, className }: PageHeaderProps) => {
  return (
    <section className={cn("relative pt-40 pb-20 overflow-hidden", className)}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <ScrollReveal direction="down">
            {label && (
              <span className="inline-block text-xs font-heading font-semibold uppercase tracking-[0.3em] text-primary mb-6">
                {label}
              </span>
            )}
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </ScrollReveal>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent -skew-x-12 transform translate-x-1/2" />
    </section>
  );
};

export default PageHeader;
