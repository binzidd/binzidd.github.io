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
    period: "Feb 2026 - Present",
    current: true,
    color: "#00FF41",
    sections: [
      {
        heading: "Flagship Programme: Agentic Virtual Accountant (AVA)",
        bullets: [
          "Architected and built the skill layer that makes agentic AI scale in Finance: Finance SMEs author agent skills themselves, rather than engineers hand-writing deterministic Python functions for every process variant.",
          "Wrote the architecture decision records behind that design. Those ADRs are in use now and govern how the wider portfolio of Finance AI applications is scaled and reviewed, not only AVA.",
          "Lead AVA itself, spanning every business unit finance team across the bank, targeting the manual touchpoints that run finance operations: month-end close, organisational restructure and redundancy processing. A multi-year programme sequenced with the wider Finance transformation.",
          "Drive the enterprise definition layer, harmonising metric, process and control definitions across BU finance teams so agents operate against one agreed set of meanings rather than local variants.",
          "Own data requirements and transformation design end to end, with human-in-the-loop control points, auditability and lineage designed in from the start.",
        ],
      },
      {
        heading: "Delivery, Adoption & Product Ownership",
        bullets: [
          "Delivered and change-managed the Finance AI portfolio into business-as-usual, taking products built as Chapter Lead through rollout, training, adoption and operational ownership. SQL Weaver received a CFO quarterly excellence award in 2026.",
          "Product owner for SQL Weaver as a Service, extending it from a standalone application in production with 2,000 users into a consumable service, delivered with a fully offshore engineering team.",
          "Run delivery across timezones with squad members in Sydney and Bangalore, setting the operating rhythms and handover practices that make distributed work reliable.",
          "Partner with the Engineering chapter lead to keep applications lean and available, holding non-functional standards on cost, performance, resilience and uptime alongside feature delivery.",
          "Take products through the bank's architecture governance: high-level solution architecture (HLSA) reviews and risk assessment forums, defending design decisions to enterprise architects and risk partners.",
        ],
      },
      {
        heading: "Management & Leadership",
        bullets: [
          "Two chapters report to me, Reporting & Automation and AI & Platforms, including chapter leads and senior managers. Data scientists are chaptered into my squads, where I lead them on delivery.",
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
    period: "Mar 2022 - Jan 2026",
    current: false,
    color: "#008F11",
    sections: [
      {
        heading: "Chapter Management",
        bullets: [
          "Lead BI Reporting - chapter-level stewardship for analytics across finance.",
          "Defined capability & workforce plans with Talent Acquisition; steady IA→AA role conversions and an AWS certification initiative to upskill the team.",
          "Standardised tooling & ways of working (Tableau, Alteryx, DHP and GenAI patterns); created shared playbook and peer-review process.",
          "Designed chapter capability uplift roadmap: competency bands, learning pathways, staged assessments.",
          "Launched technical guilds, mentoring and cross-chapter forums; ran finance-cohort ML/GenAI training and manager coaching clinics.",
          "Established clear escalation paths between squads not operating in PACE, and chapters to protect delivery velocity.",
        ],
      },
      {
        heading: "Generative AI & AI Integration",
        bullets: [
          "SQL Weaver (Production): Built a GenAI natural-language-to-SQL platform using LangGraph + LangFuse, reranking and embedding cache. In production with 2,000 users; authored the rollout playbook and training behind adoption.",
          "XClaim (Production): Enhanced CBA's enterprise expense claim application with OCR capture and parsing that auto-populates expense categories in place of manual entry. Used by 90% of the application's 10,000 users; improved expense coding and general ledger hygiene at source.",
          "Policy RAG Bot (Production): Designed and shipped a Retrieval-Augmented Generation assistant for policy queries, covering chunking strategy, orchestration and embedding reuse.",
        ],
      },
      {
        heading: "Process Optimisation & Strategic Data",
        bullets: [
          "Built a governed metric layer housing 700+ finance metrics previously compiled by hand in Excel across separate teams. Every metric now resolves to an accountable source system, with auditable Tableau dashboards providing quality control.",
          "Delivered the Executive Leadership Team (ELT) Scorecard on top of it, giving leadership one consistent view of financial performance in place of competing spreadsheet versions.",
          "Built Payment Times statutory reporting with fuzzy matching across vendor addresses to resolve entity mismatches automatically, removing 30 hours of manual reconciliation from every submission.",
          "Built Market Share reporting that scrapes published APRA data and merges it with internal positions, removing 16 hours of manual collation from a monthly run, roughly 190 hours a year.",
          "Transformed manual reporting into automated pipelines and repeatable processes to improve reliability and reduce manual effort.",
        ],
      },
    ],
  },
  {
    id: "cba-manager-bi",
    role: "Manager, Business Intelligence Reporting",
    company: "Commonwealth Bank of Australia - IB&M Finance",
    location: "Sydney",
    period: "Mar 2020 - 2022",
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
    period: "Mar 2019 - Mar 2020",
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
      {
        heading: "Process & Operationalisation",
        bullets: [
          "Replaced ad-hoc manual processes with standardised runbooks and repeatable report development practices (SQL libraries, report templates, scheduling conventions).",
          "Defined SLA expectations for daily reporting and implemented alerting and owner-based remediation flow to reduce incidents and improve reliability.",
        ],
      },
    ],
  },
  {
    id: "cba-analyst-gems",
    role: "Analyst, GEMS Operations",
    company: "Commonwealth Bank of Australia",
    location: "Sydney",
    period: "Mar 2018 - Mar 2019",
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
    period: "Jun 2017 - Mar 2018",
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
    period: "Jun 2012 - May 2015",
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
    id: "ava",
    title: "AVA - Agentic Virtual Accountant",
    tagline: "Finance SMEs author the agents. Not engineers.",
    description:
      "The flagship agentic AI programme for Finance, spanning every business unit finance team across the bank. AVA targets the manual touchpoints that run finance operations: month-end close, organisational restructure and redundancy processing. The part that makes it scale is the skill layer, where Finance subject matter experts author agent skills themselves rather than engineers hand-writing deterministic Python functions for every process variant. Capability grows with the domain experts who own the process rather than with engineering headcount. The architecture decision records behind it are in use now and govern how the rest of the Finance AI portfolio scales and gets reviewed.",
    tech: ["MCP", "Agentic AI", "SME-Authored Skills", "ADRs", "LLM Orchestration", "Python"],
    status: "ideation",
    icon: "🤖",
    highlight: "Skill layer and ADRs shipped",
  },
  {
    id: "sql-weaver",
    title: "SQL Weaver",
    tagline: "Ask your data warehouse questions in plain English.",
    description:
      "A GenAI platform that translates natural language questions into optimised SQL. Built with LangGraph orchestration and LangFuse observability, with reranking and an embedding cache for latency. In production with 2,000 users and recognised with a CFO quarterly excellence award. Now being extended from a standalone application into a consumable service, delivered with a fully offshore engineering team.",
    tech: ["LangGraph", "LangFuse", "Python", "SQL", "Embeddings", "Reranking"],
    status: "production",
    icon: "🔍",
    highlight: "2,000 users · CFO excellence award",
  },
  {
    id: "xclaim-app",
    title: "XClaim",
    tagline: "Stop typing your receipts in.",
    description:
      "CBA's enterprise expense claim application, available to every employee. The enhancement added OCR capture and parsing that reads a receipt and auto-populates the expense category, replacing manual data entry. That removed a bank-wide manual step and improved expense coding and general ledger hygiene at source, which is the part Finance actually cares about. Used by 90% of the application's 10,000 users.",
    tech: ["OCR", "Document AI", "Streamlit", "AWS", "Python", "GenAI"],
    status: "production",
    icon: "⚡",
    highlight: "9,000 users · GL hygiene at source",
  },
  {
    id: "policy-rag-bot",
    title: "Policy RAG Bot",
    tagline: "Instant answers from policy documents via RAG.",
    description:
      "A Retrieval-Augmented Generation assistant that lets finance staff query complex policy documentation conversationally. Focuses on chunking strategy, orchestration patterns and embedding reuse to keep latency down and answer quality up. Shipped to production.",
    tech: ["RAG", "LangChain", "Python", "Vector DB", "Chunking", "Embeddings"],
    status: "production",
    icon: "📋",
  },
  {
    id: "metric-layer",
    title: "Governed Metric Layer",
    tagline: "700+ metrics, one accountable source each.",
    description:
      "Replaced more than 700 finance metrics that were previously compiled by hand in Excel spreadsheets across separate teams. Every metric now resolves to an accountable source system, with auditable Tableau dashboards providing quality control and drill-through into financial lead and lag indicators. The Executive Leadership Team Scorecard sits on top of it, giving leadership one consistent view of financial performance instead of competing spreadsheet versions.",
    tech: ["Tableau", "SQL", "Teradata", "Data Lake", "Lineage", "Python"],
    status: "production",
    icon: "📊",
    highlight: "700+ metrics off spreadsheets",
  },
  {
    id: "payment-times",
    title: "Payment Times & Market Share Reporting",
    tagline: "Fuzzy matching on vendor addresses. APRA data on a schedule.",
    description:
      "Two regulatory and market reporting builds. Payment Times is a statutory submission where vendor entity mismatches used to be reconciled by hand; fuzzy matching across vendor addresses now resolves them automatically, removing 30 hours from every submission and taking manual handling out of a regulated report. Market Share scrapes published APRA data and merges it with internal positions, removing 16 hours from a monthly run.",
    tech: ["Python", "Fuzzy Matching", "Web Scraping", "SQL", "Tableau", "APRA Data"],
    status: "production",
    icon: "⚖️",
    highlight: "~190 hours a year returned",
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
      "Project SPUR (2020–2022) was Binay's flagship initiative as Chapter Lead at CBA's IB&M Finance. He led end-to-end ingestion, modelling and productionisation using SQL & Python to deliver a unified Teradata repository for finance reporting and ELT decision-making - replacing fragmented manual reports with repeatable, auditable pipelines.",
  },
  {
    keywords: ["nl to sql", "natural language", "sql", "langgraph", "langfuse"],
    answer:
      "SQL Weaver is a GenAI natural-language-to-SQL platform built with LangGraph + LangFuse, featuring reranking and embedding caching. It is in production with 2,000 users at CBA and received a CFO quarterly excellence award in 2026. Binay authored the rollout playbook and ran chapter-wide training to drive adoption, and is now extending it into a consumable service with a fully offshore engineering team.",
  },
  {
    keywords: ["rag", "policy", "policy bot", "retrieval"],
    answer:
      "The Policy RAG Bot is in production, enabling finance staff to query policy documents conversationally. Binay led its design, focusing on chunking strategies, orchestration patterns, and embedding reuse to maximise answer quality and minimise latency.",
  },
  {
    keywords: ["xclaim", "claims", "expense", "ocr", "automation"],
    answer:
      "XClaim is CBA's enterprise expense claim application, used by every employee. Binay enhanced it with OCR capture and parsing that auto-populates expense categories in place of manual entry. It is in production, used by 90% of the application's 10,000 users, and has improved expense coding and general ledger hygiene at source.",
  },
  {
    keywords: ["education", "university", "masters", "degree", "mit"],
    answer:
      "Binay holds a dual Masters from The University of Sydney (2015–2017): a Master of Software Engineering and a Master of Software Engineering Management. He holds a Bachelor of Technology in Computer Science from ITER, India (2008–2012).",
  },
  {
    keywords: ["cba", "commonwealth bank", "chapter lead", "chapter area lead", "chapter"],
    answer:
      "Since February 2026, Binay has been Chapter Area Lead at CBA, with two chapters reporting to him, Reporting & Automation and AI & Platforms, including their chapter leads and senior managers. Data scientists are chaptered into his squads, where he leads them on delivery. His flagship programme is AVA (Agentic Virtual Accountant), a multi-year effort to automate manual finance-ops touchpoints across every business unit finance team at the bank.",
  },
  {
    keywords: ["skills", "technologies", "tech stack", "tools"],
    answer:
      "Binay's core stack spans: GenAI (LangGraph, LangFuse, RAG, Streamlit, Agentic AI/MCP), Data & BI (SQL, Python, Tableau, Alteryx, Snowflake, Teradata), Cloud (AWS ML Associate, AI Practitioner, Cloud Practitioner, Kafka), and Leadership (chapter management, workforce planning, coaching).",
  },
  {
    keywords: ["github", "repos", "code", "open source"],
    answer:
      "Binay's GitHub is github.com/binzidd - scroll down to the GitHub section of this portfolio to see his live repositories, including data projects and AI experiments.",
  },
  {
    keywords: ["usyd", "university of sydney", "student", "heatmap", "wifi", "geospatial"],
    answer:
      "At The University of Sydney (2017–2018), Binay built a Wi-Fi-based campus space-utilisation platform - ingesting raw Wi-Fi logs, anonymising device IDs, and producing Tableau heatmaps showing room occupancy hour by hour. He also built early-warning ML models (logistic regression, tree classifiers) to identify at-risk HDR students.",
  },
];
