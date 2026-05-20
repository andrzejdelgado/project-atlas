import { Lock } from "lucide-react";

import { RedeemPinPopover } from "@/components/saturn-heavy/redeem-pin-popover";
import { RequestAccessPopover } from "@/components/saturn-heavy/request-access-popover";

type DenialReason =
  | "no-token"
  | "unknown-token"
  | "expired"
  | "revoked"
  | "already-used";

type Props = {
  reason: DenialReason;
  slug?: string;
};

const REASON_COPY: Record<DenialReason, { headline: string; body: string }> = {
  "no-token": {
    headline: "Shared by invite",
    body: "This case study is sent out by personal invite. If you reached this page without a link, it's expected behaviour — there's nothing wrong on your end.",
  },
  "unknown-token": {
    headline: "Link not recognised",
    body: "The link you followed doesn't match an active invite. It may have been revoked, mistyped, or never minted. Reach out and I'll send you a fresh one.",
  },
  expired: {
    headline: "Invite expired",
    body: "This invite is past its expiry window. Drop me a line and I'll mint a fresh link.",
  },
  revoked: {
    headline: "Invite revoked",
    body: "This invite has been deactivated. If you still need access, please get in touch.",
  },
  "already-used": {
    headline: "One-time link already used",
    body: "This was a single-use invite — it's been opened once and is now closed. I'm happy to send a fresh link; just ask.",
  },
};

// Polite "request access" UI rendered in place of the case-study body when
// the visitor isn't carrying a valid share token. The headline/body changes
// with the denial reason so the visitor knows whether they were never invited
// vs. their link expired vs. it was a one-time link.
export function ShareAccessDenied({ reason, slug = "saturn-heavy" }: Props) {
  const copy = REASON_COPY[reason];

  return (
    <section
      aria-labelledby="share-access-headline"
      className="border-border/60 bg-card/40 mt-12 rounded-2xl border px-6 py-10 sm:px-10 sm:py-14"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="share-access-headline"
          className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {copy.headline}
        </h2>
        <span className="relative inline-flex shrink-0">
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 size-[31px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red-500/35"
          />
          <span
            aria-hidden="true"
            className="border-border/60 text-muted-foreground/80 relative inline-flex size-10 items-center justify-center rounded-full border"
            style={{
              filter: "drop-shadow(0 0 6px oklch(0.65 0.22 25 / 0.5))",
            }}
          >
            <Lock className="size-4" />
          </span>
        </span>
      </div>
      <p className="text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed sm:text-base">
        {copy.body}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <RequestAccessPopover slug={slug} reason={reason} />
        <div className="ml-auto">
          <RedeemPinPopover slug={slug} />
        </div>
      </div>
    </section>
  );
}
