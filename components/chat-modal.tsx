"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, ArrowUpRight, X } from "lucide-react";

import { MatrixDots } from "@/components/matrix-dots";

const STARTERS = [
  "What's Andrzej's mentoring style?",
  "Walk me through “Tokens that travel”.",
  "How do I book a session?",
  "Is he available for new work?",
];

type Chip = { label: string; href: string; external: boolean };

function extractChips(text: string): Chip[] {
  const chips = new Map<string, Chip>();
  const internal = /\(?(\/[a-z0-9][a-z0-9/-]*)\)?/gi;
  const external = /https?:\/\/[^\s)]+/gi;
  for (const m of text.matchAll(internal)) {
    const href = m[1].replace(/[).,;]+$/, "");
    if (href.length < 2) continue;
    chips.set(href, { label: href, href, external: false });
  }
  for (const m of text.matchAll(external)) {
    const href = m[0].replace(/[).,;]+$/, "");
    let label = href.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (label.length > 36) label = label.slice(0, 36) + "…";
    chips.set(href, { label, href, external: true });
  }
  return Array.from(chips.values());
}

function messageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("");
}

export function ChatModal() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [durations, setDurations] = React.useState<Record<string, number>>({});
  const router = useRouter();
  const pathname = usePathname();
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const sendStartRef = React.useRef<number | null>(null);
  const isStreaming = status === "submitted" || status === "streaming";

  React.useEffect(() => {
    if (status !== "ready" || sendStartRef.current == null) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const elapsed = (Date.now() - sendStartRef.current) / 1000;
    setDurations((prev) =>
      prev[last.id] != null ? prev : { ...prev, [last.id]: elapsed },
    );
    sendStartRef.current = null;
  }, [status, messages]);

  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("atlas:open-chat", onOpen);
    return () => window.removeEventListener("atlas:open-chat", onOpen);
  }, []);

  React.useEffect(() => {
    if (pathname === "/chat") {
      setOpen(true);
      router.replace("/");
    }
  }, [pathname, router]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    sendStartRef.current = Date.now();
    sendMessage({ text: trimmed });
    setInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Atlas"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 py-[8vh] backdrop-blur-sm sm:px-6"
      onClick={() => setOpen(false)}
    >
      <div
        className="flex h-full w-full max-w-[828px] flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="border-border bg-card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-black/40">
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background/80 absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full border backdrop-blur-sm transition-colors sm:hidden"
          >
            <X className="size-4" aria-hidden />
          </button>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(in oklab to right, transparent, oklch(0.65 0.22 290 / 0.85) 25%, oklch(0.72 0.2 25 / 0.95) 55%, oklch(0.8 0.13 175 / 0.85) 80%, transparent)",
            }}
          />

          <div
            ref={scrollerRef}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6"
          >
            {messages.length === 0 ? (
              <EmptyState onPick={submit} />
            ) : (
              <ol className="flex flex-col gap-5">
                {messages.map((m) => {
                  const text = messageText(m.parts ?? []);
                  const isAssistant = m.role === "assistant";
                  const chips = isAssistant ? extractChips(text) : [];
                  const tokens =
                    isAssistant
                      ? (m.metadata as { totalTokens?: number | null } | undefined)
                          ?.totalTokens
                      : null;
                  const seconds = isAssistant ? durations[m.id] : null;
                  const showMetric =
                    isAssistant &&
                    seconds != null &&
                    !(isStreaming && m.id === messages[messages.length - 1]?.id);
                  return (
                    <li key={m.id} className="flex flex-col gap-2">
                      <Bubble role={m.role}>{text}</Bubble>
                      {showMetric && (
                        <MetricLine
                          seconds={seconds!}
                          tokens={tokens ?? null}
                        />
                      )}
                      {chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pl-1">
                          {chips.map((c) => (
                            <ChipLink
                              key={c.href}
                              chip={c}
                              onNavigate={() => setOpen(false)}
                            />
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
                {isStreaming &&
                  messages[messages.length - 1]?.role === "user" && (
                    <li>
                      <Bubble role="assistant">
                        <span className="text-foreground/60">thinking…</span>
                      </Bubble>
                    </li>
                  )}
              </ol>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-border/60 bg-background/40 border-t px-3 py-3 sm:px-4 sm:py-4"
          >
            {error && (
              <p className="text-destructive mb-2 px-1 text-xs">
                {error.message || "Something went wrong. Try again."}
              </p>
            )}
            <div className="border-border bg-background/70 focus-within:border-foreground/30 flex items-end gap-2 rounded-xl border px-3 py-2 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about Andrzej…"
                rows={1}
                maxLength={2000}
                disabled={isStreaming}
                className="placeholder:text-muted-foreground/70 field-sizing-content max-h-40 flex-1 resize-none bg-transparent py-1 text-sm outline-none disabled:opacity-60"
              />
              <kbd
                aria-hidden
                className="border-border/70 text-muted-foreground hidden self-center rounded border px-1 py-0.5 font-mono text-2xs font-medium uppercase tracking-mini sm:inline-block"
              >
                Enter
              </kbd>
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="bg-foreground text-background hover:bg-foreground/90 inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-opacity disabled:opacity-40"
              >
                <ArrowUp className="size-4" aria-hidden />
              </button>
            </div>
          </form>

          <div className="border-border/60 bg-background/40 text-muted-foreground flex items-center justify-between border-t px-4 py-2 font-mono text-2xs uppercase tracking-mini">
            <span>Atlas · powered by Groq · Llama 3.3 70B</span>
            <span className="hidden items-center gap-1 sm:flex">
              <kbd className="border-border/70 rounded border px-1 py-0.5 font-medium">
                Esc
              </kbd>
              <span>close</span>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricLine({
  seconds,
  tokens,
}: {
  seconds: number;
  tokens: number | null;
}) {
  return (
    <div className="text-muted-foreground flex items-center gap-1.5 pl-0.5 font-mono text-2xs uppercase tracking-mini">
      <MatrixDots size={14} cols={4} rows={4} className="shrink-0" />
      <span>
        {formatSeconds(seconds)}
        {tokens != null ? (
          <>
            <span className="opacity-60"> · </span>
            <span aria-hidden>↓</span> {tokens} tokens
          </>
        ) : null}
      </span>
    </div>
  );
}

function formatSeconds(s: number): string {
  if (s < 1) return `${Math.round(s * 1000)}ms`;
  if (s < 10) return `${s.toFixed(1)}s`;
  return `${Math.round(s)}s`;
}

function Bubble({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="bg-foreground/10 text-foreground max-w-[85%] self-end rounded-2xl rounded-br-md px-3.5 py-2 text-sm">
        {children}
      </div>
    );
  }
  return (
    <div className="text-foreground/90 max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed">
      {children}
    </div>
  );
}

function ChipLink({
  chip,
  onNavigate,
}: {
  chip: Chip;
  onNavigate: () => void;
}) {
  const className =
    "border-border/70 bg-background/60 text-foreground/80 hover:bg-foreground/5 hover:text-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-2xs uppercase tracking-mini transition-colors";
  if (chip.external) {
    return (
      <a
        href={chip.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {chip.label}
        <ArrowUpRight className="size-2.5 opacity-70" aria-hidden />
      </a>
    );
  }
  return (
    <Link href={chip.href} className={className} onClick={onNavigate}>
      {chip.label}
    </Link>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex items-center gap-3">
        <MatrixDots size={36} cols={7} rows={7} className="shrink-0" />
        <div>
          <p className="text-foreground text-sm font-semibold">
            Ask Atlas anything about Andrzej
          </p>
          <p className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
            <span className="sm:hidden">Experience, background — anything</span>
            <span className="hidden sm:inline">
              Experience, background, latest work, on‑going projects — anything
            </span>
          </p>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-1.5">
        {STARTERS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="border-border/60 hover:bg-foreground/5 hover:border-border text-foreground/80 hover:text-foreground w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
