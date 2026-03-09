"use client";

import { motion } from "framer-motion";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/binzidd",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/binaysiddharth",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Tableau",
    href: "https://public.tableau.com/app/profile/binay.siddharth",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.654 3.324V.04h.692v3.284h3.269v.69h-3.269v3.27h-.692V4.014H8.369v-.69h3.285zm6.923 9.592v-2.169h.62v2.169h2.169v.615h-2.169v2.174h-.62v-2.174H16.4v-.615h2.177zM4.377 9.954v-2.17H5v2.17h2.169v.61H5v2.174h-.623v-2.174H2.208v-.61h2.169zm7.277 3.27v-2.816h-.777v2.816H8.062v.778h2.815v2.815h.777v-2.815h2.815v-.778h-2.815zm0 7.307v-2.215h-.777v2.215H8.062v.754h2.815V24h.777v-2.715h2.815v-.754h-2.815z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:binay.siddharth@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="py-16 px-6" style={{ background: "#0A0E14", borderTop: "1px solid #21262D" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="text-3xl md:text-4xl font-light mb-2" style={{ color: "#E6EDF3", fontFamily: "var(--font-cormorant), serif" }}>
              Binay Siddharth
            </h3>
            <p className="text-xs mb-1" style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}>
              Chapter Area Lead — FS Analytics
            </p>
            <p className="text-xs" style={{ color: "#30363D", fontFamily: "var(--font-mono), monospace" }}>
              Commonwealth Bank of Australia · Sydney
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                title={link.label}
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                style={{ background: "#111720", color: "#484F58", border: "1px solid #21262D" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,217,255,0.1)";
                  e.currentTarget.style.color = "#00D9FF";
                  e.currentTarget.style.borderColor = "rgba(0,217,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111720";
                  e.currentTarget.style.color = "#484F58";
                  e.currentTarget.style.borderColor = "#21262D";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {link.icon}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid #21262D" }}
        >
          <p className="text-xs" style={{ color: "#30363D", fontFamily: "var(--font-mono), monospace" }}>
            © {new Date().getFullYear()} Binay Siddharth — built with Next.js & Framer Motion
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-xs transition-colors duration-200"
            style={{ color: "#484F58", fontFamily: "var(--font-mono), monospace" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00D9FF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#484F58")}
          >
            scroll_to_top()
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 9V1M1 5l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
