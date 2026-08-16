// Hobby project page metadata — plain module (no "use client") so server
// code like generateStaticParams() in app/hobbies/[slug]/page.tsx can read it.

export interface ProjectMeta {
  icon: string;
  title: string;
  code: string;
  thesis: string;
  tags: string[];
  githubUrl: string;
  metrics: { value: string; label: string; sub?: string }[];
  findings: string[];
  sources: { label: string; url?: string }[];
  stack: string[];
  note: string;
}

export const PROJECT_META: Record<string, ProjectMeta> = {

  loopscoop: {
    icon: "🍦",
    title: "Loop & Scoop: Four Loops, One Till",
    code: "// loop_engineering",
    thesis: "Loop engineering taught on the smallest reconciliation in the world: an ice cream shop whose drawer is 125.30 short. Four loops, one cone, and an agent that ends up editing its own harness with the owner holding the pen.",
    tags: ["deepagents", "LangChain", "Loop Engineering", "Self-Improving Agents", "HITL", "Reconciliation"],
    githubUrl: "https://github.com/binzidd/loop-engineering-deepagents",
    metrics: [
      { value: "125.30", label: "the gap to explain",     sub: "till 1,412.50 vs drawer 1,287.20" },
      { value: "6",      label: "scoops on the cone",     sub: "4 on the card, 2 nobody wrote down" },
      { value: "40→3",   label: "minutes of Marco",       sub: "and the last three are the point" },
      { value: "1 of 2", label: "harness edits approved", sub: "the void check stays, by rule" },
    ],
    findings: [
      "Loop 1 is the one everyone builds and the one that quietly lies. Automating the four reasons on the laminated card clears 62.70 and leaves 62.60 unexplained, faster than before and no more correct.",
      "Loop 2 is four lines of Python, not a model. The cone has to add up to the gap and every void has to be labelled 'ask Marco'. A deterministic checker that returns jump_to: model is cheaper and stricter than any LLM judge.",
      "Loop 3 removes the human who starts the run, not the human who thinks. Thirty unattended nights is the win. Thirty nights of asking the same two questions is the tell that something upstream never learned.",
      "Loop 4 is the loop nobody ships: the agent proposes a patch to its own memory and prompt, an eval suite scores it against a held-out split, and an acceptance gate rejects anything that is not a strict improvement.",
      "The acceptance gate matters more than the optimiser. Disable it and the score wanders. Drop the generalise constraint and the training set hits 100% while held-out never moves, which is overfitting made visible rather than assumed.",
      "Some minutes are waste and some are the job. The over/short habit gets learned once. The void run stays in front of a person forever, because a shop where nobody looks at the till voids is not efficient, it just has a problem it has not found yet.",
    ],
    sources: [
      { label: "The Art of Loop Engineering, LangChain", url: "https://www.langchain.com/blog/the-art-of-loop-engineering" },
      { label: "Deep Agents documentation", url: "https://docs.langchain.com/oss/python/deepagents/overview" },
      { label: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)", url: "https://arxiv.org/abs/2303.11366" },
      { label: "ReAct: Synergizing Reasoning and Acting in Language Models (2022)", url: "https://arxiv.org/abs/2210.03629" },
      { label: "Every API signature verified against deepagents 0.6.12 with inspect.signature" },
    ],
    stack: ["deepagents 0.6.12", "LangChain 1.3.14", "Python 3.12", "Jupyter", "Vanilla JS + CSS (zero-dependency demo page)"],
    note: "The companion notebook runs all four loops against a live model. The demo page is self-contained and computes every figure in the browser from the same six scoops, so the numbers on screen are worked out rather than typed in.",
  },

  agents: {
    icon: "🤖",
    title: "Story of Agents",
    code: "// multi_agent_systems",
    thesis: "Six capability stages trace the full arc from tool-calling LLMs to autonomous agent-to-agent networks operating at machine speed inside the enterprise.",
    tags: ["Multi-Agent", "MCP", "LangGraph", "A2A", "LLM Observability", "Financial Services"],
    githubUrl: "https://github.com/binzidd/storyofagents",
    metrics: [
      { value: "6",      label: "capability stages",   sub: "tool call → A2A" },
      { value: "4",      label: "frameworks compared",  sub: "LangGraph · CrewAI · AutoGen · MCP" },
      { value: "N×M→N+M",label: "integration reduction",sub: "via Model Context Protocol" },
      { value: "∞",      label: "scale ceiling",        sub: "agent-to-agent delegation" },
    ],
    findings: [
      "Tool calling is the inflection: 2023 was the year every major LLM natively supported structured function invocation, making deterministic automation viable without fine-tuning.",
      "ReAct (Reason + Act) solved the loop problem: agents can observe tool outputs and re-plan mid-execution. LangGraph made this production-grade with typed state machines.",
      "MCP eliminates the N×M integration matrix. Every enterprise tool written once as an MCP server is instantly available to every MCP-compliant agent. The protocol is the USB standard for AI.",
      "A2A (Agent-to-Agent) is the virtual firm. Humans delegate goals, not tasks. Orchestrators decompose intent, specialists execute, synthesisers consolidate, all at machine latency.",
      "The unsolved problem is observability, not capability. Knowing what an agent chain did, why, in what order, and with what confidence is the production-readiness gap.",
      "Financial services is the highest-stakes test bed: compliance, audit trail, PII handling, and determinism requirements force rigour that makes general-purpose agents mature faster.",
    ],
    sources: [
      { label: "Anthropic Claude Tool Use docs" },
      { label: "LangGraph documentation & notebooks" },
      { label: "Google A2A protocol specification" },
      { label: "OpenAI function-calling changelog" },
      { label: "Enterprise case studies: FS sector (CBA, JPMorgan, Goldman)" },
    ],
    stack: ["React 19", "Framer Motion 12", "TypeScript", "SVG (custom layout engine)", "Next.js App Router"],
    note: "Agent topologies were modelled from public framework documentation and enterprise deployment patterns. No proprietary system diagrams reproduced.",
  },

  budget: {
    icon: "🏛️",
    title: "AU Federal Budget 2024-25: Trace the Money",
    code: "// fiscal_flow_analysis",
    thesis: "$738.5B decomposed into a 4-level Sankey, from revenue bucket to sub-program. Follow a dollar from your tax return to NDIS, defence, or debt servicing.",
    tags: ["Gov Data", "Sankey", "SVG Viz", "Fiscal Analysis", "ATO", "NDIS"],
    githubUrl: "https://github.com/binzidd/au-govt-budget-sankey",
    metrics: [
      { value: "$738.5B", label: "total budget 2024-25",  sub: "all Commonwealth outlays" },
      { value: "47.1%",   label: "from income tax",       sub: "$347.6B individual" },
      { value: "$58.6B",  label: "structural deficit",    sub: "net borrowing to close gap" },
      { value: "4 levels",label: "decomposition depth",   sub: "bucket → source → portfolio → program" },
    ],
    findings: [
      "Individual income tax is 47.1% of all revenue: bracket creep is quietly the government's most reliable revenue lever, growing automatically as wages rise without a budget vote.",
      "NDIS at $42B is the single fastest-growing line item. Demand is structural (disability prevalence + scheme access), not policy discretionary, making it functionally unbudgetable.",
      "Net borrowing funds 8% of spending. The deficit is structural, not cyclical: even at full employment (3.8% in 2024), the Commonwealth spends $58.6B more than it collects.",
      "Defence grew 23% in two years. AUKUS commitments and the Indo-Pacific strategic reassessment have rebaselined defence as a non-discretionary expenditure bloc.",
      "GST ($89.6B) is distributed to states unaltered: the Commonwealth collects it but the federal government doesn't control how it's spent, creating accountability diffusion.",
      "Superannuation tax concessions (~$50B, off-balance-sheet) rival NDIS in fiscal cost but appear nowhere in the main budget papers. They are the invisible transfer to high earners.",
    ],
    sources: [
      { label: "Budget Paper No.1 2024-25 (Treasury)", url: "https://budget.gov.au" },
      { label: "MYEFO 2024: Mid-Year Economic & Fiscal Outlook" },
      { label: "ATO Taxation Statistics 2022-23" },
      { label: "NDIS Quarterly Report Q4 FY2024" },
      { label: "AIHW: Government Health Expenditure" },
    ],
    stack: ["React 19", "TypeScript", "Custom SVG Sankey (no D3)", "Force-directed node layout (hand-built)", "Next.js"],
    note: "All Sankey node positions computed analytically from column assignments and vertical flow balancing, with no library layout engine. Values cross-validated against MYEFO final estimates.",
  },

  f1: {
    icon: "🏎️",
    title: "F1 2025 Championship: Bar Chart Race",
    code: "// championship_telemetry",
    thesis: "24 rounds, 1 championship. Watch constructor and driver standings shift round-by-round as McLaren's early dominance meets Verstappen's mid-season surge.",
    tags: ["Data Viz", "React", "Framer Motion", "F1 2025", "Championship Analysis"],
    githubUrl: "https://github.com/binzidd/f1-2025-championship-race",
    metrics: [
      { value: "24",    label: "rounds (2025 season)",  sub: "Bahrain → Abu Dhabi" },
      { value: "20",    label: "drivers tracked",       sub: "full grid, all teams" },
      { value: "25 pts",label: "winner takes",          sub: "per race, 1 for fastest lap" },
      { value: "∆47",   label: "Monza swing",           sub: "Norris DNF → Max extends" },
    ],
    findings: [
      "McLaren's MCL39 was the dominant car through the first 8 rounds: their 2024 aero philosophy (high-rake, rear-loaded downforce) translated directly to the new regs.",
      "Verstappen's title defence relied on circuit-specific peaks, not lap-time parity. Monaco, Montreal, Monza: tracks where car balance matters less than driver placement.",
      "The Norris DNF at Monza was the statistical hinge of the season: a 47-point swing in a single race shifted the probability of each winning the title by ~35 percentage points.",
      "Ferrari's upgrade at Monaco delivered genuine Q3 competitiveness, with their wind tunnel correlation issues from 2024 partially resolved by mid-season.",
      "Constructor standings told a different story from drivers: McLaren's points stability (two cars consistently in the top 6) made them WCC favourites from round 4 onwards.",
      "Hamilton's transition to Ferrari was a storyline, not a title threat: adapting to the Ferrari's rotation-first philosophy took the full season.",
    ],
    sources: [
      { label: "Formula 1 Official Race Results", url: "https://www.formula1.com/results" },
      { label: "Ergast API: historical race data" },
      { label: "FastF1 Python library telemetry cross-validation" },
      { label: "FIA stewards decisions (DNF classification)" },
    ],
    stack: ["React 19", "Framer Motion 12", "TypeScript", "SVG animated bars", "Custom race data pipeline"],
    note: "2025 round data sourced from official F1 results and cross-validated against Ergast. The animation runs at 800ms per round, fast enough to feel live, slow enough to read the gaps.",
  },

  starlink: {
    icon: "🛰️",
    title: "Starlink Constellation: Satellite Growth & NSW Passes",
    code: "// orbital_mechanics_viz",
    thesis: "From 60 satellites in 2019 to 7,000+ operational in 2024. The fastest infrastructure deployment in human history: modelled, mapped, and timed over Sydney.",
    tags: ["Space Data", "Orbital Mechanics", "LEO", "SpaceX", "Pass Prediction"],
    githubUrl: "https://github.com/binzidd/starlink-constellation-viz",
    metrics: [
      { value: "7,000+",  label: "operational satellites",  sub: "as of late 2024" },
      { value: "6",       label: "orbital shells",          sub: "340km VLEO → 1,200km" },
      { value: "~25ms",   label: "latency (VLEO)",          sub: "down from ~40ms at 550km" },
      { value: "4-6×/day",label: "quality passes at 34°S",  sub: "elevation > 30° over Sydney" },
    ],
    findings: [
      "The 2023 transition from LEO 540km to VLEO 340km was the network's latency inflection, enabling gaming and enterprise tiers that couldn't be served at higher altitude.",
      "7,000 satellites sounds like saturation but is 17% of the FCC-authorised 12,000 cap, and <17% of SpaceX's ITU-reserved V2 system allocation of 42,000.",
      "At 34°S latitude (Sydney), the geometry of Starlink's inclined shells means 4-6 high-quality passes per day (elevation > 30°), enough for continuous broadband with handoff.",
      "The constellation's reliability comes from redundancy, not individual satellite uptime: each shell has enough spares that a satellite failure causes 0 coverage impact.",
      "Kessler cascade risk becomes analytically non-trivial above ~6,000 operational LEO satellites at 550km. SpaceX's deorbit-within-5-years commitment is the key mitigation.",
      "Pass prediction for a ground station at 34°S was computed analytically from Keplerian orbital parameters: no external API, all mathematics in TypeScript.",
    ],
    sources: [
      { label: "SpaceX Starlink launch manifests (public press releases)" },
      { label: "Celestrak TLE archive", url: "https://celestrak.org" },
      { label: "FCC satellite licence filings" },
      { label: "ITU radio regulations filing database" },
      { label: "NASA Debris Assessment Software (DAS) methodology" },
    ],
    stack: ["React 19", "TypeScript", "SVG orbital diagram (custom Keplerian math)", "Pass geometry computed analytically", "Next.js"],
    note: "Orbital positions are illustrative geometry, not real-time TLE propagation. Pass windows computed from simplified two-body mechanics with J2 perturbation correction for latitude accuracy.",
  },

  banking: {
    icon: "🏦",
    title: "Big 4 + Macquarie: Post-COVID Rate Cycle & Deposit Wars",
    code: "// apra_rate_analysis",
    thesis: "The largest RBA tightening cycle in 30 years exposed a structural split: Macquarie led rates by 30-70bps for 18 months and captured deposit market share the Big 4 couldn't reclaim.",
    tags: ["APRA Data", "Finance", "Rate Analysis", "Market Share", "RBA", "Deposit Competition"],
    githubUrl: "https://github.com/binzidd/au-banking-rate-analysis",
    metrics: [
      { value: "0.10%→4.35%", label: "RBA cash rate cycle",     sub: "Nov 2020 → Nov 2023" },
      { value: "+133%",        label: "Macquarie deposit share", sub: "relative gain 2020–2024" },
      { value: "30-70bps",     label: "Macquarie premium",       sub: "above Big 4 savings rate" },
      { value: "$48B",         label: "Macquarie deposits",       sub: "from $14B at cycle start" },
    ],
    findings: [
      "The Big 4 used the near-zero era (2020–22) to protect Net Interest Margin by not passing RBA cuts to savers. Macquarie maintained positive real spread, a deliberate growth play.",
      "When the hike cycle started in May 2022, Macquarie moved in 48 hours. The Big 4 lagged by 4-6 weeks on average, enough for 12-18 months of deposit inflows before the gap closed.",
      "CBA's pricing power is structural: even at a 25-35bps savings rate disadvantage, customers don't move. Brand inertia plus ecosystem lock-in (home loan + everyday account) suppresses churn.",
      "The NAB/WBC term deposit anomaly: both offered higher 12-month TDs (4.85%) than their own savings rates (4.65%) in late 2024. Savers weren't bothering to lock in, preferring liquidity.",
      "February 2025 marked the first RBA cut. The Macquarie premium is now compressing. Watch for Big 4 pricing to stabilise as the competitive pressure from Macquarie normalises.",
      "APRA's deposit market share data lags 6 months: the real impact of Macquarie's rate leadership on FY2024 deposit balances is only fully visible in the ADI statistics released mid-2025.",
    ],
    sources: [
      { label: "APRA ADI Statistics: monthly household deposits", url: "https://www.apra.gov.au" },
      { label: "RBA official cash rate decisions history" },
      { label: "Bank product pages (Wayback Machine for historical rates)" },
      { label: "APRA deposit market share reports (quarterly)" },
      { label: "Bank annual reports FY2020–FY2024 (NIM disclosures)" },
    ],
    stack: ["React 19", "TypeScript", "SVG time-series (custom)", "APRA data pipeline (Node.js)", "Next.js"],
    note: "Rate history hand-curated from APRA ADI Monthly Statistics and bank product archives. Where exact historical rates weren't publicly preserved, values are APRA-reported best-savings averages ±5bps.",
  },

  moto: {
    icon: "🏍️",
    title: "Yamaha MT-10 2023: Hypernaked Class Head-to-Head",
    code: "// spec_analysis_hypernaked",
    thesis: "The MT-10's CP4 engine is shared with the YZF-R1, yet it sells for 40% less. Against Ducati, BMW, KTM, Kawasaki and Aprilia: is this the best value performance motorcycle made?",
    tags: ["Spec Analysis", "Motorbikes", "Spider Chart", "Multi-Dimensional", "Value Engineering"],
    githubUrl: "https://github.com/binzidd/mt10-hypernaked-showdown",
    metrics: [
      { value: "6",       label: "bikes compared",        sub: "full class coverage" },
      { value: "165hp",   label: "MT-10 peak power",     sub: "998cc CP4, same as R1" },
      { value: "$21,999", label: "MT-10 MSRP (AUD)",    sub: "best hp/$ in class" },
      { value: "10+",     label: "spec dimensions",      sub: "power, weight, torque, tech…" },
    ],
    findings: [
      "The CP4 engine makes the MT-10 the best value proposition in the class by a significant margin: you're paying $21,999 for R1 DNA, minus the aero package and electronic map refinement.",
      "Ducati Streetfighter V4 at 208hp is the class performance ceiling, but at $37,995 AUD it carries the full Ducati tax, plus a maintenance interval that assumes a dealer relationship.",
      "BMW S1000R is the electronics benchmark: ShiftCam variable valve timing is unique to the class and gives it a torque curve that's genuinely wide. Price is justified by the engineering.",
      "Weight is the real separator at real-world speeds. KTM 1290's 229kg vs MT-10's 210kg is 19kg. A lanesplit, a U-turn, or a wet roundabout is where that gap becomes kinetic.",
      "Aprilia Tuono V4 is the purist's choice: the most characterful V4 engine in the class, best cornering package (APRC electronics), but no cruise control and the highest seat height at 845mm.",
      "My MT-10 delivers on its promise: 0-100 in 3.0s, 210kg, 165hp, $21,999. The spec sheet is the case: this analysis was built to verify I made the right call, and the data agrees.",
    ],
    sources: [
      { label: "Yamaha Australia 2023 MT-10 spec sheet" },
      { label: "Kawasaki Australia Z H2 specifications" },
      { label: "BMW Motorrad S1000R 2023 technical datasheet" },
      { label: "Ducati Australia Streetfighter V4 specifications" },
      { label: "KTM 1290 Super Duke R product page" },
      { label: "Aprilia Tuono V4 2023 specifications" },
      { label: "MCN, RideApart, MotoMatch AU independent reviews" },
    ],
    stack: ["React 19", "TypeScript", "SVG spider chart (polar coordinates, hand-built)", "Spec bar component", "Electronics matrix table"],
    note: "All specifications from manufacturer Australian market pages as of Q1 2023. Power figures are claimed (bhp at crank). Real-world dyno figures are typically 8-12% lower.",
  },

  carbon: {
    icon: "🌏",
    title: "Australia's Carbon Story: Emissions, Targets & the EV Inflection",
    code: "// emissions_trajectory_analysis",
    thesis: "Australia peaked at 617.8 Mt CO₂-e in 2007. With 4 years to the legislated 2030 target, the gap stands at 105 Mt and the required reduction rate is 3× current pace.",
    tags: ["Climate Data", "DCCEEW", "OWID", "EV Adoption", "Net Zero 2050", "Sector Analysis"],
    githubUrl: "https://github.com/binzidd/au_carbon_emissions",
    metrics: [
      { value: "448 Mt",    label: "current (2024 est.)",  sub: "CO₂-e all GHGs" },
      { value: "105 Mt",    label: "gap to 2030 target",   sub: "342.9 Mt required" },
      { value: "4 yrs",     label: "to deadline",          sub: "Climate Change Act 2022" },
      { value: "+195%",     label: "EV sales growth",      sub: "Australia 2023 vs 2022" },
    ],
    findings: [
      "Electricity is the success story: renewables dropped the sector's share from 37% of national emissions (2007) to 29% today, bending the curve by ~50 Mt since peak.",
      "Transport is the structural problem. Australia's 20-million-vehicle fleet turns over at ~1.5M new vehicles per year. Even with 100% EV new-car sales today, full fleet electrification takes 13 years.",
      "Fugitive emissions (LNG) grew 4 Mt since 2015, quietly offsetting a portion of electricity's gains. The LNG expansion paradox: Australia exports low-carbon energy enablers while increasing its own methane footprint.",
      "Agriculture is the intractable sector. Livestock methane and soil nitrous oxide don't respond to electrification. Carbon sequestration via soil carbon projects is the only credible mechanism, and MRV is expensive.",
      "The 2030 target (342.9 Mt, −43% on 2005 baseline) requires cutting ~26 Mt per year from today. Current pace is ~14 Mt/year. The required acceleration is 1.9×.",
      "The EV inflection (~2026-27 projected) will bend the transport curve, but the fleet composition lag means transport emissions won't fall materially until 2029-30, just as the target deadline hits.",
    ],
    sources: [
      { label: "Our World in Data: CO₂ and GHG Emissions (OWID)", url: "https://github.com/owid/co2-data" },
      { label: "DCCEEW National Greenhouse Gas Inventory Quarterly Update" },
      { label: "FCAI VFACTS Annual EV Sales Reports" },
      { label: "Climate Change Act 2022 (Cth): targets schedule" },
      { label: "AEMO Integrated System Plan 2024" },
    ],
    stack: ["React 19", "TypeScript", "SVG multi-chart (custom)", "GitHub Actions auto-refresh (OWID CSV)", "Node.js fetch pipeline"],
    note: "EMISSIONS_HISTORY is auto-refreshed monthly via GitHub Actions from OWID's owid-co2-data.csv. Sector data is from DCCEEW quarterly updates and interpolated linearly between survey years. EV projections are modelled from FCAI VFACTS trends with S-curve adoption assumption.",
  },
};
