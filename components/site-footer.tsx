import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border/60 mt-16 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-[828px] flex-col items-start justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:items-center sm:px-6">
        <p>
          © {year} {siteConfig.author}
        </p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {siteConfig.social.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="hover:text-foreground transition-colors duration-200"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/rss.xml"
              className="hover:text-foreground transition-colors duration-200"
            >
              RSS
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
