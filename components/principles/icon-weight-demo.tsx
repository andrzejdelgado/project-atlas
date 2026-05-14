"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "loud" | "refined";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const NAV: { label: string; icon: React.ReactNode; active?: boolean }[] = [
  {
    label: "Home",
    icon: (
      <Icon>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </Icon>
    ),
  },
  {
    label: "Inbox",
    icon: (
      <Icon>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </Icon>
    ),
    active: true,
  },
  {
    label: "Projects",
    icon: (
      <Icon>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </Icon>
    ),
  },
  {
    label: "Calendar",
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </Icon>
    ),
  },
  {
    label: "Settings",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </Icon>
    ),
  },
];

function NavColumn({ variant }: { variant: Variant }) {
  const isOk = variant === "refined";
  return (
    <div className="border-border bg-card/40 relative flex flex-col gap-1 rounded-2xl border px-3 py-5">
      <span
        role="img"
        aria-label={isOk ? "Refined icon weight" : "Full opacity icons"}
        className={cn(
          "absolute top-4 right-4 size-2 rounded-full",
          isOk
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-red-500 dark:bg-red-400",
        )}
      />
      {NAV.map((n) => {
        const active = n.active;
        return (
          <button
            type="button"
            key={n.label}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "inline-flex shrink-0 transition-opacity",
                isOk ? "opacity-80" : "opacity-100",
              )}
            >
              {n.icon}
            </span>
            <span>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function IconWeightDemo() {
  return (
    <figure className="mt-6 grid gap-4 sm:grid-cols-2">
      <NavColumn variant="loud" />
      <NavColumn variant="refined" />
    </figure>
  );
}
