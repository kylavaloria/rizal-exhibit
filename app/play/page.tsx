"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Normalization ──────────────────────────────────────────────────────────────

const NORM_PAIRS: [string, string][] = [
  ["caya", "Kaya"],
  ["ualang", "walang"],
  ["mg̃a", "mga"],
  ["ñg", "ng"],
  ["cung", "kung"],
  ["wicang", "wikang"],
  ["caniya", "kaniya"],
  ["datapowa't", "datapuwa't"],
];

function buildHighlightedNorm(text: string): React.ReactNode {
  type Seg = { text: string; hi: boolean };
  let segs: Seg[] = [{ text: text, hi: false }];
  for (const [from, to] of NORM_PAIRS) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const next: Seg[] = [];
    for (const seg of segs) {
      if (seg.hi) { next.push(seg); continue; }
      const matches = [...seg.text.matchAll(re)];
      if (!matches.length) { next.push(seg); continue; }
      let prev = 0;
      for (const m of matches) {
        if (m.index! > prev) next.push({ text: seg.text.slice(prev, m.index!), hi: false });
        next.push({ text: to, hi: true });
        prev = m.index! + m[0].length;
      }
      if (prev < seg.text.length) next.push({ text: seg.text.slice(prev), hi: false });
    }
    segs = next;
  }
  return (
    <>
      {segs.map((s, i) =>
        s.hi
          ? <span key={i} className="bg-emerald-100 text-emerald-800 px-1 not-italic font-medium">{s.text}</span>
          : s.text
      )}
    </>
  );
}

function hasNormChanges(text: string): boolean {
  let result = text;
  for (const [from, to] of NORM_PAIRS) {
    result = result.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), to);
  }
  return result !== text;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/[\s_]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if ((parts[0]?.length ?? 0) >= 2) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

const STEP_LABELS: Record<string, string> = {
  setup: "Setup",
  playing: "Translate",
  evaluating: "Evaluating",
  results: "Results",
};

const PROGRESS_W: Record<string, string> = {
  setup: "33%",
  playing: "66%",
  evaluating: "83%",
  results: "100%",
};

const DIFF_BADGE: Record<string, string> = {
  Easy:   "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-700",
  All:    "bg-gray-100 text-gray-600",
};

const TARGET_WORDS = 20;

function metricBarWidth(key: string, value: number): number {
  if (key === "comet" || key === "bertscore") return Math.min(100, Math.round(value * 100));
  return Math.min(100, Math.round(value));
}

function metricColor(key: string, value: number): string {
  const hi = "bg-emerald-500", mid = "bg-amber-500", lo = "bg-red-400";
  if (key === "comet")     return value >= 0.7 ? hi : value >= 0.4 ? mid : lo;
  if (key === "bertscore") return value >= 0.85 ? hi : value >= 0.7 ? mid : lo;
  if (key === "bleu")      return value >= 30 ? hi : value >= 10 ? mid : lo;
  if (key === "chrf")      return value >= 50 ? hi : value >= 25 ? mid : lo;
  return "bg-gray-400";
}

function weekLabelOf(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PlayGame() {
  const [mode, setMode] = useState<"databank" | "custom">("databank");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [prompt, setPrompt] = useState<{ source: string; reference: string; difficulty: string } | null>(null);
  const [customSource, setCustomSource] = useState("");
  const [customReference, setCustomReference] = useState("");
  const [userTranslation, setUserTranslation] = useState("");
  const [gameState, setGameState] = useState<"setup" | "playing" | "evaluating" | "results">("setup");
  const [results, setResults] = useState<any>(null);
  const [nickname, setNickname] = useState("");

  const [timeLeft, setTimeLeft] = useState(180);
  const [aiBaselineReady, setAiBaselineReady] = useState(false);
  const [aiLoraReady, setAiLoraReady] = useState(false);

  const [savedRank, setSavedRank] = useState<number | null>(null);
  const [leaderboardTop, setLeaderboardTop] = useState<any[]>([]);
  const [saveError, setSaveError] = useState(false);
  const hasSavedRef = useRef(false);

  const showNormPreview = customSource.trim().length > 0 && hasNormChanges(customSource);
  const wordCount = prompt?.source ? prompt.source.trim().split(/\s+/).length : 0;
  const translationWords = userTranslation.trim() ? userTranslation.trim().split(/\s+/).length : 0;
  const wordProgress = Math.min(100, (translationWords / TARGET_WORDS) * 100);
  const currentSource = mode === "databank" ? (prompt?.source ?? "") : customSource;
  const timerUrgent = timeLeft <= 30;

  const isReady =
    mode === "databank"
      ? prompt !== null && nickname.trim().length > 0
      : customSource.trim().length > 0 && customReference.trim().length > 0;

  const fetchPrompt = async (diff: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/prompt?difficulty=${diff}`);
      const data = await res.json();
      setPrompt(data);
    } catch {
      console.error("Failed to fetch prompt.");
    }
  };

  useEffect(() => { fetchPrompt(selectedDifficulty); }, [selectedDifficulty]);

  useEffect(() => {
    if (gameState !== "playing") return;
    setTimeLeft(180);
    setAiBaselineReady(false);
    setAiLoraReady(false);
    const tick = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    const t1 = setTimeout(() => setAiBaselineReady(true), 4000);
    const t2 = setTimeout(() => setAiLoraReady(true), 7500);
    return () => { clearInterval(tick); clearTimeout(t1); clearTimeout(t2); };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "results" || !results) return;
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const effectiveNickname = nickname.trim() || "Anonymous";
    const sourceText = mode === "databank" ? (prompt?.source ?? "") : customSource;

    if (nickname.trim()) {
      try { localStorage.setItem("rizal_nickname", nickname.trim()); } catch { /* ignored */ }
    }

    setSavedRank(null);
    setSaveError(false);

    fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: effectiveNickname,
        excerpt: sourceText.slice(0, 200),
        source: mode === "databank" ? "Rizal Databank" : "Custom",
        difficulty: mode === "databank" ? (prompt?.difficulty ?? "Unknown") : "Custom",
        humanTranslation: userTranslation.slice(0, 500),
        scores: {
          comet: results.user.comet,
          bleu: results.user.bleu,
          chrf: results.user.chrf,
          bertscore: results.user.bertscore,
        },
        beatenAI: results.user_won,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setSavedRank(data.rank ?? null);
        return fetch("/api/leaderboard");
      })
      .then((r) => r.json())
      .then((data) => setLeaderboardTop((data as any[]).slice(0, 2)))
      .catch(() => setSaveError(true));
  }, [gameState, results]); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = () => {
    if (mode === "custom" && (!customSource.trim() || !customReference.trim())) return;
    setGameState("playing");
  };

  const submitTranslation = async () => {
    if (!userTranslation.trim()) return;
    setGameState("evaluating");
    const sourceText = mode === "databank" ? prompt?.source : customSource;
    const referenceText = mode === "databank" ? prompt?.reference : customReference;
    try {
      const response = await fetch("http://localhost:8000/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_translation: userTranslation, source_text: sourceText, reference_text: referenceText }),
      });
      const data = await response.json();
      setResults(data);
      setGameState("results");
    } catch (error) {
      console.error(error);
      setGameState("playing");
    }
  };

  const resetGame = () => {
    hasSavedRef.current = false;
    setSavedRank(null);
    setLeaderboardTop([]);
    setSaveError(false);
    setGameState("setup");
    setUserTranslation("");
    setResults(null);
    if (mode === "databank") fetchPrompt(selectedDifficulty);
  };

  const garamond = { fontFamily: "var(--font-garamond)" } as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]" style={garamond}>

      {/* ── Topbar ── */}
      <header className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[rgba(67,52,34,0.15)] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[17px] font-medium text-[#221a14]" style={garamond}>
            Can You Beat <span className="text-primary">Rizal?</span>
          </span>
          <span className="text-[13px] text-[#57423f]" style={garamond}>
            → {STEP_LABELS[gameState]}
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[13px] text-[#57423f] hover:text-[#221a14] transition-colors"
          style={garamond}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'wght' 300" }}>close</span>
          Exit game
        </Link>
      </header>

      {/* ── Progress bar ── */}
      <div className="h-[2px] bg-[#efe0d6] shrink-0">
        <div
          className="h-[2px] bg-primary transition-all duration-500"
          style={{ width: PROGRESS_W[gameState] }}
        />
      </div>

      {/* ══════════════════════════════════════════════════
          PHASE 1 — SETUP
      ══════════════════════════════════════════════════ */}
      {gameState === "setup" && (
        <main className="flex-1 px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-primary mb-3"
              style={garamond}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>tune</span>
              {mode === "databank" ? "Step 1 of 3" : "Custom input mode"}
            </div>
            <h1 className="text-headline-md text-[#221a14] mb-1">
              {mode === "databank" ? "Set up your challenge" : "Bring your own text"}
            </h1>
            <p className="text-body-md text-[#57423f] max-w-md mx-auto">
              {mode === "databank"
                ? "Choose difficulty, preview your excerpt, then compete against our MT models."
                : "Paste any historical Tagalog sentence and a reference translation to score against."}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Main card */}
            <div className="relative bg-white border border-[rgba(67,52,34,0.2)] p-6 sm:p-8 mb-4">
              {/* Dashed inner decoration */}
              <div className="absolute inset-2 border border-dashed border-[rgba(107,13,9,0.15)] pointer-events-none" />

              {/* Mode tabs */}
              <div className="flex border-b border-[rgba(67,52,34,0.15)] mb-7">
                {(["databank", "custom"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`text-body-md pb-2 mr-6 border-b-2 -mb-px transition-colors ${
                      mode === tab
                        ? "text-primary border-primary"
                        : "text-[#57423f] border-transparent hover:text-[#221a14]"
                    }`}
                    style={garamond}
                  >
                    {tab === "databank" ? "Use historical databank" : "Custom input"}
                  </button>
                ))}
              </div>

              {/* ── Databank mode ── */}
              {mode === "databank" && (
                <div className="space-y-6">
                  {/* Difficulty */}
                  <div>
                    <div className="text-label-sm text-[#57423f] mb-3">Select difficulty</div>
                    <div className="flex gap-2 flex-wrap">
                      {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`px-5 py-1.5 text-body-md border transition-colors ${
                            selectedDifficulty === diff
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-[#221a14] border-[rgba(67,52,34,0.25)] hover:bg-[#fff1e8]"
                          }`}
                          style={garamond}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Excerpt preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-label-sm text-[#57423f]">Preview excerpt</div>
                      <button
                        onClick={() => fetchPrompt(selectedDifficulty)}
                        className="flex items-center gap-1 text-caption text-primary hover:opacity-70 transition-opacity"
                        style={garamond}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>refresh</span>
                        Refresh
                      </button>
                    </div>
                    <div className="border border-[rgba(67,52,34,0.15)] bg-[#fff8f5] p-5">
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {prompt?.difficulty && (
                          <span className={`text-[11px] px-2 py-0.5 font-medium ${DIFF_BADGE[prompt.difficulty] ?? "bg-gray-100 text-gray-600"}`} style={garamond}>
                            {prompt.difficulty}
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 border border-[rgba(67,52,34,0.2)] text-[#57423f]" style={garamond}>
                          Historical Text
                        </span>
                      </div>
                      <p className="text-body-lg text-[#221a14] italic border-l-2 border-primary pl-4 leading-[1.9]">
                        {prompt?.source || "Loading…"}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { label: "Word count", val: prompt ? `~${wordCount} words` : "—" },
                        { label: "Source",     val: "Rizal's Works" },
                        { label: "Time limit", val: "3 minutes" },
                      ].map(({ label, val }) => (
                        <div key={label} className="border border-[rgba(67,52,34,0.12)] bg-white px-3 py-2.5">
                          <div className="text-[11px] text-[#8b716e] mb-0.5" style={garamond}>{label}</div>
                          <div className="text-caption font-medium text-[#221a14]">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Custom mode ── */}
              {mode === "custom" && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <label className="text-body-md font-medium text-[#221a14] flex items-center gap-1.5" style={garamond}>
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 15, fontVariationSettings: "'wght' 300" }}>menu_book</span>
                        Tagalog source text
                      </label>
                      <span className="text-caption text-[#8b716e]">{customSource.length} / 300</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-caption text-[#57423f] mb-2 leading-[1.5]">
                      <span className="material-symbols-outlined mt-px text-[#8b716e] shrink-0" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>info</span>
                      <span>
                        Paste a sentence from Noli Me Tangere or El Filibusterismo. Old spellings like{" "}
                        <code className="text-[12px] bg-[#efe0d6] px-1">mgà</code>,{" "}
                        <code className="text-[12px] bg-[#efe0d6] px-1">caya</code>,{" "}
                        <code className="text-[12px] bg-[#efe0d6] px-1">ualang</code>{" "}
                        will be auto-normalized.
                      </span>
                    </div>
                    <textarea
                      rows={4} maxLength={300}
                      className="w-full border border-[rgba(67,52,34,0.2)] px-3 py-2.5 text-body-md text-[#221a14] leading-[1.7] resize-y outline-none transition-all focus:border-primary bg-white"
                      placeholder="Enter the Tagalog sentence…"
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                      style={garamond}
                    />
                    {showNormPreview && (
                      <div className="flex items-start gap-2.5 bg-[#fff1e8] border border-[rgba(67,52,34,0.15)] px-3 py-2.5 mt-2">
                        <span className="material-symbols-outlined text-emerald-700 mt-0.5 shrink-0" style={{ fontSize: 15, fontVariationSettings: "'wght' 300" }}>auto_fix_high</span>
                        <div>
                          <div className="text-label-sm text-emerald-700 mb-1">Auto-normalized</div>
                          <div className="text-body-md text-[#221a14] italic">{buildHighlightedNorm(customSource)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 items-start bg-[#fff1e8] border border-[rgba(67,52,34,0.15)] px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#6d5b47] mt-0.5 shrink-0" style={{ fontSize: 16, fontVariationSettings: "'wght' 300" }}>auto_awesome</span>
                    <div>
                      <p className="text-body-md text-[#221a14] leading-[1.5]">
                        <strong className="font-medium">Reference translation required for scoring.</strong>{" "}
                        Neural metrics compare your translation and the AI&rsquo;s output against this canonical English text.
                      </p>
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {["BLEU", "chrF", "COMET", "Human rating"].map((m) => (
                          <span key={m} className="text-[11px] border border-[rgba(67,52,34,0.2)] text-[#57423f] px-2 py-0.5" style={garamond}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <label className="text-body-md font-medium text-[#221a14] flex items-center gap-1.5" style={garamond}>
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 15, fontVariationSettings: "'wght' 300" }}>edit_note</span>
                        Expected English translation
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 font-medium" style={garamond}>Required</span>
                      </label>
                      <span className="text-caption text-[#8b716e]">{customReference.length} / 500</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-caption text-[#57423f] mb-2 leading-[1.5]">
                      <span className="material-symbols-outlined mt-px text-[#8b716e] shrink-0" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>info</span>
                      <span>Provide the canonical English translation (e.g. Derbyshire&rsquo;s <em>The Social Cancer</em>). This is the reference all scores are measured against.</span>
                    </div>
                    <textarea
                      rows={4} maxLength={500}
                      className="w-full border border-[rgba(67,52,34,0.2)] px-3 py-2.5 text-body-md text-[#221a14] leading-[1.7] resize-y outline-none transition-all focus:border-[#8b716e] bg-white"
                      placeholder="Enter the canonical English translation…"
                      value={customReference}
                      onChange={(e) => setCustomReference(e.target.value)}
                      style={garamond}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Nickname card (databank only) */}
            {mode === "databank" && (
              <div className="bg-white border border-[rgba(67,52,34,0.2)] px-6 py-5 mb-4">
                <div className="text-label-sm text-[#57423f] mb-3">Your display name</div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#ffdad5] flex items-center justify-center text-[13px] font-medium text-primary shrink-0 select-none" style={garamond}>
                    {nickname.trim() ? getInitials(nickname) : "?"}
                  </div>
                  <input
                    type="text" maxLength={24}
                    className="flex-1 border-b border-[rgba(67,52,34,0.3)] bg-transparent py-1.5 text-body-md text-[#221a14] outline-none transition-colors focus:border-primary placeholder:text-[#8b716e]"
                    placeholder="Enter a nickname for the leaderboard…"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    style={garamond}
                  />
                </div>
              </div>
            )}

            {/* Footer row */}
            <div className="flex justify-end">
              <button
                onClick={startGame}
                disabled={!isReady}
                className="flex items-center gap-2 bg-[#221a14] text-white px-7 py-3 text-body-md font-medium transition-opacity disabled:opacity-35 hover:enabled:opacity-80"
                style={garamond}
              >
                Start match
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════
          PHASE 2 — PLAYING
      ══════════════════════════════════════════════════ */}
      {gameState === "playing" && (
        <main className="flex-1 px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-primary mb-3" style={garamond}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>edit_note</span>
              Step 2 of 3
            </div>
            <h1 className="text-headline-md text-[#221a14] mb-1">Translate the excerpt</h1>
            <p className="text-body-md text-[#57423f]">Give your best English translation. The AI is already working on it.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">

            {/* Meta row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {mode === "databank" && prompt?.difficulty && (
                  <span className={`text-[11px] px-2.5 py-1 font-medium ${DIFF_BADGE[prompt.difficulty] ?? "bg-gray-100 text-gray-600"}`} style={garamond}>
                    {prompt.difficulty}
                  </span>
                )}
                <span className="text-[11px] px-2.5 py-1 border border-[rgba(67,52,34,0.2)] text-[#57423f]" style={garamond}>
                  {mode === "databank" ? "Rizal's Works" : "Custom text"}
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 text-body-md font-medium transition-colors border ${
                  timerUrgent
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-white border-[rgba(67,52,34,0.2)] text-[#221a14]"
                }`}
                style={garamond}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>schedule</span>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Workspace — dashed outer border */}
            <div className="border border-dashed border-[rgba(107,13,9,0.3)] p-5 bg-white space-y-5">

              {/* Excerpt */}
              <div>
                <div className="text-label-sm text-[#8b716e] mb-3">Target excerpt</div>
                <p className="text-body-lg text-[#221a14] italic border-l-2 border-primary pl-4 leading-[1.9]">
                  {currentSource || "No excerpt loaded."}
                </p>
              </div>

              <div className="border-t border-dashed border-[rgba(67,52,34,0.2)]" />

              {/* Translation textarea */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label className="text-label-sm text-[#57423f]">Your English translation</label>
                  <span className="text-caption text-[#8b716e]">{translationWords} words</span>
                </div>
                <textarea
                  rows={6}
                  className="w-full border border-[rgba(67,52,34,0.2)] px-4 py-3 text-body-lg text-[#221a14] leading-[1.85] resize-none outline-none transition-all focus:border-primary placeholder:text-[#8b716e]/60"
                  style={{
                    ...garamond,
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(67,52,34,0.06) 31px, rgba(67,52,34,0.06) 32px)",
                    backgroundSize: "100% 32px",
                  }}
                  placeholder="Enter your best English translation here…"
                  value={userTranslation}
                  onChange={(e) => setUserTranslation(e.target.value)}
                />
                {/* Word-count dashed divider progress */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="flex-1 h-[1px] border-t border-dashed border-[rgba(107,13,9,0.25)]"
                    style={{ backgroundImage: "none" }}
                  >
                    <div
                      className="h-[2px] bg-primary transition-all duration-300 -mt-[1px]"
                      style={{ width: `${wordProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#8b716e] shrink-0" style={garamond}>{TARGET_WORDS}w target</span>
                </div>
              </div>
            </div>

            {/* AI competitor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Baseline MT",      sub: "Pretrained Helsinki-NLP/opus-mt-tl-en", ready: aiBaselineReady },
                { name: "LoRA-adapted MT",  sub: "Fine-tuned on Rizal corpus",           ready: aiLoraReady },
              ].map(({ name, sub, ready }) => (
                <div key={name} className="bg-white border border-[rgba(67,52,34,0.15)] p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-body-md font-medium text-[#221a14]">{name}</div>
                      <div className="text-caption text-[#8b716e] mt-0.5">{sub}</div>
                    </div>
                    <span className={`w-2 h-2 mt-1.5 shrink-0 ${ready ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                  </div>
                  <div className={`text-caption font-medium ${ready ? "text-emerald-700" : "text-amber-600"}`} style={garamond}>
                    {ready ? "Ready — awaiting your submission" : "Translating…"}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[rgba(67,52,34,0.15)]">
              <div className="flex items-center gap-1.5 text-caption text-[#8b716e]" style={garamond}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>lock</span>
                AI results hidden until you submit
              </div>
              <button
                onClick={submitTranslation}
                disabled={translationWords <= 3}
                className="flex items-center gap-2 bg-primary text-white px-7 py-3 text-body-md font-medium transition-all disabled:opacity-35 hover:enabled:opacity-80"
                style={garamond}
              >
                Submit translation
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════
          PHASE 2b — EVALUATING
      ══════════════════════════════════════════════════ */}
      {gameState === "evaluating" && (
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white border border-[rgba(67,52,34,0.2)] border-t-4 border-t-primary-container w-full max-w-sm">
            <div className="px-8 py-10 flex flex-col items-center gap-5">
              <div className="w-12 h-12 border-4 border-[#ffdad5] border-t-primary-container rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-body-lg text-[#221a14] font-medium mb-1" style={garamond}>
                  Scoring your translation
                </p>
                <p className="text-caption text-[#8b716e]" style={garamond}>
                  Running COMET, BERTScore, BLEU &amp; chrF…
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════
          PHASE 3 — RESULTS
      ══════════════════════════════════════════════════ */}
      {gameState === "results" && results && (() => {
        const allEntities = [
          { key: "you",        title: "You",                subtitle: "Human Input",        data: results.user,                isUser: true },
          { key: "combined",   title: "Combined Tagalog",   subtitle: "Mixed Data LoRA",    data: results.improved_combined,   isUser: false },
          { key: "normalized", title: "Normalized Tagalog", subtitle: "Preprocessed LoRA",  data: results.improved_normalized,  isUser: false },
          { key: "old",        title: "Raw Tagalog",        subtitle: "Old Text LoRA",      data: results.improved_old,        isUser: false },
          { key: "baseline",   title: "Baseline Model",     subtitle: "Pretrained Opus-MT", data: results.baseline,            isUser: false },
        ];
        const sortedEntities = [...allEntities].sort((a, b) => Number(b.data.comet) - Number(a.data.comet));
        const topAIKey = sortedEntities.find((e) => !e.isUser)?.key;
        const bestAIComet = Math.max(
          Number(results.improved_combined.comet),
          Number(results.improved_normalized.comet),
          Number(results.improved_old.comet),
          Number(results.baseline.comet),
        );
        return (
          <main className="flex-1 px-4 sm:px-6 py-10">
            <div className="max-w-2xl mx-auto space-y-4">

              {/* Verdict banner */}
              <div className={`bg-white border border-[rgba(67,52,34,0.2)] overflow-hidden ${results.user_won ? "border-t-4 border-t-emerald-700" : "border-t-4 border-t-primary"}`}>
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`material-symbols-outlined ${results.user_won ? "text-emerald-700" : "text-primary"}`} style={{ fontSize: 20, fontVariationSettings: results.user_won ? "'FILL' 1, 'wght' 400" : "'wght' 300" }}>
                          {results.user_won ? "emoji_events" : "close"}
                        </span>
                        <span className={`text-label-sm ${results.user_won ? "text-emerald-700" : "text-primary"}`}>
                          {results.user_won ? "Victory" : "Defeated"}
                        </span>
                      </div>
                      <h2 className="text-headline-md text-[#221a14] mb-1">
                        {results.user_won ? "You beat the machine!" : "The AI wins this round."}
                      </h2>
                      <p className="text-body-md text-[#57423f]">
                        Your COMET:{" "}
                        <span className="font-medium text-[#221a14]">{Number(results.user.comet).toFixed(3)}</span>
                        {" · "}Best AI COMET:{" "}
                        <span className="font-medium text-[#221a14]">{bestAIComet.toFixed(3)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-1.5 px-4 py-2 text-body-md border border-[rgba(67,52,34,0.2)] text-[#221a14] hover:bg-[#fff1e8] transition-colors"
                      style={garamond}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'wght' 300" }}>refresh</span>
                      Try Again
                    </button>
                    <Link
                      href="/leaderboard"
                      className="flex items-center gap-1.5 px-4 py-2 text-body-md border border-[rgba(67,52,34,0.2)] text-[#221a14] hover:bg-[#fff1e8] transition-colors"
                      style={garamond}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: "'wght' 300" }}>group</span>
                      View Leaderboard
                    </Link>
                  </div>
                </div>
              </div>

              {/* Source / Reference card */}
              <div className="bg-white border border-[rgba(67,52,34,0.2)] p-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-label-sm text-[#8b716e] mb-2">Tagalog Source</div>
                  <p className="text-body-md text-[#221a14] leading-[1.75] italic border-l-2 border-[rgba(67,52,34,0.3)] pl-3">
                    {mode === "databank" ? prompt?.source : customSource}
                  </p>
                </div>
                <div className="bg-[#fff1e8] border border-[rgba(67,52,34,0.1)] p-3.5">
                  <div className="text-label-sm text-[#8b716e] mb-2">Canonical Reference</div>
                  <p className="text-body-md text-[#221a14] leading-[1.75] italic">
                    &ldquo;{mode === "databank" ? prompt?.reference : customReference}&rdquo;
                  </p>
                </div>
              </div>

              {/* Score list — sorted by COMET DESC */}
              <div>
                <div className="text-label-sm text-[#8b716e] mb-2.5">Score comparison — ranked by COMET</div>
                <div className="space-y-2">
                  {sortedEntities.map((entity, idx) => {
                    const rank = idx + 1;
                    const isTopAI = entity.key === topAIKey;
                    const leftBorder = entity.isUser
                      ? "border-l-4 border-l-primary-container"
                      : isTopAI
                      ? "border-l-4 border-l-emerald-700"
                      : "border-l border-l-[rgba(67,52,34,0.15)]";
                    return (
                      <div key={entity.key} className={`bg-white border border-[rgba(67,52,34,0.15)] p-4 ${leftBorder}`}>
                        <div className="flex items-start gap-3">
                          <div className="text-label-sm text-[#8b716e] w-5 shrink-0 text-right mt-0.5">
                            {rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-body-md font-medium text-[#221a14]">{entity.title}</span>
                              {entity.isUser && (
                                <span className="text-[10px] border border-primary/30 text-primary px-1.5 py-0.5 font-medium" style={garamond}>You</span>
                              )}
                              {isTopAI && !entity.isUser && (
                                <span className="text-[10px] border border-emerald-600/30 text-emerald-700 px-1.5 py-0.5 font-medium" style={garamond}>Top AI</span>
                              )}
                            </div>
                            <div className="text-caption text-[#8b716e] mb-2">{entity.subtitle}</div>
                            <p className="text-body-md text-[#57423f] italic mb-3 line-clamp-2">&ldquo;{entity.data.text}&rdquo;</p>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                              {[
                                { label: "COMET",     key: "comet",     value: Number(entity.data.comet) },
                                { label: "BERTScore", key: "bertscore", value: Number(entity.data.bertscore) },
                                { label: "BLEU",      key: "bleu",      value: Number(entity.data.bleu) },
                                { label: "chrF",      key: "chrf",      value: Number(entity.data.chrf) },
                              ].map(({ label, key, value }) => (
                                <div key={key}>
                                  <div className="flex items-baseline justify-between mb-1">
                                    <span className="text-[10px] text-[#8b716e] font-medium" style={garamond}>{label}</span>
                                    <span className="text-caption font-medium text-[#221a14]">
                                      {key === "comet" || key === "bertscore" ? value.toFixed(3) : value.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="h-[2px] bg-[#ede4de] overflow-hidden">
                                    <div
                                      className={`h-[2px] transition-all ${metricColor(key, value)}`}
                                      style={{ width: `${metricBarWidth(key, value)}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leaderboard teaser */}
              <div className="bg-white border-t-2 border-t-amber-400 border border-[rgba(67,52,34,0.15)] p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>emoji_events</span>
                    <div>
                      <div className="text-body-md font-medium text-[#221a14]" style={garamond}>
                        {savedRank != null
                          ? `You ranked #${savedRank} this week`
                          : saveError
                          ? "Score saved anonymously"
                          : "Saving your score…"}
                      </div>
                      {leaderboardTop.length > 0 && (
                        <div className="text-caption text-[#57423f] mt-0.5" style={garamond}>
                          Top:{" "}
                          {leaderboardTop
                            .map((e) => `${e.nickname} (${Number(e.scores.comet).toFixed(3)})`)
                            .join(" · ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/leaderboard"
                    className="flex items-center gap-1 text-body-md text-primary hover:opacity-70 transition-opacity font-medium"
                    style={garamond}
                  >
                    Full leaderboard
                    <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
                  </Link>
                </div>
              </div>

            </div>
          </main>
        );
      })()}

    </div>
  );
}
