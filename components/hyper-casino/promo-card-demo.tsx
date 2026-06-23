"use client";

import * as React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Gift,
  Sparkles,
  ShieldCheck,
  Trophy,
  Tv,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { snapIndex } from "./gesture-core";
import { usePrefersReducedMotion } from "./hooks";
import { PhoneMockup } from "./phone-mockup";
import { useSwipe } from "./use-swipe";

type Promo = {
  key: string;
  tag: string;
  title: string;
  terms: string;
  icon: LucideIcon;
  gradient: string;
};

const PROMOS: Promo[] = [
  {
    key: "boost",
    tag: "Odds Boost",
    title: "Acca Boost up to +70%",
    terms: "Opt in, then boost any 5+ leg accumulator. Min odds 1.40 per leg.",
    icon: Zap,
    gradient: "linear-gradient(140deg, oklch(0.52 0.22 295), oklch(0.27 0.12 290))",
  },
  {
    key: "freebet",
    tag: "Free Bet",
    title: "€20 in Free Bets",
    terms: "Place €20 on any market this weekend and we'll match it.",
    icon: Gift,
    gradient: "linear-gradient(140deg, oklch(0.56 0.24 350), oklch(0.3 0.13 345))",
  },
  {
    key: "insurance",
    tag: "Insurance",
    title: "Acca Insurance",
    terms: "One leg lets you down on a 6+ fold? Get your stake back up to €25.",
    icon: ShieldCheck,
    gradient: "linear-gradient(140deg, oklch(0.55 0.15 200), oklch(0.3 0.1 235))",
  },
  {
    key: "profit",
    tag: "Profit Boost",
    title: "3× Profit Boost Token",
    terms: "Triple the winnings on one pre-match bet of your choice.",
    icon: Sparkles,
    gradient: "linear-gradient(140deg, oklch(0.72 0.16 80), oklch(0.4 0.12 60))",
  },
];

const MORE = [
  {
    key: "refer",
    icon: Users,
    title: "Refer a friend",
    sub: "Get €25 when they stake €10",
  },
  {
    key: "spin",
    icon: Sparkles,
    title: "Daily Free Spin",
    sub: "One free spin, every day",
  },
  {
    key: "cashout",
    icon: Wallet,
    title: "Cash Out",
    sub: "Settle your bets early, anytime",
  },
  {
    key: "stream",
    icon: Tv,
    title: "Live Streaming",
    sub: "Watch 1,000+ events live",
  },
  {
    key: "rewards",
    icon: Trophy,
    title: "Mercury Rewards",
    sub: "Earn points on every stake",
  },
];

const damp = (active: number, offset: number, last: number) =>
  (active === 0 && offset > 0) || (active === last && offset < 0)
    ? offset * 0.35
    : offset;

export function PromoCardDemo() {
  const reduced = usePrefersReducedMotion();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const [drag, setDrag] = React.useState(0);
  const [opted, setOpted] = React.useState<Record<string, boolean>>({});
  const draggedRef = React.useRef(false);

  const last = PROMOS.length - 1;

  const { handlers, dragging } = useSwipe({
    axis: "x",
    capture: false,
    onStart: () => {
      draggedRef.current = false;
    },
    onMove: (o) => {
      if (Math.abs(o) > 8) draggedRef.current = true;
      setDrag(o);
    },
    onEnd: (r) => {
      setDrag(0);
      if (Math.abs(r.offset) > 8) {
        const w = viewportRef.current?.getBoundingClientRect().width ?? 0;
        setActive((a) => snapIndex(r.offset, r.velocity, w, a, PROMOS.length));
      }
    },
  });

  const go = (i: number) => setActive(Math.max(0, Math.min(last, i)));
  const dragPx = damp(active, drag, last);

  return (
    <PhoneMockup activeNav="home" header={{ title: "Promotions" }}>
      <div>
        <div ref={viewportRef} className="overflow-hidden px-3.5" {...handlers}>
          <div
            className={cn(
              "flex",
              !dragging && !reduced && "transition-transform duration-[350ms] ease-out",
            )}
            style={{
              transform: `translateX(${-active * 100}%) translateX(${dragPx}px)`,
            }}
          >
            {PROMOS.map((p) => {
              const Icon = p.icon;
              const isOpted = opted[p.key];
              return (
                <div key={p.key} className="w-full shrink-0 pr-3">
                  <article
                    className="relative flex min-h-[14.5rem] flex-col justify-between overflow-hidden rounded-3xl p-5"
                    style={{ background: p.gradient }}
                  >
                    {/* sheen */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(120% 90% at 85% 0%, oklch(1 0 0 / 0.22), transparent 55%)",
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                        <Icon className="size-5.5 text-white" />
                      </span>
                      <span className="rounded-full bg-black/25 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">
                        {p.tag}
                      </span>
                    </div>
                    <div className="relative mt-4">
                      <h4 className="text-[1.35rem] font-extrabold leading-tight text-white">
                        {p.title}
                      </h4>
                      <p className="mt-1.5 max-w-[18rem] text-[0.72rem] leading-relaxed text-white/80">
                        {p.terms}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (draggedRef.current) return;
                        setOpted((o) => ({ ...o, [p.key]: !o[p.key] }));
                      }}
                      aria-pressed={isOpted}
                      style={
                        isOpted
                          ? undefined
                          : {
                              background:
                                "linear-gradient(140deg, oklch(0.99 0.006 255), oklch(0.85 0.02 258))",
                            }
                      }
                      className={cn(
                        "relative mt-4 flex items-center justify-center gap-1.5 overflow-hidden rounded-xl py-2.5 text-[0.82rem] font-bold transition-colors duration-300",
                        isOpted
                          ? "bg-[var(--hc-lime)] text-[var(--hc-lime-fg)]"
                          : "hc-promo-shine border border-white/60 text-neutral-900 shadow-[0_5px_16px_-6px_oklch(0_0_0/0.45)]",
                      )}
                    >
                      {isOpted ? (
                        <>
                          <Check className="size-4" strokeWidth={3} />
                          Opted in
                        </>
                      ) : (
                        "Redeem Promotion"
                      )}
                    </button>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* controls */}
        <div className="mt-3 flex items-center justify-between px-3.5">
          <div className="flex gap-1.5">
            {PROMOS.map((p, i) => (
              <button
                key={p.key}
                onClick={() => go(i)}
                aria-label={`Go to promotion ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-5 bg-[var(--hc-violet)]" : "w-1.5 bg-white/20",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <ArrowBtn label="Previous" disabled={active === 0} onClick={() => go(active - 1)}>
              <ChevronLeft className="size-4" strokeWidth={2.5} />
            </ArrowBtn>
            <ArrowBtn label="Next" disabled={active === last} onClick={() => go(active + 1)}>
              <ChevronRight className="size-4" strokeWidth={2.5} />
            </ArrowBtn>
          </div>
        </div>

        {/* More for you — fills out a realistic promotions screen. */}
        <div className="mt-5 px-3.5 pb-2">
          <h4 className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--hc-muted)]">
            More for you
          </h4>
          <div className="space-y-2">
            {MORE.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.key}
                  className="flex items-center gap-3 rounded-xl border border-[var(--hc-border)] bg-[var(--hc-surface)] px-3 py-2.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--hc-surface-2)] text-[var(--hc-violet)]">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.82rem] font-semibold leading-tight">
                      {m.title}
                    </p>
                    <p className="truncate text-[0.66rem] text-[var(--hc-muted)]">{m.sub}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-[var(--hc-faint)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PhoneMockup>
  );
}

function ArrowBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full border border-[var(--hc-border)] bg-[var(--hc-surface)] text-[var(--hc-fg)] transition-colors hover:border-[var(--hc-border-strong)] disabled:opacity-30 active:scale-95"
    >
      {children}
    </button>
  );
}
