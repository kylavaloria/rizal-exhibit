"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/leaderboard")
      .then(res => res.json())
      .then(data => setScores(data));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-8 font-sans">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Hall of Fame</h1>
          <p className="text-gray-600">Top human translators who defeated the AI models.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-100 p-4 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-2">Translator</div>
            <div className="col-span-1 text-right">Score</div>
          </div>

          <div className="divide-y divide-gray-100">
            {scores.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic">No humans have won yet...</div>
            ) : (
                scores.map((entry, idx) => (
                <div key={idx} className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 font-bold text-gray-400">#{idx + 1}</div>
                    <div className="col-span-2 font-bold text-gray-900 text-lg">
                        {entry.nickname}
                        <span className="ml-2 text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-normal uppercase">{entry.difficulty}</span>
                    </div>
                    <div className="col-span-1 text-right font-black text-[#eb1700] text-xl">{entry.score.toFixed(1)}</div>
                </div>
                ))
            )}
          </div>
        </div>

        <div className="text-center pt-8">
            <Link href="/" className="text-gray-500 hover:text-[#eb1700] font-medium transition-colors">
                &larr; Return to Home
            </Link>
        </div>

      </div>
    </main>
  );
}