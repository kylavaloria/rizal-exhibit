import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl text-center space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
            Can You Beat <span className="text-[#eb1700]">Rizal?</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We trained an AI to translate 19th-century Tagalog using the historical texts of José Rizal. 
            Can your human intuition outperform our specialized Neural Machine Translation models?
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-8">
          <Link 
            href="/play" 
            className="px-8 py-4 bg-[#eb1700] text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-all text-lg"
          >
            Start the Challenge
          </Link>
          <Link 
            href="/leaderboard" 
            className="px-8 py-4 bg-white text-gray-800 font-bold rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all text-lg"
          >
            View Leaderboard
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-16 border-t border-gray-200 mt-16 text-left">
          <div>
            <h3 className="font-bold text-gray-900">1. Read the Excerpt</h3>
            <p className="text-sm text-gray-500 mt-2">Analyze a random sentence from Noli Me Tangere or El Filibusterismo.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">2. Translate</h3>
            <p className="text-sm text-gray-500 mt-2">Provide your best English translation based on context and historical tone.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">3. Compare</h3>
            <p className="text-sm text-gray-500 mt-2">See how you score against our baseline and LoRA-adapted AI models.</p>
          </div>
        </div>

      </div>
    </main>
  );
}