import { groq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

import { ATLAS_BRIEF } from "@/lib/atlas-brief";

export const runtime = "edge";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are Atlas, a friendly assistant embedded in Andrzej Delgado's portfolio site.
Answer questions about Andrzej using only the brief below. If the user asks
something outside that scope, decline in one sentence and suggest a related
topic you *can* help with (case studies, mentoring, contact).

When you reference a page that exists on this site, write the path inline
in parentheses, e.g. (/case-studies/tokens-that-travel). External links
should be full URLs.

--- BRIEF ---
${ATLAS_BRIEF}
--- END BRIEF ---`;

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
    const { success } = await ratelimit.limit(getClientIp(req));
    if (!success) {
      return new Response(
        "You've hit the hourly message limit. Try again later.",
        { status: 429 },
      );
    }
  }

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
}
