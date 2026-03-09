"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { starlinkLaunches, orbitalShells, nswPassData, MILESTONES } from "@/data/starlink";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Counter({ target, duration = 1.5, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// Animated Earth globe with orbital rings
function EarthOrbit() {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      {/* Earth */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at 35% 35%, #1a4a8a, #0d2b5e 50%, #050e1f)", boxShadow: "0 0 40px rgba(0,100,200,0.4), inset -20px -20px 40px rgba(0,0,0,0.6)" }}>
        {/* Continents hint */}
        <div className="absolute inset-0 rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse at 30% 40%, #2d8a4e 0%, transparent 30%), radial-gradient(ellipse at 70% 35%, #2d6a3e 0%, transparent 20%), radial-gradient(ellipse at 50% 65%, #2d5e38 0%, transparent 25%)" }} />
        {/* Atmosphere glow */}
        <div className="absolute -inset-2 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, transparent 60%, rgba(0,100,255,0.3) 80%, rgba(0,150,255,0.1) 100%)" }} />
      </div>

      {/* Orbital rings — animated */}
      {orbitalShells.slice(0, 3).map((shell, i) => {
        const size = 100 + i * 28;
        const offsetPct = `calc(50% - ${size / 2}px)`;
        return (
          <motion.div key={i}
            className="absolute rounded-full border"
            style={{
              width: size, height: size,
              top: offsetPct, left: offsetPct,
              borderColor: `${shell.color}33`,
              borderWidth: 1,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}>
            {/* Satellite dot on ring */}
            <motion.div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: shell.color, top: -3, left: "50%" }} />
          </motion.div>
        );
      })}

      {/* Polar orbit ring */}
      <motion.div className="absolute rounded-full border"
        style={{ width: 200, height: 200, top: "calc(50% - 100px)", left: "calc(50% - 100px)", borderColor: "#3FB95033", borderWidth: 1, transform: "rotateX(70deg) rotateZ(20deg)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
    </div>
  );
}

export default function StarlinkViz() {
  const [activeTab, setActiveTab] = useState<"growth" | "shells" | "nsw">("growth");
  const maxCumulative = Math.max(...starlinkLaunches.map(d => d.cumulative));

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#050e1f", border: "1px solid #1a3a6a" }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #050e1f, #0d2b5e)", borderBottom: "1px solid #1a3a6a" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>// starlink.constellation</p>
            <h3 className="text-xl font-semibold" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}>
              SpaceX Starlink — Constellation Growth & NSW Coverage
            </h3>
          </div>
          <div className="flex gap-2">
            {(["growth", "shells", "nsw"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab ? "#00D9FF" : "rgba(0,217,255,0.08)",
                  color: activeTab === tab ? "#050e1f" : "#8B949E",
                  fontFamily: "var(--font-mono), monospace",
                  border: `1px solid ${activeTab === tab ? "#00D9FF" : "rgba(0,217,255,0.2)"}`,
                }}>
                {tab === "growth" ? "launch_timeline" : tab === "shells" ? "orbital_shells" : "nsw_passes"}
              </button>
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div className="flex flex-wrap gap-6 mt-6">
          {[
            { label: "Total Operational", value: 7234, suffix: "" },
            { label: "Orbital Shells",    value: 5,    suffix: "" },
            { label: "NSW Passes/Day",    value: 12,   suffix: "+" },
            { label: "Coverage",          value: 99,   suffix: "%" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[10px]" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Tab: Growth Timeline */}
        {activeTab === "growth" && (
          <div>
            <p className="text-xs mb-6" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Cumulative satellites launched — 2019 to present
            </p>
            <div className="space-y-2">
              {starlinkLaunches.map((d, i) => {
                const widthPct = (d.cumulative / maxCumulative) * 100;
                const milestone = MILESTONES.find(m => Math.abs(m.cumulative - d.cumulative) < 200);
                return (
                  <motion.div key={d.date}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] w-16 flex-shrink-0 text-right" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>{d.month.slice(0, 7)}</span>
                      <div className="flex-1 h-5 rounded-full overflow-hidden relative" style={{ background: "#0d2b5e" }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, #00D9FF, #7C3AED)` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${widthPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.04, ease: EASE }}>
                          <div className="absolute right-2 top-0 bottom-0 flex items-center">
                            <span className="text-[9px] font-bold" style={{ color: "#050e1f", fontFamily: "var(--font-mono), monospace" }}>{d.cumulative.toLocaleString()}</span>
                          </div>
                        </motion.div>
                      </div>
                      {milestone && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(0,217,255,0.1)", color: "#00D9FF", border: "1px solid rgba(0,217,255,0.2)", fontFamily: "var(--font-mono), monospace" }}>
                          ★ {milestone.label.replace("\n", " ")}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Orbital Shells */}
        {activeTab === "shells" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <EarthOrbit />
            <div>
              <p className="text-xs mb-5" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
                Five orbital shells make up the full constellation
              </p>
              <div className="space-y-4">
                {orbitalShells.map((shell, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: "#0d2b5e22", border: `1px solid ${shell.color}33` }}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: shell.color, boxShadow: `0 0 8px ${shell.color}` }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: "#E6EDF3", fontFamily: "var(--font-mono), monospace" }}>{shell.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: shell.color, fontFamily: "var(--font-mono), monospace" }}>{shell.count.toLocaleString()}</p>
                      <p className="text-[9px]" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>sats</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: NSW Passes */}
        {activeTab === "nsw" && (
          <div>
            <p className="text-xs mb-2" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Estimated Starlink passes over Sydney / NSW per day as constellation grew
            </p>
            <p className="text-[10px] mb-6" style={{ color: "#30363D", fontFamily: "var(--font-mono), monospace" }}>
              (LEO ~550km, orbital period ~90min, pass visibility window ~10min from 34°S)
            </p>
            <div className="space-y-4">
              {nswPassData.map((d, i) => {
                const maxPasses = Math.max(...nswPassData.map(x => x.passesPerDay));
                const widthPct = (d.passesPerDay / maxPasses) * 100;
                return (
                  <motion.div key={d.month}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] w-16 text-right" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>{d.month}</span>
                      <div className="flex-1 h-8 rounded-xl overflow-hidden relative" style={{ background: "#0d2b5e" }}>
                        <motion.div className="h-full rounded-xl flex items-center px-3"
                          style={{ background: "linear-gradient(90deg, rgba(0,100,200,0.6), rgba(0,217,255,0.4))", backdropFilter: "blur(4px)" }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${widthPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }}>
                          <span className="text-xs font-bold whitespace-nowrap" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>
                            ~{d.passesPerDay}/day
                          </span>
                        </motion.div>
                      </div>
                      <span className="text-[10px] w-20 text-right" style={{ color: "#30363D", fontFamily: "var(--font-mono), monospace" }}>
                        {d.totalSats.toLocaleString()} sats
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-8 p-5 rounded-2xl" style={{ background: "rgba(0,100,200,0.08)", border: "1px solid rgba(0,217,255,0.15)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                <span style={{ color: "#00D9FF" }}>📡 At 12+ passes/day</span> — Sydney residents can now see Starlink trains with the naked eye every clear night.
                Each pass lasts ~6–10 minutes. With &gt;7,000 satellites operational, the constellation covers all of Australia
                24/7 with zero latency gaps.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
