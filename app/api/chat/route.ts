import { groq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

import { ATLAS_BRIEF } from "@/lib/atlas-brief";

// Node runtime — atlas-brief reads the context file from disk at module init.
export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are Atlas, a friendly assistant embedded in Andrzej Delgado's portfolio site.
Answer every question using only the context below. Follow the tone
instructions inside the context (direct, evidence-led, no hype words like
"rockstar"/"ninja"/"passionate"). Cite specific projects, metrics, and dates
when the context has them. If something is uncertain or outside the context,
say so plainly and point the user at /about, /case-studies, the mentoring
link, or hey@delgado.vc.

When you reference a page that exists on this site, write the path inline
in parentheses, e.g. (/case-studies/saturn-heavy). External links should be
full URLs.

--- CONTEXT ---
${ATLAS_BRIEF}
--- END CONTEXT ---`;

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(30, "1 h"),
        analytics: false,
        prefix: "atlas-chat-v2",
      })
    : null;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response("Chat is not configured.", { status: 503 });
  }

  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(getClientIp(req));
      if (!success) {
        return new Response(
          "You've hit the hourly message limit. Try again later.",
          { status: 429 },
        );
      }
    } catch (err) {
      console.warn("[chat] rate-limit unavailable, serving request:", err);
    }
  }

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const trimmed = messages.slice(-12).map((m) => {
      if (Array.isArray(m.parts)) {
        return {
          ...m,
          parts: m.parts.map((p) =>
            p.type === "text" ? { ...p, text: p.text.slice(0, 2000) } : p,
          ),
        };
      }
      return m;
    });

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(trimmed),
      maxOutputTokens: 600,
      temperature: 0.4,
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }) => {
        if (part.type === "finish") {
          return { totalTokens: part.totalUsage?.totalTokens ?? null };
        }
      },
    });
  } catch (err) {
    console.error("[chat] request failed:", err);
    return new Response("Chat is temporarily unavailable. Try again shortly.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
