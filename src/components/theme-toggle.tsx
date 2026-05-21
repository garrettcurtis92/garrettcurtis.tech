"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * Pill button that toggles `data-theme` on `<html>` between "light" and "dark".
 * Reads the bootstrap-set attribute on mount, writes both the attribute and
 * `localStorage` on click, renders the OTHER mode's name as label per
 * design-spec §6.1.
 *
 * The pre-mount label is a non-breaking space so the button has stable
 * width — prevents layout shift when the real label appears post-hydration.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Sync local state to the pre-hydration bootstrap's choice. The DOM
  // attribute is the source of truth, not React state — the cascade
  // triggered by these setState calls is intentional: it swaps the non-
  // breaking-space placeholder for the real label after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage may throw in Safari private mode or strict CSP contexts.
      // The attribute change still applies for the session.
    }
    setTheme(next);
  };

  const label: Theme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${label} mode`}
      className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-text hover:text-text"
    >
      {mounted ? label : " "}
    </button>
  );
}
