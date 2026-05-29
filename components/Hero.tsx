"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "9", label: "Years in Analytics" },
  { value: "5+", label: "Leadership" },
  { value: "200+", label: "GenAI Users" },
  { value: "3×", label: "AWS Certified" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col" style={{ background: "#0D0D0D" }}>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center justify-between px-8 md:px-16 py-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-sm tracking-[0.2em]" style={{ color: "rgba(246,243,238,0.28)", fontFamily: "var(--font-mono), monospace" }}>
          B·S
        </span>
        <div className="flex items-center gap-6">
          <span className="hidden sm:block text-xs" style={{ color: "rgba(246,243,238,0.22)", fontFamily: "var(--font-inter), sans-serif" }}>
            Sydney, Australia
          </span>
          <span className="flex items-center gap-2 text-xs font-medium" style={{ color: "#C96A36", fontFamily: "var(--font-inter), sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C96A36" }} />
            Available
          </span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 pt-10 pb-20">

        {/* Domain label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          className="text-[11px] uppercase tracking-[0.28em] mb-10"
          style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}
        >
          Data · GenAI · HCI
        </motion.p>

        {/* Name — each word slides up from clip */}
        <div className="mb-10" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {["Binay", "Siddharth"].map((word, wi) => (
            <div key={word} style={{ overflow: "hidden", lineHeight: 1 }}>
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + wi * 0.13, duration: 0.95, ease: EASE }}
                className="block font-light tracking-tight"
                style={{
                  color: "#F6F3EE",
                  fontSize: "clamp(3.8rem, 12vw, 10.5rem)",
                  lineHeight: 0.97,
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Descriptor */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.92, duration: 0.7, ease: EASE }}
          className="text-[15px] max-w-md leading-relaxed mb-16"
          style={{ color: "rgba(246,243,238,0.38)", fontFamily: "var(--font-inter), sans-serif" }}
        >
          Chapter Area Lead — FS Analytics at Commonwealth Bank.
          Nine years transforming finance through GenAI, ML, and human-centred design.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="flex flex-wrap gap-10 md:gap-16 pb-14 mb-12"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15 + i * 0.07, duration: 0.6, ease: EASE }}
              className="flex flex-col"
            >
              <span
                className="font-light leading-none"
                style={{
                  color: "#F6F3EE",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(2.8rem, 5vw, 4rem)",
                }}
              >
                {s.value}
              </span>
              <span
                className="text-[11px] mt-2.5"
                style={{ color: "rgba(246,243,238,0.28)", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.6, ease: EASE }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 text-sm font-medium transition-all duration-200"
            style={{
              background: "#C96A36",
              color: "#F6F3EE",
              fontFamily: "var(--font-inter), sans-serif",
              borderRadius: "3px",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#E07840"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#C96A36"; }}
          >
            View Work
          </button>
          <a
            href="https://linkedin.com/in/binaysiddharth"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-sm font-medium transition-all duration-200"
            style={{
              color: "rgba(246,243,238,0.42)",
              fontFamily: "var(--font-inter), sans-serif",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "3px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F6F3EE";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(246,243,238,0.42)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
            }}
          >
            LinkedIn ↗
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="px-8 md:px-16 pb-10 flex items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <div className="w-[2px] h-2 rounded-full" style={{ background: "#C96A36" }} />
        </motion.div>
        <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.16)", fontFamily: "var(--font-mono), monospace" }}>
          scroll
        </span>
      </motion.div>
    </section>
  );
}
