"use client";

import { type ReactNode } from "react";
import {
  motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion,
} from "framer-motion";

// Content subtly shears with scroll velocity — fast scrolling bends the page
// like wind through it, springing back to rest when the scroll settles.
export default function VelocityWarp({
  children,
  className,
  maxSkew = 1.4,
}: {
  children: ReactNode;
  className?: string;
  maxSkew?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const raw = useTransform(velocity, [-2400, 2400], [maxSkew, -maxSkew], { clamp: true });
  const skewY = useSpring(raw, { stiffness: 260, damping: 38, mass: 0.8 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ skewY }}>
      {children}
    </motion.div>
  );
}
