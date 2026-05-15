import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Lock,
  Presentation,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Compass,
  Layers,
  MessageCircle,
  MessageSquare,
  Headphones,
  Rocket,
  ScrollText,
  Smile,
  Sparkles,
  Star,
} from "lucide-react";

import { PROJECT_BRAND_ASSETS } from "@/lib/project-brand-assets";
import { ContentCard } from "@/components/content-card";
import { CompactProjectTile } from "@/components/compact-project-tile";
import { FeaturedProjectCard } from "@/components/featured-project-card";
import { ListeningTile } from "@/components/listening-tile";
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  MediumIcon,
} from "@/components/brand-icons";
import { DockTooltip } from "@/components/dock-tooltip";
import { getAllCaseStudies, getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import {
  reading,
  recentPosts,
  mentorship,
  live,
  principles,
} from "@/lib/dashboard";
import { getAdpListStats } from "@/lib/adplist";
import { getMediumArticles } from "@/lib/medium";

const projectIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  sparkles: Sparkles,
  compass: Compass,
  book: BookOpen,
  layers: Layers,
  scroll: ScrollText,
  rocket: Rocket,
  bookmark: Bookmark,
  activity: Activity,
};

const projectTintMap: Record<string, string> = {
  violet: "290 75% 65%",
  mint: "165 60% 55%",
  emerald: "165 60% 55%",
  coral: "30 90% 65%",
  amber: "60 85% 60%",
  blue: "264 80% 65%",
  cyan: "215 70% 60%",
};

const PROJECT_TINT_FALLBACKS = [
  "violet",
  "mint",
  "coral",
  "blue",
  "amber",
  "cyan",
];

const PROJECT_ICON_FALLBACKS = ["sparkles", "compass", "book", "layers"];

const upcomingFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const upcomingTimeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});
import { cn } from "@/lib/utils";

const socialIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  adplist: Smile,
  email: MailIcon,
};

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function Tile({
  children,
  className,
  span = "col-span-6 md:col-span-3",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  span?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-border bg-card/40 text-card-foreground bento-reveal relative flex h-full flex-col overflow-hidden rounded-2xl border",
        padded && "p-5 sm:p-6",
        span,
        className,
      )}
    >
      {children}
    </section>
  );
}

function TileHeader({
  icon: Icon,
  title,
  href,
  hrefLabel,
  className,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-border/60 -mx-5 -mt-5 mb-5 flex items-center justify-between gap-3 border-b px-5 py-4 sm:-mx-6 sm:-mt-6 sm:mb-6 sm:px-6 sm:py-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Icon ? (
          <Icon
            className="text-foreground size-4 opacity-85"
            aria-hidden="true"
          />
        ) : null}
        <h2 className="text-foreground text-sm font-medium tracking-tight">
          {title}
        </h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors duration-200"
        >
          {hrefLabel ?? "View"}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </header>
  );
}

export default async function Home() {
  const allProjects = getAllProjects();
  const latestProject = allProjects[0];
  const featuredProject = allProjects.find((p) => p.frontmatter.featured);
  const restProjects = allProjects
    .filter((p) => p.slug !== featuredProject?.slug)
    .slice(0, 4);
  const homeProjects = allProjects.slice(0, 4);
  const featuredWork = getAllCaseStudies().slice(0, 4);
  const totalWork = getAllCaseStudies().length;
  const adp = await getAdpListStats();
  const medium = await getMediumArticles(3);
  const reviewCount = adp?.reviewCount ?? null;
  const averageRating =
    typeof adp?.averageRating === "number"
      ? adp.averageRating.toFixed(2).replace(/\.?0+$/, "")
      : mentorship.rating;
  const yearsExperience = adp?.yearsOfExperience ?? 15;

  return (
    <div className="mx-auto w-full max-w-5xl py-6 sm:py-8 lg:py-10">
      <div className="grid grid-cols-6 gap-3 sm:gap-4">
        {/* Hero */}
        <Tile
          span="col-span-6"
          padded={false}
          className="mb-4 !border-0 !bg-transparent pt-12 pb-6 sm:mb-6 sm:pt-20 sm:pb-10"
        >
          <div>
            <span className="border-border mb-4 relative block size-20 overflow-hidden rounded-full border sm:size-24">
              <Image
                src="/andrzejdelgado.webp"
                alt={siteConfig.author}
                fill
                sizes="96px"
                priority
                className="object-cover"
              />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">
                {siteConfig.author}
              </h1>
              <p className="text-muted-foreground mt-0.5 text-xs text-balance sm:text-base">
                {siteConfig.tagline.replace(/\.$/, "")}
              </p>
              <div className="text-muted-foreground mt-3 flex flex-col gap-2.5 sm:mt-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <MapPinIcon
                    className="size-3.5 shrink-0 opacity-80"
                    aria-hidden
                  />
                  <span className="font-mono text-xs uppercase tracking-mini sm:text-2xs">
                    {siteConfig.location}
                  </span>
                </div>
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {siteConfig.social.map((s) => {
                  const Icon = socialIconMap[s.key];
                  if (!Icon) {
                    return (
                      <li key={s.key}>
                        <DockTooltip label={s.label} placement="bottom">
                          <Link
                            href={s.href}
                            target={
                              s.href.startsWith("mailto:") ? undefined : "_blank"
                            }
                            rel="noreferrer"
                            aria-label={s.label}
                            className="hover:text-foreground border-border/70 inline-flex h-6 items-center rounded-md border px-1.5 font-mono text-2xs font-medium uppercase tracking-mini transition-colors duration-200"
                          >
                            {s.label}
                          </Link>
                        </DockTooltip>
                      </li>
                    );
                  }
                  return (
                    <li key={s.key}>
                      <DockTooltip label={s.label} placement="bottom">
                        <Link
                          href={s.href}
                          target={
                            s.href.startsWith("mailto:") ? undefined : "_blank"
                          }
                          rel="noreferrer"
                          aria-label={s.label}
                          className="hover:text-foreground relative inline-flex size-5 items-center justify-center opacity-85 transition-[color,opacity] duration-200 hover:opacity-100 before:absolute before:inset-[-10px] before:content-['']"
                        >
                          <Icon className="size-[18px]" />
                        </Link>
                      </DockTooltip>
                    </li>
                  );
                })}
                </ul>
              </div>
            </div>
          </div>

        </Tile>

        {/* Case Studies */}
        <Tile
          span="col-span-6 md:col-span-4"
          padded={false}
          className="hover:border-foreground/20 relative overflow-hidden transition-colors duration-200"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(in oklab to right, transparent, hsl(290 80% 65% / 0.6) 25%, hsl(25 90% 60% / 0.7) 55%, hsl(175 60% 60% / 0.6) 80%, transparent)",
            }}
          />
          <header className="border-border/60 flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-2">
              <Lock
                className="text-foreground size-4 opacity-85"
                aria-hidden="true"
              />
              <h2 className="text-foreground text-sm font-medium tracking-tight">
                Case studies
              </h2>
              <span className="border-border/70 bg-background/40 text-muted-foreground ml-1 inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini tabular-nums">
                {totalWork}
              </span>
            </div>
          </header>

          <ul className="divide-border/40 flex flex-1 flex-col divide-y">
            {featuredWork.map((entry, i) => {
              const date = new Date(entry.frontmatter.date);
              const titleWords = entry.frontmatter.title
                .split(/\s+/)
                .filter((w) => !/^(the|a|an)$/i.test(w));
              const fallbackMark =
                entry.frontmatter.mark ??
                (titleWords[0] ?? entry.frontmatter.title)[0].toUpperCase();
              // Cycling palette aligns with site accents (violet → amber → mint → coral)
              const tints = [
                "290 80% 65%",
                "30 95% 60%",
                "165 60% 55%",
                "10 85% 65%",
              ];
              const tint = tints[i % tints.length];
              return (
                <li key={entry.slug} className="relative">
                  <Link
                    href={`/case-studies/${entry.slug}`}
                    className="group relative flex items-center gap-3.5 overflow-hidden px-6 py-4 transition-[background-color] duration-200 hover:bg-background/50 sm:gap-4"
                  >
                    {/* Left accent bar — appears on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-2 left-0 w-[3px] origin-left scale-x-0 rounded-full opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(to bottom, hsl(${tint} / 0.9), hsl(${tint} / 0.2))`,
                      }}
                    />

                    {/* Tinted monogram / logo plate */}
                    <span
                      aria-hidden
                      className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 group-hover:scale-[1.04]"
                      style={{
                        backgroundColor: `hsl(${tint} / 0.08)`,
                        borderColor: `hsl(${tint} / 0.28)`,
                        color: `hsl(${tint})`,
                      }}
                    >
                      {/* Diagonal sheen on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                      />
                      {entry.frontmatter.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.frontmatter.logo}
                          alt=""
                          className="relative h-4 w-auto max-w-7 object-contain"
                        />
                      ) : (
                        <span className="relative text-[12px] font-bold tracking-tight">
                          {fallbackMark}
                        </span>
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground truncate text-[14px] font-semibold tracking-tight">
                        {entry.frontmatter.title}
                      </h3>
                      <p className="text-muted-foreground/80 mt-1 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-mini">
                        <time dateTime={entry.frontmatter.date} className="tabular-nums">
                          {date.getFullYear()}
                        </time>
                        {entry.frontmatter.company ? (
                          <>
                            <span aria-hidden className="opacity-40">
                              ·
                            </span>
                            <span>{entry.frontmatter.company}</span>
                          </>
                        ) : null}
                      </p>
                    </div>

                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      style={{ color: `hsl(${tint})` }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/case-studies"
            className="border-border/60 bg-background/30 text-foreground hover:bg-background/60 mt-auto inline-flex items-center justify-center gap-2 border-t px-4 py-3 text-sm font-medium transition-colors duration-200"
          >
            <Presentation className="size-4 opacity-85" aria-hidden="true" />
            Browse all case studies
            <ArrowRight className="size-4 opacity-85" aria-hidden="true" />
          </Link>
        </Tile>

        {/* Mentoring stats */}
        <Tile span="col-span-6 md:col-span-2">
          <TileHeader icon={Compass} title="Mentoring" />
          <ul className="-mx-5 grid grid-cols-1 gap-3.5 pb-5 sm:-mx-6 sm:pb-6">
            {[
              {
                icon: Rocket,
                tint: "210 90% 60%",
                value: mentorship.community.totalMentoringMinutes.toLocaleString(),
                unit: "mins",
                label: "Total mentoring time",
              },
              {
                icon: Sparkles,
                tint: "0 85% 65%",
                value: mentorship.community.sessionsCompleted.toString(),
                label: "Sessions completed",
              },
              {
                icon: CalendarCheck,
                tint: "30 95% 55%",
                value: `${mentorship.community.averageAttendance}%`,
                label: "Average attendance",
              },
              {
                icon: MessageSquare,
                tint: "150 65% 45%",
                value: reviewCount !== null ? reviewCount.toString() : "—",
                label: `Reviews on ${mentorship.platform}`,
              },
              {
                icon: Star,
                tint: "45 95% 55%",
                value: averageRating,
                unit: "/ 5",
                label: "Average rating",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <li
                  key={stat.label}
                  className="flex items-center gap-3 px-6"
                >
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `hsl(${stat.tint} / 0.12)`,
                      color: `hsl(${stat.tint})`,
                    }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground text-base font-semibold tabular-nums leading-tight tracking-tight">
                      {stat.value}
                      {stat.unit ? (
                        <span className="text-muted-foreground ml-0.5 text-xs font-normal">
                          {" "}
                          {stat.unit}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-muted-foreground mt-0.5 truncate font-mono text-2xs uppercase tracking-mini">
                      {stat.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <a
            href="https://adplist.org/mentors/andrzej-delgado"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/60 bg-background/30 text-foreground hover:bg-background/60 -mx-5 -mb-5 mt-auto inline-flex items-center justify-center gap-2 border-t px-4 py-3 text-sm font-medium transition-colors duration-200 sm:-mx-6 sm:-mb-6"
          >
            <CalendarPlus className="size-4 opacity-85" aria-hidden="true" />
            Book a session
            <ArrowUpRight className="size-4 opacity-85" aria-hidden="true" />
          </a>
        </Tile>

        {/* Latest Projects */}
        <Tile
          span="col-span-6"
          padded={false}
          className="hover:border-foreground/20 relative overflow-hidden transition-colors duration-200"
        >
          <span className="border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 absolute top-4 right-4 z-[1] inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini">
            <span aria-hidden className="relative inline-flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/70 dark:bg-emerald-400/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            </span>
            Active
          </span>

          <div className="p-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="border-border relative block size-16 shrink-0 overflow-hidden rounded-full border sm:size-20">
                <Image
                  src="/andrzejdelgado.webp"
                  alt={siteConfig.author}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="inline-flex items-center gap-2.5 text-2xl font-semibold tracking-tight">
                  {live.headline}
                  <span className="border-border/70 bg-background/40 text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini tabular-nums">
                    {allProjects.length}
                  </span>
                </h3>
                <p className="text-muted-foreground font-mono text-2xs uppercase tracking-mini leading-relaxed">
                  {live.blurb}
                </p>
              </div>
            </div>
          </div>

          <ul className="border-border/60 divide-border/40 flex flex-1 flex-col divide-y border-t">
            {homeProjects.map((entry, i) => {
              const fm = entry.frontmatter;
              const tintKey =
                fm.tint && projectTintMap[fm.tint]
                  ? fm.tint
                  : PROJECT_TINT_FALLBACKS[i % PROJECT_TINT_FALLBACKS.length];
              const tint =
                projectTintMap[tintKey] ?? projectTintMap.violet;
              const iconKey =
                fm.icon && projectIconMap[fm.icon]
                  ? fm.icon
                  : PROJECT_ICON_FALLBACKS[i % PROJECT_ICON_FALLBACKS.length];
              const Icon = projectIconMap[iconKey] ?? Sparkles;
              const brandAsset = PROJECT_BRAND_ASSETS[entry.slug];
              const year = new Date(fm.date).getFullYear();
              const cta = fm.cta ?? fm.description;
              return (
                <li key={entry.slug}>
                  <Link
                    href={`/projects/${entry.slug}`}
                    className="group hover:bg-background/50 flex items-center gap-3.5 px-5 py-4 transition-[background-color] duration-200 sm:px-6 sm:gap-4"
                  >
                    {brandAsset ? (
                      <span
                        aria-hidden
                        className="border-border/60 bg-secondary/60 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 group-hover:scale-[1.04]"
                      >
                        <Image
                          src={brandAsset.src}
                          alt=""
                          width={32}
                          height={32}
                          aria-hidden="true"
                          className={brandAsset.className}
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 group-hover:scale-[1.04]"
                        style={{
                          backgroundColor: `hsl(${tint} / 0.08)`,
                          borderColor: `hsl(${tint} / 0.28)`,
                          color: `hsl(${tint})`,
                        }}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                    )}

                    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-baseline gap-x-3">
                      <h3 className="text-foreground truncate text-sm font-semibold tracking-tight">
                        {fm.title}
                      </h3>
                      <p className="text-muted-foreground/85 truncate font-mono text-2xs uppercase tracking-mini">
                        {cta}
                      </p>
                    </div>

                    <time
                      dateTime={fm.date}
                      className="text-muted-foreground/70 shrink-0 font-mono text-2xs uppercase tracking-mini tabular-nums"
                    >
                      {year}
                    </time>

                    <ArrowRight
                      aria-hidden
                      className="text-muted-foreground/30 group-hover:text-foreground size-4 shrink-0 transition-colors duration-200"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/projects"
            className="border-border/60 bg-background/30 text-foreground hover:bg-background/60 mt-auto inline-flex items-center justify-center gap-2 border-t px-4 py-3 text-sm font-medium transition-colors duration-200"
          >
            <Sparkles className="size-4 opacity-85" aria-hidden="true" />
            Browse all projects
            <ArrowRight className="size-4 opacity-85" aria-hidden="true" />
          </Link>
        </Tile>

        {/* Events */}
        <Tile span="col-span-6" padded={false}>
          <header className="border-border/60 flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-2">
              <Calendar
                className="text-foreground size-4 opacity-85"
                aria-hidden="true"
              />
              <h2 className="text-foreground text-sm font-medium tracking-tight">
                Events
              </h2>
              <span className="border-border/70 bg-background/40 text-muted-foreground ml-1 inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini tabular-nums">
                {live.events.length}
              </span>
            </div>
          </header>

          <ul className="flex flex-col gap-2 px-5 py-5 sm:px-6 sm:py-6">
            {[...live.events]
              .sort(
                (a, b) =>
                  new Date(b.iso).getTime() - new Date(a.iso).getTime(),
              )
              .map((item) => {
              const date = new Date(item.iso);
              const now = new Date();
              const diffMs = date.getTime() - now.getTime();
              const isPast = diffMs < 0;
              const days = Math.round(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
              const chip = isPast
                ? "Past"
                : days >= 30
                  ? `${Math.floor(days / 30)}MO`
                  : `${days}D`;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group border-border/70 bg-background/40 hover:border-foreground/20 hover:bg-background/60 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors duration-200"
                  >
                    <div className="flex min-w-0 items-center">
                      <p className="text-foreground truncate text-sm font-medium">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5 text-xs tabular-nums">
                      <p className="text-muted-foreground hidden font-mono text-2xs uppercase tracking-mini sm:block">
                        <time dateTime={item.iso}>
                          {upcomingFmt.format(date)} ·{" "}
                          {upcomingTimeFmt.format(date)}
                        </time>
                      </p>
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-2xs font-semibold uppercase tracking-mini ${
                          isPast
                            ? "border-border/50 bg-background/30 text-muted-foreground/70"
                            : "border-border/70 bg-background/60 text-foreground/90"
                        }`}
                      >
                        {chip}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Tile>

        {/* Latest note */}
        {latestProject ? (
          <Tile
            span="col-span-6 md:col-span-3"
            padded={false}
            className="hover:border-foreground/20 relative overflow-hidden transition-colors duration-200"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(in oklab to right, transparent, hsl(290 80% 65% / 0.6) 25%, hsl(25 90% 60% / 0.7) 55%, hsl(175 60% 60% / 0.6) 80%, transparent)",
              }}
            />
            <header className="border-border/60 flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-2">
                <MediumIcon
                  className="size-4 opacity-85"
                  aria-hidden="true"
                />
                <h2 className="text-foreground text-sm font-medium tracking-tight">
                  On Medium
                </h2>
                <span className="border-border/70 bg-background/40 text-muted-foreground ml-1 inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini tabular-nums">
                  9
                </span>
              </div>
            </header>

            {medium.articles.length === 0 ? (
              <div className="text-muted-foreground p-5 text-sm sm:p-6">
                Medium feed couldn&apos;t load right now — try the{" "}
                <Link
                  href={medium.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-4"
                >
                  profile
                </Link>{" "}
                directly.
              </div>
            ) : (
              <ul className="divide-border/50 flex flex-1 flex-col divide-y">
                {medium.articles.map((a, i) => {
                  const date = new Date(a.publishedAt);
                  return (
                    <li key={a.url}>
                      <Link
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group hover:bg-background/40 flex items-start gap-3 px-6 py-[18px] transition-colors duration-200"
                      >
                        {a.image ? (
                          <span className="border-border/70 relative aspect-square size-14 shrink-0 overflow-hidden rounded-md border sm:size-16">
                            <Image
                              src={a.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              unoptimized
                            />
                          </span>
                        ) : (
                          <span
                            aria-hidden
                            className="size-14 shrink-0 rounded-md sm:size-16"
                            style={{
                              background: `linear-gradient(${135 + i * 41}deg, oklch(0.55 0.16 ${
                                40 + i * 80
                              }), oklch(0.7 0.18 ${300 + i * 20}))`,
                            }}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-foreground line-clamp-2 text-sm font-semibold leading-snug tracking-tight">
                            {a.title}
                          </h3>
                          <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-2xs uppercase tracking-mini tabular-nums">
                            <time dateTime={a.publishedAt}>
                              {fmt.format(date)}
                            </time>
                            {a.readMinutes ? (
                              <>
                                <span aria-hidden className="opacity-50">
                                  ·
                                </span>
                                <span>{a.readMinutes} min read</span>
                              </>
                            ) : null}
                            {a.categories[0] ? (
                              <>
                                <span aria-hidden className="opacity-50">
                                  ·
                                </span>
                                <span className="border-border/60 bg-background/40 inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs uppercase tracking-mini">
                                  {a.categories[0]}
                                </span>
                              </>
                            ) : null}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <Link
              href={medium.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="border-border/60 bg-background/30 text-foreground hover:bg-background/60 mt-auto inline-flex items-center justify-center gap-2 border-t px-4 py-3 text-sm font-medium transition-colors duration-200"
            >
              <MediumIcon className="size-4 opacity-85" aria-hidden="true" />
              Read all on Medium
              <ArrowUpRight className="size-4 opacity-85" aria-hidden="true" />
            </Link>
          </Tile>
        ) : null}

        {/* Guiding principles */}
        <Tile span="col-span-6 md:col-span-3" padded={false}>
          <header className="border-border/60 flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-2">
              <ScrollText
                className="text-foreground size-4 opacity-85"
                aria-hidden="true"
              />
              <h2 className="text-foreground text-sm font-medium tracking-tight">
                Guiding principles
              </h2>
              <span className="border-border/70 bg-background/40 text-muted-foreground ml-1 inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini tabular-nums">
                {principles.length}
              </span>
            </div>
          </header>

          <div
            className="scrollbar-thin min-h-0 max-h-[22rem] flex-1 overflow-y-auto py-5 sm:py-6"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0, black 7%, black 93%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, black 7%, black 93%, transparent 100%)",
            }}
          >
            <ol className="space-y-4">
              {Object.entries(
                principles.reduce<Record<string, { text: string; index: number }[]>>(
                  (acc, p, i) => {
                    (acc[p.group] ??= []).push({ text: p.text, index: i });
                    return acc;
                  },
                  {},
                ),
              ).map(([groupName, items]) => (
                <li key={groupName}>
                  <p className="text-muted-foreground/70 px-6 pb-1 font-mono text-2xs font-semibold uppercase tracking-mini">
                    {groupName}
                  </p>
                  <ul className="space-y-0.5">
                    {items.map(({ text, index }) => (
                      <li
                        key={text}
                        className="hover:bg-foreground/5 flex items-baseline gap-3 px-6 py-1.5 transition-colors duration-200"
                      >
                        <span className="text-muted-foreground/45 w-6 shrink-0 text-[10px] font-medium tabular-nums tracking-wider">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-foreground/90 text-[13px] leading-snug first-letter:uppercase">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </Tile>

        {/* Listening */}
        <Tile span="col-span-6 md:col-span-3">
          <TileHeader icon={Headphones} title="Listening to" />
          <ListeningTile />
        </Tile>

        {/* Reading */}
        <Tile span="col-span-6 md:col-span-3">
          <TileHeader icon={BookOpen} title="Reading" />
          <ul className="divide-border/70 -mx-5 flex-1 divide-y sm:-mx-6">
            {reading.map((book) => (
              <li
                key={book.title}
                className="flex items-baseline justify-between gap-3 px-6 py-2 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground flex items-center gap-1.5 truncate text-sm font-medium">
                    {book.isActive ? (
                      <span
                        aria-hidden
                        className="relative inline-flex size-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400"
                      >
                        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/60 dark:bg-emerald-400/60" />
                      </span>
                    ) : null}
                    <span className="truncate">{book.title}</span>
                  </p>
                  <p className="text-muted-foreground truncate font-mono text-2xs uppercase tracking-mini">
                    {book.author}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-mono text-2xs uppercase tracking-mini ${
                    book.isActive
                      ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 inline-flex items-center rounded-full border px-2 py-0.5 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {book.note}
                </span>
              </li>
            ))}
          </ul>
        </Tile>


      </div>
    </div>
  );
}
