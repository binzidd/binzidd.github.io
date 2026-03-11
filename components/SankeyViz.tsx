"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  nodes as rawNodes,
  links as rawLinks,
  TOTAL,
  AVG_TAX,
  yourBreakdown,
  TAXPAYER_COUNT,
  type BudgetNode,
  type BudgetLink,
} from "@/data/budget";

// ─── Layout constants ─────────────────────────────────────────────────────────
const W = 1100;
const H = 720;
const PAD_Y = 24;
const PAD_X = 160;   // room for labels on each side
const NODE_W = 18;
const GAP = 5;
const COLS = 4;
const COL_X = [PAD_X, PAD_X + (W - 2 * PAD_X) / 3, PAD_X + (2 * (W - 2 * PAD_X)) / 3, W - PAD_X - NODE_W];

const fmt = (v: number) => `$${v.toFixed(1)}B`;
const fmtK = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(0)}`;

// ─── Layout algorithm ─────────────────────────────────────────────────────────
interface LayoutNode extends BudgetNode {
  x: number;
  y: number;
  height: number;
}

interface LayoutLink extends BudgetLink {
  sy0: number; sy1: number; // y range at source (right edge)
  ty0: number; ty1: number; // y range at target (left edge)
  color: string;
}

function computeLayout(
  nodes: BudgetNode[],
  links: BudgetLink[]
): { layoutNodes: LayoutNode[]; layoutLinks: LayoutLink[] } {
  const innerH = H - 2 * PAD_Y;

  // Group nodes by column
  const byCol: BudgetNode[][] = [[], [], [], []];
  for (const n of nodes) byCol[n.column].push(n);

  // Layout nodes in each column: proportional height, stacked with gaps
  const layoutNodeMap = new Map<string, LayoutNode>();
  for (let col = 0; col < COLS; col++) {
    const colNodes = byCol[col];
    const totalVal = colNodes.reduce((s, n) => s + n.value, 0);
    const usableH = innerH - (colNodes.length - 1) * GAP;
    let y = PAD_Y;
    for (const n of colNodes) {
      const height = Math.max(4, (n.value / totalVal) * usableH);
      layoutNodeMap.set(n.id, { ...n, x: COL_X[col], y, height });
      y += height + GAP;
    }
  }

  // For each link, compute ribbon positions at source/target
  // Track per-node how much ribbon has been allocated (for stacking)
  const srcOffset = new Map<string, number>();
  const tgtOffset = new Map<string, number>();
  layoutNodeMap.forEach((n, id) => {
    srcOffset.set(id, n.y);
    tgtOffset.set(id, n.y);
  });

  // Process links column by column to reduce crossings: sort by target y
  const linksBySourceCol: BudgetLink[][] = [[], [], []];
  for (const lk of links) {
    const srcNode = layoutNodeMap.get(lk.source);
    if (!srcNode) continue;
    linksBySourceCol[srcNode.column].push(lk);
  }

  const layoutLinks: LayoutLink[] = [];
  for (const colLinks of linksBySourceCol) {
    // Sort by target y to reduce crossings
    const sorted = [...colLinks].sort((a, b) => {
      const tyA = layoutNodeMap.get(a.target)?.y ?? 0;
      const tyB = layoutNodeMap.get(b.target)?.y ?? 0;
      return tyA - tyB;
    });

    for (const lk of sorted) {
      const srcNode = layoutNodeMap.get(lk.source);
      const tgtNode = layoutNodeMap.get(lk.target);
      if (!srcNode || !tgtNode) continue;

      // Calculate ribbon height proportional to link value
      const srcTotalVal = rawNodes.find((n) => n.id === lk.source)?.value ?? 1;
      const tgtTotalVal = rawNodes.find((n) => n.id === lk.target)?.value ?? 1;
      const srcRibbonH = (lk.value / srcTotalVal) * srcNode.height;
      const tgtRibbonH = (lk.value / tgtTotalVal) * tgtNode.height;

      const sy0 = srcOffset.get(lk.source) ?? srcNode.y;
      const ty0 = tgtOffset.get(lk.target) ?? tgtNode.y;
      const sy1 = sy0 + srcRibbonH;
      const ty1 = ty0 + tgtRibbonH;

      srcOffset.set(lk.source, sy1);
      tgtOffset.set(lk.target, ty1);

      layoutLinks.push({
        ...lk,
        sy0, sy1, ty0, ty1,
        color: srcNode.color,
      });
    }
  }

  return {
    layoutNodes: Array.from(layoutNodeMap.values()),
    layoutLinks,
  };
}

// ─── Sankey ribbon path ───────────────────────────────────────────────────────
function ribbonPath(
  sx: number, sy0: number, sy1: number,
  tx: number, ty0: number, ty1: number
): string {
  const mx = (sx + tx) / 2;
  return [
    `M ${sx} ${sy0}`,
    `C ${mx} ${sy0} ${mx} ${ty0} ${tx} ${ty0}`,
    `L ${tx} ${ty1}`,
    `C ${mx} ${ty1} ${mx} ${sy1} ${sx} ${sy1}`,
    "Z",
  ].join(" ");
}

// ─── Hex to rgba helper ───────────────────────────────────────────────────────
function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── You Are Here panel ───────────────────────────────────────────────────────
const GRID_DOTS = 1000; // each dot = ~14,700 taxpayers

function YouAreHere({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 flex items-center justify-center p-6"
      style={{ background: "rgba(0,5,0,0.88)", backdropFilter: "blur(8px)", zIndex: 20 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-7 relative"
        style={{ background: "#020c02", border: "1px solid #003300" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full"
          style={{ color: "#008F11", border: "1px solid #003300", fontFamily: "var(--font-mono)" }}
        >
          // close
        </button>

        <p className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: "#00FF41", fontFamily: "var(--font-mono)" }}>
          // taxpayer.perspective
        </p>
        <h3 className="text-3xl font-light mb-1" style={{ color: "#E6EDF3", fontFamily: "var(--font-serif)" }}>
          You Are Here
        </h3>
        <p className="text-xs mb-6" style={{ color: "#008F11", fontFamily: "var(--font-mono)" }}>
          Average individual taxpayer · {TAXPAYER_COUNT.toLocaleString()} payers · {fmtK(AVG_TAX)}/yr avg contribution
        </p>

        {/* Dot grid */}
        <div className="mb-6">
          <p className="text-[10px] mb-2" style={{ color: "#006600", fontFamily: "var(--font-mono)" }}>
            Each dot = ~14,700 taxpayers. You are one dot.
          </p>
          <div className="flex flex-wrap gap-[2px]" style={{ maxWidth: "100%" }}>
            {Array.from({ length: GRID_DOTS }, (_, i) => (
              <div
                key={i}
                title={i === 0 ? "YOU" : undefined}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: i === 0 ? "#00FF41" : "#003300",
                  border: i === 0 ? "1px solid #00FF41" : "none",
                  boxShadow: i === 0 ? "0 0 6px #00FF41" : "none",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <p className="text-[9px] mt-2" style={{ color: "#006600", fontFamily: "var(--font-mono)" }}>
            ↑ The bright dot is you among {(TAXPAYER_COUNT / 1000).toFixed(0)}K dots (1:1000 scale)
          </p>
        </div>

        {/* Breakdown */}
        <div>
          <p className="text-[10px] mb-3" style={{ color: "#00FF41", fontFamily: "var(--font-mono)" }}>
            // your_{fmtK(AVG_TAX)}_goes_to:
          </p>
          <div className="space-y-2">
            {yourBreakdown
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 text-xs" style={{ color: "#8B949E", fontFamily: "var(--font-mono)" }}>
                    {item.label}
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: item.color, width: `${(item.value / AVG_TAX) * 180}px`, minWidth: 2, opacity: 0.7 }}
                  />
                  <div className="text-xs w-14 text-right" style={{ color: "#00FF41", fontFamily: "var(--font-mono)" }}>
                    {fmtK(item.value)}
                  </div>
                </div>
              ))}
          </div>
          <p className="text-[9px] mt-3" style={{ color: "#006600", fontFamily: "var(--font-mono)" }}>
            * Based on proportional allocation of avg income tax ({fmtK(AVG_TAX)}) across all spending portfolios
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({
  node,
  x,
  y,
}: {
  node: LayoutNode;
  x: number;
  y: number;
}) {
  const isL1 = node.column === 1;
  return (
    <foreignObject x={x - 110} y={y - 10} width={220} height={120} style={{ overflow: "visible", pointerEvents: "none" }}>
      <div
        style={{
          background: "#020c02",
          border: "1px solid #003300",
          borderRadius: 10,
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "#E6EDF3",
          boxShadow: "0 0 20px rgba(0,255,65,0.15)",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ color: node.color, marginBottom: 4 }}>{node.label}</div>
        <div style={{ color: "#008F11" }}>{fmt(node.value)} · {((node.value / TOTAL) * 100).toFixed(1)}% of budget</div>
        {isL1 && node.id === "income-tax" && (
          <div style={{ color: "#00FF41", marginTop: 4 }}>
            ≈ {fmtK(Math.round(node.value * 1e9 / TAXPAYER_COUNT))}/taxpayer avg
          </div>
        )}
      </div>
    </foreignObject>
  );
}

// ─── Column labels ────────────────────────────────────────────────────────────
const COL_LABELS = ["Revenue Buckets", "Revenue Sources", "Spending Portfolios", "Sub-Programs"];

// ─── Main component ───────────────────────────────────────────────────────────
export default function SankeyViz() {
  const { layoutNodes, layoutLinks } = useMemo(
    () => computeLayout(rawNodes, rawLinks),
    []
  );

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [showYou, setShowYou] = useState(false);
  const [tooltipNode, setTooltipNode] = useState<LayoutNode | null>(null);

  // Which nodes/links are "active" when something is hovered
  const activeNodeIds = useMemo((): Set<string> => {
    if (!hoveredNode && hoveredLink === null) return new Set();
    const ids = new Set<string>();
    if (hoveredNode) {
      ids.add(hoveredNode);
      rawLinks.forEach((lk) => {
        if (lk.source === hoveredNode || lk.target === hoveredNode) {
          ids.add(lk.source);
          ids.add(lk.target);
        }
      });
    }
    if (hoveredLink !== null) {
      const lk = layoutLinks[hoveredLink];
      if (lk) { ids.add(lk.source); ids.add(lk.target); }
    }
    return ids;
  }, [hoveredNode, hoveredLink, layoutLinks]);

  const isActive = useCallback(
    (id: string) => activeNodeIds.size === 0 || activeNodeIds.has(id),
    [activeNodeIds]
  );
  const isLinkActive = useCallback(
    (idx: number) => {
      if (activeNodeIds.size === 0 && hoveredLink === null) return true;
      const lk = layoutLinks[idx];
      if (!lk) return false;
      if (hoveredLink !== null) return idx === hoveredLink;
      return activeNodeIds.has(lk.source) && activeNodeIds.has(lk.target);
    },
    [activeNodeIds, hoveredLink, layoutLinks]
  );

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden"
      style={{ background: "#000500", border: "1px solid #003300", minHeight: 300 }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #003300" }}
      >
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "#00FF41", fontFamily: "var(--font-mono)" }}>
            // budget.trace_the_money
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#008F11", fontFamily: "var(--font-mono)" }}>
            AU Federal Budget 2024-25 · Total: $738.5B · Hover to trace flows
          </p>
        </div>
        <button
          onClick={() => setShowYou(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all"
          style={{
            background: "rgba(0,255,65,0.08)",
            border: "1px solid rgba(0,255,65,0.3)",
            color: "#00FF41",
            fontFamily: "var(--font-mono)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,65,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,255,65,0.08)"; }}
        >
          <span style={{ fontSize: 14 }}>$</span>
          you_are_here()
        </button>
      </div>

      {/* SVG Sankey */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", minWidth: 700, display: "block" }}
          onMouseLeave={() => { setHoveredNode(null); setHoveredLink(null); setTooltipNode(null); }}
        >
          {/* Column labels */}
          {COL_LABELS.map((label, i) => (
            <text
              key={i}
              x={COL_X[i] + NODE_W / 2}
              y={14}
              textAnchor="middle"
              style={{ fill: "#003300", fontSize: 9, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.15em" }}
            >
              {label}
            </text>
          ))}

          {/* Links */}
          {layoutLinks.map((lk, idx) => {
            const srcNode = layoutNodes.find((n) => n.id === lk.source);
            if (!srcNode) return null;
            const active = isLinkActive(idx);
            const path = ribbonPath(
              srcNode.x + NODE_W, lk.sy0, lk.sy1,
              layoutNodes.find((n) => n.id === lk.target)!.x, lk.ty0, lk.ty1
            );
            return (
              <path
                key={idx}
                d={path}
                fill={hexAlpha(lk.color, active ? 0.28 : 0.04)}
                stroke={hexAlpha(lk.color, active ? 0.5 : 0.06)}
                strokeWidth={0.5}
                style={{ cursor: "pointer", transition: "fill 0.2s, stroke 0.2s" }}
                onMouseEnter={() => setHoveredLink(idx)}
                onMouseLeave={() => setHoveredLink(null)}
              />
            );
          })}

          {/* Nodes */}
          {layoutNodes.map((n) => {
            const active = isActive(n.id);
            const isYouNode = n.id === "income-tax";
            return (
              <g
                key={n.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => { setHoveredNode(n.id); setTooltipNode(n); }}
                onMouseLeave={() => { setHoveredNode(null); setTooltipNode(null); }}
              >
                {/* YOU glow indicator on income-tax node */}
                {isYouNode && (
                  <rect
                    x={n.x - 2}
                    y={n.y - 2}
                    width={NODE_W + 4}
                    height={n.height + 4}
                    rx={4}
                    fill="none"
                    stroke="#00FF41"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                    opacity={0.5}
                  />
                )}

                {/* Node bar */}
                <rect
                  x={n.x}
                  y={n.y}
                  width={NODE_W}
                  height={n.height}
                  rx={3}
                  fill={hexAlpha(n.color, active ? 0.9 : 0.2)}
                  stroke={n.color}
                  strokeWidth={active ? 0.5 : 0.2}
                  style={{ transition: "fill 0.2s" }}
                />

                {/* YOU dot */}
                {isYouNode && (
                  <>
                    <circle
                      cx={n.x + NODE_W / 2}
                      cy={n.y + 6}
                      r={3}
                      fill="#00FF41"
                    />
                    <text
                      x={n.column < 2 ? n.x - 6 : n.x + NODE_W + 6}
                      y={n.y + 10}
                      textAnchor={n.column < 2 ? "end" : "start"}
                      style={{ fill: "#00FF41", fontSize: 8, fontFamily: "var(--font-mono)" }}
                    >
                      YOU ▲
                    </text>
                  </>
                )}

                {/* Labels left side (columns 0,1) */}
                {n.column < 2 && n.height > 8 && (
                  <text
                    x={n.x - 6}
                    y={n.y + n.height / 2 + 4}
                    textAnchor="end"
                    style={{
                      fill: active ? "#E6EDF3" : "#003300",
                      fontSize: Math.min(11, Math.max(8, n.height / 2.5)),
                      fontFamily: "var(--font-mono)",
                      transition: "fill 0.2s",
                    }}
                  >
                    {n.label}
                  </text>
                )}

                {/* Labels right side (columns 2,3) */}
                {n.column >= 2 && n.height > 8 && (
                  <text
                    x={n.x + NODE_W + 6}
                    y={n.y + n.height / 2 + 4}
                    textAnchor="start"
                    style={{
                      fill: active ? "#E6EDF3" : "#003300",
                      fontSize: Math.min(11, Math.max(8, n.height / 2.5)),
                      fontFamily: "var(--font-mono)",
                      transition: "fill 0.2s",
                    }}
                  >
                    {n.label}
                  </text>
                )}

                {/* Value sublabel (only for larger nodes) */}
                {n.height > 22 && (
                  <text
                    x={n.column < 2 ? n.x - 6 : n.x + NODE_W + 6}
                    y={n.y + n.height / 2 + 16}
                    textAnchor={n.column < 2 ? "end" : "start"}
                    style={{
                      fill: active ? n.color : "#002200",
                      fontSize: 8,
                      fontFamily: "var(--font-mono)",
                      transition: "fill 0.2s",
                    }}
                  >
                    {fmt(n.value)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltipNode && (
            <Tooltip
              node={tooltipNode}
              x={tooltipNode.column < 2 ? tooltipNode.x - 10 : tooltipNode.x + NODE_W + 110}
              y={tooltipNode.y + tooltipNode.height / 2}
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-4 px-6 py-3"
        style={{ borderTop: "1px solid #003300" }}
      >
        <span className="text-[10px]" style={{ color: "#006600", fontFamily: "var(--font-mono)" }}>
          // hover node or ribbon to trace · green glow = income tax (YOU)
        </span>
        {[
          { color: "#F0A742", label: "Income Tax" },
          { color: "#00FF41", label: "Company Tax" },
          { color: "#7C3AED", label: "GST" },
          { color: "#3FB950", label: "Other Taxes" },
          { color: "#FF6B6B", label: "Borrowing" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: item.color }} />
            <span className="text-[10px]" style={{ color: "#008F11", fontFamily: "var(--font-mono)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* You Are Here modal */}
      <AnimatePresence>
        {showYou && <YouAreHere onClose={() => setShowYou(false)} />}
      </AnimatePresence>
    </div>
  );
}
