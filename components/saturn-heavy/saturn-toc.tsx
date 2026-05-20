"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Chapter = { id: string; label: string };

const CHAPTERS: Chapter[] = [
  { id: "intro", label: "Intro" },
  { id: "goals", label: "Goals" },
  { id: "team-evolution", label: "Team" },
  { id: "mvp", label: "MVP" },
  { id: "saturn-heavy", label: "Saturn" },
  { id: "halo-ui", label: "Halo UI" },
  { id: "titan", label: "Titan" },
  { id: "scaling", label: "Scaling" },
  { id: "growth", label: "Growth" },
];

export function SaturnToc() {
  const [active, setActive] = React.useState<string>(CHAPTERS[0].id);
  const [edges, setEdges] = React.useState({ canLeft: false, canRight: true });
  const listRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const compute = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const canLeft = scrollLeft > 1;
      const canRight = scrollLeft + clientWidth < scrollWidth - 1;
      setEdges((prev) =>
        prev.canLeft === canLeft && prev.canRight === canRight
          ? prev
          : { canLeft, canRight },
      );
    };
    compute();
    container.addEventListener("scroll", compute, { passive: true });
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    return () => {
      container.removeEventListener("scroll", compute);
      ro.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const ids = CHAPTERS.map((c) => c.id);

    function update() {
      // Active = the chapter heading most recently scrolled past the sticky
      // bar zone (treat ~25% from the top of the viewport as the trigger).
      const trigger = Math.max(100, window.innerHeight * 0.25);
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= trigger) {
          current = id;
        } else {
          break;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Keep the active tab visible inside the horizontal strip on mobile.
  React.useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLAnchorElement>(
      `a[data-chapter-id="${active}"]`,
    );
    if (!activeEl) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const pad = 16;
    if (
      activeRect.left >= containerRect.left + pad &&
      activeRect.right <= containerRect.right - pad
    ) {
      return;
    }
    const target =
      container.scrollLeft + (activeRect.left - containerRect.left) - pad;
    container.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80; // sticky bar height + a little breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Case study chapters"
      className="border-border/70 bg-background/85 sticky top-0 z-30 mt-8 border-y backdrop-blur-md"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      <ol
        ref={listRef}
        className="mx-auto flex max-w-5xl items-center justify-start gap-1 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:justify-center sm:px-6 sm:py-3.5 [&::-webkit-scrollbar]:hidden"
      >
        {CHAPTERS.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                data-chapter-id={c.id}
                onClick={handleClick(c.id)}
                className={cn(
                  "inline-flex items-center rounded-md px-2.5 py-1 font-mono text-2xs uppercase tracking-mini transition-colors duration-150",
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                )}
              >
                {c.label}
              </a>
            </li>
          );
        })}
      </ol>
      <span
        aria-hidden="true"
        className={cn(
          "from-background pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent transition-opacity duration-200 sm:hidden",
          edges.canLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "from-background pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent transition-opacity duration-200 sm:hidden",
          edges.canRight ? "opacity-100" : "opacity-0",
        )}
      />
    </nav>
  );
}
