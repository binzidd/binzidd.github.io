"use client";

import { useEffect, useRef } from "react";
import { readThemeTokens, watchThemeTokens, type ThemeTokens } from "@/lib/theme";

// ─── Australia coastline polygons (lon, lat) ────────────────────────────────
const MAINLAND: [number, number][] = [
  [142.5, -10.7], [143.6, -14.0], [145.3, -15.0], [145.8, -17.0], [146.3, -18.9],
  [148.7, -20.2], [149.5, -22.3], [150.8, -23.5], [152.9, -25.3], [153.2, -27.5],
  [153.6, -28.7], [152.5, -32.3], [151.3, -33.9], [150.1, -36.3], [149.9, -37.5],
  [147.8, -37.9], [146.3, -39.0], [144.7, -38.3], [143.5, -38.8], [141.3, -38.3],
  [139.7, -37.2], [139.8, -36.0], [138.6, -35.6], [137.6, -35.1], [136.9, -34.5],
  [135.7, -34.9], [134.8, -33.3], [132.5, -32.0], [131.0, -31.5], [128.0, -32.0],
  [125.9, -32.3], [123.5, -33.9], [121.9, -33.8], [119.9, -33.9], [117.9, -35.0],
  [115.0, -34.4], [114.9, -33.5], [115.7, -33.2], [115.7, -31.8], [114.6, -28.5],
  [114.1, -27.7], [113.4, -26.1], [113.4, -24.4], [113.8, -22.1], [114.1, -21.8],
  [115.5, -21.5], [116.7, -20.6], [119.5, -20.0], [121.0, -19.6], [122.2, -18.1],
  [122.3, -17.0], [123.5, -16.4], [123.8, -15.2], [125.2, -14.5], [126.0, -14.2],
  [127.5, -14.2], [128.2, -15.4], [129.6, -14.9], [129.8, -13.6], [130.8, -12.4],
  [132.6, -12.1], [132.5, -11.3], [134.2, -12.0], [135.4, -12.1], [136.9, -12.3],
  [136.4, -13.8], [135.4, -14.7], [136.0, -15.9], [137.0, -16.5], [139.0, -17.3],
  [140.8, -17.4], [141.4, -16.1], [141.5, -15.0], [141.6, -13.0], [142.2, -11.4],
];
const TASMANIA: [number, number][] = [
  [144.7, -40.7], [146.4, -41.2], [148.3, -40.9], [148.3, -42.2], [147.9, -43.2],
  [146.9, -43.6], [145.5, -42.9], [145.2, -42.2], [144.7, -41.2],
];
const SYDNEY: [number, number] = [151.21, -33.87];

const C_LON = 133, C_LAT = -26.5;
const COS_LAT = Math.cos((27 * Math.PI) / 180);
const SPAN_X = 42 * COS_LAT;
const SPAN_Y = 35;
const FOV = 900;

const DRAW_START = 0.6;   // seconds before pen-on-paper starts
const DRAW_DUR   = 1.8;   // seconds to draw both shapes

export default function AustraliaDataField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let visible = true;
    let W = 0, H = 0, scale = 1, cx = 0, cy = 0;
    let tiltX = 0, tiltY = 0, tgtTX = 0, tgtTY = 0;
    let isMobile = false;
    let tokens: ThemeTokens = readThemeTokens();
    const t0 = performance.now() / 1000;

    // Cached projected perimeters (recomputed on resize)
    let mainlandLen = 0;
    let tasmaniaLen = 0;

    const lonLatToWorld = (lon: number, lat: number): [number, number] => [
      (lon - C_LON) * COS_LAT * scale,
      -(lat - C_LAT) * scale,
    ];

    const project = (x: number, y: number) => {
      const bx = isMobile ? 0.20 : 0.25;
      const rx = bx + tiltX, ry = tiltY;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 =  y * cosX;
      const z1 =  y * sinX;
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 =  x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const s = FOV / (FOV + z2);
      return { px: cx + x1 * s, py: cy + y1 * s };
    };

    // Trace polygon onto the current path
    const tracePoly = (poly: [number, number][]) => {
      const [lon0, lat0] = poly[0];
      const { px: x0, py: y0 } = project(...lonLatToWorld(lon0, lat0));
      ctx.moveTo(x0, y0);
      for (let i = 1; i < poly.length; i++) {
        const { px, py } = project(...lonLatToWorld(poly[i][0], poly[i][1]));
        ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    // Compute projected perimeter (px) of a polygon
    const polyLen = (poly: [number, number][]): number => {
      let len = 0;
      let prev = project(...lonLatToWorld(poly[poly.length - 1][0], poly[poly.length - 1][1]));
      for (const [lon, lat] of poly) {
        const cur = project(...lonLatToWorld(lon, lat));
        const dx = cur.px - prev.px, dy = cur.py - prev.py;
        len += Math.sqrt(dx * dx + dy * dy);
        prev = cur;
      }
      return len;
    };

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth  || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      isMobile = W < 768;
      scale = Math.min((W * 0.85) / SPAN_X, (H * 0.62) / SPAN_Y);
      cx = W / 2;
      cy = H * 0.54;
      // Pre-compute polygon perimeters after layout
      mainlandLen = polyLen(MAINLAND);
      tasmaniaLen = polyLen(TASMANIA);
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      if (isMobile) {
        tgtTX = Math.sin(t * 0.35) * 0.03;
        tgtTY = Math.sin(t * 0.22) * 0.05;
      }
      tiltX += (tgtTX - tiltX) * 0.055;
      tiltY += (tgtTY - tiltY) * 0.055;

      // Ease-out quad progress 0→1 over DRAW_DUR
      const raw = Math.min(Math.max((t - DRAW_START) / DRAW_DUR, 0), 1);
      const prog = reduceMotion ? 1 : 1 - Math.pow(1 - raw, 2);  // ease-out quad

      if (prog <= 0) return;

      // Total combined length — mainland first, then Tasmania
      const total = mainlandLen + tasmaniaLen;

      // How many px drawn so far
      const drawn = prog * total;

      // ── Mainland ──────────────────────────────────────────────────────────
      const mDrawn = Math.min(drawn, mainlandLen);
      if (mDrawn > 0) {
        ctx.save();
        ctx.beginPath();
        tracePoly(MAINLAND);
        // Only stroke the portion we've drawn
        ctx.setLineDash([mDrawn, mainlandLen * 2]);
        ctx.lineDashOffset = 0;

        // Outer glow
        ctx.strokeStyle = `rgba(${tokens.accentRgb},0.08)`;
        ctx.lineWidth = 3.5;
        ctx.lineJoin = "round";
        ctx.stroke();

        // Sharp inner line
        ctx.beginPath();
        tracePoly(MAINLAND);
        ctx.setLineDash([mDrawn, mainlandLen * 2]);
        ctx.strokeStyle = `rgba(${tokens.accentRgb},0.22)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      // ── Tasmania (begins when mainland reaches ~80%) ───────────────────────
      const tasStart = mainlandLen * 0.80;
      const tDrawn = Math.max(0, drawn - tasStart);
      if (tDrawn > 0) {
        const td = Math.min(tDrawn, tasmaniaLen);
        ctx.save();
        ctx.beginPath();
        tracePoly(TASMANIA);
        ctx.setLineDash([td, tasmaniaLen * 2]);
        ctx.lineDashOffset = 0;

        ctx.strokeStyle = `rgba(${tokens.accentRgb},0.08)`;
        ctx.lineWidth = 3.5;
        ctx.lineJoin = "round";
        ctx.stroke();

        ctx.beginPath();
        tracePoly(TASMANIA);
        ctx.setLineDash([td, tasmaniaLen * 2]);
        ctx.strokeStyle = `rgba(${tokens.accentRgb},0.22)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      // ── Sydney beacon (appears when drawing is >85% done) ─────────────────
      if (prog > 0.85) {
        const fade = Math.min((prog - 0.85) / 0.15, 1);
        const { px, py } = project(...lonLatToWorld(SYDNEY[0], SYDNEY[1]));

        if (!reduceMotion) {
          for (const off of [0, 0.5]) {
            const ph = (t * 0.55 + off) % 1;
            ctx.beginPath();
            ctx.arc(px, py, 4 + ph * 28, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${tokens.accentRgb},${((1 - ph) * 0.28 * fade).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tokens.accentRgb},${(0.90 * fade).toFixed(3)})`;
        ctx.setLineDash([]);
        ctx.fill();

        const lx = px + 14, ly = py - 14;
        ctx.strokeStyle = `rgba(${tokens.accentRgb},${(0.45 * fade).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(px + 3, py - 3);
        ctx.lineTo(lx, ly);
        ctx.lineTo(lx + 8, ly);
        ctx.stroke();
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(${tokens.accentRgb},${(0.75 * fade).toFixed(3)})`;
        ctx.fillText("SYD // home_base", lx + 12, ly + 3);
      }
    };

    let last = 0;
    const loop = (now: number) => {
      if (!running) return;
      if (now - last >= 33) { last = now; drawFrame(now / 1000 - t0); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onMouse = (e: MouseEvent) => {
      if (isMobile) return;
      tgtTX = ((e.clientY / window.innerHeight) - 0.5) *  0.10;
      tgtTY = ((e.clientX / window.innerWidth)  - 0.5) * -0.16;
    };
    const onResize     = () => { init(); if (reduceMotion) drawFrame(100); };
    const onVisibility = () => (document.hidden ? stop() : start());

    init();
    if (reduceMotion) {
      drawFrame(100);
    } else {
      start();
      window.addEventListener("mousemove", onMouse);
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);
    const unwatch = watchThemeTokens((t) => { tokens = t; });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduceMotion) return;
      if (visible) start(); else stop();
    });
    io.observe(canvas);

    return () => {
      stop();
      unwatch();
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
