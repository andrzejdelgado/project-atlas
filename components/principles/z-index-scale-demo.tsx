"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type LayerKey = "dropdown" | "modal" | "toast";

const Z_TOKENS: Record<string, { name: string; value: number }> = {
  card: { name: "--z-base", value: 0 },
  toolbar: { name: "--z-sticky", value: 500 },
  dropdown: { name: "--z-dropdown", value: 1000 },
  overlay: { name: "--z-overlay", value: 2000 },
  modal: { name: "--z-modal", value: 3000 },
  toast: { name: "--z-toast", value: 4000 },
};

function ZBadge({
  token,
  className,
}: {
  token: keyof typeof Z_TOKENS;
  className?: string;
}) {
  const t = Z_TOKENS[token];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-[10] inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-2xs tabular-nums shadow-md",
        "border-emerald-500/30 bg-zinc-900 text-emerald-300 dark:border-emerald-400/35 dark:bg-zinc-100 dark:text-emerald-700",
        className,
      )}
    >
      <span className="text-zinc-100 dark:text-zinc-700">{t.name}</span>
      <span>{t.value}</span>
    </span>
  );
}

function CloseX() {
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

function ResetIcon() {
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

export function ZIndexScaleDemo() {
  const [open, setOpen] = React.useState<Record<LayerKey, boolean>>({
    dropdown: true,
    modal: true,
    toast: true,
  });
  const [scrolled, setScrolled] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const close = (k: LayerKey) =>
    setOpen((s) => ({ ...s, [k]: false }));

  const reset = () => {
    setOpen({ dropdown: true, modal: true, toast: true });
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrolled(false);
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-8 py-9">
      <span
        role="img"
        aria-label="Z-index scale"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <div
        className="border-border/60 bg-muted/15 relative overflow-hidden rounded-xl border"
        style={{ isolation: "isolate" }}
      >
        <div
          ref={scrollRef}
          className="bg-secondary/30 relative h-[360px] overflow-y-auto"
          onScroll={(e) =>
            setScrolled((e.target as HTMLDivElement).scrollTop > 8)
          }
        >
          <div className="bg-card/85 backdrop-saturate-150 border-border/70 sticky top-0 z-[500] flex items-center gap-3 border-b px-4 py-2.5 backdrop-blur-md">
            <span
              aria-hidden="true"
              className="size-5 rounded"
              style={{
                background:
                  "linear-gradient(135deg, oklch(72% 0.16 264), oklch(72% 0.14 320))",
              }}
            />
            <span className="text-foreground text-sm font-semibold">
              Atlas
            </span>
            <span className="bg-secondary/70 text-muted-foreground ml-3 flex-1 truncate rounded-md px-3 py-1 text-xs">
              Search workspace…
            </span>
            <button
              type="button"
              className="bg-foreground text-background rounded-md px-2.5 py-1 text-xs font-medium"
            >
              Share
            </button>
            <span
              aria-hidden="true"
              className="size-6 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(72% 0.18 30), oklch(72% 0.18 290))",
              }}
            />
            <ZBadge token="toolbar" className="-bottom-9 left-3" />
          </div>

          <div className="relative px-6 pt-12 pb-4">
            <div
              className="bg-card border-border/70 relative rounded-2xl border px-5 py-5"
              style={{
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.05), 0 6px 14px rgba(0,0,0,0.08)",
              }}
            >
              <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
                Revenue · this month
              </span>
              <div className="text-foreground mt-1 text-2xl font-semibold tabular-nums">
                $48,210.00
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                Up 14% vs last month, driven by enterprise renewals across
                three regions.
              </p>
              <ZBadge token="card" className="-top-3 -right-2" />
            </div>
          </div>

          <div className="px-6 pt-4 pb-32">
            <div className="flex flex-col gap-2">
              {[
                "// scroll the frame · the toolbar sticks",
                "// content keeps flowing",
                "// while the header stays pinned",
                "// stacking order is named, not magic numbers",
                "// gaps allow new layers to slot in cleanly",
              ].map((t) => (
                <div
                  key={t}
                  className="bg-card/80 border-border/55 text-muted-foreground rounded-md border px-3 py-3 font-mono text-xs"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {open.dropdown && (
          <div
            className="bg-popover border-border/70 absolute z-[1000] flex flex-col gap-1 rounded-lg border p-2 shadow-2xl"
            style={{
              top: 78,
              right: 32,
              minWidth: 200,
            }}
          >
            <div className="text-muted-foreground flex items-center justify-between px-2 pb-1 text-xs font-medium">
              Card actions
              <button
                type="button"
                onClick={() => close("dropdown")}
                aria-label="Close menu"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded p-1 transition-colors"
              >
                <CloseX />
              </button>
            </div>
            {[
              ["Duplicate", "⌘D"],
              ["Rename", "⌘R"],
              ["Move to…", "⌘⇧M"],
            ].map(([l, k], i) => (
              <div
                key={l}
                className={cn(
                  "text-foreground flex items-center justify-between rounded-md px-2 py-1.5 text-xs",
                  i === 0 && "bg-secondary/60",
                )}
              >
                {l}
                <span className="text-muted-foreground/65 font-mono text-2xs">
                  {k}
                </span>
              </div>
            ))}
            <div className="bg-border/70 my-1 h-px" />
            <div className="text-red-600 dark:text-red-400 flex items-center justify-between rounded-md px-2 py-1.5 text-xs">
              Delete
              <span className="font-mono text-2xs">⌫</span>
            </div>
            <ZBadge token="dropdown" className="top-full right-0 mt-2" />
          </div>
        )}

        {open.modal && (
          <>
            <div
              className="absolute inset-0 z-[2000] bg-black/45 dark:bg-black/65"
              onClick={() => close("modal")}
            >
              <ZBadge
                token="overlay"
                className="top-1/2 left-3 -translate-y-1/2"
              />
            </div>

            <div
              className="bg-popover border-border/70 absolute z-[3000] flex flex-col gap-3 rounded-xl border p-5 shadow-2xl"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 320,
                boxShadow:
                  "0 8px 16px rgba(0,0,0,0.20), 0 24px 48px rgba(0,0,0,0.30)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-foreground text-sm font-semibold">
                  Delete this report?
                </h3>
                <button
                  type="button"
                  onClick={() => close("modal")}
                  aria-label="Close dialog"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded p-1 transition-colors"
                >
                  <CloseX />
                </button>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                This action cannot be undone. The report and all attached
                snapshots will be permanently removed from the workspace.
              </p>
              <div className="mt-1 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => close("modal")}
                  className="bg-secondary text-foreground border-border rounded-md border px-3 py-1.5 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => close("modal")}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white dark:bg-red-500"
                >
                  Delete
                </button>
              </div>
              <ZBadge
                token="modal"
                className="-top-9 left-1/2 -translate-x-1/2"
              />
            </div>
          </>
        )}

        {open.toast && (
          <div
            className="bg-foreground text-background border-border/40 absolute z-[4000] flex items-center gap-3 rounded-lg border px-3.5 py-3 shadow-xl"
            style={{
              right: 16,
              bottom: 16,
              minWidth: 240,
            }}
          >
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500 dark:bg-emerald-400"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-background size-4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold">Snapshot saved</span>
              <span className="text-background/70 text-2xs">
                Available in Reports → Archived.
              </span>
            </div>
            <button
              type="button"
              onClick={() => close("toast")}
              aria-label="Dismiss toast"
              className="text-background/70 hover:text-background hover:bg-background/10 rounded p-1"
            >
              <CloseX />
            </button>
            <ZBadge token="toast" className="-top-9 right-0" />
          </div>
        )}

        {!scrolled && (
          <span
            aria-hidden="true"
            className="bg-foreground/85 text-background pointer-events-none absolute bottom-3 left-1/2 z-[10] -translate-x-1/2 rounded-full px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-opacity"
          >
            scroll inside ↕
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          dismiss layers · then reset
        </span>
        <button
          type="button"
          onClick={reset}
          className="border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-400/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          <ResetIcon />
          Reset all layers
        </button>
      </div>
    </figure>
  );
}
