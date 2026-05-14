"use client";

import * as React from "react";

type Props = {
  size?: number;
  cols?: number;
  rows?: number;
  className?: string;
};

export function MatrixDots({
  size = 36,
  cols = 7,
  rows = 7,
  className = "",
}: Props) {
  const cells = React.useMemo(() => {
    return Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const colSeed = (col * 73) % 100;
      const duration = 1400 + (colSeed % 7) * 120;
      const delay = row * 110 + colSeed * 4;
      return { duration, delay };
    });
  }, [cols, rows]);

  return (
    <div
      aria-hidden
      className={`grid place-items-center ${className}`}
      style={{
        width: size,
        height: size,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "1px",
      }}
    >
      {cells.map((c, i) => (
        <span
          key={i}
          className="matrix-dot bg-foreground block size-[2px] rounded-full"
          style={
            {
              "--matrix-duration": `${c.duration}ms`,
              "--matrix-delay": `${c.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
