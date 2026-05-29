"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const navItems = [
  { label: "Work", href: "#timeline" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "GitHub", href: "#github" },
  { label: "Hobbies", href: "#hobbies" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ["hero", ...navItems.map((item) => item.href.slice(1))];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60]" style={{ background: "rgba(0,0,0,0.05)" }}>
        <motion.div style={{ scaleX, height: "100%", background: "#C96A36", transformOrigin: "left" }} />
      </div>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-40"
      >
        <div
          className="flex items-center gap-0.5 px-3 py-2 rounded-full transition-all duration-300"
          style={{
            background: scrolled ? "rgba(13,13,13,0.96)" : "rgba(13,13,13,0.82)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.28)" : "none",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="relative px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-200 rounded-full"
                style={{
                  color: isActive ? "#F6F3EE" : "rgba(246,243,238,0.35)",
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
          <div className="w-px h-3 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            className="px-2.5 py-1.5 text-[10px] rounded-full transition-all duration-200"
            style={{
              color: "rgba(246,243,238,0.28)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "var(--font-mono), monospace",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#C96A36";
              e.currentTarget.style.borderColor = "rgba(201,106,54,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(246,243,238,0.28)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            ⌘K
          </button>
        </div>
      </motion.nav>
    </>
  );
}
