"use client";

import { useSyncExternalStore } from "react";

// ── Themes ────────────────────────────────────────────────────────────────
// Two complete visual identities for the site. The palette lives in CSS
// custom properties (see app/globals.css) so DOM components can theme with a
// plain `var(--c-accent)` in an inline style and switch with zero re-render.
// Canvas components can't use CSS vars in ctx.fillStyle, so they read the
// resolved values through readThemeTokens() and re-read on theme change.

export type Theme = "matrix" | "interstellar";

export const THEMES: Theme[] = ["matrix", "interstellar"];
export const DEFAULT_THEME: Theme = "matrix";

const STORAGE_KEY = "theme";
const EVENT = "themechange";

export function isTheme(v: unknown): v is Theme {
  return v === "matrix" || v === "interstellar";
}

/** Applies the theme to <html> and notifies listeners. Safe to call repeatedly. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private-mode/quota failures must never break theming.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: theme }));
}

export function getStoredTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const attr = document.documentElement.dataset.theme;
  if (isTheme(attr)) return attr;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_THEME;
}

// ── React binding ─────────────────────────────────────────────────────────
function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** Current theme, re-rendering the caller whenever it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getStoredTheme, () => DEFAULT_THEME);
}

// ── Canvas token bridge ───────────────────────────────────────────────────
// Canvas 2D can't consume CSS variables, so resolve them to concrete hex once
// per theme change and hand them to the drawing code.
export interface ThemeTokens {
  accent: string;
  accentAlt: string;
  dim: string;
  border: string;
  surface: string;
  bg: string;
  text: string;
  muted: string;
  /** "r, g, b" triples, ready to drop into a canvas rgba() template. */
  accentRgb: string;
  accentAltRgb: string;
  bgRgb: string;
  /** Categorical scale, themed. */
  cat: string[];
}

const FALLBACK: ThemeTokens = {
  accent: "#00FF41",
  accentAlt: "#00D9FF",
  dim: "#006600",
  border: "#003300",
  surface: "#020c02",
  bg: "#000500",
  text: "#E6EDF3",
  muted: "#8B949E",
  accentRgb: "0, 255, 65",
  accentAltRgb: "0, 217, 255",
  bgRgb: "0, 5, 0",
  cat: ["#00FF41", "#29B5E8", "#FF9900", "#E97627"],
};

export function readThemeTokens(): ThemeTokens {
  if (typeof window === "undefined") return FALLBACK;
  const s = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => {
    const v = s.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    accent:    get("--c-accent",     FALLBACK.accent),
    accentAlt: get("--c-accent-alt", FALLBACK.accentAlt),
    dim:       get("--c-dim",        FALLBACK.dim),
    border:    get("--c-border",     FALLBACK.border),
    surface:   get("--c-surface",    FALLBACK.surface),
    bg:        get("--c-bg",         FALLBACK.bg),
    text:      get("--c-text",       FALLBACK.text),
    muted:     get("--c-muted",      FALLBACK.muted),
    accentRgb:    get("--c-accent-rgb",     FALLBACK.accentRgb),
    accentAltRgb: get("--c-accent-alt-rgb", FALLBACK.accentAltRgb),
    bgRgb:        get("--c-bg-rgb",         FALLBACK.bgRgb),
    cat: [
      get("--c-cat-1", FALLBACK.cat[0]),
      get("--c-cat-2", FALLBACK.cat[1]),
      get("--c-cat-3", FALLBACK.cat[2]),
      get("--c-cat-4", FALLBACK.cat[3]),
    ],
  };
}

/**
 * Subscribe to resolved theme colours for canvas drawing. Returns a getter
 * plus an unsubscribe; the getter always yields the current theme's tokens.
 */
export function watchThemeTokens(onChange: (t: ThemeTokens) => void): () => void {
  const handler = () => onChange(readThemeTokens());
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

// ── Launch quotes ─────────────────────────────────────────────────────────
export interface Quote {
  line: string;
  source: string;
}

export const QUOTES: Record<Theme, Quote[]> = {
  matrix: [
    { line: "There is no spoon.",                                          source: "Spoon Boy" },
    { line: "I know kung fu.",                                             source: "Neo" },
    { line: "Free your mind.",                                             source: "Morpheus" },
    { line: "Welcome to the desert of the real.",                          source: "Morpheus" },
    { line: "There's a difference between knowing the path and walking it.", source: "Morpheus" },
    { line: "Wake up, Neo.",                                               source: "The screen" },
    { line: "Unfortunately, no one can be told what the Matrix is.",       source: "Morpheus" },
  ],
  interstellar: [
    { line: "Do not go gentle into that good night.",                      source: "Dylan Thomas" },
    { line: "We used to look up and wonder at our place in the stars.",    source: "Cooper" },
    { line: "Love is the one thing that transcends time and space.",       source: "Brand" },
    { line: "Mankind was born on Earth. It was never meant to die here.",  source: "Cooper" },
    { line: "We're not meant to save the world. We're meant to leave it.", source: "Cooper" },
    { line: "Newton's third law: the only way humans have figured out of getting somewhere is to leave something behind.", source: "Brand" },
    { line: "Maybe we've spent too long trying to figure all this out with theory.", source: "Cooper" },
  ],
};

/** Picks a quote for the theme. Index is caller-supplied so callers stay SSR-safe. */
export function quoteFor(theme: Theme, index: number): Quote {
  const list = QUOTES[theme];
  return list[index % list.length];
}
