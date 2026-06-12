"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { skillCategories, certifications, type SkillCategory, type Certification } from "@/data/resume";
import MatrixDecoder from "@/components/MatrixDecoder";
import HeadingReveal from "@/components/motion/HeadingReveal";

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>{name}</span>
        <span className="text-xs" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#003300" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #00FF41, #008F11)" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function SkillCategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        background: "#020c02",
        border: "1px solid #003300",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ boxShadow: "0 16px 40px rgba(0,255,65,0.05), 0 0 0 1px rgba(0,255,65,0.15)" }}
      className="rounded-2xl p-7"
    >
      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
        // {category.name.toLowerCase().replace(/ /g, "_")}
      </p>
      {category.skills.map((skill, si) => (
        <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={si * 0.07} />
      ))}
    </motion.div>
  );
}

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
  return (
    <section id="skills" className="py-28 px-6" style={{ background: "#000500" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-16">
          <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}><MatrixDecoder text="// capabilities.map" /></p>
          <h2 className="text-5xl md:text-6xl font-light mb-4" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}><HeadingReveal><MatrixDecoder text="Skills & Certifications" /></HeadingReveal></h2>
          <p className="text-sm max-w-lg" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
            A decade of deliberate depth across data, AI, and human-centred design.
          </p>
        </motion.div>

        {/* Skills grid — each card tilts in 3D on hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {skillCategories.map((category, ci) => (
            <SkillCategoryCard key={category.name} category={category} index={ci} />
          ))}
        </div>

        {/* Certifications */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-8" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>// certifications.list</p>
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
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-6" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>// education.records</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { degree: "Masters of IT", focus: "Human Computer Interaction", school: "The University of Sydney", period: "2015 – 2017" },
              { degree: "Masters of IT Management", focus: "Software Engineering Management", school: "The University of Sydney", period: "2015 – 2017" },
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
      </div>
    </section>
  );
}
