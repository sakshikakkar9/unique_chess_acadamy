import { cn } from "@/lib/utils";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";
import { scaleIn } from "./motion";

interface SectionHeadingProps {
  label?: string;
  title: string | React.ReactNode;
  description?: string;
  centered?: boolean;
  className?: string;
  dark?: boolean;
}

const SectionHeading = ({
  label,
  title,
  description,
  centered = false,
  className,
  dark = false,
}: SectionHeadingProps) => {
  return (
    <div className={cn("mb-16", centered ? "text-center" : "text-left", className)}>
      {label && (
        <ScrollReveal variants={scaleIn}>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 border",
            "bg-sky-50 text-sky-600 border-sky-100",
            centered && "mx-auto"
          )}>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em]">
              ♟ {label}
            </span>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.05}>
        <h2 className={cn(
          "text-h2 mb-6",
          dark ? "text-white" : "text-[#0f172a]"
        )}>
          {typeof title === 'string' ? (
            title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "bg-clip-text text-transparent bg-gradient-to-br from-sky-400 to-blue-600" : ""}>
                {word}{' '}
              </span>
            ))
          ) : title}
        </h2>
      </ScrollReveal>

      {description && (
        <ScrollReveal delay={0.1}>
          <p className={cn(
            "max-w-[560px] text-[17px] leading-[1.7]",
            dark ? "text-[#94a3b8]" : "text-[#475569]",
            centered && "mx-auto"
          )}>
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
};

export default SectionHeading;
