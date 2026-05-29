"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const F1BarChartRace = dynamic(() => import("@/components/F1BarChartRace"), {
  ssr: false,
  loading: () => <VizLoader label="Loading race data..." />,
});
const StarlinkViz = dynamic(() => import("@/components/StarlinkViz"), {
  ssr: false,
  loading: () => <VizLoader bg="#050e1f" label="Initialising orbit data..." />,
});
const BankingViz = dynamic(() => import("@/components/BankingViz"), {
  ssr: false,
  loading: () => <VizLoader label="Loading market data..." />,
});
const MotoViz = dynamic(() => import("@/components/MotoViz"), {
  ssr: false,
  loading: () => <VizLoader bg="#120C04" label="Firing up the engine..." />,
});
const SankeyViz = dynamic(() => import("@/components/SankeyViz"), {
  ssr: false,
  loading: () => <VizLoader label="Loading budget data..." />,
});
const AgentsViz = dynamic(() => import("@/components/AgentsViz"), {
  ssr: false,
  loading: () => <VizLoader label="Initialising agent network..." />,
});

function VizLoader({ bg = "#111111", label }: { bg?: string; label: string }) {
  return (
    <div
      className="rounded-2xl h-64 flex items-center justify-center"
      style={{ background: bg }}
    >
      <span className="text-sm" style={{ color: "rgba(246,243,238,0.3)", fontFamily: "var(--font-mono), monospace" }}>{label}</span>
    </div>
  );
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: "agents",
    icon: "🤖",
    title: "Story of Agents — From Chat AI to the Autonomous Enterprise",
    tags: ["Multi-Agent", "MCP", "LangGraph", "A2A", "LLM Observability"],
    githubUrl: "https://github.com/binzidd/storyofagents",
    story: "Six capabilities. One journey. An interactive briefing tracing the evolution from tool calling to full agent-to-agent networks — covering LangGraph orchestration, Model Context Protocol as the universal enterprise connector, and A2A as the virtual firm that runs at machine speed. Built for financial services. Applies everywhere.",
    component: <AgentsViz />,
  },
  {
    id: "budget",
    icon: "🏛️",
    title: "AU Federal Budget 2024-25 — Trace the Money",
    tags: ["Gov Data", "Sankey", "SVG Viz", "Tax & Spending"],
    githubUrl: "https://github.com/binzidd/au-govt-budget-sankey",
    story: "$738.5B — where does it go? 4-level interactive Sankey: revenue buckets → sources → spending portfolios → sub-programs. Hover any node or ribbon to trace a dollar's journey from your tax return to NDIS, hospitals, defence, or debt servicing. Click any node to zoom in and trace connected flows.",
    component: <SankeyViz />,
  },
  {
    id: "f1",
    icon: "🏎️",
    title: "F1 2025 — Championship Bar Chart Race",
    tags: ["Data Viz", "React", "Framer Motion", "F1 2025"],
    githubUrl: "https://github.com/binzidd/f1-2025-championship-race",
    story: "The story in data: Verstappen started P5 after Round 2 with McLarens dominating. Wins in Japan, Miami, Imola, Spain, Austria, Belgium, Netherlands — he clawed back the deficit. Monza masterclass, Norris DNF, Max leads for the first time all season. Press play and watch it unfold — bar by bar.",
    component: <F1BarChartRace />,
  },
  {
    id: "starlink",
    icon: "🛰️",
    title: "Starlink Constellation — Satellite Growth & NSW Passes",
    tags: ["Space Data", "Orbital Mechanics", "React", "SVG Viz"],
    githubUrl: "https://github.com/binzidd/starlink-constellation-viz",
    story: "From 60 to 7,000+: SpaceX deployed the world's largest satellite constellation in under 6 years. Launch timeline, orbital shell breakdown, and daily pass frequency over Sydney / NSW (34°S). Visible with the naked eye on any clear night.",
    component: <StarlinkViz />,
  },
  {
    id: "banking",
    icon: "🏦",
    title: "Big 4 + Macquarie — Post-COVID Rate Cycle & Deposit Wars",
    tags: ["APRA Data", "Finance", "Rate Analysis", "Market Share"],
    githubUrl: "https://github.com/binzidd/au-banking-rate-analysis",
    story: "From 0.10% to 4.35%: RBA cut to historic low (Nov 2020), then the most aggressive hike cycle in 30 years (May 2022–Nov 2023). Macquarie's consistently higher rates translated to a +133% relative deposit market share gain while the Big 4 played catch-up.",
    component: <BankingViz />,
  },
  {
    id: "moto",
    icon: "🏍️",
    title: "Yamaha MT-10 2023 — Hypernaked Class Head-to-Head",
    tags: ["Retro Viz", "Motorbikes", "Spec Analysis", "Spider Chart"],
    githubUrl: "https://github.com/binzidd/mt10-hypernaked-showdown",
    story: "The Dark Side of Japan: My MT-10's 998cc CP4 — same block as the YZF-R1 — vs Kawasaki Z H2, BMW S1000R, Ducati Streetfighter V4, KTM 1290 Super Duke R, Aprilia Tuono V4. Gauges, spec bars, spider chart, full electronics matrix. Best value-per-hp in the class.",
    component: <MotoViz />,
  },
];

export default function HobbyProjects() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="hobbies" className="py-28 px-6 md:px-8" style={{ background: "#F6F3EE" }}>
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: "#C96A36", fontFamily: "var(--font-mono), monospace" }}>
            Hobby Projects
          </p>
          <h2 className="text-5xl md:text-6xl font-light mb-4 leading-tight" style={{ color: "#0D0D0D", fontFamily: "var(--font-cormorant), serif" }}>
            Built for Curiosity
          </h2>
          <p className="text-sm max-w-lg" style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}>
            Data viz doesn&apos;t stop at 5pm. Multi-agent briefings, F1 championship races,
            satellite constellations, post-COVID banking dynamics, and motorbike spec battles —
            all built with the same rigour as production code.
          </p>
        </motion.div>

        {/* Projects list */}
        <div className="space-y-16">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: idx * 0.05, ease: EASE }}
            >
              {/* Project header */}
              <div className="flex items-start gap-4 mb-5">
                <span className="text-3xl mt-0.5">{proj.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base font-semibold mb-2 leading-snug"
                    style={{ color: "#0D0D0D", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {proj.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "#EDEAE4",
                          color: "#5A5A5A",
                          border: "1px solid rgba(0,0,0,0.06)",
                          fontFamily: "var(--font-mono), monospace",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-[10px] px-2 py-1 rounded-full hidden sm:inline"
                    style={{
                      background: "rgba(201,106,54,0.08)",
                      color: "#C96A36",
                      border: "1px solid rgba(201,106,54,0.2)",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200"
                    style={{
                      background: "#0D0D0D",
                      color: "#F6F3EE",
                      fontFamily: "var(--font-inter), sans-serif",
                      textDecoration: "none",
                      borderRadius: "3px",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#C96A36"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0D0D0D"; }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    Source
                  </a>
                </div>
              </div>

              {/* Viz */}
              <motion.div
                className="rounded-2xl overflow-hidden mb-4"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                whileHover={{ boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }}
                transition={{ duration: 0.25 }}
              >
                {proj.component}
              </motion.div>

              {/* Story caption */}
              <div className="p-5 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}>
                <button
                  onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
                  className="flex items-center gap-2 w-full text-left"
                  style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <span className="text-xs font-medium flex-1">{expanded === proj.id ? "Hide details" : "About this project"}</span>
                  <motion.span
                    animate={{ rotate: expanded === proj.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#888888" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                </button>
                {expanded === proj.id && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="text-sm leading-relaxed mt-3 pt-3"
                    style={{ color: "#5A5A5A", fontFamily: "var(--font-inter), sans-serif", borderTop: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    {proj.story}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
