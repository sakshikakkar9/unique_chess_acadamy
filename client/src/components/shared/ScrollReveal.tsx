import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { fadeUp, fadeLeft, fadeRight, scaleIn } from '@/components/shared/motion';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  width?: 'fit-content' | '100%';
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  width = 'fit-content',
  className = '',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px 0px' });

  const getVariant = () => {
    switch (direction) {
      case 'up': return fadeUp;
      case 'left': return fadeLeft;
      case 'right': return fadeRight;
      case 'down': return { ...fadeUp, hidden: { ...fadeUp.hidden, y: -32 } };
      default: return fadeUp;
    }
  };

  const variants = getVariant();

  return (
    <div ref={ref} className={className} style={{ width }}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ ...variants.visible.transition, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
