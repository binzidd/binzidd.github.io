"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Scroll-scrubbed scene entry: each section rises, scales and sharpens as it
// enters the viewport — a camera dolly between scenes rather than a one-shot
// fade. Scrubbing (vs whileInView) keeps the motion tied to scroll position,
// so reversing scroll reverses the move.
export default function SceneDolly({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.38"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [72, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.965, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale, opacity }}>{children}</motion.div>
    </div>
  );
}
