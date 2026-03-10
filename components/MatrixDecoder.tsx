"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const DECODE_CHARS = "アカサタナハマヤラワ0123456789ABCDEF#@$%";

/**
 * Scrambles text with matrix characters then decodes left-to-right.
 * If `trigger` is omitted, fires automatically when the element scrolls into view.
 * If `trigger` is provided, fires when it becomes true.
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
  const inViewInternal = useInView(ref, { once: true, margin: "-40px" });
  const shouldTrigger = trigger !== undefined ? trigger : inViewInternal;

  const scramble = () =>
    text
      .split("")
      .map((c) => (" '/-—&".includes(c) ? c : DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)]))
      .join("");

  const [displayed, setDisplayed] = useState(scramble);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!shouldTrigger || done) return;
    const t = setTimeout(() => {
      let frame = 0;
      const total = 36;
      const iv = setInterval(() => {
        frame++;
        const ratio = frame / total;
        setDisplayed(
          text
            .split("")
            .map((char, i) => {
              if (" '/-—&".includes(char)) return char;
              if (i < Math.floor(ratio * text.length)) return char;
              return DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
            })
            .join("")
        );
        if (frame >= total) {
          setDisplayed(text);
          setDone(true);
          clearInterval(iv);
        }
      }, 45);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [shouldTrigger, text, delay, done]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayed}
    </span>
  );
}
