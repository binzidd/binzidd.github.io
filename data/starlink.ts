export interface StarlinkLaunch {
  date: string;
  month: string;
  year: number;
  satsLaunched: number;
  cumulative: number;
  mission: string;
  orbit: string;
}

export interface OrbitalShell {
  altitude: number;
  inclination: number;
  count: number;
  color: string;
  label: string;
}

// Cumulative Starlink satellite launches (operational estimates, based on public SpaceX data)
export const starlinkLaunches: StarlinkLaunch[] = [
  { date: "2019-05", month: "May 2019",   year: 2019, satsLaunched: 60,  cumulative: 60,   mission: "Starlink-0",   orbit: "LEO 550km" },
  { date: "2020-01", month: "Jan 2020",   year: 2020, satsLaunched: 60,  cumulative: 120,  mission: "Starlink-2",   orbit: "LEO 550km" },
  { date: "2020-04", month: "Apr 2020",   year: 2020, satsLaunched: 60,  cumulative: 180,  mission: "Starlink-5",   orbit: "LEO 550km" },
  { date: "2020-06", month: "Jun 2020",   year: 2020, satsLaunched: 58,  cumulative: 538,  mission: "Starlink-7",   orbit: "LEO 550km" },
  { date: "2020-09", month: "Sep 2020",   year: 2020, satsLaunched: 60,  cumulative: 698,  mission: "Starlink-11",  orbit: "LEO 550km" },
  { date: "2020-12", month: "Dec 2020",   year: 2020, satsLaunched: 60,  cumulative: 958,  mission: "Starlink-16",  orbit: "LEO 550km" },
  { date: "2021-03", month: "Mar 2021",   year: 2021, satsLaunched: 60,  cumulative: 1258, mission: "Starlink-21",  orbit: "LEO 550km" },
  { date: "2021-06", month: "Jun 2021",   year: 2021, satsLaunched: 60,  cumulative: 1558, mission: "Starlink-27",  orbit: "LEO 550km" },
  { date: "2021-09", month: "Sep 2021",   year: 2021, satsLaunched: 51,  cumulative: 1809, mission: "Starlink-30",  orbit: "LEO 550km" },
  { date: "2021-12", month: "Dec 2021",   year: 2021, satsLaunched: 54,  cumulative: 2009, mission: "Starlink-33",  orbit: "LEO 540km" },
  { date: "2022-03", month: "Mar 2022",   year: 2022, satsLaunched: 53,  cumulative: 2362, mission: "Starlink-4-10", orbit: "LEO 540km" },
  { date: "2022-06", month: "Jun 2022",   year: 2022, satsLaunched: 53,  cumulative: 2709, mission: "Starlink-4-19", orbit: "LEO 540km" },
  { date: "2022-09", month: "Sep 2022",   year: 2022, satsLaunched: 54,  cumulative: 3063, mission: "Starlink-4-26", orbit: "LEO 540km" },
  { date: "2022-12", month: "Dec 2022",   year: 2022, satsLaunched: 54,  cumulative: 3468, mission: "Starlink-4-35", orbit: "LEO 530km" },
  { date: "2023-03", month: "Mar 2023",   year: 2023, satsLaunched: 51,  cumulative: 3819, mission: "Starlink-5-5",  orbit: "LEO 530km" },
  { date: "2023-06", month: "Jun 2023",   year: 2023, satsLaunched: 57,  cumulative: 4233, mission: "Starlink-6-3",  orbit: "LEO 530km" },
  { date: "2023-09", month: "Sep 2023",   year: 2023, satsLaunched: 22,  cumulative: 4687, mission: "Starlink-6-10", orbit: "VLEO 340km" },
  { date: "2023-12", month: "Dec 2023",   year: 2023, satsLaunched: 23,  cumulative: 5149, mission: "Starlink-6-20", orbit: "VLEO 340km" },
  { date: "2024-03", month: "Mar 2024",   year: 2024, satsLaunched: 23,  cumulative: 5614, mission: "Starlink-6-33", orbit: "VLEO 340km" },
  { date: "2024-06", month: "Jun 2024",   year: 2024, satsLaunched: 23,  cumulative: 6089, mission: "Starlink-6-46", orbit: "VLEO 340km" },
  { date: "2024-09", month: "Sep 2024",   year: 2024, satsLaunched: 23,  cumulative: 6546, mission: "Starlink-6-58", orbit: "VLEO 340km" },
  { date: "2024-12", month: "Dec 2024",   year: 2024, satsLaunched: 21,  cumulative: 6973, mission: "Starlink-6-68", orbit: "VLEO 340km" },
  { date: "2025-03", month: "Mar 2025",   year: 2025, satsLaunched: 23,  cumulative: 7234, mission: "Starlink-12-1", orbit: "VLEO 340km" },
];

// Orbital shells that make up the constellation
export const orbitalShells: OrbitalShell[] = [
  { altitude: 550, inclination: 53.0,  count: 1584, color: "#00D9FF", label: "Shell 1 — 550km / 53°" },
  { altitude: 540, inclination: 53.2,  count: 720,  color: "#7C3AED", label: "Shell 2 — 540km / 53.2°" },
  { altitude: 570, inclination: 70.0,  count: 348,  color: "#3FB950", label: "Shell 3 — 570km / 70°" },
  { altitude: 560, inclination: 97.6,  count: 172,  color: "#F0A742", label: "Shell 4 — 560km / 97.6° (polar)" },
  { altitude: 345, inclination: 53.0,  count: 2493, color: "#FF6B6B", label: "Shell 5 — 345km / 53° (Gen2)" },
];

// Approximate passes over NSW (Sydney ~34°S) per day — varies by shell inclination
// LEO ~550km orbits ~15.5 times/day globally; coverage window ~10 min per pass
// Sydney visible passes from shells with inclination > 34°
export const nswPassData = [
  { month: "Jan 2022", passesPerDay: 3.2, totalSats: 1800  },
  { month: "Jul 2022", passesPerDay: 5.1, totalSats: 2700  },
  { month: "Jan 2023", passesPerDay: 6.8, totalSats: 3500  },
  { month: "Jul 2023", passesPerDay: 8.4, totalSats: 4200  },
  { month: "Jan 2024", passesPerDay: 9.6, totalSats: 5200  },
  { month: "Jul 2024", passesPerDay: 11.2, totalSats: 6100 },
  { month: "Jan 2025", passesPerDay: 12.8, totalSats: 7000 },
];

export const MILESTONES = [
  { cumulative: 60,   label: "First batch\nlaunched", year: 2019 },
  { cumulative: 1000, label: "1,000\nsatellites",     year: 2021 },
  { cumulative: 2000, label: "Beta service\nlaunches", year: 2021 },
  { cumulative: 3000, label: "Global\ncoverage",       year: 2022 },
  { cumulative: 5000, label: "5,000\noperational",     year: 2023 },
  { cumulative: 7000, label: "Gen2 V3\ndeployment",    year: 2025 },
];
