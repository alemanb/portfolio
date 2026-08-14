import { motion } from "motion/react";
import type { ReactNode } from "react";
import { revealVariants } from "../../lib/motion";
import { cn } from "../../lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * A staggered child of the active panel. It declares no `animate` prop of its
 * own. The panel's variant state flows down through context, which is what
 * lets one parent orchestrate the whole entrance.
 */
export function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div variants={revealVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
