"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPELLS = [
  {
    trigger: "expecto patronum",
    label: "🦌 Expecto Patronum!",
    message: "A silver stag erupts from your keyboard and charges across the screen.",
    flash: "silver" as const,
  },
  {
    trigger: "alohomora",
    label: "🔓 Alohomora!",
    message: "Access granted. This door was already open.",
    flash: null,
  },
  {
    trigger: "mischief managed",
    label: "🗺️ Mischief Managed.",
    message: "The Marauder's Map goes blank. I hope you enjoyed the portfolio.",
    flash: null,
  },
  {
    trigger: "obliviate",
    label: "😶 Obliviate.",
    message: "Memory charm cast. You'll forget this portfolio... just kidding.",
    flash: null,
  },
  {
    trigger: "lumos",
    label: "✨ Lumos!",
    message: "Let there be light.",
    flash: "white" as const,
  },
  {
    trigger: "nox",
    label: "🌑 Nox.",
    message: "Darkness restored. As it should be.",
    flash: "dark" as const,
  },
  {
    trigger: "accio",
    label: "🪄 Accio!",
    message: "Summoning charm cast. Nothing moved. You're probably not a wizard.",
    flash: null,
  },
];

type Spell = (typeof SPELLS)[0];

export default function HarryPotterEggs() {
  const [buffer, setBuffer] = useState("");
  const [active, setActive] = useState<Spell | null>(null);
  const [flashVisible, setFlashVisible] = useState(false);
  const [flashType, setFlashType] = useState<"white" | "dark" | "silver" | null>(null);

  // Console Easter egg on mount
  useEffect(() => {
    console.log(
      "%c⚡  I solemnly swear that I am up to no good.  ⚡",
      "color: gold; font-size: 14px; font-family: serif; font-weight: bold; padding: 4px 0;"
    );
    console.log(
      "%cHint: type a spell anywhere on the page (outside input fields) to cast it.",
      "color: #27F4D2; font-size: 11px; font-family: monospace;"
    );
  }, []);

  // Dismiss toast after 3.2s
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(null), 3200);
    return () => clearTimeout(t);
  }, [active]);

  // Global keyboard buffer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const key = e.key;
      if (key === " ") {
        setBuffer((b) => (b + " ").slice(-25));
        return;
      }
      if (key.length !== 1) return;
      setBuffer((b) => (b + key.toLowerCase()).slice(-25));
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Check buffer against spell triggers
  useEffect(() => {
    for (const spell of SPELLS) {
      if (buffer.endsWith(spell.trigger)) {
        setActive(spell);
        setBuffer("");
        if (spell.flash) {
          setFlashType(spell.flash);
          setFlashVisible(true);
          setTimeout(() => setFlashVisible(false), spell.flash === "white" ? 280 : 450);
        }
        break;
      }
    }
  }, [buffer]);

  const flashBg =
    flashType === "white"
      ? "rgba(255,255,240,0.85)"
      : flashType === "silver"
      ? "rgba(200,215,220,0.5)"
      : "rgba(0,3,0,0.7)";

  return (
    <>
      {/* Screen flash */}
      <div
        className="fixed inset-0 pointer-events-none z-[195]"
        style={{
          background: flashBg,
          opacity: flashVisible ? 1 : 0,
          transition: flashVisible ? "opacity 0.08s ease" : "opacity 0.55s ease",
        }}
      />

      {/* Spell toast */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.trigger}
            initial={{ opacity: 0, y: 36, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.94 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[196] px-6 py-4 rounded-2xl select-none"
            style={{
              background: "rgba(0,5,0,0.94)",
              border: "1px solid rgba(0,255,65,0.25)",
              boxShadow: "0 0 32px rgba(0,255,65,0.12), 0 12px 40px rgba(0,0,0,0.7)",
              backdropFilter: "blur(16px)",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <p
              className="text-xl mb-1.5"
              style={{ fontFamily: "var(--font-cormorant), serif", color: "#00FF41", letterSpacing: "0.02em" }}
            >
              {active.label}
            </p>
            <p
              className="text-[11px]"
              style={{ color: "rgba(0,255,65,0.55)", fontFamily: "var(--font-mono), monospace" }}
            >
              {active.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
