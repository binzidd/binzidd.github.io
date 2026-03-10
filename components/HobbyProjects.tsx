"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const F1BarChartRace = dynamic(() => import("@/components/F1BarChartRace"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl h-96 flex items-center justify-center" style={{ background: "#0A0E14", border: "1px solid #21262D" }}>
      <div className="flex items-center gap-3">
        <motion.div className="w-2 h-2 rounded-full" style={{ background: "#3671C6" }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }} />
        <span className="text-sm" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>loading race data...</span>
      </div>
    </div>
  ),
});

const StarlinkViz = dynamic(() => import("@/components/StarlinkViz"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl h-64 flex items-center justify-center" style={{ background: "#050e1f", border: "1px solid #1a3a6a" }}>
      <span className="text-sm" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>initialising orbit data...</span>
    </div>
  ),
});

const BankingViz = dynamic(() => import("@/components/BankingViz"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl h-64 flex items-center justify-center" style={{ background: "#0A0E14", border: "1px solid #21262D" }}>
      <span className="text-sm" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>loading market data...</span>
    </div>
  ),
});

const MotoViz = dynamic(() => import("@/components/MotoViz"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl h-64 flex items-center justify-center" style={{ background: "#120C04", border: "1px solid #3D2E18" }}>
      <span className="text-sm" style={{ color: "#8B7040", fontFamily: "Georgia, serif" }}>firing up the engine...</span>
    </div>
  ),
});

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: "f1",
    icon: "🏎️",
    title: "F1 2025 — Championship Bar Chart Race",
    tags: ["Data Viz", "React", "Framer Motion", "F1 2025"],
    story: (
      <>
        <span style={{ color: "#3671C6", fontWeight: 600 }}>The story in data:</span>{" "}
        Verstappen started the 2025 season P5 in the standings after two rounds, with McLarens
        dominating. Race by race, through wins in Japan, Miami, Imola, Spain, Austria, Belgium
        and Netherlands — he clawed back the deficit. The Monza masterclass, where Norris retired,
        handed Max the championship lead for the first time all season.{" "}
        <span style={{ color: "#00D9FF" }}>Press play and watch it unfold — bar by bar.</span>
      </>
    ),
    component: <F1BarChartRace />,
  },
  {
    id: "starlink",
    icon: "🛰️",
    title: "Starlink Constellation — Satellite Growth & NSW Passes",
    tags: ["Space Data", "Orbital Mechanics", "React", "SVG Viz"],
    story: (
      <>
        <span style={{ color: "#00D9FF", fontWeight: 600 }}>From 60 to 7,000+:</span>{" "}
        SpaceX has deployed the world's largest satellite constellation in under 6 years.
        This viz tracks each batch launch, orbital shell distribution, and how often
        Starlink satellites now pass over{" "}
        <span style={{ color: "#3FB950" }}>Sydney / NSW (34°S)</span> every single day.
        Spoiler: you can see them with the naked eye on any clear night.
      </>
    ),
    component: <StarlinkViz />,
  },
  {
    id: "banking",
    icon: "🏦",
    title: "Big 4 + Macquarie — Post-COVID Rate Cycle & Deposit Wars",
    tags: ["APRA Data", "Finance", "Rate Analysis", "Market Share"],
    story: (
      <>
        <span style={{ color: "#F0A742", fontWeight: 600 }}>From 0.10% to 4.35%:</span>{" "}
        The RBA cut rates to a historic low during COVID (Nov 2020), then embarked on the most
        aggressive tightening cycle in 30 years (May 2022 – Nov 2023). This viz maps how the
        Big 4 and Macquarie responded to depositors, and how Macquarie&apos;s consistently higher
        rates translated to a{" "}
        <span style={{ color: "#00D9FF" }}>+133% relative deposit market share gain</span>{" "}
        while the majors played catch-up.
      </>
    ),
    component: <BankingViz />,
  },
  {
    id: "moto",
    icon: "🏍️",
    title: "Yamaha MT-10 2023 — Hypernaked Class Head-to-Head",
    tags: ["Retro Viz", "Motorbikes", "Spec Analysis", "Spider Chart"],
    story: (
      <>
        <span style={{ color: "#E8A020", fontWeight: 600 }}>The Dark Side of Japan:</span>{" "}
        My MT-10&apos;s 998cc CP4 engine — same block as the YZF-R1 — stacks up against the
        finest hypernakeds on the market. Interactive gauges, retro-styled spec bars, a responsive
        spider chart, and a full electronics feature matrix compare the MT-10 against the Kawasaki Z H2,
        BMW S1000R, Ducati Streetfighter V4, KTM 1290 Super Duke R, and Aprilia Tuono V4.{" "}
        <span style={{ color: "#E8A020" }}>Spoiler: best value-per-hp in the class.</span>
      </>
    ),
    component: <MotoViz />,
  },
];

export default function HobbyProjects() {
  return (
    <section id="hobbies" className="py-28 px-6 grid-lines" style={{ background: "#0A0E14" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20">
          <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>// hobby.projects</p>
          <h2 className="text-5xl md:text-6xl font-light mb-4" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}>Hobby Projects</h2>
          <p className="text-sm max-w-lg" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
            Data viz doesn&apos;t stop at 5pm. F1 championship races, satellite constellations,
            post-COVID banking dynamics, and motorbike spec battles — all built with the same
            rigour as production code.
          </p>
        </motion.div>

        <div className="space-y-20">
          {projects.map((proj, idx) => (
            <motion.div key={proj.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}>
              {/* Project meta */}
              <div className="flex items-start gap-4 mb-6">
                <span className="text-3xl mt-1">{proj.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>
                    {proj.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "#111720", color: "#484F58", border: "1px solid #21262D", fontFamily: "var(--font-mono), monospace" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(0,217,255,0.08)", color: "#00D9FF", border: "1px solid rgba(0,217,255,0.2)", fontFamily: "var(--font-mono), monospace" }}>
                  #{String(idx + 1).padStart(2, "0")}
                </div>
              </div>

              {/* The viz */}
              {proj.component}

              {/* Story caption */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-5 p-5 rounded-2xl"
                style={{ background: "#111720", border: "1px solid #21262D" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                  {proj.story}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
