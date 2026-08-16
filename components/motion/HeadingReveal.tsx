"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * HeadingReveal — the signature editorial line reveal, in two dialects.
 *
 *  matrix       the line slides up from below its own baseline inside an
 *               overflow-clipped frame, as if rising out of the surface.
 *               Mechanical and hard-edged; pairs with the glyph scramble.
 *  interstellar the line arrives like light from a distance: it fades up
 *               through a blur with the letter-spacing settling from wide to
 *               normal. No clip frame, because nothing is "emerging from"
 *               anything — it's resolving into focus.
 *
 * `className`/`style` land on the outer frame so layout is preserved either way.
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
  const theme = useTheme();
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <span ref={ref} className={className} style={{ display: "inline-block", ...style }}>
        {children}
      </span>
    );
  }

  if (theme === "interstellar") {
    return (
      <span
        ref={ref}
        className={className}
        style={{ display: "inline-block", ...style }}
      >
        <motion.span
          style={{ display: "inline-block", willChange: "filter, opacity, transform" }}
          initial={{ opacity: 0, y: "18%", filter: "blur(10px)", letterSpacing: "0.18em" }}
          animate={
            inView
              ? { opacity: 1, y: "0%", filter: "blur(0px)", letterSpacing: "0em" }
              : { opacity: 0, y: "18%", filter: "blur(10px)", letterSpacing: "0.18em" }
          }
          transition={{ duration: duration * 1.25, delay, ease: EASE }}
        >
          {children}
        </motion.span>
      </span>
    );
  }

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
