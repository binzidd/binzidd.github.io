"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skillCategories, certifications } from "@/data/resume";

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span
          className="text-sm"
          style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {name}
        </span>
        <span
          className="text-xs"
          style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {level}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "#E8E2D9" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #8B7355, #C4A882)" }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-28 px-6"
      style={{ background: "#F8F5F0" }}
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
            Capabilities
          </p>
          <h2
            className="text-5xl md:text-6xl font-light mb-4"
            style={{ color: "#1C1917", fontFamily: "var(--font-cormorant), serif" }}
          >
            Skills & Certifications
          </h2>
          <p
            className="text-base max-w-lg"
            style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
          >
            A decade of deliberate depth across data, AI, and human-centred design.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {skillCategories.map((category, ci) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1, duration: 0.6 }}
              className="rounded-2xl p-7"
              style={{ background: "#EFEBE4", border: "1px solid #E0D8CF" }}
            >
              <h3
                className="text-base font-semibold mb-6"
                style={{ color: "#5C4B35", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {category.name}
              </h3>
              {category.skills.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  delay={si * 0.07}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-8"
            style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
          >
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
              className="group rounded-2xl p-4 transition-all duration-300 cursor-default"
              style={{
                background: "#EFEBE4",
                border: "1px solid #E0D8CF",
              }}
              whileHover={{
                y: -3,
                boxShadow: "0 8px 24px rgba(139,115,85,0.1)",
                background: "#F0EBE1",
              }}
            >
              {/* Shimmer effect on hover */}
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cert.icon}</span>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: cert.color }}
                  />
                </div>
                <p
                  className="text-xs font-medium leading-snug"
                  style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {cert.name}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {cert.issuer}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-16 rounded-2xl p-8"
          style={{ background: "#EFEBE4", border: "1px solid #E0D8CF" }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-6"
            style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Education
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                degree: "Masters of IT",
                focus: "Human Computer Interaction",
                school: "The University of Sydney",
                period: "2015 – 2017",
              },
              {
                degree: "Masters of IT Management",
                focus: "Software Engineering Management",
                school: "The University of Sydney",
                period: "2015 – 2017",
              },
              {
                degree: "Bachelor of Technology",
                focus: "Computer Science & Engineering",
                school: "ITER, India",
                period: "2008 – 2012",
              },
            ].map((edu) => (
              <div key={edu.degree}>
                <p
                  className="text-[10px] mb-1"
                  style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {edu.period}
                </p>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {edu.degree}
                </p>
                <p
                  className="text-xs mb-1"
                  style={{ color: "#8B7355", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {edu.focus}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {edu.school}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
