"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { bikes, electronicsMatrix, radarStats } from "@/data/moto";
import type { MotoSpec } from "@/data/moto";

// ─── Retro colour palette ────────────────────────────────────────────────────
const R = {
  bg:       "#120C04",
  surface:  "#1C1408",
  elevated: "#261C0C",
  border:   "#3D2E18",
  amber:    "#E8A020",
  cream:    "#F5E6C8",
  red:      "#C0392B",
  muted:    "#8B7040",
  faint:    "#4D3820",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BIKE_IDS  = bikes.map(b => b.id);
const BIKE_MAP  = Object.fromEntries(bikes.map(b => [b.id, b]));
const SHORT: Record<string, string> = { mt10: "MT-10", zh2: "Z H2", s1000r: "S1000R", sfv4: "SF V4", "1290sdr": "S.Duke", tuono: "Tuono" };

// ─── Retro gauge (SVG arc) ───────────────────────────────────────────────────
function RetroGauge({
  value, max, label, unit, color,
}: { value: number; max: number; label: string; unit: string; color: string }) {
  const ref = useRef<SVGPathElement>(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, value, { duration: 1.6, ease: EASE, onUpdate: v => setDisplayed(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, value]);

  // SVG arc maths — 240° sweep
  const R_ARC = 48, CX = 64, CY = 68;
  const START_DEG = 150, SWEEP = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const ratio = Math.min(value / max, 1);

  const arcPath = (endDeg: number) => {
    const s = toRad(START_DEG);
    const e = toRad(START_DEG + endDeg);
    const laf = endDeg > 180 ? 1 : 0;
    return `M ${CX + R_ARC * Math.cos(s)} ${CY + R_ARC * Math.sin(s)} A ${R_ARC} ${R_ARC} 0 ${laf} 1 ${CX + R_ARC * Math.cos(e)} ${CY + R_ARC * Math.sin(e)}`;
  };

  return (
    <div ref={wrapRef} className="flex flex-col items-center">
      <svg viewBox="0 0 128 90" width="100%" style={{ maxWidth: 140 }}>
        {/* Tick marks */}
        {Array.from({ length: 13 }).map((_, i) => {
          const angle = toRad(START_DEG + (i / 12) * SWEEP);
          const r1 = 56, r2 = i % 3 === 0 ? 43 : 50;
          return (
            <line key={i}
              x1={CX + r1 * Math.cos(angle)} y1={CY + r1 * Math.sin(angle)}
              x2={CX + r2 * Math.cos(angle)} y2={CY + r2 * Math.sin(angle)}
              stroke={R.faint} strokeWidth={i % 3 === 0 ? 1.5 : 0.8} />
          );
        })}
        {/* Track */}
        <path d={arcPath(SWEEP)} fill="none" stroke={R.faint} strokeWidth="5" strokeLinecap="round" />
        {/* Fill */}
        <motion.path ref={ref} d={arcPath(SWEEP * ratio)} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE }} />
        {/* Value */}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={R.cream} fontFamily="Georgia, serif">{displayed}</text>
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize="7" fill={R.muted} fontFamily="monospace">{unit}</text>
        {/* Needle base dot */}
        <circle cx={CX} cy={CY} r="4" fill={R.surface} stroke={R.amber} strokeWidth="1.5" />
      </svg>
      <p className="text-[10px] text-center mt-1 tracking-widest uppercase" style={{ color: R.muted, fontFamily: "Georgia, serif" }}>{label}</p>
    </div>
  );
}

// ─── Radar / Spider chart ────────────────────────────────────────────────────
function RadarChart({ visibleIds }: { visibleIds: string[] }) {
  const axes = radarStats.map(r => r.axis);
  const N = axes.length;
  const CX = 180, CY = 180, RMAX = 140;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const angle = (i: number) => toRad((360 / N) * i - 90);

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const gridPoly = (ratio: number) =>
    axes.map((_, i) => {
      const a = angle(i);
      return `${CX + RMAX * ratio * Math.cos(a)},${CY + RMAX * ratio * Math.sin(a)}`;
    }).join(" ");

  const bikePolygon = (id: string) =>
    radarStats.map((stat, i) => {
      const a = angle(i);
      const r = (stat.scores[id] ?? 0) / 100;
      return `${CX + RMAX * r * Math.cos(a)},${CY + RMAX * r * Math.sin(a)}`;
    }).join(" ");

  const bikeColors: Record<string, string> = {
    mt10: "#1E88E5", zh2: "#2ECC40", s1000r: "#888", sfv4: "#C0392B", "1290sdr": "#FF6D00", tuono: "#7B0000",
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 360 360" width="100%" style={{ maxWidth: 360, margin: "0 auto", display: "block" }}>
        {/* Grid polygons */}
        {gridLevels.map((ratio, gi) => (
          <polygon key={gi} points={gridPoly(ratio)} fill="none"
            stroke={gi === gridLevels.length - 1 ? R.faint : R.faint}
            strokeWidth={gi === gridLevels.length - 1 ? 1 : 0.5}
            strokeOpacity={0.6} />
        ))}

        {/* Spokes */}
        {axes.map((_, i) => {
          const a = angle(i);
          return (
            <line key={i}
              x1={CX} y1={CY}
              x2={CX + RMAX * Math.cos(a)}
              y2={CY + RMAX * Math.sin(a)}
              stroke={R.faint} strokeWidth="0.8" />
          );
        })}

        {/* Axis labels */}
        {axes.map((label, i) => {
          const a = angle(i);
          const LR = RMAX + 18;
          const x = CX + LR * Math.cos(a);
          const y = CY + LR * Math.sin(a);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill={R.muted} fontFamily="Georgia, serif"
              style={{ whiteSpace: "pre" }}>
              {label.split("\n").map((line, li) => (
                <tspan key={li} x={x} dy={li === 0 ? 0 : 12}>{line}</tspan>
              ))}
            </text>
          );
        })}

        {/* Bike polygons */}
        {bikes.map(bike => {
          if (!visibleIds.includes(bike.id)) return null;
          const isYamaha = bike.isYamaha;
          return (
            <motion.polygon key={bike.id}
              points={bikePolygon(bike.id)}
              fill={bikeColors[bike.id]}
              fillOpacity={isYamaha ? 0.25 : 0.08}
              stroke={bikeColors[bike.id]}
              strokeWidth={isYamaha ? 2.5 : 1.5}
              strokeOpacity={isYamaha ? 1 : 0.7}
              initial={{ scale: 0, originX: "180px", originY: "180px" }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          );
        })}

        {/* Yamaha data points */}
        {visibleIds.includes("mt10") && radarStats.map((stat, i) => {
          const a = angle(i);
          const r = (stat.scores["mt10"] ?? 0) / 100;
          return (
            <circle key={i}
              cx={CX + RMAX * r * Math.cos(a)}
              cy={CY + RMAX * r * Math.sin(a)}
              r="3.5" fill="#1E88E5" stroke={R.bg} strokeWidth="1" />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Spec bars ───────────────────────────────────────────────────────────────
function SpecBar({ bike, value, maxVal, unit, highlight }: { bike: MotoSpec; value: number; maxVal: number; unit: string; highlight: boolean }) {
  const pct = (value / maxVal) * 100;
  return (
    <motion.div className="flex items-center gap-2 mb-1.5"
      initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE }}>
      <span className="text-[10px] w-16 text-right flex-shrink-0 font-bold"
        style={{ color: highlight ? R.amber : R.muted, fontFamily: "Georgia, serif" }}>
        {SHORT[bike.id]}
      </span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 14, background: R.faint }}>
        <motion.div className="h-full rounded-full flex items-center justify-end pr-2"
          style={{ background: highlight ? `linear-gradient(90deg, ${R.amber}88, ${R.amber})` : `linear-gradient(90deg, #3D2E18, #5A4428)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: EASE }}>
          <span className="text-[9px] font-bold" style={{ color: highlight ? R.bg : R.muted, fontFamily: "monospace" }}>
            {value}{unit}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Electronics matrix ──────────────────────────────────────────────────────
function ElectronicsRow({ feature, allBikeIds }: { feature: typeof electronicsMatrix[0]; allBikeIds: string[] }) {
  const catColors: Record<string, string> = { Safety: "#C0392B", Performance: R.amber, Comfort: "#5D8A5E", Display: "#5B8BC4" };
  return (
    <tr className="border-b" style={{ borderColor: R.faint }}>
      <td className="py-2 pr-4 align-top">
        <div>
          <p className="text-[11px] font-semibold" style={{ color: R.cream, fontFamily: "Georgia, serif" }}>{feature.feature}</p>
          <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: catColors[feature.category] + "22", color: catColors[feature.category], fontFamily: "monospace" }}>
            {feature.category}
          </span>
        </div>
      </td>
      {allBikeIds.map(id => {
        const val = feature.bikes[id];
        const has = val === true || (typeof val === "string" && val.length > 0);
        const isYamaha = id === "mt10";
        return (
          <td key={id} className="py-2 pr-3 align-top text-center">
            {val === false ? (
              <span style={{ color: R.faint, fontSize: 14 }}>✕</span>
            ) : val === true ? (
              <span style={{ color: isYamaha ? R.amber : "#3FB950", fontSize: 14 }}>✓</span>
            ) : (
              <span className="text-[9px] leading-tight block text-left"
                style={{ color: isYamaha ? R.amber : R.muted, fontFamily: "monospace", maxWidth: 80 }}>
                {val}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function MotoViz() {
  const [tab, setTab] = useState<"gauges" | "specs" | "spider" | "electronics">("gauges");
  const [visibleIds, setVisibleIds] = useState<string[]>(BIKE_IDS);

  const toggleBike = (id: string) => {
    setVisibleIds(prev => prev.includes(id)
      ? prev.length > 1 ? prev.filter(x => x !== id) : prev
      : [...prev, id]);
  };

  const yamaha = BIKE_MAP["mt10"];

  const specRows: { key: keyof MotoSpec; label: string; unit: string; maxVal: number }[] = [
    { key: "power",          label: "Power (hp)",      unit: "hp", maxVal: 220 },
    { key: "torque",         label: "Torque (Nm)",     unit: "Nm", maxVal: 150 },
    { key: "weight",         label: "Weight (kg, wet)",unit: "kg", maxVal: 250 },
    { key: "topSpeed",       label: "Top Speed (km/h)",unit: "",   maxVal: 300 },
    { key: "zeroToHundred",  label: "0-100 (sec, est)",unit: "s",  maxVal: 4   },
    { key: "priceAUD",       label: "Price (AUD)",     unit: "",   maxVal: 45000 },
  ];

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: R.bg, border: `1px solid ${R.border}`, fontFamily: "Georgia, serif" }}>

      {/* ── Retro header ── */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${R.surface}, ${R.elevated})`, borderBottom: `2px solid ${R.amber}` }}>
        {/* Checkerboard stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-3"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${R.amber} 0px, ${R.amber} 12px, ${R.surface} 12px, ${R.surface} 24px)`, opacity: 0.4 }} />
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)" }} />

        <div className="relative px-8 pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: R.amber, fontFamily: "monospace" }}>
                ★ HYPERNAKED CLASS ★ HEAD-TO-HEAD ★ 2023
              </p>
              <h3 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: R.cream, letterSpacing: "-0.01em" }}>
                Yamaha MT-10
                <span className="text-xl ml-3" style={{ color: R.amber }}>vs The Field</span>
              </h3>
              <p className="text-sm italic" style={{ color: R.muted }}>&ldquo;{yamaha.tagline}&rdquo; — 998cc CP4, 166hp, 111Nm</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold" style={{ color: R.amber, lineHeight: 1 }}>🏍️</div>
              <p className="text-[10px] mt-1 tracking-widest" style={{ color: R.muted, fontFamily: "monospace" }}>OWNER'S MACHINE</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {([["gauges", "GAUGES"], ["specs", "SPEC BARS"], ["spider", "SPIDER CHART"], ["electronics", "ELECTRONICS"]] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-200"
                style={{
                  background: tab === t ? R.amber : "transparent",
                  color: tab === t ? R.bg : R.muted,
                  border: `1px solid ${tab === t ? R.amber : R.border}`,
                  borderRadius: 2,
                  fontFamily: "monospace",
                  fontWeight: tab === t ? 700 : 400,
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Bike toggles (for spider + specs) */}
          {(tab === "spider" || tab === "specs") && (
            <div className="flex flex-wrap gap-3 mt-4">
              {bikes.map(b => {
                const on = visibleIds.includes(b.id);
                const bColors: Record<string, string> = { mt10: "#1E88E5", zh2: "#2ECC40", s1000r: "#888", sfv4: "#C0392B", "1290sdr": "#FF6D00", tuono: "#7B0000" };
                return (
                  <button key={b.id} onClick={() => toggleBike(b.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] transition-all"
                    style={{ border: `1px solid ${on ? bColors[b.id] : R.border}`, borderRadius: 2, color: on ? bColors[b.id] : R.faint, fontFamily: "monospace" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: on ? bColors[b.id] : R.faint }} />
                    {SHORT[b.id]}{b.isYamaha ? " ★" : ""}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 md:px-8 py-8">

        {/* ── GAUGES: MT-10 retro instrument cluster ── */}
        {tab === "gauges" && (
          <AnimatePresence mode="wait">
            <motion.div key="gauges" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-xs tracking-widest uppercase mb-6 text-center" style={{ color: R.muted, fontFamily: "monospace" }}>
                — YOUR MT-10's INSTRUMENT CLUSTER —
              </p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8 p-6 rounded-2xl"
                style={{ background: R.surface, border: `1px solid ${R.border}`, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)" }}>
                <RetroGauge value={yamaha.power}          max={220}  label="Max Power" unit="hp"   color={R.amber} />
                <RetroGauge value={yamaha.powerRpm / 100} max={130}  label="Power RPM" unit="×100" color="#5B8BC4" />
                <RetroGauge value={yamaha.torque}         max={150}  label="Torque"    unit="Nm"   color={R.red} />
                <RetroGauge value={yamaha.topSpeed}       max={300}  label="Top Speed" unit="km/h" color={R.amber} />
                <RetroGauge value={yamaha.weight}         max={250}  label="Wet Weight" unit="kg"  color={R.muted} />
                <RetroGauge value={yamaha.priceAUD / 1000} max={40}  label="Price AUD" unit="k$"  color="#5D8A5E" />
              </div>

              {/* Key data strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Engine",        value: "998cc CP4 Inline-4" },
                  { label: "0–100 km/h",    value: "~3.1 sec" },
                  { label: "Seat Height",   value: "835 mm" },
                  { label: "Fuel Tank",     value: "17 L" },
                  { label: "Power/Weight",  value: "0.86 hp/kg" },
                  { label: "Riding Modes",  value: "4 (incl. Custom)" },
                  { label: "QSS",           value: "Up + Down" },
                  { label: "AUS MSRP",      value: "A$19,999" },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-xl" style={{ background: R.surface, border: `1px solid ${R.border}` }}>
                    <p className="text-[9px] tracking-widest uppercase mb-1" style={{ color: R.muted, fontFamily: "monospace" }}>{d.label}</p>
                    <p className="text-sm font-bold" style={{ color: R.cream }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── SPEC BARS ── */}
        {tab === "specs" && (
          <AnimatePresence mode="wait">
            <motion.div key="specs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {specRows.map(row => {
                  const filtered = bikes.filter(b => visibleIds.includes(b.id));
                  const maxVal = row.key === "zeroToHundred"
                    ? Math.max(...filtered.map(b => b[row.key] as number))
                    : row.maxVal;
                  return (
                    <div key={String(row.key)} className="p-5 rounded-2xl" style={{ background: R.surface, border: `1px solid ${R.border}` }}>
                      <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: R.amber, fontFamily: "monospace" }}>// {row.label}</p>
                      {filtered.map(b => {
                        let val = b[row.key] as number;
                        let maxForBar = row.key === "zeroToHundred" ? maxVal : row.maxVal;
                        // For 0-100 — lower is better, invert bar
                        if (row.key === "zeroToHundred") {
                          const invertedVal = maxVal - val + Math.min(...filtered.map(x => x[row.key] as number));
                          return (
                            <SpecBar key={b.id} bike={b} value={+(b[row.key] as number).toFixed(1)}
                              maxVal={maxForBar} unit={row.unit} highlight={b.isYamaha ?? false} />
                          );
                        }
                        return (
                          <SpecBar key={b.id} bike={b} value={row.key === "priceAUD" ? Math.round(val / 1000) * 1000 : val}
                            maxVal={maxForBar} unit={row.key === "priceAUD" ? "" : row.unit} highlight={b.isYamaha ?? false} />
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Value for money callout */}
              <div className="mt-6 p-5 rounded-2xl" style={{ background: "#1C1408", border: `1px solid ${R.amber}44` }}>
                <p className="text-xs leading-relaxed" style={{ color: R.muted, fontFamily: "Georgia, serif" }}>
                  <span style={{ color: R.amber }}>★ Value verdict:</span>{" "}
                  The MT-10 delivers 166hp from the same R1-derived CP4 engine at A$19,999 — making it the
                  best power-per-dollar in this class. The Streetfighter V4 edges it on outright power at 208hp,
                  but at nearly double the price. The Z H2's supercharger adds 200hp but also 46kg of extra weight.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── SPIDER / RADAR CHART ── */}
        {tab === "spider" && (
          <AnimatePresence mode="wait">
            <motion.div key="spider" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-xs tracking-widest uppercase mb-4 text-center" style={{ color: R.muted, fontFamily: "monospace" }}>
                — COMPOSITE PERFORMANCE SPIDER —
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="p-4 rounded-2xl" style={{ background: R.surface, border: `1px solid ${R.border}` }}>
                  <RadarChart visibleIds={visibleIds} />
                </div>
                <div className="space-y-3">
                  {bikes.filter(b => visibleIds.includes(b.id)).map(b => {
                    const bColors: Record<string, string> = { mt10: "#1E88E5", zh2: "#2ECC40", s1000r: "#888", sfv4: "#C0392B", "1290sdr": "#FF6D00", tuono: "#7B0000" };
                    const avgScore = Math.round(radarStats.reduce((acc, r) => acc + (r.scores[b.id] ?? 0), 0) / radarStats.length);
                    return (
                      <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: R.surface, border: `1px solid ${b.isYamaha ? R.amber + "66" : R.border}` }}>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: bColors[b.id] }} />
                        <div className="flex-1">
                          <p className="text-xs font-bold" style={{ color: b.isYamaha ? R.amber : R.cream, fontFamily: "Georgia, serif" }}>
                            {b.make} {b.model} {b.isYamaha ? "★" : ""}
                          </p>
                          <p className="text-[10px] italic" style={{ color: R.muted }}>{b.tagline}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: bColors[b.id], fontFamily: "monospace" }}>{avgScore}</p>
                          <p className="text-[9px]" style={{ color: R.faint, fontFamily: "monospace" }}>avg score</p>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-[10px] italic mt-2" style={{ color: R.faint, fontFamily: "Georgia, serif" }}>
                    * Scores are normalised composite ratings across power, torque, agility, electronics, value and top speed.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── ELECTRONICS MATRIX ── */}
        {tab === "electronics" && (
          <AnimatePresence mode="wait">
            <motion.div key="electronics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <p className="text-xs tracking-widest uppercase mb-6" style={{ color: R.muted, fontFamily: "monospace" }}>
                — ELECTRONICS & RIDER AIDS COMPARISON —
              </p>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-xs" style={{ minWidth: 680 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${R.amber}` }}>
                      <th className="text-left pb-3 pr-4" style={{ color: R.amber, fontFamily: "monospace", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em" }}>FEATURE</th>
                      {bikes.map(b => (
                        <th key={b.id} className="pb-3 pr-3 text-center" style={{ fontFamily: "Georgia, serif", fontSize: 10, color: b.isYamaha ? R.amber : R.muted, fontWeight: b.isYamaha ? 700 : 400 }}>
                          {b.isYamaha ? "★ " : ""}{SHORT[b.id]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {electronicsMatrix.map((feat, i) => (
                      <ElectronicsRow key={i} feature={feat} allBikeIds={bikes.map(b => b.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 rounded-xl" style={{ background: R.surface, border: `1px solid ${R.amber}33` }}>
                <p className="text-xs leading-relaxed" style={{ color: R.muted, fontFamily: "Georgia, serif" }}>
                  <span style={{ color: R.amber }}>★ MT-10 standout:</span>{" "}
                  Slide Control System (SCS) is unique to the MT-10 in this comparison — a feature more common on premium
                  superbikes. Combined with the 3-level Lift Control and bilateral quickshifter, you have a near-complete
                  electronics suite at the most competitive price point.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Retro footer strip */}
      <div className="px-8 py-3 flex items-center justify-between" style={{ background: R.elevated, borderTop: `1px solid ${R.border}` }}>
        <p className="text-[9px] tracking-widest uppercase" style={{ color: R.faint, fontFamily: "monospace" }}>
          ★ BINAY'S GARAGE — YAMAHA MT-10 SP 2023 ★
        </p>
        <p className="text-[9px]" style={{ color: R.faint, fontFamily: "monospace" }}>
          Specs: manufacturer data & independent review sources
        </p>
      </div>
    </div>
  );
}
