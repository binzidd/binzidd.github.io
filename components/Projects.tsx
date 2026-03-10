"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/data/resume";
import MatrixDecoder from "@/components/MatrixDecoder";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const statusConfig: Record<Project["status"], { label: string; color: string; bg: string }> = {
  production: { label: "Production",     color: "#3FB950", bg: "rgba(63,185,80,0.1)"   },
  "pre-prod": { label: "Pre-Production", color: "#00D9FF", bg: "rgba(0,217,255,0.1)"   },
  prototype:  { label: "Prototype",      color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
  ideation:   { label: "Ideation",       color: "#F0A742", bg: "rgba(240,167,66,0.1)"  },
  alumni:     { label: "Alumni",         color: "#484F58", bg: "rgba(72,79,88,0.2)"    },
};

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const status = statusConfig[project.status];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: EASE }} className="w-full max-w-xl rounded-3xl overflow-hidden"
        style={{ background: "#111720", border: "1px solid #30363D", boxShadow: "0 0 60px rgba(0,217,255,0.05)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="px-8 pt-8 pb-6" style={{ background: "#161C26", borderBottom: "1px solid #21262D" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{project.icon}</span>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ background: status.bg, color: status.color, fontFamily: "var(--font-mono), monospace", border: `1px solid ${status.color}33` }}>{status.label}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}>{project.title}</h3>
              <p className="text-xs" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>{project.tagline}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: "#21262D" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#30363D"} onMouseLeave={(e) => e.currentTarget.style.background = "#21262D"}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="#8B949E" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <div className="px-8 py-6">
          {project.highlight && (
            <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl" style={{ background: "rgba(0,217,255,0.06)", border: "1px solid rgba(0,217,255,0.15)" }}>
              <span className="text-base">✨</span>
              <span className="text-xs font-medium" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>{project.highlight}</span>
            </div>
          )}
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>{project.description}</p>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>// tech_stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium" style={{ background: "#161C26", color: "#8B949E", border: "1px solid #21262D", fontFamily: "var(--font-mono), monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-28 px-6" style={{ background: "#111720" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-16">
          <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}><MatrixDecoder text="// projects.genai" /></p>
          <h2 className="text-5xl md:text-6xl font-light mb-4" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}><MatrixDecoder text="Projects & Prototypes" /></h2>
          <p className="text-sm max-w-lg" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>From GenAI in production to exploratory prototypes — click any card to dive deeper.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <motion.div key={project.id} variants={cardVariants}
                className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-300"
                style={{ background: "#0A0E14", border: "1px solid #21262D" }}
                whileHover={{ y: -5, boxShadow: "0 0 32px rgba(0,217,255,0.05), 0 12px 32px rgba(0,0,0,0.4)", borderColor: "rgba(0,217,255,0.2)" }}
                onClick={() => setSelected(project)}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{project.icon}</span>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color, fontFamily: "var(--font-mono), monospace", border: `1px solid ${status.color}33` }}>{status.label}</span>
                </div>
                <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>{project.title}</h3>
                <p className="text-xs leading-relaxed mb-5" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>{project.tagline}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px]" style={{ background: "#161C26", color: "#484F58", fontFamily: "var(--font-mono), monospace", border: "1px solid #21262D" }}>{t}</span>
                  ))}
                  {project.tech.length > 3 && <span className="px-2.5 py-0.5 rounded-full text-[10px]" style={{ background: "#161C26", color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>+{project.tech.length - 3}</span>}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>
                  view_details()
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>{selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}
