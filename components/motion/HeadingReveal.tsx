"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * HeadingReveal — the signature editorial line reveal. The child sits inside
 * an overflow-clipped frame and slides up from below its own baseline, as if
 * rising out of the surface. Pairs with MatrixDecoder: the line slides up
 * showing scrambled glyphs, which then decode in place.
 *
 * `as` lets the clip frame render as the correct block element (h2, p, etc.)
 * so layout/spacing is preserved exactly.
 */
export default function HeadingReveal({
  children,
  delay = 0,
  duration = 0.85,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    // Clip frame — slightly padded so descenders (g, y, p) aren't shaved
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em", ...style }}
    >
      <motion.span
        style={{ display: "inline-block", willChange: "transform" }}
        initial={{ y: "115%" }}
        animate={inView ? { y: "0%" } : { y: "115%" }}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}
