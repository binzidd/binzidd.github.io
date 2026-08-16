"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
type Effect = "lumos" | "nox" | "patronum" | "alohomora" | null;
interface Toast { label: string; message: string }

// ── Spell registry ─────────────────────────────────────────────────────────────
const SPELLS: { trigger: string; effect: Effect; label: string; message: string }[] = [
  { trigger: "lumos",            effect: "lumos",     label: "✨ Lumos!",             message: "Let there be light." },
  { trigger: "nox",              effect: "nox",       label: "🌑 Nox.",               message: "Darkness restored. As it should be." },
  { trigger: "expecto patronum", effect: "patronum",  label: "🦌 Expecto Patronum!",  message: "A silver stag erupts from your keyboard." },
  { trigger: "alohomora",        effect: "alohomora", label: "🔓 Alohomora!",         message: "The door swings open." },
  { trigger: "accio",            effect: null,        label: "🪄 Accio!",             message: "Summoning charm cast. Nothing moved. Probably not a wizard." },
  { trigger: "obliviate",        effect: null,        label: "😶 Obliviate.",         message: "Memory charm cast. You'll forget this... just kidding." },
  { trigger: "mischief managed", effect: null,        label: "🗺️ Mischief Managed.", message: "The Marauder's Map goes blank." },
];

// ── Lumos: falling light shower ───────────────────────────────────────────────
function LumosCanvas({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const particles = Array.from({ length: 240 }, () => ({
      x: Math.random() * c.width,
      y: -(Math.random() * 400),
      size: Math.random() * 3.5 + 0.8,
      vy: Math.random() * 4.5 + 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpd: (Math.random() - 0.5) * 0.07,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const TOTAL = 170;
    let f = 0;
    let raf: number;

    const tick = () => {
      f++;
      const t = f / TOTAL;
      ctx.clearRect(0, 0, c.width, c.height);

      // Screen brightening arc
      const glow = Math.sin(t * Math.PI) * 0.28;
      ctx.fillStyle = `rgba(255,252,210,${glow})`;
      ctx.fillRect(0, 0, c.width, c.height);

      const fadeOut = t > 0.62 ? Math.max(0, (1 - t) / 0.38) : 1;

      particles.forEach((p) => {
        p.y += p.vy;
        p.wobble += p.wobbleSpd;
        p.x += Math.sin(p.wobble) * 0.7;
        const a = p.alpha * fadeOut;
        if (a < 0.01) return;

        // Soft halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        g.addColorStop(0, `rgba(255,252,180,${a * 0.45})`);
        g.addColorStop(1, "rgba(255,252,180,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,230,${a})`;
        ctx.fill();
      });

      if (f < TOTAL) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 198 }} />;
}

// ── Nox: dark wind blow ────────────────────────────────────────────────────────
function NoxCanvas({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const streaks = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width * 1.4 - c.width * 0.2,
      y: Math.random() * c.height,
      len: Math.random() * 220 + 60,
      vx: Math.random() * 16 + 7,
      vy: (Math.random() - 0.5) * 2,
      w: Math.random() * 2.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      dark: Math.random() > 0.5 ? "0,0,20" : "20,0,40",
    }));

    const dust = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 3.5 + 0.5,
      vx: Math.random() * 9 + 5,
      vy: (Math.random() - 0.5) * 2.5,
      alpha: Math.random() * 0.45 + 0.1,
    }));

    const TOTAL = 140;
    let f = 0;
    let raf: number;

    const tick = () => {
      f++;
      const t = f / TOTAL;
      ctx.clearRect(0, 0, c.width, c.height);

      // Dark veil pulse
      const veil = Math.sin(t * Math.PI) * 0.42;
      ctx.fillStyle = `rgba(0,0,12,${veil})`;
      ctx.fillRect(0, 0, c.width, c.height);

      const fade = t > 0.68 ? Math.max(0, (1 - t) / 0.32) : 1;

      streaks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x > c.width + 400) s.x = -400;
        const a = s.alpha * fade;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.vy * 4);
        ctx.strokeStyle = `rgba(${s.dark},${a})`;
        ctx.lineWidth = s.w;
        ctx.stroke();
      });

      dust.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x > c.width + 20) d.x = -20;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(5,0,25,${d.alpha * fade})`;
        ctx.fill();
      });

      if (f < TOTAL) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 198 }} />;
}

// ── Patronum: forked lightning ─────────────────────────────────────────────────
function drawBolt(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  levels: number,
  alpha: number,
) {
  if (levels <= 0) {
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(140,180,255,${alpha * 0.9})`;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(215,235,255,${alpha})`;
    ctx.lineWidth = Math.max(0.5, alpha * 2.5);
    ctx.stroke();
    ctx.shadowBlur = 0;
    return;
  }
  const spread = 100 * (levels / 4);
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * spread;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * spread;
  drawBolt(ctx, x1, y1, mx, my, levels - 1, alpha);
  drawBolt(ctx, mx, my, x2, y2, levels - 1, alpha);
  if (levels >= 2 && Math.random() < 0.35) {
    drawBolt(ctx, mx, my,
      mx + (Math.random() - 0.5) * 280,
      my + Math.random() * 260,
      levels - 2, alpha * 0.5);
  }
}

function PatronumCanvas({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    // Pre-seed bolt endpoints so they're consistent per frame
    const bolts = Array.from({ length: 5 }, (_, i) => ({
      x1: (0.1 + Math.random() * 0.8) * c.width,
      y1: 0,
      x2: (0.1 + Math.random() * 0.8) * c.width,
      y2: c.height,
      startF: Math.floor(i * 8 + Math.random() * 6),
    }));

    const TOTAL = 120;
    let f = 0;
    let raf: number;

    const tick = () => {
      f++;
      const t = f / TOTAL;
      ctx.clearRect(0, 0, c.width, c.height);

      // Initial silver-white flash
      if (f < 14) {
        ctx.fillStyle = `rgba(200,220,255,${(1 - f / 14) * 0.55})`;
        ctx.fillRect(0, 0, c.width, c.height);
      }

      bolts.forEach((b) => {
        const rel = f - b.startF;
        if (rel <= 0) return;
        const prog = rel / (TOTAL - b.startF);
        const a = Math.max(0, Math.sin(prog * Math.PI)) * 0.92;
        if (a < 0.02) return;
        drawBolt(ctx, b.x1, b.y1, b.x2, b.y2, 4, a);
      });

      if (f < TOTAL) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 198 }} />;
}

// ── Alohomora: 3D door opening ────────────────────────────────────────────────
function AlohomoraOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("open"),    120);
    const t2 = setTimeout(() => setPhase("closing"), 2600);
    const t3 = setTimeout(onDone,                    3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const leftRot  = phase === "open" ? -88 : 0;
  const rightRot = phase === "open" ?  88 : 0;
  const dur      = phase === "closed" ? 0 : phase === "open" ? 1.25 : 1.1;

  const panelBase = {
    position: "absolute" as const,
    top: 0,
    height: "100%",
    background: "repeating-linear-gradient(90deg, #1A0B03 0px, #251005 28px, #2E1408 28px, #1A0B03 56px)",
    pointerEvents: "none" as const,
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 199, perspective: "1100px", perspectiveOrigin: "50% 50%" }}
    >
      {/* Magical glow visible as door opens */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(var(--c-accent-rgb),0.14) 0%, rgba(0,180,50,0.05) 55%, transparent 80%)",
          opacity: phase === "open" ? 1 : 0,
          transition: "opacity 0.7s ease 0.5s",
        }}
      />

      {/* Left door panel */}
      <div
        style={{
          ...panelBase,
          left: 0,
          width: "50%",
          transformOrigin: "left center",
          transform: `rotateY(${leftRot}deg)`,
          transition: `transform ${dur}s cubic-bezier(0.4, 0, 0.2, 1)`,
          borderRight: "3px solid #7A5520",
          boxShadow: "inset -8px 0 28px rgba(0,0,0,0.7), 8px 0 40px rgba(0,0,0,0.95)",
        }}
      >
        {/* Knocker / handle */}
        <div style={{ position: "absolute", top: "48%", right: "10%", transform: "translateY(-50%)" }}>
          <div style={{ width: 20, height: 42, background: "#9B7820", borderRadius: 10, boxShadow: "0 0 14px rgba(210,170,40,0.6)" }} />
        </div>
        {/* Panel inset */}
        <div style={{ position: "absolute", top: "14%", left: "10%", right: "10%", bottom: "14%", border: "3px solid rgba(120,85,32,0.45)", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: "20%", left: "16%", right: "16%", bottom: "20%", border: "2px solid rgba(90,60,20,0.3)", borderRadius: 2 }} />
      </div>

      {/* Right door panel */}
      <div
        style={{
          ...panelBase,
          right: 0,
          width: "50%",
          transformOrigin: "right center",
          transform: `rotateY(${rightRot}deg)`,
          transition: `transform ${dur}s cubic-bezier(0.4, 0, 0.2, 1)`,
          borderLeft: "3px solid #7A5520",
          boxShadow: "inset 8px 0 28px rgba(0,0,0,0.7), -8px 0 40px rgba(0,0,0,0.95)",
        }}
      >
        <div style={{ position: "absolute", top: "48%", left: "10%", transform: "translateY(-50%)" }}>
          <div style={{ width: 20, height: 42, background: "#9B7820", borderRadius: 10, boxShadow: "0 0 14px rgba(210,170,40,0.6)" }} />
        </div>
        <div style={{ position: "absolute", top: "14%", left: "10%", right: "10%", bottom: "14%", border: "3px solid rgba(120,85,32,0.45)", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: "20%", left: "16%", right: "16%", bottom: "20%", border: "2px solid rgba(90,60,20,0.3)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
export default function HarryPotterEggs() {
  const [buffer, setBuffer] = useState("");
  const [effect, setEffect] = useState<Effect>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    console.log(
      "%c⚡  I solemnly swear that I am up to no good.  ⚡",
      "color: gold; font-size: 14px; font-family: serif; font-weight: bold; padding: 4px 0;"
    );
    console.log(
      "%cType a spell anywhere on the page (outside input fields) to cast it. Try: lumos · nox · expecto patronum · alohomora",
      "color: #27F4D2; font-size: 11px; font-family: monospace;"
    );
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  // Global keypress buffer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === " ") { setBuffer((b) => (b + " ").slice(-25)); return; }
      if (e.key.length !== 1) return;
      setBuffer((b) => (b + e.key.toLowerCase()).slice(-25));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Match buffer against spell triggers
  useEffect(() => {
    for (const spell of SPELLS) {
      if (buffer.endsWith(spell.trigger)) {
        setBuffer("");
        setToast({ label: spell.label, message: spell.message });
        if (spell.effect && !effect) setEffect(spell.effect);
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buffer]);

  const clearEffect = () => setEffect(null);

  return (
    <>
      {effect === "lumos"     && <LumosCanvas     onDone={clearEffect} />}
      {effect === "nox"       && <NoxCanvas       onDone={clearEffect} />}
      {effect === "patronum"  && <PatronumCanvas  onDone={clearEffect} />}
      {effect === "alohomora" && <AlohomoraOverlay onDone={clearEffect} />}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.label}
            initial={{ opacity: 0, y: 36, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.94 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[210] px-6 py-4 rounded-2xl select-none"
            style={{
              background: "rgba(0,5,0,0.94)",
              border: "1px solid rgba(var(--c-accent-rgb),0.25)",
              boxShadow: "0 0 32px rgba(var(--c-accent-rgb),0.12), 0 12px 40px rgba(0,0,0,0.7)",
              backdropFilter: "blur(16px)",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <p className="text-xl mb-1.5" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--c-accent)", letterSpacing: "0.02em" }}>
              {toast.label}
            </p>
            <p className="text-[11px]" style={{ color: "rgba(var(--c-accent-rgb),0.55)", fontFamily: "var(--font-mono), monospace" }}>
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
