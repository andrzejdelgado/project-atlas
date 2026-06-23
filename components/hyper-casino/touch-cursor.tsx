"use client";

import * as React from "react";
import { MoveHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A bounded region that, on a fine pointer (desktop mouse), hides the native
 * cursor and replaces it with a finger-sized translucent circle — the Chrome
 * device-mode feel. The circle shows a press state + ripple, and a one-time
 * "drag to swipe" hint teaches the interaction.
 *
 * Fallbacks: on a coarse pointer (real phone/tablet) nothing is rendered and
 * native touch takes over; with prefers-reduced-motion the ripple, smoothing,
 * and pulsing are dropped. The circle is pointer-events:none so it never
 * intercepts the gestures it visualizes — captured pointer events from child
 * swipeables still bubble here, so the circle keeps tracking mid-swipe.
 */
export function TouchSurface({
  children,
  className,
  hint = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Show the one-time "drag to swipe" coach hint (default true). A surface
   *  with its own contextual hint can switch this off. */
  hint?: boolean;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const circleRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const [finePointer, setFinePointer] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [hintGone, setHintGone] = React.useState(false);

  // Capability detection runs after mount → SSR-safe, and a touch device never
  // flashes the fake cursor (finePointer stays false).
  React.useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setFinePointer(fine.matches);
      setReducedMotion(reduce.matches);
    };
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  // Auto-retire the hint so it never nags.
  React.useEffect(() => {
    if (!finePointer || hintGone) return;
    const id = window.setTimeout(() => setHintGone(true), 6000);
    return () => window.clearTimeout(id);
  }, [finePointer, hintGone]);

  const moveCircle = React.useCallback((clientX: number, clientY: number) => {
    const root = rootRef.current;
    const circle = circleRef.current;
    if (!root || !circle) return;
    const rect = root.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // 1:1 position update straight to the transform — a cursor must feel crisp,
    // so the personality lives in the press/ripple, not in positional lag.
    circle.style.transform = `translate3d(${x - 20}px, ${y - 20}px, 0)`;
  }, []);

  const spawnRipple = React.useCallback(
    (clientX: number, clientY: number) => {
      if (reducedMotion) return;
      const overlay = overlayRef.current;
      const root = rootRef.current;
      if (!overlay || !root || typeof overlay.animate !== "function") return;
      const rect = root.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.style.cssText = `position:absolute;left:${clientX - rect.left}px;top:${
        clientY - rect.top
      }px;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:9999px;background:var(--hc-violet);pointer-events:none;`;
      overlay.appendChild(dot);
      const anim = dot.animate(
        [
          { transform: "scale(0.35)", opacity: 0.4 },
          { transform: "scale(2.6)", opacity: 0 },
        ],
        { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      anim.onfinish = () => dot.remove();
    },
    [reducedMotion],
  );

  if (!finePointer) {
    // Touch devices: native handling, no fake cursor, no cursor hiding.
    return (
      <div ref={rootRef} className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative cursor-none [&_*]:!cursor-none", className)}
      onPointerEnter={(e) => {
        setActive(true);
        moveCircle(e.clientX, e.clientY);
      }}
      onPointerLeave={() => {
        setActive(false);
        setPressed(false);
      }}
      onPointerMove={(e) => moveCircle(e.clientX, e.clientY)}
      onPointerDown={(e) => {
        setPressed(true);
        if (!hintGone) setHintGone(true);
        spawnRipple(e.clientX, e.clientY);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      {children}

      {/* Cursor + ripple overlay — above content, never intercepts pointers. */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      >
        <div
          ref={circleRef}
          className={cn(
            "absolute left-0 top-0 size-10 will-change-transform",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          {/* The press-scale lives on this inner element so it pivots on the
              circle's own centre. Keeping scale off the positioned parent
              prevents it from scaling the translate — which would otherwise
              jump the cursor toward the top-left on every press. */}
          <div
            className={cn(
              "relative size-full rounded-full border",
              !reducedMotion &&
                "transition-[scale,background-color,border-color] duration-150 ease-out",
              pressed
                ? "scale-[0.82] border-[var(--hc-violet)] bg-[oklch(0.62_0.23_295_/_0.22)]"
                : "scale-100 border-white/45 bg-white/8",
            )}
            style={{ boxShadow: "0 0 0 0.5px oklch(0 0 0 / 0.35)" }}
          >
            <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
          </div>
        </div>
      </div>

      {/* One-time "drag to swipe" hint. */}
      {hint && !hintGone && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-[var(--hc-border-strong)] bg-[oklch(0.17_0.015_265_/_0.82)] px-3 py-1.5 text-[0.7rem] font-medium text-[var(--hc-fg)] backdrop-blur-sm",
              !reducedMotion && "animate-pulse",
            )}
          >
            <MoveHorizontal className="size-3.5 text-[var(--hc-violet)]" />
            drag to swipe
          </span>
        </div>
      )}
    </div>
  );
}
