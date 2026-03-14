"use client";

import { useEffect, useRef } from "react";

const MG  = "#00FF41";
const MD  = "#008F11";
const MBG = "#000500";
const MC  = "#020c02";

const AGENTS = [
  { id: "orch",     label: "Orchestrator",  x: 0.50, y: 0.20, color: "#00FF41" },
  { id: "mcp",      label: "MCP Layer",     x: 0.50, y: 0.50, color: "#06b6d4" },
  { id: "research", label: "Research",      x: 0.18, y: 0.72, color: "#8b5cf6" },
  { id: "risk",     label: "Risk",          x: 0.40, y: 0.82, color: "#f59e0b" },
  { id: "report",   label: "Report",        x: 0.62, y: 0.82, color: "#10b981" },
  { id: "comply",   label: "Compliance",    x: 0.82, y: 0.72, color: "#ef4444" },
];

const EDGES: [string, string][] = [
  ["orch", "mcp"],
  ["mcp", "research"],
  ["mcp", "risk"],
  ["mcp", "report"],
  ["mcp", "comply"],
  ["research", "risk"],
  ["risk", "report"],
];

interface PulseParticle {
  edgeIdx: number;
  t: number;
  speed: number;
}

export default function AgentsViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const r = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * r;
      canvas.height = canvas.offsetHeight * r;
      ctx.scale(r, r);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles: PulseParticle[] = EDGES.map((_, i) => ({
      edgeIdx: i,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.002,
    }));

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const nodePos = (id: string) => {
      const a = AGENTS.find(a => a.id === id)!;
      return { x: a.x * W(), y: a.y * H() };
    };

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      frame++;

      // Edges
      EDGES.forEach(([from, to]) => {
        const a = nodePos(from);
        const b = nodePos(to);
        const ga = AGENTS.find(n => n.id === from)!;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `${ga.color}28`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Pulse particles
      particles.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const [from, to] = EDGES[p.edgeIdx];
        const a = nodePos(from);
        const b = nodePos(to);
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        const ag = AGENTS.find(n => n.id === from)!;

        const grd = ctx.createRadialGradient(px, py, 0, px, py, 5);
        grd.addColorStop(0, ag.color);
        grd.addColorStop(1, `${ag.color}00`);
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Nodes
      AGENTS.forEach(agent => {
        const { x, y } = nodePos(agent.id);
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.035 + AGENTS.indexOf(agent));

        // Glow ring
        const ringR = 18 + pulse * 4;
        const grd = ctx.createRadialGradient(x, y, 8, x, y, ringR);
        grd.addColorStop(0, `${agent.color}40`);
        grd.addColorStop(1, `${agent.color}00`);
        ctx.beginPath();
        ctx.arc(x, y, ringR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = MC;
        ctx.strokeStyle = agent.color;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = agent.color;
        ctx.font = `500 9px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(agent.label, x, y + 16);
        ctx.textBaseline = "alphabetic";
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="relative w-full"
      style={{ background: MBG, minHeight: 340 }}
    >
      <canvas ref={canvasRef} className="w-full" style={{ height: 340, display: "block" }} />

      {/* Tag row */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 flex-wrap px-4">
        {["Tool Calling", "LangGraph", "MCP", "Agent-to-Agent", "LLM Observability"].map(t => (
          <span
            key={t}
            className="text-[9px] px-2 py-0.5 rounded-full"
            style={{ background: `${MG}10`, color: MD, border: `1px solid ${MG}20`, fontFamily: "var(--font-mono), monospace" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
