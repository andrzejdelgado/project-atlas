import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function Tile({
  children,
  className,
  span = "col-span-6 md:col-span-3",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  span?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-border bg-card/40 text-card-foreground bento-reveal relative flex h-full flex-col overflow-hidden rounded-2xl border",
        padded && "p-5 sm:p-6",
        span,
        className,
      )}
    >
      {children}
    </section>
  );
}

export function TileHeader({
  icon: Icon,
  title,
  href,
  hrefLabel,
  className,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-border/60 -mx-5 -mt-5 mb-5 flex items-center justify-between gap-3 border-b px-4 py-4 sm:-mx-6 sm:-mt-6 sm:mb-6 sm:px-5 sm:py-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Icon ? (
          <Icon
            className="text-foreground size-4 opacity-85"
            aria-hidden="true"
          />
        ) : null}
        <h2 className="text-foreground text-sm font-medium tracking-tight">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors duration-200"
        >
          {hrefLabel ?? "View"}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </header>
  );
}
