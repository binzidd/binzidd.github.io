"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const navItems = [
  { label: "About", href: "#hero" },
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
      const sections = navItems.map((item) => item.href.slice(1));
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
      <div className="fixed top-0 left-0 right-0 h-[1px] z-[60]" style={{ background: "#003300" }}>
        <motion.div style={{ scaleX, height: "100%", background: "linear-gradient(90deg, #00FF41, #008F11)", transformOrigin: "left" }} />
      </div>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-40"
      >
        <div
          className="flex items-center gap-0.5 px-3 py-2 rounded-full transition-all duration-300"
          style={{
            background: scrolled ? "rgba(0,5,0,0.96)" : "rgba(0,5,0,0.78)",
            backdropFilter: "blur(20px)",
            border: "1px solid #003300",
            boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="relative px-3 py-1.5 text-[11px] font-medium transition-colors duration-200 rounded-full"
                style={{ color: isActive ? "#00FF41" : "#006600", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em" }}
              >
                {isActive && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(0,255,65,0.08)", border: "1px solid rgba(0,255,65,0.18)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
          <div className="w-px h-3 mx-1" style={{ background: "#003300" }} />
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            className="px-2.5 py-1.5 text-[10px] rounded-full transition-all duration-200"
            style={{ color: "#006600", border: "1px solid #003300", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#00FF41"; e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#006600"; e.currentTarget.style.borderColor = "#003300"; }}
          >⌘K</button>
        </div>
      </motion.nav>
    </>
  );
}
