"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion, animate, useMotionValue, useSpring, useTransform,
  useScroll, useMotionTemplate,
} from "framer-motion";
import AustraliaDataField from "@/components/AustraliaDataField";
import { smoothScrollTo } from "@/components/SmoothScroll";
import { useTheme } from "@/lib/theme";

const roles = [
  "Finance Engineering & Analytics",
  "Chapter Area Lead (Exec Manager) @ CBA",
  "Agentic AI, Shipped to Production",
  "12 Years in Data",
];

// num animates from 0; post renders with the big digits, suffix stays small
const stats = [
  { num: 12,   post: "",  suffix: " yrs", label: "Years in Data" },
  { num: 6,    post: "+", suffix: " yrs", label: "People Leadership" },
  { num: 2000, post: "",  suffix: "",     label: "SQL Weaver Users" },
  { num: 700,  post: "+", suffix: "",     label: "Metrics Governed" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Deterministic 0-1 from an integer. Used for per-letter scatter: Math.random()
// here would differ between SSR and hydration and desync the entrance.
function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Magnetic wrapper — element leans toward the cursor, springs back on leave
function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  return (
    <motion.div
      className="inline-block"
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.32);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), { stiffness: 420, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), { stiffness: 420, damping: 28 });

  // Count-up: digits roll from 0 as the card lands
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, stat.num, {
      duration: 1.5,
      delay: 1.2 + index * 0.08,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [stat.num, index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 + index * 0.08, duration: 0.6, ease: EASE }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 700,
        background: "rgba(var(--c-accent-rgb),0.04)",
        border: "1px solid rgba(var(--c-accent-rgb),0.1)",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ boxShadow: "0 8px 32px rgba(var(--c-accent-rgb),0.12), 0 0 0 1px rgba(var(--c-accent-rgb),0.2)" }}
      className="flex flex-col items-center px-5 py-3 rounded-xl cursor-default"
    >
      <span className="text-3xl md:text-4xl font-semibold tabular-nums" style={{ color: "var(--c-accent)", fontFamily: "var(--font-cormorant), serif" }}>
        {display}{stat.post}<span className="text-2xl">{stat.suffix}</span>
      </span>
      <span className="text-[10px] mt-1 text-center" style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.08em" }}>
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const theme = useTheme();
  const stellar = theme === "interstellar";
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  // Apple-style scroll exit: content recedes, blurs and fades as you leave
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.6], [0, 8]);
  const contentFilter = useMotionTemplate`blur(${blurPx}px)`;
  // The continent recedes at a different rate — depth between layers
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Mouse position for parallax (normalised -1 → 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 18 });

  // Three parallax depths — orbs at different "distances" move at different rates
  const orb1X = useTransform(smoothX, [-1, 1], [-22, 22]);
  const orb1Y = useTransform(smoothY, [-1, 1], [-14, 14]);
  const orb2X = useTransform(smoothX, [-1, 1], [34, -34]);
  const orb2Y = useTransform(smoothY, [-1, 1], [22, -22]);
  const orb3X = useTransform(smoothX, [-1, 1], [-12, 12]);
  const orb3Y = useTransform(smoothY, [-1, 1], [8, -8]);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < currentRole.length) {
        timeout = setTimeout(() => setDisplayed(currentRole.slice(0, displayed.length + 1)), stellar ? 72 : 55);
      } else {
        timeout = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), stellar ? 38 : 30);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIndex, stellar]);

  const nameLetters = "Binay Siddharth".split("");

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dot-grid"
      style={{ background: "var(--c-bg)" }}
      onMouseMove={(e) => {
        mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}
    >
      {/* Glow orbs — outer motion.div handles parallax, inner div keeps float animation */}
      <motion.div className="absolute pointer-events-none" style={{ x: orb1X, y: orb1Y, top: "-150px", right: "-100px" }}>
        <div className="orb-1 rounded-full" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(var(--c-accent-rgb),0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </motion.div>
      <motion.div className="absolute pointer-events-none" style={{ x: orb2X, y: orb2Y, bottom: "80px", left: "-80px" }}>
        <div className="orb-2 rounded-full" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(var(--c-accent-alt-rgb),0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </motion.div>
      <motion.div className="absolute pointer-events-none" style={{ x: orb3X, y: orb3Y, top: "40%", left: "60%" }}>
        <div className="orb-3 rounded-full" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(var(--c-accent-rgb),0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </motion.div>

      {/* Horizontal scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: ["0%", "100vh"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--c-accent-rgb),0.04), transparent)" }} />
      </div>

      {/* Australia rendered as ~1,000 live data points — assembles behind the name */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: mapY, opacity: mapOpacity, zIndex: 2 }}>
        <AustraliaDataField />
      </motion.div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ scale: contentScale, y: contentY, opacity: contentOpacity, filter: contentFilter }}
      >
        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, var(--c-accent))" }} />
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--c-accent)", fontFamily: "var(--font-mono), monospace" }}>
            Sydney, Australia // Data &amp; GenAI
          </span>
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, var(--c-accent), transparent)" }} />
        </motion.div>

        {/* Name.
            matrix       letters fold in from below via rotateX, mechanical and in step.
            interstellar letters converge out of scattered drift through a blur, as if
                         light from different distances arriving at once. Offsets are
                         hashed from the index, not random, so SSR and client agree. */}
        <div className="mb-4" style={{ fontFamily: "var(--font-cormorant), serif", perspective: "1000px" }}>
          <div className="flex justify-center flex-wrap" style={{ transformStyle: "preserve-3d" }}>
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={stellar
                  ? {
                      opacity: 0,
                      y: (hash(i) - 0.5) * 90,
                      x: (hash(i + 41) - 0.5) * 46,
                      filter: "blur(14px)",
                      scale: 0.88,
                    }
                  : { opacity: 0, y: 50, rotateX: -55 }}
                animate={stellar
                  ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)", scale: 1 }
                  : { opacity: 1, y: 0, rotateX: 0 }}
                transition={stellar
                  ? { delay: 0.35 + hash(i + 7) * 0.5, duration: 1.5, ease: EASE }
                  : { delay: 0.4 + i * 0.03, duration: 0.75, ease: EASE }}
                whileHover={letter !== " " ? {
                  rotateY: 18,
                  color: "var(--c-accent)",
                  textShadow: "0 0 40px rgba(var(--c-accent-rgb),0.65)",
                  transition: { duration: 0.18 },
                } : undefined}
                className={`text-7xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight inline-block ${letter === " " ? "w-6" : ""}`}
                style={{ color: "var(--c-text)", transformStyle: "preserve-3d" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Typewriter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.5 }}
          className="h-12 flex items-center justify-center mb-12">
          <span className="text-base md:text-xl" style={{ color: "var(--c-muted)", fontFamily: "var(--font-mono), monospace" }}>
            <span style={{ color: "var(--c-dim)" }}>{stellar ? "\u25B8 " : "> "}</span>
            <span style={{ color: "var(--c-accent)" }}>{displayed}</span>
            {stellar ? (
              // A soft transponder pulse rather than a hard terminal caret
              <motion.span
                className="inline-block rounded-full ml-1.5 align-middle"
                style={{ width: 7, height: 7, background: "var(--c-accent)" }}
                animate={{ opacity: [0.25, 1, 0.25], boxShadow: [
                  "0 0 0px rgba(var(--c-accent-rgb),0)",
                  "0 0 12px rgba(var(--c-accent-rgb),0.85)",
                  "0 0 0px rgba(var(--c-accent-rgb),0)",
                ] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <span className="cursor-blink inline-block w-[2px] h-5 ml-0.5 align-middle" style={{ background: "var(--c-accent)" }} />
            )}
          </span>
        </motion.div>

        {/* Stats — each card tilts independently in 3D */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>

        {/* CTAs — magnetic: they lean toward the cursor */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <button onClick={() => { const el = document.getElementById("timeline"); if (el) smoothScrollTo(el); }}
              className="px-7 py-3 rounded-full text-sm font-medium transition-shadow duration-300"
              style={{ background: "var(--c-accent)", color: "var(--c-bg)", fontFamily: "var(--font-mono), monospace" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 28px rgba(var(--c-accent-rgb),0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
              ./explore_work
            </button>
          </Magnetic>
          <Magnetic>
            <a href="https://linkedin.com/in/binaysiddharth" target="_blank" rel="noopener noreferrer"
              className="inline-block px-7 py-3 rounded-full text-sm font-medium transition-colors duration-300"
              style={{ border: "1px solid var(--c-border)", color: "var(--c-muted)", fontFamily: "var(--font-mono), monospace" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(var(--c-accent-rgb),0.3)"; e.currentTarget.style.color = "var(--c-accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-border)"; e.currentTarget.style.color = "var(--c-muted)"; }}>
              connect --linkedin
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono), monospace" }}>scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(var(--c-accent-rgb),0.27), transparent)" }} />
      </motion.div>
    </section>
  );
}
