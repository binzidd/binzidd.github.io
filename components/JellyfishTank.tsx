"use client";

/**
 * JellyfishTank
 * -------------
 * The "throw them around" playground, reimagined: instead of discs settling
 * into a gravity pile, skills drift as jellyfish in open water.
 *
 * This is soft-body flocking, not rigid-body collision:
 *   - buoyancy lifts each jellyfish, with a rhythmic bell-pulse kick riding on top
 *   - layered sine drift stands in for water current/turbulence (no noise lib
 *     in this project, so summed sines at different frequencies per jelly)
 *   - same-category jellyfish feel a gentle cohesion pull toward their
 *     neighbours' centroid, so colour schools emerge and drift together
 *     without ever hard-stacking on top of one another
 *   - overlap is resolved with a soft spring push, not an elastic impulse
 *   - canvas edges push back softly, like tank walls, instead of bouncing
 *
 * Bell radius still encodes depth (mass, not a percentage) exactly as the
 * disc version did. Every physics term below is exposed as a slider so a
 * visitor can detune the tank live — sliders mutate a ref the animation
 * loop reads each frame, so dragging them never re-mounts or resets the sim.
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { skillCategories } from "@/data/resume";

const DT = 1 / 60;
const MAX_STEPS = 5;

const CATEGORY_COLOURS: Record<string, string> = {
  "Generative AI": "#00FF41",
  "Data & BI": "#29B5E8",
  "Cloud & Infrastructure": "#FF9900",
  Leadership: "#E97627",
};

function radiusForLevel(level: number) {
  const t = Math.max(0, Math.min(1, (level - 70) / 26));
  return 22 + t * 20;
}

type Jelly = {
  label: string;
  colour: string;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  phase: number;       // per-jelly offset so the tank never looks synchronised
  pulseRate: number;   // per-jelly slight variance on bell-pulse speed
  pulseT: number;      // running pulse clock
};

// Slider-controlled constants, mutated live without restarting the sim.
type Params = {
  buoyancy: number;   // upward drift + pulse-kick strength
  current: number;    // ambient turbulence (water current)
  schooling: number;  // same-colour cohesion strength
  drag: number;       // water resistance / damping
  pulse: number;      // bell pulse frequency
};

const DEFAULT_PARAMS: Params = {
  buoyancy: 0.5,
  current: 0.45,
  schooling: 0.55,
  drag: 0.5,
  pulse: 0.5,
};

const SLIDERS: { key: keyof Params; label: string }[] = [
  { key: "buoyancy", label: "buoyancy" },
  { key: "current", label: "current" },
  { key: "schooling", label: "schooling" },
  { key: "drag", label: "drag" },
  { key: "pulse", label: "pulse_rate" },
];

const SCHOOL_RADIUS = 190;

function drawJelly(
  ctx: CanvasRenderingContext2D,
  j: Jelly,
  t: number,
  animated: boolean,
) {
  const pulsePhase = animated ? j.pulseT : Math.PI * 0.5;
  const breathe = 1 + 0.1 * Math.sin(pulsePhase);
  const bellR = j.r;
  const bellH = j.r * 0.72 * breathe;

  ctx.save();
  ctx.translate(j.x, j.y);

  // Bioluminescent glow
  const glow = ctx.createRadialGradient(0, -bellH * 0.2, 0, 0, 0, bellR * 2.1);
  glow.addColorStop(0, j.colour + "22");
  glow.addColorStop(1, j.colour + "00");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, bellR * 2.1, 0, Math.PI * 2);
  ctx.fill();

  // Tentacles — behind the bell, wavy trailing strands
  const tentacleCount = 5;
  for (let i = 0; i < tentacleCount; i++) {
    const spread = (i - (tentacleCount - 1) / 2) / tentacleCount;
    const baseX = spread * bellR * 1.5;
    const len = bellR * (1.5 + 0.3 * Math.abs(spread));
    ctx.beginPath();
    ctx.moveTo(baseX, bellH * 0.35);
    const segs = 5;
    for (let s = 1; s <= segs; s++) {
      const frac = s / segs;
      const sway = animated
        ? Math.sin(t * 1.6 + j.phase + frac * 3.4 + i) * (6 + frac * 10)
        : 0;
      ctx.lineTo(baseX + sway, bellH * 0.35 + len * frac);
    }
    ctx.strokeStyle = j.colour;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Bell — rounded dome with a soft rippling skirt
  ctx.beginPath();
  ctx.moveTo(-bellR, 0);
  ctx.quadraticCurveTo(-bellR, -bellH * 1.5, 0, -bellH * 1.5);
  ctx.quadraticCurveTo(bellR, -bellH * 1.5, bellR, 0);
  const skirtSegs = 6;
  for (let s = 1; s <= skirtSegs; s++) {
    const frac = s / skirtSegs;
    const px = bellR - frac * bellR * 2;
    const ripple = animated ? Math.sin(t * 2.2 + j.phase + frac * 6) * 3 : 0;
    ctx.lineTo(px, bellH * 0.18 + ripple);
  }
  ctx.closePath();

  const bellGrad = ctx.createLinearGradient(0, -bellH * 1.5, 0, bellH * 0.2);
  bellGrad.addColorStop(0, j.colour + "33");
  bellGrad.addColorStop(1, j.colour + "0c");
  ctx.fillStyle = bellGrad;
  ctx.fill();
  ctx.lineWidth = 1.25;
  ctx.strokeStyle = j.colour + "aa";
  ctx.stroke();

  // Label
  const label = j.label.length > 13 ? j.label.slice(0, 12) + "…" : j.label;
  ctx.fillStyle = "#EAF2F6";
  ctx.font = Math.max(8.5, Math.min(11, bellR / 3.2)) + "px var(--font-mono), monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, -bellH * 0.5);

  ctx.restore();
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Subscribes to the OS reduced-motion setting without setState-in-effect. */
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOTION_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false
  );
}

export default function JellyfishTank() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const jelliesRef = useRef<Jelly[]>([]);
  const rafRef = useRef<number | null>(null);
  const bubblesRef = useRef<{ x: number; y: number; r: number; speed: number; drift: number }[]>([]);
  const dragRef = useRef<{
    jelly: Jelly | null; px: number; py: number; lx: number; ly: number;
    pointerId: number | null; lastT: number;
  }>({
    jelly: null, px: 0, py: 0, lx: 0, ly: 0, pointerId: null, lastT: 0,
  });
  const reduced = useReducedMotion();
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const paramsRef = useRef(params);
  useEffect(() => { paramsRef.current = params; }, [params]);

  const seed = useMemo(
    () =>
      skillCategories.flatMap((c) =>
        c.skills.map((s) => ({
          label: s.name,
          colour: CATEGORY_COLOURS[c.name] ?? "#00FF41",
          r: radiusForLevel(s.level),
        }))
      ),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = wrap.clientWidth;
    let H = wrap.clientHeight;
    const t0 = performance.now() / 1000;

    const seedTank = () => {
      jelliesRef.current = seed.map((s) => ({
        label: s.label,
        colour: s.colour,
        x: 30 + Math.random() * Math.max(1, W - 60),
        y: 30 + Math.random() * Math.max(1, H - 60),
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        r: s.r,
        phase: Math.random() * Math.PI * 2,
        pulseRate: 0.8 + Math.random() * 0.5,
        pulseT: Math.random() * Math.PI * 2,
      }));
      bubblesRef.current = Array.from({ length: 22 }, () => ({
        x: Math.random() * Math.max(1, W),
        y: Math.random() * Math.max(1, H),
        r: 1 + Math.random() * 2.5,
        speed: 12 + Math.random() * 22,
        drift: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) {
        layoutReduced();
        drawStatic();
      }
    };

    const layoutReduced = () => {
      const jellies = jelliesRef.current;
      let cx = 30, cy = 40, rowH = 0;
      for (const j of jellies) {
        if (cx + j.r * 2 > W - 30) { cx = 30; cy += rowH + 26; rowH = 0; }
        j.x = cx + j.r; j.y = cy + j.r;
        cx += j.r * 2 + 18; rowH = Math.max(rowH, j.r * 2.4);
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (const j of jelliesRef.current) drawJelly(ctx, j, 0, false);
    };

    seedTank();
    resize();

    if (reduced) {
      layoutReduced();
      drawStatic();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      return () => ro.disconnect();
    }

    let running = false;

    const step = (t: number) => {
      const p = paramsRef.current;
      const jellies = jelliesRef.current;
      const dragged = dragRef.current.jelly;

      for (const j of jellies) {
        if (j === dragged) continue;

        j.pulseT += DT * j.pulseRate * (0.5 + p.pulse * 1.5);
        // Pulse-kick: an upward thrust concentrated in the bell-contraction phase
        const kick = Math.max(0, Math.cos(j.pulseT)) * p.buoyancy * 46;
        j.vy -= (kick + p.buoyancy * 8) * DT;

        // Ambient current — layered sines stand in for turbulence/noise
        j.vx += (Math.sin(t * 0.7 + j.phase * 3) + Math.sin(t * 0.31 + j.phase * 5) * 0.6)
          * p.current * 26 * DT;
        j.vy += (Math.sin(t * 0.5 + j.phase * 2) * 0.7)
          * p.current * 18 * DT;

        // Schooling — pull gently toward the centroid of same-colour neighbours
        let cx = 0, cy = 0, n = 0;
        for (const other of jellies) {
          if (other === j || other.colour !== j.colour) continue;
          const dx = other.x - j.x, dy = other.y - j.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < SCHOOL_RADIUS * SCHOOL_RADIUS) { cx += other.x; cy += other.y; n++; }
        }
        if (n > 0) {
          cx /= n; cy /= n;
          j.vx += (cx - j.x) * p.schooling * 0.35 * DT;
          j.vy += (cy - j.y) * p.schooling * 0.35 * DT;
        }
      }

      // Soft repulsion so bodies never truly overlap, regardless of colour
      for (let i = 0; i < jellies.length; i++) {
        for (let k = i + 1; k < jellies.length; k++) {
          const a = jellies[i], b = jellies[k];
          if (a === dragged || b === dragged) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          const rsum = (a.r + b.r) * 0.85;
          const d2 = dx * dx + dy * dy;
          if (d2 >= rsum * rsum || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const overlap = rsum - d;
          const nx = dx / d, ny = dy / d;
          const push = overlap * 2.2 * DT;
          a.vx -= nx * push; a.vy -= ny * push;
          b.vx += nx * push; b.vy += ny * push;
        }
      }

      for (const j of jellies) {
        if (j === dragged) continue;
        // Soft tank walls
        const margin = j.r * 1.1;
        if (j.x < margin) j.vx += (margin - j.x) * 3 * DT;
        if (j.x > W - margin) j.vx -= (j.x - (W - margin)) * 3 * DT;
        if (j.y < margin) j.vy += (margin - j.y) * 3 * DT;
        if (j.y > H - margin) j.vy -= (j.y - (H - margin)) * 3 * DT;

        const damp = 1 - Math.min(0.95, p.drag * 0.12);
        j.vx *= damp; j.vy *= damp;
        j.vx = Math.max(-260, Math.min(260, j.vx));
        j.vy = Math.max(-260, Math.min(260, j.vy));
        j.x += j.vx * DT;
        j.y += j.vy * DT;
      }

      for (const bub of bubblesRef.current) {
        bub.y -= bub.speed * DT;
        bub.x += Math.sin(t * 0.8 + bub.drift) * 8 * DT;
        if (bub.y < -10) { bub.y = H + 10; bub.x = Math.random() * W; }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(180,220,235,0.5)";
      for (const bub of bubblesRef.current) {
        ctx.beginPath();
        ctx.arc(bub.x, bub.y, bub.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const j of jelliesRef.current) drawJelly(ctx, j, t, true);
    };

    let last = performance.now();
    let acc = 0;
    const frame = (now: number) => {
      if (!running) return;
      const elapsed = Math.min((now - last) / 1000, 0.25);
      last = now;
      acc += elapsed;
      let steps = 0;
      while (acc >= DT && steps < MAX_STEPS) {
        step(now / 1000 - t0);
        acc -= DT;
        steps++;
      }
      if (steps === MAX_STEPS) acc = 0;
      draw(now / 1000 - t0);
      rafRef.current = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      rafRef.current = requestAnimationFrame(frame);
    };
    const stop = () => { running = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };

    const pointFrom = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      if (dragRef.current.jelly) return;
      const { x, y } = pointFrom(e);
      let best: Jelly | null = null;
      let bestD = Infinity;
      for (const j of jelliesRef.current) {
        const d = Math.hypot(j.x - x, j.y - y);
        if (d < j.r * 1.3 && d < bestD) { bestD = d; best = j; }
      }
      if (best) {
        canvas.setPointerCapture(e.pointerId);
        dragRef.current = {
          jelly: best, px: x, py: y, lx: x, ly: y,
          pointerId: e.pointerId, lastT: performance.now(),
        };
      }
    };

    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.jelly || e.pointerId !== d.pointerId) return;
      const { x, y } = pointFrom(e);
      const now = performance.now();
      const dt = Math.max((now - d.lastT) / 1000, 1 / 240);
      d.lastT = now;
      d.lx = d.px; d.ly = d.py;
      d.px = x; d.py = y;
      d.jelly.x = x; d.jelly.y = y;
      d.jelly.vx = ((d.px - d.lx) / dt) * 0.12;
      d.jelly.vy = ((d.py - d.ly) / dt) * 0.12;
    };

    const onUp = (e: PointerEvent) => {
      const d = dragRef.current;
      if (e.pointerId !== d.pointerId) return;
      d.jelly = null;
      d.pointerId = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [seed, reduced]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#020c02", border: "1px solid #003300" }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase"
             style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
            {"// skills.tank"}
          </p>
          <p className="text-xs mt-1" style={{ color: "#5A6570", fontFamily: "var(--font-inter), sans-serif" }}>
            Bell size is depth, not a percentage. Grab one — or detune the water.
          </p>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative w-full"
        style={{
          height: 460,
          background: "linear-gradient(180deg, #041b2e 0%, #06283f 45%, #072a3a 100%)",
        }}
      >
        <canvas ref={canvasRef} className="block w-full h-full touch-none cursor-grab active:cursor-grabbing" />
      </div>

      <div className="px-5 py-4 flex flex-wrap gap-x-6 gap-y-3" style={{ borderTop: "1px solid #003300" }}>
        {SLIDERS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-[10px]"
            style={{ color: "#5A6570", fontFamily: "var(--font-mono), monospace" }}>
            <span className="w-16 flex-shrink-0">{label}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={params[key]}
              onChange={(e) => setParams((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))}
              className="jelly-slider"
              style={{ width: 90, accentColor: "#00FF41" }}
              aria-label={label}
            />
          </label>
        ))}
        <button
          onClick={() => setParams(DEFAULT_PARAMS)}
          className="text-[10px] px-3 py-1 rounded-md ml-auto"
          style={{ fontFamily: "var(--font-mono), monospace", color: "#00FF41", border: "1px solid #003300", background: "transparent" }}
        >
          reset()
        </button>
      </div>
    </div>
  );
}
