import type { StandingsEntry } from "./f1-2025";

export interface Driver2026 {
  id: string;
  name: string;
  short: string;
  team: string;
  teamShort: string;
  color: string;
  flag: string;
  puSupplier: string;
  isLead?: boolean;
}

export interface Race2026 {
  round: number;
  name: string;
  flag: string;
  date: string;
  circuit: string;
  narrative: string;
  narrativePhase: "reset" | "surge" | "challenge" | "fight" | "momentum" | "revelation";
  leadMoment?: string;
  winner: string;
  fastestLap: { driverId: string; time: string };
  topSpeed: { driverId: string; kmh: number };
  engineNote: string;
}

// ─── Drivers 2026 - new lineups after regulation reset ──────────────────────
export const DRIVERS_2026: Driver2026[] = [
  { id: "NOR", name: "Lando Norris",     short: "NOR", team: "McLaren",        teamShort: "McLaren",     color: "#FF8000", flag: "🇬🇧", puSupplier: "Mercedes",  isLead: true },
  { id: "HAM", name: "Lewis Hamilton",   short: "HAM", team: "Ferrari",        teamShort: "Ferrari",     color: "#E8002D", flag: "🇬🇧", puSupplier: "Ferrari"  },
  { id: "VER", name: "Max Verstappen",   short: "VER", team: "Red Bull",       teamShort: "Red Bull",    color: "#3671C6", flag: "🇳🇱", puSupplier: "Ford/RBPT" },
  { id: "LEC", name: "Charles Leclerc", short: "LEC", team: "Ferrari",        teamShort: "Ferrari",     color: "#E8002D", flag: "🇲🇨", puSupplier: "Ferrari"  },
  { id: "PIA", name: "Oscar Piastri",    short: "PIA", team: "McLaren",        teamShort: "McLaren",     color: "#FF8000", flag: "🇦🇺", puSupplier: "Mercedes" },
  { id: "RUS", name: "George Russell",   short: "RUS", team: "Mercedes",       teamShort: "Mercedes",    color: "#27F4D2", flag: "🇬🇧", puSupplier: "Mercedes" },
  { id: "ALO", name: "Fernando Alonso",  short: "ALO", team: "Aston Martin",   teamShort: "Aston",       color: "#229971", flag: "🇪🇸", puSupplier: "Honda"    },
  { id: "ANT", name: "Kimi Antonelli",   short: "ANT", team: "Mercedes",       teamShort: "Mercedes",    color: "#27F4D2", flag: "🇮🇹", puSupplier: "Mercedes" },
];

// ─── 2026 Race Calendar (rounds 1–8, season in progress as of May 2026) ─────
export const RACES_2026: Race2026[] = [
  {
    round: 1,  name: "Australia",    flag: "🇦🇺", date: "Mar 15",  circuit: "Melbourne",
    winner: "NOR",
    fastestLap: { driverId: "NOR", time: "1:19.783" },
    topSpeed:   { driverId: "VER", kmh: 326 },
    narrative: "The 2026 reset is here. McLaren-Mercedes arrives with the fastest package. Norris leads lights-to-flag. Hamilton impresses on his Ferrari debut - P2. VER P7 as RBPT Ford PU needs time.",
    narrativePhase: "reset",
    leadMoment: "🏆 NOR wins - championship lead from Rd 1",
    engineNote: "X-Mode active aero makes the new cars visibly faster in sectors 1 & 3. RBPT-Ford PU 8% down on power vs Mercedes - calibration incomplete.",
  },
  {
    round: 2,  name: "China",        flag: "🇨🇳", date: "Mar 22",  circuit: "Shanghai",
    winner: "HAM",
    fastestLap: { driverId: "HAM", time: "1:31.412" },
    topSpeed:   { driverId: "NOR", kmh: 331 },
    narrative: "HAMILTON WINS FOR FERRARI. Lewis's first Ferrari victory in only his second race. The crowd erupts. Norris P3, Verstappen fights to P5 - RBPT engineers working overnight on fuel maps.",
    narrativePhase: "reset",
    leadMoment: "🏆 HAM wins - Ferrari's 2026 statement",
    engineNote: "Ferrari's MGU-H upgrade unlocks 15kW extra deployment in Turn 14 hairpin. Hamilton specifically credits the engine braking stability.",
  },
  {
    round: 3,  name: "Japan",        flag: "🇯🇵", date: "Apr 6",   circuit: "Suzuka",
    winner: "NOR",
    fastestLap: { driverId: "VER", time: "1:27.218" },
    topSpeed:   { driverId: "VER", kmh: 324 },
    narrative: "Norris wins at Suzuka. VER fights back to P3 - the RBPT-Ford PU finding performance. Fastest lap for VER signals Red Bull closing the gap.",
    narrativePhase: "surge",
    leadMoment: "P3 - VER clawing back",
    engineNote: "Verstappen's fastest lap (1:27.218) is 1.1s quicker than the 2025 Suzuka benchmark - the new 800kW power unit in full effect through Suzuka's high-speed sweeps.",
  },
  {
    round: 4,  name: "Bahrain",      flag: "🇧🇭", date: "Apr 20",  circuit: "Sakhir",
    winner: "VER",
    fastestLap: { driverId: "VER", time: "1:32.087" },
    topSpeed:   { driverId: "VER", kmh: 351 },
    narrative: "VERSTAPPEN WINS! RBPT-Ford breakthrough. The Ford PU hits its target power output. Norris P2, Hamilton P3. Championship starts to tighten. Top speed of 351 km/h - new circuit record.",
    narrativePhase: "surge",
    leadMoment: "🏆 VER wins - RBPT breakthrough race",
    engineNote: "Ford PU reaches design power target. Top speed 351 km/h (2025 record: 343 km/h) - X-Mode combined with Ford PU torque delivering record-breaking straights.",
  },
  {
    round: 5,  name: "Saudi Arabia", flag: "🇸🇦", date: "Apr 27",  circuit: "Jeddah",
    winner: "NOR",
    fastestLap: { driverId: "HAM", time: "1:26.541" },
    topSpeed:   { driverId: "VER", kmh: 357 },
    narrative: "Norris wins a chaotic Saudi race. Hamilton sets the fastest lap - Ferrari's pace in low-drag configs impressive. Top speed 357 km/h on the back straight - new Jeddah benchmark by 10 km/h.",
    narrativePhase: "surge",
    leadMoment: "NOR leads: 103 pts - HAM 89 - VER 78",
    engineNote: "357 km/h top speed - the highest in F1 since 2004 Monza era. Active aero in X-Mode fully eliminating drag. Ferrari's MGU-H deploying 40kJ of extra energy through S1.",
  },
  {
    round: 6,  name: "Miami",        flag: "🇺🇸", date: "May 11",  circuit: "Miami",
    winner: "VER",
    fastestLap: { driverId: "VER", time: "1:28.623" },
    topSpeed:   { driverId: "NOR", kmh: 333 },
    narrative: "VER WINS MIAMI - now within 7 points of Norris! Hamilton P2 battling all race. Piastri P3. The championship is officially a three-way fight.",
    narrativePhase: "challenge",
    leadMoment: "🏆 VER wins - NOR lead cut to 7 pts",
    engineNote: "Red Bull deploys new-spec Ford PU diffuser integration. 40% reduction in thermal degradation vs R1. The learning curve from 2026 regs is steeper than 2022 - but faster.",
  },
  {
    round: 7,  name: "Monaco",       flag: "🇲🇨", date: "May 25",  circuit: "Monte Carlo",
    winner: "HAM",
    fastestLap: { driverId: "LEC", time: "1:10.924" },
    topSpeed:   { driverId: "HAM", kmh: 291 },
    narrative: "HAMILTON WINS MONACO. Lewis masters the streets at the wheel of the Scuderia. Leclerc sets the fastest lap for Ferrari 1-2. Emotional podium for Hamilton as Verstappen P4.",
    narrativePhase: "challenge",
    leadMoment: "🏆 HAM wins Monaco - 3-way title fight",
    engineNote: "Monaco expo for ERS management: Hamilton deploying MGU-K out of Portier with surgical precision. Ferrari's 50/50 PU balance ideal for stop-start Monaco rhythm.",
  },
  {
    round: 8,  name: "Spain",        flag: "🇪🇸", date: "Jun 8",   circuit: "Barcelona",
    winner: "NOR",
    fastestLap: { driverId: "VER", time: "1:15.689" },
    topSpeed:   { driverId: "VER", kmh: 330 },
    narrative: "Norris wins Spain - consolidating his championship lead. VER fastest lap again. Championship: NOR 161 pts · HAM 132 pts · VER 118 pts. Season resumes after summer break.",
    narrativePhase: "momentum",
    leadMoment: "NOR leads: 161 · HAM 132 · VER 118",
    engineNote: "Mercedes PU active aero advantage most visible at Barcelona - McLaren's rear wing X-Mode transition 12ms faster than rivals. Wind tunnel correlation paying dividends.",
  },
];

// Race results: [P1..P8] by driver ID
const RACE_RESULTS_2026: { [round: number]: string[] } = {
  1: ["NOR", "HAM", "LEC", "PIA", "RUS", "ANT", "VER", "ALO"],
  2: ["HAM", "LEC", "NOR", "PIA", "VER", "RUS", "ALO", "ANT"],
  3: ["NOR", "PIA", "VER", "HAM", "LEC", "RUS", "ANT", "ALO"],
  4: ["VER", "NOR", "HAM", "LEC", "PIA", "RUS", "ALO", "ANT"],
  5: ["NOR", "VER", "LEC", "HAM", "PIA", "RUS", "ANT", "ALO"],
  6: ["VER", "HAM", "PIA", "NOR", "LEC", "RUS", "ALO", "ANT"],
  7: ["HAM", "LEC", "NOR", "RUS", "VER", "PIA", "ANT", "ALO"],
  8: ["NOR", "VER", "HAM", "PIA", "LEC", "RUS", "ALO", "ANT"],
};

const POINTS_MAP = [25, 18, 15, 12, 10, 8, 6, 4];

function buildStandings2026(): StandingsEntry[][] {
  const cumulative: Record<string, number> = {};
  DRIVERS_2026.forEach((d) => { cumulative[d.id] = 0; });

  return RACES_2026.map((race) => {
    const results = RACE_RESULTS_2026[race.round];
    results.forEach((driverId, idx) => {
      cumulative[driverId] = (cumulative[driverId] ?? 0) + (POINTS_MAP[idx] ?? 0);
    });
    return DRIVERS_2026.map((d) => ({ driverId: d.id, points: cumulative[d.id] }));
  });
}

export const STANDINGS_BY_RACE_2026: StandingsEntry[][] = buildStandings2026();

export const NARRATIVE_COLORS_2026: Record<Race2026["narrativePhase"], string> = {
  reset:       "#8B6914",
  surge:       "#4A7C59",
  challenge:   "#7055A8",
  fight:       "#8B455A",
  momentum:    "#3671C6",
  revelation:  "#C96A36",
};

// ─── Engine Regulation Comparison Data ────────────────────────────────────────
export const ENGINE_CHANGES = {
  title: "The 2026 Power Unit Revolution",
  subtitle: "Biggest regulation change since 2014 turbo hybrid era",
  changes: [
    {
      category: "Power Split",
      icon: "⚡",
      v2025: { label: "80% ICE / 20% Electric", value: 80, color: "#CC5533", detail: "~600kW ICE + ~150kW ERS = ~750kW total" },
      v2026: { label: "50% ICE / 50% Electric", value: 50, color: "#3671C6", detail: "~400kW ICE + ~400kW electric = ~800kW total" },
    },
    {
      category: "Top Speed",
      icon: "🚀",
      v2025: { label: "avg ~336 km/h", value: 336, color: "#CC5533", detail: "Peak: 364 km/h at Monza (Verstappen)" },
      v2026: { label: "avg ~341 km/h", value: 341, color: "#3671C6", detail: "Peak: 357 km/h at Jeddah (+X-Mode)" },
    },
    {
      category: "Fastest Lap delta",
      icon: "⏱️",
      v2025: { label: "Baseline", value: 0, color: "#CC5533", detail: "2025 season lap records" },
      v2026: { label: "~1.1s quicker", value: 1.1, color: "#3671C6", detail: "Average improvement across comparable circuits" },
    },
    {
      category: "Aerodynamics",
      icon: "✈️",
      v2025: { label: "Fixed DRS (80mm gap)", value: 0, color: "#CC5533", detail: "Push-button DRS on designated zones" },
      v2026: { label: "Active X-Mode aero", value: 1, color: "#3671C6", detail: "Full-body active aero - front + rear morph for straights" },
    },
    {
      category: "MGU-H",
      icon: "🔄",
      v2025: { label: "Banned (2014–2025)", value: 0, color: "#CC5533", detail: "Removed from PU regs due to cost & complexity" },
      v2026: { label: "Reintroduced (standardised)", value: 1, color: "#3671C6", detail: "FIA spec MGU-H, energy recovery from exhaust gases" },
    },
  ],
  puSuppliers: [
    { team: "Red Bull", v2025: "Honda/RBPT", v2026: "Ford/RBPT", change: "new", note: "New Ford partnership, PU struggled R1-R3" },
    { team: "Ferrari",  v2025: "Ferrari",    v2026: "Ferrari",   change: "upgraded", note: "MGU-H expertise gave early edge" },
    { team: "McLaren",  v2025: "Mercedes",   v2026: "Mercedes",  change: "same",    note: "Best integrated X-Mode package at season start" },
    { team: "Mercedes", v2025: "Mercedes",   v2026: "Mercedes",  change: "same",    note: "Reliable but car lacks Ferrari/McLaren downforce" },
    { team: "Aston Martin", v2025: "Mercedes", v2026: "Honda",   change: "new",    note: "Newey design + Honda PU - mid-season dark horse" },
    { team: "Sauber/Audi",  v2025: "Ferrari",  v2026: "Audi",    change: "new",    note: "Full manufacturer entry, maiden season" },
  ],
};
