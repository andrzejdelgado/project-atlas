"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronRight, Flame, Ticket } from "lucide-react";

import { cn } from "@/lib/utils";
import { TeamKit, eur, odds, type Lch } from "./app-chrome";
import { Drawer } from "./drawer";
import { snapIndex } from "./gesture-core";
import { useAnimatedNumber, usePrefersReducedMotion } from "./hooks";
import { PhoneMockup } from "./phone-mockup";
import { useSwipe } from "./use-swipe";

type Opt = { label: string; sub: string; price: number };
type Market = { key: string; name: string; short: string; options: Opt[] };
type Kit = { primary: Lch; sleeve?: Lch; accent: Lch; trim: string };
type Team = { name: string; kit: Kit };
type Match = {
  id: string;
  home: Team;
  away: Team;
  score: [number, number];
  minute: number;
  prices: {
    result: [number, number, number];
    ou: [number, number];
    btts: [number, number];
  };
};

// Kit colours — each team read by colour + form only (no copyrighted marks).
const KITS: Record<string, Kit> = {
  arsenal: {
    primary: { l: 0.55, c: 0.2, h: 25 },
    sleeve: { l: 0.95, c: 0.01, h: 255 },
    accent: { l: 0.95, c: 0.012, h: 255 },
    trim: "oklch(0.57 0.22 25)",
  },
  chelsea: {
    primary: { l: 0.48, c: 0.16, h: 256 },
    accent: { l: 0.8, c: 0.13, h: 85 },
    trim: "oklch(0.96 0.012 250)",
  },
  mancity: {
    primary: { l: 0.72, c: 0.11, h: 230 },
    accent: { l: 0.4, c: 0.08, h: 262 },
    trim: "oklch(0.96 0.01 250)",
  },
  tottenham: {
    primary: { l: 0.95, c: 0.006, h: 255 },
    accent: { l: 0.35, c: 0.08, h: 265 },
    trim: "oklch(0.4 0.08 265)",
  },
  liverpool: {
    primary: { l: 0.52, c: 0.21, h: 28 },
    accent: { l: 0.72, c: 0.1, h: 180 },
    trim: "oklch(0.95 0.01 255)",
  },
  everton: {
    primary: { l: 0.45, c: 0.13, h: 258 },
    accent: { l: 0.95, c: 0.006, h: 255 },
    trim: "oklch(0.95 0.006 255)",
  },
  newcastle: {
    primary: { l: 0.28, c: 0.01, h: 265 },
    sleeve: { l: 0.95, c: 0.006, h: 255 },
    accent: { l: 0.95, c: 0.006, h: 255 },
    trim: "oklch(0.3 0.01 265)",
  },
  wolves: {
    primary: { l: 0.78, c: 0.16, h: 80 },
    accent: { l: 0.28, c: 0.01, h: 265 },
    trim: "oklch(0.3 0.02 80)",
  },
  villa: {
    primary: { l: 0.4, c: 0.13, h: 18 },
    sleeve: { l: 0.6, c: 0.13, h: 232 },
    accent: { l: 0.6, c: 0.13, h: 232 },
    trim: "oklch(0.62 0.14 232)",
  },
  brighton: {
    primary: { l: 0.55, c: 0.14, h: 248 },
    accent: { l: 0.95, c: 0.006, h: 255 },
    trim: "oklch(0.95 0.006 255)",
  },
  manutd: {
    primary: { l: 0.5, c: 0.21, h: 27 },
    accent: { l: 0.85, c: 0.16, h: 85 },
    trim: "oklch(0.3 0.05 30)",
  },
  fulham: {
    primary: { l: 0.95, c: 0.006, h: 255 },
    accent: { l: 0.25, c: 0.01, h: 265 },
    trim: "oklch(0.25 0.01 265)",
  },
  westham: {
    primary: { l: 0.38, c: 0.13, h: 20 },
    sleeve: { l: 0.6, c: 0.14, h: 235 },
    accent: { l: 0.6, c: 0.14, h: 235 },
    trim: "oklch(0.62 0.14 235)",
  },
  palace: {
    primary: { l: 0.55, c: 0.2, h: 25 },
    sleeve: { l: 0.5, c: 0.16, h: 258 },
    accent: { l: 0.5, c: 0.16, h: 258 },
    trim: "oklch(0.52 0.16 258)",
  },
  brentford: {
    primary: { l: 0.56, c: 0.2, h: 26 },
    sleeve: { l: 0.95, c: 0.006, h: 255 },
    accent: { l: 0.95, c: 0.006, h: 255 },
    trim: "oklch(0.57 0.22 26)",
  },
  bournemouth: {
    primary: { l: 0.54, c: 0.2, h: 26 },
    sleeve: { l: 0.25, c: 0.01, h: 265 },
    accent: { l: 0.25, c: 0.01, h: 265 },
    trim: "oklch(0.28 0.05 30)",
  },
  forest: {
    primary: { l: 0.53, c: 0.21, h: 27 },
    accent: { l: 0.95, c: 0.006, h: 255 },
    trim: "oklch(0.95 0.01 255)",
  },
  leicester: {
    primary: { l: 0.5, c: 0.14, h: 256 },
    accent: { l: 0.85, c: 0.14, h: 90 },
    trim: "oklch(0.96 0.01 250)",
  },
};

const team = (name: string, kit: string): Team => ({ name, kit: KITS[kit] });

const MATCHES: Match[] = [
  {
    id: "m1",
    home: team("Arsenal", "arsenal"),
    away: team("Chelsea", "chelsea"),
    score: [1, 0],
    minute: 67,
    prices: { result: [2.1, 3.4, 3.25], ou: [1.95, 1.85], btts: [1.72, 2.05] },
  },
  {
    id: "m2",
    home: team("Man City", "mancity"),
    away: team("Tottenham", "tottenham"),
    score: [2, 1],
    minute: 73,
    prices: { result: [1.4, 4.8, 6.5], ou: [1.6, 2.3], btts: [1.55, 2.4] },
  },
  {
    id: "m3",
    home: team("Liverpool", "liverpool"),
    away: team("Everton", "everton"),
    score: [0, 0],
    minute: 28,
    prices: { result: [1.75, 3.6, 4.6], ou: [2.0, 1.8], btts: [1.9, 1.9] },
  },
  {
    id: "m4",
    home: team("Newcastle", "newcastle"),
    away: team("Aston Villa", "villa"),
    score: [1, 1],
    minute: 54,
    prices: { result: [2.2, 3.3, 3.1], ou: [1.7, 2.1], btts: [1.5, 2.5] },
  },
  {
    id: "m5",
    home: team("Brighton", "brighton"),
    away: team("Wolves", "wolves"),
    score: [2, 2],
    minute: 80,
    prices: { result: [2.6, 3.5, 2.6], ou: [1.4, 2.9], btts: [1.35, 3.1] },
  },
  {
    id: "m6",
    home: team("Man United", "manutd"),
    away: team("Fulham", "fulham"),
    score: [1, 0],
    minute: 41,
    prices: { result: [1.65, 3.7, 5.0], ou: [2.05, 1.78], btts: [1.85, 1.95] },
  },
  {
    id: "m7",
    home: team("West Ham", "westham"),
    away: team("Crystal Palace", "palace"),
    score: [0, 1],
    minute: 62,
    prices: { result: [3.8, 3.4, 2.0], ou: [2.3, 1.6], btts: [2.1, 1.7] },
  },
  {
    id: "m8",
    home: team("Brentford", "brentford"),
    away: team("Bournemouth", "bournemouth"),
    score: [3, 1],
    minute: 88,
    prices: { result: [1.15, 7.0, 12.0], ou: [1.5, 2.6], btts: [1.6, 2.3] },
  },
  {
    id: "m9",
    home: team("Nottm Forest", "forest"),
    away: team("Leicester", "leicester"),
    score: [0, 0],
    minute: 14,
    prices: { result: [2.05, 3.2, 3.7], ou: [2.1, 1.75], btts: [1.95, 1.85] },
  },
];

function makeMarkets(home: string, away: string, p: Match["prices"]): Market[] {
  return [
    {
      key: "1x2",
      name: "Match Result",
      short: "Result",
      options: [
        { label: "1", sub: home, price: p.result[0] },
        { label: "X", sub: "Draw", price: p.result[1] },
        { label: "2", sub: away, price: p.result[2] },
      ],
    },
    {
      key: "ou",
      name: "Total Goals · 2.5",
      short: "Total Goals",
      options: [
        { label: "Over", sub: "2.5", price: p.ou[0] },
        { label: "Under", sub: "2.5", price: p.ou[1] },
      ],
    },
    {
      key: "btts",
      name: "Both Teams to Score",
      short: "Both Score",
      options: [
        { label: "Yes", sub: "BTTS", price: p.btts[0] },
        { label: "No", sub: "BTTS", price: p.btts[1] },
      ],
    },
  ];
}

const damp = (active: number, offset: number, last: number) =>
  (active === 0 && offset > 0) || (active === last && offset < 0)
    ? offset * 0.35
    : offset;

type Pick = {
  id: string;
  matchTitle: string;
  marketName: string;
  pickName: string;
  price: number;
  kit: Kit;
  stake: number;
};

/** Readable name for a picked option (e.g. "Arsenal", "Over 2.5", "Yes"). */
function pickLabel(m: Market, o: Opt): string {
  if (m.key === "1x2") return o.sub;
  if (m.key === "ou") return `${o.label} ${o.sub}`;
  return o.label;
}

/** Jersey to show in the drawer for a pick (the relevant team, else home). */
function pickKit(m: Market, o: Opt, match: Match): Kit {
  if (m.key === "1x2" && o.label === "1") return match.home.kit;
  if (m.key === "1x2" && o.label === "2") return match.away.kit;
  return match.home.kit;
}

export function GameCouponDemo() {
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = React.useState("live");
  const [picks, setPicks] = React.useState<Record<string, Pick>>({});
  const [amountTarget, setAmountTarget] = React.useState<string | null>(null);

  // Tap selects + opens the amount drawer; tapping a selected pick removes it.
  const onPick = (p: Omit<Pick, "stake">) => {
    if (picks[p.id]) {
      setPicks((prev) => {
        const c = { ...prev };
        delete c[p.id];
        return c;
      });
      if (amountTarget === p.id) setAmountTarget(null);
    } else {
      setPicks((prev) => ({ ...prev, [p.id]: { ...p, stake: 0 } }));
      setAmountTarget(p.id);
    }
  };

  const editingPick = amountTarget ? picks[amountTarget] ?? null : null;
  const setPickStake: React.Dispatch<React.SetStateAction<number>> = (v) => {
    if (!amountTarget) return;
    setPicks((prev) => {
      const cur = prev[amountTarget];
      if (!cur) return prev;
      const next = typeof v === "function" ? (v as (n: number) => number)(cur.stake) : v;
      return { ...prev, [amountTarget]: { ...cur, stake: next } };
    });
  };

  const pickCount = Object.keys(picks).length;

  return (
    <PhoneMockup
      activeNav="live"
      header={{
        title: "Premier League",
        breadcrumb: "Football · England",
        levelSwitcher: true,
      }}
      tabs={{
        items: [
          { key: "popular", label: "Popular", icon: Flame },
          { key: "live", label: "Live", count: 24 },
          { key: "upcoming", label: "Upcoming" },
          { key: "all", label: "All" },
        ],
        active: tab,
        onChange: setTab,
      }}
      overlay={
        <CouponAmountDrawer
          open={amountTarget !== null}
          onClose={() => setAmountTarget(null)}
          pick={editingPick}
          setStake={setPickStake}
          reduced={reduced}
        />
      }
      footer={
        pickCount > 0 ? (
          <div className="px-3.5 pb-3 pt-2">
            <button className="pointer-events-auto flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--hc-violet)] py-3 text-[0.82rem] font-bold text-[var(--hc-violet-fg)] transition-transform active:scale-[0.97]">
              <Ticket className="size-[1.15rem]" strokeWidth={2.25} aria-hidden />
              <span>Betslip</span>
              <span className="rounded-full bg-white/25 px-1.5 py-px text-[0.6rem] font-bold leading-tight tabular-nums">
                {pickCount}
              </span>
            </button>
          </div>
        ) : undefined
      }
      footerOverlay
    >
      <div className="space-y-3 px-3.5 pb-2">
        {MATCHES.map((m) => (
          <CouponCard key={m.id} match={m} reduced={reduced} picks={picks} onPick={onPick} />
        ))}
      </div>
    </PhoneMockup>
  );
}

function CouponCard({
  match,
  reduced,
  picks,
  onPick,
}: {
  match: Match;
  reduced: boolean;
  picks: Record<string, Pick>;
  onPick: (p: Omit<Pick, "stake">) => void;
}) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const [drag, setDrag] = React.useState(0);
  const [markets, setMarkets] = React.useState(() =>
    makeMarkets(match.home.name, match.away.name, match.prices),
  );
  const [flash, setFlash] = React.useState<Record<string, "up" | "down">>({});
  const draggedRef = React.useRef(false);

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
        setActive((a) => snapIndex(r.offset, r.velocity, w, a, markets.length));
      }
    },
  });

  // Live odds movement — a hallmark of real in-play betting.
  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (dragging) return;
      setMarkets((prev) => {
        const mi = Math.floor(Math.random() * prev.length);
        const oi = Math.floor(Math.random() * prev[mi].options.length);
        const up = Math.random() > 0.5;
        const delta = (Math.random() * 0.12 + 0.03) * (up ? 1 : -1);
        const key = `${prev[mi].key}:${prev[mi].options[oi].label}`;
        setFlash((f) => ({ ...f, [key]: up ? "up" : "down" }));
        window.setTimeout(
          () =>
            setFlash((f) => {
              const c = { ...f };
              delete c[key];
              return c;
            }),
          900,
        );
        return prev.map((m, i) =>
          i !== mi
            ? m
            : {
                ...m,
                options: m.options.map((o, j) =>
                  j !== oi
                    ? o
                    : { ...o, price: Math.max(1.05, +(o.price + delta).toFixed(2)) },
                ),
              },
        );
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced, dragging]);

  const dragPx = damp(active, drag, markets.length - 1);
  // Deterministic, varied "more markets" count so coupons don't all read 28.
  const moreMarkets = 18 + ((parseInt(match.id.slice(1), 10) * 13) % 27);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--hc-border)] bg-[var(--hc-surface)]">
      {/* teams */}
      <div className="flex items-center gap-2 px-2.5 pb-3 pt-3.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TeamKit
            primary={match.home.kit.primary}
            sleeve={match.home.kit.sleeve}
            accent={match.home.kit.accent}
            trim={match.home.kit.trim}
            className="size-10 shrink-0"
          />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {match.home.name}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-center px-0.5">
          <span className="text-base font-bold tabular-nums leading-none">
            {match.score[0]}&thinsp;-&thinsp;{match.score[1]}
          </span>
          <LiveMinute minute={match.minute} reduced={reduced} />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold">
            {match.away.name}
          </span>
          <TeamKit
            primary={match.away.kit.primary}
            sleeve={match.away.kit.sleeve}
            accent={match.away.kit.accent}
            trim={match.away.kit.trim}
            className="size-10 shrink-0"
          />
        </div>
      </div>

      {/* market tabs (accessible, non-swipe) */}
      <div role="tablist" aria-label="Markets" className="flex gap-1.5 px-3">
        {markets.map((m, i) => (
          <button
            key={m.key}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            aria-label={m.name}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[0.68rem] font-semibold transition-colors",
              i === active
                ? "bg-[var(--hc-surface-2)] text-[var(--hc-fg)]"
                : "text-[var(--hc-faint)] hover:text-[var(--hc-muted)]",
            )}
          >
            {m.short}
          </button>
        ))}
      </div>

      {/* swipeable odds strip — px on the viewport peeks the next market (swipe cue) */}
      <div ref={viewportRef} className="overflow-hidden px-3 pb-3 pt-2" {...handlers}>
        <div
          className={cn(
            "flex",
            !dragging && !reduced && "transition-transform duration-[350ms] ease-out",
          )}
          style={{
            transform: `translateX(${-active * 100}%) translateX(${dragPx}px)`,
          }}
        >
          {markets.map((m) => (
            <div key={m.key} className="w-full shrink-0 pr-2.5">
              <div
                className={cn(
                  "grid gap-2",
                  m.options.length === 3 ? "grid-cols-3" : "grid-cols-2",
                )}
              >
                {m.options.map((o) => {
                  const pickId = `${match.id}:${m.key}:${o.label}`;
                  const isSel = !!picks[pickId];
                  const dir = flash[`${m.key}:${o.label}`];
                  return (
                    <button
                      key={o.label}
                      type="button"
                      aria-pressed={isSel}
                      onClick={() => {
                        if (draggedRef.current) return;
                        onPick({
                          id: pickId,
                          matchTitle: `${match.home.name} v ${match.away.name}`,
                          marketName: m.name,
                          pickName: pickLabel(m, o),
                          price: o.price,
                          kit: pickKit(m, o, match),
                        });
                      }}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-colors duration-200",
                        isSel
                          ? "border-[var(--hc-violet)] bg-[var(--hc-violet)] text-[var(--hc-violet-fg)]"
                          : dir
                            ? "border-[var(--hc-border-strong)] bg-[var(--hc-surface-2)]"
                            : "border-[var(--hc-border)] bg-[var(--hc-surface-2)]",
                      )}
                    >
                      <span
                        className={cn(
                          "max-w-full truncate px-1 text-[0.62rem] font-medium",
                          isSel ? "text-[var(--hc-violet-fg)]/75" : "text-[var(--hc-faint)]",
                        )}
                      >
                        {o.sub}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-[0.95rem] font-bold tabular-nums transition-colors",
                          isSel
                            ? "text-[var(--hc-violet-fg)]"
                            : dir === "up"
                              ? "text-[var(--hc-lime)]"
                              : dir === "down"
                                ? "text-[var(--hc-red)]"
                                : "text-[var(--hc-fg)]",
                        )}
                      >
                        {dir === "up" && <ArrowUp className="size-3" strokeWidth={3} />}
                        {dir === "down" && <ArrowDown className="size-3" strokeWidth={3} />}
                        {odds(o.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* dots + more markets */}
      <div className="flex items-center justify-between border-t border-[var(--hc-border)] px-4 py-2.5">
        <div className="flex gap-1.5">
          {markets.map((m, i) => (
            <span
              key={m.key}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-4 bg-[var(--hc-violet)]" : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          className="-mr-1 flex items-center gap-0.5 rounded-md py-1 pl-2 pr-1 text-[0.7rem] font-medium text-[var(--hc-muted)] transition-colors hover:text-[var(--hc-fg)] active:bg-[var(--hc-surface-2)] active:text-[var(--hc-fg)]"
        >
          +{moreMarkets} markets
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Tap a coupon option → this opens to stake the pick (mirrors the betslip). */
function CouponAmountDrawer({
  open,
  onClose,
  pick,
  setStake,
  reduced,
}: {
  open: boolean;
  onClose: () => void;
  pick: Pick | null;
  setStake: React.Dispatch<React.SetStateAction<number>>;
  reduced: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  const stake = pick?.stake ?? 0;
  const toWin = useAnimatedNumber(stake * (pick?.price ?? 0), reduced);

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          {pick && (
            <TeamKit
              primary={pick.kit.primary}
              sleeve={pick.kit.sleeve}
              accent={pick.kit.accent}
              trim={pick.kit.trim}
              className="size-9 shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-bold leading-tight">{pick?.pickName}</p>
            <p className="truncate text-[0.7rem] text-[var(--hc-muted)]">
              {pick ? `${pick.marketName} · ${pick.matchTitle}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 py-8">
          <span
            className={cn(
              "text-[2.6rem] font-bold leading-none transition-colors",
              stake > 0 ? "text-[var(--hc-fg)]" : "text-[var(--hc-faint)]",
            )}
          >
            €
          </span>
          <input
            ref={inputRef}
            inputMode="numeric"
            value={stake === 0 ? "" : String(stake)}
            onChange={(e) => {
              const d = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
              setStake(d === "" ? 0 : parseInt(d, 10));
            }}
            placeholder="0"
            aria-label="Stake amount"
            style={{ width: `calc(${stake === 0 ? 1 : String(stake).length}ch + 2px)` }}
            className="bg-transparent text-left text-[3.4rem] font-bold leading-none tabular-nums text-[var(--hc-fg)] caret-[var(--hc-violet)] outline-none placeholder:text-[var(--hc-faint)]"
          />
        </div>

        <p className="text-center text-[0.9rem] font-medium text-[var(--hc-muted)]">
          To win <span className="font-bold text-[var(--hc-lime)] tabular-nums">{eur(toWin)}</span>
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {[1, 5, 10, 100].map((n) => (
            <button
              key={n}
              onClick={() => setStake((s) => s + n)}
              className="rounded-xl border border-[var(--hc-border)] bg-[var(--hc-surface)] py-2.5 text-[0.8rem] font-semibold tabular-nums transition-colors hover:bg-[var(--hc-surface-2)] active:scale-95"
            >
              +€{n}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={stake === 0}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-[0.95rem] font-bold transition-all duration-200",
            stake === 0
              ? "cursor-not-allowed bg-[var(--hc-surface-2)] text-[var(--hc-faint)]"
              : "bg-[var(--hc-violet)] text-[var(--hc-violet-fg)] active:scale-[0.98]",
          )}
        >
          Add to betslip
          <span className="tabular-nums opacity-80">· {eur(stake)}</span>
        </button>
      </div>
    </Drawer>
  );
}

function LiveMinute({ minute, reduced }: { minute: number; reduced: boolean }) {
  return (
    <span className="mt-1 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wide text-[var(--hc-red)]">
      <span className="relative flex size-1.5">
        {!reduced && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--hc-red)] opacity-75" />
        )}
        <span className="relative inline-flex size-1.5 rounded-full bg-[var(--hc-red)]" />
      </span>
      {minute}&rsquo;
    </span>
  );
}
