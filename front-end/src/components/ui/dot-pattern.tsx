"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useEffect, useId, useRef, useState } from "react";

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  glow?: boolean;
  [key: string]: unknown;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      resizeObserver.observe(ref.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  const patternWidth = width;
  const patternHeight = height;

  return (
    <svg
      ref={ref}
      width={dimensions.width || undefined}
      height={dimensions.height || undefined}
      className={cn("h-full w-full", className)}
      viewBox={`0 0 ${patternWidth} ${patternHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern
          id={`dot-pattern-${id}`}
          width={patternWidth}
          height={patternHeight}
          x={x}
          y={y}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <motion.circle
            cx={cx}
            cy={cy}
            r={cr}
            fill="currentColor"
            animate={glow ? {
              opacity: [0.5, 1, 0.5],
            } : undefined}
            transition={glow ? {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            } : undefined}
            initial={{
              opacity: glow ? 0.5 : 1,
            }}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dot-pattern-${id})`} />
    </svg>
  );
}
