import * as React from "react";

type Element = {
  name: string;
  visual: React.ReactNode;
};

function ButtonGlyph() {
  return (
    <span className="bg-foreground text-background rounded-md px-2.5 py-1 text-[10px] font-medium tracking-tight">
      Action
    </span>
  );
}

function CheckboxGlyph() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="border-foreground/70 bg-foreground/15 grid size-3.5 place-items-center rounded-[3px] border">
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="text-foreground size-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6.5 5 9.5l5-7" />
        </svg>
      </span>
      <span className="bg-muted-foreground/30 h-1 w-8 rounded-full" />
    </div>
  );
}

function ToggleGlyph() {
  return (
    <span className="bg-foreground/80 inline-flex h-3.5 w-7 items-center rounded-full px-0.5">
      <span className="bg-background size-2.5 translate-x-3 rounded-full" />
    </span>
  );
}

function InputGlyph() {
  return (
    <span className="border-border/80 bg-muted/40 inline-flex h-5 w-14 items-center rounded-md border px-1.5">
      <span className="bg-foreground/60 h-2 w-1 animate-pulse" />
    </span>
  );
}

function RadioGlyph() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="border-foreground/70 grid size-3.5 place-items-center rounded-full border-2">
        <span className="bg-foreground size-1.5 rounded-full" />
      </span>
      <span className="bg-muted-foreground/30 h-1 w-8 rounded-full" />
    </div>
  );
}

function BadgeGlyph() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="bg-foreground/80 size-3.5 rounded-md" />
      <span className="bg-foreground absolute -translate-x-2 -translate-y-2 grid size-3.5 place-items-center rounded-full text-[8px] text-background font-bold">
        3
      </span>
    </div>
  );
}

function AvatarGlyph() {
  return (
    <span
      aria-hidden="true"
      className="grid size-7 place-items-center rounded-full text-[9px] font-semibold tracking-tight"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.7 0.18 75), oklch(0.6 0.2 30))",
        color: "white",
      }}
    >
      AD
    </span>
  );
}

function TagGlyph() {
  return (
    <span className="border-border bg-muted/60 text-foreground/80 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px]">
      label
      <svg
        viewBox="0 0 12 12"
        aria-hidden="true"
        className="size-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M3 3l6 6M9 3l-6 6" />
      </svg>
    </span>
  );
}

function ProgressGlyph() {
  return (
    <span className="bg-muted block h-1.5 w-14 overflow-hidden rounded-full">
      <span className="bg-foreground block h-full w-2/3 rounded-full" />
    </span>
  );
}

function SliderGlyph() {
  return (
    <span className="relative flex w-14 items-center">
      <span className="bg-muted h-0.5 w-full rounded-full" />
      <span className="bg-foreground absolute size-2.5 translate-x-7 rounded-full" />
    </span>
  );
}

function TabsGlyph() {
  return (
    <div className="border-border/60 flex gap-2 border-b pb-1">
      <span className="border-foreground -mb-[5px] border-b text-[9px] font-medium pb-1">
        One
      </span>
      <span className="text-muted-foreground/70 text-[9px]">Two</span>
      <span className="text-muted-foreground/70 text-[9px]">Three</span>
    </div>
  );
}

function TooltipGlyph() {
  return (
    <div className="relative">
      <span className="bg-foreground/90 text-background block rounded-md px-1.5 py-0.5 text-[9px]">
        hint
      </span>
      <span className="bg-foreground/90 absolute left-1/2 top-full size-1.5 -translate-x-1/2 -translate-y-0.5 rotate-45" />
    </div>
  );
}

function CardGlyph() {
  return (
    <div className="border-border bg-muted/30 flex h-7 w-12 flex-col gap-1 rounded-md border p-1">
      <span className="bg-muted-foreground/40 h-1 w-3/4 rounded-full" />
      <span className="bg-muted-foreground/30 h-1 w-1/2 rounded-full" />
    </div>
  );
}

function BreadcrumbsGlyph() {
  return (
    <div className="text-muted-foreground/80 flex items-center gap-1 text-[9px]">
      <span>home</span>
      <span className="text-muted-foreground/40">/</span>
      <span>work</span>
      <span className="text-muted-foreground/40">/</span>
      <span className="text-foreground">page</span>
    </div>
  );
}

function AccordionGlyph() {
  return (
    <div className="border-border/60 flex w-14 flex-col rounded border">
      <span className="border-border/60 flex items-center justify-between border-b px-1 py-0.5 text-[8px]">
        <span>Open</span>
        <span>−</span>
      </span>
      <span className="border-border/60 flex items-center justify-between border-b px-1 py-0.5 text-[8px]">
        <span>Item</span>
        <span>+</span>
      </span>
      <span className="flex items-center justify-between px-1 py-0.5 text-[8px]">
        <span>Item</span>
        <span>+</span>
      </span>
    </div>
  );
}

function SpinnerGlyph() {
  return (
    <span
      aria-hidden="true"
      className="border-muted-foreground/30 border-t-foreground inline-block size-4 animate-spin rounded-full border-2"
    />
  );
}

const ELEMENTS: Element[] = [
  { name: "Button", visual: <ButtonGlyph /> },
  { name: "Checkbox", visual: <CheckboxGlyph /> },
  { name: "Toggle", visual: <ToggleGlyph /> },
  { name: "Input Field", visual: <InputGlyph /> },
  { name: "Radio", visual: <RadioGlyph /> },
  { name: "Avatar", visual: <AvatarGlyph /> },
  { name: "Badge", visual: <BadgeGlyph /> },
  { name: "Tag", visual: <TagGlyph /> },
  { name: "Progress Bar", visual: <ProgressGlyph /> },
  { name: "Range Slider", visual: <SliderGlyph /> },
  { name: "Tab", visual: <TabsGlyph /> },
  { name: "Tooltip", visual: <TooltipGlyph /> },
  { name: "Card", visual: <CardGlyph /> },
  { name: "Breadcrumbs", visual: <BreadcrumbsGlyph /> },
  { name: "Accordion", visual: <AccordionGlyph /> },
  { name: "Spinner", visual: <SpinnerGlyph /> },
];

export function ElementsCatalogDemo() {
  return (
    <figure className="mt-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ELEMENTS.map(({ name, visual }) => (
          <div
            key={name}
            className="border-border bg-card/40 hover:bg-card flex flex-col items-center justify-between gap-3 rounded-xl border p-4 transition-colors duration-200"
          >
            <div className="flex h-10 items-center justify-center">
              {visual}
            </div>
            <p className="text-muted-foreground text-[11px] tracking-wide">
              {name}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="text-muted-foreground/70 mt-4 text-center text-xs">
        16 of 39 elements catalogued in the live platform.
      </figcaption>
    </figure>
  );
}
