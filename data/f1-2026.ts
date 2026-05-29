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

// 8 key championship drivers — 2026 regulation reset lineups
export const DRIVERS_2026: Driver2026[] = [
  { id: "ANT", name: "Kimi Antonelli",   short: "ANT", team: "Mercedes",  teamShort: "Mercedes", color: "#27F4D2", flag: "🇮🇹", puSupplier: "Mercedes", isLead: true },
  { id: "RUS", name: "George Russell",   short: "RUS", team: "Mercedes",  teamShort: "Mercedes", color: "#27F4D2", flag: "🇬🇧", puSupplier: "Mercedes" },
  { id: "LEC", name: "Charles Leclerc", short: "LEC", team: "Ferrari",   teamShort: "Ferrari",  color: "#E8002D", flag: "🇲🇨", puSupplier: "Ferrari"  },
  { id: "HAM", name: "Lewis Hamilton",  short: "HAM", team: "Ferrari",   teamShort: "Ferrari",  color: "#E8002D", flag: "🇬🇧", puSupplier: "Ferrari"  },
  { id: "NOR", name: "Lando Norris",    short: "NOR", team: "McLaren",   teamShort: "McLaren",  color: "#FF8000", flag: "🇬🇧", puSupplier: "Mercedes" },
  { id: "PIA", name: "Oscar Piastri",   short: "PIA", team: "McLaren",   teamShort: "McLaren",  color: "#FF8000", flag: "🇦🇺", puSupplier: "Mercedes" },
  { id: "VER", name: "Max Verstappen",  short: "VER", team: "Red Bull",  teamShort: "Red Bull", color: "#3671C6", flag: "🇳🇱", puSupplier: "Ford/RBPT"},
  { id: "HAD", name: "Isack Hadjar",    short: "HAD", team: "Red Bull",  teamShort: "Red Bull", color: "#6B91D6", flag: "🇫🇷", puSupplier: "Ford/RBPT"},
];

// 2026 Race Calendar — 5 rounds completed as of May 29 2026
// Bahrain and Saudi Arabian GPs removed from original calendar.
// China, Miami, Canada are sprint weekends.
export const RACES_2026: Race2026[] = [
  {
    round: 1,  name: "Australia", flag: "🇦🇺", date: "Mar 8",  circuit: "Melbourne",
    winner: "RUS",
    fastestLap: { driverId: "ANT", time: "1:21.934" },
    topSpeed:   { driverId: "RUS", kmh: 321 },
    narrative: "The 2026 era opens with a Mercedes 1-2. Russell wins, Antonelli P2. Hamilton takes P4 on his Ferrari debut. Verstappen recovers from P20 to P6. Piastri does not start after a sighting-lap crash.",
    narrativePhase: "reset",
    leadMoment: "🏆 RUS wins — Mercedes 1-2 on opening day",
    engineNote: "Mercedes' integrated MGU-H and X-Mode active aero package arrives as the most complete on the grid. Red Bull-Ford PU visibly down on top-end power in sectors 1 and 3.",
  },
  {
    round: 2,  name: "China",     flag: "🇨🇳", date: "Mar 15", circuit: "Shanghai",
    winner: "ANT",
    fastestLap: { driverId: "ANT", time: "1:33.847" },
    topSpeed:   { driverId: "NOR", kmh: 329 },
    narrative: "ANTONELLI WINS HIS MAIDEN GRAND PRIX. At 19 years and 202 days, the youngest polesitter in F1 history converts pole to victory. Hamilton takes his first Ferrari podium (P3). Mercedes 1-2 again.",
    narrativePhase: "reset",
    leadMoment: "🏆 ANT wins — maiden victory, youngest polesitter ever",
    engineNote: "Antonelli's mastery of the MGU-H harvest-and-deploy cycle through Shanghai's final sector shows Mercedes' decade of PU expertise transferred to a 19-year-old in six months.",
  },
  {
    round: 3,  name: "Japan",     flag: "🇯🇵", date: "Mar 29", circuit: "Suzuka",
    winner: "ANT",
    fastestLap: { driverId: "ANT", time: "1:32.442" },
    topSpeed:   { driverId: "RUS", kmh: 316 },
    narrative: "Consecutive wins for Antonelli. A Bearman crash triggers a safety car that breaks the race open. Piastri P2, Leclerc P3. Verstappen P8 — Red Bull exposed at a power circuit. ANT takes the championship lead.",
    narrativePhase: "surge",
    leadMoment: "🏆 ANT wins — youngest championship leader in F1 history",
    engineNote: "Mercedes X-Mode aero through 130R and Spoon curves is 0.4s per lap quicker than Red Bull. Ford PU's peak power deficit is most visible at Suzuka's sustained high-load sections.",
  },
  {
    round: 4,  name: "Miami",     flag: "🇺🇸", date: "May 3",  circuit: "Miami",
    winner: "ANT",
    fastestLap: { driverId: "NOR", time: "1:31.869" },
    topSpeed:   { driverId: "ANT", kmh: 328 },
    narrative: "Three wins in a row for Antonelli on a chaotic sprint weekend. Leclerc leads late before a nightmare final lap hands P3 to Piastri. Norris P2. ANT leads the championship by 25 points.",
    narrativePhase: "surge",
    leadMoment: "ANT leads: RUS by 25 pts after Miami",
    engineNote: "Three PU suppliers in the top 3 (Mercedes works, McLaren-Mercedes, McLaren-Mercedes). Ferrari's MGU-K deployment timing costs Leclerc the podium on the final lap.",
  },
  {
    round: 5,  name: "Canada",    flag: "🇨🇦", date: "May 24", circuit: "Montreal",
    winner: "ANT",
    fastestLap: { driverId: "ANT", time: "1:14.210" },
    topSpeed:   { driverId: "HAM", kmh: 334 },
    narrative: "FOUR WINS IN A ROW. Russell leads then DNFs on lap 30 with a PU failure — Antonelli wins with the same engine. Hamilton P2 for Ferrari. Verstappen P3: his first 2026 podium in five races. ANT leads by 43 pts.",
    narrativePhase: "momentum",
    leadMoment: "🏆 ANT wins — RUS DNF, championship lead extends to 43 pts",
    engineNote: "Russell's PU failure on lap 30 is a reminder that even the class-leading Mercedes power unit carries reliability risk at high-output circuits. Ford-RBPT finally delivers a clean race — Verstappen takes the podium.",
  },
];

// Race results P1..P8 by driver ID
// Note: sprint points not modelled — race-only standings shown.
// Reflects actual finishing order for tracked drivers.
const RACE_RESULTS_2026: { [round: number]: string[] } = {
  1: ["RUS", "ANT", "LEC", "HAM", "NOR", "VER", "HAD", "PIA"],
  2: ["ANT", "RUS", "HAM", "LEC", "NOR", "PIA", "HAD", "VER"],
  3: ["ANT", "PIA", "LEC", "RUS", "NOR", "HAM", "VER", "HAD"],
  4: ["ANT", "NOR", "PIA", "RUS", "LEC", "VER", "HAM", "HAD"],
  5: ["ANT", "HAM", "VER", "LEC", "HAD", "NOR", "PIA", "RUS"],
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
  surge:       "#27F4D2",
  challenge:   "#7055A8",
  fight:       "#8B455A",
  momentum:    "#3671C6",
  revelation:  "#C96A36",
};

// Engine Regulation Comparison — 2025 vs 2026
export const ENGINE_CHANGES = {
  title: "The 2026 Power Unit Revolution",
  subtitle: "Biggest regulation change since the 2014 turbo-hybrid era",
  changes: [
    {
      category: "Power Split",
      icon: "⚡",
      v2025: { label: "80% ICE / 20% Electric", value: 80, color: "#CC5533", detail: "~600kW ICE + ~150kW ERS = ~750kW total" },
      v2026: { label: "50% ICE / 50% Electric", value: 50, color: "#27F4D2", detail: "~400kW ICE + ~400kW electric = ~800kW total" },
    },
    {
      category: "Top Speed",
      icon: "🚀",
      v2025: { label: "avg ~336 km/h", value: 336, color: "#CC5533", detail: "Peak: 364 km/h at Monza (Verstappen)" },
      v2026: { label: "avg ~326 km/h", value: 326, color: "#27F4D2", detail: "Peak: 334 km/h at Montreal (Hamilton) — heavier cars, active aero trade-off" },
    },
    {
      category: "Fastest Lap delta",
      icon: "⏱️",
      v2025: { label: "Baseline", value: 0, color: "#CC5533", detail: "2025 season lap records" },
      v2026: { label: "~0.9s quicker", value: 0.9, color: "#27F4D2", detail: "Average improvement across comparable circuits (Suzuka, Shanghai)" },
    },
    {
      category: "Aerodynamics",
      icon: "✈️",
      v2025: { label: "Fixed DRS (80mm gap)", value: 0, color: "#CC5533", detail: "Push-button DRS on designated zones only" },
      v2026: { label: "Active X-Mode aero", value: 1, color: "#27F4D2", detail: "Full-body active aero — front + rear morph continuously for straights vs corners" },
    },
    {
      category: "MGU-H",
      icon: "🔄",
      v2025: { label: "Banned (2014-2025)", value: 0, color: "#CC5533", detail: "Removed from PU regs due to cost and complexity" },
      v2026: { label: "Reintroduced (standardised)", value: 1, color: "#27F4D2", detail: "FIA-spec MGU-H — Mercedes' 2014-2021 expertise is a clear early-season advantage" },
    },
  ],
  puSuppliers: [
    { team: "Red Bull",      v2025: "Honda/RBPT", v2026: "Ford/RBPT", change: "new",      note: "Ford partnership struggling — peak power deficit through R1-R5; VER first podium only in R5" },
    { team: "Ferrari",       v2025: "Ferrari",    v2026: "Ferrari",   change: "upgraded", note: "Competitive MGU-H integration; Hamilton and Leclerc both on the podium in early rounds" },
    { team: "McLaren",       v2025: "Mercedes",   v2026: "Mercedes",  change: "same",     note: "Mercedes customer PU; Norris P2 in Miami shows second-best pace behind the works team" },
    { team: "Mercedes",      v2025: "Mercedes",   v2026: "Mercedes",  change: "same",     note: "Clear class of the field — Antonelli wins 4 of 5 races, RUS leads constructors before Canada DNF" },
    { team: "Aston Martin",  v2025: "Mercedes",   v2026: "Honda",     change: "new",      note: "Newey-designed chassis plus returning Honda PU — tipped as a second-half dark horse" },
    { team: "Sauber / Audi", v2025: "Ferrari",    v2026: "Audi",      change: "new",      note: "Full Audi works entry in its maiden season; building toward competitiveness over the year" },
  ],
};
