"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const navItems = [
  { label: "About", href: "#hero" },
  { label: "Work", href: "#timeline" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "GitHub", href: "#github" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = navItems.map((item) => item.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openCommandPalette = () => {
    const evt = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
    document.dispatchEvent(evt);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60]" style={{ background: "#E0D8CF" }}>
        <motion.div
          style={{
            scaleX,
            height: "100%",
            background: "linear-gradient(90deg, #8B7355, #C4A882)",
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Nav pill */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-40"
      >
        <div
          className="flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300"
          style={{
            background: scrolled ? "rgba(248,245,240,0.94)" : "rgba(248,245,240,0.72)",
            backdropFilter: "blur(16px)",
            border: "1px solid #E0D8CF",
            boxShadow: scrolled
              ? "0 4px 24px rgba(28,25,23,0.09)"
              : "0 2px 12px rgba(28,25,23,0.04)",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full"
                style={{
                  color: isActive ? "#5C4B35" : "#78716C",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#EFEBE4" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}

          <div className="w-px h-4 mx-1" style={{ background: "#E0D8CF" }} />

          <button
            onClick={openCommandPalette}
            className="px-3 py-1.5 text-xs rounded-full transition-all duration-200 hover:bg-[#EFEBE4]"
            style={{
              color: "#A8A29E",
              border: "1px solid #E0D8CF",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            title="Open command palette (⌘K)"
          >
            ⌘K
          </button>
        </div>
      </motion.nav>
    </>
  );
}
