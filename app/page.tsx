import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import GitHubRepos from "@/components/GitHubRepos";
import HobbyProjects from "@/components/HobbyProjects";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import TermColumns from "@/components/TermColumns";

export default function Home() {
  return (
    <>
      {/* Fixed domain-vocabulary columns — DOM text, screen-blend, visible on mobile */}
      <TermColumns />
      {/* Nav and palette stay above TermRain (z-index: 40+) */}
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
