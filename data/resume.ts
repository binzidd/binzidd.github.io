export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  color: string;
  sections: {
    heading: string;
    bullets: string[];
  }[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  status: "production" | "pre-prod" | "prototype" | "ideation" | "alumni";
  icon: string;
  highlight?: string;
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}

export interface Certification {
  name: string;
  issuer: string;
  icon: string;
  color: string;
}

export interface QAEntry {
  keywords: string[];
  answer: string;
}

// ─── Experience ────────────────────────────────────────────────────────────────
export const experience: Experience[] = [
  {
    id: "cba-chapter-area-lead",
    role: "Chapter Area Lead",
    company: "Commonwealth Bank of Australia",
    location: "Sydney",
    period: "Feb 2026 — Present",
    current: true,
    color: "#00FF41",
    sections: [
      {
        heading: "Management & Leadership",
        bullets: [
          "Provide system-level stewardship to build scalable analytics/engineering capability across domains and deliver long-term business outcomes.",
          "Strengthen leadership across chapters by improving prioritisation discipline, delivery standards and capability benches for current demand and future strategy.",
          "Translate innovation into sustainable BAU by establishing clear ownership, operating rhythms, monitoring and lifecycle management from day one.",
          "Align delivery to governance, risk and control expectations; make trade-offs explicit and ensure accountability is clear when demand exceeds capacity.",
          "Anchor investment and sequencing decisions to measurable business impact, resilience and maintainability at scale.",
        ],
      },
      {
        heading: "Technical & Engineering",
        bullets: [
          "Build strong engineering foundations through disciplined data engineering, governed pipelines and robust feature engineering practices.",
          "Ensure AI/ML techniques are embedded deliberately and responsibly within production environments (not as isolated initiatives).",
          "Drive production-grade design standards for reliability, observability, security and operability across data/ML systems.",
          "Establish patterns for reusable data products and fit-for-purpose platforms that improve productivity and decision-making in measurable ways.",
        ],
      },
    ],
  },
  {
    id: "cba-chapter-lead",
    role: "Chapter Lead, FS Analytics",
    company: "Commonwealth Bank of Australia",
    location: "Sydney",
    period: "Mar 2022 — Jan 2026",
    current: false,
    color: "#008F11",
    sections: [
      {
        heading: "Chapter Management",
        bullets: [
          "Lead BI Reporting — chapter-level stewardship for analytics across finance.",
          "Defined capability & workforce plans with Talent Acquisition; zero attrition, steady IA→AA role conversions, AWS certification initiative to upskill the team.",
          "Standardised tooling & ways of working (Tableau, Alteryx, DHP and GenAI patterns); created shared playbook and peer-review process.",
          "Designed chapter capability uplift roadmap: competency bands, learning pathways, staged assessments.",
          "Launched technical guilds, mentoring and cross-chapter forums; ran finance-cohort ML/GenAI training and manager coaching clinics.",
          "Established clear escalation paths between squads not operating in PACE, and chapters to protect delivery velocity.",
        ],
      },
      {
        heading: "Generative AI & AI Integration",
        bullets: [
          "NL-to-SQL (Pre-prod): Built a GenAI interface using LangGraph + LangFuse, reranking and embedding cache. Adopted by 200+ FS users; authored rollout playbook.",
          "Policy RAG Bot (Pre-prod): Leading design of a Retrieval-Augmented Generation bot for policy queries — chunking, orchestration and embedding reuse.",
          "Agentic Month-End & MCP Ecosystem (Ideation): Driving strategy and architecture for AI agents in month-end reporting workflows.",
          "XClaim App (Prototype): Delivered Streamlit/AWS prototype demonstrating end-to-end claims automation.",
        ],
      },
      {
        heading: "Process Optimisation & Strategic Data",
        bullets: [
          "Transformed manual reporting into automated pipelines and repeatable processes to improve reliability and reduce manual effort.",
          "ELT Scorecard: Designed a reusable data-lake architecture and Tableau layer with lineage and drill-through into financial lead and lag indicators.",
        ],
      },
    ],
  },
  {
    id: "cba-manager-bi",
    role: "Manager, Business Intelligence Reporting",
    company: "Commonwealth Bank of Australia — IB&M Finance",
    location: "Sydney",
    period: "Mar 2020 — 2022",
    current: false,
    color: "#006600",
    sections: [
      {
        heading: "Process Optimisation & Strategic Data",
        bullets: [
          "Led Project SPUR: end-to-end ingestion, modelling and productionisation (SQL & Python) delivering a unified Teradata repository for finance reporting and ELT decision-making.",
          "Replaced fragmented manual reports with repeatable processes and operational runbooks, improving timeliness and reliability of monthly and ad-hoc finance reports.",
          "Operationalised data contracts and lineage practices to support auditability and BAU handover.",
        ],
      },
      {
        heading: "Technical & Data Integration",
        bullets: [
          "Directed integration of Risk, Finance, Treasury and Capital source systems; normalised feeds and enabled consolidated P&L and capital views.",
          "Owned technical design choices for modelling and data movement, ensuring production readiness.",
          "Documented standards and runbooks to enable consistent handover and scale across finance teams.",
        ],
      },
    ],
  },
  {
    id: "cba-senior-analyst",
    role: "Senior Analyst, Capital Technology",
    company: "Commonwealth Bank of Australia",
    location: "Sydney",
    period: "Mar 2019 — Mar 2020",
    current: false,
    color: "#B89070",
    sections: [
      {
        heading: "Reporting & Visualisation",
        bullets: [
          "Owned daily capital reporting: designed SQL-driven reports and Tableau dashboards delivering key capital metrics to Risk, Treasury and Finance.",
          "Designed dashboards with user journeys and visualisation best practice; prototyped and converted stakeholder requirements into production dashboards.",
          "Produced actionable insights from capital and P&L datasets to support daily and ad-hoc executive decisions.",
        ],
      },
      {
        heading: "Data Preparation & Controls",
        bullets: [
          "Performed data preparation, blending and cleansing of multiple capital feeds to ensure accuracy of daily capital measures and RWA calculations.",
          "Implemented reconciliation checks and data-quality SLIs to validate inputs and detect anomalies before downstream reporting.",
        ],
      },
    ],
  },
  {
    id: "cba-analyst-gems",
    role: "Analyst, GEMS Operations",
    company: "Commonwealth Bank of Australia",
    location: "Sydney",
    period: "Mar 2018 — Mar 2019",
    current: false,
    color: "#C8A88C",
    sections: [
      {
        heading: "Reporting & Visualisation",
        bullets: [
          "Delivered daily and monthly capital reporting and Tableau dashboards for large-exposure and portfolio movement analysis.",
          "Prototyped requirements with stakeholders and converted prototypes into production dashboards and scheduled reports.",
        ],
      },
      {
        heading: "Data Preparation & Controls",
        bullets: [
          "Performed extraction, cleansing and transformation of Loan IQ and capital feeds for accurate RWA and capital metrics.",
          "Introduced reconciliation checks, documented data lineage and data contracts to improve auditability.",
        ],
      },
    ],
  },
  {
    id: "usyd-analyst",
    role: "Analyst",
    company: "The University of Sydney",
    location: "Sydney",
    period: "Jun 2017 — Mar 2018",
    current: false,
    color: "#9B7EA0",
    sections: [
      {
        heading: "Analytics & Systems Integration",
        bullets: [
          "Engineered analytics integrations between Canvas, institutional systems and AWS-hosted data sources using API calls (Postman) and direct AWS RDS queries.",
          "Built repeatable ETL patterns using Alteryx; scheduled batch jobs to pull, transform and load LMS datasets into analytical schemas.",
          "Developed SQL libraries and production runbooks for repeatable report development.",
        ],
      },
      {
        heading: "Geospatial Space-Utilisation Platform",
        bullets: [
          "Designed and implemented a Wi-Fi-based geolocation pipeline: ingested raw Wi-Fi logs, anonymised device identifiers, applied geospatial clustering to infer student movement.",
          "Produced space-utilisation heatmaps and hour-by-hour occupancy metrics in Tableau to inform campus space planning.",
          "Implemented privacy-preserving measures (hashing, access control, row-level security).",
        ],
      },
      {
        heading: "Predictive Analytics & Student Insights",
        bullets: [
          "Built early-warning predictive models (logistic regression / tree-based classifiers) for HDR student outcomes, using LMS activity and attendance proxies from Wi-Fi.",
          "Partnered with Student Services to translate model outputs into actionable intervention triggers and dashboards.",
        ],
      },
    ],
  },
  {
    id: "adobe-systems-engineer",
    role: "Systems Engineer",
    company: "Adobe Systems Inc",
    location: "Mumbai",
    period: "Jun 2012 — May 2015",
    current: false,
    color: "#CC5533",
    sections: [
      {
        heading: "HCI, UX Collaboration & Stakeholder Translation",
        bullets: [
          "Collaborated in Human-Computer Interaction brainstorming with distinguished engineers and product teams; translated business/UX requirements into technical design considerations.",
          "Presented technical trade-offs and implementation options in business language to stakeholders, enabling pragmatic decisions balancing UX, performance and maintainability.",
        ],
      },
      {
        heading: "Instrumentation, Logs & Application Flow",
        bullets: [
          "Built automated log-scraping scripts and parsers to reconstruct end-to-end application flows from server logs; used traces for root-cause analysis and performance hotspot identification.",
          "Instrumented application and infrastructure logs with structured fields and produced operational runbooks.",
        ],
      },
      {
        heading: "Experiment Analysis & Business Translation",
        bullets: [
          "Performed A/B experiment analysis using SQL: computed lift, conversion rates, confidence intervals and significance tests; translated statistical results into business recommendations.",
          "Worked with distinguished engineers and product owners to scope hypotheses, define success metrics and productionise winning variants.",
        ],
      },
    ],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: "nl-to-sql",
    title: "Natural Language to SQL",
    tagline: "Ask your data warehouse questions in plain English.",
    description:
      "A GenAI-powered interface that translates natural language questions into optimised SQL queries. Built with LangGraph orchestration and LangFuse observability, featuring reranking and an embedding cache for performance. Rolled out to 200+ FS users at CBA with a dedicated adoption playbook and chapter-wide training programme.",
    tech: ["LangGraph", "LangFuse", "Python", "SQL", "Embeddings", "Reranking"],
    status: "pre-prod",
    icon: "🔍",
    highlight: "200+ users adopted",
  },
  {
    id: "policy-rag-bot",
    title: "Policy RAG Bot",
    tagline: "Instant answers from policy documents via RAG.",
    description:
      "A Retrieval-Augmented Generation bot that enables finance staff to query complex policy documentation through a conversational interface. Focuses on intelligent chunking strategies, orchestration patterns, and embedding reuse to minimise latency and maximise answer quality.",
    tech: ["RAG", "LangChain", "Python", "Vector DB", "Chunking", "Embeddings"],
    status: "pre-prod",
    icon: "📋",
  },
  {
    id: "xclaim-app",
    title: "XClaim App",
    tagline: "Automated claims processing — from days to minutes.",
    description:
      "A Streamlit and AWS-backed prototype demonstrating end-to-end claims automation. The app showcases how GenAI can reduce manual claims handling through intelligent document parsing, classification, and workflow automation — built as a proof-of-concept to drive executive buy-in.",
    tech: ["Streamlit", "AWS", "Python", "GenAI", "Document AI"],
    status: "prototype",
    icon: "⚡",
  },
  {
    id: "agentic-month-end",
    title: "Agentic Month-End & MCP Ecosystem",
    tagline: "AI agents for autonomous finance close processes.",
    description:
      "A strategic initiative to architect an MCP (Model Context Protocol) ecosystem enabling AI agents to autonomously execute month-end reporting workflows. Currently in ideation and design phases, defining agent topology, human-in-the-loop checkpoints, and measurable business impact metrics.",
    tech: ["MCP", "Agentic AI", "LLM Orchestration", "Python", "AWS"],
    status: "ideation",
    icon: "🤖",
  },
  {
    id: "elt-scorecard",
    title: "ELT Scorecard",
    tagline: "A single source of truth for finance KPIs.",
    description:
      "Designed a reusable data-lake architecture underpinning a Tableau reporting layer with full lineage tracking and drill-through capability into financial lead and lag indicators. Transformed how IB&M Finance teams access and trust their data, replacing fragmented manual reports.",
    tech: ["Tableau", "SQL", "Teradata", "Data Lake", "Python"],
    status: "production",
    icon: "📊",
  },
  {
    id: "usyd-space-heatmaps",
    title: "Campus Space Intelligence",
    tagline: "Understanding how a university lives and breathes.",
    description:
      "A Wi-Fi-based geolocation pipeline built for The University of Sydney that ingests raw Wi-Fi logs, anonymises device identifiers, and applies geospatial clustering to infer student movement patterns. Produced hour-by-hour occupancy heatmaps in Tableau that informed campus space planning and timetabling decisions.",
    tech: ["Tableau", "Alteryx", "AWS RDS", "Geospatial", "Python", "ETL"],
    status: "alumni",
    icon: "🗺️",
  },
];

// ─── Skills ────────────────────────────────────────────────────────────────────
export const skillCategories: SkillCategory[] = [
  {
    name: "Generative AI",
    skills: [
      { name: "LangGraph", level: 90 },
      { name: "LangFuse", level: 85 },
      { name: "RAG Architecture", level: 92 },
      { name: "Streamlit", level: 88 },
      { name: "Agentic AI / MCP", level: 80 },
      { name: "Prompt Engineering", level: 90 },
    ],
  },
  {
    name: "Data & BI",
    skills: [
      { name: "Tableau", level: 95 },
      { name: "SQL", level: 95 },
      { name: "Python", level: 88 },
      { name: "Alteryx", level: 90 },
      { name: "Snowflake", level: 85 },
      { name: "Teradata", level: 82 },
    ],
  },
  {
    name: "Cloud & Infrastructure",
    skills: [
      { name: "AWS (ML/AI)", level: 88 },
      { name: "AWS (Core)", level: 85 },
      { name: "Apache Kafka", level: 72 },
      { name: "Data Lake Design", level: 88 },
    ],
  },
  {
    name: "Leadership",
    skills: [
      { name: "Chapter Management", level: 95 },
      { name: "Workforce Planning", level: 90 },
      { name: "Coaching & Mentoring", level: 92 },
      { name: "Stakeholder Communication", level: 93 },
    ],
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────
export const certifications: Certification[] = [
  { name: "AWS Machine Learning Associate", issuer: "Amazon Web Services", icon: "🤖", color: "#FF9900" },
  { name: "AWS AI Practitioner", issuer: "Amazon Web Services", icon: "🧠", color: "#FF9900" },
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", icon: "☁️", color: "#FF9900" },
  { name: "Snowflake Data Warehouse", issuer: "Snowflake", icon: "❄️", color: "#29B5E8" },
  { name: "Snowflake Data Applications", issuer: "Snowflake", icon: "❄️", color: "#29B5E8" },
  { name: "Alteryx Core & Advanced", issuer: "Alteryx", icon: "⚙️", color: "#0078C8" },
  { name: "Apache Kafka Fundamentals", issuer: "Confluent", icon: "📨", color: "#231F20" },
  { name: "Tableau Community Leader", issuer: "Tableau / Salesforce", icon: "📈", color: "#E97627" },
  { name: "Tableau Data Scientist", issuer: "Tableau / Salesforce", icon: "📈", color: "#E97627" },
  { name: "Tableau Data Steward", issuer: "Tableau / Salesforce", icon: "📈", color: "#E97627" },
  { name: "Tableau Desktop Specialist", issuer: "Tableau / Salesforce", icon: "📈", color: "#E97627" },
];

// ─── Q&A for Command Palette ──────────────────────────────────────────────────
export const qaEntries: QAEntry[] = [
  {
    keywords: ["adobe", "systems engineer", "hci", "ux"],
    answer:
      "At Adobe Systems (2012–2015), Binay worked as a Systems Engineer in Mumbai, collaborating in HCI brainstorming sessions with distinguished engineers and product teams. He translated UX requirements into technical design, ran A/B experiment analysis (computing lift, conversion rates, confidence intervals), and presented outcomes in business language to drive pragmatic product decisions.",
  },
  {
    keywords: ["project spur", "spur", "teradata", "ib&m"],
    answer:
      "Project SPUR (2020–2022) was Binay's flagship initiative as Chapter Lead at CBA's IB&M Finance. He led end-to-end ingestion, modelling and productionisation using SQL & Python to deliver a unified Teradata repository for finance reporting and ELT decision-making — replacing fragmented manual reports with repeatable, auditable pipelines.",
  },
  {
    keywords: ["nl to sql", "natural language", "sql", "langgraph", "langfuse"],
    answer:
      "The NL-to-SQL interface is a GenAI project built with LangGraph + LangFuse, featuring reranking and embedding caching. It allows 200+ FS users at CBA to query databases in plain English. Binay authored the rollout playbook and ran chapter-wide training to ensure adoption.",
  },
  {
    keywords: ["rag", "policy", "policy bot", "retrieval"],
    answer:
      "The Policy RAG Bot (pre-production) is a Retrieval-Augmented Generation system enabling finance staff to query policy documents conversationally. Binay is leading its design, focusing on chunking strategies, orchestration patterns, and embedding reuse to maximise answer quality and minimise latency.",
  },
  {
    keywords: ["xclaim", "claims", "streamlit", "automation"],
    answer:
      "XClaim is a Streamlit + AWS prototype demonstrating end-to-end claims automation with GenAI. Built as a proof-of-concept, it showcases intelligent document parsing and workflow automation to reduce manual claims handling from days to minutes.",
  },
  {
    keywords: ["education", "university", "masters", "degree", "mit", "hci"],
    answer:
      "Binay holds two Masters degrees from The University of Sydney (2015–2017): a Masters of Information Technology specialising in Human-Computer Interaction, and a Masters of IT Management focusing on Software Engineering Management. He holds a Bachelor of Technology in Computer Science from ITER, India (2008–2012).",
  },
  {
    keywords: ["cba", "commonwealth bank", "chapter lead", "chapter"],
    answer:
      "Since March 2022, Binay has been Chapter Area Lead - FS Analytics at CBA. He leads BI reporting stewardship across finance, has achieved zero chapter attrition, launched AWS certification initiatives, standardised tooling (Tableau, Alteryx, GenAI patterns), and runs technical guilds and ML/GenAI training.",
  },
  {
    keywords: ["skills", "technologies", "tech stack", "tools"],
    answer:
      "Binay's core stack spans: GenAI (LangGraph, LangFuse, RAG, Streamlit, Agentic AI/MCP), Data & BI (SQL, Python, Tableau, Alteryx, Snowflake, Teradata), Cloud (AWS ML Associate, AI Practitioner, Cloud Practitioner, Kafka), and Leadership (chapter management, workforce planning, coaching).",
  },
  {
    keywords: ["github", "repos", "code", "open source"],
    answer:
      "Binay's GitHub is github.com/binzidd — scroll down to the GitHub section of this portfolio to see his live repositories, including data projects and AI experiments.",
  },
  {
    keywords: ["usyd", "university of sydney", "student", "heatmap", "wifi", "geospatial"],
    answer:
      "At The University of Sydney (2017–2018), Binay built a Wi-Fi-based campus space-utilisation platform — ingesting raw Wi-Fi logs, anonymising device IDs, and producing Tableau heatmaps showing room occupancy hour by hour. He also built early-warning ML models (logistic regression, tree classifiers) to identify at-risk HDR students.",
  },
];
