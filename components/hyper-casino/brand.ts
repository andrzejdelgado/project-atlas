import type { CSSProperties } from "react";

// Fictional "Hyper-Casino" brand — dark, vivid, high-contrast iGaming aesthetic.
//
// Exposed as CSS custom properties applied on the phone-mockup root so the
// palette is SCOPED: nothing leaks into the portfolio's own :root / .dark
// theme, and toggling the site theme never alters these demos. Components read
// them via Tailwind arbitrary values, e.g. bg-[var(--hc-surface)].
export const hyperCasinoVars = {
  "--hc-bg": "oklch(0.17 0.015 265)", // deep ink base (screen background)
  "--hc-bar": "oklch(0.1 0.013 265)", // near-black chrome band (top + bottom bars)
  "--hc-surface": "oklch(0.225 0.018 265)", // raised card
  "--hc-surface-2": "oklch(0.275 0.02 265)", // inputs / higher surface
  "--hc-border": "oklch(1 0 0 / 0.10)",
  "--hc-border-strong": "oklch(1 0 0 / 0.18)",
  "--hc-fg": "oklch(0.98 0 0)", // near-white text
  "--hc-muted": "oklch(0.72 0.025 265)", // secondary text
  "--hc-faint": "oklch(0.55 0.02 265)", // tertiary / hints
  "--hc-violet": "oklch(0.62 0.23 295)", // hero / primary action / active odds
  "--hc-violet-soft": "oklch(0.62 0.23 295 / 0.16)",
  "--hc-violet-fg": "oklch(0.99 0.01 295)",
  "--hc-lime": "oklch(0.87 0.21 130)", // boost / odds-up / win
  "--hc-lime-fg": "oklch(0.22 0.05 140)",
  "--hc-red": "oklch(0.64 0.23 25)", // live / odds-down
  "--hc-gold": "oklch(0.83 0.16 85)", // promo accents
} as CSSProperties;
