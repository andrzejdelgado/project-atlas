import fs from "node:fs";
import path from "node:path";

// Single source of truth for the Atlas chat assistant. Edits go in
// public/andrzej-delgado-context.md — that file is also publicly served at
// /andrzej-delgado-context.md so visiting LLMs (and humans) can fetch it.
const CONTEXT_PATH = path.join(
  process.cwd(),
  "public",
  "andrzej-delgado-context.md",
);

export const ATLAS_BRIEF = fs.readFileSync(CONTEXT_PATH, "utf-8");
