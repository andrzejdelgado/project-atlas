"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Home,
  Layers,
  Lock,
  Mail,
  MessageCircle,
  MessageSquare,
  Monitor,
  Moon,
  FolderGit2,
  Rss,
  Search,
  Sparkles,
  Sun,
  UserCircle,
  Link2,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

type CommandIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type CommandItem = {
  id: string;
  label: string;
  group: string;
  icon?: CommandIcon;
  keywords?: string;
  href?: string;
  external?: boolean;
  action?: () => void | Promise<void>;
};

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();
  const { setTheme } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const commands = React.useMemo<CommandItem[]>(
    () => [
      // Pages
      { id: "home", group: "Pages", label: "Home", icon: Home, href: "/" },
      {
        id: "case-studies",
        group: "Pages",
        label: "Case studies",
        icon: Lock,
        href: "/case-studies",
      },
      {
        id: "reviews",
        group: "Pages",
        label: "Mentee reviews",
        icon: MessageSquare,
        href: "/reviews",
      },
      {
        id: "about",
        group: "Pages",
        label: "About",
        icon: UserCircle,
        href: "/about",
      },
      {
        id: "projects",
        group: "Pages",
        label: "Projects",
        icon: FolderGit2,
        href: "/projects",
      },
      {
        id: "chat",
        group: "Pages",
        label: "Chat",
        icon: MessageCircle,
        action: () => {
          setTimeout(
            () => window.dispatchEvent(new Event("atlas:open-chat")),
            50,
          );
        },
      },
      // Case studies (concrete)
      {
        id: "cs-tokens",
        group: "Case studies",
        label: "Tokens that travel",
        icon: Layers,
        keywords: "design systems tokens",
        href: "/case-studies/tokens-that-travel",
      },
      {
        id: "cs-long",
        group: "Case studies",
        label: "The long horizon",
        icon: Compass,
        keywords: "systems strategy",
        href: "/case-studies/long-horizon-design",
      },
      {
        id: "cs-ic-staff",
        group: "Case studies",
        label: "From IC to staff",
        icon: UserCircle,
        keywords: "career mentorship leadership",
        href: "/case-studies/from-ic-to-staff",
      },
      {
        id: "cs-patterns",
        group: "Case studies",
        label: "Patterns over policy",
        icon: BookOpen,
        keywords: "design ops patterns",
        href: "/case-studies/patterns-over-policy",
      },
      // Theme
      {
        id: "theme-light",
        group: "Theme",
        label: "Switch to light",
        icon: Sun,
        keywords: "theme appearance light mode",
        action: () => setTheme("light"),
      },
      {
        id: "theme-dark",
        group: "Theme",
        label: "Switch to dark",
        icon: Moon,
        keywords: "theme appearance dark mode",
        action: () => setTheme("dark"),
      },
      {
        id: "theme-system",
        group: "Theme",
        label: "Use system theme",
        icon: Monitor,
        keywords: "theme appearance system auto",
        action: () => setTheme("system"),
      },
      // Actions
      {
        id: "copy-link",
        group: "Actions",
        label: "Copy link to this page",
        icon: Link2,
        action: async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
          } catch {
            /* ignore */
          }
        },
      },
      {
        id: "email",
        group: "Actions",
        label: `Email ${siteConfig.author}`,
        icon: Mail,
        href: `mailto:${siteConfig.email}`,
        external: true,
      },
      {
        id: "medium",
        group: "Actions",
        label: "Read on Medium",
        icon: BookOpen,
        href: "https://medium.com/@andrzej.delgado",
        external: true,
      },
      {
        id: "adplist",
        group: "Actions",
        label: "Book a session on ADPList",
        icon: Sparkles,
        href: "https://adplist.org/mentors/andrzej-delgado",
        external: true,
      },
      {
        id: "rss",
        group: "Actions",
        label: "Subscribe to RSS",
        icon: Rss,
        href: "/rss.xml",
      },
    ],
    [setTheme],
  );

  const filtered = React.useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        (c.keywords ?? "").toLowerCase().includes(q),
    );
  }, [query, commands]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const execute = React.useCallback(
    (item?: CommandItem) => {
      if (!item) return;
      if (item.action) {
        void item.action();
      }
      if (item.href) {
        if (item.external) {
          window.open(item.href, "_blank", "noopener,noreferrer");
        } else {
          router.push(item.href);
        }
      }
      setOpen(false);
    },
    [router],
  );

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isModK =
        (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (isModK) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        execute(filtered[activeIndex]);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIndex, execute]);

  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("atlas:open-command-palette", onOpen);
    return () =>
      window.removeEventListener("atlas:open-command-palette", onOpen);
  }, []);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-command-index="${activeIndex}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!open) return null;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>(
    (acc, item) => {
      (acc[item.group] ??= []).push(item);
      return acc;
    },
    {},
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="border-border bg-card relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(in oklab to right, transparent, hsl(290 80% 65% / 0.6) 25%, hsl(25 90% 60% / 0.7) 55%, hsl(175 60% 60% / 0.6) 80%, transparent)",
          }}
        />
        <div className="border-border/60 flex items-center gap-2 border-b px-4">
          <Search className="size-4 opacity-60" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, case studies, theme…"
            spellCheck={false}
            autoComplete="off"
            className="placeholder:text-muted-foreground/60 flex-1 bg-transparent py-3 text-sm outline-none"
          />
          <kbd className="border-border/70 text-muted-foreground hidden rounded border px-1.5 py-0.5 font-mono text-2xs font-medium uppercase tracking-mini sm:inline-block">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground p-6 text-center text-sm">
              No matches for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName} className="mb-2 last:mb-0">
                <p className="text-muted-foreground/70 px-2 py-1.5 font-mono text-2xs font-semibold uppercase tracking-mini">
                  {groupName}
                </p>
                {items.map((item) => {
                  const idx = filtered.indexOf(item);
                  const isActive = idx === activeIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-command-index={idx}
                      onClick={() => execute(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-100 ${
                        isActive
                          ? "bg-foreground/10 text-foreground"
                          : "text-foreground/85 hover:bg-foreground/5"
                      }`}
                    >
                      {Icon ? (
                        <Icon
                          className="size-4 shrink-0 opacity-85"
                          aria-hidden
                        />
                      ) : null}
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive ? (
                        <ArrowRight
                          className="text-muted-foreground size-3.5 shrink-0"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="border-border/60 bg-background/40 text-muted-foreground flex items-center justify-between border-t px-4 py-2 font-mono text-2xs uppercase tracking-mini">
          <span className="font-medium">Project Atlas</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="border-border/70 rounded border px-1 py-0.5 font-medium">
                ↑
              </kbd>
              <kbd className="border-border/70 rounded border px-1 py-0.5 font-medium">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border-border/70 rounded border px-1 py-0.5 font-medium">
                ↵
              </kbd>
              <span>select</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
