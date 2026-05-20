import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Per-recipient share tokens for gated case studies. State lives in a single
// JSON file in the repo (content/share-tokens.json) so there is no DB:
//   - Minting (CLI) appends an entry.
//   - Reusable tokens stay valid until they expire or are revoked.
//   - One-time tokens are "burned" by writing `usedAt` (via the GitHub API
//     in production — see app/api/burn-share-token/route.ts).
//   - Revocations are an explicit boolean on the entry; you can also strip
//     the entry from the file entirely.
// Tokens themselves are opaque 32-char URL-safe random strings, looked up
// by id in the JSON. No HMAC needed — the ID space is large enough that
// guessing is not a realistic attack.

export type ShareTokenType = "reusable" | "one-time";

export type ShareToken = {
  id: string;
  recipient: string;
  company: string;
  type: ShareTokenType;
  issuedAt: string;
  /** ISO date or null. Reusable tokens default to 90 days; one-time tokens
   *  carry a short expiry too in case they're never used. */
  expiresAt: string | null;
  revoked: boolean;
  /** ISO date when a one-time token was first used (and burned). */
  usedAt: string | null;
  /** Free-form note for your own bookkeeping (e.g. "DesignOps Bootcamp"). */
  note?: string;
  /** 6-digit PIN minted alongside the URL. Lets the visitor unlock the case
   *  study from the access-denied page itself, without leaving. */
  pin?: string;
};

export type ShareTokenStore = { tokens: ShareToken[] };

const STORE_PATH = path.join(process.cwd(), "content", "share-tokens.json");

export function readTokenStore(): ShareTokenStore {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as ShareTokenStore;
    if (!parsed || !Array.isArray(parsed.tokens)) return { tokens: [] };
    return parsed;
  } catch {
    return { tokens: [] };
  }
}

export function writeTokenStore(store: ShareTokenStore): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2) + "\n", "utf-8");
}

export function findToken(id: string | null | undefined): ShareToken | null {
  if (!id) return null;
  const { tokens } = readTokenStore();
  return tokens.find((t) => t.id === id) ?? null;
}

export function findTokenByPin(
  pin: string | null | undefined,
): ShareToken | null {
  if (!pin || !/^\d{6}$/.test(pin)) return null;
  const { tokens } = readTokenStore();
  return tokens.find((t) => t.pin === pin) ?? null;
}

/** A token whose PIN can still be used. Burned/expired/revoked tokens free up
 *  their PIN for reuse on the next mint. */
export function isTokenActive(token: ShareToken): boolean {
  if (token.revoked) return false;
  if (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()) {
    return false;
  }
  if (token.type === "one-time" && token.usedAt) return false;
  return true;
}

export type AccessVerdict =
  | { kind: "granted"; token: ShareToken }
  | { kind: "denied"; reason: AccessDenialReason };

export type AccessDenialReason =
  | "no-token"
  | "unknown-token"
  | "expired"
  | "revoked"
  | "already-used";

/**
 * Decide whether a given token id grants access right now. Pure function —
 * no side effects, no burning. The page calls this on every render; burn
 * happens via the dedicated API route triggered by the client beacon.
 */
export function verifyAccess(id: string | null | undefined): AccessVerdict {
  if (!id) return { kind: "denied", reason: "no-token" };
  const token = findToken(id);
  if (!token) return { kind: "denied", reason: "unknown-token" };
  if (token.revoked) return { kind: "denied", reason: "revoked" };
  if (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()) {
    return { kind: "denied", reason: "expired" };
  }
  if (token.type === "one-time" && token.usedAt) {
    return { kind: "denied", reason: "already-used" };
  }
  return { kind: "granted", token };
}

export function generateTokenId(): string {
  // 24 random bytes → 32 url-safe characters. ~10^57 keyspace, comfortable.
  return crypto
    .randomBytes(24)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/** 6-digit PIN, guaranteed unique against the supplied "in-use" set. The
 *  caller passes PINs that belong to active (non-expired/non-revoked/non-used)
 *  tokens so retired entries can recycle their PIN. */
export function generatePin(reservedPins: Set<string>): string {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const n = crypto.randomInt(0, 1_000_000);
    const pin = n.toString().padStart(6, "0");
    if (!reservedPins.has(pin)) return pin;
  }
  throw new Error("Failed to generate a unique PIN after 1000 attempts");
}
