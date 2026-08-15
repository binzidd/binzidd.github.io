"use client";

/**
 * SkillPhysics
 * ------------
 * Replaces self-assigned percentage bars with a real rigid-body simulation.
 *
 * The physics is honest, not eased CSS:
 *   - semi-implicit (symplectic) Euler on a fixed 1/120s timestep with an accumulator,
 *     so behaviour is frame-rate independent and stable under load
 *   - discs with mass m = density * pi * r^2 and moment of inertia I = 0.5 * m * r^2
 *   - sequential-impulse contact resolution: a normal impulse with restitution, then a
 *     tangential impulse clamped to the Coulomb friction cone (|jt| <= mu * jn)
 *   - contact-point velocities include the angular term (v + omega x r), so discs
 *     genuinely roll and spin down against each other and the floor
 *   - Baumgarte positional correction with slop, to stop sinking without jitter
 *   - velocity and angular sleeping thresholds so a settled pile actually rests
 *
 * Disc radius encodes depth of experience. There is no percentage anywhere:
 * "LangGraph 90%" is unfalsifiable, so it is shown as mass instead, which is a
 * claim about relative weight rather than an invented score.
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { skillCategories } from "@/data/resume";

const DT = 1 / 120;
const MAX_STEPS = 5;
const GRAVITY = 1750;
const RESTITUTION = 0.28;
const FRICTION = 0.42;
const LINEAR_DAMP = 0.995;
const ANGULAR_DAMP = 0.988;
const DENSITY = 0.0016;
const SOLVER_ITERATIONS = 8;
const CORRECTION = 0.7;
const SLOP = 0.4;
const SLEEP_LINEAR = 6;
const SLEEP_ANGULAR = 0.25;
const SLEEP_FRAMES = 40;

const CATEGORY_COLOURS: Record<string, string> = {
  "Generative AI": "#00FF41",
  "Data & BI": "#29B5E8",
  "Cloud & Infrastructure": "#FF9900",
  Leadership: "#E97627",
};

type Body = {
  label: string;
  colour: string;
  x: number; y: number;
  vx: number; vy: number;
  angle: number; omega: number;
  r: number; m: number; invM: number; i: number; invI: number;
  sleepFor: number;
  asleep: boolean;
};

function radiusForLevel(level: number) {
  const t = Math.max(0, Math.min(1, (level - 70) / 26));
  return 26 + t * 22;
}

function draw(ctx: CanvasRenderingContext2D, bodies: Body[], W: number, H: number) {
  ctx.clearRect(0, 0, W, H);
  for (const b of bodies) {
    ctx.save();
    ctx.translate(b.x, b.y);

    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fillStyle = b.colour + "14";
    ctx.fill();
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = b.asleep ? b.colour + "55" : b.colour;
    ctx.stroke();

    ctx.rotate(b.angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -b.r);
    ctx.strokeStyle = b.colour + "44";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.rotate(-b.angle);

    const label = b.label.length > 13 ? b.label.slice(0, 12) + "…" : b.label;
    ctx.fillStyle = "#C9D4DE";
    ctx.font = Math.max(8.5, Math.min(11, b.r / 3.6)) + "px var(--font-mono), monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 0);

    ctx.restore();
  }
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

export default function SkillPhysics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const bodiesRef = useRef<Body[]>([]);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<{ body: Body | null; px: number; py: number; lx: number; ly: number }>({
    body: null, px: 0, py: 0, lx: 0, ly: 0,
  });
  const shakeRef = useRef<() => void>(() => {});
  const reduced = useReducedMotion();
  const [gravityOn, setGravityOn] = useState(true);
  const gravityOnRef = useRef(true);
  useEffect(() => {
    gravityOnRef.current = gravityOn;
  }, [gravityOn]);

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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    bodiesRef.current = seed.map((s, idx) => {
      const m = DENSITY * Math.PI * s.r * s.r;
      const i = 0.5 * m * s.r * s.r;
      return {
        label: s.label,
        colour: s.colour,
        x: 40 + Math.random() * Math.max(1, W - 80),
        y: -60 - idx * 46 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 120,
        vy: 0,
        angle: Math.random() * Math.PI * 2,
        omega: (Math.random() - 0.5) * 2,
        r: s.r, m, invM: 1 / m, i, invI: 1 / i,
        sleepFor: 0,
        asleep: false,
      };
    });

    if (reduced) {
      const bodies = bodiesRef.current;
      let cx = 20, cy = H - 60, rowH = 0;
      for (const b of bodies) {
        if (cx + b.r * 2 > W - 20) { cx = 20; cy -= rowH + 12; rowH = 0; }
        b.x = cx + b.r; b.y = cy - b.r; b.angle = 0;
        cx += b.r * 2 + 10; rowH = Math.max(rowH, b.r * 2);
      }
      draw(ctx, bodies, W, H);
      return;
    }

    const wake = (b: Body) => { b.asleep = false; b.sleepFor = 0; };

    const integrate = () => {
      const g = gravityOnRef.current ? GRAVITY : 0;
      for (const b of bodiesRef.current) {
        if (b === dragRef.current.body || b.asleep) continue;
        b.vy += g * DT;
        b.vx *= LINEAR_DAMP;
        b.vy *= LINEAR_DAMP;
        b.omega *= ANGULAR_DAMP;
        b.x += b.vx * DT;
        b.y += b.vy * DT;
        b.angle += b.omega * DT;
      }
    };

    const resolve = (
      a: Body, b: Body | null,
      nx: number, ny: number, penetration: number,
      contactX: number, contactY: number
    ) => {
      const invMA = a === dragRef.current.body ? 0 : a.invM;
      const invIA = a === dragRef.current.body ? 0 : a.invI;
      const invMB = b ? (b === dragRef.current.body ? 0 : b.invM) : 0;
      const invIB = b ? (b === dragRef.current.body ? 0 : b.invI) : 0;
      const invSum = invMA + invMB;
      if (invSum === 0) return;

      const rax = contactX - a.x, ray = contactY - a.y;
      const rbx = b ? contactX - b.x : 0, rby = b ? contactY - b.y : 0;

      const vax = a.vx - a.omega * ray, vay = a.vy + a.omega * rax;
      const vbx = b ? b.vx - b.omega * rby : 0, vby = b ? b.vy + b.omega * rbx : 0;
      const rvx = vbx - vax, rvy = vby - vay;

      const velAlongNormal = rvx * nx + rvy * ny;
      if (velAlongNormal > 0) return;

      const raCrossN = rax * ny - ray * nx;
      const rbCrossN = rbx * ny - rby * nx;
      const denom = invSum + raCrossN * raCrossN * invIA + rbCrossN * rbCrossN * invIB;
      if (denom <= 0) return;

      const e = Math.abs(velAlongNormal) < 60 ? 0 : RESTITUTION;
      const jn = (-(1 + e) * velAlongNormal) / denom;

      const inx = jn * nx, iny = jn * ny;
      a.vx -= inx * invMA; a.vy -= iny * invMA;
      a.omega -= (rax * iny - ray * inx) * invIA;
      if (b) {
        b.vx += inx * invMB; b.vy += iny * invMB;
        b.omega += (rbx * iny - rby * inx) * invIB;
      }

      const tx = -ny, ty = nx;
      const vax2 = a.vx - a.omega * ray, vay2 = a.vy + a.omega * rax;
      const vbx2 = b ? b.vx - b.omega * rby : 0, vby2 = b ? b.vy + b.omega * rbx : 0;
      const rvt = (vbx2 - vax2) * tx + (vby2 - vay2) * ty;

      const raCrossT = rax * ty - ray * tx;
      const rbCrossT = rbx * ty - rby * tx;
      const denomT = invSum + raCrossT * raCrossT * invIA + rbCrossT * rbCrossT * invIB;
      if (denomT <= 0) return;

      let jt = -rvt / denomT;
      const maxFriction = FRICTION * jn;
      jt = Math.max(-maxFriction, Math.min(maxFriction, jt));

      const ftx = jt * tx, fty = jt * ty;
      a.vx -= ftx * invMA; a.vy -= fty * invMA;
      a.omega -= (rax * fty - ray * ftx) * invIA;
      if (b) {
        b.vx += ftx * invMB; b.vy += fty * invMB;
        b.omega += (rbx * fty - rby * ftx) * invIB;
      }

      const corr = (Math.max(penetration - SLOP, 0) / (invMA + invMB || 1)) * CORRECTION;
      a.x -= corr * invMA * nx; a.y -= corr * invMA * ny;
      if (b) { b.x += corr * invMB * nx; b.y += corr * invMB * ny; }

      wake(a); if (b) wake(b);
    };

    const collide = () => {
      const bodies = bodiesRef.current;
      for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], b = bodies[j];
            if (a.asleep && b.asleep) continue;
            const dx = b.x - a.x, dy = b.y - a.y;
            const rsum = a.r + b.r;
            const d2 = dx * dx + dy * dy;
            if (d2 >= rsum * rsum || d2 === 0) continue;
            const d = Math.sqrt(d2);
            const nx = dx / d, ny = dy / d;
            resolve(a, b, nx, ny, rsum - d, a.x + nx * a.r, a.y + ny * a.r);
          }
        }
        for (const b of bodies) {
          if (b.y + b.r > H) resolve(b, null, 0, 1, b.y + b.r - H, b.x, H);
          if (b.x - b.r < 0) resolve(b, null, -1, 0, b.r - b.x, 0, b.y);
          if (b.x + b.r > W) resolve(b, null, 1, 0, b.x + b.r - W, W, b.y);
        }
      }
    };

    const trySleep = () => {
      for (const b of bodiesRef.current) {
        if (b === dragRef.current.body) { b.sleepFor = 0; b.asleep = false; continue; }
        const speed = Math.hypot(b.vx, b.vy);
        if (speed < SLEEP_LINEAR && Math.abs(b.omega) < SLEEP_ANGULAR) {
          b.sleepFor++;
          if (b.sleepFor > SLEEP_FRAMES) { b.asleep = true; b.vx = 0; b.vy = 0; b.omega = 0; }
        } else {
          b.sleepFor = 0; b.asleep = false;
        }
      }
    };

    let last = performance.now();
    let acc = 0;
    const frame = (now: number) => {
      const elapsed = Math.min((now - last) / 1000, 0.25);
      last = now;
      acc += elapsed;
      let steps = 0;
      while (acc >= DT && steps < MAX_STEPS) {
        integrate();
        collide();
        trySleep();
        acc -= DT;
        steps++;
      }
      if (steps === MAX_STEPS) acc = 0;
      draw(ctx, bodiesRef.current, W, H);
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    const pointFrom = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      const { x, y } = pointFrom(e);
      let best: Body | null = null;
      let bestD = Infinity;
      for (const b of bodiesRef.current) {
        const d = Math.hypot(b.x - x, b.y - y);
        if (d < b.r && d < bestD) { bestD = d; best = b; }
      }
      if (best) {
        canvas.setPointerCapture(e.pointerId);
        dragRef.current = { body: best, px: x, py: y, lx: x, ly: y };
        wake(best);
      }
    };

    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.body) return;
      const { x, y } = pointFrom(e);
      d.lx = d.px; d.ly = d.py;
      d.px = x; d.py = y;
      d.body.x = x; d.body.y = y;
      d.body.vx = ((d.px - d.lx) / DT) * 0.12;
      d.body.vy = ((d.py - d.ly) / DT) * 0.12;
    };

    const onUp = (e: PointerEvent) => {
      const d = dragRef.current;
      if (d.body) {
        d.body.omega += (d.px - d.lx) * 0.05;
        wake(d.body);
      }
      d.body = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    shakeRef.current = () => {
      for (const b of bodiesRef.current) {
        b.asleep = false;
        b.sleepFor = 0;
        b.vx += (Math.random() - 0.5) * 900;
        b.vy -= 380 + Math.random() * 460;
        b.omega += (Math.random() - 0.5) * 12;
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      ro.disconnect();
    };
  }, [seed, reduced]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#020c02", border: "1px solid #003300" }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase"
             style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
            {"// skills.sim"}
          </p>
          <p className="text-xs mt-1" style={{ color: "#5A6570", fontFamily: "var(--font-inter), sans-serif" }}>
            Mass is depth, not a percentage. Grab one and throw it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setGravityOn((g) => !g)} aria-pressed={gravityOn}
            className="text-[10px] px-3 py-1.5 rounded-md transition-colors"
            style={{
              fontFamily: "var(--font-mono), monospace",
              color: gravityOn ? "#00FF41" : "#5A6570",
              border: "1px solid " + (gravityOn ? "#00FF41" : "#003300"),
              background: "transparent",
            }}>
            g = {gravityOn ? "9.8" : "0"}
          </button>
          <button onClick={() => shakeRef.current()}
            className="text-[10px] px-3 py-1.5 rounded-md"
            style={{
              fontFamily: "var(--font-mono), monospace",
              color: "#00FF41",
              border: "1px solid #003300",
              background: "transparent",
            }}>
            shake()
          </button>
        </div>
      </div>

      <div ref={wrapRef} className="relative w-full" style={{ height: 460 }}>
        <canvas ref={canvasRef} className="block w-full h-full touch-none cursor-grab active:cursor-grabbing" />
      </div>

      <div className="px-5 py-2.5 text-[10px] flex flex-wrap gap-x-5 gap-y-1"
        style={{ color: "#2F5D3A", fontFamily: "var(--font-mono), monospace", borderTop: "1px solid #003300" }}>
        <span>restitution {RESTITUTION}</span>
        <span>friction µ {FRICTION}</span>
        <span>Δt 1/120s</span>
        <span>{SOLVER_ITERATIONS} impulse iterations</span>
        <span>I = ½mr²</span>
      </div>
    </div>
  );
}
