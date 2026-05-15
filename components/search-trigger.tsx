"use client";

import * as React from "react";
import { Search } from "lucide-react";

export function SearchTrigger() {
  const [modKey, setModKey] = React.useState<"⌘" | "Ctrl">("⌘");

  React.useEffect(() => {
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform ??
      navigator.platform ??
      "";
    const isAppleHost =
      /mac|iphone|ipad|ipod/i.test(platform) ||
      /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setModKey(isAppleHost ? "⌘" : "Ctrl");
  }, []);

  const open = React.useCallback(() => {
    window.dispatchEvent(new Event("atlas:open-command-palette"));
  }, []);

  return (
    <button
      type="button"
      aria-label={`Open search palette (${modKey === "⌘" ? "Command K" : "Control K"})`}
      title={`Search · ${modKey} K`}
      onClick={open}
      className="search-pulse text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative inline-flex size-9 items-center justify-center rounded-md transition-colors duration-200 sm:w-auto sm:justify-start sm:gap-2 sm:py-1 sm:pr-1.5 sm:pl-2.5"
    >
      <Search
        className="size-4 opacity-85 relative z-10"
        aria-hidden="true"
      />
      <span className="text-foreground/85 hidden font-mono text-2xs font-medium uppercase tracking-mini relative z-10 sm:inline">
        Search
      </span>
      <kbd
        className="border-border/70 bg-background/40 text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 text-[10px] font-medium uppercase tracking-wider tabular-nums relative z-10 sm:inline-flex"
        suppressHydrationWarning
      >
        <span aria-hidden>{modKey}</span>
        <span aria-hidden>K</span>
      </kbd>
    </button>
  );
}
