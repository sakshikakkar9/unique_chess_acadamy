import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
