import { fetchGitHubRepos } from "@/lib/github";
import GitHubRepoGrid from "@/components/GitHubRepoGrid";
import GitHubSectionHeading from "@/components/GitHubSectionHeading";

export default async function GitHubRepos() {
  const repos = await fetchGitHubRepos();

  return (
    <section id="github" className="py-28 px-6" style={{ background: "#020c02" }}>
      <div className="max-w-6xl mx-auto">
        <GitHubSectionHeading />
        <GitHubRepoGrid repos={repos} />
      </div>
    </section>
  );
}
