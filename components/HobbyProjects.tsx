"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const F1BarChartRace = dynamic(() => import("@/components/F1BarChartRace"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-3xl h-96 flex items-center justify-center"
      style={{ background: "#0F0D0B", border: "1px solid #2A2520" }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: "#3671C6" }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span
          className="text-sm"
          style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}
        >
          Loading race data...
        </span>
      </div>
    </div>
  ),
});

export default function HobbyProjects() {
  return (
    <section
      id="hobbies"
      className="py-28 px-6"
      style={{ background: "#F8F5F0" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
            Beyond the Spreadsheet
          </p>
          <h2
            className="text-5xl md:text-6xl font-light mb-4"
            style={{ color: "#1C1917", fontFamily: "var(--font-cormorant), serif" }}
          >
            Hobby Projects
          </h2>
          <p
            className="text-base max-w-lg"
            style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Data viz and analytics don&apos;t stop at 5pm. When I&apos;m not building GenAI pipelines,
            I&apos;m visualising the numbers behind sport, culture, and everything in between.
          </p>
        </motion.div>

        {/* F1 Project Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Project meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🏎️</span>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1C1917", fontFamily: "var(--font-inter), sans-serif" }}
              >
                F1 2025 — Championship Bar Chart Race
              </h3>
              <div className="flex items-center gap-3 mt-0.5">
                {["Data Viz", "React", "Framer Motion", "F1 2025"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: "#EFEBE4",
                      color: "#78716C",
                      border: "1px solid #E0D8CF",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* The viz */}
          <F1BarChartRace />

          {/* Story caption */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 p-5 rounded-2xl"
            style={{ background: "#EFEBE4", border: "1px solid #E0D8CF" }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#78716C", fontFamily: "var(--font-inter), sans-serif" }}
            >
              <span style={{ color: "#3671C6", fontWeight: 600 }}>The story in data:</span>{" "}
              Verstappen started the 2025 season P5 in the standings after two rounds, with McLarens
              dominating. Race by race, through wins in Japan, Miami, Imola, Spain, Austria, Belgium
              and Netherlands — he clawed back the deficit. The Monza masterclass, where Norris retired,
              handed Max the championship lead for the first time all season.{" "}
              <span style={{ color: "#8B7355" }}>
                Press play and watch it unfold — bar by bar.
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
