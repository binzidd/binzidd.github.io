// ─── Australian Federal Budget 2024-25 ────────────────────────────────────────
// Source: Budget Paper No.1 2024-25 (MYEFO), ATO Statistics
// All values in $B (billion AUD)

export interface BudgetNode {
  id: string;
  label: string;
  sublabel?: string;    // e.g. "28.4% of total"
  value: number;        // $B
  column: 0 | 1 | 2 | 3;
  color: string;
}

export interface BudgetLink {
  source: string;
  target: string;
  value: number;
}

export const TOTAL = 738.5; // $B total budget

// ─── Level 0 — Revenue Buckets ────────────────────────────────────────────────
const L0: BudgetNode[] = [
  { id: "l0-tax",     label: "Taxation Revenue",   sublabel: "$638.5B",  value: 638.5, column: 0, color: "#00FF41" },
  { id: "l0-nontax",  label: "Non-Tax Revenue",     sublabel: "$41.4B",   value:  41.4, column: 0, color: "#008F11" },
  { id: "l0-borrow",  label: "Net Borrowing",        sublabel: "$58.6B",   value:  58.6, column: 0, color: "#FF6B6B" },
];

// ─── Level 1 — Revenue Sources ────────────────────────────────────────────────
const L1: BudgetNode[] = [
  { id: "income-tax",   label: "Individual Income Tax", sublabel: "$347.6B · 47.1%",  value: 347.6, column: 1, color: "#F0A742" },
  { id: "company-tax",  label: "Company Tax",            sublabel: "$125.3B · 17.0%",  value: 125.3, column: 1, color: "#00FF41" },
  { id: "gst",          label: "GST",                    sublabel: "$89.6B · 12.1%",   value:  89.6, column: 1, color: "#7C3AED" },
  { id: "other-tax",    label: "Other Taxes & Super",    sublabel: "$75.9B · 10.3%",   value:  75.9, column: 1, color: "#3FB950" },
  { id: "non-tax",      label: "Non-Tax Revenue",        sublabel: "$41.4B · 5.6%",    value:  41.4, column: 1, color: "#8B949E" },
  { id: "borrowing",    label: "Net Borrowing",           sublabel: "$58.6B · 7.9%",    value:  58.6, column: 1, color: "#FF6B6B" },
];

// ─── Level 2 — Spending Portfolios ────────────────────────────────────────────
const L2: BudgetNode[] = [
  { id: "social",    label: "Social Protection",       sublabel: "$209.5B · 28.4%", value: 209.5, column: 2, color: "#F0A742" },
  { id: "health",    label: "Health",                  sublabel: "$113.5B · 15.4%", value: 113.5, column: 2, color: "#E57373" },
  { id: "education", label: "Education & Training",    sublabel: "$52.8B · 7.2%",   value:  52.8, column: 2, color: "#4FC3F7" },
  { id: "defence",   label: "Defence & Security",      sublabel: "$54.3B · 7.4%",   value:  54.3, column: 2, color: "#66BB6A" },
  { id: "debt",      label: "Debt Servicing",          sublabel: "$35.8B · 4.9%",   value:  35.8, column: 2, color: "#FF6B6B" },
  { id: "govt",      label: "General Government",      sublabel: "$43.2B · 5.9%",   value:  43.2, column: 2, color: "#AB47BC" },
  { id: "other-sp",  label: "Other Programs",          sublabel: "$229.4B · 31.1%", value: 229.4, column: 2, color: "#78909C" },
];

// ─── Level 3 — Sub-Programs ───────────────────────────────────────────────────
const L3: BudgetNode[] = [
  // Social Protection breakdown
  { id: "pension",    label: "Age Pension",         sublabel: "$59.2B", value:  59.2, column: 3, color: "#F0A742" },
  { id: "ndis",       label: "NDIS",                sublabel: "$42.7B", value:  42.7, column: 3, color: "#FFC107" },
  { id: "jobseeker",  label: "JobSeeker & DSP",     sublabel: "$30.1B", value:  30.1, column: 3, color: "#FFD54F" },
  { id: "family",     label: "Family Payments",     sublabel: "$22.4B", value:  22.4, column: 3, color: "#FFE082" },
  { id: "welfare-oth",label: "Other Welfare",       sublabel: "$55.1B", value:  55.1, column: 3, color: "#FFF3E0" },

  // Health breakdown
  { id: "medicare",   label: "Medicare",            sublabel: "$33.0B", value:  33.0, column: 3, color: "#E57373" },
  { id: "hospitals",  label: "Hospital Funding",    sublabel: "$30.8B", value:  30.8, column: 3, color: "#EF9A9A" },
  { id: "pbs",        label: "PBS (Medicines)",     sublabel: "$17.2B", value:  17.2, column: 3, color: "#FFCDD2" },
  { id: "health-oth", label: "Other Health",        sublabel: "$32.5B", value:  32.5, column: 3, color: "#FFEBEE" },

  // Education breakdown
  { id: "schools",    label: "Schools",             sublabel: "$28.5B", value:  28.5, column: 3, color: "#4FC3F7" },
  { id: "uni",        label: "Universities",        sublabel: "$14.3B", value:  14.3, column: 3, color: "#81D4FA" },
  { id: "vet",        label: "VET & Skills",        sublabel: "$10.0B", value:  10.0, column: 3, color: "#B3E5FC" },

  // Defence breakdown
  { id: "military",   label: "Military Ops",        sublabel: "$35.0B", value:  35.0, column: 3, color: "#66BB6A" },
  { id: "capability", label: "Capability & AUKUS",  sublabel: "$19.3B", value:  19.3, column: 3, color: "#A5D6A7" },

  // Debt
  { id: "debt-int",   label: "Interest Payments",   sublabel: "$35.8B", value:  35.8, column: 3, color: "#FF6B6B" },

  // General Government
  { id: "govt-svc",   label: "Public Services",     sublabel: "$43.2B", value:  43.2, column: 3, color: "#CE93D8" },

  // Other Programs
  { id: "infra",      label: "Infrastructure",      sublabel: "$15.5B", value:  15.5, column: 3, color: "#78909C" },
  { id: "industry",   label: "Industry & Energy",   sublabel: "$22.1B", value:  22.1, column: 3, color: "#90A4AE" },
  { id: "housing",    label: "Housing",             sublabel: "$8.2B",  value:   8.2, column: 3, color: "#B0BEC5" },
  { id: "programs-ot",label: "Other Spending",      sublabel: "$183.6B",value: 183.6, column: 3, color: "#CFD8DC" },
];

export const nodes: BudgetNode[] = [...L0, ...L1, ...L2, ...L3];

// ─── Links ────────────────────────────────────────────────────────────────────
// L0 → L1: tax bucket → individual tax sources
const l0l1Links: BudgetLink[] = [
  { source: "l0-tax",    target: "income-tax",  value: 347.6 },
  { source: "l0-tax",    target: "company-tax", value: 125.3 },
  { source: "l0-tax",    target: "gst",         value:  89.6 },
  { source: "l0-tax",    target: "other-tax",   value:  75.9 },
  { source: "l0-nontax", target: "non-tax",     value:  41.4 },
  { source: "l0-borrow", target: "borrowing",   value:  58.6 },
];

// L1 → L2: each revenue source flows proportionally to each spending portfolio
function proportionalLinks(
  sources: BudgetNode[],
  targets: BudgetNode[],
  total: number
): BudgetLink[] {
  const links: BudgetLink[] = [];
  for (const src of sources) {
    for (const tgt of targets) {
      const value = (src.value / total) * tgt.value;
      if (value > 0.05) links.push({ source: src.id, target: tgt.id, value });
    }
  }
  return links;
}

const l1l2Links = proportionalLinks(L1, L2, TOTAL);

// L2 → L3: each portfolio fans out to its sub-programs
const l2l3Links: BudgetLink[] = [
  // Social Protection
  { source: "social", target: "pension",     value:  59.2 },
  { source: "social", target: "ndis",        value:  42.7 },
  { source: "social", target: "jobseeker",   value:  30.1 },
  { source: "social", target: "family",      value:  22.4 },
  { source: "social", target: "welfare-oth", value:  55.1 },
  // Health
  { source: "health", target: "medicare",    value:  33.0 },
  { source: "health", target: "hospitals",   value:  30.8 },
  { source: "health", target: "pbs",         value:  17.2 },
  { source: "health", target: "health-oth",  value:  32.5 },
  // Education
  { source: "education", target: "schools",  value:  28.5 },
  { source: "education", target: "uni",      value:  14.3 },
  { source: "education", target: "vet",      value:  10.0 },
  // Defence
  { source: "defence", target: "military",   value:  35.0 },
  { source: "defence", target: "capability", value:  19.3 },
  // Debt
  { source: "debt", target: "debt-int",      value:  35.8 },
  // General Government
  { source: "govt", target: "govt-svc",      value:  43.2 },
  // Other Programs
  { source: "other-sp", target: "infra",     value:  15.5 },
  { source: "other-sp", target: "industry",  value:  22.1 },
  { source: "other-sp", target: "housing",   value:   8.2 },
  { source: "other-sp", target: "programs-ot", value: 183.6 },
];

export const links: BudgetLink[] = [...l0l1Links, ...l1l2Links, ...l2l3Links];

// ─── "You Are Here" — Avg Australian taxpayer ─────────────────────────────────
export const TAXPAYER_COUNT = 14_700_000; // approx individual income tax payers
export const AVG_TAX = Math.round((347.6e9) / TAXPAYER_COUNT); // ~$23,646

// How much of each L2 portfolio comes from one avg taxpayer's income tax
export function yourShare(portfolioValue: number): number {
  return Math.round(AVG_TAX * (portfolioValue / TOTAL));
}

export const yourBreakdown = L2.map((n) => ({
  id: n.id,
  label: n.label,
  color: n.color,
  value: yourShare(n.value),
}));
