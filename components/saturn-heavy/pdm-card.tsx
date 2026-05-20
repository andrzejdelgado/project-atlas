import { ArrowUpRight, GitBranchPlus } from "lucide-react";

const URL =
  "https://uxdesign.cc/ui-crux-progressive-design-model-ci-cd-pipeline-in-design-d2a2591a6d25";
const LABEL = URL.replace(/^https?:\/\/(www\.)?/, "");

export function PdmCard() {
  return (
    <div className="mt-6 mb-8 flex flex-col gap-3">
      <a
        href={URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group border-border bg-muted/40 hover:border-[oklch(0.65_0.16_75_/_0.5)] hover:bg-[oklch(0.7_0.18_75_/_0.06)] dark:hover:border-[oklch(0.78_0.15_75_/_0.5)] dark:hover:bg-[oklch(0.78_0.15_75_/_0.08)] flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors duration-200"
      >
        <span
          aria-hidden="true"
          className="border-border/60 bg-secondary/60 grid size-10 shrink-0 place-items-center rounded-lg border"
        >
          <GitBranchPlus
            className="text-foreground/85 size-5"
            aria-hidden="true"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-foreground block text-sm font-medium tracking-tight">
            Read more about Progressive Design Model
          </span>
          <span className="text-muted-foreground mt-0.5 block truncate font-mono text-xs">
            {LABEL}
          </span>
        </span>
        <ArrowUpRight
          className="text-muted-foreground/70 group-hover:text-foreground size-4 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
