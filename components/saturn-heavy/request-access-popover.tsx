"use client";

import * as React from "react";
import ReactDOM from "react-dom";
import { Popover } from "@base-ui/react/popover";
import { CheckCircle2, Loader2, Mail, X } from "lucide-react";

import { cn } from "@/lib/utils";

type DenialReason =
  | "no-token"
  | "unknown-token"
  | "expired"
  | "revoked"
  | "already-used";

type Props = {
  slug: string;
  reason: DenialReason;
};

type Phase = "idle" | "submitting" | "error";

// Visitor-facing form that opens in a popover anchored to the "Request access"
// button. Submits {email, slug, reason} to /api/request-access — that route is
// honeypotted + rate-limited and sends a transactional email to the inbox set
// in lib/site.ts.
export function RequestAccessPopover({ slug, reason }: Props) {
  const [open, setOpen] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [toastVisible, setToastVisible] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "submitting") return;
    setPhase("submitting");
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    const hp = String(fd.get("hp") ?? "");

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          note: note.trim(),
          slug,
          reason,
          hp,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setPhase("error");
        setErrorMsg(data.error ?? "Couldn't send your request. Please try again.");
        return;
      }
      setOpen(false);
      setPhase("idle");
      setEmail("");
      setNote("");
      setToastVisible(true);
    } catch {
      setPhase("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          render={
            <button
              type="button"
              className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            />
          }
        >
          <Mail className="size-4" aria-hidden="true" />
          Request access
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
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
                <Popover.Title className="text-sm font-semibold">
                  Request access
                </Popover.Title>
                <label className="block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-foreground/20 block w-full rounded-md border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Note (optional)</span>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Add a short note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={1000}
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-foreground/20 block w-full resize-none rounded-md border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none"
                  />
                </label>
                {/* Honeypot: hidden from humans, irresistible to bots. */}
                <div aria-hidden="true" className="hidden">
                  <label>
                    Leave this empty
                    <input
                      type="text"
                      name="hp"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                {errorMsg ? (
                  <p
                    role="alert"
                    className="text-destructive text-xs leading-snug"
                  >
                    {errorMsg}
                  </p>
                ) : null}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Popover.Close
                    render={
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                      />
                    }
                  >
                    Cancel
                  </Popover.Close>
                  <button
                    type="submit"
                    disabled={phase === "submitting"}
                    className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60"
                  >
                    {phase === "submitting" ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        Sending
                      </>
                    ) : (
                      <>Send request</>
                    )}
                  </button>
                </div>
              </form>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      {toastVisible ? (
        <SuccessToast onDismiss={() => setToastVisible(false)} />
      ) : null}
    </>
  );
}

function SuccessToast({ onDismiss }: { onDismiss: () => void }) {
  React.useEffect(() => {
    const t = window.setTimeout(onDismiss, 8000);
    return () => window.clearTimeout(t);
  }, [onDismiss]);

  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 98,
      }}
      className="bg-card/95 border-border/70 inline-flex items-center gap-3 rounded-md border px-3.5 py-2 shadow-xl"
    >
      <CheckCircle2 className="size-3.5 text-emerald-500" aria-hidden="true" />
      <span className="text-foreground/90 text-xs">
        Request sent — I usually reply within a day.
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-muted-foreground hover:text-foreground rounded-md p-0.5 transition-colors"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>,
    document.body,
  );
}
