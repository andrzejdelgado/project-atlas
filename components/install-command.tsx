"use client";

import * as React from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import { GithubIcon } from "@/components/brand-icons";
import { cn } from "@/lib/utils";

const COMMAND = "npx skills add ux-ui-design-engineering";

type Props = {
  sourceUrl?: string;
};

export function InstallCommand({ sourceUrl }: Props) {
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
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mt-6">
      <div className="border-border bg-muted/40 flex items-center gap-3 rounded-xl border py-2 pl-4 pr-2">
        <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm">
          <span className="text-muted-foreground/70 select-none">$</span>{" "}
          <span className="text-[oklch(0.6_0.14_165)] dark:text-[oklch(0.78_0.13_165)]">
            npx
          </span>{" "}
          <span className="text-foreground/85">skills add</span>{" "}
          <span className="font-medium text-[oklch(0.55_0.18_30)] dark:text-[oklch(0.78_0.16_30)]">
            ux-ui-design-engineering
          </span>
        </code>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Command copied" : "Copy install command"}
          title={copied ? "Copied" : "Copy"}
          className={cn(
            "border-border/60 text-muted-foreground hover:text-foreground hover:bg-card hover:border-border inline-flex shrink-0 items-center gap-1.5 rounded-lg border bg-transparent px-2.5 py-1.5 text-xs font-medium transition-colors duration-200",
            copied &&
              "border-emerald-400/30 text-emerald-400 hover:text-emerald-400 hover:border-emerald-400/30",
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group border-border bg-muted/40 hover:border-[oklch(0.55_0.2_290_/_0.45)] hover:bg-[oklch(0.6_0.2_290_/_0.06)] dark:hover:border-[oklch(0.74_0.18_290_/_0.5)] dark:hover:bg-[oklch(0.74_0.18_290_/_0.08)] mt-3 flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors duration-200"
        >
          <span
            aria-hidden="true"
            className="bg-[oklch(0.55_0.2_290_/_0.12)] text-[oklch(0.5_0.22_290)] dark:bg-[oklch(0.74_0.18_290_/_0.14)] dark:text-[oklch(0.78_0.18_290)] flex size-10 shrink-0 items-center justify-center rounded-lg"
          >
            <GithubIcon className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-foreground block text-sm font-medium tracking-tight">
              Source on GitHub
            </span>
            <span className="text-muted-foreground mt-0.5 block truncate font-mono text-xs">
              {sourceUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
            </span>
          </span>
          <ArrowUpRight
            className="text-muted-foreground/70 group-hover:text-foreground size-4 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  );
}
