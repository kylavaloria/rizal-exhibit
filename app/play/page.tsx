"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlayGame() {
  const router = useRouter();
  
  // Setup States
  const [mode, setMode] = useState<"databank" | "custom">("databank");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  
  // Databank State
  const [prompt, setPrompt] = useState<{source: string, reference: string, difficulty: string} | null>(null);
  
  // Custom Input State
  const [customSource, setCustomSource] = useState("");
  const [customReference, setCustomReference] = useState("");

  // Game States
  const [userTranslation, setUserTranslation] = useState("");
  const [gameState, setGameState] = useState<"setup" | "playing" | "evaluating" | "results">("setup");
  const [results, setResults] = useState<any>(null);
  const [nickname, setNickname] = useState("");

  // Fetch a random prompt when difficulty changes
  const fetchPrompt = async (diff: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/prompt?difficulty=${diff}`);
      const data = await res.json();
      setPrompt(data);
    } catch (e) {
      console.error("Failed to fetch prompt.");
    }
  };

  useEffect(() => {
    fetchPrompt(selectedDifficulty);
  }, [selectedDifficulty]);

  const startGame = () => {
    if (mode === "custom" && (!customSource.trim() || !customReference.trim())) {
      alert("Please provide both the Tagalog source and the expected English reference to allow scoring.");
      return;
    }
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
        body: JSON.stringify({ 
            user_translation: userTranslation,
            source_text: sourceText,
            reference_text: referenceText
        }),
      });
      const data = await response.json();
      setResults(data);
      setGameState("results");
    } catch (error) {
      console.error(error);
      setGameState("playing");
    }
  };

  const saveToLeaderboard = async () => {
    if (!nickname.trim()) return;
    
    await fetch("http://localhost:8000/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nickname: nickname,
            score: results.final_score,
            difficulty: mode === "databank" ? prompt?.difficulty : "Custom"
        })
    });
    router.push("/leaderboard");
  };

  const resetGame = () => {
    setGameState("setup");
    setUserTranslation("");
    setResults(null);
    if (mode === "databank") fetchPrompt(selectedDifficulty);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Translation Challenge</h1>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#eb1700]">Exit Game</Link>
        </div>

        {/* --- PHASE 1: SETUP --- */}
        {gameState === "setup" && (
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            
            {/* Mode Selection Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 pb-4">
              <button 
                onClick={() => setMode("databank")}
                className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${mode === "databank" ? "text-[#eb1700] border-b-2 border-[#eb1700]" : "text-gray-500 hover:text-gray-800"}`}
              >
                Use Historical Databank
              </button>
              <button 
                onClick={() => setMode("custom")}
                className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${mode === "custom" ? "text-[#eb1700] border-b-2 border-[#eb1700]" : "text-gray-500 hover:text-gray-800"}`}
              >
                Custom Input
              </button>
            </div>

            {/* Databank Mode UI */}
            {mode === "databank" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Difficulty</label>
                  <div className="flex space-x-2">
                    {["All", "Easy", "Medium", "Hard"].map(diff => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${selectedDifficulty === diff ? "bg-[#eb1700] text-white border-[#eb1700]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg relative">
                  <button onClick={() => fetchPrompt(selectedDifficulty)} className="absolute top-4 right-4 text-xs font-bold text-[#eb1700] hover:underline">Refresh Excerpt ↻</button>
                  <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Preview Excerpt ({prompt?.difficulty})</p>
                  <p className="text-xl text-gray-900 font-medium">{prompt?.source || "Loading..."}</p>
                </div>
              </div>
            )}

            {/* Custom Mode UI */}
            {mode === "custom" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#eb1700] mb-2">Tagalog Source Text</label>
                  <textarea
                    rows={3}
                    className="w-full p-4 text-black font-medium bg-white placeholder:text-gray-400 placeholder:font-normal border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb1700] outline-none resize-none shadow-sm"
                    placeholder="Enter the Tagalog sentence..."
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Expected English Translation (Required for Scoring)</label>
                  <p className="text-xs text-gray-500 mb-2">Neural metrics like COMET need a reference to judge your input against.</p>
                  <textarea
                    rows={2}
                    className="w-full p-4 text-black font-medium bg-white placeholder:text-gray-400 placeholder:font-normal border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none resize-none shadow-sm"
                    placeholder="Enter the canonical English translation..."
                    value={customReference}
                    onChange={(e) => setCustomReference(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={startGame}
                disabled={mode === "databank" ? !prompt : false}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg shadow hover:bg-gray-800 transition-all"
              >
                Start Match
              </button>
            </div>
          </section>
        )}

        {/* --- PHASE 2: PLAYING & EVALUATING --- */}
        {(gameState === "playing" || gameState === "evaluating") && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold tracking-widest text-[#eb1700] uppercase">Target Excerpt</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                    {mode === "databank" ? prompt?.difficulty : "Custom"}
                </span>
              </div>
              <p className="text-2xl font-medium text-gray-900">
                  {mode === "databank" ? prompt?.source : customSource}
              </p>
            </section>

            {gameState === "playing" ? (
              <section className="space-y-4">
                <textarea
                  rows={4}
                  className="w-full p-6 text-black font-medium text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eb1700] focus:border-[#eb1700] outline-none resize-none shadow-sm placeholder:font-normal placeholder:text-gray-400"
                  placeholder="Enter your best English translation here..."
                  value={userTranslation}
                  onChange={(e) => setUserTranslation(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={submitTranslation}
                    disabled={!userTranslation.trim()}
                    className="px-8 py-4 bg-[#eb1700] text-white font-bold rounded-lg shadow hover:bg-red-700 disabled:opacity-50 transition-all"
                  >
                    Submit Translation
                  </button>
                </div>
              </section>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 border-4 border-red-200 border-t-[#eb1700] rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium animate-pulse">Assessing your translation through metrics (COMET & BERTScore)...</p>
              </div>
            )}
          </div>
        )}

        {/* --- PHASE 3: RESULTS --- */}
        {gameState === "results" && results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Victory / Defeat Banner */}
            <div className={`p-8 max-w-4xl mx-auto rounded-xl text-center border-2 shadow-sm relative ${results.user_won ? 'bg-green-50 border-green-500 text-green-900' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                <button onClick={resetGame} className="absolute top-4 right-4 text-sm font-bold text-gray-500 hover:text-gray-800 underline">Try Another</button>
                <h2 className="text-3xl font-black uppercase tracking-tight">
                    {results.user_won ? "You Beat The Machine!" : "The Machine Wins."}
                </h2>
                <p className="mt-2 text-lg">Your COMET Score: <span className="font-bold">{results.final_score.toFixed(1)}</span> pts</p>
                
                {results.user_won && (
                    <div className="mt-6 flex max-w-md mx-auto gap-2">
                        <input 
                            type="text" 
                            placeholder="Enter Nickname" 
                            maxLength={10}
                            className="flex-1 p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-medium placeholder:font-normal placeholder:text-gray-400"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                        />
                        <button onClick={saveToLeaderboard} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">Save Score</button>
                    </div>
                )}
            </div>

            {/* NEW: Ground Truth Source & Reference Box */}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tagalog Source</h3>
                    <p className="text-lg text-gray-900 font-medium">
                        {mode === "databank" ? prompt?.source : customSource}
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Canonical Reference</h3>
                    <p className="text-lg text-blue-900 font-medium italic">
                        "{mode === "databank" ? prompt?.reference : customReference}"
                    </p>
                </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2 font-medium max-w-4xl mx-auto">
              Metrics (COMET & BERTScore) were calculated by comparing translations against the Canonical Reference.
            </p>

            {/* Score Cards - 4 Column Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { title: "You", subtitle: "Human Input", data: results.user, color: "#eb1700", border: "border-[#eb1700] ring-1 ring-[#eb1700]/20" },
                { title: "Normalized Tagalog", subtitle: "Preprocessed LoRA", data: results.improved_normalized, color: "#d97706", border: "border-amber-200" },
                { title: "Raw Tagalog", subtitle: "Old Text LoRA", data: results.improved_old, color: "#2563eb", border: "border-blue-200" },
                { title: "Baseline Model", subtitle: "Pretrained Opus-MT", data: results.baseline, color: "#4b5563", border: "border-gray-200" }
                ].map((entity, idx) => (
                <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm border ${entity.border} flex flex-col`}>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold" style={{ color: entity.color }}>{entity.title}</h2>
                        <p className="text-[10px] uppercase font-bold text-gray-400">{entity.subtitle}</p>
                    </div>
                    
                    <p className="text-gray-700 mb-6 flex-grow italic text-sm">"{entity.data.text}"</p>
                    
                    <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-gray-100 mt-auto">
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase">COMET</p><p className="font-bold text-gray-900 text-xl">{entity.data.comet}</p></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase">BERTScore</p><p className="font-bold text-gray-900 text-xl">{entity.data.bertscore}</p></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase">BLEU</p><p className="font-bold text-gray-600">{entity.data.bleu}</p></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase">chrF</p><p className="font-bold text-gray-600">{entity.data.chrf}</p></div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}