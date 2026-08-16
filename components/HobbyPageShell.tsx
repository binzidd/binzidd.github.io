"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECT_META } from "@/data/hobby-projects";

// ── Per-project lazy viz components ──────────────────────────────────────────
function VizSkeleton({ color = "var(--c-accent)" }: { color?: string }) {
  return (
    <div className="rounded-3xl h-72 flex items-center justify-center"
      style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}>
      <span className="text-xs animate-pulse" style={{ color, fontFamily: "var(--font-mono),monospace" }}>
        loading visualisation...
      </span>
    </div>
  );
}

const VIZ: Record<string, React.ComponentType> = {
  agents:  dynamic(() => import("@/components/AgentsViz"),     { ssr: false, loading: () => <VizSkeleton color="#00D9FF" /> }),
  budget:  dynamic(() => import("@/components/SankeyViz"),     { ssr: false, loading: () => <VizSkeleton /> }),
  f1:      dynamic(() => import("@/components/F1BarChartRace"),{ ssr: false, loading: () => <VizSkeleton color="#3671C6" /> }),
  starlink:dynamic(() => import("@/components/StarlinkViz"),   { ssr: false, loading: () => <VizSkeleton color="#00D9FF" /> }),
  banking: dynamic(() => import("@/components/BankingViz"),    { ssr: false, loading: () => <VizSkeleton color="#F0A742" /> }),
  moto:    dynamic(() => import("@/components/MotoViz"),       { ssr: false, loading: () => <VizSkeleton color="#E8A020" /> }),
  carbon:  dynamic(() => import("@/components/CarbonViz"),     { ssr: false, loading: () => <VizSkeleton color="#10B981" /> }),
  loopscoop: dynamic(() => import("@/components/LoopScoopViz"),{ ssr: false, loading: () => <VizSkeleton color="#f2889f" /> }),
};

// ── EASE ──────────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Page shell ────────────────────────────────────────────────────────────────
export default function HobbyPageShell({ slug }: { slug: string }) {
  const p = PROJECT_META[slug];
  if (!p) return null;

  const VizComponent = VIZ[slug];

  return (
    <div className="min-h-screen" style={{ background: "var(--c-bg)" }}>

      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(0,0,0,0.92)", borderBottom: "1px solid var(--c-border)", backdropFilter: "blur(12px)" }}>
        <Link href="/#hobbies"
          className="flex items-center gap-2 text-[10px] transition-colors duration-150"
          style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--c-accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--c-dim)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          binay.is-a.dev
        </Link>
        <span className="text-[9px] hidden sm:block" style={{ color: "var(--c-border)", fontFamily: "var(--font-mono),monospace" }}>
          {p.code}
        </span>
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] transition-all duration-150"
          style={{ color: "var(--c-accent)", border: "1px solid var(--c-border)", fontFamily: "var(--font-mono),monospace", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--c-accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--c-border)"; }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          view_source
        </a>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}>
          <p className="text-[9px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace" }}>{p.code}</p>
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl mt-1 flex-shrink-0">{p.icon}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight"
              style={{ color: "var(--c-text)", fontFamily: "var(--font-cormorant),serif" }}>
              {p.title}
            </h1>
          </div>
          <p className="text-sm md:text-base leading-relaxed max-w-2xl mb-5"
            style={{ color: "var(--c-muted)", fontFamily: "var(--font-inter),sans-serif" }}>
            {p.thesis}
          </p>
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full"
                style={{ background: "var(--c-surface)", color: "var(--c-dim)", border: "1px solid var(--c-border)", fontFamily: "var(--font-mono),monospace" }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </header>

      {/* ── Metrics strip ──────────────────────────────────────────────────── */}
      <motion.div className="max-w-5xl mx-auto px-6 mb-10"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}>
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden divide-x divide-y md:divide-y-0 divide-[color:var(--c-border)]"
          style={{ border: "1px solid var(--c-border)", background: "var(--c-surface)" }}>
          {p.metrics.map((m, i) => (
            <div key={i} className="px-5 py-4 text-center">
              <p className="text-xl md:text-2xl font-light tabular-nums mb-0.5"
                style={{ color: "var(--c-accent)", fontFamily: "var(--font-mono),monospace" }}>{m.value}</p>
              <p className="text-[9px] uppercase tracking-widest"
                style={{ color: "var(--c-muted)", fontFamily: "var(--font-inter),sans-serif" }}>{m.label}</p>
              {m.sub && (
                <p className="text-[8px] mt-0.5"
                  style={{ color: "#4B5563", fontFamily: "var(--font-mono),monospace" }}>{m.sub}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Visualisation ──────────────────────────────────────────────────── */}
      <motion.div className="max-w-5xl mx-auto px-6 mb-12"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}>
        <VizComponent />
      </motion.div>

      {/* ── Analysis grid ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Key findings — wider col */}
          <motion.div className="lg:col-span-3 rounded-2xl p-6"
            style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}>
            <p className="text-[9px] tracking-[0.25em] uppercase mb-4"
              style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace" }}>
              // key_findings
            </p>
            <ol className="space-y-4">
              {p.findings.map((f, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[10px] mt-0.5 flex-shrink-0 tabular-nums"
                    style={{ color: "var(--c-border)", fontFamily: "var(--font-mono),monospace" }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <p className="text-[11px] md:text-xs leading-relaxed"
                    style={{ color: "var(--c-muted)", fontFamily: "var(--font-inter),sans-serif" }}>
                    {f}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Methodology sidebar */}
          <motion.div className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}>

            {/* Data sources */}
            <div className="rounded-2xl p-5" style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}>
              <p className="text-[9px] tracking-[0.25em] uppercase mb-3"
                style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace" }}>
                // data_lineage
              </p>
              <ul className="space-y-1.5">
                {p.sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] leading-snug block transition-colors duration-100"
                        style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace", textDecoration: "none" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--c-accent)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--c-dim)"; }}>
                        ↳ {s.label}
                      </a>
                    ) : (
                      <span className="text-[10px] leading-snug block"
                        style={{ color: "#4B5563", fontFamily: "var(--font-mono),monospace" }}>
                        ↳ {s.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div className="rounded-2xl p-5" style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}>
              <p className="text-[9px] tracking-[0.25em] uppercase mb-3"
                style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace" }}>
                // built_with
              </p>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="text-[9px] px-2 py-0.5 rounded"
                    style={{ background: "var(--c-bg)", color: "var(--c-dim)", border: "1px solid var(--c-border)", fontFamily: "var(--font-mono),monospace" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Methodology note */}
            <div className="rounded-2xl p-5" style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}>
              <p className="text-[9px] tracking-[0.25em] uppercase mb-3"
                style={{ color: "var(--c-dim)", fontFamily: "var(--font-mono),monospace" }}>
                // methodology_note
              </p>
              <p className="text-[10px] leading-relaxed"
                style={{ color: "#4B5563", fontFamily: "var(--font-inter),sans-serif" }}>
                {p.note}
              </p>
            </div>

          </motion.div>
        </div>
      </div>

    </div>
  );
}
