import { defineConfig } from "vitest/config";

// Minimal, scoped Vitest setup. The only logic worth unit-testing in isolation
// is the pure gesture core powering the Hyper-Casino demos; everything else in
// the portfolio is verified visually. Pure functions need no DOM environment.
export default defineConfig({
  test: {
    environment: "node",
    include: ["components/hyper-casino/**/*.test.ts"],
  },
});
