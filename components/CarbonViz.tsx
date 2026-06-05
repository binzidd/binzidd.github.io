"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import {
  EMISSIONS_HISTORY, PROJECTED_BAU, PROJECTED_POLICY,
  SECTOR_DATA, EV_DATA, EV_PROJECTED,
  INDUSTRY_PLEDGES, TARGETS, LAST_UPDATED,
  type SectorPoint,
} from "@/data/carbon";

// ── Palette ───────────────────────────────────────────────────────────────────
const SECTOR_COLORS: Record<string, string> = {
  electricity: "#F59E0B",
  transport:   "#3B82F6",
  fugitive:    "#8B5CF6",
  agriculture: "#10B981",
  industry:    "#F97316",
  other:       "#6B7280",
};
const SECTOR_LABELS: Record<string, string> = {
  electricity: "Electricity",
  transport:   "Transport",
  fugitive:    "Fugitive / Mining",
  agriculture: "Agriculture",
  industry:    "Industry",
  other:       "Buildings & Waste",
};
const SECTOR_KEYS = ["electricity", "transport", "fugitive", "agriculture", "industry", "other"] as const;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Key numbers ───────────────────────────────────────────────────────────────
const CURRENT_MT   = 448.0;
const PEAK_MT      = 617.8;
const GAP_MT       = Math.round(CURRENT_MT - TARGETS.target2030);
const PROGRESS_PCT = ((PEAK_MT - CURRENT_MT) / (PEAK_MT - TARGETS.target2030)) * 100;

// ── SVG helpers ───────────────────────────────────────────────────────────────
const W   = 680;
const H   = 260;
const PAD = { top: 22, right: 28, bottom: 46, left: 58 };
const IW  = W - PAD.left - PAD.right;
const IH  = H - PAD.top - PAD.bottom;

function sx(v: number, min: number, max: number) {
  return PAD.left + ((v - min) / (max - min)) * IW;
}
function sy(v: number, min: number, max: number) {
  return PAD.top + IH - ((v - min) / (max - min)) * IH;
}
function pointsToPath(pts: { x: number; y: number }[]) {
  if (!pts.length) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}
function areaPath(pts: { x: number; yTop: number; yBot: number }[]) {
  if (!pts.length) return "";
  const top = pts.map((p) => `${p.x.toFixed(1)},${p.yTop.toFixed(1)}`).join(" L ");
  const bot = [...pts].reverse().map((p) => `${p.x.toFixed(1)},${p.yBot.toFixed(1)}`).join(" L ");
  return `M ${top} L ${bot} Z`;
}

// ── Interpolate sparse SECTOR_DATA to annual ──────────────────────────────────
function interpolateSectors(): SectorPoint[] {
  const result: SectorPoint[] = [];
  for (let i = 0; i < SECTOR_DATA.length - 1; i++) {
    const a = SECTOR_DATA[i];
    const b = SECTOR_DATA[i + 1];
    const span = b.year - a.year;
    for (let t = 0; t < span; t++) {
      const f = t / span;
      result.push({
        year:        a.year + t,
        electricity: +(a.electricity + (b.electricity - a.electricity) * f).toFixed(1),
        transport:   +(a.transport   + (b.transport   - a.transport)   * f).toFixed(1),
        fugitive:    +(a.fugitive    + (b.fugitive    - a.fugitive)    * f).toFixed(1),
        agriculture: +(a.agriculture + (b.agriculture - a.agriculture) * f).toFixed(1),
        industry:    +(a.industry    + (b.industry    - a.industry)    * f).toFixed(1),
        other:       +(a.other       + (b.other       - a.other)       * f).toFixed(1),
      });
    }
  }
  result.push(SECTOR_DATA[SECTOR_DATA.length - 1]);
  return result;
}

// ── Animated path ─────────────────────────────────────────────────────────────
function AnimPath({ d, stroke, width = 2, dash, delay = 0, fill = "none" }: {
  d: string; stroke: string; width?: number; dash?: string; delay?: number; fill?: string;
}) {
  return (
    <motion.path d={d} fill={fill} stroke={stroke} strokeWidth={width}
      strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.8, delay, ease: EASE }} />
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({ code, title, insight }: { code: string; title: string; insight: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-4">
      <div>
        <span className="text-[9px] tracking-[0.2em] uppercase block mb-0.5"
          style={{ color: "#006600", fontFamily: "var(--font-mono),monospace" }}>{code}</span>
        <h3 className="text-lg font-light leading-tight"
          style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant),serif" }}>{title}</h3>
      </div>
      <p className="text-[11px] leading-snug sm:ml-auto sm:text-right max-w-xs"
        style={{ color: "#6B7280", fontFamily: "var(--font-mono),monospace" }}>{insight}</p>
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const stats  = [
    { value: `${CURRENT_MT} Mt`, label: "current (2024)", color: "#00FF41" },
    { value: `${GAP_MT} Mt`,     label: "gap to 2030 target", color: "#EF4444" },
    { value: `${(2030 - 2026)} yrs`, label: "to 2030 deadline", color: "#F59E0B" },
  ];
  return (
    <div ref={ref} className="grid grid-cols-3 divide-x divide-[#003300]"
      style={{ borderTop: "1px solid #003300", borderBottom: "1px solid #003300" }}>
      {stats.map((s, i) => (
        <motion.div key={i} className="px-4 py-3.5 text-center"
          initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.45, ease: EASE }}>
          <p className="text-2xl md:text-3xl font-light tabular-nums"
            style={{ color: s.color, fontFamily: "var(--font-mono),monospace" }}>{s.value}</p>
          <p className="text-[9px] uppercase tracking-widest mt-0.5"
            style={{ color: "#4B5563", fontFamily: "var(--font-inter),sans-serif" }}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const pct    = Math.min(100, Math.max(0, PROGRESS_PCT));
  return (
    <div ref={ref} className="px-5 py-3" style={{ borderBottom: "1px solid #003300" }}>
      <div className="flex justify-between mb-1.5">
        <span className="text-[9px] tracking-widest uppercase"
          style={{ color: "#006600", fontFamily: "var(--font-mono),monospace" }}>
          // reduction_progress · peak → net zero
        </span>
        <span className="text-[9px]" style={{ color: "#4B5563", fontFamily: "var(--font-mono),monospace" }}>
          {pct.toFixed(0)}% of journey complete
        </span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "#000500" }}>
        <motion.div className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #00FF41 100%)" }}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[8px]" style={{ color: "#4B5563", fontFamily: "var(--font-mono),monospace" }}>
          617.8 Mt peak (2007)
        </span>
        <span className="text-[8px]" style={{ color: "#4B5563", fontFamily: "var(--font-mono),monospace" }}>
          342.9 Mt target (2030)
        </span>
        <span className="text-[8px]" style={{ color: "#006600", fontFamily: "var(--font-mono),monospace" }}>
          0 Mt (2050)
        </span>
      </div>
    </div>
  );
}

// ── Chart 1: Trajectory ───────────────────────────────────────────────────────
function GapChart() {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [hover, setHover] = useState<{ year: number; total: number } | null>(null);

  const xMin = 1990; const xMax = 2050;
  const yMin = 0;    const yMax = 680;

  const bauVsTarget = useMemo(() => {
    const ty = sy(TARGETS.target2030, yMin, yMax);
    return PROJECTED_BAU.filter((p) => p.year >= 2024).map((p) => ({
      x: sx(p.year, xMin, xMax),
      yTop: sy(p.total, yMin, yMax),
      yBot: Math.max(sy(p.total, yMin, yMax), ty), // clamp so area stays above baseline
    })).map((p) => ({ ...p, yBot: ty }));
  }, []);

  const corridor = useMemo(() => {
    const bau = PROJECTED_BAU.filter((p) => p.year >= 2024);
    const pol = PROJECTED_POLICY.filter((p) => p.year >= 2024);
    return bau.map((b, i) => ({
      x: sx(b.year, xMin, xMax),
      yTop: sy(b.total, yMin, yMax),
      yBot: sy(pol[i]?.total ?? b.total, yMin, yMax),
    }));
  }, []);

  const histPath   = pointsToPath(EMISSIONS_HISTORY.map((p) => ({ x: sx(p.year, xMin, xMax), y: sy(p.total, yMin, yMax) })));
  const bauPath    = pointsToPath(PROJECTED_BAU.map((p) => ({ x: sx(p.year, xMin, xMax), y: sy(p.total, yMin, yMax) })));
  const policyPath = pointsToPath(PROJECTED_POLICY.map((p) => ({ x: sx(p.year, xMin, xMax), y: sy(p.total, yMin, yMax) })));
  const targetLine = `M ${sx(2024, xMin, xMax).toFixed(1)},${sy(TARGETS.target2030, yMin, yMax).toFixed(1)} L ${sx(2030, xMin, xMax).toFixed(1)},${sy(TARGETS.target2030, yMin, yMax).toFixed(1)}`;

  const todayX = sx(2024, xMin, xMax);
  const todayY = sy(448.0, yMin, yMax);
  const peakX  = sx(2007, xMin, xMax);
  const peakY  = sy(617.8, yMin, yMax);

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="corGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[100, 200, 300, 400, 500, 600].map((mt) => (
          <g key={mt}>
            <line x1={PAD.left} x2={W - PAD.right} y1={sy(mt, yMin, yMax)} y2={sy(mt, yMin, yMax)}
              stroke="#003300" strokeWidth="0.5" />
            <text x={PAD.left - 6} y={sy(mt, yMin, yMax) + 4} textAnchor="end" fontSize="9"
              fill="#006600" fontFamily="var(--font-mono),monospace">{mt}</text>
          </g>
        ))}
        {[2000, 2010, 2020, 2030, 2040, 2050].map((yr) => (
          <g key={yr}>
            <line x1={sx(yr, xMin, xMax)} x2={sx(yr, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
              stroke="#003300" strokeWidth="0.5" />
            <text x={sx(yr, xMin, xMax)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9"
              fill="#006600" fontFamily="var(--font-mono),monospace">{yr}</text>
          </g>
        ))}
        <text x={PAD.left - 40} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
          fill="#006600" fontFamily="var(--font-mono),monospace"
          transform={`rotate(-90,${PAD.left - 40},${PAD.top + IH / 2})`}>Mt CO₂-e</text>

        {/* 2005 baseline rule — label at bottom so it clears the peak area */}
        <line x1={sx(2005, xMin, xMax)} x2={sx(2005, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
          stroke="rgba(0,255,65,0.1)" strokeWidth="1" strokeDasharray="3,4" />
        <text x={sx(2005, xMin, xMax) + 3} y={H - PAD.bottom - 4} fontSize="7.5"
          fill="rgba(0,255,65,0.3)" fontFamily="var(--font-mono),monospace">2005 baseline</text>

        {inView && (
          <>
            <motion.path d={areaPath(bauVsTarget)} fill="url(#gapGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.8 }} />
            <motion.path d={areaPath(corridor)} fill="url(#corGrad)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />

            <AnimPath d={bauPath}    stroke="rgba(239,68,68,0.6)"  width={1.5} dash="5,4" delay={0.8} />
            <AnimPath d={policyPath} stroke="rgba(0,255,65,0.45)"  width={1.5} dash="4,3" delay={1.0} />
            <AnimPath d={targetLine} stroke="rgba(0,255,65,0.8)"   width={1}   dash="2,3" delay={1.2} />
            <AnimPath d={histPath}   stroke="#00FF41"              width={2.5}             delay={0}   />

            {/* 2030 target dot */}
            <motion.circle cx={sx(2030, xMin, xMax)} cy={sy(TARGETS.target2030, yMin, yMax)} r={5} fill="#00FF41"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, type: "spring" }} />
            <motion.text x={sx(2030, xMin, xMax) + 7} y={sy(TARGETS.target2030, yMin, yMax) + 4}
              fontSize="9" fill="#00FF41" fontFamily="var(--font-mono),monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              342.9 Mt
            </motion.text>

            {/* Net zero */}
            <motion.circle cx={sx(2050, xMin, xMax) - 4} cy={sy(0, yMin, yMax)} r={5} fill="#10B981"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: "spring" }} />
            <motion.text x={sx(2050, xMin, xMax) - 12} y={sy(0, yMin, yMax) - 8}
              textAnchor="middle" fontSize="9" fill="#10B981" fontFamily="var(--font-mono),monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              Net Zero
            </motion.text>

            {/* Peak — dot + right-of-dot label, no box */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <circle cx={peakX} cy={peakY} r={4} fill="none" stroke="rgba(239,68,68,0.65)" strokeWidth="1.2" />
              <text x={peakX + 7} y={peakY - 2} fontSize="8"
                fill="rgba(239,68,68,0.75)" fontFamily="var(--font-mono),monospace">peak 617.8 Mt</text>
            </motion.g>

            {/* COVID callout */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
              <circle cx={sx(2020, xMin, xMax)} cy={sy(499.2, yMin, yMax)} r={3.5}
                fill="none" stroke="rgba(0,255,65,0.35)" strokeWidth="1" />
              <text x={sx(2020, xMin, xMax) + 5} y={sy(499.2, yMin, yMax) - 5} fontSize="7.5"
                fill="rgba(0,255,65,0.4)" fontFamily="var(--font-mono),monospace">COVID −19 Mt</text>
            </motion.g>

            {/* Today marker */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <line x1={todayX} x2={todayX} y1={PAD.top} y2={H - PAD.bottom}
                stroke="rgba(0,255,65,0.22)" strokeWidth="1" strokeDasharray="2,3" />
              <circle cx={todayX} cy={todayY} r={5} fill="#020c02" stroke="#00FF41" strokeWidth="1.5" />
              <circle cx={todayX} cy={todayY} r={2} fill="#00FF41" />
              {/* Tooltip above the dot — clear of the data lines in that region */}
              <rect x={todayX - 28} y={todayY - 26} width={60} height={19} rx={3}
                fill="#020c02" fillOpacity={0.9} stroke="#003300" />
              <text x={todayX + 2} y={todayY - 12} textAnchor="middle" fontSize="8.5"
                fill="#00FF41" fontFamily="var(--font-mono),monospace">now · 448 Mt</text>
            </motion.g>
          </>
        )}

        {/* Hover */}
        {EMISSIONS_HISTORY.map((p) => (
          <circle key={p.year} cx={sx(p.year, xMin, xMax)} cy={sy(p.total, yMin, yMax)} r={7}
            fill="transparent" style={{ cursor: "crosshair" }}
            onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} />
        ))}
        {hover && (
          <g>
            <line x1={sx(hover.year, xMin, xMax)} x2={sx(hover.year, xMin, xMax)}
              y1={PAD.top} y2={H - PAD.bottom} stroke="rgba(0,255,65,0.15)" strokeWidth="1" />
            <rect x={sx(hover.year, xMin, xMax) - 38} y={sy(hover.total, yMin, yMax) - 30}
              width={76} height={22} rx={4} fill="#020c02" stroke="#003300" />
            <text x={sx(hover.year, xMin, xMax)} y={sy(hover.total, yMin, yMax) - 14}
              textAnchor="middle" fontSize="9" fill="#00FF41" fontFamily="var(--font-mono),monospace">
              {hover.year}: {hover.total.toFixed(0)} Mt
            </text>
          </g>
        )}
      </svg>

      {/* Legend below SVG — no overlap possible */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 px-1">
        {[
          { color: "#00FF41",             label: "Actual emissions",    dash: false },
          { color: "rgba(0,255,65,0.55)", label: "Policy pathway",      dash: true  },
          { color: "rgba(239,68,68,0.7)", label: "Business-as-usual",   dash: true  },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <svg width="18" height="10">
              <line x1="0" y1="5" x2="18" y2="5" stroke={l.color} strokeWidth="1.5"
                strokeDasharray={l.dash ? "4,3" : undefined} />
            </svg>
            <span className="text-[10px]" style={{ color: "#8B949E", fontFamily: "var(--font-inter),sans-serif" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chart 2: Sector stacked area ──────────────────────────────────────────────
function SectorChart() {
  const svgRef  = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(svgRef as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const xMin = 1990; const xMax = 2024;
  const yMin = 0;    const yMax = 680;

  const annual  = useMemo(() => interpolateSectors(), []);

  const stacked = useMemo(() => SECTOR_KEYS.map((key, ki) => ({
    key,
    paths: annual.map((d) => {
      const below = SECTOR_KEYS.slice(0, ki).reduce((s, k) => s + d[k], 0);
      return { x: sx(d.year, xMin, xMax), yTop: sy(below + d[key], yMin, yMax), yBot: sy(below, yMin, yMax) };
    }),
  })), [annual]);

  const hoverData = hoverYear !== null ? annual.find((d) => d.year === hoverYear) ?? null : null;

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) * (W / rect.width);
    const rawYear = xMin + ((relX - PAD.left) / IW) * (xMax - xMin);
    const snapped = Math.max(xMin, Math.min(xMax, Math.round(rawYear)));
    setHoverYear(snapped);
  }

  const todayX = sx(2024, xMin, xMax);
  const crossX = hoverYear !== null ? sx(hoverYear, xMin, xMax) : null;

  return (
    <div className="relative" ref={wrapRef}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible", cursor: "crosshair" }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setHoverYear(null)}>

        {[100, 200, 300, 400, 500, 600].map((mt) => (
          <g key={mt}>
            <line x1={PAD.left} x2={W - PAD.right} y1={sy(mt, yMin, yMax)} y2={sy(mt, yMin, yMax)}
              stroke="#003300" strokeWidth="0.5" />
            <text x={PAD.left - 6} y={sy(mt, yMin, yMax) + 4} textAnchor="end" fontSize="9"
              fill="#006600" fontFamily="var(--font-mono),monospace">{mt}</text>
          </g>
        ))}
        {[1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024].map((yr) => (
          <g key={yr}>
            <line x1={sx(yr, xMin, xMax)} x2={sx(yr, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
              stroke="#003300" strokeWidth="0.5" />
            <text x={sx(yr, xMin, xMax)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9"
              fill="#006600" fontFamily="var(--font-mono),monospace">{yr}</text>
          </g>
        ))}
        <text x={PAD.left - 40} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
          fill="#006600" fontFamily="var(--font-mono),monospace"
          transform={`rotate(-90,${PAD.left - 40},${PAD.top + IH / 2})`}>Mt CO₂-e</text>

        {inView && stacked.map(({ key, paths }, i) => (
          <motion.path key={key} d={areaPath(paths)}
            fill={SECTOR_COLORS[key]} fillOpacity={0.78}
            stroke={SECTOR_COLORS[key]} strokeWidth={0.4}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }} />
        ))}

        {/* Today marker */}
        {inView && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <line x1={todayX} x2={todayX} y1={PAD.top} y2={H - PAD.bottom}
              stroke="rgba(0,255,65,0.35)" strokeWidth="1" strokeDasharray="2,3" />
            <text x={todayX - 3} y={PAD.top + 10} textAnchor="end" fontSize="7.5"
              fill="rgba(0,255,65,0.5)" fontFamily="var(--font-mono),monospace">today</text>
          </motion.g>
        )}

        {/* Hover crosshair (snapped) */}
        {crossX !== null && (
          <line x1={crossX} x2={crossX} y1={PAD.top} y2={H - PAD.bottom}
            stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        )}
      </svg>

      {/* Hover tooltip — floats above chart */}
      {hoverData && (
        <div className="absolute top-1 right-1 rounded-xl px-3 py-2.5 pointer-events-none z-10"
          style={{ background: "#020c02", border: "1px solid #003300", minWidth: 168 }}>
          <p className="mb-1.5 text-[11px] font-semibold tabular-nums"
            style={{ color: "#00FF41", fontFamily: "var(--font-mono),monospace" }}>{hoverData.year}</p>
          {SECTOR_KEYS.map((k) => (
            <div key={k} className="flex justify-between gap-3 mb-0.5 text-[10px]">
              <span style={{ color: SECTOR_COLORS[k], fontFamily: "var(--font-inter),sans-serif" }}>{SECTOR_LABELS[k]}</span>
              <span className="tabular-nums" style={{ color: "#8B949E", fontFamily: "var(--font-mono),monospace" }}>{hoverData[k]} Mt</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 mt-1.5 pt-1.5 text-[10px]"
            style={{ borderTop: "1px solid #003300" }}>
            <span style={{ color: "#8B949E" }}>Total</span>
            <span className="tabular-nums" style={{ color: "#00FF41", fontFamily: "var(--font-mono),monospace" }}>
              {SECTOR_KEYS.reduce((s, k) => s + hoverData[k], 0).toFixed(0)} Mt
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 px-1">
        {SECTOR_KEYS.map((k) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: SECTOR_COLORS[k] }} />
            <span className="text-[10px]" style={{ color: "#8B949E", fontFamily: "var(--font-inter),sans-serif" }}>
              {SECTOR_LABELS[k]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chart 3: EV inflection ────────────────────────────────────────────────────
function EVChart() {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [hover, setHover] = useState<number | null>(null);

  const xMin = 2019; const xMax = 2030;
  const tMin = 50;   const tMax = 115;
  const eMin = 0;    const eMax = 430000;

  const transportFull = [
    ...EV_DATA.map((d) => ({ year: d.year, transport: SECTOR_DATA.find((s) => s.year === d.year)?.transport ?? null }))
      .filter((d): d is { year: number; transport: number } => d.transport !== null),
    ...EV_PROJECTED.filter((d) => d.year > 2024).map((d) => ({ year: d.year, transport: d.transportEmissions })),
  ];

  const transHistPath = pointsToPath(
    transportFull.filter((d) => d.year <= 2024).map((d) => ({ x: sx(d.year, xMin, xMax), y: sy(d.transport, tMin, tMax) }))
  );
  const transProjPath = pointsToPath(
    [{ year: 2024, transport: 87 }, ...transportFull.filter((d) => d.year > 2024)].map((d) => ({
      x: sx(d.year, xMin, xMax), y: sy(d.transport, tMin, tMax),
    }))
  );
  const evHistPath = pointsToPath(EV_DATA.map((d) => ({ x: sx(d.year, xMin, xMax), y: sy(d.sales, eMin, eMax) })));
  const evProjPath = pointsToPath(
    [EV_DATA[EV_DATA.length - 1], ...EV_PROJECTED.filter((d) => d.year > 2024)].map((d) => ({
      x: sx(d.year, xMin, xMax), y: sy(d.sales, eMin, eMax),
    }))
  );

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="evArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

      {[60, 70, 80, 90, 100, 110].map((mt) => (
        <g key={mt}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(mt, tMin, tMax)} y2={sy(mt, tMin, tMax)}
            stroke="#003300" strokeWidth="0.5" />
          <text x={PAD.left - 6} y={sy(mt, tMin, tMax) + 4} textAnchor="end" fontSize="9"
            fill="#3B82F6" fontFamily="var(--font-mono),monospace">{mt}</text>
        </g>
      ))}
      {[0, 100000, 200000, 300000, 400000].map((s) => (
        <text key={s} x={W - PAD.right + 8} y={sy(s, eMin, eMax) + 4} fontSize="9"
          fill="#10B981" fontFamily="var(--font-mono),monospace">
          {s === 0 ? "0" : `${s / 1000}k`}
        </text>
      ))}
      {[2019, 2021, 2023, 2025, 2027, 2030].map((yr) => (
        <g key={yr}>
          <line x1={sx(yr, xMin, xMax)} x2={sx(yr, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
            stroke="#003300" strokeWidth="0.5" />
          <text x={sx(yr, xMin, xMax)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="8.5"
            fill="#006600" fontFamily="var(--font-mono),monospace">{yr}</text>
        </g>
      ))}

      <line x1={sx(2024, xMin, xMax)} x2={sx(2024, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
        stroke="rgba(0,255,65,0.2)" strokeWidth="1" strokeDasharray="3,3" />
      <text x={sx(2024, xMin, xMax) + 3} y={PAD.top + 9} fontSize="7.5"
        fill="rgba(0,255,65,0.4)" fontFamily="var(--font-mono),monospace">projected →</text>

      <text x={PAD.left - 42} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
        fill="#3B82F6" fontFamily="var(--font-mono),monospace"
        transform={`rotate(-90,${PAD.left - 42},${PAD.top + IH / 2})`}>Transport Mt CO₂-e</text>
      <text x={W - PAD.right + 38} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
        fill="#10B981" fontFamily="var(--font-mono),monospace"
        transform={`rotate(90,${W - PAD.right + 38},${PAD.top + IH / 2})`}>EV Sales / yr</text>

      {inView && (
        <>
          <motion.path
            d={`${evHistPath} L ${sx(2024, xMin, xMax)},${H - PAD.bottom} L ${sx(2019, xMin, xMax)},${H - PAD.bottom} Z`}
            fill="url(#evArea)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.9 }} />

          <AnimPath d={evHistPath}     stroke="#10B981"  width={2.2}             delay={0}   />
          <AnimPath d={evProjPath}     stroke="#10B981"  width={1.5} dash="4,3"  delay={0.5} />
          <AnimPath d={transHistPath}  stroke="#3B82F6"  width={2.5}             delay={0.3} />
          <AnimPath d={transProjPath}  stroke="#3B82F6"  width={1.5} dash="5,4"  delay={0.9} />

          {EV_DATA.map((d) => (
            <motion.circle key={d.year}
              cx={sx(d.year, xMin, xMax)} cy={sy(d.sales, eMin, eMax)} r={4.5}
              fill="#10B981" stroke="#020c02" strokeWidth="1.2"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15 + (d.year - 2019) * 0.08, type: "spring" }}
              onMouseEnter={() => setHover(d.year)} onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }} />
          ))}

          {/* +195% label */}
          <motion.text x={sx(2023, xMin, xMax) + 4} y={sy(98539, eMin, eMax) - 10} fontSize="7.5"
            fill="rgba(16,185,129,0.65)" fontFamily="var(--font-mono),monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            +195% yoy
          </motion.text>

          {/* Fleet inflection callout */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            <line x1={sx(2026.5, xMin, xMax)} y1={sy(82, tMin, tMax)} x2={sx(2026.5, xMin, xMax) - 12} y2={sy(82, tMin, tMax) - 28}
              stroke="rgba(0,255,65,0.35)" strokeWidth="0.8" />
            <rect x={sx(2026.5, xMin, xMax) - 80} y={sy(82, tMin, tMax) - 48} width={102} height={20} rx={3}
              fill="#020c02" fillOpacity={0.9} stroke="rgba(0,255,65,0.18)" />
            <text x={sx(2026.5, xMin, xMax) - 29} y={sy(82, tMin, tMax) - 34} textAnchor="middle" fontSize="7.5"
              fill="rgba(0,255,65,0.65)" fontFamily="var(--font-mono),monospace">fleet inflection ~2026</text>
          </motion.g>
        </>
      )}

      {/* Hover tooltip */}
      {hover && (() => {
        const evd = EV_DATA.find((d) => d.year === hover);
        if (!evd) return null;
        const sd = SECTOR_DATA.find((d) => d.year === hover);
        const cx = sx(hover, xMin, xMax);
        return (
          <g>
            <line x1={cx} x2={cx} y1={PAD.top} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <rect x={cx - 64} y={PAD.top + 2} width={126} height={sd ? 46 : 34} rx={5} fill="#020c02" stroke="#003300" />
            <text x={cx} y={PAD.top + 16} textAnchor="middle" fontSize="9" fill="#00FF41" fontFamily="var(--font-mono),monospace">{hover}</text>
            <text x={cx} y={PAD.top + 28} textAnchor="middle" fontSize="8" fill="#10B981" fontFamily="var(--font-mono),monospace">
              {evd.sales.toLocaleString()} EVs · {evd.shareOfNew}% share
            </text>
            {sd && (
              <text x={cx} y={PAD.top + 40} textAnchor="middle" fontSize="8" fill="#3B82F6" fontFamily="var(--font-mono),monospace">
                Transport: {sd.transport} Mt CO₂-e
              </text>
            )}
          </g>
        );
      })()}
    </svg>

    {/* Legend below SVG */}
    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 px-1">
      {[
        { color: "#3B82F6", label: "Transport emissions (left axis)",  dash: false },
        { color: "#10B981", label: "Annual EV sales (right axis)",     dash: false },
        { color: "#10B981", label: "Projected",                        dash: true  },
      ].map((l) => (
        <div key={l.label} className="flex items-center gap-1.5">
          <svg width="18" height="10">
            <line x1="0" y1="5" x2="18" y2="5" stroke={l.color} strokeWidth="1.5"
              strokeDasharray={l.dash ? "4,3" : undefined} />
          </svg>
          <span className="text-[10px]" style={{ color: "#8B949E", fontFamily: "var(--font-inter),sans-serif" }}>
            {l.label}
          </span>
        </div>
      ))}
    </div>
    </div>
  );
}

// ── Main: unified dashboard ───────────────────────────────────────────────────
export default function CarbonViz() {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#020c02", border: "1px solid #003300" }}>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3"
        style={{ background: "#000500", borderBottom: "1px solid #003300" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-base">🌏</span>
          <span className="text-[11px] font-medium" style={{ color: "#00FF41", fontFamily: "var(--font-mono),monospace" }}>
            Australia&apos;s Carbon Story
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full"
          style={{ color: "#006600", background: "#000500", border: "1px solid #003300", fontFamily: "var(--font-mono),monospace" }}>
          {LAST_UPDATED} · OWID / DCCEEW / FCAI
        </span>
      </div>

      <StatsStrip />
      <ProgressBar />

      {/* Charts */}
      <div className="px-5 py-5 flex flex-col gap-8">

        <div>
          <SectionHead
            code="// 01  trajectory"
            title="The Gap"
            insight="At current pace: 432 Mt by 2030. Legislated target: 342.9 Mt. Shortfall: 90 Mt."
          />
          <GapChart />
        </div>

        <div style={{ borderTop: "1px solid #003300", paddingTop: "1.5rem" }}>
          <SectionHead
            code="// 02  sector_breakdown"
            title="Who owns the problem"
            insight="Electricity −50 Mt since 2007. Transport flat. Fugitive +4 Mt (LNG). Agriculture unchanged in 30 yrs."
          />
          <SectorChart />
        </div>

        <div style={{ borderTop: "1px solid #003300", paddingTop: "1.5rem" }}>
          <SectionHead
            code="// 03  ev_inflection"
            title="The EV Effect"
            insight="EV sales +195% in 2023. Fleet inflection modelled 2026–27. 20M-vehicle fleet means lag is structural."
          />
          <EVChart />
        </div>

      </div>

      {/* Industry pledges */}
      <div className="px-5 pb-5" style={{ borderTop: "1px solid #003300" }}>
        <p className="text-[9px] tracking-[0.2em] uppercase pt-4 mb-3"
          style={{ color: "#006600", fontFamily: "var(--font-mono),monospace" }}>// industry_commitments</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {INDUSTRY_PLEDGES.map((p) => (
            <div key={p.sector} className="flex gap-2.5 rounded-xl p-3"
              style={{ background: "#000500", border: "1px solid #003300" }}>
              <span className="text-base mt-0.5">{p.icon}</span>
              <div>
                <p className="text-[10px] font-semibold mb-1"
                  style={{ color: p.color, fontFamily: "var(--font-mono),monospace" }}>{p.sector}</p>
                <p className="text-[10px] leading-relaxed"
                  style={{ color: "#6B7280", fontFamily: "var(--font-inter),sans-serif" }}>{p.pledge}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
