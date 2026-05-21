"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, MessageCircle, Smile } from "lucide-react";

import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "@/components/brand-icons";
import { DockTooltip } from "@/components/dock-tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export const dockButton =
  "text-muted-foreground hover:text-foreground hover:bg-foreground/5 active:bg-foreground/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-0 relative inline-flex size-9 items-center justify-center rounded-md transition-[color,background-color,transform] duration-150 before:absolute before:inset-[-2px] before:content-['']";

const socialIcons: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  adplist: Smile,
  email: MailIcon,
};

export function SiteDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div
        aria-hidden
        className="from-background via-background/75 pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent sm:h-48"
      />
      <nav
        aria-label="Site"
        className="pointer-events-auto relative mx-auto flex max-w-[828px] items-center justify-between gap-4 px-4 pb-5 sm:px-6 sm:pb-7"
      >
        <ul className="flex items-center gap-1.5">
          {siteConfig.social.map((s) => {
            const Icon = socialIcons[s.key];
            if (!Icon) return null;
            return (
              <li key={s.key}>
                <DockTooltip label={s.label}>
                  <Link
                    href={s.href}
                    target={
                      s.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noreferrer"
                    aria-label={s.label}
                    className={dockButton}
                  >
                    <Icon className="size-4 opacity-85" />
                  </Link>
                </DockTooltip>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <DockTooltip label="Download CV (PDF)">
            <a
              href="/andrzej-delgado-cv.pdf"
              download="andrzej-delgado-cv.pdf"
              aria-label="Download CV (PDF)"
              className={dockButton}
            >
              <FileText className="size-4 opacity-85" aria-hidden="true" />
            </a>
          </DockTooltip>
          <DockTooltip label="Toggle theme">
            <ThemeToggle />
          </DockTooltip>
          <DockTooltip label="Chat">
            <button
              type="button"
              aria-label="Chat"
              onClick={() =>
                window.dispatchEvent(new Event("atlas:open-chat"))
              }
              className={dockButton}
            >
              <MessageCircle className="size-4 opacity-85" aria-hidden="true" />
            </button>
          </DockTooltip>
        </div>
      </nav>
    </div>
  );
}
