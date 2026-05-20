"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type Mode = "light" | "dark";

const TOKENS: Record<
  Mode,
  {
    surface: string;
    border: string;
    fg: string;
    fgMuted: string;
    badge: string;
    badgeFg: string;
    cta: string;
    ctaFg: string;
  }
> = {
  light: {
    surface: "#f7f5ec",
    border: "oklch(0 0 0 / 0.08)",
    fg: "oklch(0.18 0.02 264)",
    fgMuted: "oklch(0.18 0.02 264 / 0.65)",
    badge: "oklch(0.92 0.012 80)",
    badgeFg: "oklch(0.18 0.02 264)",
    cta: "oklch(0.58 0.17 240)",
    ctaFg: "#fafafa",
  },
  dark: {
    surface: "oklch(0.277 0 0)",
    border: "oklch(1 0 0 / 0.12)",
    fg: "#fafafa",
    fgMuted: "#fafafa99",
    badge: "oklch(0.42 0 0)",
    badgeFg: "#fafafa",
    cta: "oklch(0.78 0.16 240)",
    ctaFg: "oklch(0.18 0.02 264)",
  },
};

type CardId = "top" | "middle" | "bottom";
const CARD_IDS: CardId[] = ["top", "middle", "bottom"];

const CARD_LABELS: Record<CardId, string> = {
  top: "Standard feature card",
  middle: "Inverted promo strip",
  bottom: "Continuation card",
};

export function ComponentLevelDarkModeDemo() {
  const { resolvedTheme } = useTheme();
  // Card modes seed mixed against the site theme: top + bottom match the
  // site, middle inverts. So a single inverted card always sits among
  // matching ones — the principle stays visible whether the visitor is
  // reading the case study in light or dark mode.
  const [cardModes, setCardModes] = React.useState<Record<CardId, Mode>>({
    top: "dark",
    middle: "light",
    bottom: "dark",
  });
  const userOverrodeRef = React.useRef(false);

  React.useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    if (userOverrodeRef.current) return;
    const inverted: Mode = resolvedTheme === "light" ? "dark" : "light";
    setCardModes({
      top: resolvedTheme,
      middle: inverted,
      bottom: resolvedTheme,
    });
  }, [resolvedTheme]);

  const flipCard = (id: CardId) => {
    userOverrodeRef.current = true;
    setCardModes((cm) => ({
      ...cm,
      [id]: cm[id] === "light" ? "dark" : "light",
    }));
  };

  return (
    <div className="space-y-3">
      {CARD_IDS.map((id, i) => {
        const mode = cardModes[id];
        const t = TOKENS[mode];
        return (
          <article
            key={id}
            className="overflow-hidden rounded-lg transition-colors duration-300"
            style={{
              backgroundColor: t.surface,
              border: `1px solid ${t.border}`,
              color: t.fg,
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => flipCard(id)}
                aria-label={`Toggle ${id} card mode`}
                className={cn(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-md",
                  "transition-[background-color,transform] duration-150",
                  "hover:bg-[oklch(from_var(--cl-badge)_calc(l_-_0.05)_c_h)] active:scale-[0.94]",
                  "focus-visible:ring-2 focus-visible:ring-[color:var(--cl-cta)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--cl-surface)] focus-visible:outline-none",
                  "motion-reduce:transition-none motion-reduce:active:scale-100",
                )}
                style={
                  {
                    backgroundColor: t.badge,
                    color: t.badgeFg,
                    ["--cl-badge" as string]: t.badge,
                    ["--cl-cta" as string]: t.cta,
                    ["--cl-surface" as string]: t.surface,
                  } as React.CSSProperties
                }
              >
                {mode === "light" ? (
                  <Moon className="size-3.5" />
                ) : (
                  <Sun className="size-3.5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className="font-mono text-2xs uppercase tracking-mini"
                  style={{ color: t.fgMuted }}
                >
                  Section {i + 1} · mode: {mode}
                </p>
                <p
                  className="mt-1 text-sm font-medium tracking-tight"
                  style={{ color: t.fg }}
                >
                  {CARD_LABELS[id]}
                </p>
              </div>
            </div>
            <div
              className="flex items-center justify-between gap-3 border-t px-4 py-3"
              style={{ borderColor: t.border }}
            >
              <span className="text-xs" style={{ color: t.fgMuted }}>
                Foreground tokens cascade from this card&apos;s mode.
              </span>
              <button
                type="button"
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium tracking-tight",
                  "bg-[color:var(--cl-cta)]",
                  "transition-[background-color,transform] duration-150",
                  "hover:bg-[oklch(from_var(--cl-cta)_calc(l_-_0.05)_c_h)]",
                  "active:bg-[oklch(from_var(--cl-cta)_calc(l_-_0.1)_c_h)] active:scale-[0.97]",
                  "focus-visible:ring-2 focus-visible:ring-[color:var(--cl-cta)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--cl-surface)] focus-visible:outline-none",
                  "motion-reduce:transition-none motion-reduce:active:scale-100",
                )}
                style={
                  {
                    color: t.ctaFg,
                    ["--cl-cta" as string]: t.cta,
                    ["--cl-surface" as string]: t.surface,
                  } as React.CSSProperties
                }
              >
                Action
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
