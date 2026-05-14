import * as React from "react";

import { cn } from "@/lib/utils";

export function DockTooltip({
  label,
  children,
  className,
  placement = "top",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  placement?: "top" | "bottom";
}) {
  const isTop = placement === "top";
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "bg-foreground text-background pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 shadow-md shadow-black/20 transition-[opacity,transform] duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
          isTop
            ? "bottom-full mb-2 translate-y-0.5 group-hover:translate-y-0 group-focus-within:translate-y-0"
            : "top-full mt-2 -translate-y-0.5 group-hover:translate-y-0 group-focus-within:translate-y-0",
        )}
      >
        {label}
      </span>
    </span>
  );
}
