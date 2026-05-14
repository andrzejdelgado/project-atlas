type Props = {
  variant?: "principle" | "chapter";
};

export function PrincipleDivider({ variant = "principle" }: Props) {
  if (variant === "chapter") {
    return (
      <div
        aria-hidden="true"
        className="my-24 flex items-center justify-center gap-3"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="text-muted-foreground/45 block text-xl leading-none select-none"
          >
            ✻
          </span>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="my-20 flex justify-center">
      <span className="text-muted-foreground/40 block text-xl leading-none select-none">
        ✻
      </span>
    </div>
  );
}
