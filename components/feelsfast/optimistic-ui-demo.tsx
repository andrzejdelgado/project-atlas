"use client";

import * as React from "react";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

type Toast = { id: number; text: string; tone: "ok" | "fail" };

export function OptimisticUiDemo() {
  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(142);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [failNext, setFailNext] = React.useState(false);
  const toastId = React.useRef(0);

  const onLike = () => {
    const willFail = failNext;
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    setTimeout(() => {
      if (willFail) {
        setLiked(!next);
        setCount((c) => c - (next ? 1 : -1));
        const id = ++toastId.current;
        setToasts((t) => [{ id, text: "Couldn't save — reverted.", tone: "fail" }, ...t]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
      } else {
        const id = ++toastId.current;
        setToasts((t) => [{ id, text: "Saved.", tone: "ok" }, ...t]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1400);
      }
      setFailNext(false);
    }, 420);
  };

  return (
    <figure className="border-border bg-card/40 relative mt-6 rounded-2xl border px-6 py-7 sm:px-8 sm:py-9">
      <span
        role="img"
        aria-label="Optimistic UI"
        className="bg-emerald-500 dark:bg-emerald-400 absolute top-4 right-4 size-2 rounded-full"
      />

      <p className="text-muted-foreground mb-5 max-w-[58ch] text-sm leading-relaxed">
        Render the user's action immediately. When the request lands, accept it
        silently — or, on the rare failure, smoothly roll it back with an
        honest toast.
      </p>

      <div className="border-border/60 bg-muted/15 flex items-center gap-4 rounded-xl border px-5 py-5">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            liked
              ? "border-red-500/45 bg-red-500/12 text-red-700 dark:border-red-400/45 dark:bg-red-400/15 dark:text-red-300"
              : "border-border bg-secondary/40 text-foreground",
          )}
        >
          <Heart
            className={cn("size-4", liked && "fill-current")}
            aria-hidden="true"
          />
          {liked ? "Liked" : "Like"}
        </button>
        <span className="text-foreground font-mono text-sm tabular-nums">
          {count.toLocaleString()}
        </span>
        <span className="ml-auto inline-flex items-center gap-2">
          <label className="text-muted-foreground inline-flex cursor-pointer items-center gap-2 font-mono text-2xs uppercase tracking-mini">
            <input
              type="checkbox"
              checked={failNext}
              onChange={(e) => setFailNext(e.target.checked)}
              className="accent-red-400"
            />
            simulate failure
          </label>
        </span>
      </div>

      <div className="relative mt-4 h-10">
        {toasts.map((t, i) => (
          <div
            key={t.id}
            className={cn(
              "absolute right-0 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs shadow-md transition-all",
              t.tone === "ok"
                ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/45 dark:bg-emerald-400/12 dark:text-emerald-300"
                : "border-red-500/50 bg-red-500/10 text-red-700 dark:border-red-400/45 dark:bg-red-400/12 dark:text-red-300",
            )}
            style={{ top: i * 6 }}
          >
            {t.text}
          </div>
        ))}
      </div>

      <p className="text-muted-foreground/65 mt-4 font-mono text-2xs uppercase tracking-mini">
        ~99% success → optimistic. For the failing 1%, the rollback path must
        exist and be honest.
      </p>
    </figure>
  );
}
