"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useMotionTemplate } from "framer-motion";

const roles = [
  "Data & Analytics Lead",
  "HCI-Driven Leader",
  "Chapter Area Lead @ CBA",
  "AI Engineering Lead",
];

const stats = [
  { value: "9", suffix: " yrs", label: "Analytics Experience" },
  { value: "5+", suffix: " yrs", label: "People Leadership" },
  { value: "200+", suffix: "", label: "GenAI Users Onboarded" },
  { value: "3×", suffix: "", label: "AWS Certified" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), { stiffness: 420, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), { stiffness: 420, damping: 28 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 + index * 0.08, duration: 0.6, ease: EASE }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 700,
        background: "rgba(0,255,65,0.04)",
        border: "1px solid rgba(0,255,65,0.1)",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ boxShadow: "0 8px 32px rgba(0,255,65,0.12), 0 0 0 1px rgba(0,255,65,0.2)" }}
      className="flex flex-col items-center px-5 py-3 rounded-xl cursor-default"
    >
      <span className="text-3xl md:text-4xl font-semibold" style={{ color: "#00FF41", fontFamily: "var(--font-cormorant), serif" }}>
        {stat.value}<span className="text-2xl">{stat.suffix}</span>
      </span>
      <span className="text-[10px] mt-1 text-center" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.08em" }}>
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  // Scroll-linked "recede" — as the hero scrolls away, content lifts, scales
  // up slightly, fades, and pulls out of focus (the AirPods-page move).
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY     = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const blurPx       = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const contentBlur  = useMotionTemplate`blur(${blurPx}px)`;
  // Orbs drift further/faster on scroll for layered depth
  const orbDriftSlow = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbDriftFast = useTransform(scrollYProgress, [0, 1], [0, 240]);

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
        timeout = setTimeout(() => setDisplayed(currentRole.slice(0, displayed.length + 1)), 55);
      } else {
        timeout = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIndex]);

  const nameLetters = "Binay Siddharth".split("");

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dot-grid"
      style={{ background: "#000500" }}
      onMouseMove={(e) => {
        mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}
    >
      {/* Glow orbs — outer: mouse parallax, middle: scroll drift, inner: CSS float */}
      <motion.div className="absolute pointer-events-none" style={{ x: orb1X, y: orb1Y, top: "-150px", right: "-100px" }}>
        <motion.div style={{ y: orbDriftSlow }}>
          <div className="orb-1 rounded-full" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute pointer-events-none" style={{ x: orb2X, y: orb2Y, bottom: "80px", left: "-80px" }}>
        <motion.div style={{ y: orbDriftFast }}>
          <div className="orb-2 rounded-full" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute pointer-events-none" style={{ x: orb3X, y: orb3Y, top: "40%", left: "60%" }}>
        <motion.div style={{ y: orbDriftSlow }}>
          <div className="orb-3 rounded-full" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(63,185,80,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </motion.div>
      </motion.div>

      {/* Horizontal scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: ["0%", "100vh"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.04), transparent)" }} />
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity, filter: contentBlur }}
      >
        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #00FF41)" }} />
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
            Sydney, Australia // Data &amp; GenAI
          </span>
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #00FF41, transparent)" }} />
        </motion.div>

        {/* Name — 3D entrance: letters fold in from above via rotateX */}
        <div className="mb-4" style={{ fontFamily: "var(--font-cormorant), serif", perspective: "1000px" }}>
          <div className="flex justify-center flex-wrap" style={{ transformStyle: "preserve-3d" }}>
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -55 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.4 + i * 0.03, duration: 0.75, ease: EASE }}
                whileHover={letter !== " " ? {
                  rotateY: 18,
                  color: "#00FF41",
                  textShadow: "0 0 40px rgba(0,255,65,0.65)",
                  transition: { duration: 0.18 },
                } : undefined}
                className={`text-7xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight inline-block ${letter === " " ? "w-6" : ""}`}
                style={{ color: "#E6EDF3", transformStyle: "preserve-3d" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Typewriter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.5 }}
          className="h-12 flex items-center justify-center mb-12">
          <span className="text-base md:text-xl" style={{ color: "#8B949E", fontFamily: "var(--font-mono), monospace" }}>
            <span style={{ color: "#006600" }}>&gt; </span>
            <span style={{ color: "#00FF41" }}>{displayed}</span>
            <span className="cursor-blink inline-block w-[2px] h-5 ml-0.5 align-middle" style={{ background: "#00FF41" }} />
          </span>
        </motion.div>

        {/* Stats — each card tilts independently in 3D */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{ background: "#00FF41", color: "#000500", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 28px rgba(0,255,65,0.5)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
            ./explore_work
          </button>
          <a href="https://linkedin.com/in/binaysiddharth" target="_blank" rel="noopener noreferrer"
            className="px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{ border: "1px solid #003300", color: "#8B949E", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)"; e.currentTarget.style.color = "#00FF41"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#003300"; e.currentTarget.style.color = "#8B949E"; e.currentTarget.style.transform = "none"; }}>
            connect --linkedin
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10" style={{ background: "linear-gradient(to bottom, #00FF4144, transparent)" }} />
      </motion.div>
    </section>
  );
}
