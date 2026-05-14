import Image from "next/image";
import { ArrowUpRight, User } from "lucide-react";

type Person = {
  name: string;
  role: string;
  href: string;
  photo?: string;
};

const PEOPLE: Person[] = [
  {
    name: "Mindaugas Grigas",
    role: "Design Manager",
    href: "https://www.linkedin.com/in/mindaugas-grigas-78648636",
    photo: "/credits/feelsfast/mg.jpeg",
  },
  {
    name: "Martynas Strabeika",
    role: "Design Director",
    href: "https://www.linkedin.com/in/martynas-strabeika",
    photo: "/credits/feelsfast/ms.jpeg",
  },
  {
    name: "Simona Zukauskaite",
    role: "Design Production Lead",
    href: "https://www.linkedin.com/in/simonazukauskaite",
    photo: "/credits/feelsfast/sz.jpeg",
  },
  {
    name: "Jonathan Fernandez",
    role: "Product Owner",
    href: "https://www.linkedin.com/in/jonathan-fernandez-9778403b",
    photo: "/credits/feelsfast/jf.jpeg",
  },
  {
    name: "Gianluca Cirone",
    role: "Senior Engineer",
    href: "https://www.linkedin.com/in/gianlucacirone",
    photo: "/credits/feelsfast/gc.jpeg",
  },
  {
    name: "Jesus Garcia Aguayo",
    role: "Senior Architect",
    href: "https://www.linkedin.com/in/jesus-garcia-aguayo",
  },
];

export function Credits() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
            {p.photo ? (
              <Image
                src={p.photo}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <User
                className="text-muted-foreground/70 size-5"
                aria-hidden="true"
              />
            )}
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
