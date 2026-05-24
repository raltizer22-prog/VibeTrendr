import { NextResponse } from "next/server";
import { generateIdeaVariants, type IdeaSeed } from "@/lib/idea-generator";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function parseSeed(input: unknown): IdeaSeed | null {
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

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const seed = parseSeed(body);
  if (!seed) {
    return NextResponse.json({ ok: false, error: "Missing or invalid idea seed." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ideas: generateIdeaVariants(seed) });
}
