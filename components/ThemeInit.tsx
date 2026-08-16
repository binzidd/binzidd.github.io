"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";

/**
 * Re-applies the saved theme once React has hydrated.
 *
 * The blocking script in <head> sets data-theme before first paint (which is
 * what kills the flash), but React reconciles <html> during hydration and
 * strips attributes that aren't part of the server-rendered markup, so the
 * attribute is dropped a moment later. Re-applying on mount restores it.
 * This pairs with the head script rather than replacing it: the script owns
 * "no flash", this owns "still correct after hydration".
 */
export default function ThemeInit() {
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return null;
}
