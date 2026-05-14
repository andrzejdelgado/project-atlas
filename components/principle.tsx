import type { ReactNode } from "react";

type Props = {
  id: string;
  index: string;
  category: string;
  title: ReactNode;
  children: ReactNode;
};

export function Principle({ id, index, category, title, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 mt-14 first:mt-10">
      <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase tabular-nums">
        {index} — {category}
      </p>
      <h3 className="mt-2 scroll-m-20 text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
