"use client";

import { useEffect, useState } from "react";

// ── Domain vocabularies ────────────────────────────────────────────────────
const DATA_TERMS = [
  "pandas", "sql.query", "spark.df", "dbt.run",
  "tableau", "athena.sql", "redshift", "feature_store",
  "data_mesh", "etl.load", "bi_layer", "kpis",
  "delta_lake", "parquet", "governance", "lineage",
  "glue_job", "streaming.df", "schema.v2", "data_quality",
  "python3", "s3_bucket", "olap_cube", "batch_job",
];

const HCI_TERMS = [
  "usability", "ux_research", "heuristics", "affordance",
  "prototype", "a/b_test", "persona", "journey_map",
  "interaction", "cognitive_load", "gestalt", "fitts_law",
  "mental_model", "wireframe", "feedback", "visibility",
  "recognition", "error_recovery", "consistency", "trust_design",
  "empathy_map", "accessibility", "system_thinking", "desirability",
];

const AGENTS_TERMS = [
  "langgraph", "rag.retrieve", "llm.chat", "embeddings",
  "tool_use", "memory.store", "planning", "agent.run",
  "chain_thought", "vector_db", "prompt_eng", "multi_agent",
  "a2a_protocol", "orchestrator", "reflection", "evaluation",
  "grounding", "context_win", "system_prompt", "fine_tuning",
  "reasoning", "self_critique", "tool_call", "agentic_loop",
];

// ── Column configs: [terms, duration(s), startDelay(s)] ───────────────────
// Negative delay = animation starts partway through, so columns are spread
// across the loop on load rather than all entering from the top together.
type ColDef = { terms: string[]; dur: number; delay: number };

const DESKTOP_COLS: ColDef[] = [
  { terms: DATA_TERMS,                                              dur: 38, delay: 0    },
  { terms: HCI_TERMS,                                               dur: 30, delay: -11  },
  { terms: AGENTS_TERMS,                                            dur: 44, delay: -22  },
  { terms: [...DATA_TERMS].reverse(),                               dur: 34, delay: -7   },
  { terms: [...HCI_TERMS.slice(8),    ...HCI_TERMS.slice(0, 8)],   dur: 50, delay: -17  },
  { terms: [...AGENTS_TERMS.slice(6), ...AGENTS_TERMS.slice(0, 6)],dur: 36, delay: -29  },
  { terms: [...DATA_TERMS.slice(12),  ...DATA_TERMS.slice(0, 12)], dur: 42, delay: -4   },
];

const MOBILE_COLS: ColDef[] = [
  { terms: DATA_TERMS,   dur: 45, delay: 0   },
  { terms: AGENTS_TERMS, dur: 38, delay: -18 },
  { terms: HCI_TERMS,    dur: 52, delay: -9  },
];

// ── Single scrolling column ────────────────────────────────────────────────
function TermCol({ terms, dur, delay }: ColDef) {
  // Duplicate content → translateY(-50%) lands on same visual position as 0%
  const looped = [...terms, ...terms];

  return (
    <div className="flex-1 overflow-hidden h-full">
      <div
        className="will-change-transform"
        style={{
          animation: `term-scroll-up ${dur}s linear ${delay}s infinite`,
        }}
      >
        {looped.map((term, i) => {
          // Three brightness levels create a visual rhythm / heartbeat
          const alpha = i % 5 === 0 ? 0.22 : i % 3 === 0 ? 0.15 : 0.09;
          return (
            <div
              key={i}
              className="text-center px-1 overflow-hidden"
              style={{
                color: `rgba(0,255,65,${alpha})`,
                fontFamily:
                  "var(--font-mono),'JetBrains Mono','Courier New',monospace",
                fontSize: "9px",
                lineHeight: "23px",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                textOverflow: "clip",
              }}
            >
              {term}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────
export default function TermColumns() {
  // Avoid SSR / hydration mismatch — render only on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    // Outer div: gradient mask fades columns at top and bottom of viewport
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 3,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
      }}
    >
      {/*
        Inner div: mix-blend-mode: screen
        — On dark surfaces (#000500 / #020c02): additive green boost (+35–60/255 G) → clearly visible
        — On bright text (#E6EDF3): barely changes (+1–4/255 G) → readability fully protected
        Separating mask (outer) from blend mode (inner) avoids a known browser
        compositing quirk where mask + blend on the same element can misbehave.
      */}
      <div className="w-full h-full" style={{ mixBlendMode: "screen" }}>
        {/* Desktop: 7 columns at different speeds and phases */}
        <div className="hidden md:flex w-full h-full">
          {DESKTOP_COLS.map((col, i) => (
            <TermCol key={i} {...col} />
          ))}
        </div>
        {/* Mobile: 3 wider columns — fewer but still clearly visible */}
        <div className="flex md:hidden w-full h-full">
          {MOBILE_COLS.map((col, i) => (
            <TermCol key={i} {...col} />
          ))}
        </div>
      </div>
    </div>
  );
}
