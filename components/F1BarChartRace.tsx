"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import {
  DRIVERS, RACES, STANDINGS_BY_RACE, NARRATIVE_COLORS,
  type DriverMeta,
} from "@/data/f1-2025";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const from = prev.current;
    prev.current = value;
    const controls = animate(from, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => { if (node) node.textContent = Math.round(v).toString(); },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}

// ─── Driver Row ────────────────────────────────────────────────────────────────
function DriverBar({
  driver,
  points,
  maxPoints,
  position,
  prevPosition,
}: {
  driver: DriverMeta;
  points: number;
  maxPoints: number;
  position: number;
  prevPosition: number;
}) {
  const barPct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  const isMax = driver.isMax;
  const moved = position < prevPosition ? "up" : position > prevPosition ? "down" : "same";

  return (
    <motion.div
      layout
      layoutId={`row-${driver.id}`}
      className="flex items-center gap-3 py-1.5"
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Position */}
      <div className="w-5 flex-shrink-0 text-center">
        <span
          className="text-xs font-bold"
          style={{
            color: isMax ? "#3671C6" : "#6B6560",
            fontFamily: "var(--font-inter), monospace",
          }}
        >
          {position}
        </span>
      </div>

      {/* Driver flag + name */}
      <div className="w-32 flex-shrink-0 flex items-center gap-1.5 overflow-hidden">
        <span className="text-sm leading-none">{driver.flag}</span>
        <div className="overflow-hidden">
          <span
            className="text-xs font-semibold tracking-wide block truncate"
            style={{
              color: isMax ? "#F8F5F0" : "#D4CFC8",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {driver.short}
          </span>
          <span
            className="text-[9px] block truncate"
            style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {driver.teamShort}
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="flex-1 relative h-7 rounded-full overflow-hidden" style={{ background: "#2A2520" }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          animate={{ width: `${barPct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: isMax
              ? "linear-gradient(90deg, #2A4A9C, #3671C6, #6EA4FF)"
              : `${driver.color}55`,
            minWidth: "2px",
          }}
        >
          {/* Shimmer on Max's bar */}
          {isMax && (
            <motion.div
              className="absolute inset-0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                width: "50%",
              }}
            />
          )}
        </motion.div>

        {/* Points inside bar */}
        <div
          className="absolute inset-0 flex items-center justify-end pr-2"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="text-xs font-bold"
            style={{
              color: isMax ? "#F8F5F0" : "#A8A29E",
              fontFamily: "var(--font-inter), monospace",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            <Counter value={points} />
          </span>
        </div>
      </div>

      {/* Movement indicator */}
      <div className="w-4 flex-shrink-0 flex items-center justify-center">
        {moved === "up" && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px]"
            style={{ color: "#4CAF50" }}
          >
            ▲
          </motion.span>
        )}
        {moved === "down" && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px]"
            style={{ color: "#EF5350" }}
          >
            ▼
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function F1BarChartRace() {
  const [raceIdx, setRaceIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.8); // seconds per race
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentRace = RACES[raceIdx];
  const currentStandings = STANDINGS_BY_RACE[raceIdx];
  const prevStandings = raceIdx > 0 ? STANDINGS_BY_RACE[raceIdx - 1] : currentStandings;

  const sorted = [...currentStandings].sort((a, b) => b.points - a.points);
  const prevSorted = [...prevStandings].sort((a, b) => b.points - a.points);
  const maxPoints = sorted[0]?.points ?? 1;

  // Position lookup
  const prevPositionMap: Record<string, number> = {};
  prevSorted.forEach((e, i) => { prevPositionMap[e.driverId] = i + 1; });

  const advance = useCallback(() => {
    setRaceIdx((i) => {
      if (i >= RACES.length - 1) {
        setPlaying(false);
        return i;
      }
      return i + 1;
    });
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (playing) {
      intervalRef.current = setTimeout(advance, speed * 1000);
    }
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [playing, raceIdx, speed, advance]);

  const narrativeColor = NARRATIVE_COLORS[currentRace.narrativePhase];

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ background: "#0F0D0B", border: "1px solid #2A2520" }}
    >
      {/* Header */}
      <div
        className="px-6 pt-6 pb-4"
        style={{ borderBottom: "1px solid #1E1A17" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏎️</span>
              <span
                className="text-xs font-semibold tracking-[0.15em] uppercase"
                style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}
              >
                F1 2025 — Driver Championship Race
              </span>
            </div>
            <h3
              className="text-2xl font-light"
              style={{ color: "#F8F5F0", fontFamily: "var(--font-cormorant), serif" }}
            >
              The Verstappen Comeback
            </h3>
          </div>
          {/* Speed toggle */}
          <div className="flex items-center gap-1.5">
            {[1, 1.8, 3].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
                style={{
                  background: speed === s ? "#3671C6" : "#2A2520",
                  color: speed === s ? "#F8F5F0" : "#6B6560",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {s === 1 ? "Slow" : s === 1.8 ? "Normal" : "Fast"}
              </button>
            ))}
          </div>
        </div>

        {/* Race info */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl">{currentRace.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-base font-semibold"
                style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Round {currentRace.round} · {currentRace.name}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: narrativeColor + "25", color: narrativeColor, fontFamily: "var(--font-inter), sans-serif" }}
              >
                {currentRace.date}
              </span>
            </div>
            {/* Max moment badge */}
            {currentRace.maxMoment && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3671C6" }} />
                <span
                  className="text-xs font-medium"
                  style={{ color: "#3671C6", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  VER: {currentRace.maxMoment}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narrative banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={raceIdx}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="px-6 py-3"
          style={{
            background: narrativeColor + "12",
            borderBottom: `1px solid ${narrativeColor}25`,
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: narrativeColor, fontFamily: "var(--font-inter), sans-serif" }}
          >
            {currentRace.narrative}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bar chart */}
      <div className="px-5 py-4">
        <div className="space-y-0">
          {sorted.map((entry, idx) => {
            const driver = DRIVERS.find((d) => d.id === entry.driverId)!;
            const prevPos = prevPositionMap[entry.driverId] ?? idx + 1;
            return (
              <DriverBar
                key={driver.id}
                driver={driver}
                points={entry.points}
                maxPoints={maxPoints}
                position={idx + 1}
                prevPosition={prevPos}
              />
            );
          })}
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
          {RACES.map((race, i) => (
            <button
              key={i}
              onClick={() => { setPlaying(false); setRaceIdx(i); }}
              className="flex-shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all"
              style={{
                background: i === raceIdx ? "#2A2520" : "transparent",
              }}
            >
              <span className="text-sm leading-none">{race.flag}</span>
              <div
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: i === raceIdx
                    ? NARRATIVE_COLORS[race.narrativePhase]
                    : i < raceIdx ? "#3C3530" : "#1E1A17",
                  transform: i === raceIdx ? "scale(1.4)" : "scale(1)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Phase legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["struggle", "finding", "climbing", "pressure", "fight", "comeback"] as const).map((phase) => (
            <div key={phase} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: NARRATIVE_COLORS[phase] }} />
              <span
                className="text-[9px] capitalize"
                style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif" }}
              >
                {phase}
              </span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPlaying(false); setRaceIdx((i) => Math.max(0, i - 1)); }}
              disabled={raceIdx === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "#2A2520", color: "#A8A29E" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (raceIdx >= RACES.length - 1 && !playing) setRaceIdx(0);
                setPlaying((p) => !p);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: playing ? "#3671C6" : "#2A2520", color: "#F8F5F0" }}
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 2l7 4-7 4V2z" fill="currentColor" />
                </svg>
              )}
            </button>

            <button
              onClick={() => { setPlaying(false); setRaceIdx((i) => Math.min(RACES.length - 1, i + 1)); }}
              disabled={raceIdx === RACES.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "#2A2520", color: "#A8A29E" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <span
            className="text-xs"
            style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {raceIdx + 1} / {RACES.length} races
          </span>
        </div>
      </div>

      {/* Footer note */}
      <div
        className="px-5 py-3"
        style={{ borderTop: "1px solid #1E1A17" }}
      >
        <p
          className="text-[10px]"
          style={{ color: "#3C3530", fontFamily: "var(--font-inter), sans-serif" }}
        >
          * Illustrative season narrative based on 2025 F1 championship. Data reflects race wins, DNFs, and standings progression.
        </p>
      </div>
    </div>
  );
}
