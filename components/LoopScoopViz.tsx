"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Loop & Scoop palette ──────────────────────────────────────────────────
   Same six scoops, same 125.30 gap as the live page at
   loop-engineering-deepagents.vercel.app                              */
const BG   = "#14100f";
const S1   = "#1e1917";
const S2   = "#282220";
const SOFT = "#2f2724";
const TX   = "#fff6ef";
const TX2  = "#d6c6ba";
const TX3  = "#9b8a7d";
const PINK = "#f2889f";
const MINT = "#7fd4a8";
const WARN = "#fab219";

const MONO = "var(--font-mono), ui-monospace, monospace";
const SANS = "var(--font-inter), sans-serif";

const TILL = 1412.5;
const DRAWER = 1287.2;
const GAP = +(TILL - DRAWER).toFixed(2); // 125.30

type Scoop = { id: string; c: string; amt: number; label: string; loop: 1 | 2 };

const SCOOPS: Scoop[] = [
  { id: "S1", c: MINT,      amt: 18.0, label: "Tips moved to the tip jar",      loop: 1 },
  { id: "S2", c: "#8b5e3c", amt: 37.0, label: "Petty cash, sprinkle delivery",  loop: 1 },
  { id: "S3", c: PINK,      amt:  4.5, label: "Freya's birthday cone, rung up", loop: 1 },
  { id: "S4", c: "#f5e6c8", amt:  3.2, label: "Staff scoop discount missed",    loop: 1 },
  { id: "S5", c: "#b6d47a", amt:  2.6, label: "Cash over/short in the float",   loop: 2 },
  { id: "S6", c: "#8b7fd4", amt: 60.0, label: "Void run at 16:12, four sales",  loop: 2 },
];

type Loop = {
  n: 1 | 2 | 3 | 4;
  name: string;
  verb: string;
  mins: string;
  good: boolean;
  line: string;
};

const LOOPS: Loop[] = [
  { n: 1, name: "Scoop it",    verb: "the agent runs",   mins: "40 → 12 min", good: false,
    line: "Four scoops off the laminated card. Fast, tidy, and 62.60 short of the truth." },
  { n: 2, name: "Check it",    verb: "the agent grades", mins: "12 → 8 min",  good: true,
    line: "The cone has to add to the gap. It does not, so the run bounces back and finishes itself." },
  { n: 3, name: "Every night", verb: "nobody starts it", mins: "8 × 30",      good: false,
    line: "Thirty nights unattended. And thirty nights of asking Marco the same two questions." },
  { n: 4, name: "Learn it",    verb: "the harness edits", mins: "8 → 3 min", good: true,
    line: "The over/short habit is written back once, with Marco approving. The void check stays." },
];

const M = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LoopScoopViz() {
  const [stage, setStage]   = useState(0);      // 0 idle, 1..4 loops, 5 done
  const [scoops, setScoops] = useState<Scoop[]>([]);
  const [note, setNote]     = useState("Marco has forty minutes and a drawer that does not agree with the till.");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = typeof window !== "undefined"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => { timers.current.forEach(clearTimeout); };
  }, []);

  const at = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, reduce.current ? Math.min(ms, 120) : ms));
  }, []);

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setScoops([]);
    setStage(1);
    setNote("Loop 1. The agent works the laminated card, four known reasons, no thinking required.");

    SCOOPS.filter((s) => s.loop === 1).forEach((s, i) => {
      at(340 + i * 420, () => setScoops((p) => [...p, s]));
    });

    at(2150, () => {
      setStage(2);
      setNote("Loop 2. The cone is 62.60 light. A four line checker fails it and the run goes round again.");
    });
    SCOOPS.filter((s) => s.loop === 2).forEach((s, i) => {
      at(2700 + i * 520, () => setScoops((p) => [...p, s]));
    });

    at(3900, () => {
      setStage(3);
      setNote("Loop 3. Nobody presses run any more. Thirty nights, same two questions, every single one.");
    });
    at(5300, () => {
      setStage(4);
      setNote("Loop 4. The agent proposes a harness edit. Marco approves one and blocks the other.");
    });
    at(6600, () => {
      setStage(5);
      setNote("Cone complete. 125.30 accounted for, three minutes of Marco still in the loop on purpose.");
    });
  }, [at]);

  const total = scoops.reduce((a, s) => a + s.amt, 0);
  const done  = stage >= 5;
  const busy  = stage > 0 && stage < 5;

  return (
    <div style={{ background: BG, fontFamily: SANS }}>
      {/* ── Header strip ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        padding: "14px 18px", borderBottom: `1px solid ${SOFT}`, background: S1,
      }}>
        <span style={{ fontSize: 18 }}>🍦</span>
        <span style={{ font: `600 13px ${SANS}`, color: TX }}>
          Loop &amp; <span style={{ color: PINK }}>Scoop</span>
        </span>
        <span style={{ font: `10px ${MONO}`, color: TX3, marginLeft: 2 }}>
          Marco&apos;s cash-up, 20:20
        </span>
        <button
          onClick={run}
          disabled={busy}
          style={{
            marginLeft: "auto", font: `600 11px ${SANS}`, color: BG,
            background: busy ? TX3 : PINK, border: "none", borderRadius: 999,
            padding: "8px 16px", cursor: busy ? "wait" : "pointer",
            transition: "transform .18s, background .18s",
          }}
          onMouseEnter={(e) => { if (!busy) e.currentTarget.style.transform = "translateY(-1px) rotate(-1.5deg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          {stage === 0 ? "Run the cash-up" : busy ? "Scooping…" : "Run it again"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 0 }}>
        <div className="ls-grid" style={{ display: "grid", gap: 18, padding: 18 }}>

          {/* ── The cone ── */}
          <div style={{
            background: S1, border: `1px solid ${SOFT}`, borderRadius: 16,
            padding: "16px 16px 10px", display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{ font: `10px ${MONO}`, color: TX3, letterSpacing: ".18em", marginBottom: 4 }}>
              THE GAP
            </div>
            <div style={{ font: `600 26px ${MONO}`, color: done ? MINT : PINK, transition: "color .4s" }}>
              {M(GAP)}
            </div>
            <div style={{ font: `10px ${MONO}`, color: TX3, marginBottom: 12 }}>
              till {M(TILL)} · drawer {M(DRAWER)}
            </div>

            {/* stack */}
            <div style={{
              display: "flex", flexDirection: "column-reverse", alignItems: "center",
              minHeight: 128, justifyContent: "flex-start",
            }}>
              <AnimatePresence>
                {scoops.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ y: -34, scale: 0.5, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 13 }}
                    title={`${s.label} · ${M(s.amt)}`}
                    style={{
                      width: 62 - i * 3, height: 21, borderRadius: "50%",
                      background: s.c, marginBottom: -7,
                      boxShadow: `0 2px 0 rgba(0,0,0,.28)`,
                      zIndex: 10 - i,
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* cone */}
            <div style={{
              width: 0, height: 0, marginTop: 4,
              borderLeft: "23px solid transparent", borderRight: "23px solid transparent",
              borderTop: `44px solid #c98b4b`,
            }} />

            <div style={{ font: `11px ${MONO}`, color: done ? MINT : TX2, marginTop: 10 }}>
              {done ? "✓ " : ""}{M(total)} of {M(GAP)} explained
            </div>
          </div>

          {/* ── The four loops ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LOOPS.map((l) => {
              const on   = stage >= l.n;
              const live = stage === l.n;
              return (
                <motion.div
                  key={l.n}
                  animate={{
                    opacity: on ? 1 : 0.32,
                    borderColor: live ? PINK : SOFT,
                    background: live ? S2 : S1,
                  }}
                  transition={{ duration: 0.35 }}
                  style={{ border: `1px solid ${SOFT}`, borderRadius: 14, padding: "11px 14px" }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ font: `10px ${MONO}`, color: live ? PINK : TX3 }}>
                      LOOP {l.n}
                    </span>
                    <span style={{ font: `600 13px ${SANS}`, color: TX }}>{l.name}</span>
                    <span style={{ font: `10px ${MONO}`, color: TX3 }}>{l.verb}</span>
                    <span style={{
                      marginLeft: "auto", font: `10px ${MONO}`,
                      color: l.good ? MINT : WARN,
                    }}>
                      {l.good ? "✓" : "!"} {l.mins}
                    </span>
                  </div>
                  <AnimatePresence>
                    {on && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        style={{ margin: "6px 0 0", font: `12px/1.55 ${SANS}`, color: TX2 }}
                      >
                        {l.line}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Marco's line ── */}
      <div style={{
        borderTop: `1px solid ${SOFT}`, background: S1, padding: "12px 18px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 17 }}>{done ? "😌" : busy ? "🤨" : "😟"}</span>
        <motion.p
          key={note}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ margin: 0, font: `12px/1.5 ${SANS}`, color: TX2, flex: 1 }}
        >
          {note}
        </motion.p>
        <a
          href="https://loop-engineering-deepagents.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            font: `600 11px ${SANS}`, color: PINK, textDecoration: "none",
            border: `1px solid ${PINK}55`, borderRadius: 999, padding: "7px 13px", whiteSpace: "nowrap",
          }}
        >
          Full page →
        </a>
      </div>

      <style>{`
        @media (min-width: 720px) {
          .ls-grid { grid-template-columns: 210px minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
