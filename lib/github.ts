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
      "https://api.github.com/users/binzidd/repos?sort=updated&per_page=6&type=public",
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
    return data.slice(0, 6);
  } catch {
    // Return fallback data if API fails
    return FALLBACK_REPOS;
  }
}

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "nl-to-sql",
    description: "Natural language to SQL interface using LangGraph + LangFuse",
    html_url: "https://github.com/binzidd",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: new Date().toISOString(),
    topics: ["langgraph", "langfuse", "genai", "sql"],
  },
  {
    id: 2,
    name: "policy-rag-bot",
    description: "RAG-based policy Q&A bot with chunking and embedding reuse",
    html_url: "https://github.com/binzidd",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: new Date().toISOString(),
    topics: ["rag", "llm", "python"],
  },
  {
    id: 3,
    name: "xclaim-app",
    description: "Streamlit + AWS claims automation prototype",
    html_url: "https://github.com/binzidd",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    updated_at: new Date().toISOString(),
    topics: ["streamlit", "aws", "automation"],
  },
];
