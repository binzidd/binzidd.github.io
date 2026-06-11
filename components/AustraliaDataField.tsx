"use client";

import { useEffect, useRef } from "react";

// ─── Simplified Australia coastline (lon, lat) ─────────────────────────────
// Verified by ASCII render: Cape York, Gulf of Carpentaria, Great Australian
// Bight and Tasmania all read correctly at this vertex density.
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

// Map projection constants — equirectangular, x compressed by cos(mean lat)
const C_LON = 133, C_LAT = -26.5;
const COS_LAT = Math.cos((27 * Math.PI) / 180);
const SPAN_X = 42 * COS_LAT;   // ≈ 37.4 projected degrees wide
const SPAN_Y = 35;             // degrees tall
const FOV = 900;

// Colour rhythm — mostly matrix green, occasional cyan / violet accents
const COLORS: [number, number, number][] = [
  [0, 255, 65], [0, 255, 65], [0, 255, 65], [0, 255, 65], [0, 255, 65],
  [0, 255, 65], [0, 255, 65], [0, 255, 65], [0, 217, 255], [170, 100, 255],
];

function inPoly(poly: [number, number][], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

interface Pt {
  tx: number; ty: number;          // target world position (px, map plane)
  ax: number; ay: number; az: number; // assembly start (scattered)
  delay: number;                    // assembly stagger (s)
  bright: number;                   // base alpha tier
  twSpeed: number; twPhase: number; // twinkle
  col: [number, number, number];
}

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
    let pts: Pt[] = [];
    let W = 0, H = 0, scale = 1, cx = 0, cy = 0;
    let tiltX = 0, tiltY = 0, tgtTX = 0, tgtTY = 0;
    let isMobile = false;
    const t0 = performance.now() / 1000;
    const ASSEMBLE_START = 0.7;   // wait for the name letters to land first
    const ASSEMBLE_DUR = 1.15;    // per-point flight time
    const ASSEMBLE_SPREAD = 1.0;  // west→east stagger window

    const lonLatToWorld = (lon: number, lat: number): [number, number] => [
      (lon - C_LON) * COS_LAT * scale,
      -(lat - C_LAT) * scale,
    ];

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      isMobile = W < 768;
      scale = Math.min((W * 0.82) / SPAN_X, (H * 0.58) / SPAN_Y);
      cx = W / 2;
      cy = H * 0.56;

      // Hex-offset grid filled into the coastline polygons, jittered
      const target = isMobile ? 420 : 950;
      const step = Math.sqrt((42 * 35 * 0.5) / target);
      pts = [];
      let row = 0;
      for (let lat = -44; lat <= -9; lat += step, row++) {
        const off = row % 2 === 0 ? 0 : step / 2;
        for (let lon = 112 + off; lon <= 154; lon += step) {
          const jLon = lon + (Math.random() - 0.5) * step * 0.55;
          const jLat = lat + (Math.random() - 0.5) * step * 0.55;
          if (!inPoly(MAINLAND, jLon, jLat) && !inPoly(TASMANIA, jLon, jLat)) continue;
          const [tx, ty] = lonLatToWorld(jLon, jLat);
          const i = pts.length;
          const ang = Math.random() * Math.PI * 2;
          const dist = 320 + Math.random() * 720;
          pts.push({
            tx, ty,
            ax: tx + Math.cos(ang) * dist,
            ay: ty + Math.sin(ang) * dist,
            az: (Math.random() - 0.5) * 900,
            delay: ((jLon - 112) / 42) * ASSEMBLE_SPREAD + Math.random() * 0.3,
            bright: i % 7 === 0 ? 0.85 : i % 3 === 0 ? 0.5 : 0.3,
            twSpeed: 0.6 + Math.random() * 1.6,
            twPhase: Math.random() * Math.PI * 2,
            col: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
      }
    };

    const project = (x: number, y: number, z: number) => {
      const bx = isMobile ? 0.34 : 0.4;
      const rx = bx + tiltX, ry = tiltY;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const s = FOV / (FOV + z2);
      return { px: cx + x1 * s, py: cy + y1 * s, s };
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      // Smooth mouse-follow tilt; gentle autonomous sway on mobile
      if (isMobile) {
        tgtTX = Math.sin(t * 0.35) * 0.05;
        tgtTY = Math.sin(t * 0.22) * 0.09;
      }
      tiltX += (tgtTX - tiltX) * 0.055;
      tiltY += (tgtTY - tiltY) * 0.055;

      const tAssemble = t - ASSEMBLE_START;
      const assembled = tAssemble > ASSEMBLE_SPREAD + ASSEMBLE_DUR + 0.3;

      for (const p of pts) {
        // Assembly: scattered → home with cubic ease-out
        let x = p.tx, y = p.ty, z = 0, e = 1;
        if (!reduceMotion && !assembled) {
          const lp = Math.min(Math.max((tAssemble - p.delay) / ASSEMBLE_DUR, 0), 1);
          e = 1 - Math.pow(1 - lp, 3);
          x = p.ax + (p.tx - p.ax) * e;
          y = p.ay + (p.ty - p.ay) * e;
          z = p.az * (1 - e);
        }
        // Living surface: slow ripple across the continent once formed
        if (!reduceMotion) {
          z += Math.sin(t * 1.2 + p.tx * 0.012 + p.ty * 0.017) * 13 * e;
        }

        const { px, py, s } = project(x, y, z);
        const tw = reduceMotion ? 1 : 0.78 + 0.22 * Math.sin(t * p.twSpeed + p.twPhase);
        const alpha = p.bright * tw * (0.3 + 0.7 * e);
        const rad = (0.9 + p.bright * 1.5) * s;
        const [r, g, b] = p.col;

        if (p.bright > 0.6) {
          ctx.beginPath();
          ctx.arc(px, py, rad * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.12).toFixed(3)})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Sydney beacon — appears once the continent has formed
      const tBeacon = t - (ASSEMBLE_START + ASSEMBLE_SPREAD + ASSEMBLE_DUR);
      if (reduceMotion || tBeacon > 0) {
        const fade = reduceMotion ? 1 : Math.min(tBeacon / 0.7, 1);
        const [wx, wy] = lonLatToWorld(SYDNEY[0], SYDNEY[1]);
        const { px, py, s } = project(wx, wy, 0);

        // expanding sonar rings
        if (!reduceMotion) {
          for (const off of [0, 0.5]) {
            const ph = ((t * 0.55 + off) % 1);
            ctx.beginPath();
            ctx.arc(px, py, (3 + ph * 30) * s, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,255,65,${((1 - ph) * 0.4 * fade).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        // core dot
        ctx.beginPath();
        ctx.arc(px, py, 3.2 * s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,65,${(0.95 * fade).toFixed(3)})`;
        ctx.fill();
        // callout
        const lx = px + 14, ly = py - 14;
        ctx.strokeStyle = `rgba(0,255,65,${(0.45 * fade).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 4, py - 4);
        ctx.lineTo(lx, ly);
        ctx.lineTo(lx + 8, ly);
        ctx.stroke();
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(0,255,65,${(0.85 * fade).toFixed(3)})`;
        ctx.fillText("SYD // home_base", lx + 12, ly + 3);
      }
    };

    // ── RAF loop, capped ~30fps, paused when offscreen ───────────────────
    let last = 0;
    const loop = (now: number) => {
      if (!running) return;
      if (now - last >= 33) {
        last = now;
        drawFrame(now / 1000 - t0);
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMouse = (e: MouseEvent) => {
      if (isMobile) return;
      tgtTX = ((e.clientY / window.innerHeight) - 0.5) * 0.18;
      tgtTY = ((e.clientX / window.innerWidth) - 0.5) * -0.26;
    };
    const onResize = () => {
      init();
      if (reduceMotion) drawFrame(100);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    init();
    if (reduceMotion) {
      drawFrame(100); // single static frame — continent fully formed
    } else {
      start();
      window.addEventListener("mousemove", onMouse);
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduceMotion) return;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    return () => {
      stop();
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
