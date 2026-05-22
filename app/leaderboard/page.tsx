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

  const garamond = { fontFamily: "var(--font-garamond)" } as const;

  return (
    <div className="min-h-screen bg-white flex flex-col" style={garamond}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white border-b-4 border-primary px-6 sm:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-[17px] text-[#3d332d]" style={garamond}>
          <span>Can You Beat <span className="italic text-primary">Rizal?</span></span>
          <span className="text-[#6b5c54] mx-1">→</span>
          <span className="text-[#6b5c54] text-base">Leaderboard</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] tracking-widest uppercase text-[#6b5c54] hover:text-[#3d332d] transition-colors"
          style={garamond}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>close</span>
          Exit game
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">

        {/* Page header row */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-[40px] sm:text-[48px] text-[#3d332d] mb-1 leading-tight" style={garamond}>Leaderboard</h1>
            <p className="text-[18px] text-[#6b5c54] italic" style={garamond}>Can You Beat Rizal?</p>
          </div>
          <Link
            href="/play"
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 text-body-md font-medium hover:opacity-80 transition-opacity"
            style={garamond}
          >
            Play again
            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
          </Link>
        </div>

        {/* Leaderboard container — dashed outer + solid inner */}
        <div className="relative border border-dashed border-[#d2c1b3] bg-white p-6 md:p-10 mb-8">
          {/* Inner decoration border */}
          <div className="absolute inset-[4px] border border-[#d2c1b3] pointer-events-none" />

          {/* Tabs */}
          <div className="flex border-b border-[#d2c1b3] mb-6">
            {(["week", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-body-md pb-2 mr-6 border-b-2 -mb-px transition-colors ${
                  filter === f
                    ? "text-primary border-primary font-medium"
                    : "text-[#6b5c54] border-transparent hover:text-[#3d332d]"
                }`}
                style={garamond}
              >
                {f === "week" ? "This week" : "All time"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto bg-white border border-[#d2c1b3]">
            <table className="w-full text-left border-collapse" style={garamond}>
              <thead>
                <tr className="bg-white border-b border-[#d2c1b3]">
                  {["#", "Nickname", "Source", "COMET", "BLEU", "CHRF", "Beat AI?"].map((h, i) => (
                    <th
                      key={h}
                      className={`py-4 px-6 font-medium text-[12px] tracking-[0.1em] uppercase text-[#6b5c54] ${
                        i >= 3 && i <= 5 ? "text-right" : i === 6 ? "text-center" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[#3d332d] text-[18px]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-[16px] text-[#6b5c54]">Loading…</td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      <div className="text-[16px] text-[#6b5c54]">No scores yet</div>
                      <div className="text-[14px] text-[#a89890] mt-1 italic">Be the first to play!</div>
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const isCurrentUser =
                      userNickname.trim().length > 0 && entry.nickname === userNickname;
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-[#e6d7ce] last:border-b-0 transition-colors ${
                          isCurrentUser
                            ? "bg-white border-l-[3px] border-l-primary"
                            : "hover:bg-[rgba(255,255,255,0.4)]"
                        }`}
                      >
                        <td className={`py-4 px-6 ${isCurrentUser ? "font-semibold text-primary" : "text-[#6b5c54]"}`}>
                          #{entry.rank}
                        </td>
                        <td className="py-4 px-6 font-medium">
                          {entry.nickname}
                          {isCurrentUser && (
                            <span
                              className="ml-2 text-[12px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full"
                              style={garamond}
                            >
                              You
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[#6b5c54] text-base italic">{entry.source}</td>
                        <td className={`py-4 px-6 text-right font-semibold ${isCurrentUser ? "text-primary" : ""}`}>
                          {Number(entry.scores.comet).toFixed(3)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {Number(entry.scores.bleu).toFixed(1)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {Number(entry.scores.chrf).toFixed(1)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {entry.beatenAI ? (
                            <span className="text-[12px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full" style={garamond}>
                              Yes
                            </span>
                          ) : (
                            <span className="text-[12px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full" style={garamond}>
                              No
                            </span>
                          )}
                        </td>

                        {/* Mobile-only condensed view */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#6b5c54] hover:text-[#3d332d] transition-colors italic text-body-md"
            style={garamond}
          >
            <span>←</span> Return to home
          </Link>
        </div>

      </main>
    </div>
  );
}
