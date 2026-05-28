"use client";

import { useEffect, useRef } from "react";

// ─── Domain colour palette ────────────────────────────────────────────────
// Green = data/analytics  |  Cyan = HCI/design  |  Violet = GenAI  |  Amber = leadership
const PALETTE: [number, number, number][] = [
  [0,   255,  65],   // data — matrix green   (40 %)
  [0,   255,  65],
  [0,   217, 255],   // HCI  — electric cyan  (25 %)
  [0,   217, 255],
  [170, 100, 255],   // GenAI — soft violet   (20 %)
  [0,   255,  65],
  [0,   217, 255],
  [240, 167,  66],   // leadership — warm amber (15 %)
  [170, 100, 255],
  [0,   255,  65],
];

interface P {
  x: number; y: number; z: number;   // world position
  ox: number; oy: number;            // equilibrium (gentle spring)
  vx: number; vy: number; vz: number;
  r: number;                          // base visual radius
  col: [number, number, number];
}

const FOV   = 680;
const Z_MIN = 70;
const Z_MAX = 1000;

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function newParticle(w: number, h: number, randomZ: boolean): P {
  const ox = rand(-w * 0.65, w * 0.65);
  const oy = rand(-h * 0.65, h * 0.65);
  return {
    x: ox, y: oy,
    z: randomZ ? rand(Z_MIN, Z_MAX) : Z_MAX,
    ox, oy,
    vx: rand(-0.22, 0.22),
    vy: rand(-0.22, 0.22),
    vz: rand(-0.45, -0.18),   // drift toward viewer
    r:  rand(0.9, 2.2),
    col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
  };
}

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let particles: P[] = [];
    let tiltX = 0, tiltY = 0;       // current camera tilt (rad)
    let tgtX  = 0, tgtY  = 0;       // mouse-tracked target tilt
    let tick  = 0;                   // time counter for mobile oscillation
    let isMobile = false;

    // ── init / resize ────────────────────────────────────────────────────────
    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile = canvas.width < 768;
      const N = isMobile ? 55 : 120;
      particles = Array.from({ length: N }, () =>
        newParticle(canvas.width, canvas.height, true)
      );
    };

    // ── perspective projection with camera tilt ───────────────────────────
    const project = (px: number, py: number, pz: number) => {
      // rotateX  (up/down tilt)
      const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
      const ry  =  py * cx - pz * sx;
      const rz1 =  py * sx + pz * cx;
      // rotateY  (left/right tilt)
      const cy2 = Math.cos(tiltY), sy2 = Math.sin(tiltY);
      const rx  =  px * cy2 + rz1 * sy2;
      const rz2 = -px * sy2 + rz1 * cy2;
      const z = Math.max(rz2, 30);
      const s = FOV / z;
      return { sx: canvas.width / 2 + rx * s, sy: canvas.height / 2 + ry * s, sz: z };
    };

    // ── draw loop ─────────────────────────────────────────────────────────
    let last = 0;
    const draw = (now: number) => {
      if (now - last < 34) { raf = requestAnimationFrame(draw); return; }
      last = now;
      tick += 0.009;

      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Camera tilt: smooth follow on desktop, gentle sine on mobile
      if (isMobile) {
        tiltX = Math.sin(tick * 0.55) * 0.07;
        tiltY = Math.sin(tick * 0.38) * 0.11;
      } else {
        tiltX += (tgtX - tiltX) * 0.045;
        tiltY += (tgtY - tiltY) * 0.045;
      }

      // Project & cull
      type Pt = { sx: number; sy: number; sz: number; alpha: number; rad: number; col: [number,number,number] };
      const pts: Pt[] = [];
      for (const p of particles) {
        if (p.z < Z_MIN || p.z > Z_MAX + 300) continue;
        const { sx, sy, sz } = project(p.x, p.y, p.z);
        if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) continue;
        const depth = 1 - (sz - Z_MIN) / (Z_MAX - Z_MIN);   // 0=far, 1=close
        const alpha = 0.10 + depth * 0.50;
        const rad   = Math.max(0.5, p.r * (0.35 + depth * 1.8) * (FOV / sz) * 0.026);
        pts.push({ sx, sy, sz, alpha, rad, col: p.col });
      }

      // Back-to-front sort (painter's algorithm)
      pts.sort((a, b) => b.sz - a.sz);

      // ── Connection threads (desktop only) ──────────────────────────────
      if (!isMobile) {
        const CDIST = 145;
        ctx.lineWidth = 0.6;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          for (let j = i + 1; j < pts.length; j++) {
            const b = pts[j];
            const dx = a.sx - b.sx, dy = a.sy - b.sy;
            const d2 = dx * dx + dy * dy;
            if (d2 > CDIST * CDIST) continue;
            const d = Math.sqrt(d2);
            const la = (1 - d / CDIST) * 0.18 * Math.min(a.alpha, b.alpha);
            const [r, g, bl] = a.col;
            ctx.strokeStyle = `rgba(${r},${g},${bl},${la.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // ── Particles ────────────────────────────────────────────────────────
      for (const p of pts) {
        const [r, g, b] = p.col;
        // outer glow halo
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.rad * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${(p.alpha * 0.08).toFixed(3)})`;
        ctx.fill();
        // inner glow
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.rad * 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${(p.alpha * 0.22).toFixed(3)})`;
        ctx.fill();
        // bright core
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha.toFixed(3)})`;
        ctx.fill();
      }

      // ── Advance physics ───────────────────────────────────────────────────
      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.z  += p.vz;
        // spring back toward equilibrium (gentle float)
        p.vx += (p.ox - p.x) * 0.00035;
        p.vy += (p.oy - p.y) * 0.00035;
        p.vx *= 0.998;
        p.vy *= 0.998;
        // wrap z: reset to far when particle passes through viewer
        if (p.z < Z_MIN) {
          p.z  = Z_MAX;
          p.x  = rand(-W * 0.65, W * 0.65);
          p.y  = rand(-H * 0.65, H * 0.65);
          p.ox = p.x;
          p.oy = p.y;
          p.col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        }
      }

      raf = requestAnimationFrame(draw);
    };

    // ── Mouse tracking for desktop camera tilt ────────────────────────────
    const onMouse = (e: MouseEvent) => {
      if (isMobile) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      tgtX = ((e.clientY - cy) / cy) * 0.13;
      tgtY = ((e.clientX - cx) / cx) * -0.20;
    };

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
