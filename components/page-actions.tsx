"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Link2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonStyles =
  "border-border bg-background/40 text-muted-foreground hover:text-foreground hover:border-foreground/30 inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-200";

export function PageActions({
  backHref,
  className,
}: {
  backHref: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn("mb-10 flex items-center justify-between sm:mb-14", className)}
    >
      <Link href={backHref} aria-label="Back" className={buttonStyles}>
        <ArrowLeft className="size-4" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className={cn(
          buttonStyles,
          copied && "text-emerald-400 border-emerald-400/30",
        )}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
