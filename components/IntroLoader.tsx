"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Star ──────────────────────────────────────────────────────────────────────
interface Star {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  brightness: number;
  twinkle: number;   // current phase
  twinkleSpd: number;
}

function mkStar(W: number, H: number): Star {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16,
    size: Math.random() * 1.7 + 0.4,
    brightness: Math.random() * 0.65 + 0.25,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpd: Math.random() * 0.018 + 0.006,
  };
}

// ── Steps ─────────────────────────────────────────────────────────────────────
type Step = "welcome" | "name" | "feedback" | "thanks";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CRUMBS = [
  { key: "welcome",  label: "Welcome"   },
  { key: "name",     label: "Your Name" },
  { key: "feedback", label: "Feedback"  },
  { key: "thanks",   label: "Explore"   },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export default function IntroLoader() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: -999, y: -999 });

  const [step,    setStep]    = useState<Step>("welcome");
  const [nameVal, setNameVal] = useState("");
  const [fbVal,   setFbVal]   = useState("");
  const [vName,   setVName]   = useState("");    // confirmed visitor name
  const [exiting, setExiting] = useState(false);
  const [gone,    setGone]    = useState(false);

  // ── Once per session ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("introShown")) { setGone(true); return; }
    sessionStorage.setItem("introShown", "1");
    const t = setTimeout(() => setStep("name"), 1900);
    return () => clearTimeout(t);
  }, []);

  // ── Constellation canvas ──────────────────────────────────────────────────────
  useEffect(() => {
    if (gone) return;
    const c = canvasRef.current;
    if (!c) return;

    const onResize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    onResize();
    window.addEventListener("resize", onResize);

    const ctx = c.getContext("2d")!;
    const stars: Star[] = Array.from({ length: 100 }, () => mkStar(c.width, c.height));

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse);

    let raf: number;
    const CONNECT = 145;

    const tick = () => {
      const { width: W, height: H } = c;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#000500";
      ctx.fillRect(0, 0, W, H);

      const { x: mx, y: my } = mouseRef.current;

      // Update + mouse repulsion
      stars.forEach((s) => {
        s.twinkle += s.twinkleSpd;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > W) s.vx *= -1;
        if (s.y < 0 || s.y > H) s.vy *= -1;

        const dx = s.x - mx, dy = s.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110 && d > 0) {
          const f = ((110 - d) / 110) * 0.22;
          s.x += (dx / d) * f;
          s.y += (dy / d) * f;
        }
      });

      // Connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            const a = (1 - d / CONNECT) * 0.20;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(80,210,120,${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Stars
      stars.forEach((s) => {
        const tw = 0.65 + 0.35 * Math.sin(s.twinkle);
        const a  = s.brightness * tw;

        // Halo
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
        g.addColorStop(0, `rgba(160,255,190,${a * 0.45})`);
        g.addColorStop(1, "rgba(160,255,190,0)");
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,255,225,${a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [gone]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const submitName = () => {
    const n = nameVal.trim();
    if (!n) return;
    setVName(n);
    setStep("feedback");
  };

  const submitFeedback = () => {
    if (typeof window !== "undefined") {
      const entry = { name: vName, feedback: fbVal.trim(), at: new Date().toISOString() };
      try {
        const prev = JSON.parse(localStorage.getItem("portfolio_feedback") ?? "[]");
        localStorage.setItem("portfolio_feedback", JSON.stringify([...prev, entry]));
      } catch { /* ignore */ }
    }
    setStep("thanks");
    setTimeout(() => setExiting(true), 1600);
    setTimeout(() => setGone(true), 2400);
  };

  const skip = () => {
    setExiting(true);
    setTimeout(() => setGone(true), 800);
  };

  if (gone) return null;

  const crumbIdx = CRUMBS.findIndex((c) => c.key === step);

  const card = {
    background: "rgba(0,5,0,0.84)",
    border: "1px solid rgba(0,255,65,0.14)",
    backdropFilter: "blur(22px)",
    boxShadow: "0 0 80px rgba(0,255,65,0.05), 0 24px 60px rgba(0,0,0,0.65)",
  } as const;

  const inputBase = {
    color: "#00FF41",
    fontFamily: "var(--font-mono), monospace",
    caretColor: "#00FF41",
    background: "transparent",
    outline: "none",
    width: "100%",
  } as const;

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: "#000500" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-1.5 px-6 pt-7 md:px-10">
        {CRUMBS.map((c, i) => (
          <div key={c.key} className="flex items-center gap-1.5">
            <span
              className="text-[9px] tracking-[0.18em] uppercase transition-all duration-500"
              style={{
                fontFamily: "var(--font-mono), monospace",
                color:
                  i === crumbIdx
                    ? "#00FF41"
                    : i < crumbIdx
                    ? "rgba(0,255,65,0.38)"
                    : "rgba(0,255,65,0.14)",
              }}
            >
              {c.label}
            </span>
            {i < CRUMBS.length - 1 && (
              <span
                style={{
                  color:
                    i < crumbIdx
                      ? "rgba(0,255,65,0.3)"
                      : "rgba(0,255,65,0.1)",
                  fontSize: 9,
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                /
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait">

          {/* WELCOME */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.0, ease: EASE }}
              className="text-center select-none pointer-events-none"
            >
              <p
                className="text-[9px] tracking-[0.44em] uppercase mb-8"
                style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}
              >
                // portfolio
              </p>
              <h1
                className="font-light leading-[0.92]"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(3.5rem, 13vw, 9.5rem)",
                  color: "#E6EDF3",
                  letterSpacing: "0.16em",
                  textShadow:
                    "0 0 60px rgba(0,255,65,0.20), 0 0 120px rgba(0,255,65,0.07)",
                }}
              >
                BINAY
                <br />
                SIDDHARTH
              </h1>
              <p
                className="mt-7 text-[10px] tracking-[0.26em] uppercase"
                style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}
              >
                Data &amp; GenAI &nbsp;·&nbsp; Sydney
              </p>
            </motion.div>
          )}

          {/* NAME */}
          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl px-8 py-8" style={card}>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase mb-3"
                  style={{ color: "#004400", fontFamily: "var(--font-mono), monospace" }}
                >
                  // init_session
                </p>
                <h2
                  className="text-3xl md:text-4xl font-light mb-2 leading-tight"
                  style={{
                    color: "#E6EDF3",
                    fontFamily: "var(--font-cormorant), serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  Who are you?
                </h2>
                <p
                  className="text-[11px] mb-7"
                  style={{ color: "rgba(0,255,65,0.35)", fontFamily: "var(--font-mono), monospace" }}
                >
                  Enter your name to continue.
                </p>

                <input
                  autoFocus
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitName()}
                  placeholder="your_name"
                  className="text-sm pb-2 mb-7"
                  style={{
                    ...inputBase,
                    borderBottom: "1px solid rgba(0,255,65,0.22)",
                    fontSize: "0.875rem",
                  }}
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={submitName}
                    disabled={!nameVal.trim()}
                    className="px-6 py-2.5 rounded-full text-xs transition-all duration-200"
                    style={{
                      background: nameVal.trim() ? "#00FF41" : "rgba(0,255,65,0.08)",
                      color: nameVal.trim() ? "#000500" : "rgba(0,255,65,0.25)",
                      fontFamily: "var(--font-mono), monospace",
                      fontWeight: 500,
                    }}
                  >
                    continue →
                  </button>
                  <button
                    onClick={skip}
                    style={{ color: "rgba(0,255,65,0.2)", fontFamily: "var(--font-mono), monospace", fontSize: "0.625rem" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,255,65,0.45)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,255,65,0.2)"; }}
                  >
                    skip
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FEEDBACK */}
          {step === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl px-8 py-8" style={card}>
                <p
                  className="text-[9px] tracking-[0.25em] uppercase mb-3"
                  style={{ color: "#004400", fontFamily: "var(--font-mono), monospace" }}
                >
                  // hello_{vName.toLowerCase().replace(/\s+/g, "_")}
                </p>
                <h2
                  className="text-3xl md:text-4xl font-light mb-2 leading-tight"
                  style={{
                    color: "#E6EDF3",
                    fontFamily: "var(--font-cormorant), serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  Hi, {vName}!
                </h2>
                <p
                  className="text-[11px] mb-6"
                  style={{ color: "rgba(0,255,65,0.35)", fontFamily: "var(--font-mono), monospace" }}
                >
                  Quick feedback before you explore?
                </p>

                <textarea
                  autoFocus
                  value={fbVal}
                  onChange={(e) => setFbVal(e.target.value)}
                  placeholder="What brings you here? First impressions? Be honest..."
                  rows={4}
                  className="w-full text-xs rounded-lg p-3 mb-6 resize-none outline-none"
                  style={{
                    background: "rgba(0,255,65,0.03)",
                    border: "1px solid rgba(0,255,65,0.14)",
                    color: "#E6EDF3",
                    fontFamily: "var(--font-inter), sans-serif",
                    lineHeight: "1.65",
                    caretColor: "#00FF41",
                  }}
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={submitFeedback}
                    className="px-6 py-2.5 rounded-full text-xs transition-all duration-200"
                    style={{
                      background: "#00FF41",
                      color: "#000500",
                      fontFamily: "var(--font-mono), monospace",
                      fontWeight: 500,
                    }}
                  >
                    submit &amp; explore
                  </button>
                  <button
                    onClick={skip}
                    style={{ color: "rgba(0,255,65,0.2)", fontFamily: "var(--font-mono), monospace", fontSize: "0.625rem" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0,255,65,0.45)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,255,65,0.2)"; }}
                  >
                    skip
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* THANKS */}
          {step === "thanks" && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-center select-none pointer-events-none"
            >
              <p className="text-5xl mb-5">✨</p>
              <h2
                className="text-4xl md:text-5xl font-light mb-3"
                style={{
                  color: "#00FF41",
                  fontFamily: "var(--font-cormorant), serif",
                  letterSpacing: "0.06em",
                }}
              >
                Thanks, {vName}!
              </h2>
              <p
                className="text-[11px] tracking-[0.15em]"
                style={{ color: "rgba(0,255,65,0.38)", fontFamily: "var(--font-mono), monospace" }}
              >
                launching portfolio...
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
