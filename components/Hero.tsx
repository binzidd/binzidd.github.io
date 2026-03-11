"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const roles = [
  "Data & Analytics Lead",
  "GenAI Architect",
  "HCI-Driven Leader",
  "Chapter Area Lead @ CBA",
];

const stats = [
  { value: "9", suffix: " yrs", label: "Analytics Experience" },
  { value: "5+", suffix: " yrs", label: "People Leadership" },
  { value: "200+", suffix: "", label: "GenAI Users Onboarded" },
  { value: "3×", suffix: "", label: "AWS Certified" },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

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
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dot-grid"
      style={{ background: "#000500" }}>

      {/* Glow orbs */}
      <div className="orb-1 absolute rounded-full pointer-events-none" style={{ width: 600, height: 600, top: "-150px", right: "-100px", background: "radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="orb-2 absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: "80px", left: "-80px", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="orb-3 absolute rounded-full pointer-events-none" style={{ width: 300, height: 300, top: "40%", left: "60%", background: "radial-gradient(circle, rgba(63,185,80,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Horizontal scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: ["0%", "100vh"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.04), transparent)" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #00FF41)" }} />
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
            Sydney, Australia // Data &amp; GenAI
          </span>
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #00FF41, transparent)" }} />
        </motion.div>

        {/* Name */}
        <div className="mb-4 overflow-hidden" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          <div className="flex justify-center flex-wrap">
            {nameLetters.map((letter, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.03, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                className={`text-7xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight ${letter === " " ? "w-6" : ""}`}
                style={{ color: "#E6EDF3" }}>
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

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="flex flex-col items-center px-5 py-3 rounded-xl"
              style={{ background: "rgba(0,255,65,0.04)", border: "1px solid rgba(0,255,65,0.1)" }}>
              <span className="text-3xl md:text-4xl font-semibold" style={{ color: "#00FF41", fontFamily: "var(--font-cormorant), serif" }}>
                {stat.value}<span className="text-2xl">{stat.suffix}</span>
              </span>
              <span className="text-[10px] mt-1 text-center" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.08em" }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{ background: "#00FF41", color: "#000500", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(0,255,65,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            ./explore_work
          </button>
          <a href="https://linkedin.com/in/binaysiddharth" target="_blank" rel="noopener noreferrer"
            className="px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{ border: "1px solid #003300", color: "#8B949E", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)"; e.currentTarget.style.color = "#00FF41"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#003300"; e.currentTarget.style.color = "#8B949E"; e.currentTarget.style.transform = "translateY(0)"; }}>
            connect --linkedin
          </a>
        </motion.div>
      </div>

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
