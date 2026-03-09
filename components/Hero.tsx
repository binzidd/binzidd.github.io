"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        timeout = setTimeout(() => {
          setDisplayed(currentRole.slice(0, displayed.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setTyping(false), 2400);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 35);
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
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#F8F5F0" }}
    >
      {/* Floating orbs */}
      <div
        className="orb-1 absolute rounded-full pointer-events-none"
        style={{
          width: 520,
          height: 520,
          top: "-120px",
          right: "-80px",
          background: "radial-gradient(circle, rgba(196,168,130,0.18) 0%, rgba(196,168,130,0.04) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="orb-2 absolute rounded-full pointer-events-none"
        style={{
          width: 380,
          height: 380,
          bottom: "60px",
          left: "-60px",
          background: "radial-gradient(circle, rgba(139,115,85,0.14) 0%, rgba(139,115,85,0.03) 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="orb-3 absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          top: "40%",
          left: "55%",
          background: "radial-gradient(circle, rgba(155,126,160,0.10) 0%, rgba(155,126,160,0.02) 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span
            className="h-px w-8"
            style={{ background: "#C4A882" }}
          />
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Sydney, Australia
          </span>
          <span className="h-px w-8" style={{ background: "#C4A882" }} />
        </motion.div>

        {/* Name */}
        <div
          className="mb-4 overflow-hidden"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          <div className="flex justify-center flex-wrap">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + i * 0.03,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`text-7xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight ${
                  letter === " " ? "w-6" : ""
                }`}
                style={{ color: "#1C1917" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="h-12 flex items-center justify-center mb-12"
        >
          <span
            className="text-xl md:text-2xl font-light"
            style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {displayed}
            <span
              className="cursor-blink inline-block w-[2px] h-6 ml-0.5 align-middle"
              style={{ background: "#8B7355" }}
            />
          </span>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span
                className="text-3xl md:text-4xl font-semibold"
                style={{ color: "#8B7355", fontFamily: "var(--font-cormorant), serif" }}
              >
                {stat.value}
                <span className="text-2xl">{stat.suffix}</span>
              </span>
              <span
                className="text-xs mt-1 text-center max-w-[90px]"
                style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: "#1C1917",
              color: "#F8F5F0",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8B7355";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1C1917";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore My Work
          </button>
          <a
            href="https://linkedin.com/in/binaysiddharth"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              border: "1px solid #E0D8CF",
              color: "#78716C",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#8B7355";
              e.currentTarget.style.color = "#5C4B35";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E0D8CF";
              e.currentTarget.style.color = "#78716C";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ background: "linear-gradient(to bottom, #C4A882, transparent)" }}
        />
      </motion.div>
    </section>
  );
}
