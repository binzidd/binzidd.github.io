"use client";

import { useEffect, useRef } from "react";

const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const CHARS = KATAKANA + "0123456789ABCDEF><{}[]=+*/\\|";

export default function MatrixRain({
  opacity = 0.15,
  speed = 1,
  color = "#00FF41",
  fontSize = 14,
}: {
  opacity?: number;
  speed?: number;
  color?: string;
  fontSize?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let drops: number[] = [];

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -(canvas.height / fontSize) * 2);
    };

    let lastTime = 0;

    const draw = (time: number) => {
      // ~24fps cap
      if (time - lastTime < 42) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      // Fade trail — very slight so chars linger
      ctx.fillStyle = "rgba(0,5,0,0.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y < -fontSize) { drops[i] += speed * 0.5; continue; }

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;

        // Lead character — bright white
        ctx.fillStyle = "#E0FFE0";
        ctx.fillText(char, x, y);

        // One step behind — full green
        if (drops[i] > 1) {
          ctx.fillStyle = color;
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - fontSize);
        }

        drops[i] += speed * 0.5;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    animId = requestAnimationFrame(draw);

    const observer = new ResizeObserver(init);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [color, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
