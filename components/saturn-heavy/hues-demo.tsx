"use client";

// HuesDemo — companion to HueClassificationDemo.
//
// Each brand's surface colour is rasterised to sRGB at mount time, its WCAG
// luminance is computed with the same coefficients used in the interactive
// demo above, and the colour is classified into a darkTone / evenTone /
// lightTone band on the same thresholds. The contrast badge inside each chip
// switches between APCA Lc (perceptually-tuned) and WCAG simple ratio so a
// reader can compare the two methodologies side-by-side on identical inputs.

import * as React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Sample = { brand: string; code: string; oklch: string };

const SAMPLES: Sample[] = [
  { brand: "Orion", code: "ORN", oklch: "oklch(0.92 0.10 75)" },
  { brand: "Vega", code: "VEG", oklch: "oklch(0.88 0.12 25)" },
  { brand: "Mercury", code: "MER", oklch: "oklch(0.90 0.10 155)" },
  // evenTone deliberately mixes the two cases where the two methodologies
  // disagree:
  //   Kepler + Polestar — WCAG fails them (low simple-luminance ratio with
  //   white text) but APCA correctly approves the colours for actual
  //   on-screen reading. WCAG over-penalises mid-luminance colours that read
  //   fine in practice.
  //   Nautilus — WCAG strongly approves a saturated yellow with black text
  //   (high luminance ratio), but APCA flags it: the high chroma trashes
  //   perceived contrast even though the math says otherwise.
  { brand: "Kepler", code: "KER", oklch: "oklch(0.58 0.16 195)" },
  { brand: "Polestar", code: "PSR", oklch: "oklch(0.58 0.17 240)" },
  { brand: "Nautilus", code: "NTL", oklch: "oklch(0.78 0.19 95)" },
  { brand: "Andromeda", code: "AND", oklch: "oklch(0.32 0.15 320)" },
  { brand: "Gemini", code: "GEM", oklch: "oklch(0.28 0.16 290)" },
  { brand: "Sirius", code: "SRS", oklch: "oklch(0.30 0.18 0)" },
];

const T_DARK = 64;
const T_LIGHT = 191;
// Foreground crossover (independent of band boundary): which side of the
// WCAG mid-grey the chip's text colour sits on.
const T_INK_FLIP = 128;

// Thresholds for "good enough contrast" under each method.
const WCAG_THRESHOLD = 4.5; // WCAG 2.x AA — normal body text
const APCA_THRESHOLD = 60; // APCA — large body text minimum

// CSS strings for the actual rendered foreground colour (aesthetics).
const INK = "oklch(0.18 0.02 264)";
const PAPER = "#fafafa";
// Pure black / pure white for the contrast math — these are what WCAG and
// APCA online calculators use, so the numbers shown here line up with the
// numbers a designer can verify in any contrast tool.
const INK_RGB: Rgb = { r: 0, g: 0, b: 0 };
const PAPER_RGB: Rgb = { r: 255, g: 255, b: 255 };

type Rgb = { r: number; g: number; b: number };
type Band = "lightTone" | "evenTone" | "darkTone";
type Method = "apca" | "wcag";

type Resolved = Sample & {
  rgb: Rgb;
  L: number;
  band: Band;
  onLightSide: boolean;
  wcag: number;
  apca: number;
};

function classify(L: number): Band {
  if (L < T_DARK) return "darkTone";
  if (L >= T_LIGHT) return "lightTone";
  return "evenTone";
}

// WCAG 2.x relative luminance — proper gamma-corrected formula from the
// spec. This is what every online contrast calculator uses, so the numbers
// match what a designer would verify externally.
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function relLum(rgb: Rgb): number {
  return (
    0.2126 * srgbToLinear(rgb.r) +
    0.7152 * srgbToLinear(rgb.g) +
    0.0722 * srgbToLinear(rgb.b)
  );
}
function wcagContrast(a: Rgb, b: Rgb): number {
  const L1 = relLum(a) + 0.05;
  const L2 = relLum(b) + 0.05;
  return Math.max(L1, L2) / Math.min(L1, L2);
}

// APCA Lc approximation (constants from the public APCA spec, simplified
// without all edge-cases — close enough for an educational side-by-side,
// not for an a11y audit). Formula: Lc = (bgY^p1 - txY^p2) · 1.14 · 100
// with different exponents per polarity. BoW (dark text on light bg) → Sapc
// is positive; WoB (light text on dark bg) → Sapc is negative; |Sapc|·100 is
// the reported Lc magnitude.
function apcaContrast(bg: Rgb, tx: Rgb): number {
  const lin = (c: number) => Math.pow(c / 255, 2.4);
  const bgY = lin(bg.r) * 0.2126 + lin(bg.g) * 0.7152 + lin(bg.b) * 0.0722;
  const txY = lin(tx.r) * 0.2126 + lin(tx.g) * 0.7152 + lin(tx.b) * 0.0722;
  let Sapc: number;
  if (bgY > txY) {
    // BoW (dark text on light bg) — Sapc > 0
    Sapc = (Math.pow(bgY, 0.56) - Math.pow(txY, 0.57)) * 1.14;
    Sapc = Sapc < 0.036 ? 0 : Sapc - 0.027;
  } else {
    // WoB (light text on dark bg) — Sapc < 0 because bgY < txY
    Sapc = (Math.pow(bgY, 0.65) - Math.pow(txY, 0.62)) * 1.14;
    Sapc = Sapc > -0.036 ? 0 : Sapc + 0.027;
  }
  return Math.abs(Sapc) * 100;
}

export function HuesDemo() {
  const [method, setMethod] = React.useState<Method>("apca");
  const [resolved, setResolved] = React.useState<Resolved[]>([]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const next: Resolved[] = SAMPLES.map((s) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = s.oklch;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const rgb: Rgb = { r, g, b };
      const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const onLightSide = L > T_INK_FLIP;
      const fgRgb = onLightSide ? INK_RGB : PAPER_RGB;
      return {
        ...s,
        rgb,
        L,
        band: classify(L),
        onLightSide,
        wcag: wcagContrast(rgb, fgRgb),
        apca: apcaContrast(rgb, fgRgb),
      };
    });
    setResolved(next);
  }, []);

  const grouped: Record<Band, Resolved[]> = {
    lightTone: resolved.filter((s) => s.band === "lightTone"),
    evenTone: resolved.filter((s) => s.band === "evenTone"),
    darkTone: resolved.filter((s) => s.band === "darkTone"),
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
          Contrast method
        </span>
        <div
          role="tablist"
          aria-label="Contrast method"
          className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
        >
          {(["apca", "wcag"] as Method[]).map((m) => {
            const active = m === method;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMethod(m)}
                className={cn(
                  "inline-flex items-center rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {(["lightTone", "evenTone", "darkTone"] as Band[]).map((band) => {
        const items = grouped[band];
        if (items.length === 0) return null;
        return (
          <div key={band}>
            <p className="text-foreground font-mono text-2xs uppercase tracking-mini">
              {band}
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {items.map((s) => {
                const fg = s.onLightSide ? INK : PAPER;
                const value = method === "apca" ? s.apca : s.wcag;
                const threshold =
                  method === "apca" ? APCA_THRESHOLD : WCAG_THRESHOLD;
                const pass = value >= threshold;
                const display =
                  method === "apca"
                    ? `Lc ${Math.round(value)}`
                    : `${value.toFixed(1)}:1`;
                return (
                  <li key={s.brand}>
                    <div
                      className="flex items-center justify-between gap-2 rounded-lg border px-3 py-3"
                      style={{
                        backgroundColor: s.oklch,
                        color: fg,
                        borderColor: s.onLightSide
                          ? "rgba(0, 0, 0, 0.15)"
                          : "rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      <span className="font-mono text-sm font-medium uppercase tracking-mini">
                        {s.code}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-2xs uppercase tracking-mini"
                        style={{
                          backgroundColor: s.onLightSide
                            ? "oklch(0 0 0 / 0.08)"
                            : "oklch(1 0 0 / 0.16)",
                        }}
                        title={
                          method === "apca"
                            ? `APCA Lc — pass threshold Lc ${APCA_THRESHOLD}`
                            : `WCAG 2.x contrast ratio — pass threshold ${WCAG_THRESHOLD}:1`
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "inline-flex size-3.5 items-center justify-center rounded-full text-white",
                            pass ? "bg-emerald-500" : "bg-red-500",
                          )}
                        >
                          {pass ? (
                            <Check className="size-2.5" strokeWidth={3} />
                          ) : (
                            <X className="size-2.5" strokeWidth={3} />
                          )}
                        </span>
                        <span>{display}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
