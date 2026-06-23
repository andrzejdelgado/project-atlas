"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useSwipe } from "./use-swipe";

/**
 * A bottom sheet scoped to the phone screen: a scrim + a slide-up panel.
 * Rendered via PhoneMockup's `overlay` slot. Closes on scrim tap, on a
 * downward swipe, or by tapping the grab handle. The sheet follows the finger
 * on a downward drag and either commits (close) or springs back on release.
 */
export function Drawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [dragY, setDragY] = React.useState(0);
  const draggedRef = React.useRef(false);

  const { handlers } = useSwipe({
    axis: "y",
    capture: false,
    onStart: () => {
      draggedRef.current = false;
    },
    onMove: (o) => {
      if (Math.abs(o) > 6) draggedRef.current = true;
      setDragY(Math.max(0, o));
    },
    onEnd: (r) => {
      if (r.offset > 80 || (r.offset > 24 && r.velocity > 0.4)) onClose();
      setDragY(0);
    },
  });

  return (
    <div className={cn("absolute inset-0 z-30", !open && "pointer-events-none")}>
      <button
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[94%] overflow-y-auto rounded-t-3xl border-t border-[var(--hc-border)] bg-[var(--hc-bg)] shadow-[0_-16px_40px_-16px_oklch(0_0_0/0.7)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          !dragY && "transition-transform duration-300 ease-out",
        )}
        style={{ transform: open ? `translateY(${dragY}px)` : "translateY(100%)" }}
      >
        {/* grab handle — swipe it down or tap it to close */}
        <button
          {...handlers}
          onClick={() => {
            if (!draggedRef.current) onClose();
          }}
          aria-label="Close"
          className="flex w-full touch-none justify-center py-3 active:opacity-70"
        >
          <span className="h-1 w-9 rounded-full bg-white/25" />
        </button>
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}
