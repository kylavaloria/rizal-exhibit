"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Inline SVG Icons ───────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function AdjustmentsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function WriteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

function ChartBarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 4v2" /><path d="m15 20v2" /><path d="m20 9h2" /><path d="m2 9h2" />
      <path d="m15 9-6.5 6.5a1.5 1.5 0 0 0 3 3L18 12a1.5 1.5 0 0 0-3-3z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TrophyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

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
          ? <span key={i} className="bg-emerald-100 text-emerald-800 px-1 rounded not-italic font-medium">{s.text}</span>
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

// ── Glossary for hint panel ────────────────────────────────────────────────────

const HINT_GLOSSARY = [
  { tl: "prayle",          en: "friar (Spanish Catholic missionary priest)" },
  { tl: "guardia civil",   en: "civil guard (Spanish colonial police force)" },
  { tl: "gobernadorcillo", en: "town mayor / local governor" },
  { tl: "kura",            en: "parish priest" },
  { tl: "tulisan",         en: "bandit / outlaw" },
  { tl: "bayan",           en: "town / nation (context-dependent)" },
  { tl: "Don",             en: "honorific for a respected gentleman" },
  { tl: "Doña",            en: "honorific for a respected lady" },
  { tl: "indio",           en: "indigenous Filipino (derogatory colonial-era term)" },
  { tl: "araw",            en: "sun / day (often symbolic in Rizal's writing)" },
  { tl: "umalis",          en: "to leave / to depart" },
  { tl: "lumubog",         en: "to sink / to set (as the sun sets)" },
  { tl: "sumisikat",       en: "rising / shining (of the sun)" },
  { tl: "bahay",           en: "house / home" },
  { tl: "hari",            en: "king / sovereign" },
];

function getExcerptGlossary(text: string) {
  if (!text) return HINT_GLOSSARY.slice(0, 5);
  const lower = text.toLowerCase();
  const found = HINT_GLOSSARY.filter(({ tl }) => lower.includes(tl.toLowerCase()));
  if (found.length >= 3) return found.slice(0, 5);
  const extras = HINT_GLOSSARY.filter((t) => !found.includes(t));
  return [...found, ...extras].slice(0, 5);
}

function getExcerptNorms(text: string): [string, string][] {
  if (!text) return [];
  return NORM_PAIRS.filter(([from]) => {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    return re.test(text);
  });
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

const DIFF_DOT: Record<string, string> = {
  All: "bg-gray-400",
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
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

  // Playing-phase state
  const [timeLeft, setTimeLeft] = useState(180);
  const [activeHint, setActiveHint] = useState<"glossary" | "normalization" | "context" | null>(null);
  const [aiBaselineReady, setAiBaselineReady] = useState(false);
  const [aiLoraReady, setAiLoraReady] = useState(false);

  // Results-phase state
  const [savedRank, setSavedRank] = useState<number | null>(null);
  const [leaderboardTop, setLeaderboardTop] = useState<any[]>([]);
  const [saveError, setSaveError] = useState(false);
  const hasSavedRef = useRef(false);

  // Derived
  const showNormPreview = customSource.trim().length > 0 && hasNormChanges(customSource);
  const wordCount = prompt?.source ? prompt.source.trim().split(/\s+/).length : 0;
  const translationWords = userTranslation.trim() ? userTranslation.trim().split(/\s+/).length : 0;
  const wordProgress = Math.min(100, (translationWords / TARGET_WORDS) * 100);
  const currentSource = mode === "databank" ? (prompt?.source ?? "") : customSource;
  const excerptGlossary = getExcerptGlossary(currentSource);
  const excerptNorms = getExcerptNorms(currentSource);
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

  // Timer + AI simulation — reset and start each time playing begins
  useEffect(() => {
    if (gameState !== "playing") return;
    setTimeLeft(180);
    setAiBaselineReady(false);
    setAiLoraReady(false);
    setActiveHint(null);

    const tick = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    const t1 = setTimeout(() => setAiBaselineReady(true), 4000);
    const t2 = setTimeout(() => setAiLoraReady(true), 7500);
    return () => { clearInterval(tick); clearTimeout(t1); clearTimeout(t2); };
  }, [gameState]);

  // Auto-POST to leaderboard when results arrive
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

  const toggleHint = (key: typeof activeHint) =>
    setActiveHint((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Topbar ── */}
      <header className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[16px] font-medium">
            Can You Beat <span className="text-[#C0392B]">Rizal?</span>
          </span>
          <span className="text-[13px] text-gray-400">→ {STEP_LABELS[gameState]}</span>
        </div>
        <Link href="/" className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-800 transition-colors">
          <XIcon /> Exit game
        </Link>
      </header>

      {/* ── Progress bar ── */}
      <div className="h-[3px] bg-gray-100 shrink-0">
        <div className="h-[3px] bg-[#C0392B] transition-all duration-500" style={{ width: PROGRESS_W[gameState] }} />
      </div>

      {/* ══════════════════════════════════════════════════
          PHASE 1 — SETUP
      ══════════════════════════════════════════════════ */}
      {gameState === "setup" && (
        <main className="flex-1 px-4 sm:px-6 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.07em] uppercase text-[#993C1D] bg-[#FAECE7] px-3 py-1 rounded-full mb-2.5">
              {mode === "databank" ? <AdjustmentsIcon /> : <PencilIcon />}
              {mode === "databank" ? "Step 1 of 3" : "Custom input mode"}
            </div>
            <div className="text-[22px] font-medium text-gray-900 mb-1">
              {mode === "databank" ? "Set up your challenge" : "Bring your own text"}
            </div>
            <div className="text-[14px] text-gray-500">
              {mode === "databank"
                ? "Choose difficulty, preview your excerpt, then compete against our MT models."
                : "Paste any historical Tagalog sentence and a reference translation to score against."}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
              <div className="flex border-b border-gray-100 mb-6">
                {(["databank", "custom"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`text-[14px] pb-2 mr-6 border-b-2 -mb-px transition-colors ${
                      mode === tab
                        ? "text-[#C0392B] border-[#C0392B] font-medium"
                        : "text-gray-500 border-transparent hover:text-gray-800"
                    }`}
                  >
                    {tab === "databank" ? "Use historical databank" : "Custom input"}
                  </button>
                ))}
              </div>

              {mode === "databank" && (
                <div className="space-y-5">
                  <div>
                    <div className="text-[12px] font-medium text-gray-500 mb-2.5">Select difficulty</div>
                    <div className="flex gap-2 flex-wrap">
                      {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`flex items-center gap-1.5 px-[18px] py-1.5 rounded-lg text-[13px] border transition-colors ${
                            selectedDifficulty === diff
                              ? "bg-[#C0392B] text-white border-[#C0392B]"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedDifficulty === diff ? "bg-white/80" : DIFF_DOT[diff]}`} />
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-gray-500 mb-2.5">Preview excerpt</div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {prompt?.difficulty && (
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${DIFF_BADGE[prompt.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                              {prompt.difficulty}
                            </span>
                          )}
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500 font-medium">Historical Text</span>
                        </div>
                        <button onClick={() => fetchPrompt(selectedDifficulty)} className="flex items-center gap-1 text-[12px] text-[#C0392B] hover:opacity-70 transition-opacity bg-transparent border-0">
                          <RefreshIcon /> Refresh excerpt
                        </button>
                      </div>
                      <p className="text-[15px] leading-[1.8] text-gray-900 italic border-l-2 border-[#C0392B] pl-3.5">
                        {prompt?.source || "Loading…"}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2.5">
                      {[
                        { label: "Word count", val: prompt ? `~${wordCount} words` : "—" },
                        { label: "Source", val: "Rizal's Works" },
                        { label: "Time limit", val: "3 minutes" },
                      ].map(({ label, val }) => (
                        <div key={label} className="bg-white border border-gray-100 rounded-lg px-3 py-2">
                          <div className="text-[11px] text-gray-400 mb-0.5">{label}</div>
                          <div className="text-[13px] font-medium text-gray-900">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {mode === "custom" && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <label className="text-[13px] font-medium text-gray-800 flex items-center gap-1.5">
                        <span className="text-[#C0392B]"><LanguageIcon /></span>
                        Tagalog source text
                      </label>
                      <span className="text-[11px] text-gray-400">{customSource.length} / 300</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12px] text-gray-500 mb-2 leading-[1.5]">
                      <span className="mt-px text-gray-400 shrink-0"><InfoIcon /></span>
                      <span>
                        Paste a sentence from Noli Me Tangere or El Filibusterismo. Old spellings like{" "}
                        <code className="text-[11px] bg-gray-100 px-1 py-px rounded">mgà</code>,{" "}
                        <code className="text-[11px] bg-gray-100 px-1 py-px rounded">caya</code>,{" "}
                        <code className="text-[11px] bg-gray-100 px-1 py-px rounded">ualang</code>{" "}
                        will be auto-normalized.
                      </span>
                    </div>
                    <textarea
                      rows={4} maxLength={300}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 leading-[1.6] resize-y outline-none transition-all focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10"
                      placeholder="Enter the Tagalog sentence…"
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                    />
                    {showNormPreview && (
                      <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 mt-2">
                        <span className="text-emerald-600 mt-0.5 shrink-0"><WandIcon /></span>
                        <div>
                          <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-emerald-700 mb-1">Auto-normalized</div>
                          <div className="text-[13px] text-gray-900 italic">{buildHighlightedNorm(customSource)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2.5 items-start bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                    <span className="text-emerald-700 mt-0.5 shrink-0"><ChartBarIcon /></span>
                    <div>
                      <p className="text-[13px] text-emerald-900 leading-[1.5]">
                        <strong className="font-medium">Reference translation required for scoring.</strong>{" "}
                        Neural metrics compare your translation and the AI's output against this canonical English text.
                      </p>
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {["BLEU", "chrF", "COMET", "Human rating"].map((m) => (
                          <span key={m} className="text-[11px] bg-white border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <label className="text-[13px] font-medium text-gray-800 flex items-center gap-1.5">
                        <span className="text-[#C0392B]"><TextIcon /></span>
                        Expected English translation
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">Required</span>
                      </label>
                      <span className="text-[11px] text-gray-400">{customReference.length} / 500</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[12px] text-gray-500 mb-2 leading-[1.5]">
                      <span className="mt-px text-gray-400 shrink-0"><InfoIcon /></span>
                      <span>Provide the canonical English translation (e.g. Derbyshire's <em>The Social Cancer</em>). This is the reference all scores are measured against.</span>
                    </div>
                    <textarea
                      rows={4} maxLength={500}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-900 leading-[1.6] resize-y outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      placeholder="Enter the canonical English translation…"
                      value={customReference}
                      onChange={(e) => setCustomReference(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === "databank" && (
              <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
                <div className="text-[12px] font-medium text-gray-500 mb-3">Your display name</div>
                <div className="flex gap-2.5 items-center">
                  <div className="w-9 h-9 rounded-full bg-[#FAECE7] flex items-center justify-center text-[13px] font-medium text-[#993C1D] shrink-0 select-none">
                    {nickname.trim() ? getInitials(nickname) : "?"}
                  </div>
                  <input
                    type="text" maxLength={24}
                    className="flex-1 h-[38px] border border-gray-200 rounded-lg px-3 text-[14px] text-gray-900 outline-none transition-all focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10"
                    placeholder="Enter a nickname for the leaderboard…"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-2.5 py-1 text-[12px] text-gray-500">
                  <UsersIcon />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  3 players active
                </span>
                <span className="text-[11px] font-medium text-gray-400">vs. Baseline MT · LoRA MT</span>
              </div>
              <button
                onClick={startGame}
                disabled={!isReady}
                className="flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-opacity disabled:opacity-40 hover:enabled:opacity-90"
              >
                Start match <ArrowRightIcon />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════
          PHASE 2 — PLAYING
      ══════════════════════════════════════════════════ */}
      {gameState === "playing" && (
        <main className="flex-1 px-4 sm:px-6 py-8">

          {/* Step header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.07em] uppercase text-[#993C1D] bg-[#FAECE7] px-3 py-1 rounded-full mb-2.5">
              <WriteIcon /> Step 2 of 3
            </div>
            <div className="text-[22px] font-medium text-gray-900 mb-1">Translate the excerpt</div>
            <div className="text-[14px] text-gray-500">Give your best English translation. The AI is already working on it.</div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">

            {/* Meta row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {mode === "databank" && prompt?.difficulty && (
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${DIFF_BADGE[prompt.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                    {prompt.difficulty}
                  </span>
                )}
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500 font-medium">
                  {mode === "databank" ? "Rizal's Works" : "Custom text"}
                </span>
              </div>
              {/* Countdown timer */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                timerUrgent
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-white border border-gray-200 text-gray-700"
              }`}>
                <ClockIcon />
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Excerpt card */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400 mb-3">Target excerpt</div>
              <p className="text-[17px] leading-[1.85] text-gray-900 italic border-l-[3px] border-[#C0392B] pl-4">
                {currentSource || "No excerpt loaded."}
              </p>
            </div>

            {/* Hint aids */}
            <div className="flex gap-2 flex-wrap">
              {([
                { key: "glossary",      icon: <BookOpenIcon />,  label: "Glossary hints" },
                { key: "normalization", icon: <WandIcon />,      label: "Normalization used" },
                { key: "context",       icon: <SparkleIcon />,   label: "Context tip" },
              ] as const).map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => toggleHint(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-colors ${
                    activeHint === key
                      ? "bg-[#FAECE7] border-[#C0392B]/30 text-[#993C1D] font-medium"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Glossary panel */}
            {activeHint === "glossary" && (
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400 mb-3">
                  Key terms — Rizal&rsquo;s world
                </div>
                <div className="space-y-2">
                  {excerptGlossary.map(({ tl, en }) => (
                    <div key={tl} className="flex gap-3 items-baseline">
                      <span className="text-[13px] font-medium text-[#C0392B] italic w-32 shrink-0">{tl}</span>
                      <span className="text-[13px] text-gray-600">{en}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Normalization panel */}
            {activeHint === "normalization" && (
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400 mb-3">
                  Historical spelling corrections
                </div>
                {excerptNorms.length > 0 ? (
                  <div className="space-y-2">
                    {excerptNorms.map(([from, to]) => (
                      <div key={from} className="flex items-center gap-3 text-[13px]">
                        <code className="bg-orange-50 border border-orange-200 text-orange-800 px-2 py-0.5 rounded font-medium">{from}</code>
                        <span className="text-gray-400">→</span>
                        <code className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-medium">{to}</code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-500">
                    No old spellings were detected in this excerpt — the text uses modern Tagalog orthography.
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-3 leading-[1.5]">
                  These corrections run automatically before translation to improve model accuracy.
                </p>
              </div>
            )}

            {/* Context tip panel */}
            {activeHint === "context" && (
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400 mb-2">
                  Literary context
                </div>
                <p className="text-[13px] text-gray-700 leading-[1.65]">
                  Rizal&rsquo;s sentences often carry layers of meaning shaped by colonial censorship — characters speak
                  with deliberate indirection, and natural imagery (like the sun or the sea) frequently carries
                  symbolic weight. Preserve this tone: aim for dignified, slightly formal English rather than
                  casual modern phrasing.
                </p>
              </div>
            )}

            {/* Translation area */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-[13px] font-medium text-gray-700">Your English translation</label>
                <span className="text-[12px] text-gray-400">{translationWords} words</span>
              </div>
              <textarea
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 leading-[1.7] resize-none outline-none transition-all focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10 placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Enter your best English translation here…"
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
              />
              {/* Word-length progress bar */}
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-1 bg-[#C0392B] rounded-full transition-all duration-300"
                    style={{ width: `${wordProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">{TARGET_WORDS}w target</span>
              </div>
            </div>

            {/* AI competitor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Baseline MT",      sub: "Pretrained Helsinki-NLP/opus-mt-tl-en", ready: aiBaselineReady },
                { name: "LoRA-adapted MT",  sub: "Fine-tuned on Rizal corpus",           ready: aiLoraReady },
              ].map(({ name, sub, ready }) => (
                <div key={name} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2.5">
                    <div>
                      <div className="text-[13px] font-medium text-gray-900">{name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>
                    </div>
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${ready ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                  </div>
                  <div className={`text-[12px] font-medium ${ready ? "text-emerald-700" : "text-amber-600"}`}>
                    {ready ? "Ready — awaiting your submission" : "Translating…"}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                <LockIcon />
                AI results hidden until you submit
              </div>
              <button
                onClick={submitTranslation}
                disabled={translationWords <= 3}
                className="flex items-center gap-2 bg-[#C0392B] text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all disabled:opacity-40 hover:enabled:bg-[#a93226]"
              >
                Submit translation <ArrowRightIcon />
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
          <div className="flex flex-col items-center space-y-4 bg-white rounded-xl px-12 py-16 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-red-200 border-t-[#C0392B] rounded-full animate-spin" />
            <p className="text-gray-600 font-medium animate-pulse">
              Assessing your translation through metrics (COMET & BERTScore)...
            </p>
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
          <main className="flex-1 px-4 sm:px-6 py-8">
            <div className="max-w-3xl mx-auto space-y-4">

              {/* Verdict banner */}
              <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${results.user_won ? "border-t-4 border-t-[#1D9E75]" : "border-t-4 border-t-[#E24B4A]"}`}>
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`text-[11px] font-medium uppercase tracking-[0.07em] mb-1 ${results.user_won ? "text-emerald-600" : "text-red-500"}`}>
                        {results.user_won ? "Victory" : "Defeated"}
                      </div>
                      <div className="text-[21px] font-medium text-gray-900">
                        {results.user_won ? "You beat the machine!" : "The AI wins this round."}
                      </div>
                      <div className="text-[13px] text-gray-500 mt-1">
                        Your COMET:{" "}
                        <span className="font-medium text-gray-700">{Number(results.user.comet).toFixed(3)}</span>
                        {" · "}Best AI COMET:{" "}
                        <span className="font-medium text-gray-700">{bestAIComet.toFixed(3)}</span>
                      </div>
                    </div>
                    {results.user_won && (
                      <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <TrophyIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <RefreshIcon /> Try Again
                    </button>
                    <Link
                      href="/leaderboard"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UsersIcon /> View Leaderboard
                    </Link>
                    <button
                      onClick={() => {
                        const text = `I scored ${Number(results.user.comet).toFixed(3)} COMET on Can You Beat Rizal!`;
                        if (typeof navigator !== "undefined" && navigator.share) {
                          navigator.share({ title: "Can You Beat Rizal?", text, url: window.location.href }).catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(`${text} ${window.location.href}`).catch(() => {});
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShareIcon /> Share Result
                    </button>
                  </div>
                </div>
              </div>

              {/* Source / Reference card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400 mb-2">Tagalog Source</div>
                  <p className="text-[14px] text-gray-900 leading-[1.7] italic border-l-2 border-gray-200 pl-3">
                    {mode === "databank" ? prompt?.source : customSource}
                  </p>
                </div>
                <div className="bg-[#E6F1FB] rounded-lg p-3.5">
                  <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#0C447C]/60 mb-2">Canonical Reference</div>
                  <p className="text-[14px] text-[#0C447C] leading-[1.7] italic">
                    &ldquo;{mode === "databank" ? prompt?.reference : customReference}&rdquo;
                  </p>
                </div>
              </div>

              {/* Score cards — sorted by COMET DESC */}
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400 mb-2.5">Score comparison — ranked by COMET</div>
                <div className="space-y-2.5">
                  {sortedEntities.map((entity, idx) => {
                    const rank = idx + 1;
                    const isTopAI = entity.key === topAIKey;
                    const cardBorder = entity.isUser
                      ? "border-[#E24B4A]"
                      : isTopAI
                      ? "border-[#1D9E75]"
                      : "border-gray-100";
                    const rankBg =
                      rank === 1 ? "bg-amber-400 text-white"
                      : rank === 2 ? "bg-gray-300 text-gray-700"
                      : rank === 3 ? "bg-amber-600/80 text-white"
                      : "bg-gray-100 text-gray-500";
                    return (
                      <div key={entity.key} className={`bg-white border rounded-xl p-4 ${cardBorder}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${rankBg}`}>
                            {rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-[14px] font-medium text-gray-900">{entity.title}</span>
                              {entity.isUser && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">You</span>
                              )}
                              {isTopAI && !entity.isUser && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">Top AI</span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 mb-2">{entity.subtitle}</div>
                            <p className="text-[13px] text-gray-500 italic mb-3 line-clamp-2">&ldquo;{entity.data.text}&rdquo;</p>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                              {[
                                { label: "COMET",     key: "comet",     value: Number(entity.data.comet) },
                                { label: "BERTScore", key: "bertscore", value: Number(entity.data.bertscore) },
                                { label: "BLEU",      key: "bleu",      value: Number(entity.data.bleu) },
                                { label: "chrF",      key: "chrf",      value: Number(entity.data.chrf) },
                              ].map(({ label, key, value }) => (
                                <div key={key}>
                                  <div className="flex items-baseline justify-between mb-0.5">
                                    <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                                    <span className="text-[11px] font-medium text-gray-700">
                                      {key === "comet" || key === "bertscore" ? value.toFixed(3) : value.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="h-[2px] bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-[2px] rounded-full transition-all ${metricColor(key, value)}`}
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
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                      <TrophyIcon size={16} />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-gray-900">
                        {savedRank != null
                          ? `You ranked #${savedRank} this week`
                          : saveError
                          ? "Score saved anonymously"
                          : "Saving your score…"}
                      </div>
                      {leaderboardTop.length > 0 && (
                        <div className="text-[11px] text-gray-500 mt-0.5">
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
                    className="flex items-center gap-1 text-[13px] text-[#C0392B] hover:opacity-70 transition-opacity font-medium"
                  >
                    Full leaderboard <ArrowRightIcon />
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
