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
    <section className={cn("relative pt-48 pb-24 overflow-hidden bg-secondary/10", className)}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 blur-[120px] rounded-full -z-10 translate-x-1/2" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-royal/10 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <ScrollReveal direction="down">
            {label && (
              <span className="inline-block text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-primary mb-8 bg-primary/10 px-4 py-1.5 rounded-full border-glow-gold">
                {label}
              </span>
            )}
            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-8xl leading-[1.05] mb-8 tracking-tight text-glow-gold">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                {description}
              </p>
            )}
            <div className="accent-line !mx-0 mt-10 w-32" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
