"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
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
const H = 700;
const PAD_Y = 24;
const PAD_X = 155;
const NODE_W = 18;
const GAP = 5;
const COLS = 4;
const COL_X = [PAD_X, PAD_X + (W - 2 * PAD_X) / 3, PAD_X + (2 * (W - 2 * PAD_X)) / 3, W - PAD_X - NODE_W];

const fmt  = (v: number) => `$${v.toFixed(1)}B`;
const fmtK = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v.toFixed(0)}`;

// ─── Layout algorithm ─────────────────────────────────────────────────────────
interface LayoutNode extends BudgetNode { x: number; y: number; height: number }
interface LayoutLink extends BudgetLink { sy0: number; sy1: number; ty0: number; ty1: number; color: string }

function computeLayout(nodes: BudgetNode[], links: BudgetLink[]) {
  const innerH = H - 2 * PAD_Y;
  const byCol: BudgetNode[][] = [[], [], [], []];
  for (const n of nodes) byCol[n.column].push(n);

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

  const srcOffset = new Map<string, number>();
  const tgtOffset = new Map<string, number>();
  layoutNodeMap.forEach((n, id) => { srcOffset.set(id, n.y); tgtOffset.set(id, n.y); });

  const linksBySourceCol: BudgetLink[][] = [[], [], []];
  for (const lk of links) {
    const col = layoutNodeMap.get(lk.source)?.column;
    if (col !== undefined && col < 3) linksBySourceCol[col].push(lk);
  }

  const layoutLinks: LayoutLink[] = [];
  for (const colLinks of linksBySourceCol) {
    const sorted = [...colLinks].sort((a, b) => (layoutNodeMap.get(a.target)?.y ?? 0) - (layoutNodeMap.get(b.target)?.y ?? 0));
    for (const lk of sorted) {
      const srcNode = layoutNodeMap.get(lk.source)!;
      const tgtNode = layoutNodeMap.get(lk.target)!;
      if (!srcNode || !tgtNode) continue;
      const srcRibbonH = (lk.value / (rawNodes.find(n => n.id === lk.source)?.value ?? 1)) * srcNode.height;
      const tgtRibbonH = (lk.value / (rawNodes.find(n => n.id === lk.target)?.value ?? 1)) * tgtNode.height;
      const sy0 = srcOffset.get(lk.source)!;
      const ty0 = tgtOffset.get(lk.target)!;
      srcOffset.set(lk.source, sy0 + srcRibbonH);
      tgtOffset.set(lk.target, ty0 + tgtRibbonH);
      layoutLinks.push({ ...lk, sy0, sy1: sy0 + srcRibbonH, ty0, ty1: ty0 + tgtRibbonH, color: srcNode.color });
    }
  }

  return { layoutNodes: Array.from(layoutNodeMap.values()), layoutLinks };
}

function ribbonPath(sx: number, sy0: number, sy1: number, tx: number, ty0: number, ty1: number) {
  const mx = (sx + tx) / 2;
  return `M ${sx} ${sy0} C ${mx} ${sy0} ${mx} ${ty0} ${tx} ${ty0} L ${tx} ${ty1} C ${mx} ${ty1} ${mx} ${sy1} ${sx} ${sy1} Z`;
}

function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── You Are Here panel ───────────────────────────────────────────────────────
const GRID_COLS = 25;
const GRID_ROWS = 20;
const GRID_DOTS = GRID_COLS * GRID_ROWS; // 500

function YouAreHerePanel() {
  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{ width: 260, borderLeft: "1px solid #003300", background: "#000500" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #003300" }}>
        <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
          // you_are_here
        </p>
        <p className="text-xs" style={{ color: "#008F11", fontFamily: "var(--font-mono), monospace" }}>
          {(TAXPAYER_COUNT / 1e6).toFixed(1)}M taxpayers · avg {fmtK(AVG_TAX)}/yr
        </p>
      </div>

      {/* Dot grid */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] mb-2" style={{ color: "#003300", fontFamily: "var(--font-mono), monospace" }}>
          Each dot ≈ {Math.round(TAXPAYER_COUNT / GRID_DOTS / 1000)}K payers
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: 2,
          }}
        >
          {Array.from({ length: GRID_DOTS }, (_, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: i === 0 ? "#00FF41" : "#003300",
                boxShadow: i === 0 ? "0 0 4px #00FF41" : "none",
              }}
            />
          ))}
        </div>
        <p className="text-[9px] mt-1.5" style={{ color: "#006600", fontFamily: "var(--font-mono), monospace" }}>
          ↑ bright dot = YOU (1:{GRID_DOTS})
        </p>
      </div>

      {/* Breakdown */}
      <div className="px-4 py-3 flex-1 overflow-y-auto" style={{ borderTop: "1px solid #003300" }}>
        <p className="text-[9px] mb-2.5" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
          // your_{fmtK(AVG_TAX)}_allocated_to:
        </p>
        <div className="space-y-2">
          {yourBreakdown
            .sort((a, b) => b.value - a.value)
            .map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] truncate pr-1" style={{ color: "#8B949E", fontFamily: "var(--font-mono), monospace", maxWidth: 140 }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
                    {fmtK(item.value)}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "#003300" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / AVG_TAX) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
        </div>
        <p className="text-[8px] mt-3" style={{ color: "#003300", fontFamily: "var(--font-mono), monospace" }}>
          * proportional allocation of avg income tax across all portfolios
        </p>
      </div>
    </div>
  );
}

// ─── Column labels ─────────────────────────────────────────────────────────────
const COL_LABELS = ["Revenue Buckets", "Revenue Sources", "Spending Portfolios", "Sub-Programs"];

// ─── Main component ───────────────────────────────────────────────────────────
export default function SankeyViz() {
  const { layoutNodes, layoutLinks } = useMemo(() => computeLayout(rawNodes, rawLinks), []);

  const [hoveredNode, setHoveredNode]   = useState<string | null>(null);
  const [zoomedNode,  setZoomedNode]    = useState<string | null>(null);
  const [zoomTransform, setZoomTransform] = useState({ scale: 1, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom into a node's region on click
  const handleNodeClick = useCallback((nodeId: string) => {
    if (zoomedNode === nodeId) {
      // Zoom out
      setZoomedNode(null);
      setZoomTransform({ scale: 1, tx: 0, ty: 0 });
      return;
    }

    const node = layoutNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Find all connected node ids
    const connectedIds = new Set([nodeId]);
    rawLinks.forEach(lk => {
      if (lk.source === nodeId) connectedIds.add(lk.target);
      if (lk.target === nodeId) connectedIds.add(lk.source);
    });

    // Bounding box of connected nodes
    const connected = layoutNodes.filter(n => connectedIds.has(n.id));
    const minX = Math.min(...connected.map(n => n.x));
    const maxX = Math.max(...connected.map(n => n.x + NODE_W));
    const minY = Math.min(...connected.map(n => n.y));
    const maxY = Math.max(...connected.map(n => n.y + n.height));

    const regionW = maxX - minX + PAD_X * 1.4;
    const regionH = maxY - minY + 80;
    const regionCX = (minX + maxX) / 2;
    const regionCY = (minY + maxY) / 2;

    // Scale so region fits ~90% of SVG
    const scale = Math.min(W / regionW, H / regionH) * 0.88;
    // Translate so region center aligns with SVG center
    const tx = W / 2 - regionCX * scale;
    const ty = H / 2 - regionCY * scale;

    setZoomedNode(nodeId);
    setZoomTransform({ scale, tx, ty });
  }, [zoomedNode, layoutNodes]);

  const handleBackgroundClick = useCallback(() => {
    if (zoomedNode) {
      setZoomedNode(null);
      setZoomTransform({ scale: 1, tx: 0, ty: 0 });
    }
  }, [zoomedNode]);

  // Active set for highlighting
  const activeNodeIds = useMemo((): Set<string> => {
    const id = hoveredNode ?? zoomedNode;
    if (!id) return new Set();
    const ids = new Set([id]);
    rawLinks.forEach(lk => {
      if (lk.source === id || lk.target === id) { ids.add(lk.source); ids.add(lk.target); }
    });
    return ids;
  }, [hoveredNode, zoomedNode]);

  const isActive   = useCallback((id: string) => activeNodeIds.size === 0 || activeNodeIds.has(id), [activeNodeIds]);
  const isLinkActive = useCallback((lk: LayoutLink) => activeNodeIds.size === 0 || (activeNodeIds.has(lk.source) && activeNodeIds.has(lk.target)), [activeNodeIds]);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden"
      style={{ background: "#000500", border: "1px solid #003300" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #003300" }}>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "#00FF41", fontFamily: "var(--font-mono), monospace" }}>
            // budget.trace_the_money · 2024-25
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "#008F11", fontFamily: "var(--font-mono), monospace" }}>
            $738.5B total · click any node to zoom in · click again to reset
          </p>
        </div>
        {zoomedNode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBackgroundClick}
            className="text-[10px] px-3 py-1.5 rounded-full"
            style={{ color: "#00FF41", border: "1px solid rgba(0,255,65,0.3)", fontFamily: "var(--font-mono), monospace", background: "rgba(0,255,65,0.06)" }}
          >
            ← zoom_out()
          </motion.button>
        )}
      </div>

      {/* Body: Sankey + YouAreHere */}
      <div className="flex flex-col lg:flex-row">
        {/* Sankey SVG */}
        <div className="flex-1 overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", minWidth: 400, display: "block", cursor: zoomedNode ? "zoom-out" : "default" }}
            onClick={handleBackgroundClick}
          >
            <motion.g
              animate={{ scale: zoomTransform.scale, x: zoomTransform.tx, y: zoomTransform.ty }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "0 0" }}
            >
              {/* Column labels */}
              {COL_LABELS.map((label, i) => (
                <text key={i} x={COL_X[i] + NODE_W / 2} y={14} textAnchor="middle"
                  style={{ fill: "#003300", fontSize: 9, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  {label}
                </text>
              ))}

              {/* Links */}
              {layoutLinks.map((lk, idx) => {
                const srcNode = layoutNodes.find(n => n.id === lk.source)!;
                const tgtNode = layoutNodes.find(n => n.id === lk.target)!;
                if (!srcNode || !tgtNode) return null;
                const active = isLinkActive(lk);
                return (
                  <path key={idx}
                    d={ribbonPath(srcNode.x + NODE_W, lk.sy0, lk.sy1, tgtNode.x, lk.ty0, lk.ty1)}
                    fill={hexAlpha(lk.color, active ? 0.28 : 0.04)}
                    stroke={hexAlpha(lk.color, active ? 0.45 : 0.05)}
                    strokeWidth={0.5}
                    style={{ transition: "fill 0.2s, stroke 0.2s", pointerEvents: "none" }}
                  />
                );
              })}

              {/* Nodes */}
              {layoutNodes.map((n) => {
                const active = isActive(n.id);
                const isZoomed = zoomedNode === n.id;
                const isIncomeTax = n.id === "income-tax";
                return (
                  <g key={n.id} style={{ cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(n.id); }}
                    onMouseEnter={() => setHoveredNode(n.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Zoom/hover glow ring */}
                    {(isZoomed || isIncomeTax) && (
                      <rect x={n.x - 3} y={n.y - 3} width={NODE_W + 6} height={n.height + 6} rx={4}
                        fill="none" stroke={isZoomed ? n.color : "#00FF41"}
                        strokeWidth={isZoomed ? 1.5 : 1} strokeDasharray={isZoomed ? "none" : "4 2"}
                        opacity={isZoomed ? 0.9 : 0.5} />
                    )}

                    {/* Node bar */}
                    <rect x={n.x} y={n.y} width={NODE_W} height={n.height} rx={3}
                      fill={hexAlpha(n.color, active ? 0.9 : 0.15)}
                      stroke={n.color} strokeWidth={active ? 0.5 : 0.15}
                      style={{ transition: "fill 0.2s" }} />

                    {/* YOU indicator on income-tax */}
                    {isIncomeTax && (
                      <>
                        <circle cx={n.x + NODE_W / 2} cy={n.y + 6} r={3} fill="#00FF41" />
                        <text x={n.x - 6} y={n.y + 10} textAnchor="end"
                          style={{ fill: "#00FF41", fontSize: 8, fontFamily: "var(--font-mono)" }}>
                          YOU ▲
                        </text>
                      </>
                    )}

                    {/* Click hint on hover */}
                    {hoveredNode === n.id && !isZoomed && (
                      <text x={n.column < 2 ? n.x - 6 : n.x + NODE_W + 6}
                        y={n.y + n.height + 12} textAnchor={n.column < 2 ? "end" : "start"}
                        style={{ fill: "#003300", fontSize: 8, fontFamily: "var(--font-mono)" }}>
                        click to zoom
                      </text>
                    )}

                    {/* Labels */}
                    {n.column < 2 && n.height > 8 && (
                      <text x={n.x - 6} y={n.y + n.height / 2 + 4} textAnchor="end"
                        style={{ fill: active ? "#E6EDF3" : "#003300", fontSize: Math.min(11, Math.max(8, n.height / 2.5)), fontFamily: "var(--font-mono)", transition: "fill 0.2s" }}>
                        {n.label}
                      </text>
                    )}
                    {n.column >= 2 && n.height > 8 && (
                      <text x={n.x + NODE_W + 6} y={n.y + n.height / 2 + 4} textAnchor="start"
                        style={{ fill: active ? "#E6EDF3" : "#003300", fontSize: Math.min(11, Math.max(8, n.height / 2.5)), fontFamily: "var(--font-mono)", transition: "fill 0.2s" }}>
                        {n.label}
                      </text>
                    )}
                    {n.height > 22 && (
                      <text x={n.column < 2 ? n.x - 6 : n.x + NODE_W + 6} y={n.y + n.height / 2 + 16} textAnchor={n.column < 2 ? "end" : "start"}
                        style={{ fill: active ? n.color : "#002200", fontSize: 8, fontFamily: "var(--font-mono)", transition: "fill 0.2s" }}>
                        {fmt(n.value)}
                      </text>
                    )}
                  </g>
                );
              })}
            </motion.g>
          </svg>
        </div>

        {/* You Are Here sidebar */}
        <YouAreHerePanel />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 py-2.5" style={{ borderTop: "1px solid #003300" }}>
        <span className="text-[9px]" style={{ color: "#003300", fontFamily: "var(--font-mono), monospace" }}>
          click node → zoom to connected flows
        </span>
        {[
          { color: "#F0A742", label: "Income Tax" },
          { color: "#00FF41", label: "Company Tax" },
          { color: "#7C3AED", label: "GST" },
          { color: "#3FB950", label: "Other Taxes" },
          { color: "#FF6B6B", label: "Borrowing" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: item.color }} />
            <span className="text-[9px]" style={{ color: "#008F11", fontFamily: "var(--font-mono), monospace" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
