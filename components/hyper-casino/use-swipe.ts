"use client";

import * as React from "react";

import {
  resolveGesture,
  type Axis,
  type Resolved,
  type Sample,
} from "./gesture-core";

type UseSwipeOptions = {
  axis?: Axis;
  commitDistance?: number;
  commitVelocity?: number;
  /** Fired on press start. */
  onStart?: () => void;
  /** Fired continuously during the drag with the live signed offset (px). */
  onMove?: (offset: number) => void;
  /** Fired once on release with the resolved gesture. */
  onEnd?: (resolved: Resolved) => void;
  /**
   * Capture the pointer for the duration of the drag. True (default) keeps
   * tracking even if the pointer leaves the element — right for swipe-to-remove.
   * Pass false for a carousel whose children must still receive native click
   * (so keyboard/tap selection on inner buttons keeps working).
   */
  capture?: boolean;
  disabled?: boolean;
};

/**
 * Thin React binding over the pure gesture core. Uses Pointer Events +
 * setPointerCapture so a single code path serves mouse and touch. Returns
 * handlers to spread onto the draggable element plus a live `dragging` flag.
 *
 * Captured pointer events still bubble to ancestors, so a parent TouchCursor
 * keeps tracking while a child is being swiped.
 */
export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    axis = "x",
    commitDistance = 80,
    commitVelocity = 0.5,
    onStart,
    onMove,
    onEnd,
    capture = true,
    disabled,
  } = options;

  const stateRef = React.useRef<{ id: number; samples: Sample[] } | null>(null);
  const [dragging, setDragging] = React.useState(false);

  // Keep the latest callbacks without re-creating the handlers each render.
  // Synced in an effect (not during render) so pointer handlers — which only
  // fire after commit — always read the current callbacks.
  const cb = React.useRef({ onStart, onMove, onEnd });
  React.useEffect(() => {
    cb.current = { onStart, onMove, onEnd };
  });

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      if (e.button !== 0 && e.pointerType === "mouse") return; // primary button only
      if (capture) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Capture can fail (e.g. the pointer was already released); the
          // gesture still works via event bubbling, so swallow and continue.
        }
      }
      stateRef.current = {
        id: e.pointerId,
        samples: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }],
      };
      setDragging(true);
      cb.current.onStart?.();
    },
    [disabled, capture],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      const s = stateRef.current;
      if (!s || e.pointerId !== s.id) return;
      s.samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
      const first = s.samples[0];
      const offset = axis === "x" ? e.clientX - first.x : e.clientY - first.y;
      cb.current.onMove?.(offset);
    },
    [axis],
  );

  const finish = React.useCallback(
    (e: React.PointerEvent) => {
      const s = stateRef.current;
      if (!s || e.pointerId !== s.id) return;
      const resolved = resolveGesture(s.samples, {
        axis,
        commitDistance,
        commitVelocity,
      });
      stateRef.current = null;
      setDragging(false);
      cb.current.onEnd?.(resolved);
    },
    [axis, commitDistance, commitVelocity],
  );

  const handlers: Pick<
    React.HTMLAttributes<HTMLElement>,
    | "onPointerDown"
    | "onPointerMove"
    | "onPointerUp"
    | "onPointerCancel"
    | "onPointerLeave"
  > = {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel: finish,
    // No-op while captured (the event won't fire); ends the drag for the
    // non-capturing carousel when the pointer leaves the track.
    onPointerLeave: finish,
  };

  return { handlers, dragging };
}
