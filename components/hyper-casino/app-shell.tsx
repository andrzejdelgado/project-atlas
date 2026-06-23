"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronsUpDown,
  Dice5,
  House,
  LogIn,
  Radio,
  Search,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ── Bottom navigation ──────────────────────────────────────────────────────

export type NavKey =
  | "home"
  | "search"
  | "live"
  | "casino"
  | "register"
  | "login";

const NAV: { key: NavKey; label: string; icon: LucideIcon; accent?: boolean }[] =
  [
    { key: "home", label: "Home", icon: House },
    { key: "search", label: "Search", icon: Search },
    { key: "live", label: "Live", icon: Radio },
    { key: "casino", label: "Casino", icon: Dice5 },
    { key: "register", label: "Register", icon: UserPlus, accent: true },
    { key: "login", label: "Login", icon: LogIn },
  ];

export function BottomNav({ active }: { active?: NavKey }) {
  return (
    <nav className="flex items-stretch border-t border-[var(--hc-border)] px-1 pt-1.5">
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === active;
        const tone = isActive
          ? "text-[var(--hc-fg)]"
          : item.accent
            ? "text-[var(--hc-lime)]"
            : "text-[var(--hc-muted)]";
        return (
          <button
            key={item.key}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 py-0.5"
          >
            <Icon className={cn("size-[1.15rem]", tone)} strokeWidth={isActive ? 2.4 : 2} />
            <span className={cn("whitespace-nowrap text-[0.52rem] leading-none font-medium", tone)}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Contextual header (back + level switcher) ──────────────────────────────

export function ContextHeader({
  title,
  breadcrumb,
  levelSwitcher,
  badge,
  action,
}: {
  title: string;
  breadcrumb?: string;
  levelSwitcher?: boolean;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-[var(--hc-border)] px-2.5 py-2">
      <button
        aria-label="Back"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--hc-fg)] transition-colors hover:bg-[var(--hc-surface)]"
      >
        <ChevronLeft className="size-5" strokeWidth={2.4} />
      </button>
      <div className="min-w-0 flex-1">
        {levelSwitcher ? (
          <button
            aria-label="Change competition"
            className="flex max-w-full items-center gap-1 text-[var(--hc-fg)] transition-opacity active:opacity-70"
          >
            <span className="truncate text-[0.95rem] font-bold tracking-tight">{title}</span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-[var(--hc-muted)]" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[0.95rem] font-bold tracking-tight">{title}</span>
            {badge}
          </div>
        )}
        {breadcrumb && (
          <p className="truncate text-[0.7rem] text-[var(--hc-muted)]">{breadcrumb}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ── Category tabs (Popular / Live / Upcoming / All) ────────────────────────

export type TabItem = {
  key: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
};

export function CategoryTabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex gap-4 overflow-x-auto border-b border-[var(--hc-border)] px-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((t) => {
        const Icon = t.icon;
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 py-2.5 text-[0.8rem] font-semibold transition-colors",
              isActive ? "text-[var(--hc-fg)]" : "text-[var(--hc-muted)]",
            )}
          >
            {Icon && <Icon className="size-3.5" />}
            <span>{t.label}</span>
            {t.count != null && (
              <span className="rounded-full bg-[var(--hc-lime)] px-1.5 py-px text-[0.6rem] font-bold leading-tight text-[var(--hc-lime-fg)] tabular-nums">
                {t.count}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[var(--hc-lime)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
