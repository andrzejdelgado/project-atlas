import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { findTokenByPin, verifyAccess } from "@/lib/share-tokens";

// Node runtime — readTokenStore() needs fs access to read the JSON file
// baked into the deploy artifact.
export const runtime = "nodejs";
export const maxDuration = 5;

// Slugs we accept here — keeps the endpoint from being used as a sniffing
// channel for unrelated routes.
const VALID_SLUGS = new Set(["saturn-heavy"]);

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: false,
        prefix: "redeem-pin-v1",
      })
    : null;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

// Generic denial — never leak whether the PIN was right but the token was
// revoked vs. simply unknown. A bot sees the same response either way.
function denied() {
  return Response.json(
    { ok: false, error: "Invalid or expired PIN." },
    { status: 401 },
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const pin = typeof data.pin === "string" ? data.pin.trim() : "";
  const slug = typeof data.slug === "string" ? data.slug : "";
  const hp = typeof data.hp === "string" ? data.hp : "";

  if (hp.length > 0) {
    // Honeypot tripped — quietly pretend it failed.
    return denied();
  }

  if (!VALID_SLUGS.has(slug)) {
    return Response.json({ ok: false, error: "Unknown case study." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(pin)) {
    return Response.json(
      { ok: false, error: "PIN must be 6 digits." },
      { status: 400 },
    );
  }

  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(getClientIp(req));
      if (!success) {
        return Response.json(
          {
            ok: false,
            error: "Too many attempts — please try again in an hour.",
          },
          { status: 429 },
        );
      }
    } catch (err) {
      console.warn("[redeem-pin] rate-limit unavailable, serving request:", err);
    }
  }

  const token = findTokenByPin(pin);
  if (!token) return denied();
  const verdict = verifyAccess(token.id);
  if (verdict.kind !== "granted") return denied();

  return Response.json({ ok: true, id: token.id, slug });
}
