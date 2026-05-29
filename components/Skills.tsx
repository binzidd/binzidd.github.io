"use client";

import { motion } from "framer-motion";
import { skillCategories, certifications, type SkillCategory } from "@/data/resume";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function SkillCategoryPanel({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: EASE }}
      className="rounded-2xl p-7"
      style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      <p
        className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5"
        style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}
      >
        {category.name}
      </p>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <motion.span
            key={skill.name}
            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
            className="px-3 py-1.5 rounded-full text-xs cursor-default"
            style={{
              background: "#F6F3EE",
              color: "#0D0D0D",
              border: "1px solid rgba(0,0,0,0.07)",
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: skill.level >= 85 ? "600" : "400",
            }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6 md:px-8" style={{ background: "#F6F3EE" }}>
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}>
            Capabilities
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-4 leading-tight" style={{ color: "#0D0D0D", fontFamily: "var(--font-cormorant), serif" }}>
            Skills & Certifications
          </h2>
          <p className="text-sm max-w-lg" style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}>
            A decade of deliberate depth across data, AI, and human-centred design.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {skillCategories.map((category, ci) => (
            <SkillCategoryPanel key={category.name} category={category} index={ci} />
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-8" style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}>
            Certifications
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.name}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
              className="rounded-2xl p-4 cursor-default"
              style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cert.icon}</span>
                  <div className="w-1 h-1 rounded-full" style={{ background: cert.color }} />
                </div>
                <p className="text-xs font-medium leading-snug" style={{ color: "#0D0D0D", fontFamily: "var(--font-inter), sans-serif" }}>
                  {cert.name}
                </p>
                <p className="text-[10px]" style={{ color: "#888888", fontFamily: "var(--font-mono), monospace" }}>
                  {cert.issuer}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-16 rounded-2xl p-8"
          style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-8" style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}>
            Education
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { degree: "Masters of IT", focus: "Human Computer Interaction", school: "The University of Sydney", period: "2015 – 2017" },
              { degree: "Masters of IT Management", focus: "Software Engineering Management", school: "The University of Sydney", period: "2015 – 2017" },
              { degree: "Bachelor of Technology", focus: "Computer Science & Engineering", school: "ITER, India", period: "2008 – 2012" },
            ].map((edu) => (
              <div key={edu.degree}>
                <p className="text-[10px] mb-2" style={{ color: "#888888", fontFamily: "var(--font-mono), monospace" }}>{edu.period}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: "#0D0D0D", fontFamily: "var(--font-inter), sans-serif" }}>{edu.degree}</p>
                <p className="text-xs mb-1" style={{ color: "#C96A36", fontFamily: "var(--font-inter), sans-serif" }}>{edu.focus}</p>
                <p className="text-xs" style={{ color: "#888888", fontFamily: "var(--font-inter), sans-serif" }}>{edu.school}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
