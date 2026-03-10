export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  R: "#198CE7",
  SQL: "#e38c00",
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#A8A29E";
  return LANGUAGE_COLORS[language] ?? "#8B7355";
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/binzidd/repos?sort=created&direction=desc&per_page=9&type=public",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data: GitHubRepo[] = await res.json();
    // Sort by created_at descending (newest first), already done by API but be explicit
    return data
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 9);
  } catch {
    return FALLBACK_REPOS;
  }
}

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 10,
    name: "mt10-hypernaked-showdown",
    description: "Retro viz comparing Yamaha MT-10 2023 vs Z H2, S1000R, Streetfighter V4, 1290 Super Duke R & Tuono V4",
    html_url: "https://github.com/binzidd/mt10-hypernaked-showdown",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    updated_at: "2026-03-10T00:00:00Z",
    topics: ["react", "framer-motion", "vite", "data-viz", "motorbike"],
  },
  {
    id: 9,
    name: "au-banking-rate-analysis",
    description: "Big 4 + Macquarie post-COVID rate cycle & APRA deposit market share viz",
    html_url: "https://github.com/binzidd/au-banking-rate-analysis",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    updated_at: "2026-03-10T00:00:00Z",
    topics: ["react", "apra", "banking", "data-viz", "australia"],
  },
  {
    id: 8,
    name: "starlink-constellation-viz",
    description: "SpaceX Starlink satellite deployment timeline and NSW pass frequency visualisation",
    html_url: "https://github.com/binzidd/starlink-constellation-viz",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    updated_at: "2026-03-10T00:00:00Z",
    topics: ["react", "space", "starlink", "data-viz"],
  },
  {
    id: 7,
    name: "f1-2025-championship-race",
    description: "Animated F1 2025 bar chart race — Verstappen comeback story across 16 rounds",
    html_url: "https://github.com/binzidd/f1-2025-championship-race",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    updated_at: "2026-03-10T00:00:00Z",
    topics: ["react", "framer-motion", "f1", "data-viz"],
  },
  {
    id: 4,
    name: "nl-to-sql",
    description: "Natural language to SQL interface using LangGraph + LangFuse with reranking & embedding cache",
    html_url: "https://github.com/binzidd",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: "2025-06-01T00:00:00Z",
    topics: ["langgraph", "langfuse", "genai", "sql"],
  },
  {
    id: 5,
    name: "policy-rag-bot",
    description: "RAG-based policy Q&A bot with chunking, orchestration and embedding reuse",
    html_url: "https://github.com/binzidd",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: "2025-03-01T00:00:00Z",
    topics: ["rag", "llm", "python"],
  },
  {
    id: 6,
    name: "xclaim-app",
    description: "Streamlit + AWS claims automation prototype",
    html_url: "https://github.com/binzidd",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: "2024-12-01T00:00:00Z",
    topics: ["streamlit", "aws", "automation"],
  },
];
