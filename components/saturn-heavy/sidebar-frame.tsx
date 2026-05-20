import * as React from "react";

type Props = {
  concept: string;
  title?: string;
  children?: React.ReactNode;
  /** Slot for one diagram/demo/exhibit. Optional. */
  exhibit?: React.ReactNode;
};

export function SidebarFrame({ title, children, exhibit }: Props) {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <figure className="border-border bg-card/40 relative mt-8 overflow-hidden rounded-2xl border p-6 sm:p-8">
      {title ? (
        <h3 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h3>
      ) : null}
      {hasChildren ? (
        <div className="prose-sidebar text-foreground/85 mt-4 space-y-4 text-sm leading-relaxed">
          {children}
        </div>
      ) : null}
      {exhibit ? (
        title || hasChildren ? (
          <div className="border-border/60 bg-background/40 mt-6 rounded-xl border p-4 sm:p-5">
            {exhibit}
          </div>
        ) : (
          exhibit
        )
      ) : null}
    </figure>
  );
}
