"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { dockButton } from "@/components/site-dock";

const order = ["light", "dark", "system"] as const;
type Mode = (typeof order)[number];

const subscribeMounted = (cb: () => void) => {
  cb();
  return () => {};
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    subscribeMounted,
    () => true,
    () => false,
  );

  const current: Mode = (mounted ? (theme as Mode) : "system") ?? "system";

  const next = () => {
    const i = order.indexOf(current);
    setTheme(order[(i + 1) % order.length]);
  };

  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;
  const label = `Theme: ${current}. Click to switch.`;

  return (
    <button
      type="button"
      onClick={next}
      aria-label={label}
      title={label}
      className={dockButton}
    >
      <Icon className="size-4 opacity-85" aria-hidden />
    </button>
  );
}
