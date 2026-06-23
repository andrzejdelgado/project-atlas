"use client";

import * as React from "react";

/** Tracks the user's reduced-motion preference (live). SSR-safe (false first). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Tweens a number toward `target` with an ease-out; jumps instantly if disabled. */
export function useAnimatedNumber(target: number, disabled = false) {
  const [value, setValue] = React.useState(target);
  const fromRef = React.useRef(target);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    // duration 0 (reduced motion) resolves on the first frame — setValue stays
    // inside the rAF callback, never called synchronously in the effect body.
    const duration = disabled ? 0 : 450;
    let startTs: number | undefined;
    const tick = (ts: number) => {
      if (startTs === undefined) startTs = ts;
      const p = duration === 0 ? 1 : Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, disabled]);

  return value;
}
