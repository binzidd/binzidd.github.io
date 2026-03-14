"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import MatrixDecoder from "@/components/MatrixDecoder";

// ─── Lazy viz imports ─────────────────────────────────────────────────────────
const F1BarChartRace = dynamic(() => import("@/components/F1BarChartRace"), {
  ssr: false,
  loading: () => <VizLoader color="#3671C6" label="loading race data..." />,
});
const StarlinkViz = dynamic(() => import("@/components/StarlinkViz"), {
  ssr: false,
  loading: () => <VizLoader bg="#050e1f" border="#1a3a6a" label="initialising orbit data..." />,
});
const BankingViz = dynamic(() => import("@/components/BankingViz"), {
  ssr: false,
  loading: () => <VizLoader label="loading market data..." />,
});
const MotoViz = dynamic(() => import("@/components/MotoViz"), {
  ssr: false,
  loading: () => <VizLoader bg="#120C04" border="#3D2E18" color="#8B7040" label="firing up the engine..." />,
});
const SankeyViz = dynamic(() => import("@/components/SankeyViz"), {
  ssr: false,
  loading: () => <VizLoader label="loading budget data..." />,
});
const AgentsViz = dynamic(() => import("@/components/AgentsViz"), {
  ssr: false,
  loading: () => <VizLoader label="initialising agent network..." />,
});
const MatrixRain = dynamic(() => import("@/components/MatrixRain"), { ssr: false });

function VizLoader({ bg = "#0A0E14", border = "#21262D", color = "#1a3a1a", label }: {
  bg?: string; border?: string; color?: string; label: string;
}) {
  return (
    <div className="rounded-3xl h-64 flex items-center justify-center"
      style={{ background: bg, border: `1px solid ${border}` }}>
      <span className="text-sm" style={{ color, fontFamily: "var(--font-mono), monospace" }}>{label}</span>
    </div>
  );
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const MG  = "#00FF41";   // matrix green
const MD  = "#008F11";   // dim green
const MBG = "#000500";   // bg
const MC  = "#020c02";   // card bg
const MB  = "#003300";   // border

// ─── Projects ─────────────────────────────────────────────────────────────────
const projects = [
  {
    id: "agents",
    icon: "🤖",
    title: "Story of Agents — From Chat AI to the Autonomous Enterprise",
    tags: ["Multi-Agent", "MCP", "LangGraph", "A2A", "LLM Observability"],
    githubUrl: "https://github.com/binzidd/storyofagents",
    story: (
      <>
        <span style={{ color: MG, fontWeight: 600 }}>Six capabilities. One journey.</span>{" "}
        An interactive briefing tracing the evolution from tool calling to full agent-to-agent networks —
        covering LangGraph orchestration, Model Context Protocol as the universal enterprise connector,
        and A2A as the virtual firm that runs at machine speed.{" "}
        <span style={{ color: MG }}>Built for financial services. Applies everywhere.</span>
      </>
    ),
    component: <AgentsViz />,
  },
  {
    id: "budget",
    icon: "🏛️",
    title: "AU Federal Budget 2024-25 — Trace the Money",
    tags: ["Gov Data", "Sankey", "SVG Viz", "Tax & Spending"],
    githubUrl: "https://github.com/binzidd/au-govt-budget-sankey",
    story: (
      <>
        <span style={{ color: MG, fontWeight: 600 }}>$738.5B — where does it go?</span>{" "}
        4-level interactive Sankey: revenue buckets → sources → spending portfolios → sub-programs.
        Hover any node or ribbon to trace a dollar&apos;s journey from your tax return to NDIS, hospitals,
        defence, or debt servicing.{" "}
        <span style={{ color: MG }}>Click any node to zoom in and trace connected flows.</span>
      </>
    ),
    component: <SankeyViz />,
  },
  {
    id: "f1",
    icon: "🏎️",
    title: "F1 2025 — Championship Bar Chart Race",
    tags: ["Data Viz", "React", "Framer Motion", "F1 2025"],
    githubUrl: "https://github.com/binzidd/f1-2025-championship-race",
    story: (
      <>
        <span style={{ color: "#3671C6", fontWeight: 600 }}>The story in data:</span>{" "}
        Verstappen started P5 after Round 2 with McLarens dominating. Wins in Japan, Miami, Imola,
        Spain, Austria, Belgium, Netherlands — he clawed back the deficit. Monza masterclass,
        Norris DNF, Max leads for the first time all season.{" "}
        <span style={{ color: MG }}>Press play and watch it unfold — bar by bar.</span>
      </>
    ),
    component: <F1BarChartRace />,
  },
  {
    id: "starlink",
    icon: "🛰️",
    title: "Starlink Constellation — Satellite Growth & NSW Passes",
    tags: ["Space Data", "Orbital Mechanics", "React", "SVG Viz"],
    githubUrl: "https://github.com/binzidd/starlink-constellation-viz",
    story: (
      <>
        <span style={{ color: "#00D9FF", fontWeight: 600 }}>From 60 to 7,000+:</span>{" "}
        SpaceX deployed the world&apos;s largest satellite constellation in under 6 years.
        Launch timeline, orbital shell breakdown, and daily pass frequency over{" "}
        <span style={{ color: "#3FB950" }}>Sydney / NSW (34°S)</span>.
        Visible with the naked eye on any clear night.
      </>
    ),
    component: <StarlinkViz />,
  },
  {
    id: "banking",
    icon: "🏦",
    title: "Big 4 + Macquarie — Post-COVID Rate Cycle & Deposit Wars",
    tags: ["APRA Data", "Finance", "Rate Analysis", "Market Share"],
    githubUrl: "https://github.com/binzidd/au-banking-rate-analysis",
    story: (
      <>
        <span style={{ color: "#F0A742", fontWeight: 600 }}>From 0.10% to 4.35%:</span>{" "}
        RBA cut to historic low (Nov 2020), then the most aggressive hike cycle in 30 years
        (May 2022–Nov 2023). Macquarie&apos;s consistently higher rates translated to a{" "}
        <span style={{ color: "#00D9FF" }}>+133% relative deposit market share gain</span>{" "}
        while the Big 4 played catch-up.
      </>
    ),
    component: <BankingViz />,
  },
  {
    id: "moto",
    icon: "🏍️",
    title: "Yamaha MT-10 2023 — Hypernaked Class Head-to-Head",
    tags: ["Retro Viz", "Motorbikes", "Spec Analysis", "Spider Chart"],
    githubUrl: "https://github.com/binzidd/mt10-hypernaked-showdown",
    story: (
      <>
        <span style={{ color: "#E8A020", fontWeight: 600 }}>The Dark Side of Japan:</span>{" "}
        My MT-10&apos;s 998cc CP4 — same block as the YZF-R1 — vs Kawasaki Z H2, BMW S1000R,
        Ducati Streetfighter V4, KTM 1290 Super Duke R, Aprilia Tuono V4. Gauges, spec bars,
        spider chart, full electronics matrix.{" "}
        <span style={{ color: "#E8A020" }}>Best value-per-hp in the class.</span>
      </>
    ),
    component: <MotoViz />,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function HobbyProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-100px" });

  // Use a ref to fire the sequence exactly once — avoids cleanup bug from deps re-running
  const started = useRef(false);
  const [phase, setPhase] = useState<"idle" | "rain" | "reveal" | "done">("idle");

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    setPhase("rain");
    const t1 = setTimeout(() => setPhase("reveal"), 1500);
    const t2 = setTimeout(() => setPhase("done"),   3400);
    // Only clean up on unmount, not on re-renders
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]); // inView only — phase intentionally excluded

  const rainOpacity = phase === "rain" ? 0.55 : phase === "reveal" ? 0.18 : phase === "done" ? 0.07 : 0;
  const revealed    = phase === "reveal" || phase === "done";

  return (
    <section
      ref={sectionRef}
      id="hobbies"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: MBG, minHeight: "100vh" }}
    >
      {/* ── Matrix rain background ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        animate={{ opacity: rainOpacity }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        {phase !== "idle" && <MatrixRain opacity={1} speed={1.1} color={MG} fontSize={13} />}
      </motion.div>

      {/* ── Scan-line sweep on entrance ── */}
      <AnimatePresence>
        {phase === "rain" && (
          <motion.div
            key="scanline"
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              height: 2,
              background: `linear-gradient(90deg, transparent, ${MG}, transparent)`,
              zIndex: 5,
            }}
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* ── All content — always mounted, opacity-driven ── */}
      <div className="relative max-w-4xl mx-auto" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="mb-20">
          <motion.div
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ color: MG, fontFamily: "var(--font-mono), monospace" }}
              animate={{ opacity: revealed ? 1 : 0, x: revealed ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <MatrixDecoder text="// hobby.projects" trigger={revealed} delay={0.1} />
            </motion.p>

            <h2
              className="text-5xl md:text-6xl font-light mb-4"
              style={{ color: MG, fontFamily: "var(--font-cormorant), serif", textShadow: `0 0 20px ${MG}44` }}
            >
              <MatrixDecoder text="Hobby Projects" trigger={revealed} delay={0.3} />
            </h2>

            <motion.p
              className="text-sm max-w-lg"
              style={{ color: MD, fontFamily: "var(--font-inter), sans-serif" }}
              animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Data viz doesn&apos;t stop at 5pm. Multi-agent briefings, F1 championship races,
              satellite constellations, post-COVID banking dynamics, and motorbike spec battles —
              all built with the same rigour as production code.
            </motion.p>
          </motion.div>

          {/* Rain-phase loading indicator */}
          <AnimatePresence>
            {phase === "rain" && (
              <motion.div
                key="loader"
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-px mb-4" style={{ background: MB }}>
                  <motion.div
                    className="h-full"
                    style={{ background: `linear-gradient(90deg, ${MG}, ${MD})` }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4, ease: "linear" }}
                  />
                </div>
                <motion.p
                  className="text-xs"
                  style={{ color: MD, fontFamily: "var(--font-mono), monospace" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  &gt; decrypting_projects --matrix --init
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Projects — always rendered, stagger in on reveal ── */}
        <div className="space-y-20">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              animate={{
                opacity: revealed ? 1 : 0,
                y: revealed ? 0 : 32,
              }}
              transition={{ duration: 0.7, delay: revealed ? 0.5 + idx * 0.2 : 0, ease: EASE }}
            >
              {/* Meta bar */}
              <div className="flex items-start gap-4 mb-5">
                <span className="text-3xl mt-1">{proj.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold mb-2"
                    style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif" }}>
                    {proj.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: MC, color: MD, border: `1px solid ${MB}`, fontFamily: "var(--font-mono), monospace" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Number + GitHub link */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] px-2 py-1 rounded-full hidden sm:inline"
                    style={{ background: `${MG}12`, color: MG, border: `1px solid ${MG}30`, fontFamily: "var(--font-mono), monospace" }}>
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200"
                    style={{ background: `${MG}10`, color: MG, border: `1px solid ${MG}35`, fontFamily: "var(--font-mono), monospace", textDecoration: "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${MG}25`; e.currentTarget.style.boxShadow = `0 0 14px ${MG}30`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = `${MG}10`; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    view_source
                  </a>
                </div>
              </div>

              {/* Viz component */}
              <motion.div
                className="rounded-3xl overflow-hidden"
                style={{ border: `1px solid ${MB}` }}
                whileHover={{ boxShadow: `0 0 40px ${MG}12` }}
                transition={{ duration: 0.3 }}
              >
                {proj.component}
              </motion.div>

              {/* Story caption */}
              <motion.div
                className="mt-5 p-5 rounded-2xl"
                style={{ background: MC, border: `1px solid ${MB}` }}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ delay: revealed ? 0.8 + idx * 0.2 : 0, duration: 0.5 }}
              >
                <p className="text-sm leading-relaxed"
                  style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                  {proj.story}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* HUD corners */}
      <AnimatePresence>
        {revealed && (
          <>
            <motion.p
              key="hud-left"
              className="absolute top-5 left-6 text-[9px] pointer-events-none select-none"
              style={{ color: MB, fontFamily: "var(--font-mono), monospace", zIndex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              SYS:HOBBY_MATRIX v2.5.0 [ACTIVE]
            </motion.p>
            <motion.p
              key="hud-right"
              className="absolute top-5 right-6 text-[9px] pointer-events-none select-none"
              style={{ color: MB, fontFamily: "var(--font-mono), monospace", zIndex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              NODES: 5 | STATUS: ONLINE
            </motion.p>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
