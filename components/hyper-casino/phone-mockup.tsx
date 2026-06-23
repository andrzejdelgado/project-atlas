"use client";

import * as React from "react";
import { Wifi } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppBar } from "./app-chrome";
import {
  BottomNav,
  CategoryTabs,
  ContextHeader,
  type NavKey,
  type TabItem,
} from "./app-shell";
import { hyperCasinoVars } from "./brand";
import { TouchSurface } from "./touch-cursor";

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex h-11 items-center justify-between px-6 pt-1 text-[var(--hc-fg)]">
      <span className="text-[0.8rem] font-semibold tabular-nums tracking-tight">
        {time}
      </span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <div className="flex items-end gap-[2px]" aria-hidden>
          {[3, 5, 7, 9].map((h) => (
            <span
              key={h}
              className="w-[3px] rounded-[1px] bg-current"
              style={{ height: h }}
            />
          ))}
        </div>
        <Wifi className="size-3.5" aria-hidden />
        {/* battery */}
        <div
          className="relative ml-0.5 flex h-[11px] w-[22px] items-center rounded-[3px] border border-current/60 px-[2px]"
          aria-hidden
        >
          <span className="h-[6px] w-[13px] rounded-[1px] bg-current" />
          <span className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r-[1px] bg-current/60" />
        </div>
      </div>
    </div>
  );
}

type HeaderConfig = {
  title: string;
  breadcrumb?: string;
  levelSwitcher?: boolean;
  badge?: React.ReactNode;
  action?: React.ReactNode;
};

/**
 * A generic dark device frame (no copyrighted hardware cues) wrapping a clipped
 * app screen laid out as a flex column: fixed top chrome (status bar, brand bar,
 * optional contextual header + category tabs), a scrolling content region, and a
 * fixed bottom navigation bar. The screen is a TouchSurface, so the finger-cursor
 * and gestures come for free; brand tokens are scoped to this subtree.
 */
export function PhoneMockup({
  children,
  className,
  time = "21:34",
  header,
  tabs,
  activeNav,
  overlay,
  footer,
  footerOverlay = false,
  hint = true,
}: {
  children: React.ReactNode;
  className?: string;
  time?: string;
  header?: HeaderConfig;
  tabs?: { items: TabItem[]; active: string; onChange: (key: string) => void };
  activeNav?: NavKey;
  /** Full-screen layer (e.g. a bottom-sheet drawer) rendered over the app
   *  content but inside the touch surface, so the finger-cursor works on it. */
  overlay?: React.ReactNode;
  /** Pinned section above the bottom nav (e.g. a stake / place-bet footer). */
  footer?: React.ReactNode;
  /** When true, the footer floats over the scroll content (transparent, so the
   *  list passes underneath it) instead of reserving its own row. */
  footerOverlay?: boolean;
  /** Show the generic "drag to swipe" coach hint (default true). */
  hint?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-[min(340px,84vw)] select-none md:w-[405px]",
        className,
      )}
      style={hyperCasinoVars}
    >
      <div className="rounded-[2.7rem] bg-neutral-950 p-[10px] shadow-[0_2px_6px_oklch(0_0_0/0.2),0_30px_60px_-25px_oklch(0_0_0/0.55)] ring-1 ring-white/10">
        <div className="relative aspect-[9/19.3] overflow-hidden rounded-[2.1rem] bg-[var(--hc-bg)] text-[var(--hc-fg)] md:aspect-[430/932]">
          {/* camera pill */}
          <div className="absolute left-1/2 top-[9px] z-20 h-[1.35rem] w-[4.6rem] -translate-x-1/2 rounded-full bg-black" />

          <TouchSurface className="absolute inset-0" hint={hint}>
            <div className="flex h-full flex-col">
              {/* fixed top chrome */}
              <div className="shrink-0">
                {/* near-black brand band — distinct from the deep-ink header below */}
                <div className="bg-[var(--hc-bar)]">
                  <StatusBar time={time} />
                  <AppBar />
                </div>
                {header && <ContextHeader {...header} />}
                {tabs && <CategoryTabs {...tabs} />}
              </div>

              {footerOverlay ? (
                /* footer floats over the content; the list scrolls underneath
                   it (transparent), padded so the last items clear the button */
                <div className="relative min-h-0 flex-1">
                  <div className="h-full overflow-y-auto overflow-x-hidden pb-24 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {children}
                  </div>
                  {footer && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0">
                      {footer}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* scrolling content */}
                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {children}
                  </div>

                  {/* pinned footer (stake summary + place bet) */}
                  {footer && <div className="shrink-0">{footer}</div>}
                </>
              )}

              {/* fixed bottom chrome */}
              <div className="shrink-0 bg-[var(--hc-bar)]">
                <BottomNav active={activeNav} />
                <div className="flex justify-center pb-2 pt-1">
                  <div className="h-[5px] w-32 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
            {overlay}
          </TouchSurface>
        </div>
      </div>
    </div>
  );
}
