"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "loud" | "refined";

type Profile = {
  name: string;
  role: string;
  location: string;
  stats: { label: string; value: string }[];
  tags: string[];
};

const PROFILE: Profile = {
  name: "Mira Caldwell",
  role: "Staff design engineer · Atlas",
  location: "Brooklyn, NY",
  stats: [
    { label: "Projects", value: "24" },
    { label: "Followers", value: "1.2k" },
    { label: "Following", value: "318" },
  ],
  tags: ["typography", "motion", "tokens", "interactions"],
};

function Card({ variant }: { variant: Variant }) {
  const isOk = variant === "refined";
  return (
    <div className="border-border bg-card/40 relative flex flex-col gap-5 rounded-2xl border px-7 py-7">
      <span
        role="img"
        aria-label={isOk ? "Refined hierarchy" : "Loud hierarchy"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />

      <div className="flex flex-col gap-0.5">
        <span className="text-foreground text-lg font-semibold">
          {PROFILE.name}
        </span>
        <span
          className={cn(
            "text-sm",
            isOk
              ? "text-muted-foreground/90"
              : "text-foreground font-medium",
          )}
        >
          {PROFILE.role}
        </span>
        <span
          className={cn(
            "text-xs",
            isOk
              ? "text-muted-foreground/70"
              : "text-foreground font-medium",
          )}
        >
          {PROFILE.location}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {PROFILE.stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <span className="text-foreground text-lg font-semibold tabular-nums">
              {s.value}
            </span>
            <span
              className={cn(
                "text-2xs uppercase tracking-mini font-mono",
                isOk
                  ? "text-muted-foreground/70"
                  : "text-foreground font-medium",
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PROFILE.tags.map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-full border px-2.5 py-0.5 font-mono text-2xs tracking-mini",
              isOk
                ? "border-border text-muted-foreground bg-transparent"
                : "border-foreground bg-foreground text-background font-medium",
            )}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DeEmphasizeDemo() {
  return (
    <figure className="mt-6 grid gap-4 sm:grid-cols-2">
      <Card variant="loud" />
      <Card variant="refined" />
    </figure>
  );
}
