"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "@/lib/theme";

// Matrix: dense katakana + hex noise, the classic cascade alphabet.
const MATRIX_CHARS = "アカサタナハマヤラワ0123456789ABCDEF#@$%";
// Interstellar: sparse telemetry noise. Reads as a signal on a scope rather
// than a glyph cascade, so the same component carries a different accent.
const STELLAR_CHARS = "·∙˙:‥°*+×/|⌁⋅0123456789";

const PRESERVED = " '/-—&";

/**
 * Reveals text with a theme-appropriate character animation.
 *
 *  matrix       chaotic katakana scramble that decodes strictly left-to-right,
 *               fast and mechanical, like a terminal resolving a buffer.
 *  interstellar characters lock in out of order, as a faint signal acquiring
 *               one bit at a time; unresolved glyphs sit dimmed and the
 *               freshly-locked character flares briefly before settling.
 *
 * If `trigger` is omitted it fires when scrolled into view; otherwise it fires
 * when `trigger` becomes true.
 */
export default function MatrixDecoder({
  text,
  trigger,
  delay = 0,
  className,
  style,
}: {
  text: string;
  trigger?: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const theme = useTheme();
  const inViewInternal = useInView(ref, { once: true, margin: "-40px" });
  const shouldTrigger = trigger !== undefined ? trigger : inViewInternal;

  // Server and first client render both emit the real text: scrambling with
  // Math.random() during SSR produced a guaranteed hydration mismatch (React
  // regenerated the whole subtree and logged an error on every page load).
  // The scramble is introduced after mount instead, which is invisible in
  // practice and leaves the no-JS/SEO output as clean text.
  const [displayed, setDisplayed] = useState(text);
  const [locked, setLocked] = useState<boolean[] | null>(null);
  const [flash, setFlash] = useState<number>(-1);
  const [done, setDone] = useState(false);

  const pool = theme === "interstellar" ? STELLAR_CHARS : MATRIX_CHARS;
  const poolRef = useRef(pool);
  poolRef.current = pool;

  const noise = () => poolRef.current[Math.floor(Math.random() * poolRef.current.length)];

  // Pre-trigger: show the scrambled state (client-only, post-hydration).
  useEffect(() => {
    if (done || shouldTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDisplayed(
      text.split("").map((c) => (PRESERVED.includes(c) ? c : noise())).join("")
    );
    // Intentionally not depending on `noise`: it reads a ref, and re-running
    // on every render would fight the animation loop below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, shouldTrigger, done, theme]);

  useEffect(() => {
    if (!shouldTrigger || done) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    const chars = text.split("");
    const stellar = theme === "interstellar";

    // Interstellar locks characters in a shuffled order; matrix sweeps L→R.
    const order = chars.map((_, i) => i).filter((i) => !PRESERVED.includes(chars[i]));
    if (stellar) {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }

    const total = stellar ? Math.max(order.length, 14) : 36;
    const tick = stellar ? 58 : 45;

    const t = setTimeout(() => {
      let frame = 0;
      const lockedSet = new Set<number>();

      const iv = setInterval(() => {
        frame++;
        const ratio = frame / total;

        if (stellar) {
          // Acquire the next character (or two on long strings) per frame.
          const target = Math.floor(ratio * order.length);
          let newest = -1;
          while (lockedSet.size < target && lockedSet.size < order.length) {
            newest = order[lockedSet.size];
            lockedSet.add(newest);
          }
          setFlash(newest);
          setLocked(chars.map((_, i) => PRESERVED.includes(chars[i]) || lockedSet.has(i)));
          setDisplayed(
            chars
              .map((c, i) =>
                PRESERVED.includes(c) || lockedSet.has(i) ? c : noise()
              )
              .join("")
          );
        } else {
          setDisplayed(
            chars
              .map((char, i) => {
                if (PRESERVED.includes(char)) return char;
                if (i < Math.floor(ratio * chars.length)) return char;
                return noise();
              })
              .join("")
          );
        }

        if (frame >= total) {
          setDisplayed(text);
          setLocked(null);
          setFlash(-1);
          setDone(true);
          clearInterval(iv);
        }
      }, tick);

      return () => clearInterval(iv);
    }, delay * 1000);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTrigger, text, delay, done, theme]);

  // Mid-animation under interstellar, render per-character so unresolved
  // glyphs can sit dimmed and the newest lock can flare.
  if (locked && !done) {
    return (
      <span ref={ref} className={className} style={style}>
        {displayed.split("").map((c, i) => (
          <span
            key={i}
            style={{
              opacity: locked[i] ? 1 : 0.35,
              color: i === flash ? "var(--c-accent-alt)" : undefined,
              transition: "opacity 120ms linear",
            }}
          >
            {c}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={style}>
      {displayed}
    </span>
  );
}
