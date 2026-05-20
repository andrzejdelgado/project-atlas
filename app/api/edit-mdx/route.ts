// Dev-only endpoint that reads + edits MDX files on local disk.
// Three actions:
//   - lookup: given a rendered text snippet, return the matching raw source
//     segment (so the editor can pre-fill its textarea with raw Markdown).
//   - delete: locate a source segment by rendered text and remove it, then
//     collapse the surrounding blank lines.
//   - save (default): replace `original` with `replacement` in the source file.
// Returns 404 outside of dev so production deployments don't expose it.

import fs from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const CONTENT_ROOT = path.join(process.cwd(), "content");

type SaveBody = {
  action?: "save";
  path: string;
  original: string;
  replacement: string;
  /** Zero-based index of the occurrence to replace when the source text
   *  appears more than once. Defaults to 0 (first match). */
  occurrence?: number;
};

type LookupBody = {
  action: "lookup";
  path: string;
  rendered: string;
};

type DeleteBody = {
  action: "delete";
  path: string;
  rendered: string;
};

type RestoreBody = {
  action: "restore";
  path: string;
  source: string;
};

type InsertBody = {
  action: "insert";
  path: string;
  rendered: string;
  content: string;
  position?: "after" | "before";
};

type Body =
  | SaveBody
  | LookupBody
  | DeleteBody
  | RestoreBody
  | InsertBody;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildWhitespaceTolerantPattern(text: string): RegExp {
  const escaped = escapeRegExp(text).replace(/\s+/g, "\\s+");
  return new RegExp(escaped, "g");
}

// Filter pattern matches down to those that sit at line boundaries — i.e.
// preceded and followed by a newline (or file edge), allowing only
// horizontal whitespace on the line around the match. List items are
// allowed as a special case: the segment returned by `findSourceSegment`
// strategy 4b is the prose after the bullet, so the chars between the
// previous newline and the match may also be a list marker (`*`/`+`/`-`/
// `<digits>.`). This rejects substring hits inside other words.
function findBlockBoundedMatches(
  source: string,
  segment: string,
): RegExpMatchArray[] {
  const pattern = buildWhitespaceTolerantPattern(segment);
  return Array.from(source.matchAll(pattern)).filter((m) => {
    if (m.index === undefined) return false;
    const start = m.index;
    const end = start + m[0].length;
    let i = start - 1;
    while (i >= 0 && (source[i] === " " || source[i] === "\t")) i--;
    if (i >= 0 && source[i] !== "\n") {
      let lineStart = i + 1;
      while (lineStart > 0 && source[lineStart - 1] !== "\n") lineStart--;
      const prefix = source.slice(lineStart, i + 1);
      if (!/^[ \t]*(?:[*+-]|\d+\.)[ \t]*$/.test(prefix)) return false;
    }
    let j = end;
    while (j < source.length && (source[j] === " " || source[j] === "\t")) j++;
    if (j < source.length && source[j] !== "\n") return false;
    return true;
  });
}

function decodeEntities(s: string): string {
  return s
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Reduce a source segment to its approximate rendered form so we can compare
// against textContent from the DOM. Strips Markdown markers, basic inline
// JSX/HTML, and HTML entities; collapses whitespace.
function renderSource(s: string): string {
  return decodeEntities(s)
    .replace(/<\/?(em|strong|i|b|code|span)[^>]*>/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
}

function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function unescapeYamlDouble(s: string): string {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
}

function findSourceSegment(
  source: string,
  rendered: string,
): string | null {
  const target = normalize(rendered);
  if (!target) return null;

  // 1. Frontmatter scalar values (`key: "value"` between the `---` fences).
  //    Only quoted values, only single-line. Returns the raw value.
  const fmMatch = source.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    for (const m of fm.matchAll(
      /^[ \t]*(\w[\w-]*):[ \t]*"((?:[^"\\]|\\.)*)"[ \t]*$/gm,
    )) {
      const raw = unescapeYamlDouble(m[2]);
      if (normalize(renderSource(raw)) === target) return raw;
    }
  }

  // 2. Headings (`<h1..6 ...>text</h1..6>`).
  for (const m of source.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
    if (normalize(renderSource(m[1])) === target) return m[1];
  }

  // 3. `title="..."` prop on JSX (e.g. SidebarFrame).
  for (const m of source.matchAll(/\btitle="([^"]*)"/g)) {
    if (normalize(renderSource(m[1])) === target) return m[1];
  }

  // 4. TL;DR list items: text inside `<li>` up to the `<div className="tldr-tags">`.
  for (const m of source.matchAll(
    /<li>([\s\S]*?)<div className="tldr-tags">/g,
  )) {
    if (normalize(renderSource(m[1])) === target) {
      // Trim leading/trailing whitespace on the captured prose so editing is
      // clean; the surrounding whitespace gets preserved by the save regex.
      return m[1].replace(/^\s+|\s+$/g, "");
    }
  }

  // 4b. Markdown list items (unordered `* - +`, ordered `1.`). Returns just
  //     the item content so editing operates on prose; the bullet marker
  //     stays put. Single-line items only — multi-line indented items would
  //     fall through to strategy 5 or 6.
  for (const line of source.split("\n")) {
    const m = line.match(/^[ \t]*(?:[*+-]|\d+\.)\s+(.+)$/);
    if (!m) continue;
    if (normalize(renderSource(m[1])) === target) return m[1];
  }

  // 5. Markdown paragraph blocks separated by blank lines. Skip blocks that
  //    look like JSX (start with `<`).
  const blocks = source.split(/\n\n+/);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith("<")) continue;
    if (normalize(renderSource(trimmed)) === target) return trimmed;
  }

  // 6. Prose paragraphs inside JSX wrappers (e.g. <SidebarFrame> body).
  //    Walk lines and group consecutive non-JSX-only lines into candidate
  //    paragraphs.
  const lines = source.split("\n");
  let buf: string[] = [];
  const flush = (): string | null => {
    if (buf.length === 0) return null;
    const joined = buf.join("\n").trim();
    buf = [];
    if (!joined || joined.startsWith("<")) return null;
    return normalize(renderSource(joined)) === target ? joined : null;
  };
  for (const line of lines) {
    const t = line.trim();
    const looksJsx = t.startsWith("<") || t.startsWith("import ");
    const looksList = /^[ \t]*(?:[*+-]|\d+\.)\s+/.test(line);
    if (!t || looksJsx || looksList) {
      const hit = flush();
      if (hit) return hit;
    } else {
      buf.push(line);
    }
  }
  const hit = flush();
  if (hit) return hit;

  return null;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  if (!body || typeof body.path !== "string" || !body.path.endsWith(".mdx")) {
    return new NextResponse("Missing or invalid .mdx path", { status: 400 });
  }

  // Resolve and confirm the path stays inside content/.
  const filePath = path.resolve(path.join(CONTENT_ROOT, body.path));
  if (!filePath.startsWith(CONTENT_ROOT + path.sep)) {
    return new NextResponse("Path escapes content root", { status: 400 });
  }

  let source: string;
  try {
    source = await fs.readFile(filePath, "utf-8");
  } catch (err) {
    return new NextResponse(
      `Cannot read ${body.path}: ${
        err instanceof Error ? err.message : "unknown"
      }`,
      { status: 404 },
    );
  }

  if (body.action === "lookup") {
    if (typeof body.rendered !== "string" || body.rendered.trim() === "") {
      return new NextResponse("rendered text is empty", { status: 400 });
    }
    const found = findSourceSegment(source, body.rendered);
    if (!found) {
      return new NextResponse("No matching source segment found.", {
        status: 404,
      });
    }
    return NextResponse.json({ source: found });
  }

  if (body.action === "delete") {
    if (typeof body.rendered !== "string" || body.rendered.trim() === "") {
      return new NextResponse("rendered text is empty", { status: 400 });
    }
    const found = findSourceSegment(source, body.rendered);
    if (!found) {
      return new NextResponse("No matching source segment found.", {
        status: 404,
      });
    }

    const delMatches = findBlockBoundedMatches(source, found);
    if (delMatches.length === 0) {
      return new NextResponse(
        "Original text not found in source as a standalone block.",
        { status: 404 },
      );
    }
    if (delMatches.length > 1) {
      return new NextResponse(
        `Original text appears ${delMatches.length} times in source — too ambiguous to delete safely.`,
        { status: 409 },
      );
    }

    const delTarget = delMatches[0];
    const delStart = delTarget.index!;
    const delEnd = delStart + delTarget[0].length;
    let nextSource = source.slice(0, delStart) + source.slice(delEnd);
    // Collapse 3+ consecutive newlines down to a single blank line.
    nextSource = nextSource.replace(/\n{3,}/g, "\n\n");
    // Trim accidental leading blank lines.
    nextSource = nextSource.replace(/^\n+/, "");
    if (!nextSource.endsWith("\n")) nextSource += "\n";

    try {
      await fs.writeFile(filePath, nextSource, "utf-8");
    } catch (err) {
      return new NextResponse(
        `Cannot write ${body.path}: ${
          err instanceof Error ? err.message : "unknown"
        }`,
        { status: 500 },
      );
    }

    // Return the pre-delete source so the client can offer an undo.
    return NextResponse.json({ ok: true, path: body.path, prevSource: source });
  }

  if (body.action === "restore") {
    if (typeof body.source !== "string") {
      return new NextResponse("Missing source for restore", { status: 400 });
    }
    try {
      await fs.writeFile(filePath, body.source, "utf-8");
    } catch (err) {
      return new NextResponse(
        `Cannot write ${body.path}: ${
          err instanceof Error ? err.message : "unknown"
        }`,
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, path: body.path });
  }

  if (body.action === "insert") {
    if (typeof body.rendered !== "string" || body.rendered.trim() === "") {
      return new NextResponse("rendered text is empty", { status: 400 });
    }
    if (typeof body.content !== "string" || body.content.trim() === "") {
      return new NextResponse("content is empty", { status: 400 });
    }
    const found = findSourceSegment(source, body.rendered);
    if (!found) {
      return new NextResponse("No matching source segment found.", {
        status: 404,
      });
    }
    const insMatches = findBlockBoundedMatches(source, found);
    if (insMatches.length === 0) {
      return new NextResponse(
        "Reference text not found in source as a standalone block.",
        { status: 404 },
      );
    }
    if (insMatches.length > 1) {
      return new NextResponse(
        `Reference text appears ${insMatches.length} times in source — too ambiguous to insert safely.`,
        { status: 409 },
      );
    }

    // Keep each inserted paragraph unique in the file so subsequent edits/
    // inserts can disambiguate it from its siblings. If the content already
    // exists, append a numeric suffix until we find one that doesn't.
    let uniqueContent = body.content;
    if (source.includes(uniqueContent)) {
      const base = uniqueContent.replace(/\.\s*$/, "");
      let n = 2;
      while (source.includes(`${base} ${n}.`)) n++;
      uniqueContent = `${base} ${n}.`;
    }

    const insTarget = insMatches[0];
    const insStart = insTarget.index!;
    const insEnd = insStart + insTarget[0].length;
    const insMatchText = insTarget[0];
    const position = body.position ?? "after";
    const replacement =
      position === "before"
        ? `${uniqueContent}\n\n${insMatchText}`
        : `${insMatchText}\n\n${uniqueContent}`;
    const nextSource =
      source.slice(0, insStart) + replacement + source.slice(insEnd);

    try {
      await fs.writeFile(filePath, nextSource, "utf-8");
    } catch (err) {
      return new NextResponse(
        `Cannot write ${body.path}: ${
          err instanceof Error ? err.message : "unknown"
        }`,
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, path: body.path });
  }

  // Default: save.
  const saveBody = body as SaveBody;
  if (
    typeof saveBody.original !== "string" ||
    typeof saveBody.replacement !== "string"
  ) {
    return new NextResponse("Missing original/replacement", { status: 400 });
  }
  if (saveBody.original.trim() === "") {
    return new NextResponse("Original text is empty", { status: 400 });
  }

  const matches = findBlockBoundedMatches(source, saveBody.original);
  if (matches.length === 0) {
    return new NextResponse(
      "Original text not found in source as a standalone block. The paragraph may contain Markdown (bold, italic, links) that doesn't match its rendered version.",
      { status: 404 },
    );
  }

  // Pick which occurrence to replace. If the client provided a 0-based index
  // (DOM-position-based when multiple paragraphs share the same source), use
  // it; otherwise replace the first match. Clamp out-of-range indices to the
  // last match so a stale index can't 500.
  const requested = saveBody.occurrence ?? 0;
  const idx = Math.max(0, Math.min(matches.length - 1, requested));
  const target = matches[idx];
  if (target.index === undefined) {
    return new NextResponse("Could not locate match position", { status: 500 });
  }
  const matchStart = target.index;
  const matchEnd = matchStart + target[0].length;
  const next =
    source.slice(0, matchStart) +
    saveBody.replacement +
    source.slice(matchEnd);

  try {
    await fs.writeFile(filePath, next, "utf-8");
  } catch (err) {
    return new NextResponse(
      `Cannot write ${body.path}: ${
        err instanceof Error ? err.message : "unknown"
      }`,
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, path: body.path });
}
