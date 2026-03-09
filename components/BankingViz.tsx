"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { bankSnapshots, rateHistory, marketShareHistory, BANK_COLORS, rbaEvents } from "@/data/banking";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BANKS = ["CBA", "WBC", "ANZ", "NAB", "MAC"] as const;
type Bank = typeof BANKS[number];

const BANK_NAMES: Record<Bank, string> = { CBA: "CommBank", WBC: "Westpac", ANZ: "ANZ", NAB: "NAB", MAC: "Macquarie" };

export default function BankingViz() {
  const [activeTab, setActiveTab] = useState<"rates" | "market" | "snapshot">("rates");
  const [highlightBank, setHighlightBank] = useState<Bank | null>(null);

  const maxRate = Math.max(...rateHistory.map(d => Math.max(d.CBA, d.WBC, d.ANZ, d.NAB, d.MAC)));
  const minRate = 0;
  const rateRange = maxRate - minRate;

  // SVG chart dimensions
  const W = 600, H = 220, PAD = { t: 16, r: 20, b: 40, l: 36 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const xScale = (i: number) => PAD.l + (i / (rateHistory.length - 1)) * chartW;
  const yScale = (v: number) => PAD.t + chartH - ((v - minRate) / rateRange) * chartH;

  const buildPath = (bank: Bank) =>
    rateHistory.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d[bank])}`).join(" ");

  // Market share stacked bar
  const msMax = 100;
  const msKeys: Bank[] = ["CBA", "WBC", "ANZ", "NAB", "MAC"];

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "#0A0E14", border: "1px solid #21262D" }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6" style={{ background: "#111720", borderBottom: "1px solid #21262D" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>// banking.post_covid_analysis</p>
            <h3 className="text-xl font-semibold" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}>
              Big 4 + Macquarie — Post-COVID Rate Cycle & Deposit Share
            </h3>
            <p className="text-xs mt-1" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Source: APRA ADI Statistics · RBA Cash Rate Decisions · Bank product pages
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["rates", "market", "snapshot"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab ? "#00D9FF" : "rgba(0,217,255,0.08)",
                  color: activeTab === tab ? "#0A0E14" : "#8B949E",
                  fontFamily: "var(--font-mono), monospace",
                  border: `1px solid ${activeTab === tab ? "#00D9FF" : "rgba(0,217,255,0.2)"}`,
                }}>
                {tab === "rates" ? "savings_rates" : tab === "market" ? "deposit_share" : "q1_2025"}
              </button>
            ))}
          </div>
        </div>

        {/* Bank legend */}
        <div className="flex flex-wrap gap-4 mt-5">
          {BANKS.map(b => (
            <button key={b}
              onClick={() => setHighlightBank(highlightBank === b ? null : b)}
              className="flex items-center gap-2 transition-opacity"
              style={{ opacity: highlightBank && highlightBank !== b ? 0.3 : 1 }}>
              <div className="w-3 h-3 rounded-full" style={{ background: BANK_COLORS[b] }} />
              <span className="text-[11px]" style={{ color: "#8B949E", fontFamily: "var(--font-mono), monospace" }}>{BANK_NAMES[b]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">

        {/* Tab: Savings Rate Timeline */}
        {activeTab === "rates" && (
          <div>
            <p className="text-xs mb-4" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Best savings account rate (% p.a.) — Jan 2020 to Mar 2025. Click a bank above to isolate.
            </p>

            {/* RBA event badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {rbaEvents.map(ev => (
                <span key={ev.date} className="text-[9px] px-2 py-1 rounded-full"
                  style={{ background: "rgba(240,167,66,0.1)", color: "#F0A742", border: "1px solid rgba(240,167,66,0.2)", fontFamily: "var(--font-mono), monospace" }}>
                  {ev.date} — {ev.label}
                </span>
              ))}
            </div>

            {/* SVG Line chart */}
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 320 }}>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4, 5].map(v => (
                  <g key={v}>
                    <line x1={PAD.l} x2={W - PAD.r} y1={yScale(v)} y2={yScale(v)} stroke="#21262D" strokeWidth="1" />
                    <text x={PAD.l - 6} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#484F58" fontFamily="monospace">{v}%</text>
                  </g>
                ))}

                {/* RBA cash rate — dashed */}
                <path d={rateHistory.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.rbaCash)}`).join(" ")}
                  fill="none" stroke="#F0A742" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6" />

                {/* Bank lines */}
                {BANKS.map(b => {
                  const isHL = highlightBank === b;
                  const dimmed = highlightBank && !isHL;
                  return (
                    <motion.path key={b}
                      d={buildPath(b)}
                      fill="none"
                      stroke={BANK_COLORS[b]}
                      strokeWidth={isHL ? 2.5 : 1.5}
                      opacity={dimmed ? 0.15 : 1}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: EASE }}
                    />
                  );
                })}

                {/* X axis labels */}
                {rateHistory.filter((_, i) => i % 3 === 0).map((d, idx) => {
                  const i = rateHistory.indexOf(d);
                  return (
                    <text key={d.date} x={xScale(i)} y={H - PAD.b + 14} textAnchor="middle" fontSize="8" fill="#484F58" fontFamily="monospace">
                      {d.month}
                    </text>
                  );
                })}

                {/* RBA label */}
                <text x={xScale(rateHistory.length - 1) - 4} y={yScale(rateHistory[rateHistory.length - 1].rbaCash) - 6} fontSize="8" fill="#F0A742" fontFamily="monospace" textAnchor="end">RBA cash</text>
              </svg>
            </div>

            <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(0,217,255,0.04)", border: "1px solid rgba(0,217,255,0.1)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                <span style={{ color: "#00D9FF" }}>Key insight:</span> Macquarie consistently offered 50–80bps above Big 4, leveraging its challenger positioning to attract deposits.
                The Big 4 were slow to pass rate rises to savers (avg 3–4 month lag) but maintained their market dominance.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Market Share */}
        {activeTab === "market" && (
          <div>
            <p className="text-xs mb-6" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Household deposit market share (%) — APRA ADI Statistics. Macquarie gaining ground post-COVID.
            </p>
            <div className="space-y-4">
              {marketShareHistory.map((period, pi) => {
                let cumulative = 0;
                return (
                  <motion.div key={period.date}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: pi * 0.06, duration: 0.5, ease: EASE }}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] w-14 text-right flex-shrink-0" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>{period.date}</span>
                      <div className="flex-1 h-8 rounded-xl overflow-hidden flex">
                        {msKeys.map(b => {
                          const val = period[b];
                          const dimmed = highlightBank && highlightBank !== b;
                          cumulative += val;
                          return (
                            <motion.div key={b}
                              style={{
                                width: `${val}%`,
                                background: BANK_COLORS[b],
                                opacity: dimmed ? 0.2 : 1,
                                transition: "opacity 0.2s",
                              }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${val}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.0, delay: pi * 0.06, ease: EASE }}
                              title={`${BANK_NAMES[b]}: ${val}%`}
                            />
                          );
                        })}
                      </div>
                      {/* Macquarie share callout */}
                      <span className="text-[10px] flex-shrink-0" style={{ color: "#00D9FF", fontFamily: "var(--font-mono), monospace" }}>
                        MAC: {period.MAC}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(0,217,255,0.04)", border: "1px solid rgba(0,217,255,0.1)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                <span style={{ color: "#00D9FF" }}>Macquarie effect:</span> By consistently offering higher deposit rates, Macquarie grew household deposit share from
                ~1.8% (2020) to ~4.2% (2025) — a +133% relative gain — while Big 4 collectively ceded ~2.5 percentage points.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Snapshot */}
        {activeTab === "snapshot" && (
          <div>
            <p className="text-xs mb-6" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Current rates snapshot — Q1 2025. RBA cash rate: 4.10% (cut Feb 2025)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {["Bank", "Savings Rate", "12m Term", "Var. Mortgage", "Deposit Share", "Total Deposits"].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-[10px]"
                        style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace", borderBottom: "1px solid #21262D", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bankSnapshots.map((b, i) => {
                    const isHighlighted = !highlightBank || highlightBank === b.shortName;
                    return (
                      <motion.tr key={b.shortName}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                        style={{ opacity: isHighlighted ? 1 : 0.25, transition: "opacity 0.2s" }}>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                            <span style={{ color: "#E6EDF3", fontFamily: "var(--font-inter), sans-serif", fontWeight: 500 }}>{b.shortName}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span style={{ color: "#3FB950", fontFamily: "var(--font-mono), monospace", fontWeight: 600 }}>{b.savings.toFixed(2)}%</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span style={{ color: "#8B949E", fontFamily: "var(--font-mono), monospace" }}>{b.term12m.toFixed(2)}%</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span style={{ color: "#F0A742", fontFamily: "var(--font-mono), monospace" }}>{b.mortgage.toFixed(2)}%</span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 rounded-full overflow-hidden w-16" style={{ background: "#21262D" }}>
                              <div className="h-full rounded-full" style={{ background: b.color, width: `${(b.marketShare / 30) * 100}%` }} />
                            </div>
                            <span style={{ color: "#8B949E", fontFamily: "var(--font-mono), monospace" }}>{b.marketShare}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>A${b.depositsBn}B</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(240,167,66,0.05)", border: "1px solid rgba(240,167,66,0.15)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#8B949E", fontFamily: "var(--font-inter), sans-serif" }}>
                <span style={{ color: "#F0A742" }}>Feb 2025:</span> RBA cut the cash rate by 25bps to 4.10% — the first cut since Nov 2020.
                Macquarie leads on both savings (5.35%) and term deposit (5.05%) rates, with CBA maintaining
                27.4% deposit market share despite higher-rate competition from challengers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
