"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function weekLabelOf(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [filter, setFilter] = useState<"week" | "all">("week");
  const [loading, setLoading] = useState(true);
  const [userNickname, setUserNickname] = useState("");

  const currentWeek = weekLabelOf(new Date());

  useEffect(() => {
    try {
      setUserNickname(localStorage.getItem("rizal_nickname") ?? "");
    } catch { /* ssr safety */ }
  }, []);

  useEffect(() => {
    setLoading(true);
    const url =
      filter === "week"
        ? `/api/leaderboard?week=${currentWeek}`
        : `/api/leaderboard`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [filter, currentWeek]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 sm:px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-medium text-gray-900">Leaderboard</div>
              <div className="text-[12px] text-gray-500">Can You Beat Rizal?</div>
            </div>
          </div>
          <Link
            href="/play"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-[#C0392B] text-white hover:bg-[#a93226] transition-colors"
          >
            Play again
          </Link>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Filter toggle */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1 w-fit">
            {(["week", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  filter === f
                    ? "bg-[#C0392B] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "week" ? "This week" : "All time"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[36px_1fr_96px_68px_60px_60px_72px] gap-3 px-4 py-2.5 border-b border-gray-100 text-[10px] font-medium uppercase tracking-[0.07em] text-gray-400">
              <div>#</div>
              <div>Nickname</div>
              <div>Source</div>
              <div className="text-right">COMET</div>
              <div className="text-right">BLEU</div>
              <div className="text-right">chrF</div>
              <div className="text-center">Beat AI?</div>
            </div>

            {loading ? (
              <div className="py-14 text-center text-[14px] text-gray-400">Loading…</div>
            ) : entries.length === 0 ? (
              <div className="py-14 text-center">
                <div className="text-[14px] text-gray-500">No scores yet</div>
                <div className="text-[12px] text-gray-400 mt-1">Be the first to play!</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {entries.map((entry) => {
                  const isCurrentUser =
                    userNickname.trim().length > 0 && entry.nickname === userNickname;
                  return (
                    <div
                      key={entry.id}
                      className={`px-4 py-3 text-[13px] ${
                        isCurrentUser
                          ? "bg-red-50 border-l-2 border-[#C0392B]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-[36px_1fr_96px_68px_60px_60px_72px] gap-3 items-center">
                        <div className="font-medium text-gray-400 text-[12px]">#{entry.rank}</div>
                        <div className="font-medium text-gray-900 truncate">
                          {entry.nickname}
                          {isCurrentUser && (
                            <span className="ml-1.5 text-[10px] bg-red-100 text-[#C0392B] px-1.5 py-0.5 rounded-full font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 truncate text-[12px]">{entry.source}</div>
                        <div className="text-right font-medium text-gray-900">
                          {Number(entry.scores.comet).toFixed(3)}
                        </div>
                        <div className="text-right text-gray-600">
                          {Number(entry.scores.bleu).toFixed(1)}
                        </div>
                        <div className="text-right text-gray-600">
                          {Number(entry.scores.chrf).toFixed(1)}
                        </div>
                        <div className="flex justify-center">
                          {entry.beatenAI ? (
                            <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                              No
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile row */}
                      <div className="sm:hidden flex items-center gap-3">
                        <span className="text-[12px] font-medium text-gray-400 w-6 shrink-0">#{entry.rank}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900 truncate">{entry.nickname}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-red-100 text-[#C0392B] px-1.5 py-0.5 rounded-full font-medium">You</span>
                            )}
                            {entry.beatenAI ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">Beat AI</span>
                            ) : null}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            COMET {Number(entry.scores.comet).toFixed(3)} · {entry.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="text-center">
            <Link href="/" className="text-[13px] text-gray-500 hover:text-gray-700 transition-colors">
              ← Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
