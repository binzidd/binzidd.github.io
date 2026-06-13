"use client";

import { useEffect, useRef } from "react";

// Ambient "data fireflies" — slow-drifting glowing motes at three parallax
// depths, reacting to scroll and mouse. Inspired by environmental portfolio
// sites (logartis.info): the page should feel inhabited, never static.

interface Fly {
  x: number;          // base position, viewport fraction 0–1
  y: number;
  depth: number;      // 0.25 (far) – 1 (near): drives parallax, size, alpha
  driftAmp: number;   // px of sinusoidal wander
  driftSpeed: number;
  phase: number;
  pulseSpeed: number;
  hue: "green" | "cyan";
}

export default function DataFireflies() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let W = 0, H = 0;
    let flies: Fly[] = [];
    let scrollY = 0;
    let mx = 0.5, my = 0.5;         // eased mouse, viewport fraction
    let tmx = 0.5, tmy = 0.5;
    const t0 = performance.now() / 1000;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = W < 768 ? 26 : 54;
      flies = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        depth: 0.25 + Math.random() * 0.75,
        driftAmp: 14 + Math.random() * 30,
        driftSpeed: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.4 + Math.random() * 0.9,
        hue: Math.random() < 0.88 ? "green" : "cyan",
      }));
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;

      for (const f of flies) {
        const d = f.depth;
        // Sinusoidal wander on two axes
        const wx = Math.sin(t * f.driftSpeed * 2 + f.phase) * f.driftAmp;
        const wy = Math.cos(t * f.driftSpeed * 1.4 + f.phase * 1.7) * f.driftAmp * 0.7;
        // Scroll parallax: nearer flies sweep faster, wrapped to viewport
        const py = ((f.y * H - scrollY * 0.06 * d + wy) % (H + 80) + (H + 80)) % (H + 80) - 40;
        const px = f.x * W + wx + (mx - 0.5) * 36 * d;

        const pulse = 0.55 + 0.45 * Math.sin(t * f.pulseSpeed + f.phase);
        const alpha = (0.10 + 0.26 * pulse) * d;
        const r = (0.8 + 1.3 * d) * (0.8 + 0.4 * pulse);
        const [cr, cg, cb] = f.hue === "green" ? [0, 255, 65] : [0, 217, 255];

        // Soft halo
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${(alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    let last = 0;
    const loop = (now: number) => {
      if (!running) return;
      if (now - last >= 33) { last = now; drawFrame(now / 1000 - t0); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onScroll = () => { scrollY = window.scrollY; };
    const onMouse = (e: MouseEvent) => {
      tmx = e.clientX / window.innerWidth;
      tmy = e.clientY / window.innerHeight;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    init();
    start();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", init);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", init);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
