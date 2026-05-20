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
    name: "Ramón Lence Martínez",
    role: "Principal Software Engineer",
    href: "https://www.linkedin.com/in/ramonlence/",
    photo: "/credits/saturn-heavy/rlm.jpeg",
  },
  {
    name: "Adolfo López Granados",
    role: "Senior Software Engineer",
    href: "https://www.linkedin.com/in/adolfo-l%C3%B3pez-granados-5923413a/",
    photo: "/credits/saturn-heavy/alg.jpeg",
  },
  {
    name: "Pedro Reyes Santiago",
    role: "Senior Software Engineer",
    href: "https://www.linkedin.com/in/pedro-jes%C3%BAs-reyes-santiago-54a199a6/",
    photo: "/credits/saturn-heavy/pps.jpeg",
  },
  {
    name: "Carlos Perez Roca",
    role: "Senior Software Engineer",
    href: "https://www.linkedin.com/in/developercarlosperez/",
    photo: "/credits/saturn-heavy/cpr.png",
  },
  {
    name: "Nicolás Alejandro Papayannis",
    role: "Senior Product Manager",
    href: "https://www.linkedin.com/in/nicolas-a-papayannis/",
    photo: "/credits/saturn-heavy/nap.jpeg",
  },
  {
    name: "Miguel Ruiz Fernández",
    role: "Senior Product Manager",
    href: "https://www.linkedin.com/in/miguelrfz/",
    photo: "/credits/saturn-heavy/mrf.jpeg",
  },
  {
    name: "Roberto Palomar Sáez",
    role: "Senior Product Designer",
    href: "https://www.linkedin.com/in/roberto-palomar-ux/",
    photo: "/credits/saturn-heavy/rps.jpeg",
  },
  {
    name: "Valentina Ventura",
    role: "Product Designer",
    href: "https://www.linkedin.com/in/valentina-ventura-84636432/",
    photo: "/credits/saturn-heavy/vv.jpeg",
  },
];

export function Credits() {
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
