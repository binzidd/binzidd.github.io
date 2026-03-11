"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience } from "@/data/resume";
import MatrixDecoder from "@/components/MatrixDecoder";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};
const bulletVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function Timeline() {
  const [openId, setOpenId] = useState<string>("cba-chapter-lead");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <section id="timeline" className="py-28 px-6 grid-lines" style={{ background: "#000500" }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-20">
          <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}><MatrixDecoder text="// employment_history" /></p>
          <h2 className="text-5xl md:text-6xl font-light mb-4" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}><MatrixDecoder text="Where I've Been" /></h2>
          <p className="text-sm" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>Nine years across finance, academia, and tech. Click any role to explore.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-px" style={{ background: "linear-gradient(to bottom, #00FF4144, #003300, transparent)" }} />

          <div className="space-y-3">
            {experience.map((exp) => {
              const isOpen = openId === exp.id;
              return (
                <motion.div key={exp.id} variants={cardVariants}>
                  <div className="relative pl-8">
                    <motion.div
                      className="absolute left-0 top-5 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                      style={{ background: isOpen ? "#000500" : "#020c02", border: `1.5px solid ${isOpen ? "#00FF41" : "#003300"}`, transition: "all 0.3s ease", boxShadow: isOpen ? "0 0 12px rgba(0,255,65,0.3)" : "none" }}
                      animate={{ scale: isOpen ? 1.1 : 1 }}>
                      {isOpen && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full" style={{ background: "#00FF41" }} />}
                    </motion.div>

                    <motion.div
                      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                      style={{ background: isOpen ? "#020c02" : "transparent", border: `1px solid ${isOpen ? "#003300" : "transparent"}`, boxShadow: isOpen ? "0 0 24px rgba(0,255,65,0.04)" : "none" }}
                      whileHover={{ background: isOpen ? "#020c02" : "#020c02AA", border: "1px solid #003300" }}
                      onClick={() => setOpenId(isOpen ? "" : exp.id)}>

                      <div className="px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {exp.current && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,255,65,0.1)", color: "#00FF41", border: "1px solid rgba(0,255,65,0.2)", fontFamily: "var(--font-mono), monospace" }}>CURRENT</span>
                              )}
                              <span className="text-[10px]" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>{exp.period}</span>
                            </div>
                            <h3 className="text-base font-semibold leading-snug" style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>{exp.role}</h3>
                            <p className="text-xs mt-0.5" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>{exp.company} · {exp.location}</p>
                          </div>
                          <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }}
                            className="mt-1 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                            style={{ background: isOpen ? "rgba(0,255,65,0.1)" : "transparent" }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke={isOpen ? "#00FF41" : "#006600"} strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ overflow: "hidden" }}>
                            <div className="px-6 pb-6 space-y-5">
                              <div className="h-px" style={{ background: "#003300" }} />
                              {exp.sections.map((section, si) => (
                                <div key={si}>
                                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>{section.heading}</p>
                                  <ul className="space-y-2">
                                    {section.bullets.map((bullet, bi) => (
                                      <motion.li key={bi} custom={si * 10 + bi} variants={bulletVariants} initial="hidden" animate="visible"
                                        className="flex gap-3 text-xs leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                                        <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: "#00FF4144" }} />
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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-14 flex justify-center">
          <button onClick={() => setChatOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300"
            style={{ background: "#020c02", border: "1px solid #003300", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,65,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#003300"; e.currentTarget.style.boxShadow = "none"; }}>
            <span className="text-lg">💬</span>
            <span className="text-xs font-medium" style={{ color: "#8B949E" }}>ask_me_anything --about-my-experience</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(0,255,65,0.08)", color: "#00FF41", border: "1px solid rgba(0,255,65,0.15)" }}>⌘K</span>
          </button>
        </motion.div>
      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setChatOpen(false)}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl p-6" style={{ background: "#020c02", border: "1px solid #003300" }}>
            <p className="text-xs mb-2" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>// Press ⌘K for the full terminal Q&A interface</p>
            <div className="mt-4 space-y-2">
              {["Tell me about Adobe", "What is Project SPUR?", "What GenAI projects has he built?"].map((q) => (
                <button key={q} onClick={() => { setChatOpen(false); setTimeout(() => { document.dispatchEvent(new CustomEvent("palette-query", { detail: q })); }, 200); }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs transition-colors duration-150"
                  style={{ background: "#020c02", color: "#8B949E", fontFamily: "var(--font-mono), monospace", border: "1px solid #003300" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,255,65,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#003300"}>
                  &gt; &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
            <button onClick={() => setChatOpen(false)} className="mt-4 w-full py-2 text-xs rounded-full" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>// close</button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
