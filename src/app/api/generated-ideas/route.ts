import { NextResponse } from "next/server";
import {
  generateIdeaVariants,
  generateTopicIdeaVariants,
  type IdeaSeed,
  type TopicSeed,
} from "@/lib/idea-generator";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function parseSignalSeed(input: unknown): IdeaSeed | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const seed = input as Partial<IdeaSeed>;

  if (
    !isString(seed.title) ||
    !isString(seed.description) ||
    !isString(seed.category) ||
    !isString(seed.source) ||
    typeof seed.score !== "number" ||
    !isString(seed.velocity) ||
    !isString(seed.horizon) ||
    typeof seed.relatedCount !== "number"
  ) {
    return null;
  }

  return {
    title: seed.title,
    description: seed.description,
    category: seed.category,
    source: seed.source,
    score: seed.score,
    velocity: seed.velocity,
    horizon: seed.horizon,
    relatedCount: seed.relatedCount,
    freshnessCue: isString(seed.freshnessCue) ? seed.freshnessCue : null,
  };
}

function parseTopicSeed(input: unknown): TopicSeed | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const seed = input as Partial<TopicSeed>;
  if (!isString(seed.topic) || !seed.topic.trim()) {
    return null;
  }

  return {
    topic: seed.topic.trim(),
    audience: isString(seed.audience) ? seed.audience.trim() : undefined,
    style: isString(seed.style) ? seed.style.trim() : undefined,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const mode = typeof body === "object" && body && isString((body as { mode?: unknown }).mode)
    ? (body as { mode: string }).mode
    : "signal";

  if (mode === "topic") {
    const seed = parseTopicSeed(body);
    if (!seed) {
      return NextResponse.json({ ok: false, error: "Missing or invalid topic seed." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, ideas: generateTopicIdeaVariants(seed) });
  }

  const seed = parseSignalSeed(body);
  if (!seed) {
    return NextResponse.json({ ok: false, error: "Missing or invalid idea seed." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ideas: generateIdeaVariants(seed) });
}
