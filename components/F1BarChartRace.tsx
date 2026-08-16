"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  DRIVERS, RACES, STANDINGS_BY_RACE, NARRATIVE_COLORS,
  type DriverMeta, type RaceMeta, type StandingsEntry,
} from "@/data/f1-2025";
import {
  DRIVERS_2026, RACES_2026, STANDINGS_BY_RACE_2026, NARRATIVE_COLORS_2026, ENGINE_CHANGES,
  type Driver2026, type Race2026,
} from "@/data/f1-2026";

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
      duration: 0.55,
      ease: "easeOut",
      onUpdate: (v) => { if (node) node.textContent = Math.round(v).toString(); },
    });
    return () => controls.stop();
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

// ─── Driver Bar (shared for 2025 & 2026) ──────────────────────────────────────
function DriverBar({
  id, flag, short, teamShort, color, isHighlight,
  points, maxPoints, position, prevPosition,
}: {
  id: string; flag: string; short: string; teamShort: string; color: string; isHighlight: boolean;
  points: number; maxPoints: number; position: number; prevPosition: number;
}) {
  const barPct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  const moved = position < prevPosition ? "up" : position > prevPosition ? "down" : "same";

  return (
    <motion.div
      layout
      layoutId={`row-${id}`}
      className="flex items-center gap-3 py-1.5"
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-5 flex-shrink-0 text-center">
        <span className="text-xs font-bold" style={{ color: isHighlight ? color : "#6B6560", fontFamily: "var(--font-inter), monospace" }}>
          {position}
        </span>
      </div>
      <div className="w-32 flex-shrink-0 flex items-center gap-1.5 overflow-hidden">
        <span className="text-sm leading-none">{flag}</span>
        <div className="overflow-hidden">
          <span className="text-xs font-semibold tracking-wide block truncate" style={{ color: isHighlight ? "#F8F5F0" : "#D4CFC8", fontFamily: "var(--font-inter), sans-serif" }}>
            {short}
          </span>
          <span className="text-[9px] block truncate" style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>
            {teamShort}
          </span>
        </div>
      </div>
      <div className="flex-1 relative h-7 rounded-full overflow-hidden" style={{ background: "#2A2520" }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          animate={{ width: `${barPct}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: isHighlight ? `linear-gradient(90deg, ${color}99, ${color})` : `${color}55`, minWidth: "2px" }}
        >
          {isHighlight && (
            <motion.div
              className="absolute inset-0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)", width: "50%" }}
            />
          )}
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-end pr-2" style={{ pointerEvents: "none" }}>
          <span className="text-xs font-bold" style={{ color: isHighlight ? "#F8F5F0" : "#A8A29E", fontFamily: "var(--font-inter), monospace", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
            <Counter value={points} />
          </span>
        </div>
      </div>
      <div className="w-4 flex-shrink-0 flex items-center justify-center">
        {moved === "up" && <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[10px]" style={{ color: "#4CAF50" }}>▲</motion.span>}
        {moved === "down" && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[10px]" style={{ color: "#EF5350" }}>▼</motion.span>}
      </div>
    </motion.div>
  );
}

// ─── Race Detail Pill ──────────────────────────────────────────────────────────
function RaceDetailPill({ icon, label, value, color = "#6B6560" }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "#2A2520" }}>
      <span className="text-[11px]">{icon}</span>
      <span className="text-[10px]" style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>{label}:</span>
      <span className="text-[10px] font-semibold" style={{ color, fontFamily: "var(--font-inter), monospace" }}>{value}</span>
    </div>
  );
}

// ─── Season Bar Chart ──────────────────────────────────────────────────────────
function SeasonBarChart({
  season,
  drivers,
  races,
  standings,
  narrativeColors,
  highlightDriverId,
  accentColor,
}: {
  season: 2025 | 2026;
  drivers: (DriverMeta | Driver2026)[];
  races: (RaceMeta | Race2026)[];
  standings: StandingsEntry[][];
  narrativeColors: Record<string, string>;
  highlightDriverId: string;
  accentColor: string;
}) {
  const [raceIdx, setRaceIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.8);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentRace = races[raceIdx];
  const currentStandings = standings[raceIdx];
  const prevStandings = raceIdx > 0 ? standings[raceIdx - 1] : currentStandings;

  const sorted = [...currentStandings].sort((a, b) => b.points - a.points);
  const prevSorted = [...prevStandings].sort((a, b) => b.points - a.points);
  const maxPoints = sorted[0]?.points ?? 1;

  const prevPositionMap: Record<string, number> = {};
  prevSorted.forEach((e, i) => { prevPositionMap[e.driverId] = i + 1; });

  const advance = useCallback(() => {
    setRaceIdx((i) => {
      if (i >= races.length - 1) { setPlaying(false); return i; }
      return i + 1;
    });
  }, [races.length]);

  useEffect(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (playing) intervalRef.current = setTimeout(advance, speed * 1000);
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [playing, raceIdx, speed, advance]);

  const narrativeColor = narrativeColors[currentRace.narrativePhase] ?? "#6B6560";
  const winnerDriver = drivers.find((d) => d.id === currentRace.winner);
  const flDriver = drivers.find((d) => d.id === currentRace.fastestLap.driverId);
  const tsDriver = drivers.find((d) => d.id === currentRace.topSpeed.driverId);

  return (
    <div>
      {/* Race header */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid #1E1A17" }}>
        <div className="flex items-center gap-3 flex-wrap justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentRace.flag}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}>
                  Round {currentRace.round} · {currentRace.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: narrativeColor + "25", color: narrativeColor, fontFamily: "var(--font-inter), sans-serif" }}>
                  {currentRace.date}
                </span>
              </div>
              {"leadMoment" in currentRace && currentRace.leadMoment ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                  <span className="text-xs font-medium" style={{ color: accentColor, fontFamily: "var(--font-inter), sans-serif" }}>{currentRace.leadMoment}</span>
                </div>
              ) : "maxMoment" in currentRace && currentRace.maxMoment ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                  <span className="text-xs font-medium" style={{ color: accentColor, fontFamily: "var(--font-inter), sans-serif" }}>VER: {currentRace.maxMoment}</span>
                </div>
              ) : null}
            </div>
          </div>
          {/* Speed toggle */}
          <div className="flex items-center gap-1.5">
            {[1, 1.8, 3].map((s) => (
              <button key={s} onClick={() => setSpeed(s)} className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
                style={{ background: speed === s ? accentColor : "#2A2520", color: speed === s ? "#F8F5F0" : "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>
                {s === 1 ? "Slow" : s === 1.8 ? "Normal" : "Fast"}
              </button>
            ))}
          </div>
        </div>

        {/* Race data pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {winnerDriver && (
            <RaceDetailPill icon="🏆" label="Winner" value={winnerDriver.short} color="#F8D76B" />
          )}
          {flDriver && (
            <RaceDetailPill icon="⚡" label="Fastest Lap" value={`${flDriver.short} · ${currentRace.fastestLap.time}`} color="#9B59B6" />
          )}
          {tsDriver && (
            <RaceDetailPill icon="🚀" label="Top Speed" value={`${tsDriver.short} · ${currentRace.topSpeed.kmh} km/h`} color="#E67E22" />
          )}
        </div>
      </div>

      {/* Narrative banner */}
      <AnimatePresence mode="wait">
        <motion.div key={raceIdx} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
          className="px-5 py-2.5" style={{ background: narrativeColor + "10", borderBottom: `1px solid ${narrativeColor}20` }}>
          <p className="text-xs leading-relaxed" style={{ color: narrativeColor, fontFamily: "var(--font-inter), sans-serif" }}>
            {currentRace.narrative}
          </p>
          {"engineNote" in currentRace && currentRace.engineNote && (
            <p className="text-[10px] leading-relaxed mt-1.5 flex items-start gap-1.5" style={{ color: "#C96A36", fontFamily: "var(--font-inter), sans-serif" }}>
              <span className="flex-shrink-0 mt-0.5">⚙️</span>{currentRace.engineNote}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bars */}
      <div className="px-5 py-3">
        <div className="space-y-0">
          {sorted.map((entry, idx) => {
            const driver = drivers.find((d) => d.id === entry.driverId)!;
            return (
              <DriverBar
                key={driver.id}
                id={driver.id}
                flag={driver.flag}
                short={driver.short}
                teamShort={driver.teamShort}
                color={driver.color}
                isHighlight={driver.id === highlightDriverId}
                points={entry.points}
                maxPoints={maxPoints}
                position={idx + 1}
                prevPosition={prevPositionMap[entry.driverId] ?? idx + 1}
              />
            );
          })}
        </div>
      </div>

      {/* Scrubber */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
          {races.map((race, i) => (
            <button key={i} onClick={() => { setPlaying(false); setRaceIdx(i); }}
              className="flex-shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all"
              style={{ background: i === raceIdx ? "#2A2520" : "transparent" }}>
              <span className="text-sm leading-none">{race.flag}</span>
              <div className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === raceIdx ? narrativeColors[race.narrativePhase] : i < raceIdx ? "#3C3530" : "#1E1A17", transform: i === raceIdx ? "scale(1.4)" : "scale(1)" }} />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {(Object.entries(narrativeColors) as [string, string][]).map(([phase, color]) => (
            <div key={phase} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-[9px] capitalize" style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif" }}>{phase}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => { setPlaying(false); setRaceIdx((i) => Math.max(0, i - 1)); }} disabled={raceIdx === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "#2A2520", color: "#A8A29E" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={() => { if (raceIdx >= races.length - 1 && !playing) setRaceIdx(0); setPlaying((p) => !p); }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: playing ? accentColor : "#2A2520", color: "#F8F5F0" }}>
              {playing
                ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" /></svg>
                : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 2l7 4-7 4V2z" fill="currentColor" /></svg>}
            </button>
            <button onClick={() => { setPlaying(false); setRaceIdx((i) => Math.min(races.length - 1, i + 1)); }} disabled={raceIdx === races.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: "#2A2520", color: "#A8A29E" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <span className="text-xs" style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif" }}>
            {raceIdx + 1} / {races.length} races · {season === 2026 ? "Season in progress" : "Full season"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Compare Tab ───────────────────────────────────────────────────────────────
function CompareTab() {
  const [compView, setCompView] = useState<"engine" | "laps" | "speed" | "pu">("engine");

  return (
    <div className="px-5 py-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {[
          { key: "engine", label: "⚙️ Power Unit" },
          { key: "laps",   label: "⏱️ Fastest Laps" },
          { key: "speed",  label: "🚀 Top Speeds" },
          { key: "pu",     label: "🔧 PU Suppliers" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setCompView(key as typeof compView)}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
            style={{ background: compView === key ? "#C96A36" : "#2A2520", color: compView === key ? "#F8F5F0" : "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {compView === "engine" && (
          <motion.div key="engine" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}>{ENGINE_CHANGES.title}</p>
            <p className="text-[10px] mb-4" style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>{ENGINE_CHANGES.subtitle}</p>

            {/* Column headers */}
            <div className="grid grid-cols-3 gap-3 mb-2 text-[10px] font-semibold" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              <span style={{ color: "#6B6560" }}>Metric</span>
              <span style={{ color: "#CC5533" }}>2025 Season</span>
              <span style={{ color: "#3671C6" }}>2026 Season</span>
            </div>

            <div className="space-y-3">
              {ENGINE_CHANGES.changes.map((c) => (
                <div key={c.category} className="grid grid-cols-3 gap-3 py-3 rounded-xl" style={{ background: "#1A1714" }}>
                  <div className="px-3 flex items-center gap-1.5">
                    <span className="text-base">{c.icon}</span>
                    <span className="text-[10px] font-semibold" style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}>{c.category}</span>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-semibold mb-1" style={{ color: c.v2025.color, fontFamily: "var(--font-inter), sans-serif" }}>{c.v2025.label}</p>
                    <p className="text-[9px]" style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif" }}>{c.v2025.detail}</p>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-semibold mb-1" style={{ color: c.v2026.color, fontFamily: "var(--font-inter), sans-serif" }}>{c.v2026.label}</p>
                    <p className="text-[9px]" style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif" }}>{c.v2026.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {compView === "laps" && (
          <motion.div key="laps" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-xs font-semibold mb-4" style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}>Fastest Lap Comparison - 2025 vs 2026</p>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-4 gap-2 text-[9px] font-semibold uppercase tracking-wider pb-2" style={{ color: "#4A4440", fontFamily: "var(--font-inter), sans-serif", borderBottom: "1px solid #2A2520" }}>
                <span>Circuit</span>
                <span>2025</span>
                <span>2026</span>
                <span>Δ</span>
              </div>
              {RACES_2026.map((r26, i) => {
                const r25 = RACES[i];
                if (!r25) return null;
                const t25 = r25.fastestLap.time;
                const t26 = r26.fastestLap.time;
                const toSec = (t: string) => {
                  const parts = t.split(":");
                  return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
                };
                const delta = (toSec(t25) - toSec(t26)).toFixed(2);
                const faster = parseFloat(delta) > 0;
                return (
                  <div key={r26.round} className="grid grid-cols-4 gap-2 items-center py-2 rounded-lg px-2" style={{ background: "#1A1714" }}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{r26.flag}</span>
                      <span className="text-[10px]" style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}>{r26.name}</span>
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: "#CC5533", fontFamily: "var(--font-inter), monospace" }}>{t25}</span>
                    <span className="text-[10px] font-mono" style={{ color: "#3671C6", fontFamily: "var(--font-inter), monospace" }}>{t26}</span>
                    <span className="text-[10px] font-semibold" style={{ color: faster ? "#4CAF50" : "#EF5350", fontFamily: "var(--font-inter), monospace" }}>
                      {faster ? `−${delta}s` : `+${Math.abs(parseFloat(delta)).toFixed(2)}s`}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] mt-3" style={{ color: "#3C3530", fontFamily: "var(--font-inter), sans-serif" }}>
              * Negative Δ = 2026 faster. New 800kW PU + active aero delivers ~1.1s improvement on average.
            </p>
          </motion.div>
        )}

        {compView === "speed" && (
          <motion.div key="speed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-xs font-semibold mb-4" style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}>Top Speed Comparison - 2025 vs 2026 (km/h)</p>
            <div className="space-y-3">
              {RACES_2026.map((r26, i) => {
                const r25 = RACES[i];
                if (!r25) return null;
                const spd25 = r25.topSpeed.kmh;
                const spd26 = r26.topSpeed.kmh;
                const maxSpd = Math.max(spd25, spd26, 370);
                return (
                  <div key={r26.round}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{r26.flag}</span>
                        <span className="text-[10px]" style={{ color: "#A8A29E", fontFamily: "var(--font-inter), sans-serif" }}>{r26.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono" style={{ color: "#CC5533", fontFamily: "var(--font-inter), monospace" }}>{spd25}</span>
                        <span className="text-[9px]" style={{ color: "#4A4440" }}>→</span>
                        <span className="text-[10px] font-mono font-semibold" style={{ color: spd26 > spd25 ? "#4CAF50" : "#EF5350", fontFamily: "var(--font-inter), monospace" }}>{spd26}</span>
                      </div>
                    </div>
                    <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "#2A2520" }}>
                      <div className="absolute inset-0 flex">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(spd25 / maxSpd) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                          className="h-full rounded-full" style={{ background: "#CC5533", opacity: 0.5 }} />
                      </div>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(spd26 / maxSpd) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.05 + 0.1 }}
                        className="absolute top-0 left-0 h-full rounded-full" style={{ background: spd26 > spd25 ? "#3671C6" : "#CC5533", opacity: 0.8 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2 rounded-sm" style={{ background: "#CC5533" }} /><span className="text-[9px]" style={{ color: "#6B6560" }}>2025</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2 rounded-sm" style={{ background: "#3671C6" }} /><span className="text-[9px]" style={{ color: "#6B6560" }}>2026</span></div>
            </div>
          </motion.div>
        )}

        {compView === "pu" && (
          <motion.div key="pu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-xs font-semibold mb-4" style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}>Power Unit Suppliers - What Changed</p>
            <div className="space-y-2">
              {ENGINE_CHANGES.puSuppliers.map((s) => (
                <div key={s.team} className="rounded-xl p-3" style={{ background: "#1A1714" }}>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: "#F8F5F0", fontFamily: "var(--font-inter), sans-serif" }}>{s.team}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: s.change === "new" ? "rgba(201,106,54,0.2)" : s.change === "upgraded" ? "rgba(54,113,198,0.2)" : "rgba(100,100,100,0.2)",
                        color: s.change === "new" ? "#C96A36" : s.change === "upgraded" ? "#3671C6" : "#6B6560",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}>
                      {s.change === "new" ? "New PU" : s.change === "upgraded" ? "Upgraded" : "Continued"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold" style={{ color: "#CC5533", fontFamily: "var(--font-inter), sans-serif" }}>{s.v2025}</span>
                    <span className="text-[9px]" style={{ color: "#4A4440" }}>→</span>
                    <span className="text-[10px] font-semibold" style={{ color: "#3671C6", fontFamily: "var(--font-inter), sans-serif" }}>{s.v2026}</span>
                  </div>
                  <p className="text-[9px]" style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>{s.note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function F1BarChartRace() {
  const [activeTab, setActiveTab] = useState<"2025" | "2026" | "compare">("2025");

  const tabs = [
    { key: "2025",    label: "🏎️ 2025 Season" },
    { key: "2026",    label: "🆕 2026 Season" },
    { key: "compare", label: "📊 Compare" },
  ] as const;

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#0F0D0B", border: "1px solid #2A2520" }}>
      {/* Top header */}
      <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1A17" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏎️</span>
          <span className="text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: "#6B6560", fontFamily: "var(--font-inter), sans-serif" }}>
            F1 Championship · Bar Chart Race
          </span>
        </div>
        <h3 className="text-xl font-light mb-4" style={{ color: "#F8F5F0", fontFamily: "var(--font-cormorant), serif" }}>
          {activeTab === "2025" ? "The Verstappen Comeback" : activeTab === "2026" ? "The Antonelli Era Begins" : "2025 vs 2026 - Regulation Shift"}
        </h3>

        {/* Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: activeTab === key ? (key === "2025" ? "#3671C6" : key === "2026" ? "#C96A36" : "#4A7C59") : "#2A2520",
                color: activeTab === key ? "#F8F5F0" : "#6B6560",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "2025" && (
          <motion.div key="2025" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <SeasonBarChart
              season={2025}
              drivers={DRIVERS}
              races={RACES}
              standings={STANDINGS_BY_RACE}
              narrativeColors={NARRATIVE_COLORS}
              highlightDriverId="VER"
              accentColor="#3671C6"
            />
          </motion.div>
        )}
        {activeTab === "2026" && (
          <motion.div key="2026" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <SeasonBarChart
              season={2026}
              drivers={DRIVERS_2026}
              races={RACES_2026}
              standings={STANDINGS_BY_RACE_2026}
              narrativeColors={NARRATIVE_COLORS_2026}
              highlightDriverId="ANT"
              accentColor="#27F4D2"
            />
          </motion.div>
        )}
        {activeTab === "compare" && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <CompareTab />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-5 py-3" style={{ borderTop: "1px solid #1E1A17" }}>
        <p className="text-[9px]" style={{ color: "#3C3530", fontFamily: "var(--font-inter), sans-serif" }}>
          {activeTab === "2026"
            ? "* 2026 data current to Round 5 (Canada, May 24). Sprint points not modelled. Race-only standings shown. Next race: Monaco, June 5-7."
            : "* Data reflects race wins, DNFs, standings progression, fastest laps, and top speeds per round."}
        </p>
      </div>
    </div>
  );
}
