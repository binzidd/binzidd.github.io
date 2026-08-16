"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { certifications, type Certification } from "@/data/resume";
import MatrixDecoder from "@/components/MatrixDecoder";
import HeadingReveal from "@/components/motion/HeadingReveal";
import SceneDolly from "@/components/motion/SceneDolly";
import SkillStack from "@/components/SkillStack";
import SkillPhysics from "@/components/SkillPhysics";

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function CertCard({ cert }: { cert: Certification }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 420, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 420, damping: 28 });

  return (
    <motion.div
      variants={itemVariants}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        background: "#020c02",
        border: "1px solid #003300",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 36px rgba(0,255,65,0.08), 0 0 0 1px rgba(0,255,65,0.28)",
        borderColor: "rgba(0,255,65,0.28)",
      }}
      className="group rounded-2xl p-4 cursor-default"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cert.icon}</span>
          <div className="w-1 h-1 rounded-full" style={{ background: cert.color }} />
        </div>
        <p className="text-xs font-medium leading-snug" style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>{cert.name}</p>
        <p className="text-[10px]" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>{cert.issuer}</p>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [showPlayground, setShowPlayground] = useState(false);

  return (
    <section id="skills" className="py-28 px-6" style={{ background: "#000500" }}>
      <SceneDolly className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-16">
          <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}><MatrixDecoder text="// capabilities.map" /></p>
          <h2 className="text-5xl md:text-6xl font-light mb-4" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}><HeadingReveal><MatrixDecoder text="Skills & Certifications" /></HeadingReveal></h2>
          <p className="text-sm max-w-lg" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
            Twelve years of deliberate depth across data, AI, and people leadership.
          </p>
        </motion.div>

        {/* Primary view: grouped, ordered, legible at a glance — no interaction required */}
        <div className="mb-6">
          <SkillStack />
        </div>

        {/* Physics sim demoted to an opt-in playground — same weights, thrown around */}
        <div className="mb-20">
          <button
            onClick={() => setShowPlayground((v) => !v)}
            aria-expanded={showPlayground}
            className="flex items-center gap-2 text-[11px] px-4 py-2 rounded-full transition-colors duration-150"
            style={{
              color: showPlayground ? "#00FF41" : "#006600",
              border: `1px solid ${showPlayground ? "rgba(0,255,65,0.35)" : "#003300"}`,
              fontFamily: "var(--font-mono), monospace",
              background: "transparent",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#00FF41"; e.currentTarget.style.borderColor = "rgba(0,255,65,0.35)"; }}
            onMouseLeave={(e) => { if (!showPlayground) { e.currentTarget.style.color = "#006600"; e.currentTarget.style.borderColor = "#003300"; } }}
          >
            <motion.span animate={{ rotate: showPlayground ? 45 : 0 }} transition={{ duration: 0.2 }}>+</motion.span>
            {showPlayground ? "close_playground()" : "same_weights.throw_them_around()"}
          </button>

          <AnimatePresence initial={false}>
            {showPlayground && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ overflow: "hidden" }}
              >
                <div className="pt-5">
                  <SkillPhysics />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Certifications */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-8" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>{"// certifications.list"}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {certifications.map((cert) => (
            <CertCard key={cert.name} cert={cert} />
          ))}
        </motion.div>

        {/* Education strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-16 rounded-2xl p-8"
          style={{ background: "#020c02", border: "1px solid #003300" }}
        >
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-6" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>{"// education.records"}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { degree: "Master of Software Engineering", focus: "Dual degree with Software Engineering Management", school: "The University of Sydney", period: "2015 – 2017" },
              { degree: "Master of Software Engineering Management", focus: "Dual degree with Software Engineering", school: "The University of Sydney", period: "2015 – 2017" },
              { degree: "Bachelor of Technology", focus: "Computer Science & Engineering", school: "ITER, India", period: "2008 – 2012" },
            ].map((edu) => (
              <div key={edu.degree}>
                <p className="text-[10px] mb-1" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>{edu.period}</p>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>{edu.degree}</p>
                <p className="text-xs mb-1" style={{ color: "#00FF41", fontFamily: "var(--font-inter), sans-serif" }}>{edu.focus}</p>
                <p className="text-xs" style={{ color: "#006600", fontFamily: "var(--font-inter), sans-serif" }}>{edu.school}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </SceneDolly>
    </section>
  );
}
