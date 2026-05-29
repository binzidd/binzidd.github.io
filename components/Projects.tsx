"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { projects, type Project } from "@/data/resume";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const statusConfig: Record<Project["status"], { label: string; color: string; bg: string }> = {
  production: { label: "Production",     color: "#1A7F4B", bg: "rgba(26,127,75,0.08)"    },
  "pre-prod": { label: "Pre-Production", color: "#C96A36", bg: "rgba(201,106,54,0.08)"  },
  prototype:  { label: "Prototype",      color: "#6B52C8", bg: "rgba(107,82,200,0.08)"  },
  ideation:   { label: "Ideation",       color: "#C96A36", bg: "rgba(201,106,54,0.06)"  },
  alumni:     { label: "Alumni",         color: "#888888", bg: "rgba(136,136,136,0.08)" },
};

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
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
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="w-full max-w-xl rounded-3xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 32px 64px rgba(0,0,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{project.icon}</span>
                <span
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: status.bg,
                    color: status.color,
                    fontFamily: "var(--font-mono), monospace",
                    border: `1px solid ${status.color}30`,
                  }}
                >
                  {status.label}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: "#0D0D0D", fontFamily: "var(--font-cormorant), serif" }}>
                {project.title}
              </h3>
              <p className="text-xs" style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}>
                {project.tagline}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#F6F3EE" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EDEAE4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F6F3EE"; }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 py-6">
          {project.highlight && (
            <div
              className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl"
              style={{ background: "rgba(201,106,54,0.06)", border: "1px solid rgba(201,106,54,0.15)" }}
            >
              <span className="text-base">✨</span>
              <span className="text-xs font-medium" style={{ color: "#C96A36", fontFamily: "var(--font-inter), sans-serif" }}>
                {project.highlight}
              </span>
            </div>
          )}
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}>
            {project.description}
          </p>
          <p
            className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-3"
            style={{ color: "#888888", fontFamily: "var(--font-mono), monospace" }}
          >
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: "#F6F3EE", color: "#5A5A5A", border: "1px solid rgba(0,0,0,0.07)", fontFamily: "var(--font-mono), monospace" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard3D({ project, onClick }: { project: Project; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 360, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 360, damping: 30 });

  const shineX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const shine = useMotionTemplate`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(201,106,54,0.07) 0%, transparent 60%)`;
  const shineOpacity = useSpring(0, { stiffness: 320, damping: 26 });

  const status = statusConfig[project.status];

  return (
    <motion.div
      variants={cardVariants}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative rounded-2xl cursor-pointer"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
        shineOpacity.set(1);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); shineOpacity.set(0); }}
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        {/* Shine overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: shine, opacity: shineOpacity }}
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{project.icon}</span>
            <span
              className="text-[9px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: status.bg,
                color: status.color,
                fontFamily: "var(--font-mono), monospace",
                border: `1px solid ${status.color}28`,
              }}
            >
              {status.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: "#0D0D0D", fontFamily: "var(--font-inter), sans-serif" }}>
            {project.title}
          </h3>
          <p className="text-xs leading-relaxed mb-5" style={{ color: "#888888", fontFamily: "var(--font-inter), sans-serif" }}>
            {project.tagline}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 rounded-full text-[10px]"
                style={{ background: "#F6F3EE", color: "#888888", fontFamily: "var(--font-mono), monospace", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px]"
                style={{ background: "#F6F3EE", color: "#888888", fontFamily: "var(--font-mono), monospace" }}
              >
                +{project.tech.length - 3}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-1.5 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: "#C96A36", fontFamily: "var(--font-inter), sans-serif" }}
          >
            View details
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-28 px-6 md:px-8" style={{ background: "#EDEAE4" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}>
            GenAI Projects
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-4 leading-tight" style={{ color: "#0D0D0D", fontFamily: "var(--font-cormorant), serif" }}>
            Build & Prototypes
          </h2>
          <p className="text-sm max-w-lg" style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}>
            From GenAI in production to exploratory prototypes — click any card to dive deeper.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projects.map((project) => (
            <ProjectCard3D key={project.id} project={project} onClick={() => setSelected(project)} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
