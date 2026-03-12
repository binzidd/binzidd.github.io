"use client";

import { useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  starlinkLaunches, orbitalShells, nswPassData, MILESTONES,
  pricingHistory, adoptionData,
} from "@/data/starlink";
import { useEffect } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CY   = "#00D9FF";
const PU   = "#7C3AED";
const AM   = "#F0A742";
const DIM  = "#484F58";
const DIMMER = "#30363D";
const BORDER = "#1a3a6a";
const MONO = "var(--font-mono), monospace";

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ target, duration = 1.5, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, target, { duration, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, target, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Animated Earth globe ──────────────────────────────────────────────────────
function EarthOrbit() {
  return (
    <div className="relative w-56 h-56 mx-auto">
      <div className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at 35% 35%, #1a4a8a, #0d2b5e 50%, #050e1f)", boxShadow: "0 0 40px rgba(0,100,200,0.4), inset -20px -20px 40px rgba(0,0,0,0.6)" }}>
        <div className="absolute inset-0 rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse at 30% 40%, #2d8a4e 0%, transparent 30%), radial-gradient(ellipse at 70% 35%, #2d6a3e 0%, transparent 20%), radial-gradient(ellipse at 50% 65%, #2d5e38 0%, transparent 25%)" }} />
        <div className="absolute -inset-2 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, transparent 60%, rgba(0,100,255,0.3) 80%, rgba(0,150,255,0.1) 100%)" }} />
      </div>
      {orbitalShells.slice(0, 3).map((shell, i) => {
        const size = 90 + i * 26;
        const off = `calc(50% - ${size / 2}px)`;
        return (
          <motion.div key={i} className="absolute rounded-full border"
            style={{ width: size, height: size, top: off, left: off, borderColor: `${shell.color}33`, borderWidth: 1 }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}>
            <motion.div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: shell.color, top: -3, left: "50%" }} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Tesla Roadster card ──────────────────────────────────────────────────────
function TeslaCard() {
  return (
    <motion.div className="rounded-2xl p-5 mb-6"
      style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.3)" }}
      initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
      whileHover={{ scale: 1.005 }}>
      <div className="flex gap-4">
        <div className="text-4xl flex-shrink-0 mt-0.5">🚗</div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold" style={{ color: PU, fontFamily: MONO }}>
              STARMAN &amp; THE ROADSTER
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: PU, border: "1px solid rgba(124,58,237,0.3)", fontFamily: MONO }}>
              honorary_payload
            </span>
          </div>
          <p className="text-[10px] leading-relaxed mb-2" style={{ color: "#8B949E", fontFamily: MONO }}>
            <span style={{ color: "#E6EDF3" }}>Feb 7, 2018 — Falcon Heavy Demo Flight.</span>{" "}
            Elon&apos;s personal cherry-red Tesla Roadster was strapped to the rocket as a test payload.
            &quot;Starman&quot; (a mannequin in a spacesuit) sits at the wheel. David Bowie&apos;s 🎵 <em>Space Oddity</em> plays on loop.
            Dashboard reads <span style={{ color: CY }}>&quot;DON&apos;T PANIC&quot;</span> in a nod to Hitchhiker&apos;s Guide.
          </p>
          <p className="text-[10px]" style={{ color: DIMMER, fontFamily: MONO }}>
            🌌 Now ~3.6B km from Earth · heliocentric orbit past Mars · has exceeded its 36,000-mile warranty by ~3 billion miles
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step-path helpers ─────────────────────────────────────────────────────────
function stepPath(pts: { x: number; y: number }[]): string {
  return pts.reduce((d, pt, i) => {
    if (i === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = pts[i - 1];
    return d + ` L ${pt.x.toFixed(1)} ${prev.y.toFixed(1)} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, "");
}
function stepFill(pts: { x: number; y: number }[], baseY: number): string {
  if (!pts.length) return "";
  const line = stepPath(pts);
  return `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${baseY.toFixed(1)} L ${pts[0].x.toFixed(1)} ${baseY.toFixed(1)} Z`;
}

// ─── Adoption bar chart ───────────────────────────────────────────────────────
function AdoptionChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const MAX_H = 160;

  return (
    <div ref={ref} className="overflow-x-auto">
      <div style={{ display: "flex", gap: 6, minWidth: 360, padding: "0 4px" }}>
        {adoptionData.map((d, i) => {
          const barH = Math.max(4, (d.subscribersK / 5000) * MAX_H);
          const hasMilestone = !!d.milestone;
          return (
            <div key={d.month}
              style={{ flex: "1 0 36px", maxWidth: 52, display: "flex", flexDirection: "column", alignItems: "center", height: 240 }}>
              {/* Milestone zone — grows to fill space above bar */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 6 }}>
                {hasMilestone && (
                  <div style={{
                    fontSize: 7, color: CY, fontFamily: MONO, textAlign: "center",
                    background: "rgba(0,217,255,0.08)", border: "1px solid rgba(0,217,255,0.25)",
                    borderRadius: 4, padding: "2px 5px", whiteSpace: "nowrap", lineHeight: 1.4,
                  }}>
                    {d.milestone}
                  </div>
                )}
              </div>
              {/* Value */}
              <div style={{ fontSize: 8, color: hasMilestone ? CY : DIM, fontFamily: MONO, marginBottom: 3, textAlign: "center" }}>
                {d.subscribersK >= 1000
                  ? `${(d.subscribersK / 1000).toFixed(d.subscribersK % 1000 === 0 ? 0 : 1)}M`
                  : `${d.subscribersK}K`}
              </div>
              {/* Bar */}
              <motion.div
                style={{
                  width: 28, borderRadius: "3px 3px 0 0", flexShrink: 0,
                  background: hasMilestone
                    ? `linear-gradient(to top, rgba(0,217,255,0.5), ${CY})`
                    : `linear-gradient(to top, rgba(0,217,255,0.2), rgba(0,217,255,0.6))`,
                  boxShadow: hasMilestone ? `0 0 10px rgba(0,217,255,0.35)` : "none",
                }}
                initial={{ height: 0 }}
                animate={inView ? { height: barH } : { height: 0 }}
                transition={{ duration: 0.9, delay: i * 0.07, ease: EASE }}
              />
              {/* Month label */}
              <div style={{ height: 26, display: "flex", alignItems: "center", fontSize: 7, color: DIM, fontFamily: MONO, textAlign: "center" }}>
                {d.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
type Tab = "launches" | "orbital" | "pricing" | "adoption";

export default function StarlinkViz() {
  const [tab, setTab] = useState<Tab>("launches");
  const maxSats = Math.max(...starlinkLaunches.map(d => d.satsLaunched));
  const maxCumulative = Math.max(...starlinkLaunches.map(d => d.cumulative));

  // Pricing chart math
  const n = pricingHistory.length;
  const VW = 440, VH = 155;
  const PL = 44, PT = 14, PR = 12, PB = 38;
  const IW = VW - PL - PR;
  const IH = VH - PT - PB;
  const xP = (i: number) => PL + (i / (n - 1)) * IW;

  // Monthly chart: y-range 40–140
  const yM = (v: number) => PT + IH - ((v - 40) / 100) * IH;
  const baseYM = yM(40);
  const resPts = pricingHistory.map((d, i) => ({ x: xP(i), y: yM(d.monthly) }));
  const basicStartI = pricingHistory.findIndex(d => d.monthlyBasic !== null);
  const basicPts = pricingHistory
    .filter((_, i) => i >= basicStartI)
    .map((d, j) => ({ x: xP(basicStartI + j), y: yM(d.monthlyBasic!) }));

  // Hardware chart: y-range 200–650
  const yH = (v: number) => PT + IH - ((v - 200) / 450) * IH;
  const baseYH = yH(200);
  const hwPts = pricingHistory.map((d, i) => ({ x: xP(i), y: yH(d.hardware) }));

  // X-axis labels (every other)
  const xTicks = [0, 2, 4, 6, 7];

  const pricingRef = useRef<SVGSVGElement>(null);
  const pricingInView = useInView(pricingRef, { once: true });

  const TABS: { id: Tab; label: string }[] = [
    { id: "launches", label: "🚀 launches" },
    { id: "orbital",  label: "🛸 orbital"  },
    { id: "pricing",  label: "💰 pricing"  },
    { id: "adoption", label: "👥 adoption" },
  ];

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#050e1f", border: "1px solid #1a3a6a" }}>

      {/* Header */}
      <div className="px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #050e1f, #0d2b5e)", borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: CY, fontFamily: MONO }}>// starlink.constellation</p>
            <h3 className="text-xl font-semibold" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}>
              SpaceX Starlink — Full Mission Dashboard
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200"
                style={{
                  background: tab === t.id ? CY : "rgba(0,217,255,0.08)",
                  color: tab === t.id ? "#050e1f" : "#8B949E",
                  fontFamily: MONO,
                  border: `1px solid ${tab === t.id ? CY : "rgba(0,217,255,0.2)"}`,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div className="flex flex-wrap gap-6 mt-6">
          {[
            { label: "Sats in orbit",   value: 7234, suffix: "+"  },
            { label: "Subscribers",     value: 5,    suffix: "M+" },
            { label: "Orbital shells",  value: 5,    suffix: ""   },
            { label: "NSW passes/day",  value: 12,   suffix: "+"  },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold" style={{ color: CY, fontFamily: MONO }}>
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[10px]" style={{ color: DIM, fontFamily: MONO }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">

        {/* ── Tab: Launches ──────────────────────────────────────────────────── */}
        {tab === "launches" && (
          <div>
            <TeslaCard />
            <p className="text-[10px] mb-1" style={{ color: DIM, fontFamily: MONO }}>
              Satellites deployed per launch mission — 2019 to present
            </p>
            <div className="flex gap-3 mb-5 text-[9px]" style={{ fontFamily: MONO }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: CY }} /> LEO ~550km
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: PU }} /> VLEO ~340km (Gen2)
              </span>
            </div>
            <div className="space-y-1.5">
              {starlinkLaunches.map((d, i) => {
                const isVLEO = d.orbit.includes("340") || d.orbit.startsWith("VLEO");
                const color = isVLEO ? PU : CY;
                const barPct = (d.satsLaunched / maxSats) * 100;
                const showYear = i === 0 || d.year !== starlinkLaunches[i - 1].year;
                const milestone = MILESTONES.find(m => Math.abs(m.cumulative - d.cumulative) < 200);

                return (
                  <div key={d.date}>
                    {showYear && (
                      <div className="flex items-center gap-2 my-3">
                        <div className="h-px flex-1" style={{ background: BORDER }} />
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: CY, background: "rgba(0,217,255,0.08)", border: `1px solid rgba(0,217,255,0.2)`, fontFamily: MONO }}>
                          {d.year}
                        </span>
                        <div className="h-px flex-1" style={{ background: BORDER }} />
                      </div>
                    )}
                    <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.025, duration: 0.45, ease: EASE }}>
                      <div className="flex items-center gap-2">
                        {/* Date — FIXED: full month string, no slice */}
                        <span className="text-[9px] w-[72px] flex-shrink-0 text-right" style={{ color: DIM, fontFamily: MONO }}>
                          {d.month}
                        </span>
                        {/* Mission name */}
                        <span className="text-[9px] w-[96px] flex-shrink-0 truncate" style={{ color: DIMMER, fontFamily: MONO }}>
                          {d.mission}
                        </span>
                        {/* Deployed bar */}
                        <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "#0d2b5e" }}>
                          <motion.div className="h-full rounded-full flex items-center px-2 gap-1"
                            style={{ background: `linear-gradient(90deg, ${color}99, ${color}66)` }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${barPct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.0, delay: i * 0.025, ease: EASE }}>
                            <span style={{ color, fontSize: 8, fontFamily: MONO, whiteSpace: "nowrap" }}>
                              +{d.satsLaunched}
                            </span>
                          </motion.div>
                        </div>
                        {/* Cumulative total */}
                        <span className="text-[9px] w-14 text-right flex-shrink-0" style={{ color: DIMMER, fontFamily: MONO }}>
                          {d.cumulative.toLocaleString()}
                        </span>
                        {/* Milestone badge */}
                        {milestone && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full flex-shrink-0 hidden sm:inline"
                            style={{ background: "rgba(0,217,255,0.08)", color: CY, border: "1px solid rgba(0,217,255,0.2)", fontFamily: MONO }}>
                            ★ {milestone.label.replace("\n", " ")}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: Orbital + NSW passes ──────────────────────────────────────── */}
        {tab === "orbital" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <EarthOrbit />
              <div>
                <p className="text-xs mb-4" style={{ color: DIM, fontFamily: MONO }}>
                  Five orbital shells — altitude, inclination &amp; satellite count
                </p>
                <div className="space-y-3">
                  {orbitalShells.map((shell, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "#0d2b5e22", border: `1px solid ${shell.color}33` }}>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: shell.color, boxShadow: `0 0 6px ${shell.color}` }} />
                      <p className="text-[10px] flex-1" style={{ color: "#E6EDF3", fontFamily: MONO }}>{shell.label}</p>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: shell.color, fontFamily: MONO }}>{shell.count.toLocaleString()}</p>
                        <p className="text-[9px]" style={{ color: DIM, fontFamily: MONO }}>sats</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* NSW passes */}
            <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className="text-xs font-medium mb-1" style={{ color: CY, fontFamily: MONO }}>📡 NSW / Sydney passes per day</p>
              <p className="text-[10px] mb-5" style={{ color: DIMMER, fontFamily: MONO }}>
                LEO ~550km, orbital period ~90 min, visibility window ~10 min from 34°S
              </p>
              <div className="space-y-3">
                {nswPassData.map((d, i) => {
                  const maxP = Math.max(...nswPassData.map(x => x.passesPerDay));
                  const w = (d.passesPerDay / maxP) * 100;
                  return (
                    <motion.div key={d.month}
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] w-16 text-right flex-shrink-0" style={{ color: DIM, fontFamily: MONO }}>{d.month}</span>
                        <div className="flex-1 h-7 rounded-xl overflow-hidden" style={{ background: "#0d2b5e" }}>
                          <motion.div className="h-full rounded-xl flex items-center px-3"
                            style={{ background: "linear-gradient(90deg, rgba(0,100,200,0.6), rgba(0,217,255,0.4))" }}
                            initial={{ width: 0 }} whileInView={{ width: `${w}%` }}
                            viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }}>
                            <span className="text-xs font-bold" style={{ color: CY, fontFamily: MONO }}>~{d.passesPerDay}/day</span>
                          </motion.div>
                        </div>
                        <span className="text-[9px] w-20 text-right flex-shrink-0" style={{ color: DIMMER, fontFamily: MONO }}>
                          {d.totalSats.toLocaleString()} sats
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(0,100,200,0.06)", border: "1px solid rgba(0,217,255,0.15)" }}>
                <p className="text-[10px] leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                  <span style={{ color: CY }}>📡 At 12+ passes/day</span> — Sydney residents can see Starlink trains with the naked eye every clear night.
                  Each pass lasts ~6–10 min. With 7,000+ satellites operational, Australia has 24/7 coverage with zero latency gaps.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Pricing ───────────────────────────────────────────────────── */}
        {tab === "pricing" && (
          <div>
            {/* Callout pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { emoji: "📉", text: "Hardware $499 → $299  (−40%)", color: "#3FB950" },
                { emoji: "📈", text: "Monthly $99 → $120",           color: "#F0A742" },
                { emoji: "🆕", text: "Basic plan $50/mo (Mar 2023)",  color: CY },
              ].map(p => (
                <div key={p.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]"
                  style={{ background: `${p.color}11`, border: `1px solid ${p.color}33`, color: p.color, fontFamily: MONO }}>
                  {p.emoji} {p.text}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly subscription chart */}
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "#E6EDF3", fontFamily: MONO }}>💳 Monthly subscription (USD)</p>
                <p className="text-[9px] mb-3" style={{ color: DIM, fontFamily: MONO }}>Residential standard · Basic plan</p>
                <div className="overflow-x-auto">
                  <svg ref={pricingRef} viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", minWidth: 280 }}>
                    {/* Gridlines */}
                    {[50, 100, 120].map(v => (
                      <g key={v}>
                        <line x1={PL} x2={PL + IW} y1={yM(v)} y2={yM(v)} stroke={BORDER} strokeWidth={0.5} strokeDasharray="4 4" />
                        <text x={PL - 4} y={yM(v) + 3.5} textAnchor="end" style={{ fill: DIM, fontSize: 9, fontFamily: "monospace" }}>${v}</text>
                      </g>
                    ))}
                    {/* Baseline */}
                    <line x1={PL} x2={PL + IW} y1={baseYM} y2={baseYM} stroke={BORDER} strokeWidth={0.5} />
                    {/* X labels */}
                    {xTicks.map(i => (
                      <text key={i} textAnchor="end"
                        transform={`translate(${xP(i)}, ${VH - PB + 12}) rotate(-35)`}
                        style={{ fill: DIM, fontSize: 8, fontFamily: "monospace" }}>
                        {pricingHistory[i].month}
                      </text>
                    ))}
                    {/* Residential fill + line */}
                    <motion.path d={stepFill(resPts, baseYM)} fill={`${CY}0D`} stroke="none"
                      initial={{ opacity: 0 }} animate={pricingInView ? { opacity: 1 } : {}} transition={{ delay: 1, duration: 0.5 }} />
                    <motion.path d={stepPath(resPts)} fill="none" stroke={CY} strokeWidth={1.5}
                      initial={{ pathLength: 0 }} animate={pricingInView ? { pathLength: 1 } : {}} transition={{ duration: 2, ease: EASE }} />
                    {/* Basic fill + line */}
                    <motion.path d={stepFill(basicPts, baseYM)} fill={`${PU}0D`} stroke="none"
                      initial={{ opacity: 0 }} animate={pricingInView ? { opacity: 1 } : {}} transition={{ delay: 1.5, duration: 0.5 }} />
                    <motion.path d={stepPath(basicPts)} fill="none" stroke={PU} strokeWidth={1.5} strokeDasharray="5 3"
                      initial={{ pathLength: 0 }} animate={pricingInView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, delay: 0.3, ease: EASE }} />
                    {/* Dots */}
                    {resPts.map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill={CY} opacity={0.8} />)}
                    {basicPts.map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill={PU} opacity={0.8} />)}
                    {/* Legend */}
                    <line x1={PL} x2={PL + 14} y1={VH - 6} y2={VH - 6} stroke={CY} strokeWidth={1.5} />
                    <text x={PL + 18} y={VH - 3} style={{ fill: DIM, fontSize: 8, fontFamily: "monospace" }}>Residential</text>
                    <line x1={PL + 90} x2={PL + 104} y1={VH - 6} y2={VH - 6} stroke={PU} strokeWidth={1.5} strokeDasharray="5 3" />
                    <text x={PL + 108} y={VH - 3} style={{ fill: DIM, fontSize: 8, fontFamily: "monospace" }}>Basic plan</text>
                  </svg>
                </div>
              </div>

              {/* Hardware chart */}
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "#E6EDF3", fontFamily: MONO }}>📡 Hardware kit (USD one-time)</p>
                <p className="text-[9px] mb-3" style={{ color: DIM, fontFamily: MONO }}>Dish + router — standard kit price</p>
                <div className="overflow-x-auto">
                  <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", minWidth: 280 }}>
                    {[299, 349, 499, 599].map(v => (
                      <g key={v}>
                        <line x1={PL} x2={PL + IW} y1={yH(v)} y2={yH(v)} stroke={BORDER} strokeWidth={0.5} strokeDasharray="4 4" />
                        <text x={PL - 4} y={yH(v) + 3.5} textAnchor="end" style={{ fill: DIM, fontSize: 9, fontFamily: "monospace" }}>${v}</text>
                      </g>
                    ))}
                    <line x1={PL} x2={PL + IW} y1={baseYH} y2={baseYH} stroke={BORDER} strokeWidth={0.5} />
                    {xTicks.map(i => (
                      <text key={i} textAnchor="end"
                        transform={`translate(${xP(i)}, ${VH - PB + 12}) rotate(-35)`}
                        style={{ fill: DIM, fontSize: 8, fontFamily: "monospace" }}>
                        {pricingHistory[i].month}
                      </text>
                    ))}
                    <motion.path d={stepFill(hwPts, baseYH)} fill={`${AM}0D`} stroke="none"
                      initial={{ opacity: 0 }} animate={pricingInView ? { opacity: 1 } : {}} transition={{ delay: 1, duration: 0.5 }} />
                    <motion.path d={stepPath(hwPts)} fill="none" stroke={AM} strokeWidth={1.5}
                      initial={{ pathLength: 0 }} animate={pricingInView ? { pathLength: 1 } : {}} transition={{ duration: 2, ease: EASE }} />
                    {hwPts.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r={2.5} fill={AM} opacity={0.8} />
                        {pricingHistory[i].note && (
                          <circle cx={pt.x} cy={pt.y} r={4} fill="none" stroke={AM} strokeWidth={0.8} opacity={0.4} />
                        )}
                      </g>
                    ))}
                    <line x1={PL} x2={PL + 14} y1={VH - 6} y2={VH - 6} stroke={AM} strokeWidth={1.5} />
                    <text x={PL + 18} y={VH - 3} style={{ fill: DIM, fontSize: 8, fontFamily: "monospace" }}>Hardware kit</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Note callouts */}
            <div className="mt-4 space-y-2">
              {pricingHistory.filter(d => d.note).map(d => (
                <div key={d.month} className="flex gap-2 items-center text-[9px]" style={{ color: DIM, fontFamily: MONO }}>
                  <span style={{ color: CY }}>{d.month}</span>
                  <span style={{ color: BORDER }}>—</span>
                  <span>{d.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Adoption ──────────────────────────────────────────────────── */}
        {tab === "adoption" && (
          <div>
            <p className="text-xs mb-1" style={{ color: DIM, fontFamily: MONO }}>
              Global subscriber growth — Oct 2020 to Mar 2025
            </p>
            <p className="text-[10px] mb-6" style={{ color: DIMMER, fontFamily: MONO }}>
              500× growth in 4.5 years · fastest commercial satellite internet adoption on record
            </p>
            <AdoptionChart />
            <div className="mt-6 p-4 rounded-2xl" style={{ background: "rgba(0,217,255,0.04)", border: "1px solid rgba(0,217,255,0.12)" }}>
              <p className="text-[10px] leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                <span style={{ color: CY }}>📈 10K beta testers (Oct 2020) → 5M paying subscribers (Mar 2025).</span>{" "}
                Driven by remote work demand, maritime/aviation expansion, and hardware price cuts.
                Starlink now serves 100+ countries with 99% uptime SLA.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
