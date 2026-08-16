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
import HarryPotterEggs from "@/components/HarryPotterEggs";
import IntroLoader from "@/components/IntroLoader";
import SmoothScroll from "@/components/SmoothScroll";
import DataFireflies from "@/components/DataFireflies";
import VisitLogger from "@/components/VisitLogger";

export default function Home() {
  return (
    <>
      {/* Lenis-driven inertial scrolling — the whole page reads as one journey */}
      <SmoothScroll />
      {/* Logs one visit per session — independent of the intro form outcome */}
      <VisitLogger />
      {/* Fixed domain-vocabulary columns — DOM text, screen-blend, visible on mobile */}
      <IntroLoader />
      <TermColumns />
      {/* Ambient drifting motes with scroll/mouse parallax — environmental depth */}
      <DataFireflies />
      <HarryPotterEggs />
      {/* Cinematic edge vignette for depth — center stays transparent */}
      <div className="cinematic-vignette" />
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
