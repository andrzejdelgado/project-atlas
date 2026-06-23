"use client";

import * as React from "react";
import { LogIn, MoveHorizontal, Ticket, Trash2, Undo2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { TeamKit, eur, odds, type Lch } from "./app-chrome";
import { Drawer } from "./drawer";
import { useAnimatedNumber, usePrefersReducedMotion } from "./hooks";
import { PhoneMockup } from "./phone-mockup";
import { useSwipe } from "./use-swipe";

type Kit = {
  primary: Lch;
  sleeve?: Lch;
  accent: Lch;
  trim: string;
  variant?: "football" | "basketball";
};
type Sel = {
  id: string;
  home: string;
  away: string;
  market: string;
  pick: string;
  price: number;
  /** Kit colours of the picked team. */
  kit: Kit;
};
/** One reversible removal — the bets it took out (with their original slot) so
 *  Undo can drop them back where they were. */
type UndoEntry = { id: number; bets: { sel: Sel; index: number }[]; label: string };

const INITIAL: Sel[] = [
  {
    id: "s1",
    home: "Arsenal",
    away: "Chelsea",
    market: "Match Result",
    pick: "Arsenal",
    price: 2.1,
    kit: {
      primary: { l: 0.55, c: 0.2, h: 25 },
      sleeve: { l: 0.95, c: 0.01, h: 255 },
      accent: { l: 0.95, c: 0.012, h: 255 },
      trim: "oklch(0.57 0.22 25)",
    },
  },
  {
    id: "s2",
    home: "Lakers",
    away: "Celtics",
    market: "Moneyline",
    pick: "Lakers",
    price: 1.8,
    kit: {
      primary: { l: 0.8, c: 0.16, h: 90 },
      accent: { l: 0.42, c: 0.17, h: 300 },
      trim: "oklch(0.97 0.01 280)",
      variant: "basketball",
    },
  },
  {
    id: "s3",
    home: "Real Madrid",
    away: "Barcelona",
    market: "Match Result",
    pick: "Real Madrid",
    price: 1.66,
    kit: {
      primary: { l: 0.93, c: 0.012, h: 250 },
      accent: { l: 0.46, c: 0.085, h: 178 },
      trim: "oklch(0.43 0.13 14)",
    },
  },
];

const ADD_CHIPS = [1, 5, 10, 100];

export function BetslipDemo() {
  const reduced = usePrefersReducedMotion();
  const [sels, setSels] = React.useState(INITIAL);
  const [betType, setBetType] = React.useState<"single" | "acca">("acca");
  const [accaStake, setAccaStake] = React.useState(10);
  const [stakes, setStakes] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(INITIAL.map((s) => [s.id, 0])),
  );
  // null = drawer closed; "acca" = editing the accumulator stake; else a selection id.
  const [amountTarget, setAmountTarget] = React.useState<string | null>(null);
  const [loginOpen, setLoginOpen] = React.useState(false);

  const count = sels.length;
  const accaOdds = sels.reduce((p, s) => p * s.price, 1);
  const accaReturns = useAnimatedNumber(count ? accaStake * accaOdds : 0, reduced);
  const singlesTotalStake = sels.reduce((sum, s) => sum + (stakes[s.id] ?? 0), 0);
  const singlesReturns = useAnimatedNumber(
    sels.reduce((sum, s) => sum + (stakes[s.id] ?? 0) * s.price, 0),
    reduced,
  );

  // Resolve which stake the amount drawer edits — a single bet, or the acca.
  const editingSel =
    amountTarget && amountTarget !== "acca" ? sels.find((s) => s.id === amountTarget) : null;
  const drawerStake =
    amountTarget === "acca" ? accaStake : editingSel ? stakes[editingSel.id] ?? 0 : 0;
  const drawerOdds = amountTarget === "acca" ? accaOdds : editingSel ? editingSel.price : 0;
  const drawerReturns = useAnimatedNumber(drawerStake * drawerOdds, reduced);
  const setDrawerStake: React.Dispatch<React.SetStateAction<number>> = (v) => {
    if (amountTarget === "acca") setAccaStake(v);
    else if (editingSel) {
      const id = editingSel.id;
      setStakes((prev) => ({
        ...prev,
        [id]: typeof v === "function" ? (v as (n: number) => number)(prev[id] ?? 0) : v,
      }));
    }
  };

  // Singles wizard: how many bets still have no stake, and where to go next.
  const singlesUnstaked = sels.filter((s) => (stakes[s.id] ?? 0) === 0).length;
  const othersUnstaked = editingSel
    ? sels.filter((s) => s.id !== editingSel.id && (stakes[s.id] ?? 0) === 0).length
    : 0;
  const placeAmount = amountTarget === "acca" ? accaStake : singlesTotalStake;
  const goToNextUnstaked = () => {
    const next = sels.find((s) => s.id !== amountTarget && (stakes[s.id] ?? 0) === 0);
    if (next) setAmountTarget(next.id);
  };

  const openLogin = () => setLoginOpen(true);

  // Forgiving removal: every delete (×, swipe, or Clear all) pushes an entry
  // onto a small stack of Undo snackbars, so several actions can be reversed —
  // not just the last one (Sonner-style stacking, scoped to the phone).
  const undoSeq = React.useRef(0);
  const [undos, setUndos] = React.useState<UndoEntry[]>([]);
  const [swipeLearned, setSwipeLearned] = React.useState(false);

  const pushUndo = (bets: { sel: Sel; index: number }[], label: string) => {
    const id = (undoSeq.current += 1);
    setUndos((prev) => [...prev, { id, bets, label }].slice(-3));
  };
  // Auto-dismiss lives in UndoStack so it can pause while the stack is hovered.
  const dismissUndo = React.useCallback(
    (id: number) => setUndos((prev) => prev.filter((u) => u.id !== id)),
    [],
  );
  const removeSel = (id: string) => {
    const index = sels.findIndex((s) => s.id === id);
    if (index < 0) return;
    setSwipeLearned(true);
    pushUndo([{ sel: sels[index], index }], `Removed ${sels[index].pick}`);
    setSels((prev) => prev.filter((s) => s.id !== id));
    if (amountTarget === id) setAmountTarget(null);
  };
  const clearAll = () => {
    if (!sels.length) return;
    setSwipeLearned(true);
    pushUndo(
      sels.map((sel, index) => ({ sel, index })),
      `Cleared ${sels.length} selection${sels.length > 1 ? "s" : ""}`,
    );
    setSels([]);
    setAmountTarget(null);
  };
  const runUndo = (id: number) => {
    const entry = undos.find((u) => u.id === id);
    if (entry) {
      setSels((cur) => {
        const next = [...cur];
        [...entry.bets]
          .sort((a, b) => a.index - b.index)
          .forEach(({ sel, index }) => next.splice(Math.min(index, next.length), 0, sel));
        return next;
      });
    }
    setUndos((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <PhoneMockup
      hint={false}
      header={{
        title: "Bet Slip",
        badge:
          count > 0 ? (
            <span className="rounded-full bg-[var(--hc-lime)] px-1.5 py-px text-[0.6rem] font-bold leading-tight text-[var(--hc-lime-fg)] tabular-nums">
              {count}
            </span>
          ) : undefined,
        action:
          count > 0 ? (
            <button
              onClick={clearAll}
              className="-mr-1 rounded-md px-1.5 py-1 text-[0.72rem] font-medium text-[var(--hc-muted)] transition-colors hover:text-[var(--hc-fg)] active:bg-[var(--hc-surface-2)] active:text-[var(--hc-fg)]"
            >
              Clear all
            </button>
          ) : undefined,
      }}
      overlay={
        <>
          <AmountDrawer
            open={amountTarget !== null}
            onClose={() => setAmountTarget(null)}
            stake={drawerStake}
            setStake={setDrawerStake}
            returns={drawerReturns}
            sel={editingSel ?? null}
            count={count}
            placeAmount={placeAmount}
            unstakedCount={singlesUnstaked}
            hasMore={othersUnstaked > 0}
            onContinue={goToNextUnstaked}
            onLogin={() => {
              setAmountTarget(null);
              setLoginOpen(true);
            }}
          />
          <LoginDrawer open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
      }
      footer={
        count === 0 && undos.length === 0 ? undefined : (
          <div className="border-t border-[var(--hc-border)] bg-[var(--hc-surface)] px-3.5 pb-3 pt-3">
            {undos.length > 0 && (
              <UndoStack
                undos={undos}
                onUndo={runUndo}
                onDismiss={dismissUndo}
                withMargin={count > 0}
              />
            )}
            {count > 0 &&
              (betType === "acca" ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[0.72rem] font-medium uppercase tracking-wide text-[var(--hc-muted)]">
                    Stake
                  </span>
                  <button
                    onClick={() => setAmountTarget("acca")}
                    aria-label="Edit stake"
                    className="min-w-[4rem] rounded-lg border border-[var(--hc-border)] bg-[var(--hc-surface-2)] px-2.5 py-1 text-center text-[0.8rem] font-bold tabular-nums transition-colors hover:border-[var(--hc-border-strong)]"
                  >
                    {eur(accaStake)}
                  </button>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[var(--hc-border)] pt-3 text-[0.78rem]">
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="font-medium text-[var(--hc-fg)]">Total stake</span>
                      <span className="text-[var(--hc-faint)]"> @ </span>
                      <span className="text-[var(--hc-muted)]">Total odds</span>
                    </span>
                    <span className="tabular-nums">
                      <span className="font-semibold text-[var(--hc-fg)]">{eur(accaStake)}</span>
                      <span className="text-[var(--hc-faint)]"> @ </span>
                      <span className="text-[var(--hc-muted)]">{odds(accaOdds)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-semibold">Potential returns</span>
                    <span className="text-[1.05rem] font-extrabold tabular-nums text-[var(--hc-lime)]">
                      {eur(accaReturns)}
                    </span>
                  </div>
                </div>
                <PlaceBetButton
                  amount={accaStake}
                  onLogin={openLogin}
                  disabled={accaStake === 0}
                  className="mt-3"
                />
              </>
            ) : (
              <>
                <div className="space-y-1.5 text-[0.78rem]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--hc-fg)]">Total stake</span>
                    <span className="font-semibold tabular-nums text-[var(--hc-fg)]">
                      {eur(singlesTotalStake)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-semibold">Potential returns</span>
                    <span className="text-[1.05rem] font-extrabold tabular-nums text-[var(--hc-lime)]">
                      {eur(singlesReturns)}
                    </span>
                  </div>
                </div>
                <PlaceBetButton
                  amount={singlesTotalStake}
                  onLogin={openLogin}
                  disabled={singlesTotalStake === 0}
                  className="mt-3"
                />
              </>
              ))}
          </div>
        )
      }
    >
      <div className="px-3.5">
        {count === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* bet type */}
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-[var(--hc-border)] bg-[var(--hc-surface)] p-1">
              {(["single", "acca"] as const).map((t) => (
                <button
                  key={t}
                  aria-pressed={betType === t}
                  onClick={() => setBetType(t)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border border-transparent py-1.5 text-[0.78rem] font-semibold capitalize transition-colors",
                    betType === t
                      ? "border-[var(--hc-border-strong)] bg-[oklch(0.33_0.022_265)] text-[var(--hc-fg)] shadow-md"
                      : "text-[var(--hc-muted)]",
                  )}
                >
                  {t === "acca" && <MultiplesIcon className="size-4 shrink-0" />}
                  {t === "acca" ? "Multiples" : "Singles"}
                </button>
              ))}
            </div>

            {/* selections */}
            <div className="overflow-hidden rounded-2xl border border-[var(--hc-border)] divide-y divide-[var(--hc-border)]">
              {sels.map((s) => (
                <BetslipRow
                  key={s.id}
                  sel={s}
                  reduced={reduced}
                  singles={betType === "single"}
                  stake={stakes[s.id] ?? 0}
                  onEditStake={() => setAmountTarget(betType === "single" ? s.id : "acca")}
                  onRemove={() => removeSel(s.id)}
                />
              ))}
            </div>

            <SwipeHint reduced={reduced} dismissed={swipeLearned} />
          </>
        )}
      </div>
    </PhoneMockup>
  );
}

/** The Place-bet CTA + its logged-out flow: warn (shake) → persistent login
 *  nudge; clicking that nudge opens the login drawer. Self-contained so it can
 *  be the slip total (Multiples), one per Single, or the amount-drawer CTA. */
function PlaceBetButton({
  amount,
  size = "lg",
  className,
  onLogin,
  disabled,
}: {
  amount: number;
  size?: "lg" | "sm";
  className?: string;
  onLogin?: () => void;
  disabled?: boolean;
}) {
  const [betState, setBetState] = React.useState<"idle" | "warn" | "prompt">("idle");
  const sm = size === "sm";

  const place = () => {
    if (disabled || betState === "warn") return;
    if (betState === "prompt") {
      onLogin?.();
      return;
    }
    setBetState("warn");
    window.setTimeout(() => setBetState("prompt"), 1600);
  };

  return (
    <button
      onClick={place}
      disabled={disabled}
      className={cn(
        "flex w-full items-center justify-center gap-1.5 font-bold transition-all duration-300",
        sm ? "rounded-xl py-2 text-[0.8rem]" : "gap-2 rounded-2xl py-2.5 text-[0.82rem]",
        disabled
          ? "cursor-not-allowed bg-[var(--hc-surface-2)] text-[var(--hc-faint)]"
          : cn(
              "active:scale-[0.98]",
              betState === "warn"
                ? "bg-[var(--hc-red)] text-white hc-bet-shake"
                : betState === "prompt"
                  ? "bg-[var(--hc-lime)] text-[var(--hc-lime-fg)] hc-promo-shine relative overflow-hidden"
                  : "bg-[var(--hc-violet)] text-[var(--hc-violet-fg)]",
            ),
        className,
      )}
    >
      {betState === "warn" ? (
        <>
          <X className={sm ? "size-4" : "size-5"} strokeWidth={3} />
          Please login first
        </>
      ) : betState === "prompt" ? (
        <>
          <LogIn className={sm ? "size-4" : "size-5"} strokeWidth={2.5} />
          Login to place bet
          <span className="tabular-nums opacity-80">· {eur(amount)}</span>
        </>
      ) : (
        <>
          Place bet
          <span className="tabular-nums opacity-80">· {eur(amount)}</span>
        </>
      )}
    </button>
  );
}

function BetslipRow({
  sel,
  onRemove,
  reduced,
  singles,
  stake,
  onEditStake,
}: {
  sel: Sel;
  onRemove: () => void;
  reduced: boolean;
  singles: boolean;
  stake: number;
  onEditStake: () => void;
}) {
  const [dx, setDx] = React.useState(0);
  const [removing, setRemoving] = React.useState(false);
  const draggedRef = React.useRef(false);

  const triggerRemove = () => {
    setRemoving(true);
    window.setTimeout(onRemove, reduced ? 0 : 230);
  };

  const { handlers, dragging } = useSwipe({
    axis: "x",
    // capture:false so inner buttons (stake chip, ×) still get native clicks.
    capture: false,
    commitDistance: 96,
    commitVelocity: 0.5,
    onStart: () => {
      draggedRef.current = false;
    },
    onMove: (o) => {
      if (Math.abs(o) > 6) draggedRef.current = true;
      setDx(Math.max(-140, Math.min(0, o)));
    },
    onEnd: (r) => {
      if (r.committed && r.direction < 0) triggerRemove();
      else setDx(0);
    },
  });

  return (
    <div
      className="relative overflow-hidden transition-[max-height,opacity] duration-200 ease-out"
      style={{ maxHeight: removing ? 0 : 120, opacity: removing ? 0 : 1 }}
    >
      {/* remove reveal */}
      <div className="absolute inset-0 flex items-center justify-end gap-1.5 bg-[var(--hc-red)] pr-5 text-[0.8rem] font-semibold text-white">
        <Trash2 className="size-4" />
        Remove
      </div>
      {/* foreground */}
      <div
        {...handlers}
        className={cn(
          "relative touch-pan-y bg-[var(--hc-surface)] px-4 py-3",
          !dragging && "transition-transform duration-200 ease-out",
        )}
        style={{ transform: `translate3d(${removing ? -420 : dx}px,0,0)` }}
      >
        <div className="flex items-center gap-2.5">
          {/* tapping the selection opens the amount drawer (Polymarket-style) */}
          <button
            type="button"
            onClick={() => {
              if (!draggedRef.current) onEditStake();
            }}
            aria-label={`Edit stake for ${sel.pick}`}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          >
            <TeamKit
              primary={sel.kit.primary}
              sleeve={sel.kit.sleeve}
              accent={sel.kit.accent}
              trim={sel.kit.trim}
              variant={sel.kit.variant}
              className="size-10 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.85rem] font-semibold leading-tight">{sel.pick}</p>
              <p className="truncate text-[0.66rem] text-[var(--hc-muted)]">
                {sel.market} · {sel.home} v {sel.away}
              </p>
            </div>
          </button>
          {singles ? (
            <button
              type="button"
              onClick={() => {
                if (!draggedRef.current) onEditStake();
              }}
              className="shrink-0 rounded-lg border border-[var(--hc-border)] bg-[var(--hc-surface-2)] px-2.5 py-1 text-center leading-tight transition-colors hover:border-[var(--hc-border-strong)]"
            >
              <span className="block text-[0.8rem] font-bold tabular-nums text-[var(--hc-fg)]">
                {eur(stake)}
              </span>
              <span className="block text-[0.6rem] font-semibold tabular-nums text-[var(--hc-muted)]">
                @{odds(sel.price)}
              </span>
            </button>
          ) : (
            <span className="shrink-0 text-[0.9rem] font-bold tabular-nums">
              {odds(sel.price)}
            </span>
          )}
          <button
            onClick={triggerRemove}
            aria-label={`Remove ${sel.pick}`}
            className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--hc-faint)] transition-colors hover:bg-[var(--hc-surface-2)] hover:text-[var(--hc-red)]"
          >
            <Trash2 className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Polymarket-style amount sheet: a big keyboard-typeable amount, quick-add
 *  chips and the place CTA. Edits the shared stake live. */
function AmountDrawer({
  open,
  onClose,
  stake,
  setStake,
  returns,
  sel,
  count,
  placeAmount,
  unstakedCount,
  hasMore,
  onContinue,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  stake: number;
  setStake: React.Dispatch<React.SetStateAction<number>>;
  returns: number;
  sel: Sel | null;
  count: number;
  placeAmount: number;
  unstakedCount: number;
  hasMore: boolean;
  onContinue: () => void;
  onLogin: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          {sel ? (
            <TeamKit
              primary={sel.kit.primary}
              sleeve={sel.kit.sleeve}
              accent={sel.kit.accent}
              trim={sel.kit.trim}
              variant={sel.kit.variant}
              className="size-9 shrink-0"
            />
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--hc-surface)]">
              <MultiplesIcon className="size-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-bold leading-tight">
              {sel ? sel.pick : "Multiples"}
            </p>
            <p className="truncate text-[0.7rem] text-[var(--hc-muted)]">
              {sel ? `${sel.market} · Single` : `${count} selections`}
            </p>
          </div>
        </div>

        {/* big editable amount — € hugs the number; both go white once a value is
            entered, and it caps at 5 digits so it never overflows. */}
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
          To win{" "}
          <span className="font-bold text-[var(--hc-lime)] tabular-nums">{eur(returns)}</span>
        </p>

        {/* quick-add chips */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {ADD_CHIPS.map((n) => (
            <button
              key={n}
              onClick={() => setStake((s) => s + n)}
              className="rounded-xl border border-[var(--hc-border)] bg-[var(--hc-surface)] py-2.5 text-[0.8rem] font-semibold tabular-nums transition-colors hover:bg-[var(--hc-surface-2)] active:scale-95"
            >
              +€{n}
            </button>
          ))}
        </div>

        {sel && unstakedCount > 0 && (
          <p className="mt-4 text-center text-[0.72rem] text-[var(--hc-muted)]">
            {unstakedCount} {unstakedCount === 1 ? "bet still needs" : "bets still need"} a stake
          </p>
        )}

        {sel && hasMore ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={stake === 0}
            className={cn(
              "mt-3 flex w-full items-center justify-center rounded-2xl py-2.5 text-[0.95rem] font-bold transition-all duration-200",
              stake === 0
                ? "cursor-not-allowed bg-[var(--hc-surface-2)] text-[var(--hc-faint)]"
                : "bg-[var(--hc-violet)] text-[var(--hc-violet-fg)] active:scale-[0.98]",
            )}
          >
            Continue
          </button>
        ) : (
          <PlaceBetButton
            amount={placeAmount}
            onLogin={onLogin}
            disabled={stake === 0}
            className={sel && unstakedCount > 0 ? "mt-3" : "mt-4"}
          />
        )}
      </div>
    </Drawer>
  );
}

/** Polymarket-style sign-in sheet, branded: Google + email + 4 wallets. */
function LoginDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose}>
      <div className="px-5">
        <h3 className="mb-4 mt-1 text-center text-[1.1rem] font-bold">Welcome to Mercury</h3>

        <button className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--hc-violet)] py-3 text-[0.9rem] font-bold text-[var(--hc-violet-fg)] transition-transform active:scale-[0.98]">
          <span className="flex size-5 items-center justify-center rounded-full bg-white p-[3px]">
            <GoogleIcon />
          </span>
          Continue with Google
        </button>

        <div className="my-3.5 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--hc-border)]" />
          <span className="text-[0.66rem] font-semibold text-[var(--hc-faint)]">OR</span>
          <span className="h-px flex-1 bg-[var(--hc-border)]" />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--hc-border)] bg-[var(--hc-surface)] p-1.5 pl-3.5">
          <input
            placeholder="Email address"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent text-[0.85rem] text-[var(--hc-fg)] outline-none placeholder:text-[var(--hc-faint)]"
          />
          <button className="shrink-0 rounded-lg bg-[var(--hc-surface-2)] px-3.5 py-2 text-[0.8rem] font-semibold transition-colors hover:bg-[var(--hc-border-strong)]">
            Continue
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-4 gap-2.5">
          {WALLETS.map((w) => (
            <button
              key={w.name}
              aria-label={w.name}
              className="flex aspect-square items-center justify-center rounded-xl border border-[var(--hc-border)] bg-[var(--hc-surface)] transition-colors hover:bg-[var(--hc-surface-2)] active:scale-95"
            >
              <span
                aria-hidden
                className="size-9 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${w.src})` }}
              />
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[0.62rem] text-[var(--hc-faint)]">Terms · Privacy</p>
      </div>
    </Drawer>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--hc-border-strong)] px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[var(--hc-surface-2)] text-[var(--hc-muted)]">
        <Ticket className="size-6" />
      </span>
      <div>
        <p className="text-[0.9rem] font-semibold">Your betslip is empty</p>
        <p className="mt-1 text-[0.72rem] text-[var(--hc-muted)]">
          Add a selection from any market to get started.
        </p>
      </div>
    </div>
  );
}

/** A Sonner-style stack of Undo snackbars — the safety net for ×, swipe-to-
 *  remove and Clear all. Collapsed it shows the newest removal with the rest
 *  peeking behind; hovering fans them out so any recent removal can be undone,
 *  not just the last. Scoped to the phone (real Sonner is viewport-global), and
 *  it overlays upward on expand so it never shifts the layout or the CTA. */
function UndoStack({
  undos,
  onUndo,
  onDismiss,
  withMargin,
}: {
  undos: UndoEntry[];
  onUndo: (id: number) => void;
  onDismiss: (id: number) => void;
  withMargin: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);

  // Each toast self-dismisses after a few seconds, but the countdown pauses
  // while the stack is hovered/expanded so it can't disappear mid-undo.
  const timers = React.useRef<Map<number, number>>(new Map());
  React.useEffect(() => {
    const t = timers.current;
    for (const id of [...t.keys()]) {
      if (!undos.some((u) => u.id === id)) {
        window.clearTimeout(t.get(id));
        t.delete(id);
      }
    }
    if (expanded) {
      t.forEach((timer) => window.clearTimeout(timer));
      t.clear();
      return;
    }
    undos.forEach((u) => {
      if (!t.has(u.id)) {
        t.set(
          u.id,
          window.setTimeout(() => {
            t.delete(u.id);
            onDismiss(u.id);
          }, 6000),
        );
      }
    });
  }, [undos, expanded, onDismiss]);
  React.useEffect(() => {
    const t = timers.current;
    return () => t.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const list = undos.slice(-3); // oldest → newest, at most three
  const n = list.length;
  const ROW = 40; // card height
  const GAP = 8; // gap between cards when fanned out
  const PEEK = 7; // sliver of each card peeking when collapsed
  return (
    <div
      className={cn("relative", withMargin && "mb-3")}
      style={{ height: ROW + (n - 1) * PEEK }}
      onPointerEnter={() => setExpanded(true)}
      onPointerLeave={() => setExpanded(false)}
    >
      {list.map((u, i) => {
        const depth = n - 1 - i; // 0 = newest (front)
        const y = expanded ? -depth * (ROW + GAP) : -depth * PEEK;
        const scale = expanded ? 1 : 1 - depth * 0.04;
        const live = expanded || depth === 0;
        return (
          <div
            key={u.id}
            className="absolute inset-x-0 bottom-0 origin-bottom transition-all duration-300 ease-out"
            style={{
              transform: `translateY(${y}px) scale(${scale})`,
              opacity: depth > 2 ? 0 : 1,
              zIndex: i,
              pointerEvents: live ? "auto" : "none",
            }}
          >
            <UndoCard label={u.label} onUndo={() => onUndo(u.id)} />
          </div>
        );
      })}
    </div>
  );
}

function UndoCard({ label, onUndo }: { label: string; onUndo: () => void }) {
  return (
    <div className="flex h-10 items-center justify-between gap-3 rounded-xl border border-[var(--hc-border-strong)] bg-[var(--hc-surface-2)] px-3 shadow-[0_6px_16px_-6px_oklch(0_0_0/0.6)]">
      <span className="flex min-w-0 items-center gap-2 text-[0.76rem] text-[var(--hc-muted)]">
        <Undo2 className="size-3.5 shrink-0" />
        <span className="truncate text-[var(--hc-fg)]">{label}</span>
      </span>
      <button
        onClick={onUndo}
        className="shrink-0 rounded-md px-2 py-1 text-[0.78rem] font-bold text-[var(--hc-lime)] transition-colors hover:bg-[var(--hc-surface)] active:bg-[var(--hc-border)]"
      >
        Undo
      </button>
    </div>
  );
}

/** A self-retiring coach mark sitting just under the selections, teaching the
 *  swipe-to-remove gesture. Appears when the slip scrolls into view, then
 *  retires after a few seconds or once a bet is removed (the user got it). */
function SwipeHint({ reduced, dismissed }: { reduced: boolean; dismissed: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);
  const [done, setDone] = React.useState(false);
  // The slip sits well down the page, so start the countdown only once it
  // scrolls into view — otherwise the hint times out before anyone sees it.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setShow(true);
        timer = window.setTimeout(() => {
          setShow(false);
          setDone(true);
        }, 6000);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div ref={ref} className="flex justify-center pt-3">
      {show && !done && !dismissed && (
        <span
          className={cn(
            "pointer-events-none flex items-center gap-1.5 rounded-full border border-[var(--hc-border-strong)] bg-[oklch(0.17_0.015_265_/_0.82)] px-3 py-1.5 text-[0.7rem] font-medium text-[var(--hc-fg)]",
            !reduced && "animate-pulse",
          )}
        >
          <MoveHorizontal className="size-3.5 text-[var(--hc-violet)]" />
          Swipe a bet to remove it
        </span>
      )}
    </div>
  );
}

// ── Icons ───────────────────────────────────────────────────────────────────

/** Multiples — the "combo stack" mark (mutiples-svg) in the brand
 *  green→purple gradient. */
function MultiplesIcon({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 319 309" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`mg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--hc-lime)" />
          <stop offset="100%" stopColor="var(--hc-violet)" />
        </linearGradient>
      </defs>
      <path
        d="M138.235 35.635C141.081 9.10198 169.317 -7.73182 194.423 3.57251L295.423 49.051C309.772 55.5123 319 69.7867 319 85.5237V224.482C319 240.386 309.577 254.78 295.001 261.142L194.001 305.225C168.859 316.198 140.863 299.201 138.205 272.692L138 272.781V35.5286L138.235 35.635ZM107 282.688C85.9089 282.698 67.0001 265.697 67 242.646V65.4612C67 42.3824 85.9325 25.4093 107 25.4153V282.688ZM36 245.55C16.5749 243.571 0.000125022 227.29 0 205.709V106.395C0 84.7899 16.5934 68.5333 36 66.553V245.55Z"
        fill={`url(#mg-${uid})`}
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"
      />
    </svg>
  );
}

const WALLETS: { name: string; src: string }[] = [
  { name: "Steam", src: "/hyper-casino/steam.svg" },
  { name: "MetaMask", src: "/hyper-casino/metamask.svg" },
  { name: "Coinbase Wallet", src: "/hyper-casino/coinbase.svg" },
  { name: "Phantom", src: "/hyper-casino/phantom.svg" },
];
