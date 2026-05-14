"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Reveal = "fade-up" | "slide-in" | "scale-in" | "rotate-fade" | "blur-reveal";

type FeedItem = {
  reveal?: Reveal;
  title: string;
  meta: string;
  detail: string;
  icon: React.ReactNode;
  iconClass: string;
  pill: string;
  pillClass: string;
};

function Bell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function Pin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ArrowUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function Maximize() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
function Zap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const ICON_BLUE =
  "bg-blue-500/15 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300";
const ICON_VIOLET =
  "bg-violet-500/15 text-violet-700 dark:bg-violet-400/20 dark:text-violet-300";
const ICON_EMERALD =
  "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300";
const ICON_AMBER =
  "bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300";
const ICON_RED =
  "bg-red-500/15 text-red-700 dark:bg-red-400/20 dark:text-red-300";
const ICON_CYAN =
  "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-400/20 dark:text-cyan-300";

const PILL_BLUE =
  "bg-blue-500/12 text-blue-700 border-blue-500/35 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/40";
const PILL_VIOLET =
  "bg-violet-500/12 text-violet-700 border-violet-500/35 dark:bg-violet-400/15 dark:text-violet-300 dark:border-violet-400/40";
const PILL_EMERALD =
  "bg-emerald-500/12 text-emerald-700 border-emerald-500/35 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/40";
const PILL_AMBER =
  "bg-amber-500/12 text-amber-700 border-amber-500/35 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/40";
const PILL_RED =
  "bg-red-500/12 text-red-700 border-red-500/35 dark:bg-red-400/15 dark:text-red-300 dark:border-red-400/40";
const PILL_CYAN =
  "bg-cyan-500/12 text-cyan-700 border-cyan-500/35 dark:bg-cyan-400/15 dark:text-cyan-300 dark:border-cyan-400/40";

const FEED: FeedItem[] = [
  {
    title: "Latest activity",
    meta: "12 events · last hour",
    detail: "Auto-refreshed 30s ago",
    icon: <Bell />,
    iconClass: ICON_BLUE,
    pill: "system",
    pillClass: PILL_BLUE,
  },
  {
    title: "Pinned reports",
    meta: "Q3 revenue summary",
    detail: "Pinned by Mira · 2d ago",
    icon: <Pin />,
    iconClass: ICON_VIOLET,
    pill: "pinned",
    pillClass: PILL_VIOLET,
  },
  {
    title: "System status",
    meta: "All services operational",
    detail: "Last health check 5m ago",
    icon: <Check />,
    iconClass: ICON_EMERALD,
    pill: "healthy",
    pillClass: PILL_EMERALD,
  },
  {
    reveal: "fade-up",
    title: "Fade-up",
    meta: "translate-y · opacity",
    detail: "Design tokens released · 8m ago",
    icon: <ArrowUp />,
    iconClass: ICON_EMERALD,
    pill: "shipped",
    pillClass: PILL_EMERALD,
  },
  {
    reveal: "slide-in",
    title: "Slide-in",
    meta: "translate-x · opacity",
    detail: "Storage at 92% · cleanup advised",
    icon: <ArrowRight />,
    iconClass: ICON_AMBER,
    pill: "warning",
    pillClass: PILL_AMBER,
  },
  {
    reveal: "scale-in",
    title: "Scale-in",
    meta: "scale · opacity",
    detail: "Build 2486 · prod rollout 100%",
    icon: <Maximize />,
    iconClass: ICON_VIOLET,
    pill: "live",
    pillClass: PILL_VIOLET,
  },
  {
    reveal: "rotate-fade",
    title: "Rotate-fade",
    meta: "rotate · opacity",
    detail: "New device · macOS · Tucson, AZ",
    icon: <RotateIcon />,
    iconClass: ICON_RED,
    pill: "review",
    pillClass: PILL_RED,
  },
  {
    reveal: "blur-reveal",
    title: "Blur-reveal",
    meta: "filter: blur · opacity",
    detail: "Snapshot saved · 1.2 GB freed",
    icon: <Zap />,
    iconClass: ICON_CYAN,
    pill: "done",
    pillClass: PILL_CYAN,
  },
];

export function ScrollDrivenDemo() {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setSupported(
      typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"),
    );
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Scroll-driven animations"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <style>{`
        @keyframes sd-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sd-slide-in {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sd-scale-in {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes sd-rotate-fade {
          from { opacity: 0; transform: rotate(-4deg) translateY(12px); }
          to   { opacity: 1; transform: rotate(0) translateY(0); }
        }
        @keyframes sd-blur-reveal {
          from { opacity: 0; filter: blur(10px); }
          to   { opacity: 1; filter: blur(0); }
        }

        @supports (animation-timeline: view()) {
          .sd-card {
            animation-timeline: view();
            animation-range: entry 0% cover 35%;
            animation-fill-mode: both;
            animation-duration: 1ms;
          }
          .sd-card[data-reveal="fade-up"]    { animation-name: sd-fade-up; }
          .sd-card[data-reveal="slide-in"]   { animation-name: sd-slide-in; }
          .sd-card[data-reveal="scale-in"]   { animation-name: sd-scale-in; }
          .sd-card[data-reveal="rotate-fade"]{ animation-name: sd-rotate-fade; }
          .sd-card[data-reveal="blur-reveal"]{ animation-name: sd-blur-reveal; }
        }
      `}</style>

      <div className="border-border/60 bg-muted/15 flex items-center justify-between rounded-t-xl border border-b-0 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-400/70" />
          <span className="size-2 rounded-full bg-amber-400/70" />
          <span className="size-2 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-muted-foreground/55 font-mono text-2xs">
          atlas.app/feed
        </span>
        <span className="w-12" />
      </div>

      <div
        role="progressbar"
        aria-label="Feed scroll progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-secondary/30 border-border/60 h-0.5 overflow-hidden border-x"
      >
        <div
          aria-hidden="true"
          className="bg-emerald-500 dark:bg-emerald-400 h-full w-full origin-left"
          style={{
            transform: `scaleX(${progress / 100})`,
            transition: "transform 60ms linear",
          }}
        />
      </div>

      <div
        onScroll={onScroll}
        className="border-border/60 bg-secondary/15 h-[22.5rem] overflow-y-auto rounded-b-xl rounded-t-none border px-5 py-5"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="flex flex-col gap-3">
          {FEED.map((card, i) => (
            <div
              key={i}
              data-reveal={card.reveal}
              className={cn(
                "border-border/55 bg-card/80 flex min-h-[7.5rem] items-center gap-4 rounded-lg border px-4 py-5",
                card.reveal && "sd-card",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-full",
                  card.iconClass,
                )}
              >
                {card.icon}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-foreground text-sm font-semibold">
                  {card.title}
                </span>
                <span className="text-muted-foreground/70 truncate font-mono text-2xs">
                  {card.meta}
                </span>
                <span className="text-muted-foreground/55 truncate text-2xs">
                  {card.detail}
                </span>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-2xs uppercase tracking-mini",
                  card.pillClass,
                )}
              >
                {card.pill}
              </span>
            </div>
          ))}
        </div>
      </div>

      {supported === false && (
        <p className="text-muted-foreground/70 mt-4 text-center text-2xs">
          Your browser doesn't support animation-timeline yet — Chrome 115+, Firefox 110+.
        </p>
      )}
    </figure>
  );
}
