// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmissionsPoint {
  year: number;
  total: number; // Mt CO2-e (all GHGs)
}

export interface SectorPoint {
  year: number;
  electricity: number; // Mt CO2-e
  transport: number;
  fugitive: number;    // oil/gas/coal-mine methane
  agriculture: number;
  industry: number;    // manufacturing + construction
  other: number;       // buildings, waste, LULUCF net
}

export interface EVPoint {
  year: number;
  sales: number;      // annual new EV sales
  shareOfNew: number; // % of new car sales that were EV
}

// ─── Targets ──────────────────────────────────────────────────────────────────

export const TARGETS = {
  baseline2005:    601.6, // Mt CO2-e — legislated 2030 reference year
  target2030:      342.9, // 43% below 2005 baseline (Climate Change Act 2022)
  renewables2030:  82,    // % electricity from renewables (AER commitment)
  netZeroYear:     2050,
};

// ─── Last updated — overwritten by fetch script ───────────────────────────────
// AUTO-UPDATED
export const LAST_UPDATED = "2026-07-01";

// ─── Historical total emissions ───────────────────────────────────────────────
// Source: DCCEEW National Greenhouse Gas Inventory Quarterly Update
// Script refreshes this from Our World in Data (OWID) owid-co2-data.csv
// AUTO-UPDATED
export const EMISSIONS_HISTORY: EmissionsPoint[] = [
  { year: 1990, total: 538.5 },
  { year: 1991, total: 522.5 },
  { year: 1992, total: 569.0 },
  { year: 1993, total: 580.7 },
  { year: 1994, total: 554.1 },
  { year: 1995, total: 672.7 },
  { year: 1996, total: 677.2 },
  { year: 1997, total: 649.4 },
  { year: 1998, total: 705.6 },
  { year: 1999, total: 710.7 },
  { year: 2000, total: 771.4 },
  { year: 2001, total: 736.1 },
  { year: 2002, total: 700.2 },
  { year: 2003, total: 734.6 },
  { year: 2004, total: 761.9 },
  { year: 2005, total: 637.5 },
  { year: 2006, total: 662.8 },
  { year: 2007, total: 697.4 },
  { year: 2008, total: 797.3 },
  { year: 2009, total: 709.3 },
  { year: 2010, total: 908.2 },
  { year: 2011, total: 868.7 },
  { year: 2012, total: 796.3 },
  { year: 2013, total: 693.8 },
  { year: 2014, total: 671.2 },
  { year: 2015, total: 638.0 },
  { year: 2016, total: 677.4 },
  { year: 2017, total: 716.3 },
  { year: 2018, total: 681.1 },
  { year: 2019, total: 645.7 },
  { year: 2020, total: 637.9 },
  { year: 2021, total: 626.0 },
  { year: 2022, total: 609.0 },
  { year: 2023, total: 611.5 },
  { year: 2024, total: 609.9 },
  { year: 2026, total: 415.0 },
  { year: 2028, total: 378.0 },
  { year: 2030, total: 342.9 },
  { year: 2035, total: 240.0 },
  { year: 2040, total: 135.0 },
  { year: 2045, total: 55.0 },
  { year: 2050, total: 0.0 },
];

// ─── Projected trajectories ───────────────────────────────────────────────────

export const PROJECTED_BAU: EmissionsPoint[] = [
  { year: 2024, total: 448.0 },
  { year: 2026, total: 441.0 },
  { year: 2028, total: 436.0 },
  { year: 2030, total: 432.0 }, // business-as-usual — misses 43% target by ~90 Mt
  { year: 2035, total: 418.0 },
  { year: 2040, total: 398.0 },
  { year: 2045, total: 375.0 },
  { year: 2050, total: 348.0 }, // nowhere near net zero
];

export const PROJECTED_POLICY: EmissionsPoint[] = [
  { year: 2024, total: 448.0 },
  { year: 2026, total: 415.0 },
  { year: 2028, total: 378.0 },
  { year: 2030, total: 342.9 }, // hits 43% target
  { year: 2035, total: 240.0 },
  { year: 2040, total: 135.0 },
  { year: 2045, total: 55.0 },
  { year: 2050, total: 0 },     // net zero
];

// ─── Sector breakdown ─────────────────────────────────────────────────────────
// Source: DCCEEW Quarterly Update — sector breakdown by economic category
// Electricity declining rapidly; transport stubbornly flat until EV inflection
export const SECTOR_DATA: SectorPoint[] = [
  { year: 1990, electricity: 180, transport: 70,  fugitive: 88,  agriculture: 100, industry: 65,  other: 54 },
  { year: 1995, electricity: 195, transport: 76,  fugitive: 90,  agriculture: 98,  industry: 65,  other: 48 },
  { year: 2000, electricity: 200, transport: 82,  fugitive: 86,  agriculture: 95,  industry: 62,  other: 47 },
  { year: 2005, electricity: 220, transport: 90,  fugitive: 88,  agriculture: 93,  industry: 67,  other: 44 },
  { year: 2007, electricity: 232, transport: 94,  fugitive: 90,  agriculture: 92,  industry: 69,  other: 41 },
  { year: 2010, electricity: 218, transport: 96,  fugitive: 86,  agriculture: 90,  industry: 63,  other: 39 },
  { year: 2015, electricity: 196, transport: 98,  fugitive: 82,  agriculture: 88,  industry: 55,  other: 38 },
  { year: 2019, electricity: 178, transport: 103, fugitive: 96,  agriculture: 85,  industry: 52,  other: 37 },
  { year: 2020, electricity: 162, transport: 90,  fugitive: 96,  agriculture: 84,  industry: 49,  other: 35 },
  { year: 2021, electricity: 155, transport: 93,  fugitive: 95,  agriculture: 84,  industry: 48,  other: 35 },
  { year: 2022, electricity: 148, transport: 96,  fugitive: 93,  agriculture: 82,  industry: 46,  other: 34 },
  { year: 2023, electricity: 140, transport: 88,  fugitive: 92,  agriculture: 81,  industry: 45,  other: 33 },
  { year: 2024, electricity: 130, transport: 87,  fugitive: 90,  agriculture: 80,  industry: 44,  other: 32 },
];

// ─── EV adoption ──────────────────────────────────────────────────────────────
// Source: FCAI VFACTS annual reports
// AUTO-UPDATED (script attempts to parse VFACTS data)
export const EV_DATA: EVPoint[] = [
  { year: 2019, sales: 6718,   shareOfNew: 0.6 },
  { year: 2020, sales: 6900,   shareOfNew: 0.7 },
  { year: 2021, sales: 20665,  shareOfNew: 1.9 },
  { year: 2022, sales: 33410,  shareOfNew: 3.8 },
  { year: 2023, sales: 98539,  shareOfNew: 8.4 },
  { year: 2024, sales: 110000, shareOfNew: 9.8 },
];

// Projected EV uptake + resulting transport emissions bend
export const EV_PROJECTED: { year: number; sales: number; transportEmissions: number }[] = [
  { year: 2024, sales: 110000, transportEmissions: 87 },
  { year: 2025, sales: 145000, transportEmissions: 85 },
  { year: 2026, sales: 185000, transportEmissions: 82 },
  { year: 2027, sales: 230000, transportEmissions: 78 },
  { year: 2028, sales: 285000, transportEmissions: 73 },
  { year: 2029, sales: 340000, transportEmissions: 67 },
  { year: 2030, sales: 400000, transportEmissions: 60 },
];

// ─── Industry commitments (narrative cards) ───────────────────────────────────
export const INDUSTRY_PLEDGES = [
  { sector: "Electricity",  icon: "⚡", color: "#F59E0B", pledge: "82% renewables by 2030 — AEMO tracking ahead of schedule. 6.4 GW solar/wind added in 2023." },
  { sector: "Transport",    icon: "🚗", color: "#3B82F6", pledge: "Fuel efficiency standards from Jan 2025. EV sales up 195% in 2023. Fleet electrification lag ~7 yrs." },
  { sector: "Mining",       icon: "⛏️", color: "#8B5CF6", pledge: "BHP, Rio Tinto net-zero pledges by 2050. Scope 3 (customer burn) excluded — the contested frontier." },
  { sector: "Agriculture",  icon: "🌾", color: "#10B981", pledge: "Emissions Reduction Fund soil carbon projects. Methane from livestock hardest to abate technically." },
  { sector: "Industry",     icon: "🏭", color: "#F97316", pledge: "Green steel pilots (Whyalla). Hydrogen Headstart program. High-temp heat still largely fossil-fuel." },
];
