"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

// A "betting coupon" composite — every card is built from three sub-surfaces
// (header, body, action) that each carry their own Tones classification.
// Flipping mode or brand re-routes the meta tokens behind each sub-surface,
// and every coupon re-skins in lockstep — no per-instance overrides, no
// "if dark and inside the action band" branches.

type Mode = "light" | "dark";
type Brand = "MER" | "PSR" | "GEM";

type ModeTokens = {
  card: string;
  header: string;
  body: string;
  action: string;
  fg: string;
  fgMuted: string;
  border: string;
  oddBox: string;
};

const TOKENS: Record<Mode, ModeTokens> = {
  light: {
    card: "#f7f5ec",
    header: "oklch(0.92 0.012 80)",
    body: "#f7f5ec",
    action: "oklch(0.88 0.015 80)",
    fg: "oklch(0.18 0.02 264)",
    fgMuted: "oklch(0.18 0.02 264 / 0.6)",
    border: "oklch(0 0 0 / 0.08)",
    oddBox: "#fbfaf2",
  },
  dark: {
    card: "oklch(0.339 0 0)",
    header: "oklch(0.39 0 0)",
    body: "oklch(0.339 0 0)",
    action: "oklch(0.42 0 0)",
    fg: "#fafafa",
    fgMuted: "#fafafaa6",
    border: "oklch(1 0 0 / 0.1)",
    oddBox: "oklch(0.295 0 0)",
  },
};

const BRAND_ACCENT: Record<Brand, { light: string; dark: string }> = {
  MER: { light: "oklch(0.58 0.14 155)", dark: "oklch(0.83 0.18 160)" },
  PSR: { light: "oklch(0.55 0.18 250)", dark: "oklch(0.78 0.16 250)" },
  GEM: { light: "oklch(0.65 0.16 70)", dark: "oklch(0.82 0.16 75)" },
};

const TEAM_COLORS: Record<string, string> = {
  Saturn: "oklch(0.55 0.18 250)",
  Gargantua: "oklch(0.55 0.18 25)",
  MER: "oklch(0.62 0.16 155)",
  PSR: "oklch(0.58 0.17 240)",
  Wargs: "oklch(0.6 0.18 30)",
  Foxes: "oklch(0.7 0.17 60)",
};

type MatchCoupon = {
  league: string;
  timeLabel: string;
  home: string;
  away: string;
  outcome: string;
  odds: { home: number; draw: number; away: number };
};

const COUPONS: MatchCoupon[] = [
  {
    league: "Legacy Cup",
    timeLabel: "Q1 2025",
    home: "Saturn",
    away: "Gargantua",
    outcome: "Migrated brand vs legacy platform (CrUX field)",
    odds: { home: 1.4, draw: 8.0, away: 12.0 },
  },
  {
    league: "Brand Bracket",
    timeLabel: "MER · PSR",
    home: "MER",
    away: "PSR",
    outcome: "Same meta tokens, two brand re-skins (+2)",
    odds: { home: 2.1, draw: 3.6, away: 2.4 },
  },
  {
    league: "Engineering Cup",
    timeLabel: "Q3 2025",
    home: "Wargs",
    away: "Foxes",
    outcome: "Hackathon crew vs migration squad (+2)",
    odds: { home: 1.95, draw: 3.8, away: 2.6 },
  },
];

// Build the mask-image used as a diffuse edge fade on the carousel — each
// side either ends fully transparent (so cards beyond the viewport
// dissolve smoothly into whatever surface sits behind the carousel) or
// stays opaque (no fade) depending on whether there is content to scroll
// toward that edge.
function buildEdgeMask(canPrev: boolean, canNext: boolean): string {
  const left = canPrev ? "transparent" : "black";
  const right = canNext ? "transparent" : "black";
  return `linear-gradient(to right, ${left} 0px, black 48px, black calc(100% - 48px), ${right} 100%)`;
}

// Native smooth scroll on this container animates then snaps back to 0 in
// some browsers, so we animate scrollLeft directly via rAF. Snap-proximity
// on the container will pull each intermediate scroll position toward the
// nearest snap point — visible as a "jump" instead of a smooth glide — so
// we disable snap for the duration of the animation and restore it after.
function animateScrollTo(el: HTMLElement, target: number) {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    el.scrollLeft = target;
    return;
  }
  const start = el.scrollLeft;
  const distance = target - start;
  if (distance === 0) return;
  const originalSnap = el.style.scrollSnapType;
  el.style.scrollSnapType = "none";
  const duration = 320;
  const startTime = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.scrollLeft = start + distance * eased;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      el.style.scrollSnapType = originalSnap;
    }
  };
  requestAnimationFrame(step);
}

export function CompositeComponentsDemo() {
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = React.useState<Mode>("dark");
  const [brand, setBrand] = React.useState<Brand>("MER");
  const userOverrodeRef = React.useRef(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  React.useEffect(() => {
    if (userOverrodeRef.current) return;
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      setMode(resolvedTheme);
    }
  }, [resolvedTheme]);

  // Track scroll position so the arrows know when to fade in/out. React
  // already batches the two setStates so a finger-swipe doesn't thrash;
  // sync updates also keep the arrows in lockstep with the actual scroll.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft < max - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const pickMode = (m: Mode) => {
    userOverrodeRef.current = true;
    setMode(m);
  };

  const t = TOKENS[mode];
  const accent = BRAND_ACCENT[brand][mode];

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-coupon]"),
    );
    if (cards.length === 0) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const next = cards.find((c) => c.offsetLeft > el.scrollLeft + 8);
    const target = next ? Math.min(next.offsetLeft, maxScroll) : maxScroll;
    animateScrollTo(el, target);
  };

  const handlePrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-coupon]"),
    );
    if (cards.length === 0) return;
    // Pick the last card whose left edge sits before the current scroll
    // position. Otherwise we're already at the start.
    let prev: HTMLElement | undefined;
    for (const c of cards) {
      if (c.offsetLeft < el.scrollLeft - 8) prev = c;
      else break;
    }
    const target = prev ? prev.offsetLeft : 0;
    animateScrollTo(el, target);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Mode"
          className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
        >
          {(["light", "dark"] as Mode[]).map((m) => {
            const Icon = m === "light" ? Sun : Moon;
            const active = m === mode;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={m}
                onClick={() => pickMode(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3" aria-hidden="true" />
                <span className="hidden sm:inline">{m}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tablist"
          aria-label="Brand"
          className="border-border/60 bg-background/40 inline-flex shrink-0 rounded-md border p-0.5"
        >
          {(["MER", "PSR", "GEM"] as Brand[]).map((b) => {
            const active = b === brand;
            return (
              <button
                key={b}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={b}
                onClick={() => setBrand(b)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: BRAND_ACCENT[b][mode] }}
                />
                {b}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-proximity gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            // Mask-based edge fade — cards dissolve into whatever surface
            // is behind the carousel, so the cue stays correct regardless
            // of the SidebarFrame's bg-card/40 transparency. Each edge's
            // fade is independently toggled by canPrev / canNext.
            maskImage: buildEdgeMask(canPrev, canNext),
            WebkitMaskImage: buildEdgeMask(canPrev, canNext),
          }}
        >
          {COUPONS.map((c, idx) => (
            <CouponCard
              key={idx}
              coupon={c}
              tokens={t}
              accent={accent}
            />
          ))}
        </div>

        <CarouselButton
          direction="prev"
          visible={canPrev}
          onClick={handlePrev}
          tokens={t}
          accent={accent}
        />
        <CarouselButton
          direction="next"
          visible={canNext}
          onClick={handleNext}
          tokens={t}
          accent={accent}
        />
      </div>
    </div>
  );
}

function CarouselButton({
  direction,
  visible,
  onClick,
  tokens: t,
  accent,
}: {
  direction: "prev" | "next";
  visible: boolean;
  onClick: () => void;
  tokens: ModeTokens;
  accent: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous coupon" : "Next coupon"}
      onClick={onClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2",
        direction === "prev" ? "left-0" : "right-0",
        "inline-flex size-9 items-center justify-center rounded-full",
        "transition-[background-color,transform,opacity] duration-200",
        "hover:bg-[color:var(--cc-action)] active:scale-[0.94]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--cc-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
        visible
          ? "opacity-100"
          : "pointer-events-none opacity-0",
      )}
      style={
        {
          backgroundColor: t.card,
          color: t.fg,
          border: `1px solid ${t.border}`,
          boxShadow: "0 4px 14px oklch(0 0 0 / 0.25)",
          ["--cc-action" as string]: t.action,
          ["--cc-accent" as string]: accent,
        } as React.CSSProperties
      }
    >
      <Icon className="size-4" />
    </button>
  );
}

function CouponCard({
  coupon,
  tokens: t,
  accent,
}: {
  coupon: MatchCoupon;
  tokens: ModeTokens;
  accent: string;
}) {
  return (
    <article
      data-coupon
      className="flex aspect-video w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-lg transition-colors duration-300 sm:w-[320px]"
      style={{
        backgroundColor: t.card,
        border: `1px solid ${t.border}`,
        color: t.fg,
        boxShadow: "0 1px 2px oklch(0 0 0 / 0.14), 0 6px 18px oklch(0 0 0 / 0.18)",
      }}
    >
      {/* Header sub-surface */}
      <header
        className="flex items-center justify-between gap-2 px-3 py-1.5 transition-colors duration-300"
        style={{
          backgroundColor: t.header,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 truncate font-mono text-2xs uppercase tracking-mini"
          style={{ color: t.fg }}
        >
          <Layers className="size-3 shrink-0" aria-hidden="true" />
          {coupon.league}
        </span>
        <span
          className="shrink-0 font-mono text-2xs uppercase tracking-mini tabular-nums"
          style={{ color: t.fgMuted }}
        >
          {coupon.timeLabel}
        </span>
      </header>

      {/* Body sub-surface — flex centers the teams vertically inside the
          space left over after the header and action rows so each coupon
          stays balanced even when the body has spare height. */}
      <div
        className="flex flex-1 items-center justify-center px-3 py-2 transition-colors duration-300"
        style={{ backgroundColor: t.body }}
      >
        <div className="flex w-full items-center gap-2">
          <TeamColumn name={coupon.home} fg={t.fg} />
          <span
            className="font-mono text-2xs uppercase tracking-mini"
            style={{ color: t.fgMuted }}
          >
            vs
          </span>
          <TeamColumn name={coupon.away} fg={t.fg} />
        </div>
      </div>

      {/* Action sub-surface */}
      <div
        className="px-3 py-2 transition-colors duration-300"
        style={{
          backgroundColor: t.action,
          borderTop: `1px solid ${t.border}`,
        }}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "1", value: coupon.odds.home },
            { label: "X", value: coupon.odds.draw },
            { label: "2", value: coupon.odds.away },
          ].map((o) => (
            <OddsButton
              key={o.label}
              label={o.label}
              value={o.value}
              tokens={t}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function OddsButton({
  label,
  value,
  tokens: t,
  accent,
}: {
  label: string;
  value: number;
  tokens: ModeTokens;
  accent: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-between gap-1 rounded-md px-2 py-1",
        "transition-[background-color,border-color,transform] duration-150",
        "hover:border-[color:var(--cc-accent)]",
        "active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--cc-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--cc-action)] focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
      )}
      style={
        {
          backgroundColor: t.oddBox,
          border: `1px solid ${t.border}`,
          color: t.fg,
          ["--cc-accent" as string]: accent,
          ["--cc-action" as string]: t.action,
        } as React.CSSProperties
      }
    >
      <span
        className="font-mono text-2xs uppercase tracking-mini"
        style={{ color: t.fgMuted }}
      >
        {label}
      </span>
      <span className="font-mono text-xs font-semibold tabular-nums">
        {value.toFixed(2)}
      </span>
    </button>
  );
}

function TeamColumn({ name, fg }: { name: string; fg: string }) {
  const color = TEAM_COLORS[name] ?? "oklch(0.6 0.05 0)";
  const abbr =
    name.length <= 3 ? name.toUpperCase() : name.slice(0, 3).toUpperCase();
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span
        aria-hidden="true"
        className="inline-flex size-7 items-center justify-center rounded-full font-mono text-2xs font-semibold uppercase tracking-mini"
        style={{ backgroundColor: color, color: "#fafafa" }}
      >
        {abbr}
      </span>
      <span
        className="max-w-full truncate font-mono text-2xs uppercase tracking-mini"
        style={{ color: fg }}
      >
        {name}
      </span>
    </div>
  );
}
