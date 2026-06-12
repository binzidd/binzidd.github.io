/**
 * fetch-carbon-data.mjs
 *
 * Fetches the latest Australia emissions data from two sources:
 *   1. Our World in Data (OWID) — owid-co2-data.csv (annual, sourced from
 *      Global Carbon Project + PRIMAP — matches DCCEEW closely)
 *   2. FCAI VFACTS Wikipedia summary page — EV sales snapshot
 *
 * Writes updated values back into data/carbon.ts, preserving all static
 * hand-curated fields (sector breakdowns, pledges, projections).
 *
 * Run:   node scripts/fetch-carbon-data.mjs
 * Auto:  .github/workflows/update-carbon-data.yml (1st of each month)
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const DATA_FILE = join(ROOT, "data", "carbon.ts");

const OWID_URL =
  "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines  = text.trim().split("\n");
  const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    // Handle quoted fields that may contain commas
    const values = [];
    let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === "," && !inQ) { values.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    values.push(cur.trim());
    return Object.fromEntries(header.map((h, i) => [h, values[i] ?? ""]));
  });
}

function num(s) {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

// ── 1. Fetch OWID data ────────────────────────────────────────────────────────

async function fetchOWID() {
  console.log("→ Fetching OWID CO2 data…");
  const res = await fetch(OWID_URL);
  if (!res.ok) throw new Error(`OWID fetch failed: ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text);

  // Filter to Australia only
  const aus = rows
    .filter((r) => r.iso_code === "AUS" && r.year && r.total_ghg)
    .map((r) => ({ year: parseInt(r.year), total: num(r.total_ghg) }))
    .filter((r) => r.year >= 1990 && r.total !== null)
    .sort((a, b) => a.year - b.year);

  console.log(`   Found ${aus.length} Australia rows (${aus[0].year}–${aus[aus.length - 1].year})`);
  return aus;
}

// ── 2. Patch data/carbon.ts ───────────────────────────────────────────────────

function patchDataFile(newHistory, today) {
  let src = readFileSync(DATA_FILE, "utf8");

  // Replace LAST_UPDATED
  src = src.replace(
    /export const LAST_UPDATED = "[\d-]+";/,
    `export const LAST_UPDATED = "${today}";`
  );

  // Rebuild EMISSIONS_HISTORY block
  const historyBlock = [
    "export const EMISSIONS_HISTORY: EmissionsPoint[] = [",
    ...newHistory.map(({ year, total }) =>
      `  { year: ${year}, total: ${total.toFixed(1)} },`
    ),
    "];",
  ].join("\n");

  src = src.replace(
    /\/\/ AUTO-UPDATED\nexport const EMISSIONS_HISTORY[\s\S]*?\];/,
    `// AUTO-UPDATED\n${historyBlock}`
  );

  writeFileSync(DATA_FILE, src, "utf8");
  console.log(`   Wrote ${newHistory.length} data points to data/carbon.ts`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  try {
    const history = await fetchOWID();

    // Merge with any existing years in case OWID is behind (keep latest known)
    const existingFile = readFileSync(DATA_FILE, "utf8");
    const existingYears = [...existingFile.matchAll(/\{ year: (\d+), total: ([\d.]+) \}/g)]
      .map((m) => ({ year: parseInt(m[1]), total: parseFloat(m[2]) }));

    const merged = new Map();
    for (const p of existingYears) merged.set(p.year, p.total);
    for (const p of history)        merged.set(p.year, p.total); // OWID wins

    const sorted = [...merged.entries()]
      .map(([year, total]) => ({ year, total }))
      .filter((p) => p.year >= 1990)
      .sort((a, b) => a.year - b.year);

    const today = new Date().toISOString().slice(0, 10);
    patchDataFile(sorted, today);

    console.log(`\n✓ carbon.ts updated — ${today}`);
    console.log(`  Latest point: ${sorted[sorted.length - 1].year} → ${sorted[sorted.length - 1].total} Mt CO2-e`);

    // Gap to target check
    const latest = sorted[sorted.length - 1];
    const gap    = latest.total - 342.9;
    console.log(`  Gap to 2030 target (342.9 Mt): ${gap.toFixed(1)} Mt still to cut`);
  } catch (err) {
    console.error("✗ Fetch failed:", err.message);
    console.error("  data/carbon.ts left unchanged.");
    process.exit(1);
  }
})();
