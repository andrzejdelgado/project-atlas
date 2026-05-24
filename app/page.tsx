import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Download,
  MessageSquare,
  Rocket,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import {
  CASE_STUDY_BRAND_ASSETS,
  PROJECT_BRAND_ASSETS,
} from "@/lib/project-brand-assets";
import { MalagaWeather } from "@/components/malaga-weather";
import { LinkedinIcon, MediumIcon } from "@/components/brand-icons";
import { getAllCaseStudies, getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { mentorship, live, skills } from "@/lib/dashboard";
import { getAdpListStats } from "@/lib/adplist";
import { getMediumArticles } from "@/lib/medium";
import { cn } from "@/lib/utils";

const upcomingFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const EVENT_FAVICONS: Record<string, { src: string; className: string }> = {
  "rsvp.withgoogle.com": {
    src: "/events/google.png",
    className: "size-6",
  },
  "producthive.pl": {
    src: "/events/producthive.png",
    className: "size-6 rounded-md",
  },
  "www.intodesignsystems.com": {
    src: "/events/intodesignsystems.jpg",
    className: "size-6 rounded-md",
  },
  "www.spaceappschallenge.org": {
    src: "/events/nasa.png",
    className: "size-6",
  },
};

function getEventFavicon(
  href: string,
): { src: string; className: string } | null {
  try {
    return EVENT_FAVICONS[new URL(href).hostname] ?? null;
  } catch {
    return null;
  }
}

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});


type WorkItem = {
  kind: "project" | "case-study";
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  year: number;
  brandAsset?: { src: string; className: string };
  tint?: string;
  mark?: string;
};

const CASE_STUDY_TINTS = [
  "290 80% 65%",
  "30 95% 60%",
  "165 60% 55%",
  "10 85% 65%",
];

// Career timeline, sorted by start date desc. Date labels are pre-formatted
// for display (the section uses font-mono uppercase); `dateRange` carries
// the ISO-ish slash form for the <time> element's machine-readable
// `dateTime` attribute.
const EXPERIENCES: Array<{
  dateLabel: string;
  dateRange: string;
  title: string;
  company: string;
  logo: string;
  /** When true, render the logo on a disc inside the icon-plate instead
   *  of directly on the plate's tinted surface. Pair with `discColor` to
   *  pick the disc background (defaults to white). */
  whiteDisc?: boolean;
  /** CSS color string for the inner disc. Defaults to white. */
  discColor?: string;
  /** Extra className applied to the logo <Image> — used for per-mark
   *  border-radius tweaks (e.g. round a circular logo). */
  logoClassName?: string;
}> = [
  {
    dateLabel: "2023 — Now",
    dateRange: "2023/",
    title: "Principal Product Designer",
    company: "The Workshop",
    logo: "/images/logos/the-workshop.png",
    whiteDisc: true,
    discColor: "#029bc7",
  },
  {
    dateLabel: "2021 — 2023",
    dateRange: "2021/2023",
    title: "Senior Product Designer",
    company: "The Workshop",
    logo: "/images/logos/the-workshop.png",
    whiteDisc: true,
    discColor: "#029bc7",
  },
  {
    dateLabel: "2020 — 2021",
    dateRange: "2020/2021",
    title: "Product Designer",
    company: "The Workshop",
    logo: "/images/logos/the-workshop.png",
    whiteDisc: true,
    discColor: "#029bc7",
  },
  {
    dateLabel: "2018 — 2020",
    dateRange: "2018/2020",
    title: "Senior UX/UI Designer",
    company: "Clusterone",
    logo: "/images/logos/clusterone.png",
    logoClassName: "rounded-full",
  },
  {
    dateLabel: "2017 — 2018",
    dateRange: "2017/2018",
    title: "UX/UI Designer",
    company: "Good AI Lab",
    logo: "/images/logos/good-ai-lab.png",
    logoClassName: "rounded-[8px]",
  },
  {
    dateLabel: "2009 — 2017",
    dateRange: "2009/2017",
    title: "Founder & CEO",
    company: "Delgado Design",
    logo: "/images/logos/delgado-design.png",
    whiteDisc: true,
    discColor: "#212024",
  },
];

// Explicit homepage metadata so the root URL ships a strong canonical title
// and description instead of inheriting the layout fallback. The title
// template (%s — Andrzej Delgado) only applies to non-default titles, so
// we use `absolute` to land exactly the string we want in <title>.
export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.author}: ${siteConfig.tagline.replace(/\.$/, "")}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.author}: ${siteConfig.tagline.replace(/\.$/, "")}`,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.author}: ${siteConfig.tagline.replace(/\.$/, "")}`,
    description: siteConfig.description,
  },
};

export default async function Home() {
  const allProjects = getAllProjects();
  const allCaseStudies = getAllCaseStudies();
  const adp = await getAdpListStats();
  const medium = await getMediumArticles(3);
  const reviewCount = adp?.reviewCount ?? null;
  const averageRating =
    typeof adp?.averageRating === "number"
      ? adp.averageRating.toFixed(2).replace(/\.?0+$/, "")
      : mentorship.rating;

  const projectsAsWork: WorkItem[] = allProjects.map((p) => ({
    kind: "project",
    slug: p.slug,
    href: `/projects/${p.slug}`,
    title: p.frontmatter.title,
    description: p.frontmatter.cta ?? p.frontmatter.description ?? "",
    date: p.frontmatter.date,
    year: new Date(p.frontmatter.date).getFullYear(),
    brandAsset: PROJECT_BRAND_ASSETS[p.slug],
  }));

  const caseStudiesAsWork: WorkItem[] = allCaseStudies.map((c, i) => {
    const titleWords = c.frontmatter.title
      .split(/\s+/)
      .filter((w) => !/^(the|a|an)$/i.test(w));
    const fallbackMark = (
      c.frontmatter.mark ??
      (titleWords[0] ?? c.frontmatter.title)[0]
    ).toUpperCase();
    return {
      kind: "case-study",
      slug: c.slug,
      href: `/case-studies/${c.slug}`,
      title: c.frontmatter.title,
      description: c.frontmatter.cta ?? c.frontmatter.description ?? "",
      date: c.frontmatter.date,
      year: new Date(c.frontmatter.date).getFullYear(),
      mark: fallbackMark,
      tint: CASE_STUDY_TINTS[i % CASE_STUDY_TINTS.length],
      brandAsset: CASE_STUDY_BRAND_ASSETS[c.slug],
    };
  });

  const mergedWork = [...projectsAsWork, ...caseStudiesAsWork].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const mentoringStats = [
    {
      icon: Rocket,
      dot: "bg-blue-500 dark:bg-blue-400",
      value: mentorship.community.totalMentoringMinutes.toLocaleString(),
      unit: "mins",
      label: "Total mentoring time",
    },
    {
      icon: Sparkles,
      dot: "bg-red-500 dark:bg-red-400",
      value: mentorship.community.sessionsCompleted.toString(),
      label: "Sessions completed",
    },
    {
      icon: CalendarCheck,
      dot: "bg-emerald-500 dark:bg-emerald-400",
      value: `${mentorship.community.averageAttendance}%`,
      label: "Average attendance",
    },
    {
      icon: MessageSquare,
      dot: "bg-cyan-500 dark:bg-cyan-400",
      value: reviewCount !== null ? reviewCount.toString() : "—",
      label: `Reviews on ${mentorship.platform}`,
    },
    {
      icon: Star,
      dot: "bg-amber-500 dark:bg-amber-400",
      value: averageRating,
      unit: "/ 5",
      label: "Average rating",
    },
    {
      icon: Award,
      dot: "bg-violet-500 dark:bg-violet-400",
      value: "5",
      unit: "times",
      label: "Top 50 Mentor",
    },
  ];

  const sortedEvents = [...live.events].sort(
    (a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime(),
  );

  return (
    <div className="mx-auto w-full max-w-5xl py-6 sm:py-8 lg:py-10">
      {/* Single column area: hero + projects + mentoring + events */}
      <div className="mx-auto max-w-[840px]">
        {/* Hero */}
        <header className="pt-12 pb-9 sm:pt-20 sm:pb-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <span className="relative block size-30 shrink-0">
              <span
                aria-hidden="true"
                className="bg-border absolute inset-0"
                style={{
                  WebkitMaskImage: "url(/avatar-masks/avatar-mask-1.svg)",
                  maskImage: "url(/avatar-masks/avatar-mask-1.svg)",
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
              <span
                className="absolute inset-[1px]"
                style={{
                  WebkitMaskImage: "url(/avatar-masks/avatar-mask-1.svg)",
                  maskImage: "url(/avatar-masks/avatar-mask-1.svg)",
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              >
                <Image
                  src="/andrzejdelgado.webp"
                  alt={siteConfig.author}
                  fill
                  sizes="120px"
                  priority
                  className="object-cover"
                />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {siteConfig.author}
              </h1>
              <p className="text-muted-foreground mt-1.5 font-mono text-2xs uppercase">
                {siteConfig.tagline.replace(/\.$/, "")}
              </p>
            </div>
          </div>
          <p className="text-foreground/85 mt-6 max-w-[60ch] text-base leading-relaxed sm:mt-8">
            {siteConfig.intro}
          </p>
        </header>

        {/* Projects (merged with case studies) */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">
            Projects
          </h2>
          <ol className="mt-4 flex list-none flex-col p-0">
            {mergedWork.map((item, i) => (
              <li
                key={`${item.kind}:${item.slug}`}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDuration: "300ms",
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: "both",
                }}
              >
                <Link
                  href={item.href}
                  className="group hover:border-border hover:bg-card -mx-3 flex items-center gap-3 rounded-2xl border border-transparent px-3 py-4 transition-[border-color,background-color] duration-200 sm:-mx-4 sm:gap-6 sm:px-4"
                >
                  <span
                    aria-hidden
                    className="text-muted-foreground/55 hidden font-mono text-2xs uppercase tracking-mini tabular-nums sm:inline sm:w-8 sm:shrink-0"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.brandAsset ? (
                    <span
                      aria-hidden
                      className="border-border/60 bg-secondary/60 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={item.brandAsset.src}
                        alt=""
                        width={32}
                        height={32}
                        aria-hidden="true"
                        className={item.brandAsset.className}
                      />
                    </span>
                  ) : item.kind === "case-study" ? (
                    <span
                      aria-hidden
                      className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 group-hover:scale-[1.04]"
                      style={{
                        backgroundColor: `hsl(${item.tint} / 0.08)`,
                        borderColor: `hsl(${item.tint} / 0.28)`,
                        color: `hsl(${item.tint})`,
                      }}
                    >
                      <span className="text-[12px] font-bold tracking-tight">
                        {item.mark}
                      </span>
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h3 className="flex flex-wrap items-center gap-2 text-base font-medium tracking-tight sm:text-lg">
                      <span className="truncate">{item.title}</span>
                      {item.kind === "case-study" ? (
                        <span className="border-border/70 bg-background/40 text-muted-foreground inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase tracking-mini">
                          Case study
                        </span>
                      ) : null}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 font-mono text-2xs uppercase tracking-mini">
                      {item.description}
                    </p>
                  </div>
                  <time
                    dateTime={item.date}
                    className="text-muted-foreground hidden text-xs tabular-nums sm:block sm:shrink-0"
                  >
                    {item.year}
                  </time>
                  <ArrowRight
                    aria-hidden
                    className="text-muted-foreground/30 group-hover:text-foreground size-4 shrink-0 transition-colors duration-200"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Experience */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Experience
          </h2>
          <ol className="mt-4 flex list-none flex-col p-0">
            {EXPERIENCES.map((exp, i) => (
              <li
                key={`${exp.title}@${exp.company}`}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDuration: "300ms",
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="-mx-3 flex items-center gap-3 rounded-2xl border border-transparent px-3 py-4 sm:-mx-4 sm:gap-6 sm:px-4">
                  <span
                    aria-hidden
                    className="text-muted-foreground/55 hidden font-mono text-2xs uppercase tracking-mini tabular-nums sm:inline sm:w-8 sm:shrink-0"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="border-border/60 bg-secondary/60 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                  >
                    {exp.whiteDisc ? (
                      <span
                        className="flex size-7 items-center justify-center rounded-full"
                        style={{ backgroundColor: exp.discColor ?? "#ffffff" }}
                      >
                        <Image
                          src={exp.logo}
                          alt=""
                          width={18}
                          height={18}
                          aria-hidden="true"
                          className="object-contain"
                        />
                      </span>
                    ) : (
                      <Image
                        src={exp.logo}
                        alt=""
                        width={28}
                        height={28}
                        aria-hidden="true"
                        className={`size-7 object-contain ${exp.logoClassName ?? ""}`}
                      />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium tracking-tight sm:text-lg">
                      {exp.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 font-mono text-2xs uppercase tracking-mini">
                      <span>{exp.company}</span>
                      <span aria-hidden className="mx-1.5 opacity-60 sm:hidden">
                        ·
                      </span>
                      <time
                        dateTime={exp.dateRange}
                        className="sm:hidden"
                      >
                        {exp.dateLabel}
                      </time>
                    </p>
                  </div>
                  <time
                    dateTime={exp.dateRange}
                    className="text-muted-foreground hidden text-xs tabular-nums sm:block sm:shrink-0"
                  >
                    {exp.dateLabel}
                  </time>
                </div>
              </li>
            ))}
          </ol>
          <a
            href="https://www.linkedin.com/in/andrzejdelgado/"
            target="_blank"
            rel="noreferrer"
            className="cta-button mt-6"
          >
            <LinkedinIcon className="size-4 opacity-85" aria-hidden="true" />
            See more on LinkedIn
            <ArrowUpRight className="size-4 opacity-85" aria-hidden="true" />
          </a>
        </section>

        {/* Skills */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          <div className="border-border bg-card/40 mt-4 rounded-2xl border p-5 sm:p-6">
            <div className="space-y-7">
              {skills.map((cat) => (
                <div key={cat.label}>
                  <h3 className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
                    {cat.label}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="border-border/60 bg-secondary/60 text-foreground/90 inline-flex items-center rounded-full border px-3 py-1 text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Writing (Medium) */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Writing
          </h2>
          {medium.articles.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">
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
            </p>
          ) : (
            <ol className="mt-4 flex list-none flex-col p-0">
              {medium.articles.map((a, i) => {
                const date = new Date(a.publishedAt);
                return (
                  <li
                    key={a.url}
                    className="animate-in fade-in slide-in-from-bottom-2"
                    style={{
                      animationDuration: "300ms",
                      animationDelay: `${i * 60}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <Link
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group hover:border-border hover:bg-card -mx-3 flex items-center gap-3 rounded-2xl border border-transparent px-3 py-4 transition-[border-color,background-color] duration-200 sm:-mx-4 sm:gap-6 sm:px-4"
                    >
                      {a.image ? (
                        <span className="border-border/70 relative aspect-square size-14 shrink-0 overflow-hidden rounded-md border sm:size-16">
                          <Image
                            src={a.image}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
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
                        <h3 className="text-foreground truncate text-sm font-medium">
                          {a.title}
                        </h3>
                        <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-2xs uppercase tracking-mini tabular-nums">
                          {a.readMinutes ? (
                            <>
                              <span>{a.readMinutes} min read</span>
                              <span aria-hidden className="opacity-50">
                                ·
                              </span>
                            </>
                          ) : null}
                          <time dateTime={a.publishedAt}>
                            {fmt.format(date)}
                          </time>
                          {a.categories[0] ? (
                            <span className="hidden items-center gap-x-2 sm:inline-flex">
                              <span aria-hidden className="opacity-50">
                                ·
                              </span>
                              <span className="border-border/60 bg-background/40 inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-2xs uppercase tracking-mini">
                                {a.categories[0]}
                              </span>
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <ArrowUpRight
                        aria-hidden
                        className="text-muted-foreground/30 group-hover:text-foreground size-4 shrink-0 transition-colors duration-200"
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
          <a
            href={medium.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="cta-button mt-6"
          >
            <MediumIcon className="size-4 opacity-85" aria-hidden="true" />
            Read all on Medium
            <ArrowUpRight className="size-4 opacity-85" aria-hidden="true" />
          </a>
        </section>

        {/* Mentoring */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Mentoring
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            {mentoringStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-muted-foreground/75 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-mini">
                  <span
                    aria-hidden
                    className={cn("size-1.5 shrink-0 rounded-full", stat.dot)}
                  />
                  <span className="truncate">{stat.label}</span>
                </p>
                <p className="text-foreground mt-1.5 text-xl font-semibold tabular-nums leading-none">
                  {stat.value}
                  {stat.unit ? (
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      {stat.unit}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
          <a
            href="https://adplist.org/mentors/andrzej-delgado"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button mt-6"
          >
            <CalendarPlus className="size-4 opacity-85" aria-hidden />
            Book a session
            <ArrowUpRight className="size-4 opacity-85" aria-hidden />
          </a>
        </section>

        {/* Events */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Events
          </h2>
          <ol className="mt-4 flex list-none flex-col p-0">
            {sortedEvents.map((event) => {
              const date = new Date(event.iso);
              const isPast = date.getTime() < Date.now();
              const favicon = getEventFavicon(event.href);
              return (
                <li key={event.title}>
                  <Link
                    href={event.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "group hover:border-border hover:bg-card -mx-3 flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-[border-color,background-color] duration-200 sm:-mx-4 sm:gap-6 sm:px-4",
                      isPast && "opacity-60",
                    )}
                  >
                    <span
                      aria-hidden
                      className="border-border/60 bg-secondary/60 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                    >
                      {favicon ? (
                        <Image
                          src={favicon.src}
                          alt=""
                          width={24}
                          height={24}
                          aria-hidden="true"
                          className={favicon.className}
                          unoptimized
                        />
                      ) : (
                        <Calendar className="size-4 opacity-85" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">
                        {event.title}
                      </p>
                      <time
                        dateTime={event.iso}
                        className="text-muted-foreground mt-0.5 block font-mono text-2xs uppercase tracking-mini tabular-nums sm:hidden"
                      >
                        {upcomingFmt.format(date)}
                      </time>
                    </div>
                    <time
                      dateTime={event.iso}
                      className="text-muted-foreground hidden font-mono text-2xs uppercase tracking-mini sm:inline sm:shrink-0"
                    >
                      {upcomingFmt.format(date)}
                    </time>
                    <ArrowUpRight
                      aria-hidden
                      className="text-muted-foreground/30 group-hover:text-foreground size-4 shrink-0 transition-colors duration-200"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        {/* About */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
          <div className="border-border bg-card/40 mt-4 rounded-2xl border p-5 sm:p-6">
            <p className="text-foreground/90 text-base leading-relaxed">
              The work is on this page. The person behind it lives on
              the other one. What I&apos;m reading, the music I keep
              coming back to, the principles I work by, and the
              on-going developments taking up my time right now.
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Greater Málaga Metropolitan Area
            </p>
            <div className="mt-2">
              <MalagaWeather />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/about" className="cta-button">
              <UserRound className="size-4 opacity-85" aria-hidden="true" />
              More about me
              <ArrowRight className="size-4 opacity-85" aria-hidden="true" />
            </Link>
            <a
              href="/andrzej-delgado-cv.pdf"
              download="andrzej-delgado-cv.pdf"
              className="cta-button"
            >
              <Download className="size-4 opacity-85" aria-hidden="true" />
              CV
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
