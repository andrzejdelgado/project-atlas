import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const maxDuration = 10;

// Visitor-facing reasons must stay in sync with components/saturn-heavy/access-denied.tsx.
const VALID_REASONS = new Set([
  "no-token",
  "unknown-token",
  "expired",
  "revoked",
  "already-used",
]);

// Slugs we accept here — keeping this allow-list means a bot can't spam the
// inbox with garbage slugs.
const VALID_SLUGS = new Set(["saturn-heavy"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;
const MAX_NOTE_LEN = 1000;

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        analytics: false,
        prefix: "request-access-v1",
      })
    : null;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { ok: false, error: "Email sender is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const slug = typeof data.slug === "string" ? data.slug : "";
  const reason = typeof data.reason === "string" ? data.reason : "";
  const note = typeof data.note === "string" ? data.note.trim() : "";
  // Bots fill every field they can find. Visible-to-humans-only honeypot.
  const hp = typeof data.hp === "string" ? data.hp : "";

  if (hp.length > 0) {
    // Quietly pretend it worked.
    return Response.json({ ok: true });
  }

  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  if (!VALID_SLUGS.has(slug)) {
    return Response.json({ ok: false, error: "Unknown case study." }, { status: 400 });
  }
  if (!VALID_REASONS.has(reason)) {
    return Response.json({ ok: false, error: "Unknown denial reason." }, { status: 400 });
  }
  if (note.length > MAX_NOTE_LEN) {
    return Response.json({ ok: false, error: "Note is too long." }, { status: 400 });
  }

  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(getClientIp(req));
      if (!success) {
        return Response.json(
          {
            ok: false,
            error: "Too many requests — please try again in an hour.",
          },
          { status: 429 },
        );
      }
    } catch (err) {
      console.warn("[request-access] rate-limit unavailable, serving request:", err);
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const issuedAt = new Date().toISOString();

  const text = [
    `New case study access request.`,
    ``,
    `From:      ${email}`,
    `Slug:      ${slug}`,
    `Reason:    ${reason}`,
    `Time:      ${issuedAt}`,
    `User-agent: ${ua}`,
    note ? `\nNote from requester:\n${note}` : "",
    ``,
    `Mint a link with:`,
    `  npx tsx scripts/mint-share-link.ts --recipient "<name>" --company "<company>" --type reusable`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await resend.emails.send({
      from,
      to: siteConfig.email,
      replyTo: email,
      subject: `Case study access requested — ${email}`,
      text,
    });
    if (result.error) {
      console.error("[request-access] Resend error:", result.error);
      return Response.json(
        { ok: false, error: "Couldn't send the request — please email me directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[request-access] send failed:", err);
    return Response.json(
      { ok: false, error: "Couldn't send the request — please email me directly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
