import { NextRequest, NextResponse } from "next/server";

// One-time token burn endpoint. Called by the client beacon after the page
// is first rendered to a recipient with a valid one-time token.
//
// Strategy: read content/share-tokens.json from GitHub, set usedAt on the
// matching entry, commit the new contents back. Vercel auto-deploys on
// push, so the burn becomes authoritative within a minute or so. There is
// a small race window (between first view and the redeploy) during which
// the same URL would still work — acceptable for the use case.
//
// In local dev (no GITHUB_TOKEN), we just write to the filesystem so the
// burn works for end-to-end testing without touching the remote repo.

const FILE_PATH = "content/share-tokens.json";

type GitHubFile = {
  content: string;
  sha: string;
  encoding: string;
};

export async function POST(req: NextRequest) {
  let body: { id?: string };
  try {
    body = (await req.json()) as { id?: string };
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }
  const id = body.id;
  if (!id || typeof id !== "string") {
    return new NextResponse("Missing id", { status: 400 });
  }

  // Dev mode — write to the local filesystem so the gating flow can be
  // exercised end-to-end without GitHub creds.
  if (!process.env.GITHUB_TOKEN || process.env.NODE_ENV !== "production") {
    try {
      const { readTokenStore, writeTokenStore } = await import(
        "@/lib/share-tokens"
      );
      const store = readTokenStore();
      const token = store.tokens.find((t) => t.id === id);
      if (!token) {
        return new NextResponse("Token not found", { status: 404 });
      }
      if (token.type !== "one-time") {
        // Reusable tokens don't get burned. Treat as a no-op.
        return NextResponse.json({ ok: true, burned: false });
      }
      if (token.usedAt) {
        return NextResponse.json({ ok: true, burned: false, already: true });
      }
      token.usedAt = new Date().toISOString();
      writeTokenStore(store);
      return NextResponse.json({ ok: true, burned: true, mode: "local" });
    } catch (err) {
      return new NextResponse(
        `Local burn failed: ${err instanceof Error ? err.message : "unknown"}`,
        { status: 500 },
      );
    }
  }

  // Production — commit back to the repo via the GitHub Contents API.
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!owner || !repo) {
    return new NextResponse(
      "Server misconfigured: GITHUB_REPO_OWNER / GITHUB_REPO_NAME missing.",
      { status: 500 },
    );
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  } as const;

  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`,
    { headers, cache: "no-store" },
  );
  if (!getRes.ok) {
    return new NextResponse(`GitHub GET failed: ${getRes.status}`, {
      status: 500,
    });
  }
  const file = (await getRes.json()) as GitHubFile;
  const decoded = Buffer.from(file.content, "base64").toString("utf-8");
  let store: { tokens: Array<Record<string, unknown>> };
  try {
    store = JSON.parse(decoded);
  } catch {
    return new NextResponse("Token store JSON is malformed in remote.", {
      status: 500,
    });
  }
  const token = store.tokens.find((t) => t.id === id);
  if (!token) {
    return new NextResponse("Token not found", { status: 404 });
  }
  if (token.type !== "one-time") {
    return NextResponse.json({ ok: true, burned: false });
  }
  if (token.usedAt) {
    return NextResponse.json({ ok: true, burned: false, already: true });
  }
  token.usedAt = new Date().toISOString();

  const updated = JSON.stringify(store, null, 2) + "\n";
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `chore(share): burn one-time token ${String(id).slice(0, 8)}…`,
        content: Buffer.from(updated, "utf-8").toString("base64"),
        sha: file.sha,
        branch,
      }),
    },
  );
  if (!putRes.ok) {
    return new NextResponse(`GitHub PUT failed: ${putRes.status}`, {
      status: 500,
    });
  }
  return NextResponse.json({ ok: true, burned: true, mode: "github" });
}
