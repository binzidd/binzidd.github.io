import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import GitHubRepos from "@/components/GitHubRepos";
import HobbyProjects from "@/components/HobbyProjects";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import ParticleField from "@/components/ParticleField";

export default function Home() {
  return (
    <>
      {/* 3D depth particle constellation — fixed canvas, z-index:1, visible everywhere */}
      <ParticleField />
      {/* Nav and palette stay above ParticleField (z-index: 40+) */}
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
