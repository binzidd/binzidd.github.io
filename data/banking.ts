// Australian banking interest rates & deposit market share data
// Sources: APRA ADI Statistics, RBA cash rate decisions, bank product pages
// Post-COVID rate cycle: near-zero 2020–2022 → aggressive hikes 2022–2023 → hold → cut Feb 2025

export interface BankRateSnapshot {
  bank: string;
  shortName: string;
  color: string;
  savings: number;       // Best savings/high-interest rate (%)
  term12m: number;       // 12-month term deposit rate (%)
  mortgage: number;      // Standard variable home loan rate (%)
  marketShare: number;   // % of total household deposits (APRA)
  depositsBn: number;    // AUD billion household deposits (APRA estimate)
}

export interface RateHistory {
  month: string;
  date: string;
  CBA: number;
  WBC: number;
  ANZ: number;
  NAB: number;
  MAC: number;
  rbaCash: number;
}

// Snapshot: Q1 2025 (post-first-RBA-cut environment)
export const bankSnapshots: BankRateSnapshot[] = [
  { bank: "Commonwealth Bank", shortName: "CBA", color: "#FFD700", savings: 5.10, term12m: 4.80, mortgage: 6.34, marketShare: 27.4, depositsBn: 312 },
  { bank: "Westpac",           shortName: "WBC", color: "#C0392B", savings: 5.00, term12m: 4.75, mortgage: 6.29, marketShare: 20.1, depositsBn: 229 },
  { bank: "ANZ",               shortName: "ANZ", color: "#007DBB", savings: 5.00, term12m: 4.70, mortgage: 6.24, marketShare: 17.8, depositsBn: 203 },
  { bank: "NAB",               shortName: "NAB", color: "#E8002D", savings: 5.25, term12m: 4.85, mortgage: 6.44, marketShare: 16.3, depositsBn: 186 },
  { bank: "Macquarie",         shortName: "MAC", color: "#00D9FF", savings: 5.35, term12m: 5.05, mortgage: 6.14, marketShare: 4.2,  depositsBn: 48  },
];

// Monthly savings rate history (best advertised savings account rate)
// Covers the full post-COVID cycle: emergency cut → near-zero → hike → hold → cut
export const rateHistory: RateHistory[] = [
  // Pre-COVID baseline
  { month: "Jan 20", date: "2020-01", CBA: 1.50, WBC: 1.45, ANZ: 1.35, NAB: 1.55, MAC: 2.00, rbaCash: 0.75 },
  // COVID emergency cuts (RBA to 0.10% in Nov 2020)
  { month: "May 20", date: "2020-05", CBA: 0.50, WBC: 0.45, ANZ: 0.40, NAB: 0.55, MAC: 0.85, rbaCash: 0.25 },
  { month: "Nov 20", date: "2020-11", CBA: 0.25, WBC: 0.25, ANZ: 0.20, NAB: 0.30, MAC: 0.55, rbaCash: 0.10 },
  // Near-zero era — savers earning almost nothing
  { month: "Jun 21", date: "2021-06", CBA: 0.25, WBC: 0.25, ANZ: 0.20, NAB: 0.30, MAC: 0.65, rbaCash: 0.10 },
  { month: "Dec 21", date: "2021-12", CBA: 0.30, WBC: 0.30, ANZ: 0.25, NAB: 0.35, MAC: 0.75, rbaCash: 0.10 },
  // RBA begins hiking (May 2022 — first hike in 11 years)
  { month: "May 22", date: "2022-05", CBA: 0.55, WBC: 0.55, ANZ: 0.50, NAB: 0.65, MAC: 1.20, rbaCash: 0.35 },
  { month: "Aug 22", date: "2022-08", CBA: 1.80, WBC: 1.60, ANZ: 1.50, NAB: 1.85, MAC: 2.50, rbaCash: 1.85 },
  { month: "Nov 22", date: "2022-11", CBA: 2.80, WBC: 2.60, ANZ: 2.50, NAB: 2.85, MAC: 3.50, rbaCash: 2.85 },
  // Aggressive hike cycle continues
  { month: "Mar 23", date: "2023-03", CBA: 4.00, WBC: 3.85, ANZ: 3.75, NAB: 4.10, MAC: 4.50, rbaCash: 3.60 },
  { month: "Jun 23", date: "2023-06", CBA: 4.40, WBC: 4.25, ANZ: 4.10, NAB: 4.50, MAC: 5.00, rbaCash: 4.10 },
  // RBA pauses — rates hold
  { month: "Sep 23", date: "2023-09", CBA: 4.55, WBC: 4.40, ANZ: 4.30, NAB: 4.65, MAC: 5.20, rbaCash: 4.10 },
  { month: "Dec 23", date: "2023-12", CBA: 4.65, WBC: 4.50, ANZ: 4.40, NAB: 4.75, MAC: 5.25, rbaCash: 4.35 },
  // One more hike (Nov 2023), then hold throughout 2024
  { month: "Apr 24", date: "2024-04", CBA: 4.90, WBC: 4.70, ANZ: 4.65, NAB: 4.95, MAC: 5.35, rbaCash: 4.35 },
  { month: "Sep 24", date: "2024-09", CBA: 5.00, WBC: 4.85, ANZ: 4.80, NAB: 5.10, MAC: 5.35, rbaCash: 4.35 },
  { month: "Dec 24", date: "2024-12", CBA: 5.10, WBC: 5.00, ANZ: 5.00, NAB: 5.25, MAC: 5.35, rbaCash: 4.35 },
  // RBA first cut (Feb 2025)
  { month: "Mar 25", date: "2025-03", CBA: 5.10, WBC: 5.00, ANZ: 5.00, NAB: 5.25, MAC: 5.35, rbaCash: 4.10 },
];

// Market share shift over time (APRA ADI monthly banking statistics — household deposits)
export interface MarketSharePoint {
  date: string;
  CBA: number;
  WBC: number;
  ANZ: number;
  NAB: number;
  MAC: number;
}

export const marketShareHistory: MarketSharePoint[] = [
  { date: "Jun 20", CBA: 28.2, WBC: 21.8, ANZ: 18.9, NAB: 16.8, MAC: 1.8 },
  { date: "Dec 20", CBA: 28.0, WBC: 21.5, ANZ: 18.7, NAB: 16.7, MAC: 2.0 },
  { date: "Jun 21", CBA: 27.9, WBC: 21.4, ANZ: 18.6, NAB: 16.7, MAC: 2.2 },
  { date: "Dec 21", CBA: 27.8, WBC: 21.3, ANZ: 18.5, NAB: 16.6, MAC: 2.5 },
  { date: "Jun 22", CBA: 27.8, WBC: 21.2, ANZ: 18.5, NAB: 16.6, MAC: 2.9 },
  { date: "Dec 22", CBA: 27.6, WBC: 21.0, ANZ: 18.2, NAB: 16.5, MAC: 3.2 },
  { date: "Jun 23", CBA: 27.5, WBC: 20.8, ANZ: 18.0, NAB: 16.4, MAC: 3.6 },
  { date: "Dec 23", CBA: 27.4, WBC: 20.4, ANZ: 17.9, NAB: 16.3, MAC: 3.9 },
  { date: "Jun 24", CBA: 27.3, WBC: 20.2, ANZ: 17.8, NAB: 16.2, MAC: 4.1 },
  { date: "Dec 24", CBA: 27.4, WBC: 20.1, ANZ: 17.8, NAB: 16.3, MAC: 4.2 },
];

export const BANK_COLORS: Record<string, string> = {
  CBA: "#FFD700",
  WBC: "#C0392B",
  ANZ: "#007DBB",
  NAB: "#E8002D",
  MAC: "#00D9FF",
};

// Key RBA events for annotation
export const rbaEvents = [
  { date: "2020-03", label: "COVID rate cut", rate: 0.50 },
  { date: "2020-11", label: "0.10% — historic low", rate: 0.10 },
  { date: "2022-05", label: "First hike in 11 yrs", rate: 0.35 },
  { date: "2023-06", label: "Rate peak 4.35%", rate: 4.10 },
  { date: "2025-02", label: "First cut — Feb 2025", rate: 4.10 },
];
