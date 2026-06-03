"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

// Apple-grade easing — the same long-tail cubic used across the site
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up:    { x: 0,  y: 36 },
  down:  { x: 0,  y: -36 },
  left:  { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none:  { x: 0,  y: 0 },
};

/**
 * Reveal — scroll-triggered entrance with a fade, directional rise, and a
 * blur-to-sharp focus pull. The blur is what gives it the cinematic,
 * "rendered into focus" Apple feel rather than a flat fade.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  blur = 8,
  once = true,
  margin = "-60px",
  className,
  style,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  blur?: number;
  once?: boolean;
  margin?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // @ts-expect-error framer's margin string type is overly strict
  const inView = useInView(ref, { once, margin });
  const { x, y } = OFFSET[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y, filter: `blur(${blur}px)` }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, x, y, filter: `blur(${blur}px)` }
      }
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
