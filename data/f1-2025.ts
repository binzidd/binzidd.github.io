export interface DriverMeta {
  id: string;
  name: string;
  short: string;
  team: string;
  teamShort: string;
  color: string;
  flag: string;
  isMax?: boolean;
}

export interface RaceMeta {
  round: number;
  name: string;
  flag: string;
  date: string;
  circuit: string;
  narrative: string;
  narrativePhase: "struggle" | "finding" | "climbing" | "pressure" | "fight" | "comeback";
  maxMoment?: string;
}

export interface StandingsEntry {
  driverId: string;
  points: number;
}

// ─── Driver Metadata ───────────────────────────────────────────────────────────
export const DRIVERS: DriverMeta[] = [
  { id: "VER", name: "Max Verstappen",   short: "VER", team: "Red Bull Racing",   teamShort: "Red Bull",   color: "#3671C6", flag: "🇳🇱", isMax: true },
  { id: "NOR", name: "Lando Norris",     short: "NOR", team: "McLaren",           teamShort: "McLaren",    color: "#FF8000", flag: "🇬🇧" },
  { id: "PIA", name: "Oscar Piastri",    short: "PIA", team: "McLaren",           teamShort: "McLaren",    color: "#FF8000", flag: "🇦🇺" },
  { id: "HAM", name: "Lewis Hamilton",   short: "HAM", team: "Ferrari",           teamShort: "Ferrari",    color: "#E8002D", flag: "🇬🇧" },
  { id: "LEC", name: "Charles Leclerc", short: "LEC", team: "Ferrari",           teamShort: "Ferrari",    color: "#E8002D", flag: "🇲🇨" },
  { id: "RUS", name: "George Russell",   short: "RUS", team: "Mercedes",          teamShort: "Mercedes",   color: "#27F4D2", flag: "🇬🇧" },
  { id: "SAI", name: "Carlos Sainz",     short: "SAI", team: "Williams",          teamShort: "Williams",   color: "#64C4FF", flag: "🇪🇸" },
  { id: "ANT", name: "Kimi Antonelli",   short: "ANT", team: "Mercedes",          teamShort: "Mercedes",   color: "#27F4D2", flag: "🇮🇹" },
];

// ─── Race Metadata ─────────────────────────────────────────────────────────────
export const RACES: RaceMeta[] = [
  { round: 1,  name: "Australia",    flag: "🇦🇺", date: "Mar 16",  circuit: "Melbourne",        narrative: "McLarens light up Melbourne. Max drops to P5 — Red Bull visibly off the pace.", narrativePhase: "struggle",  maxMoment: "P5 — Struggling" },
  { round: 2,  name: "China",        flag: "🇨🇳", date: "Mar 23",  circuit: "Shanghai",         narrative: "Norris leads the championship. Max still adrift — P5 again in China.", narrativePhase: "struggle",  maxMoment: "P5 — Out of sorts" },
  { round: 3,  name: "Japan",        flag: "🇯🇵", date: "Apr 6",   circuit: "Suzuka",           narrative: "Suzuka magic. Max WINS in dominant fashion — the old Max is back.", narrativePhase: "finding",   maxMoment: "🏆 WIN — First blood" },
  { round: 4,  name: "Bahrain",      flag: "🇧🇭", date: "Apr 13",  circuit: "Sakhir",           narrative: "P4 in Bahrain. Max climbs to P3 in the standings but McLarens still 25+ points clear.", narrativePhase: "finding",   maxMoment: "P4 — Climbing" },
  { round: 5,  name: "Saudi Arabia", flag: "🇸🇦", date: "Apr 20",  circuit: "Jeddah",           narrative: "Piastri wins; Max holds P3 in the standings. The gap stubbornly refuses to close.", narrativePhase: "finding",   maxMoment: "P5 — Grinding" },
  { round: 6,  name: "Miami",        flag: "🇺🇸", date: "May 4",   circuit: "Miami",            narrative: "Max WINS Miami! Charging from 3rd to 1st in the closing laps. P3 → P2 in standings.", narrativePhase: "climbing",  maxMoment: "🏆 WIN — Clawing back" },
  { round: 7,  name: "Imola",        flag: "🇮🇹", date: "May 18",  circuit: "Imola",            narrative: "Consecutive wins at Imola — Max now tied with Piastri for P2 in the championship.", narrativePhase: "climbing",  maxMoment: "🏆 WIN — Momentum" },
  { round: 8,  name: "Monaco",       flag: "🇲🇨", date: "May 25",  circuit: "Monte Carlo",      narrative: "Leclerc's home win. Max misses out (P5) as Ferrari shines on the streets.", narrativePhase: "climbing",  maxMoment: "P5 — Setback" },
  { round: 9,  name: "Spain",        flag: "🇪🇸", date: "Jun 1",   circuit: "Barcelona",        narrative: "Max WINS Spain — now only 12 points behind Norris. The hunt is on.", narrativePhase: "pressure",  maxMoment: "🏆 WIN — Gap closing" },
  { round: 10, name: "Canada",       flag: "🇨🇦", date: "Jun 15",  circuit: "Montréal",         narrative: "Norris wins Canada. Max P4 — championship gap widens slightly to 25 points.", narrativePhase: "pressure",  maxMoment: "P4 — Norris fights back" },
  { round: 11, name: "Austria",      flag: "🇦🇹", date: "Jun 29",  circuit: "Spielberg",        narrative: "Max WINS his home race at Red Bull Ring. Now officially in the championship fight.", narrativePhase: "pressure",  maxMoment: "🏆 WIN — Red Bull home" },
  { round: 12, name: "Britain",      flag: "🇬🇧", date: "Jul 6",   circuit: "Silverstone",      narrative: "Hamilton wins Silverstone for Ferrari — emotional scenes. Max P2, cutting the gap to 15.", narrativePhase: "fight",     maxMoment: "P2 — 15 pts behind" },
  { round: 13, name: "Belgium",      flag: "🇧🇪", date: "Jul 27",  circuit: "Spa-Francorchamps", narrative: "Max WINS Spa to close to within 8 points of Norris. It's a championship.", narrativePhase: "fight",     maxMoment: "🏆 WIN — 8 pts behind!" },
  { round: 14, name: "Hungary",      flag: "🇭🇺", date: "Aug 3",   circuit: "Budapest",         narrative: "Norris wins Hungary, 15 points clear again. Max refuses to yield.", narrativePhase: "fight",     maxMoment: "P2 — Norris responds" },
  { round: 15, name: "Netherlands",  flag: "🇳🇱", date: "Aug 31",  circuit: "Zandvoort",        narrative: "Max WINS Zandvoort — the Dutch crowd erupts. 8 points behind Norris with 6 races left.", narrativePhase: "fight",     maxMoment: "🏆 WIN — Home crowd roars" },
  { round: 16, name: "Italy",        flag: "🇮🇹", date: "Sep 7",   circuit: "Monza",            narrative: "MONZA MASTERCLASS. Max wins as Norris DNF. MAX LEADS THE CHAMPIONSHIP! The comeback is complete.", narrativePhase: "comeback",  maxMoment: "🏆 WIN — CHAMPIONSHIP LEAD!" },
];

// Race results: [P1, P2, P3, P4, P5, P6, P7, P8] by driver ID
const RACE_RESULTS: { [round: number]: string[] } = {
  1:  ["PIA", "NOR", "HAM", "LEC", "VER", "RUS", "SAI", "ANT"],
  2:  ["NOR", "PIA", "HAM", "LEC", "VER", "RUS", "ANT", "SAI"],
  3:  ["VER", "LEC", "NOR", "PIA", "HAM", "RUS", "SAI", "ANT"],
  4:  ["NOR", "PIA", "HAM", "VER", "LEC", "RUS", "ANT", "SAI"],
  5:  ["PIA", "HAM", "NOR", "LEC", "VER", "RUS", "SAI", "ANT"],
  6:  ["VER", "NOR", "PIA", "HAM", "LEC", "RUS", "SAI", "ANT"],
  7:  ["VER", "PIA", "NOR", "LEC", "RUS", "HAM", "SAI", "ANT"],
  8:  ["LEC", "HAM", "NOR", "PIA", "VER", "RUS", "SAI", "ANT"],
  9:  ["VER", "NOR", "PIA", "HAM", "LEC", "RUS", "ANT", "SAI"],
  10: ["NOR", "RUS", "PIA", "VER", "HAM", "LEC", "ANT", "SAI"],
  11: ["VER", "NOR", "PIA", "LEC", "HAM", "RUS", "SAI", "ANT"],
  12: ["HAM", "VER", "NOR", "PIA", "LEC", "RUS", "SAI", "ANT"],
  13: ["VER", "NOR", "PIA", "LEC", "HAM", "RUS", "ANT", "SAI"],
  14: ["NOR", "VER", "PIA", "HAM", "LEC", "RUS", "SAI", "ANT"],
  15: ["VER", "NOR", "RUS", "PIA", "LEC", "HAM", "ANT", "SAI"],
  16: ["VER", "PIA", "LEC", "RUS", "HAM", "ANT", "SAI", "NOR"], // NOR DNF = 0 pts
};

const POINTS_MAP = [25, 18, 15, 12, 10, 8, 6, 4];

// Build cumulative standings for each race
function buildStandings(): StandingsEntry[][] {
  const cumulative: Record<string, number> = {};
  DRIVERS.forEach((d) => { cumulative[d.id] = 0; });

  return RACES.map((race) => {
    const results = RACE_RESULTS[race.round];
    // NOR DNF in R16
    if (race.round === 16) {
      results.forEach((driverId, idx) => {
        if (driverId === "NOR") return; // DNF, no points
        cumulative[driverId] = (cumulative[driverId] ?? 0) + (POINTS_MAP[idx] ?? 0);
      });
    } else {
      results.forEach((driverId, idx) => {
        cumulative[driverId] = (cumulative[driverId] ?? 0) + (POINTS_MAP[idx] ?? 0);
      });
    }
    return DRIVERS.map((d) => ({ driverId: d.id, points: cumulative[d.id] }));
  });
}

export const STANDINGS_BY_RACE: StandingsEntry[][] = buildStandings();

export const NARRATIVE_COLORS: Record<RaceMeta["narrativePhase"], string> = {
  struggle: "#CC5533",
  finding:  "#C4A882",
  climbing: "#8B9355",
  pressure: "#55778B",
  fight:    "#8B5578",
  comeback: "#3671C6",
};
