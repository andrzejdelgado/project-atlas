"use client";

import * as React from "react";
import { OTPFieldPreview } from "@base-ui/react/otp-field";
import { Popover } from "@base-ui/react/popover";
import { KeyRound, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  slug: string;
};

type Phase = "idle" | "submitting" | "error";

// Inline PIN-entry popover. Pairs with the "Request access" popover on the
// access-denied page: once the visitor has received their PIN, they can
// unlock the page without leaving it. On success the page is reloaded with
// the resolved token id as the `?k=` query param, which the server-side
// access gate (lib/share-tokens.ts) then accepts.
export function RedeemPinPopover({ slug }: Props) {
  const [open, setOpen] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const submittingRef = React.useRef(false);

  function reset() {
    setPin("");
    setPhase("idle");
    setErrorMsg(null);
    submittingRef.current = false;
  }

  async function submit(value: string) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPhase("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/redeem-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: value, slug, hp: "" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.id) {
        submittingRef.current = false;
        setPhase("error");
        setErrorMsg(data.error ?? "Invalid or expired PIN.");
        setPin("");
        return;
      }
      window.location.href = `/case-studies/${slug}?k=${encodeURIComponent(data.id)}`;
    } catch {
      submittingRef.current = false;
      setPhase("error");
      setErrorMsg("Network error. Please try again.");
      setPin("");
    }
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <Popover.Trigger
        render={
          <button
            type="button"
            className="border-border bg-background text-foreground hover:bg-foreground/5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          />
        }
      >
        <KeyRound className="size-4" aria-hidden="true" />
        Access with PIN
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="start">
          <Popover.Popup
            className={cn(
              "border-border bg-card text-foreground z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border p-4 shadow-lg",
              "data-starting-style:opacity-0 data-starting-style:translate-y-1",
              "data-ending-style:opacity-0 data-ending-style:translate-y-1",
              "transition-[opacity,transform] duration-150",
            )}
          >
            <div className="space-y-3">
              <Popover.Title className="text-sm font-semibold">
                Enter PIN Code
              </Popover.Title>
              <OTPFieldPreview.Root
                length={6}
                value={pin}
                disabled={phase === "submitting"}
                onValueChange={(v) => {
                  setPin(v);
                  if (errorMsg) setErrorMsg(null);
                  if (phase === "error") setPhase("idle");
                }}
                onValueComplete={(v) => {
                  void submit(v);
                }}
                className="flex justify-center gap-1.5"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <OTPFieldPreview.Input
                    key={i}
                    className={cn(
                      "border-border bg-background text-foreground size-10 rounded-md border text-center font-mono text-base tabular-nums",
                      "focus:border-foreground/60 focus:ring-foreground/20 focus:ring-2 focus:outline-none",
                      "data-[filled]:border-foreground/40 data-[filled]:bg-foreground/5",
                      "disabled:opacity-60",
                      errorMsg ? "border-destructive/50" : null,
                    )}
                  />
                ))}
              </OTPFieldPreview.Root>
              <div className="flex h-5 items-center justify-center text-xs">
                {phase === "submitting" ? (
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    Unlocking
                  </span>
                ) : errorMsg ? (
                  <span role="alert" className="text-destructive">
                    {errorMsg}
                  </span>
                ) : (
                  <span className="text-muted-foreground/70">
                    Paste or type the 6-digit code
                  </span>
                )}
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
