"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  EMISSIONS_HISTORY, PROJECTED_BAU, PROJECTED_POLICY,
  SECTOR_DATA, EV_DATA, EV_PROJECTED,
  INDUSTRY_PLEDGES, TARGETS, LAST_UPDATED,
  type EmissionsPoint, type SectorPoint,
} from "@/data/carbon";

// ── Palette ───────────────────────────────────────────────────────────────────
const SECTOR_COLORS = {
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
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── SVG helpers ───────────────────────────────────────────────────────────────
const W = 680; const H = 260;
const PAD = { top: 18, right: 24, bottom: 44, left: 58 };
const IW  = W - PAD.left - PAD.right;
const IH  = H - PAD.top  - PAD.bottom;

function sx(value: number, min: number, max: number) {
  return PAD.left + ((value - min) / (max - min)) * IW;
}
function sy(value: number, min: number, max: number) {
  return PAD.top + IH - ((value - min) / (max - min)) * IH;
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

// ── Animated path ─────────────────────────────────────────────────────────────
function AnimPath({ d, stroke, width = 2, dash, delay = 0, fill = "none" }: {
  d: string; stroke: string; width?: number; dash?: string; delay?: number; fill?: string;
}) {
  return (
    <motion.path
      d={d} fill={fill} stroke={stroke} strokeWidth={width}
      strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.6, delay, ease: EASE }}
    />
  );
}

// ── Chapter 1: The Gap ────────────────────────────────────────────────────────
function GapChart() {
  const ref   = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [hover, setHover] = useState<{ year: number; total: number } | null>(null);

  const xMin = 1990; const xMax = 2050;
  const yMin = 0;    const yMax = 660;

  const histPath = pointsToPath(
    EMISSIONS_HISTORY.map((p) => ({ x: sx(p.year, xMin, xMax), y: sy(p.total, yMin, yMax) }))
  );
  const bauPath = pointsToPath(
    PROJECTED_BAU.map((p) => ({ x: sx(p.year, xMin, xMax), y: sy(p.total, yMin, yMax) }))
  );
  const policyPath = pointsToPath(
    PROJECTED_POLICY.map((p) => ({ x: sx(p.year, xMin, xMax), y: sy(p.total, yMin, yMax) }))
  );

  // Target points
  const t2030x = sx(2030, xMin, xMax);
  const t2030y = sy(TARGETS.target2030, yMin, yMax);
  const t2050x = sx(2050, xMin, xMax);
  const t2050y = sy(0, yMin, yMax);

  // Year gridlines
  const gridYears = [2000, 2010, 2020, 2030, 2040, 2050];
  const gridMt    = [100, 200, 300, 400, 500, 600];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
      {/* Grid */}
      {gridMt.map((mt) => (
        <g key={mt}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(mt, yMin, yMax)} y2={sy(mt, yMin, yMax)}
            stroke="#003300" strokeWidth="0.5" />
          <text x={PAD.left - 6} y={sy(mt, yMin, yMax) + 4} textAnchor="end"
            fontSize="9" fill="#006600" fontFamily="var(--font-mono),monospace">{mt}</text>
        </g>
      ))}
      {gridYears.map((yr) => (
        <g key={yr}>
          <line x1={sx(yr, xMin, xMax)} x2={sx(yr, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
            stroke="#003300" strokeWidth="0.5" />
          <text x={sx(yr, xMin, xMax)} y={H - PAD.bottom + 14} textAnchor="middle"
            fontSize="9" fill="#006600" fontFamily="var(--font-mono),monospace">{yr}</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={PAD.left - 40} y={PAD.top + IH / 2} textAnchor="middle"
        fontSize="9" fill="#006600" fontFamily="var(--font-mono),monospace"
        transform={`rotate(-90,${PAD.left - 40},${PAD.top + IH / 2})`}>Mt CO₂-e</text>

      {/* Baseline 2005 marker */}
      <line x1={sx(2005, xMin, xMax)} x2={sx(2005, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
        stroke="rgba(0,255,65,0.15)" strokeWidth="1" strokeDasharray="3,4" />
      <text x={sx(2005, xMin, xMax) + 3} y={PAD.top + 10} fontSize="8" fill="rgba(0,255,65,0.4)"
        fontFamily="var(--font-mono),monospace">2005 baseline</text>

      {/* Peak label */}
      <text x={sx(2007, xMin, xMax)} y={sy(617.8, yMin, yMax) - 8} textAnchor="middle"
        fontSize="8" fill="rgba(255,100,100,0.6)" fontFamily="var(--font-mono),monospace">peak</text>

      {inView && (
        <>
          {/* BAU projection */}
          <AnimPath d={bauPath} stroke="rgba(239,68,68,0.55)" width={1.5} dash="5,4" delay={0.8} />

          {/* Policy trajectory */}
          <AnimPath d={policyPath} stroke="rgba(0,255,65,0.4)" width={1.5} dash="4,3" delay={1.0} />

          {/* Historical actual */}
          <AnimPath d={histPath} stroke="#00FF41" width={2.2} delay={0} />

          {/* 2030 target marker */}
          <motion.circle cx={t2030x} cy={t2030y} r={5} fill="#00FF41"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} />
          <motion.text x={t2030x + 7} y={t2030y + 4} fontSize="9" fill="#00FF41"
            fontFamily="var(--font-mono),monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
            342.9 Mt
          </motion.text>
          <motion.text x={t2030x + 7} y={t2030y + 15} fontSize="8" fill="#006600"
            fontFamily="var(--font-mono),monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            43% below 2005
          </motion.text>

          {/* 2050 net zero marker */}
          <motion.circle cx={t2050x - 4} cy={t2050y} r={5} fill="#10B981"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }} />
          <motion.text x={t2050x - 12} y={t2050y - 8} textAnchor="middle" fontSize="9" fill="#10B981"
            fontFamily="var(--font-mono),monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
            Net Zero
          </motion.text>
        </>
      )}

      {/* Legend */}
      <g transform={`translate(${PAD.left + 4}, ${PAD.top + 6})`}>
        {[
          { color: "#00FF41", label: "Actual emissions", dash: undefined },
          { color: "rgba(0,255,65,0.4)", label: "Policy pathway", dash: "4,3" },
          { color: "rgba(239,68,68,0.55)", label: "Business-as-usual", dash: "5,4" },
        ].map((l, i) => (
          <g key={i} transform={`translate(0,${i * 14})`}>
            <line x1={0} x2={16} y1={5} y2={5} stroke={l.color} strokeWidth="1.5"
              strokeDasharray={l.dash} />
            <text x={20} y={8} fontSize="8" fill="#8B949E"
              fontFamily="var(--font-inter),sans-serif">{l.label}</text>
          </g>
        ))}
      </g>

      {/* Interactive hover overlay */}
      {EMISSIONS_HISTORY.map((p) => (
        <circle key={p.year} cx={sx(p.year, xMin, xMax)} cy={sy(p.total, yMin, yMax)} r={6}
          fill="transparent"
          onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}
          style={{ cursor: "crosshair" }} />
      ))}
      {hover && (
        <g>
          <line x1={sx(hover.year, xMin, xMax)} x2={sx(hover.year, xMin, xMax)}
            y1={PAD.top} y2={H - PAD.bottom} stroke="rgba(0,255,65,0.2)" strokeWidth="1" />
          <rect x={sx(hover.year, xMin, xMax) - 36} y={sy(hover.total, yMin, yMax) - 28}
            width={72} height={22} rx={4} fill="#020c02" stroke="#003300" />
          <text x={sx(hover.year, xMin, xMax)} y={sy(hover.total, yMin, yMax) - 13}
            textAnchor="middle" fontSize="9" fill="#00FF41"
            fontFamily="var(--font-mono),monospace">
            {hover.year}: {hover.total.toFixed(0)} Mt
          </text>
        </g>
      )}
    </svg>
  );
}

// ── Chapter 2: Sector stacked area ────────────────────────────────────────────
function SectorChart() {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const keys = ["electricity", "transport", "fugitive", "agriculture", "industry", "other"] as const;
  const xMin = 1990; const xMax = 2024;
  const yMin = 0;    const yMax = 660;

  // Pre-compute stacked data
  const stacked = useMemo(() => {
    return keys.map((key, ki) => {
      const paths = SECTOR_DATA.map((d) => {
        const below = keys.slice(0, ki).reduce((s, k) => s + d[k], 0);
        const top   = below + d[key];
        return {
          x:    sx(d.year, xMin, xMax),
          yTop: sy(top, yMin, yMax),
          yBot: sy(below, yMin, yMax),
          year: d.year,
          value: d[key],
        };
      });
      return { key, paths };
    });
  }, []);

  const gridYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];

  const hoverData = hoverYear
    ? SECTOR_DATA.find((d) => d.year === hoverYear) ?? null
    : null;

  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {/* Grid */}
        {[100, 200, 300, 400, 500, 600].map((mt) => (
          <g key={mt}>
            <line x1={PAD.left} x2={W - PAD.right} y1={sy(mt, yMin, yMax)} y2={sy(mt, yMin, yMax)}
              stroke="#003300" strokeWidth="0.5" />
            <text x={PAD.left - 6} y={sy(mt, yMin, yMax) + 4} textAnchor="end" fontSize="9"
              fill="#006600" fontFamily="var(--font-mono),monospace">{mt}</text>
          </g>
        ))}
        {gridYears.map((yr) => (
          <g key={yr}>
            <line x1={sx(yr, xMin, xMax)} x2={sx(yr, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
              stroke="#003300" strokeWidth="0.5" />
            <text x={sx(yr, xMin, xMax)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9"
              fill="#006600" fontFamily="var(--font-mono),monospace">{yr}</text>
          </g>
        ))}

        {/* Stacked areas */}
        {inView && stacked.map(({ key, paths }, i) => (
          <motion.path
            key={key}
            d={areaPath(paths)}
            fill={SECTOR_COLORS[key]}
            fillOpacity={0.75}
            stroke={SECTOR_COLORS[key]}
            strokeWidth={0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
          />
        ))}

        {/* Hover zones */}
        {SECTOR_DATA.map((d) => (
          <rect key={d.year}
            x={sx(d.year, xMin, xMax) - 8} y={PAD.top} width={16} height={IH}
            fill="transparent" style={{ cursor: "crosshair" }}
            onMouseEnter={() => setHoverYear(d.year)}
            onMouseLeave={() => setHoverYear(null)}
          />
        ))}

        {/* Hover crosshair */}
        {hoverYear && (
          <line x1={sx(hoverYear, xMin, xMax)} x2={sx(hoverYear, xMin, xMax)}
            y1={PAD.top} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        )}

        {/* Axis label */}
        <text x={PAD.left - 40} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
          fill="#006600" fontFamily="var(--font-mono),monospace"
          transform={`rotate(-90,${PAD.left - 40},${PAD.top + IH / 2})`}>Mt CO₂-e</text>
      </svg>

      {/* Hover tooltip */}
      {hoverData && (
        <div className="absolute top-2 right-2 rounded-xl px-4 py-3 text-[11px] pointer-events-none"
          style={{ background: "#020c02", border: "1px solid #003300", minWidth: 170 }}>
          <p className="mb-2 font-semibold" style={{ color: "#00FF41", fontFamily: "var(--font-mono),monospace" }}>
            {hoverData.year}
          </p>
          {keys.map((k) => (
            <div key={k} className="flex justify-between gap-3 mb-0.5">
              <span style={{ color: SECTOR_COLORS[k], fontFamily: "var(--font-inter),sans-serif" }}>{SECTOR_LABELS[k]}</span>
              <span style={{ color: "#8B949E", fontFamily: "var(--font-mono),monospace" }}>{hoverData[k]} Mt</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 mt-1.5 pt-1.5" style={{ borderTop: "1px solid #003300" }}>
            <span style={{ color: "#8B949E" }}>Total</span>
            <span style={{ color: "#00FF41", fontFamily: "var(--font-mono),monospace" }}>
              {keys.reduce((s, k) => s + hoverData[k], 0)} Mt
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 px-1">
        {keys.map((k) => (
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

// ── Chapter 3: EV effect ──────────────────────────────────────────────────────
function EVChart() {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const [hover, setHover] = useState<number | null>(null);

  const xMin = 2019; const xMax = 2030;
  // Transport emissions axis (left): 50–110
  const tMin = 50; const tMax = 110;
  // EV sales axis (right): 0–420k
  const eMin = 0;  const eMax = 420000;

  // Combine historical + projected for transport
  const transportFull = [
    ...EV_DATA.map((d) => ({
      year: d.year,
      transport: (() => {
        const sd = SECTOR_DATA.find((s) => s.year === d.year);
        return sd ? sd.transport : null;
      })(),
    })).filter((d) => d.transport !== null) as { year: number; transport: number }[],
    ...EV_PROJECTED.filter((d) => d.year > 2024).map((d) => ({
      year: d.year, transport: d.transportEmissions,
    })),
  ];

  const evSalesFull = [
    ...EV_DATA.map((d) => ({ year: d.year, sales: d.sales })),
    ...EV_PROJECTED.filter((d) => d.year > 2024).map((d) => ({ year: d.year, sales: d.sales })),
  ];

  const transportPath = pointsToPath(
    transportFull.map((d) => ({ x: sx(d.year, xMin, xMax), y: sy(d.transport, tMin, tMax) }))
  );
  const evHistPath = pointsToPath(
    EV_DATA.map((d) => ({ x: sx(d.year, xMin, xMax), y: sy(d.sales, eMin, eMax) }))
  );
  const evProjPath = pointsToPath(
    [EV_DATA[EV_DATA.length - 1], ...EV_PROJECTED.filter((d) => d.year > 2024)].map((d) => ({
      x: sx(d.year, xMin, xMax),
      y: sy("sales" in d ? d.sales : (d as { year: number; sales: number }).sales, eMin, eMax),
    }))
  );

  const gridYears = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
      {/* Grid */}
      {[60, 70, 80, 90, 100].map((mt) => (
        <g key={mt}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(mt, tMin, tMax)} y2={sy(mt, tMin, tMax)}
            stroke="#003300" strokeWidth="0.5" />
          <text x={PAD.left - 6} y={sy(mt, tMin, tMax) + 4} textAnchor="end" fontSize="9"
            fill="#3B82F6" fontFamily="var(--font-mono),monospace">{mt}</text>
        </g>
      ))}
      {/* Right y-axis labels (EV sales) */}
      {[0, 100000, 200000, 300000, 400000].map((s) => (
        <text key={s} x={W - PAD.right + 8} y={sy(s, eMin, eMax) + 4} fontSize="9"
          fill="#10B981" fontFamily="var(--font-mono),monospace">
          {s === 0 ? "0" : `${s / 1000}k`}
        </text>
      ))}
      {/* X grid */}
      {gridYears.map((yr) => (
        <g key={yr}>
          <line x1={sx(yr, xMin, xMax)} x2={sx(yr, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
            stroke="#003300" strokeWidth="0.5" />
          <text x={sx(yr, xMin, xMax)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="8"
            fill="#006600" fontFamily="var(--font-mono),monospace">{yr}</text>
        </g>
      ))}

      {/* 2024 "projection starts" divider */}
      <line x1={sx(2024, xMin, xMax)} x2={sx(2024, xMin, xMax)} y1={PAD.top} y2={H - PAD.bottom}
        stroke="rgba(0,255,65,0.18)" strokeWidth="1" strokeDasharray="3,3" />
      <text x={sx(2024, xMin, xMax) + 3} y={PAD.top + 8} fontSize="7.5"
        fill="rgba(0,255,65,0.35)" fontFamily="var(--font-mono),monospace">projected →</text>

      {/* Axis labels */}
      <text x={PAD.left - 42} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
        fill="#3B82F6" fontFamily="var(--font-mono),monospace"
        transform={`rotate(-90,${PAD.left - 42},${PAD.top + IH / 2})`}>Transport Mt CO₂-e</text>
      <text x={W - PAD.right + 36} y={PAD.top + IH / 2} textAnchor="middle" fontSize="9"
        fill="#10B981" fontFamily="var(--font-mono),monospace"
        transform={`rotate(90,${W - PAD.right + 36},${PAD.top + IH / 2})`}>EV Sales / yr</text>

      {inView && (
        <>
          {/* EV sales (historical) */}
          <AnimPath d={evHistPath} stroke="#10B981" width={2} delay={0} />
          {/* EV sales (projected dashed) */}
          <AnimPath d={evProjPath} stroke="#10B981" width={1.5} dash="4,3" delay={0.5} />
          {/* Transport emissions */}
          <AnimPath d={transportPath} stroke="#3B82F6" width={2.2} delay={0.3} />

          {/* EV data dots */}
          {EV_DATA.map((d) => (
            <motion.circle key={d.year}
              cx={sx(d.year, xMin, xMax)} cy={sy(d.sales, eMin, eMax)} r={4}
              fill="#10B981" initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2 + (d.year - 2019) * 0.08 }}
              onMouseEnter={() => setHover(d.year)} onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }} />
          ))}
        </>
      )}

      {/* Legend */}
      <g transform={`translate(${PAD.left + 4}, ${PAD.top + 4})`}>
        {[
          { color: "#3B82F6", label: "Transport emissions (left axis)" },
          { color: "#10B981", label: "Annual EV sales (right axis)" },
        ].map((l, i) => (
          <g key={i} transform={`translate(0,${i * 13})`}>
            <line x1={0} x2={14} y1={5} y2={5} stroke={l.color} strokeWidth="1.5" />
            <text x={18} y={8} fontSize="8" fill="#8B949E"
              fontFamily="var(--font-inter),sans-serif">{l.label}</text>
          </g>
        ))}
      </g>

      {/* Hover tooltip */}
      {hover && (() => {
        const evd = EV_DATA.find((d) => d.year === hover);
        if (!evd) return null;
        const sd  = SECTOR_DATA.find((d) => d.year === hover);
        return (
          <g>
            <rect x={sx(hover, xMin, xMax) - 60} y={PAD.top + 2} width={118} height={44}
              rx={5} fill="#020c02" stroke="#003300" />
            <text x={sx(hover, xMin, xMax) - 1} y={PAD.top + 16} textAnchor="middle"
              fontSize="9" fill="#00FF41" fontFamily="var(--font-mono),monospace">
              {hover}
            </text>
            <text x={sx(hover, xMin, xMax) - 1} y={PAD.top + 28} textAnchor="middle"
              fontSize="8" fill="#10B981" fontFamily="var(--font-mono),monospace">
              {evd.sales.toLocaleString()} EVs ({evd.shareOfNew}%)
            </text>
            {sd && (
              <text x={sx(hover, xMin, xMax) - 1} y={PAD.top + 40} textAnchor="middle"
                fontSize="8" fill="#3B82F6" fontFamily="var(--font-mono),monospace">
                Transport: {sd.transport} Mt CO₂-e
              </text>
            )}
          </g>
        );
      })()}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type Chapter = "gap" | "sectors" | "ev";

const CHAPTERS: { key: Chapter; label: string; eyebrow: string; heading: string; body: string }[] = [
  {
    key: "gap",
    label: "The Gap",
    eyebrow: "// trajectory_analysis",
    heading: "The 90 Mt problem",
    body: "Australia peaked at 618 Mt in 2007. Electricity clean-up has pulled us to ~448 Mt today. But at current policy pace we arrive at 432 Mt by 2030 — still 90 Mt above the 43% target. The gap is real and the clock is running.",
  },
  {
    key: "sectors",
    label: "By Industry",
    eyebrow: "// sector_breakdown",
    heading: "Who owns the problem",
    body: "Electricity is the good news story — renewables are bending the curve hard. Transport is stubbornly flat (fleet turnover is slow). Fugitive emissions from LNG expansion are quietly growing, partly masking electricity gains. Agriculture has barely moved in 30 years.",
  },
  {
    key: "ev",
    label: "The EV Effect",
    eyebrow: "// ev_inflection",
    heading: "The bend point is coming",
    body: "EV sales in Australia grew 195% in 2023. But the fleet is 20M vehicles — at current adoption it takes 7–10 years for EV penetration to meaningfully move transport emissions. The models project the inflection in 2026–27. This is the chart that matters.",
  },
];

export default function CarbonViz() {
  const [chapter, setChapter] = useState<Chapter>("gap");
  const active = CHAPTERS.find((c) => c.key === chapter)!;

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#020c02", border: "1px solid #003300" }}>

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 px-6 py-3"
        style={{ background: "#000500", borderBottom: "1px solid #003300" }}>
        <div className="flex items-center gap-3">
          <span className="text-base">🌏</span>
          <span className="text-[11px] font-medium" style={{ color: "#00FF41", fontFamily: "var(--font-mono),monospace" }}>
            Australia&apos;s Carbon Story
          </span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full"
          style={{ color: "#006600", background: "#000500", border: "1px solid #003300", fontFamily: "var(--font-mono),monospace" }}>
          updated {LAST_UPDATED} · OWID / DCCEEW / FCAI
        </span>
      </div>

      {/* Chapter tabs */}
      <div className="flex gap-1 px-5 pt-4">
        {CHAPTERS.map((c) => (
          <button key={c.key} onClick={() => setChapter(c.key)}
            className="px-4 py-1.5 rounded-full text-[11px] transition-all duration-200"
            style={{
              background: chapter === c.key ? "rgba(0,255,65,0.1)" : "transparent",
              color: chapter === c.key ? "#00FF41" : "#006600",
              border: `1px solid ${chapter === c.key ? "rgba(0,255,65,0.3)" : "transparent"}`,
              fontFamily: "var(--font-mono),monospace",
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Chapter content */}
      <AnimatePresence mode="wait">
        <motion.div key={chapter} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}
          className="px-5 py-4">

          {/* Narrative */}
          <p className="text-[9px] tracking-[0.2em] uppercase mb-1"
            style={{ color: "#006600", fontFamily: "var(--font-mono),monospace" }}>{active.eyebrow}</p>
          <h3 className="text-xl font-light mb-2"
            style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant),serif" }}>{active.heading}</h3>
          <p className="text-[12px] leading-relaxed mb-5 max-w-2xl"
            style={{ color: "#8B949E", fontFamily: "var(--font-inter),sans-serif" }}>{active.body}</p>

          {/* Chart */}
          {chapter === "gap"     && <GapChart />}
          {chapter === "sectors" && <SectorChart />}
          {chapter === "ev"      && <EVChart />}
        </motion.div>
      </AnimatePresence>

      {/* Industry pledges strip */}
      <div className="px-5 pb-5">
        <p className="text-[9px] tracking-[0.2em] uppercase mb-3"
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
