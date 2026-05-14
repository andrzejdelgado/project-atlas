import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Person = {
  name: string;
  role: string;
  href: string;
  photo: string;
};

const PEOPLE: Person[] = [
  {
    name: "JB Brown",
    role: "VP of Engineering",
    href: "https://www.linkedin.com/in/jbbrown1",
    photo: "/credits/ui-crux/jbb.jpeg",
  },
  {
    name: "Malo Marrec",
    role: "Software Engineer",
    href: "https://www.linkedin.com/in/malo-marrec/",
    photo: "/credits/ui-crux/mm.jpeg",
  },
];

export function UicruxCredits() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {PEOPLE.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noreferrer noopener"
          className="group border-border/60 bg-card/40 hover:border-foreground/20 hover:bg-card/60 flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors duration-200"
        >
          <span
            aria-hidden="true"
            className="border-border bg-secondary/40 relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border"
          >
            <Image
              src={p.photo}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-semibold tracking-tight">
              {p.name}
            </p>
            <p className="text-muted-foreground/80 truncate font-mono text-2xs uppercase tracking-mini">
              {p.role}
            </p>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="text-muted-foreground/30 group-hover:text-foreground size-4 shrink-0 transition-colors"
          />
        </a>
      ))}
    </div>
  );
}
