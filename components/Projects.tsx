"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/data/resume";

const statusConfig: Record<Project["status"], { label: string; color: string; bg: string }> = {
  production: { label: "Production", color: "#2E6B43", bg: "#DCEEE5" },
  "pre-prod": { label: "Pre-Production", color: "#5C4B35", bg: "#EDE5D8" },
  prototype: { label: "Prototype", color: "#1D4E7A", bg: "#D8E8F5" },
  ideation: { label: "Ideation", color: "#6B3E7A", bg: "#EDD8F5" },
  alumni: { label: "Alumni Project", color: "#78716C", bg: "#E8E2D9" },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const status = statusConfig[project.status];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(28,25,23,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl rounded-3xl overflow-hidden"
        style={{ background: "#F8F5F0", border: "1px solid #E0D8CF" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="px-8 pt-8 pb-6"
          style={{ background: "#EFEBE4", borderBottom: "1px solid #E0D8CF" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{project.icon}</span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: status.bg, color: status.color, fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {status.label}
                </span>
              </div>
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ color: "#1C1917", fontFamily: "var(--font-cormorant), serif" }}
              >
                {project.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {project.tagline}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#E0D8CF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#D4C8BC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E0D8CF")}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="px-8 py-6">
          {project.highlight && (
            <div
              className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl"
              style={{ background: "#EDE5D8", border: "1px solid #E0D8CF" }}
            >
              <span className="text-base">✨</span>
              <span
                className="text-sm font-medium"
                style={{ color: "#5C4B35", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {project.highlight}
              </span>
            </div>
          )}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div>
            <p
              className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
              style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "#EFEBE4",
                    color: "#5C4B35",
                    border: "1px solid #E0D8CF",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="py-28 px-6"
      style={{ background: "#EFEBE4" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
          >
            What I&apos;ve Built
          </p>
          <h2
            className="text-5xl md:text-6xl font-light mb-4"
            style={{ color: "#1C1917", fontFamily: "var(--font-cormorant), serif" }}
          >
            Projects & Prototypes
          </h2>
          <p
            className="text-base max-w-lg"
            style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
          >
            From GenAI in production to exploratory prototypes — click any card to dive deeper.
          </p>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-300"
                style={{
                  background: "#F8F5F0",
                  border: "1px solid #E0D8CF",
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 32px rgba(139,115,85,0.12)",
                  border: "1px solid #C4A882",
                }}
                onClick={() => setSelected(project)}
              >
                {/* Icon + status */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{project.icon}</span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: status.bg,
                      color: status.color,
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Title + tagline */}
                <h3
                  className="text-lg font-semibold mb-2 leading-snug"
                  style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {project.tagline}
                </p>

                {/* Tech tags (first 3) */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full text-[11px]"
                      style={{
                        background: "#EFEBE4",
                        color: "#78716C",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px]"
                      style={{ background: "#EFEBE4", color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* View details */}
                <div
                  className="flex items-center gap-1.5 text-xs font-medium transition-all duration-200 opacity-0 group-hover:opacity-100"
                  style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  View Details
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Highlight badge */}
                {project.highlight && (
                  <div
                    className="absolute top-4 right-4"
                    title={project.highlight}
                  >
                    <span className="text-sm">✨</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
