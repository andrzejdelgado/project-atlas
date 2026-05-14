"use client";

import * as React from "react";
import { ArrowRight, CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";

type State = "idle" | "submitting" | "success";

const SUBMIT_DURATION = 1600;

export function PaymentSuccessFlowDemo() {
  const [state, setState] = React.useState<State>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const pay = () => {
    setState("submitting");
    timer.current = setTimeout(() => {
      setState("success");
    }, SUBMIT_DURATION);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setState("idle");
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Payment success flow"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        After payment, the action stays where the user pressed it.
        An in-button spinner replaces the label; success swaps it for a
        toast with a helpful link to the most-visited next page.
      </p>

      <div className="border-border/60 bg-muted/15 relative rounded-xl border px-5 py-7">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground/70 font-mono text-2xs uppercase tracking-mini">
            Deposit
          </span>
          <span className="text-foreground text-2xl font-semibold tabular-nums">
            €50.00
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={pay}
            disabled={state !== "idle"}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
              state === "idle"
                ? "border-emerald-500/45 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/15 dark:text-emerald-300 hover:bg-emerald-500/18"
                : "border-emerald-500/35 bg-emerald-500/8 text-emerald-700/70 dark:border-emerald-400/35 dark:bg-emerald-400/10 dark:text-emerald-300/70 cursor-not-allowed",
            )}
          >
            {state === "submitting" ? (
              <>
                <span
                  aria-hidden="true"
                  className="border-emerald-500/35 border-t-emerald-700 dark:border-emerald-400/35 dark:border-t-emerald-300 inline-block size-4 animate-spin rounded-full border-2"
                />
                Processing
              </>
            ) : state === "success" ? (
              <>
                <span
                  aria-hidden="true"
                  className="grid size-4 place-items-center rounded-full bg-emerald-500 text-white dark:bg-emerald-400"
                >
                  <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Deposit complete
              </>
            ) : (
              <>
                <CreditCard className="size-4" aria-hidden="true" />
                Deposit €50.00
              </>
            )}
          </button>
        </div>

        {state === "success" && (
          <div
            role="status"
            aria-live="polite"
            className="border-emerald-500/45 bg-card/85 absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg dark:border-emerald-400/45"
          >
            <div className="flex-1">
              <p className="text-foreground text-sm font-semibold">
                Funds available
              </p>
              <p className="text-muted-foreground/80 font-mono text-2xs uppercase tracking-mini">
                €50.00 added to your balance
              </p>
            </div>
            <a
              href="#play"
              className="border-emerald-500/45 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/15 dark:text-emerald-300 inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-2xs uppercase tracking-mini"
              onClick={(e) => e.preventDefault()}
            >
              Play now
              <ArrowRight className="size-3" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground/65 font-mono text-2xs uppercase tracking-mini">
          confirmation lives at the action · next step is one click away
        </p>
        <button
          type="button"
          onClick={reset}
          className="border-border/60 text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border bg-transparent px-3 py-1.5 font-mono text-xs transition-colors"
        >
          Reset
        </button>
      </div>
    </figure>
  );
}
