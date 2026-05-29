"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ── Meteor type ────────────────────────────────────────────────────────────────
interface Meteor {
  x: number; y: number;
  vx: number; vy: number;
  length: number;
  alpha: number;
  width: number;
  color: string; // "r,g,b"
}

function spawnMeteor(W: number, H: number, offsetX = 0): Meteor {
  const fromTop = Math.random() > 0.3;
  return {
    x: fromTop ? Math.random() * (W + 400) - offsetX : W + Math.random() * 60,
    y: fromTop ? -(Math.random() * 140) : Math.random() * H * 0.55,
    vx: -(Math.random() * 9 + 5),
    vy:   Math.random() * 4.5 + 1.5,
    length: Math.random() * 140 + 45,
    alpha:  Math.random() * 0.55 + 0.35,
    width:  Math.random() * 2.4 + 0.4,
    color:
      Math.random() > 0.6
        ? "180,255,180"
        : Math.random() > 0.5
        ? "255,255,255"
        : "100,200,110",
  };
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function IntroLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nameVisible, setNameVisible] = useState(false);
  const [exiting,     setExiting]     = useState(false);
  const [gone,        setGone]        = useState(false);

  // Lifecycle: show once per browser session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("introShown")) {
      setGone(true);
      return;
    }
    sessionStorage.setItem("introShown", "1");

    const t1 = setTimeout(() => setNameVisible(true), 380);
    const t2 = setTimeout(() => setExiting(true),     3500);
    const t3 = setTimeout(() => setGone(true),        4300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Canvas meteor storm
  useEffect(() => {
    if (gone) return;
    const c = canvasRef.current;
    if (!c) return;

    const setSize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    setSize();
    window.addEventListener("resize", setSize);

    const ctx = c.getContext("2d")!;
    // Stagger initial positions so meteors are spread across the screen on load
    const meteors: Meteor[] = Array.from({ length: 38 }, (_, i) =>
      spawnMeteor(c.width, c.height, i * (c.width / 38) * 0.6)
    );

    let raf: number;
    let frame = 0;

    const tick = () => {
      frame++;
      const { width: W, height: H } = c;

      // Partial-fill trail technique: dark bg with ~25% opacity each frame
      // creates smooth fading tails on top of the explicit gradient
      ctx.fillStyle = "rgba(0,5,0,0.28)";
      ctx.fillRect(0, 0, W, H);

      meteors.forEach((m, idx) => {
        m.x += m.vx;
        m.y += m.vy;

        // Respawn off-screen meteors
        if (m.x < -m.length - 80 || m.y > H + 80) {
          meteors[idx] = spawnMeteor(W, H);
          return;
        }

        // Velocity-direction unit vector for tail
        const spd = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const nx  = m.vx / spd;
        const ny  = m.vy / spd;
        const tx  = m.x - nx * m.length; // tail end
        const ty  = m.y - ny * m.length;

        // Gradient streak tail
        const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
        g.addColorStop(0,   `rgba(${m.color},0)`);
        g.addColorStop(0.6, `rgba(${m.color},${m.alpha * 0.3})`);
        g.addColorStop(1,   `rgba(${m.color},${m.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = g;
        ctx.lineWidth   = m.width;
        ctx.lineCap     = "round";
        ctx.stroke();

        // Bright head glow
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.width * 6);
        glow.addColorStop(0, `rgba(${m.color},${m.alpha * 0.9})`);
        glow.addColorStop(1, `rgba(${m.color},0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });

      // Occasional density bursts
      if (frame % 12 === 0 && meteors.length < 52) {
        for (let i = 0; i < 2; i++) meteors.push(spawnMeteor(W, H));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", setSize); };
  }, [gone]);

  if (gone) return null;

  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: "#000500" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      {/* Meteor canvas — sits behind the name */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Name centred over the storm */}
      <div className="relative z-10 text-center select-none pointer-events-none px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: nameVisible ? 1 : 0, y: nameVisible ? 0 : 24 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {/* Eyebrow label */}
          <p
            className="text-[9px] tracking-[0.45em] uppercase mb-7"
            style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}
          >
            // portfolio
          </p>

          {/* Name — two lines, massive serif */}
          <h1
            className="font-light leading-[0.95]"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(3.8rem, 14vw, 11rem)",
              color: "#E6EDF3",
              letterSpacing: "0.18em",
              textShadow:
                "0 0 60px rgba(0,255,65,0.25), 0 0 120px rgba(0,255,65,0.10)",
            }}
          >
            BINAY
            <br />
            SIDDHARTH
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: nameVisible ? 1 : 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: EASE }}
            className="mt-7 text-[11px] tracking-[0.28em] uppercase"
            style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}
          >
            Data &amp; GenAI &nbsp;·&nbsp; Sydney
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-8 mx-auto rounded-full overflow-hidden"
            style={{
              width: "160px",
              height: "1px",
              background: "rgba(0,255,65,0.12)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: nameVisible ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#00FF41" }}
              initial={{ width: "0%" }}
              animate={{ width: exiting ? "100%" : nameVisible ? "70%" : "0%" }}
              transition={{
                duration: exiting ? 0.55 : 2.6,
                ease: exiting ? "easeIn" : "easeOut",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
