import { Lock } from "lucide-react";

type Props = {
  recipient: string;
  company: string;
  issuedAt: string;
  /** When true, render a thinner, less-shouty variant suitable for in-body
   *  placement once the visitor has scrolled past the hero. */
  variant?: "banner" | "footer";
};

// Visible reminder that the case study is a confidential preview shared
// with a specific named person. The point is not crypto-grade prevention
// — it's social pressure: if the recipient forwards the link, the next
// viewer sees the original recipient's name on the page, which puts
// re-sharing on the record.
export function ShareWatermark({
  recipient,
  company,
  issuedAt,
  variant = "banner",
}: Props) {
  const date = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(issuedAt));
  if (variant === "footer") {
    return (
      <p className="text-muted-foreground/70 mt-12 border-t border-border/60 pt-6 font-mono text-2xs uppercase tracking-mini">
        Confidential preview · shared with {recipient} @ {company} on {date}.
        Not for redistribution.
      </p>
    );
  }
  return (
    <div
      role="note"
      aria-label="Confidential preview"
      className="border-amber-500/40 bg-amber-500/[0.06] text-foreground/90 mt-10 mb-6 flex items-start gap-3 rounded-xl border px-4 py-3"
    >
      <Lock
        aria-hidden="true"
        className="text-amber-500/90 mt-0.5 size-4 shrink-0"
      />
      <div className="text-sm leading-relaxed">
        <span className="font-medium">Confidential preview</span> — shared with{" "}
        <span className="font-medium">
          {recipient} @ {company}
        </span>{" "}
        on {date}.{" "}
        <span className="text-muted-foreground/80">
          Please do not redistribute this link.
        </span>
      </div>
    </div>
  );
}
