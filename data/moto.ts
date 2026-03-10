// Yamaha MT-10 2023 vs Hypernaked Class
// Specs sourced from manufacturer websites & independent reviews

export interface MotoSpec {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;          // brand colour for charts
  engine: string;
  displacement: number;   // cc
  cylinders: number;
  power: number;          // hp (bhp)
  powerRpm: number;
  torque: number;         // Nm
  torqueRpm: number;
  weight: number;         // kg wet
  seatHeight: number;     // mm
  topSpeed: number;       // km/h (est.)
  zeroToHundred: number;  // seconds (est.)
  tank: number;           // litres
  priceAUD: number;       // AUD MSRP
  powerToWeight: number;  // hp/kg
  isYamaha?: boolean;
  tagline: string;
}

export interface ElectronicsFeature {
  feature: string;
  category: "Safety" | "Performance" | "Comfort" | "Display";
  bikes: Record<string, boolean | string>;
}

export const bikes: MotoSpec[] = [
  {
    id: "mt10",
    make: "Yamaha",
    model: "MT-10",
    year: 2023,
    color: "#1E88E5",         // Yamaha blue
    engine: "998cc CP4 Inline-4",
    displacement: 998,
    cylinders: 4,
    power: 166,
    powerRpm: 11500,
    torque: 111,
    torqueRpm: 9000,
    weight: 193,
    seatHeight: 835,
    topSpeed: 260,
    zeroToHundred: 3.1,
    tank: 17,
    priceAUD: 19999,
    powerToWeight: 0.86,
    isYamaha: true,
    tagline: "The Dark Side of Japan",
  },
  {
    id: "zh2",
    make: "Kawasaki",
    model: "Z H2",
    year: 2023,
    color: "#2ECC40",         // Kawasaki green
    engine: "998cc Supercharged Inline-4",
    displacement: 998,
    cylinders: 4,
    power: 200,
    powerRpm: 11000,
    torque: 137,
    torqueRpm: 8500,
    weight: 239,
    seatHeight: 830,
    topSpeed: 270,
    zeroToHundred: 2.9,
    tank: 19,
    priceAUD: 25499,
    powerToWeight: 0.84,
    tagline: "Force Multiplied",
  },
  {
    id: "s1000r",
    make: "BMW",
    model: "S1000R",
    year: 2023,
    color: "#E53935",         // BMW red
    engine: "999cc ShiftCam Inline-4",
    displacement: 999,
    cylinders: 4,
    power: 165,
    powerRpm: 11000,
    torque: 114,
    torqueRpm: 9250,
    weight: 199,
    seatHeight: 830,
    topSpeed: 250,
    zeroToHundred: 3.2,
    tank: 16.5,
    priceAUD: 25990,
    powerToWeight: 0.83,
    tagline: "Pure Road Performance",
  },
  {
    id: "sfv4",
    make: "Ducati",
    model: "Streetfighter V4",
    year: 2023,
    color: "#E53935",         // Ducati red
    engine: "1103cc Desmosedici V4",
    displacement: 1103,
    cylinders: 4,
    power: 208,
    powerRpm: 13000,
    torque: 123,
    torqueRpm: 9500,
    weight: 178,
    seatHeight: 845,
    topSpeed: 290,
    zeroToHundred: 2.8,
    tank: 16,
    priceAUD: 38990,
    powerToWeight: 1.17,
    tagline: "The Most Powerful Naked",
  },
  {
    id: "1290sdr",
    make: "KTM",
    model: "1290 Super Duke R",
    year: 2023,
    color: "#FF6D00",         // KTM orange
    engine: "1301cc LC8 V-Twin",
    displacement: 1301,
    cylinders: 2,
    power: 180,
    powerRpm: 9500,
    torque: 140,
    torqueRpm: 8000,
    weight: 189,
    seatHeight: 835,
    topSpeed: 270,
    zeroToHundred: 2.9,
    tank: 16,
    priceAUD: 27990,
    powerToWeight: 0.95,
    tagline: "The Beast — Tamed",
  },
  {
    id: "tuono",
    make: "Aprilia",
    model: "Tuono V4 1100",
    year: 2023,
    color: "#B71C1C",         // Aprilia red
    engine: "1077cc RSV4 V4",
    displacement: 1077,
    cylinders: 4,
    power: 175,
    powerRpm: 11000,
    torque: 121,
    torqueRpm: 9000,
    weight: 184,
    seatHeight: 825,
    topSpeed: 275,
    zeroToHundred: 3.0,
    tank: 18.5,
    priceAUD: 23990,
    powerToWeight: 0.95,
    tagline: "Italian Superbike Soul, Naked",
  },
];

export const electronicsMatrix: ElectronicsFeature[] = [
  { feature: "Riding Modes",       category: "Performance", bikes: { mt10: "4 (Custom/Sport/Street/Rain)", zh2: "4", s1000r: "4 (Rain/Road/Dynamic/Race)", sfv4: "6 (Wet/Urban/Sport/Touring/Race/Race Pro)", "1290sdr": "2 (Street/Track)", tuono: "3 (Commute/Sport/Track)" } },
  { feature: "Traction Control",   category: "Safety",      bikes: { mt10: "3-level SCS", zh2: "KTRC 3-level", s1000r: "DTC (10-level)", sfv4: "8-level DTC EVO", "1290sdr": "MTSC (9-level)", tuono: "APRC 8-level" } },
  { feature: "Cornering ABS",      category: "Safety",      bikes: { mt10: true, zh2: true, s1000r: true, sfv4: true, "1290sdr": true, tuono: true } },
  { feature: "Wheelie Control",    category: "Safety",      bikes: { mt10: "Lift Control (3-level)", zh2: "KLM", s1000r: "10-level", sfv4: "8-level DWC EVO", "1290sdr": true, tuono: "AWC 8-level" } },
  { feature: "Slide Control",      category: "Safety",      bikes: { mt10: true, zh2: false, s1000r: false, sfv4: true, "1290sdr": false, tuono: false } },
  { feature: "Launch Control",     category: "Performance", bikes: { mt10: false, zh2: false, s1000r: "Optional", sfv4: true, "1290sdr": true, tuono: true } },
  { feature: "Quickshifter",       category: "Performance", bikes: { mt10: "QSS (up+down)", zh2: "KQS (up+down)", s1000r: "Shift Assist Pro", sfv4: "up+down", "1290sdr": "up+down", tuono: "up+down" } },
  { feature: "Cruise Control",     category: "Comfort",     bikes: { mt10: true, zh2: true, s1000r: true, sfv4: true, "1290sdr": true, tuono: true } },
  { feature: "IMU",                category: "Safety",      bikes: { mt10: "6-axis", zh2: "Bosch IMU", s1000r: "Bosch 6-axis", sfv4: "Bosch 6-axis", "1290sdr": "Bosch IMU", tuono: "6-axis" } },
  { feature: "TFT Display",        category: "Display",     bikes: { mt10: "4.2\" colour TFT", zh2: "4.3\" TFT", s1000r: "6.5\" TFT", sfv4: "5\" TFT", "1290sdr": "5\" TFT", tuono: "4.3\" TFT" } },
  { feature: "Smartphone Connect", category: "Comfort",     bikes: { mt10: false, zh2: false, s1000r: "BMW ConnectedRide", sfv4: "Ducati Connect", "1290sdr": false, tuono: false } },
  { feature: "Engine Brake Ctrl",  category: "Performance", bikes: { mt10: false, zh2: false, s1000r: true, sfv4: "DQB 3-level", "1290sdr": true, tuono: true } },
];

// Radar chart categories (0-100 normalised score)
export interface RadarStat {
  axis: string;
  scores: Record<string, number>;
}

export const radarStats: RadarStat[] = [
  {
    axis: "Power",
    scores: { mt10: 79, zh2: 94, s1000r: 78, sfv4: 100, "1290sdr": 86, tuono: 84 },
  },
  {
    axis: "Torque",
    scores: { mt10: 76, zh2: 97, s1000r: 79, sfv4: 86, "1290sdr": 100, tuono: 85 },
  },
  {
    axis: "Agility\n(low wt)",
    scores: { mt10: 85, zh2: 52, s1000r: 80, sfv4: 96, "1290sdr": 88, tuono: 92 },
  },
  {
    axis: "Electronics",
    scores: { mt10: 80, zh2: 72, s1000r: 92, sfv4: 100, "1290sdr": 86, tuono: 90 },
  },
  {
    axis: "Value",
    scores: { mt10: 100, zh2: 72, s1000r: 68, sfv4: 30, "1290sdr": 62, tuono: 80 },
  },
  {
    axis: "Top Speed",
    scores: { mt10: 78, zh2: 82, s1000r: 75, sfv4: 90, "1290sdr": 82, tuono: 84 },
  },
];
