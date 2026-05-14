"use client";

import { usePathname } from "next/navigation";

export function AmbientBackdrop() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <div
      aria-hidden="true"
      className="ambient-backdrop pointer-events-none fixed inset-0 -z-10"
    />
  );
}
