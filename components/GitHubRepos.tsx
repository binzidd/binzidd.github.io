import { fetchGitHubRepos } from "@/lib/github";
import GitHubRepoGrid from "@/components/GitHubRepoGrid";
import GitHubSectionHeading from "@/components/GitHubSectionHeading";
import SceneDolly from "@/components/motion/SceneDolly";

export default async function GitHubRepos() {
  const repos = await fetchGitHubRepos();

  return (
    <section id="github" className="py-28 px-6" style={{ background: "#020c02" }}>
      <SceneDolly className="max-w-6xl mx-auto">
        <GitHubSectionHeading />
        <GitHubRepoGrid repos={repos} />
      </SceneDolly>
    </section>
  );
}
