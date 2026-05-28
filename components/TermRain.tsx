"use client";

import { useEffect, useRef } from "react";

// ─── Domain vocabularies ───────────────────────────────────────────────────
const DATA_TERMS = [
  "pandas", "sql.query", "spark.df", "dbt.run", "tableau",
  "python3", "athena.sql", "redshift", "feature_store",
  "data_mesh", "olap_cube", "etl.load", "bi_layer",
  "delta_lake", "parquet", "s3_bucket", "governance",
  "lineage", "glue_job", "kpis", "streaming.df", "schema.v2",
];

const HCI_TERMS = [
  "usability", "ux_research", "heuristics", "affordance",
  "prototype", "a/b_test", "persona", "journey_map",
  "interaction", "cognitive_load", "gestalt", "fitts_law",
  "mental_model", "wireframe", "feedback", "visibility",
  "recognition", "error_recovery", "consistency", "trust_design",
  "empathy_map", "accessibility",
];

const AGENTS_TERMS = [
  "langgraph", "rag.retrieve", "llm.chat", "embeddings",
  "tool_use", "memory.store", "planning", "agent.run",
  "chain_thought", "vector_db", "prompt_eng", "multi_agent",
  "a2a_protocol", "orchestrator", "reflection", "evaluation",
  "grounding", "context_win", "system_prompt", "fine_tuning",
  "reasoning", "self_critique",
];

const ALL_TERMS = [...DATA_TERMS, ...HCI_TERMS, ...AGENTS_TERMS];

// ─── Depth layers: [speedMin, speedMax, fontSize, bodyAlpha, leadAlpha]
// Simulate 3D: far = small/slow/dim, close = large/fast/bright
const LAYERS = [
  { speedMin: 0.18, speedMax: 0.32, fontSize: 8,  bodyAlpha: 0.028, leadAlpha: 0.050 }, // far
  { speedMin: 0.35, speedMax: 0.60, fontSize: 10, bodyAlpha: 0.055, leadAlpha: 0.090 }, // mid
  { speedMin: 0.68, speedMax: 1.10, fontSize: 13, bodyAlpha: 0.090, leadAlpha: 0.140 }, // close
] as const;

interface Col {
  x: number;
  y: number;
  speed: number;
  term: string;
  layerIdx: number;
}

const TOTAL_COLS = 22;

function randomTerm() {
  return ALL_TERMS[Math.floor(Math.random() * ALL_TERMS.length)];
}

function randomLayerIdx() {
  // Weight distribution: 40% far, 40% mid, 20% close
  const r = Math.random();
  if (r < 0.40) return 0;
  if (r < 0.80) return 1;
  return 2;
}

export default function TermRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let cols: Col[] = [];

    const makeCol = (idx: number, w: number, h: number, startBelow = false): Col => {
      const layerIdx = randomLayerIdx();
      const layer = LAYERS[layerIdx];
      const term = randomTerm();
      const charH = layer.fontSize * 1.75;
      const colW = w / TOTAL_COLS;
      const x = colW * idx + colW * 0.5 + (Math.random() - 0.5) * colW * 0.5;
      const y = startBelow
        ? -(term.length * charH) - Math.random() * h
        : Math.random() * (h + term.length * charH) - term.length * charH;
      const speed =
        layer.speedMin + Math.random() * (layer.speedMax - layer.speedMin);
      return { x, y, speed, term, layerIdx };
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Array.from({ length: TOTAL_COLS }, (_, i) =>
        makeCol(i, canvas.width, canvas.height, false)
      );
    };

    let lastTime = 0;

    const draw = (time: number) => {
      // ~15 fps — atmospheric feel, light on CPU
      if (time - lastTime < 66) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let ci = 0; ci < cols.length; ci++) {
        const col = cols[ci];
        const layer = LAYERS[col.layerIdx];
        const charH = layer.fontSize * 1.75;

        ctx.font = `${layer.fontSize}px 'JetBrains Mono','Courier New',monospace`;

        for (let ki = 0; ki < col.term.length; ki++) {
          const cy = col.y + ki * charH;
          if (cy < -charH || cy > canvas.height) continue;

          // Last char is the "lead" — brightest
          const isLead = ki === col.term.length - 1;
          const alpha = isLead ? layer.leadAlpha : layer.bodyAlpha;

          ctx.fillStyle = isLead
            ? `rgba(200,255,215,${alpha})`
            : `rgba(0,255,65,${alpha})`;

          ctx.fillText(col.term[ki], col.x, cy);
        }

        col.y += col.speed;

        // Recycle once the entire term has exited the bottom
        const tailY = col.y + (col.term.length - 1) * charH;
        if (tailY > canvas.height + charH * 3) {
          cols[ci] = makeCol(ci, canvas.width, canvas.height, true);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    animId = requestAnimationFrame(draw);

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        // z-index: 2 sits above sections (static flow) but well below nav (z-50)
        zIndex: 2,
        pointerEvents: "none",
        // screen blend: additive on dark surfaces, invisible on bright content
        mixBlendMode: "screen",
      }}
    />
  );
}
