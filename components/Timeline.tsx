"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience } from "@/data/resume";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

const bulletVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export default function Timeline() {
  const [openId, setOpenId] = useState<string>("cba-chapter-lead");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <section
      id="timeline"
      className="py-28 px-6"
      style={{ background: "#F8F5F0" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
          >
            The Un-Resume
          </p>
          <h2
            className="text-5xl md:text-6xl font-light mb-4"
            style={{ color: "#1C1917", fontFamily: "var(--font-cormorant), serif" }}
          >
            Where I&apos;ve Been
          </h2>
          <p
            className="text-base max-w-lg"
            style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Nine years across finance, academia, and tech. Click any role to explore.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {/* Vertical line */}
          <div
            className="absolute left-[11px] top-3 bottom-3 w-px"
            style={{ background: "linear-gradient(to bottom, #C4A882, #E0D8CF, transparent)" }}
          />

          <div className="space-y-4">
            {experience.map((exp) => {
              const isOpen = openId === exp.id;
              return (
                <motion.div key={exp.id} variants={cardVariants}>
                  <div className="relative pl-8">
                    {/* Timeline dot */}
                    <motion.div
                      className="absolute left-0 top-5 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                      style={{
                        background: isOpen ? exp.color : "#E8E2D9",
                        border: `2px solid ${isOpen ? exp.color : "#E0D8CF"}`,
                        transition: "all 0.3s ease",
                      }}
                      animate={{ scale: isOpen ? 1.15 : 1 }}
                    >
                      {isOpen && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      className="rounded-2xl overflow-hidden cursor-pointer"
                      style={{
                        background: isOpen ? "#EFEBE4" : "transparent",
                        border: `1px solid ${isOpen ? "#E0D8CF" : "transparent"}`,
                        transition: "all 0.3s ease",
                      }}
                      whileHover={{
                        background: isOpen ? "#EFEBE4" : "#F5F1EB",
                        border: "1px solid #E0D8CF",
                      }}
                      onClick={() => setOpenId(isOpen ? "" : exp.id)}
                    >
                      {/* Header */}
                      <div className="px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {exp.current && (
                                <span
                                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    background: `${exp.color}20`,
                                    color: exp.color,
                                    fontFamily: "var(--font-inter), sans-serif",
                                  }}
                                >
                                  Current
                                </span>
                              )}
                              <span
                                className="text-xs"
                                style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                              >
                                {exp.period}
                              </span>
                            </div>
                            <h3
                              className="text-lg font-medium leading-snug"
                              style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
                            >
                              {exp.role}
                            </h3>
                            <p
                              className="text-sm mt-0.5"
                              style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
                            >
                              {exp.company} · {exp.location}
                            </p>
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-1 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                            style={{ background: isOpen ? "#E0D8CF" : "transparent" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 1v10M1 6h10" stroke={isOpen ? "#5C4B35" : "#A8A29E"} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>

                      {/* Expandable content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="px-6 pb-6 space-y-5">
                              <div
                                className="h-px"
                                style={{ background: "#E0D8CF" }}
                              />
                              {exp.sections.map((section, si) => (
                                <div key={si}>
                                  <p
                                    className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
                                    style={{ color: exp.color, fontFamily: "var(--font-inter), sans-serif" }}
                                  >
                                    {section.heading}
                                  </p>
                                  <ul className="space-y-2">
                                    {section.bullets.map((bullet, bi) => (
                                      <motion.li
                                        key={bi}
                                        custom={si * 10 + bi}
                                        variants={bulletVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex gap-3 text-sm leading-relaxed"
                                        style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
                                      >
                                        <span
                                          className="mt-2 flex-shrink-0 w-1 h-1 rounded-full"
                                          style={{ background: exp.color }}
                                        />
                                        {bullet}
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Ask Me Anything pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-14 flex justify-center"
        >
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300"
            style={{
              background: "#EFEBE4",
              border: "1px solid #E0D8CF",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E8E2D9";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(139,115,85,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#EFEBE4";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="text-lg">💬</span>
            <span className="text-sm font-medium" style={{ color: "#5C4B35" }}>
              Ask Me Anything about my experience
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#C4A88220", color: "#8B7355" }}>
              ⌘K
            </span>
          </button>
        </motion.div>
      </div>

      {/* Chat modal (delegates to CommandPalette) */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-0"
          style={{ background: "rgba(28,25,23,0.4)" }}
          onClick={() => setChatOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl p-6"
            style={{ background: "#F8F5F0", border: "1px solid #E0D8CF" }}
          >
            <p
              className="text-sm mb-2"
              style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Try the full command palette for interactive Q&amp;A
            </p>
            <p
              className="text-base font-medium"
              style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Press <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: "#EFEBE4", border: "1px solid #E0D8CF" }}>⌘K</kbd> or <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: "#EFEBE4", border: "1px solid #E0D8CF" }}>Ctrl+K</kbd> to open it from anywhere.
            </p>
            <div className="mt-4 space-y-2">
              {["Tell me about Adobe", "What is Project SPUR?", "What GenAI projects has he built?"].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setChatOpen(false);
                    setTimeout(() => {
                      const evt = new CustomEvent("palette-query", { detail: q });
                      document.dispatchEvent(evt);
                    }, 200);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors duration-150"
                  style={{
                    background: "#EFEBE4",
                    color: "#5C4B35",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="mt-4 w-full py-2 text-sm rounded-full"
              style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
