import { cn } from "@/lib/utils";

function SignatureMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 138 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Andrzej Delgado signature"
      className={className}
    >
      <title>Andrzej Delgado signature</title>
      {/* Mostly continuous stroke: a small entry hook, a long sweeping rise to a
         sharp peak, a quick crossover dive forming the A's bar, then a graceful
         cursive trail that ends with a confident upward flick. */}
      <path d="M 4 38 c 1.6 -2.4, 4.6 -1.6, 3 0.6 c -1.2 1.4, -3 0.4, -1.6 -0.8 C 12 32, 30 18, 62 4 L 78 30 C 70 28, 48 22, 24 28 C 30 28, 60 20, 76 22 c 5 1.5, 9 3, 10 8 c 1 -8, 12 -8, 13 4 c 0 -8, 10 -7, 12 0 c 4 -3, 12 -4, 17 1 l 8 -4" />
    </svg>
  );
}

export function SiteSignature({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mt-10 flex justify-center pt-4 sm:mt-12 sm:pt-5",
        className,
      )}
    >
      <SignatureMark className="text-foreground/70 h-10 w-auto" />
    </footer>
  );
}
