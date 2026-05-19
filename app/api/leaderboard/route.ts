import { NextRequest, NextResponse } from "next/server";
import { readLeaderboard, writeLeaderboard, computeWeekLabel, rankEntries } from "@/lib/leaderboard";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get("week");

  const entries = readLeaderboard();
  const filtered = week ? entries.filter((e) => e.weekLabel === week) : entries;
  const ranked = rankEntries(filtered);

  return NextResponse.json(ranked);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nickname, excerpt, source, difficulty, humanTranslation, scores, beatenAI } = body;

  if (!nickname || typeof scores?.comet !== "number") {
    return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  }

  const now = new Date();
  const entry = {
    id: crypto.randomUUID(),
    nickname: String(nickname).trim().slice(0, 24),
    excerpt: String(excerpt ?? "").slice(0, 200),
    source: String(source ?? "Unknown"),
    difficulty: String(difficulty ?? "Unknown"),
    humanTranslation: String(humanTranslation ?? "").slice(0, 500),
    scores: {
      comet: Number(scores.comet),
      bleu: Number(scores.bleu ?? 0),
      chrf: Number(scores.chrf ?? 0),
      bertscore: Number(scores.bertscore ?? 0),
    },
    beatenAI: Boolean(beatenAI),
    timestamp: now.toISOString(),
    weekLabel: computeWeekLabel(now),
  };

  const entries = readLeaderboard();
  entries.push(entry);
  writeLeaderboard(entries);

  const ranked = rankEntries(entries);
  const rank = ranked.find((e) => e.id === entry.id)?.rank ?? entries.length;

  return NextResponse.json({ ...entry, rank }, { status: 201 });
}
