import fs from "fs";
import path from "path";

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  excerpt: string;
  source: string;
  difficulty: string;
  humanTranslation: string;
  scores: {
    comet: number;
    bleu: number;
    chrf: number;
    bertscore: number;
  };
  beatenAI: boolean;
  timestamp: string;
  weekLabel: string;
}

export interface RankedEntry extends LeaderboardEntry {
  rank: number;
}

const DATA_PATH = path.join(process.cwd(), "data", "leaderboard.json");

export function readLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function writeLeaderboard(entries: LeaderboardEntry[]): void {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

export function computeWeekLabel(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function rankEntries(entries: LeaderboardEntry[]): RankedEntry[] {
  return [...entries]
    .sort((a, b) => b.scores.comet - a.scores.comet)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}
