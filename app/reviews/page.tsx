import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Sparkles, Lightbulb, GraduationCap } from "lucide-react";

import { PageActions } from "@/components/page-actions";
import { ratingDimensions, commonTraits, reviews } from "@/lib/reviews";
import { siteConfig } from "@/lib/site";

const dimensionIcons = {
  communication: MessageCircle,
  motivational: Sparkles,
  "problem-solving": Lightbulb,
  "subject-knowledge": GraduationCap,
} as const;

const dimensionTints: Record<string, string> = {
  communication: "210 90% 60%",
  motivational: "0 85% 65%",
  "problem-solving": "45 95% 55%",
  "subject-knowledge": "150 65% 45%",
};

function traitHue(trait: string) {
  let h = 0;
  for (let i = 0; i < trait.length; i++) {
    h = (h * 31 + trait.charCodeAt(i)) % 360;
  }
  return h;
}

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const metadata: Metadata = {
  title: "Mentee reviews",
  description:
    "What designers I've mentored on ADPList have said about working together.",
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto w-full py-6 sm:py-8 lg:py-10">
      <PageActions backHref="/" />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Mentee reviews
        </h1>
        <p className="text-muted-foreground mt-3 max-w-[60ch] leading-relaxed">
          A running record of what designers I&apos;ve mentored on ADPList
          have said after our sessions. Pulled from my{" "}
          <Link
            href={`https://adplist.org/mentors/andrzej-delgado`}
            target="_blank"
            rel="noreferrer"
            className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground underline underline-offset-4 transition-colors duration-200"
          >
            mentor profile
          </Link>{" "}
          and kept here as a single, browsable archive.
        </p>
      </header>

      <section className="border-border mb-6 rounded-2xl border bg-transparent p-5 sm:p-6">
        <h2 className="text-foreground mb-4 text-sm font-medium tracking-tight">
          Overall ratings
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ratingDimensions.map((d) => {
            const Icon = dimensionIcons[d.key];
            const tint = dimensionTints[d.key];
            return (
              <li key={d.key} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `hsl(${tint} / 0.14)`,
                    color: `hsl(${tint})`,
                  }}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-xl font-semibold tabular-nums leading-none tracking-tight">
                    {d.value}%
                  </p>
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {d.label}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-border mb-10 rounded-2xl border bg-transparent p-5 sm:p-6">
        <h2 className="text-foreground mb-3 text-sm font-medium tracking-tight">
          Commonly mentioned traits
        </h2>
        <ul className="-mx-1 flex flex-wrap gap-1.5">
          {commonTraits.map((trait) => {
            const h = traitHue(trait);
            return (
              <li
                key={trait}
                className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `hsl(${h} 70% 55% / 0.1)`,
                  borderColor: `hsl(${h} 70% 55% / 0.3)`,
                  color: `hsl(${h} 80% 78%)`,
                }}
              >
                {trait}
              </li>
            );
          })}
        </ul>
      </section>

      <ol className="flex list-none flex-col gap-4 p-0">
        {reviews.map((review, i) => {
          const date = new Date(review.date);
          return (
            <li
              key={`${review.date}-${review.author.name}`}
              className="border-border bg-card/40 rounded-2xl border p-5 transition-colors duration-200 sm:p-6 animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDuration: "300ms",
                animationDelay: `${Math.min(i, 6) * 40}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="border-border/60 -mx-5 -mt-5 mb-5 flex items-center justify-between gap-3 border-b px-5 py-4 sm:-mx-6 sm:-mt-6 sm:mb-6 sm:px-6 sm:py-5">
                <p className="text-muted-foreground text-xs uppercase tracking-wider tabular-nums">
                  <time dateTime={review.date}>{fmt.format(date)}</time>
                </p>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  Mentee
                </p>
              </div>

              <blockquote className="text-foreground/90 text-base leading-7 sm:text-[17px]">
                <span aria-hidden className="text-muted-foreground/60 mr-1">
                  &ldquo;
                </span>
                {review.quote}
                <span aria-hidden className="text-muted-foreground/60 ml-0.5">
                  &rdquo;
                </span>
              </blockquote>

              <ul className="mt-5 -mx-1 flex flex-wrap gap-1.5">
                {review.tags.map((tag) => {
                  const h = traitHue(tag);
                  return (
                    <li
                      key={tag}
                      className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: `hsl(${h} 70% 55% / 0.08)`,
                        borderColor: `hsl(${h} 70% 55% / 0.28)`,
                        color: `hsl(${h} 75% 80%)`,
                      }}
                    >
                      {tag}
                    </li>
                  );
                })}
              </ul>

              <footer className="border-border/60 mt-6 flex items-center gap-3 border-t pt-5">
                <span className="border-border bg-background/40 relative size-[60px] shrink-0 overflow-hidden rounded-full border">
                  <Image
                    src={review.author.image}
                    alt={review.author.name}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground flex items-center gap-1.5 truncate text-sm font-semibold tracking-tight">
                    <span className="truncate">{review.author.name}</span>
                    <span aria-hidden className="shrink-0 text-base leading-none">
                      {review.author.flag}
                    </span>
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {review.author.role} · {review.author.company}
                  </p>
                </div>
              </footer>
            </li>
          );
        })}
      </ol>

      <p className="text-muted-foreground mt-10 text-sm">
        Want a session?{" "}
        <Link
          href="https://adplist.org/mentors/andrzej-delgado"
          target="_blank"
          rel="noreferrer"
          className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground underline underline-offset-4 transition-colors duration-200"
        >
          Book me on ADPList
        </Link>
        . You can also reach me at{" "}
        <Link
          href={`mailto:${siteConfig.email}`}
          className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground underline underline-offset-4 transition-colors duration-200"
        >
          {siteConfig.email}
        </Link>
        .
      </p>
    </div>
  );
}
