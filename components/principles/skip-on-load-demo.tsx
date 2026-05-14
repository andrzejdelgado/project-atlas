"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "loud" | "refined";

const CARDS = [
  { label: "Revenue", value: "$48,210" },
  { label: "Sessions", value: "3,184" },
  { label: "Conversion", value: "4.2%" },
];

function ReloadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type DashboardProps = {
  variant: Variant;
  loadKey: number;
  dialogOpen: boolean;
  onCloseDialog: () => void;
};

function Dashboard({
  variant,
  loadKey,
  dialogOpen,
  onCloseDialog,
}: DashboardProps) {
  const isOk = variant === "refined";
  // Force re-mount of cards on loadKey change (so the loud variant re-animates)
  return (
    <div className="border-border bg-card/40 relative flex flex-col gap-3 rounded-2xl border px-5 py-5">
      <span
        role="img"
        aria-label={isOk ? "Animates only on user action" : "Animates on every load"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />

      <span
        className={cn(
          "font-mono text-2xs uppercase tracking-mini",
          isOk
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-red-700 dark:text-red-300",
        )}
      >
        {isOk ? "Calm on load" : "Animates on load"}
      </span>

      <div
        key={`${variant}-${loadKey}`}
        className="grid grid-cols-3 gap-2"
      >
        {CARDS.map((c, i) => (
          <div
            key={c.label}
            className={cn(
              "border-border/60 bg-secondary/40 flex flex-col gap-0.5 rounded-lg border px-3 py-3",
              !isOk && "animate-skipload-stagger",
            )}
            style={
              !isOk
                ? {
                    animationDelay: `${i * 90}ms`,
                  }
                : undefined
            }
          >
            <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
              {c.label}
            </span>
            <span className="text-foreground text-sm font-semibold tabular-nums">
              {c.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-border/40 bg-secondary/20 relative h-32 rounded-lg border">
        {dialogOpen && (
          <div
            key={`${variant}-dlg-${loadKey}`}
            className="bg-card animate-dialog-in border-border/70 absolute top-2 left-2 right-2 flex items-start gap-3 rounded-lg border px-3.5 py-3 shadow-lg"
          >
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-xs font-semibold">
                Sync complete
              </span>
              <span className="text-muted-foreground/80 text-2xs">
                12 records pushed to production.
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseDialog}
              aria-label="Close dialog"
              className="text-muted-foreground/70 hover:text-foreground ml-auto rounded p-1 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SkipOnLoadDemo() {
  const [loadKey, setLoadKey] = React.useState(0);
  const [openLoud, setOpenLoud] = React.useState(false);
  const [openRef, setOpenRef] = React.useState(false);

  const reload = () => {
    setLoadKey((k) => k + 1);
    setOpenLoud(false);
    setOpenRef(false);
  };

  const openDialog = () => {
    setOpenLoud(true);
    setOpenRef(true);
  };

  return (
    <figure className="mt-6 flex flex-col gap-5">
      <style>{`
        @keyframes skipload-stagger {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-skipload-stagger {
          animation: skipload-stagger 360ms ease-out backwards;
        }
        @keyframes dialog-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dialog-in {
          animation: dialog-in 220ms ease-out;
        }
      `}</style>

      <div className="grid gap-4 sm:grid-cols-2">
        <Dashboard
          variant="loud"
          loadKey={loadKey}
          dialogOpen={openLoud}
          onCloseDialog={() => setOpenLoud(false)}
        />
        <Dashboard
          variant="refined"
          loadKey={loadKey}
          dialogOpen={openRef}
          onCloseDialog={() => setOpenRef(false)}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reload}
          className="border-border/60 bg-transparent text-muted-foreground hover:text-foreground hover:border-border inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          <ReloadIcon />
          Reload page
        </button>
        <button
          type="button"
          onClick={openDialog}
          className="border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-400/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          Open dialog
        </button>
      </div>
    </figure>
  );
}
