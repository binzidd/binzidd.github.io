import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import GitHubRepos from "@/components/GitHubRepos";
import HobbyProjects from "@/components/HobbyProjects";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  return (
    <>
      <Navigation />
      <CommandPalette />
      <main>
        <Hero />
        <Timeline />
        <Projects />
        <Skills />
        <GitHubRepos />
        <HobbyProjects />
      </main>
      <Footer />
    </>
  );
}
