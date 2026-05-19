import Link from "next/link";

function TypographyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66z" />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 4-1 1" /><path d="m19 4 1 1" />
      <path d="m4 15 1 1" /><path d="m4 19 1-1" />
      <path d="m9 4v2" /><path d="m15 20v2" />
      <path d="m20 9h2" /><path d="m2 9h2" />
      <path d="m15 9-6.5 6.5a1.5 1.5 0 0 0 3 3L18 12a1.5 1.5 0 0 0-3-3z" />
    </svg>
  );
}

const PIPELINE_STEPS = [
  {
    icon: <TypographyIcon />,
    name: "Normalization",
    desc: "Convert old Tagalog spelling to modern forms",
    iconCls: "bg-orange-100 text-orange-800",
  },
  {
    icon: <BookIcon />,
    name: "Glossary",
    desc: "Domain-specific terms from Rizal's world",
    iconCls: "bg-emerald-100 text-emerald-800",
  },
  {
    icon: <BrainIcon />,
    name: "LoRA fine-tuning",
    desc: "Lightweight model adaptation on curated data",
    iconCls: "bg-violet-100 text-violet-800",
  },
  {
    icon: <WandIcon />,
    name: "Post-processing",
    desc: "Correct cultural terms and fix fluency errors",
    iconCls: "bg-blue-100 text-blue-800",
  },
];

const GLOSSARY = [
  { tl: "prayle", en: "friar" },
  { tl: "guardia civil", en: "civil guard" },
  { tl: "gobernadorcillo", en: "town mayor / local governor" },
  { tl: "kura", en: "parish priest" },
  { tl: "tulisan", en: "bandit / outlaw" },
  { tl: "bayan", en: "town / nation (context-dependent)" },
];

const METRICS = [
  { name: "BLEU", desc: "N-gram precision against reference" },
  { name: "chrF", desc: "Character n-gram F-score" },
  { name: "COMET", desc: "Neural MT quality estimation" },
  { name: "Human", desc: "Rated for naturalness & accuracy" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen text-gray-900">

      {/* ── Hero ── */}
      <section className="text-center px-6 sm:px-8 pt-12 pb-8">
        <h1 className="text-[38px] sm:text-[42px] font-medium tracking-tight leading-tight mb-4">
          Can You Beat <span className="text-[#C0392B]">Rizal?</span>
        </h1>
        <p className="text-base text-gray-500 max-w-[560px] mx-auto mb-8 leading-[1.7]">
          We trained an AI to translate 19th-century Tagalog using the historical texts of José Rizal.
          Can your human intuition outperform our specialized Neural Machine Translation models?
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <Link
            href="/play"
            className="bg-[#C0392B] text-white px-7 py-3 rounded-lg text-[15px] font-medium hover:bg-[#a93226] transition-colors"
          >
            Start the Challenge
          </Link>
          <Link
            href="/leaderboard"
            className="bg-transparent text-gray-900 border border-gray-300 px-7 py-3 rounded-lg text-[15px] hover:bg-gray-50 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Steps ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 sm:px-8 py-8">
        {[
          {
            num: "1. Read the excerpt",
            title: "Analyze a sentence",
            desc: "A random passage from Noli Me Tangere or El Filibusterismo is presented in its original historical Tagalog form.",
          },
          {
            num: "2. Translate",
            title: "Give your best English",
            desc: "Provide an English translation based on context, historical tone, and cultural understanding.",
          },
          {
            num: "3. Compare",
            title: "Score vs the AI",
            desc: "See how you score against our baseline Helsinki-NLP and LoRA-adapted MT models.",
          },
        ].map(({ num, title, desc }) => (
          <div key={num}>
            <div className="text-[13px] text-[#C0392B] font-medium mb-1">{num}</div>
            <div className="text-[15px] font-medium mb-1.5">{title}</div>
            <div className="text-[13px] text-gray-500 leading-[1.6]">{desc}</div>
          </div>
        ))}
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Why historical Tagalog is hard ── */}
      <section className="bg-gray-50 px-6 sm:px-8 py-8">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2">The challenge</div>
        <div className="text-xl font-medium mb-2">Why is historical Tagalog hard to translate?</div>
        <div className="text-sm text-gray-500 leading-[1.6] max-w-[560px] mb-6">
          Rizal's works use 19th-century spelling, literary structures, and culturally specific terms that modern MT
          models struggle with. See what normalization looks like:
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg p-3 px-4 bg-orange-50 border border-orange-200">
              <div className="text-[10px] font-medium uppercase tracking-[0.07em] text-orange-800 mb-1">Historical Tagalog</div>
              <div className="text-[13px] leading-[1.6] text-gray-900 italic">Caya siya umalis na ualang imik.</div>
            </div>
            <div className="rounded-lg p-3 px-4 bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] font-medium uppercase tracking-[0.07em] text-emerald-800 mb-1">Normalized Tagalog</div>
              <div className="text-[13px] leading-[1.6] text-gray-900 italic">Kaya siya umalis na walang imik.</div>
            </div>
          </div>
          <div className="text-[12px] text-gray-500 text-center">
            Old spelling like{" "}
            <code className="text-[11px] bg-gray-100 px-1.5 py-px rounded">ualang</code>,{" "}
            <code className="text-[11px] bg-gray-100 px-1.5 py-px rounded">caya</code>,{" "}
            <code className="text-[11px] bg-gray-100 px-1.5 py-px rounded">mgà</code>{" "}
            must be normalized before translation
          </div>
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Pipeline ── */}
      <section className="px-6 sm:px-8 py-8">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2">How it works</div>
        <div className="text-xl font-medium mb-2">Our 4-stage improvement pipeline</div>
        <div className="text-sm text-gray-500 leading-[1.6] max-w-[560px] mb-6">
          We improved the baseline Helsinki-NLP/opus-mt-tl-en model through a hybrid pipeline that operates before,
          during, and after translation.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.name} className="py-3.5 px-3 text-center relative">
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 text-gray-300 text-base pointer-events-none select-none">
                  →
                </span>
              )}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2 ${step.iconCls}`}>
                {step.icon}
              </div>
              <div className="text-[12px] font-medium mb-0.5">{step.name}</div>
              <div className="text-[11px] text-gray-500 leading-[1.4]">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Before / After ── */}
      <section className="bg-gray-50 px-6 sm:px-8 py-8">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2">Translation improvement</div>
        <div className="text-xl font-medium mb-2">Before vs after our pipeline</div>
        <div className="text-sm text-gray-500 leading-[1.6] mb-4">
          Our post-processing module corrects cultural terms, proper names, and unnatural phrasing.
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            {
              before: (<>The <strong>prayer</strong> had great power in the town.</>),
              after:  (<>The <strong>friar</strong> had great power in the town.</>),
            },
            {
              before: (<>So he left <strong>without a mute</strong>.</>),
              after:  (<>So he left <strong>without saying a word</strong>.</>),
            },
          ].map((ex, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center">
              <div className="bg-white border border-gray-200 rounded-lg p-3 px-4">
                <div className="text-[10px] uppercase font-medium tracking-[0.07em] text-orange-800 mb-1">Raw MT output</div>
                <div className="text-[13px] leading-[1.6] text-gray-900">{ex.before}</div>
              </div>
              <div className="text-gray-300 text-lg text-center">→</div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 px-4">
                <div className="text-[10px] uppercase font-medium tracking-[0.07em] text-emerald-800 mb-1">Post-processed</div>
                <div className="text-[13px] leading-[1.6] text-gray-900">{ex.after}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Glossary ── */}
      <section className="px-6 sm:px-8 py-8">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2">Cultural vocabulary</div>
        <div className="text-xl font-medium mb-2">Rizal-domain glossary</div>
        <div className="text-sm text-gray-500 leading-[1.6] max-w-[560px] mb-6">
          Historical texts use terms with no modern equivalent. Our glossary ensures these are translated consistently
          and correctly.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {GLOSSARY.map(({ tl, en }) => (
            <div key={tl} className="bg-white border border-gray-100 rounded-lg px-3 py-2.5">
              <div className="text-[13px] font-medium text-[#C0392B] mb-0.5 italic">{tl}</div>
              <div className="text-[12px] text-gray-500">{en}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Dataset sources ── */}
      <section className="bg-gray-50 px-6 sm:px-8 py-8">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2">Dataset sources</div>
        <div className="text-xl font-medium mb-2">Texts used for training & evaluation</div>
        <div className="text-sm text-gray-500 leading-[1.6] max-w-[560px] mb-6">
          Our curated dataset is drawn from Project Gutenberg's digitized versions of Rizal's works and their
          verified English translations.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              coverCls: "bg-orange-200",
              emoji: "📖",
              title: "Noli Me Tangere",
              meta: (
                <>
                  Tagalog translation by Pascual H. Poblete<br />
                  English ref: <em>The Social Cancer</em> (Derbyshire)
                </>
              ),
            },
            {
              coverCls: "bg-blue-200",
              emoji: "📘",
              title: "El Filibusterismo",
              meta: (
                <>
                  Tagalog: <em>Ang Filibusterismo</em> by Patricio Mariano<br />
                  English ref: <em>The Reign of Greed</em> (Derbyshire)
                </>
              ),
            },
          ].map(({ coverCls, emoji, title, meta }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-xl p-4 px-5 flex items-start gap-3">
              <div className={`w-9 h-12 rounded flex-shrink-0 ${coverCls} flex items-center justify-center text-lg`}>
                {emoji}
              </div>
              <div>
                <div className="text-[13px] font-medium mb-0.5">{title}</div>
                <div className="text-[12px] text-gray-500 leading-[1.5]">{meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Evaluation metrics ── */}
      <section className="px-6 sm:px-8 py-8">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2">Evaluation</div>
        <div className="text-xl font-medium mb-2">How translations are scored</div>
        <div className="text-sm text-gray-500 leading-[1.6] max-w-[560px] mb-6">
          We use four complementary metrics to evaluate accuracy, fluency, and cultural term handling.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {METRICS.map(({ name, desc }) => (
            <div key={name} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-[14px] font-medium mb-0.5">{name}</div>
              <div className="text-[11px] text-gray-500">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100 my-0 mx-0" />

      {/* ── Bottom CTA ── */}
      <section className="text-center px-6 sm:px-8 py-10 pb-16">
        <p className="text-[14px] text-gray-500 mb-4">
          Ready to compete against our AI? Take the challenge and see how your human intuition holds up.
        </p>
        <Link
          href="/play"
          className="inline-block bg-[#C0392B] text-white px-7 py-3 rounded-lg text-[15px] font-medium hover:bg-[#a93226] transition-colors"
        >
          Start the Challenge →
        </Link>
      </section>

    </main>
  );
}
