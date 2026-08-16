"use client";

/**
 * Starfield
 * ---------
 * The interstellar theme's answer to the matrix rain: a slow parallax star
 * drift with an occasional accretion-disc shimmer near the lower-right, so
 * the page reads as "looking out of a ship" rather than "inside a terminal".
 *
 * Only mounts under the interstellar theme (the matrix theme has its own
 * rain + term columns doing this job). Colours come from the resolved theme
 * tokens rather than literals, so a mid-session theme flip is picked up.
 */

import { useEffect, useRef } from "react";
import { useTheme, readThemeTokens, watchThemeTokens, type ThemeTokens } from "@/lib/theme";

interface Star {
  x: number;      // viewport fraction
  y: number;
  depth: number;  // 0.2 (far) - 1 (near): drives size, alpha, drift rate
  twSpeed: number;
  twPhase: number;
  warm: boolean;  // a minority burn amber, most are cold starlight
}

export default function Starfield() {
  const theme = useTheme();
  const ref = useRef<HTMLCanvasElement>(null);
  const active = theme === "interstellar";

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let W = 0, H = 0;
    let stars: Star[] = [];
    let scrollY = 0;
    let tokens: ThemeTokens = readThemeTokens();
    const t0 = performance.now() / 1000;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = W < 768 ? 110 : 260;
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        depth: 0.2 + Math.random() * 0.8,
        twSpeed: 0.3 + Math.random() * 1.4,
        twPhase: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.16,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      // Accretion shimmer: a soft warm arc low-right, breathing slowly.
      const breathe = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.18);
      const gx = W * 0.86, gy = H * 0.82;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.5);
      grad.addColorStop(0, `rgba(232,179,104,${(0.05 + breathe * 0.03).toFixed(3)})`);
      grad.addColorStop(1, "rgba(232,179,104,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        // Parallax: nearer stars slide further as the page scrolls, wrapped.
        const py = ((s.y * H - scrollY * 0.05 * s.depth) % (H + 40) + (H + 40)) % (H + 40) - 20;
        const px = s.x * W;
        const tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * s.twSpeed + s.twPhase);
        const alpha = (0.12 + 0.5 * tw) * s.depth;
        const r = 0.4 + s.depth * 1.3;

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = s.warm
          ? `rgba(232,179,104,${alpha.toFixed(3)})`
          : `rgba(226,238,255,${alpha.toFixed(3)})`;
        ctx.fill();

        // The brightest near stars get a faint bloom
        if (s.depth > 0.82 && tw > 0.7) {
          const bloom = ctx.createRadialGradient(px, py, 0, px, py, r * 7);
          const c = s.warm ? "232,179,104" : "226,238,255";
          bloom.addColorStop(0, `rgba(${c},${(alpha * 0.28).toFixed(3)})`);
          bloom.addColorStop(1, `rgba(${c},0)`);
          ctx.fillStyle = bloom;
          ctx.beginPath();
          ctx.arc(px, py, r * 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // A whisper of the border colour along the very top, like a hull edge.
      ctx.fillStyle = tokens.border;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(0, 0, W, 1);
      ctx.globalAlpha = 1;
    };

    let last = 0;
    const loop = (now: number) => {
      if (!running) return;
      if (now - last >= 40) { last = now; draw(now / 1000 - t0); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onScroll = () => { scrollY = window.scrollY; };
    const onVisibility = () => (document.hidden ? stop() : start());

    init();
    if (reduce) {
      draw(0);
    } else {
      start();
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", init);
    const unwatch = watchThemeTokens((t) => { tokens = t; });

    return () => {
      stop();
      unwatch();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", init);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
