/* eslint-disable no-console */
import { siteConfig } from "../lib/site";
import {
  type ShareTokenType,
  generatePin,
  generateTokenId,
  isTokenActive,
  readTokenStore,
  writeTokenStore,
} from "../lib/share-tokens";

// CLI: append a new share token to content/share-tokens.json and print the
// share URL. Run from project root:
//
//   npx tsx scripts/mint-share-link.ts \
//     --recipient "Jane Smith" \
//     --company "Acme Corp" \
//     --type reusable      # or "one-time"
//     [--expires 90d]      # default: 90d for reusable, 7d for one-time
//     [--slug saturn-heavy] # default: saturn-heavy
//     [--note "Bootcamp"]
//
// After running, commit the updated content/share-tokens.json and redeploy
// (Vercel auto-deploys on push). The URL is printed to stdout.

type Args = {
  recipient?: string;
  company?: string;
  type?: ShareTokenType;
  expires?: string;
  slug?: string;
  note?: string;
};

function parseArgs(argv: string[]): Args {
  const out: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const value = argv[i + 1];
    if (value && !value.startsWith("--")) {
      i++;
      switch (key) {
        case "recipient":
          out.recipient = value;
          break;
        case "company":
          out.company = value;
          break;
        case "type":
          if (value !== "reusable" && value !== "one-time") {
            console.error(`Invalid --type: ${value}. Use "reusable" or "one-time".`);
            process.exit(1);
          }
          out.type = value;
          break;
        case "expires":
          out.expires = value;
          break;
        case "slug":
          out.slug = value;
          break;
        case "note":
          out.note = value;
          break;
      }
    }
  }
  return out;
}

function parseExpiry(input: string | undefined, defaultDays: number): string {
  const days = (() => {
    if (!input) return defaultDays;
    const m = input.match(/^(\d+)\s*([dhmw])?$/i);
    if (!m) {
      console.error(`Invalid --expires: ${input}. Use e.g. "90d", "7d", "24h".`);
      process.exit(1);
    }
    const n = Number(m[1]);
    const unit = (m[2] ?? "d").toLowerCase();
    if (unit === "h") return n / 24;
    if (unit === "w") return n * 7;
    return n;
  })();
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.recipient) {
    console.error("Missing --recipient. Example: --recipient \"Jane Smith\"");
    process.exit(1);
  }
  if (!args.company) {
    console.error("Missing --company. Example: --company \"Acme Corp\"");
    process.exit(1);
  }
  const type = args.type ?? "reusable";
  const slug = args.slug ?? "saturn-heavy";
  const id = generateTokenId();
  const expiresAt = parseExpiry(args.expires, type === "reusable" ? 90 : 7);

  const store = readTokenStore();
  const reservedPins = new Set(
    store.tokens
      .filter(isTokenActive)
      .map((t) => t.pin)
      .filter((p): p is string => !!p),
  );
  const pin = generatePin(reservedPins);

  store.tokens.push({
    id,
    recipient: args.recipient,
    company: args.company,
    type,
    issuedAt: new Date().toISOString(),
    expiresAt,
    revoked: false,
    usedAt: null,
    note: args.note,
    pin,
  });
  writeTokenStore(store);

  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/case-studies/${slug}?k=${id}`;
  const pinEntryUrl = `${base}/case-studies/${slug}`;

  console.log("");
  console.log("Share link minted.");
  console.log("");
  console.log(`  Recipient   ${args.recipient} @ ${args.company}`);
  console.log(`  Type        ${type}`);
  console.log(`  Expires     ${expiresAt}`);
  console.log(`  Token id    ${id}`);
  console.log("");
  console.log("URL (copy this):");
  console.log("");
  console.log(`  ${url}`);
  console.log("");
  console.log(`PIN (or paste this and have them enter it at ${pinEntryUrl}):`);
  console.log("");
  console.log(`  ${pin}`);
  console.log("");
  console.log(
    "Don't forget to commit content/share-tokens.json and redeploy so the token is recognized in production.",
  );
}

main();
