import Link from "next/link";
import ScrollAnimator from "@/components/ScrollAnimator";

// Shorthand so the inline style cast isn't repeated everywhere
type CSSVars = React.CSSProperties & { "--animate-delay"?: string };

export default function Home() {
  return (
    <>
      <ScrollAnimator />
      <main className="max-w-[1100px] mx-auto px-5 md:px-16 py-16 md:py-24 space-y-24 md:space-y-32 relative z-10">

        {/* ── Hero ── */}
        <section className="text-center max-w-3xl mx-auto space-y-8">
          <h1 data-animate className="text-display-lg">
            Can You Beat{" "}
            <span className="text-primary-container italic">Rizal?</span>
          </h1>
          <p
            data-animate
            style={{ "--animate-delay": "90ms" } as CSSVars}
            className="text-body-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            We trained an AI to translate 19th-century Tagalog using the historical texts of José
            Rizal. Can your human intuition outperform our specialized Neural Machine Translation
            models?
          </p>
          <div
            data-animate
            style={{ "--animate-delay": "180ms" } as CSSVars}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/play"
              className="bg-primary-container text-on-primary px-8 py-3 text-label-sm uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors ink-border shadow-sm"
            >
              Start the Challenge
            </Link>
            <Link
              href="/leaderboard"
              className="bg-transparent text-secondary px-8 py-3 text-label-sm uppercase tracking-wider ink-border hover:bg-surface-container-low transition-colors shadow-sm"
            >
              View Leaderboard
            </Link>
          </div>
        </section>

        {/* ── 3-Step Process ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 ink-divider pb-24">
          {[
            {
              step: "1. Read the excerpt",
              title: "Analyze a sentence",
              body: "A random passage from Noli Me Tangere or El Filibusterismo is presented in its original historical Tagalog form.",
              delay: "0ms",
            },
            {
              step: "2. Translate",
              title: "Give your best English",
              body: "Provide an English translation based on context, historical tone, and cultural understanding.",
              delay: "120ms",
            },
            {
              step: "3. Compare",
              title: "Score vs the AI",
              body: "See how you score against our baseline Helsinki-NLP and LoRA-adapted MT models.",
              delay: "240ms",
            },
          ].map(({ step, title, body, delay }) => (
            <div
              key={step}
              data-animate
              style={{ "--animate-delay": delay } as CSSVars}
              className="space-y-3"
            >
              <div className="text-primary-container text-label-sm uppercase tracking-wider mb-2">{step}</div>
              <h3 className="text-headline-md">{title}</h3>
              <p className="text-body-md text-on-surface-variant">{body}</p>
            </div>
          ))}
        </section>

        {/* ── The Challenge ── */}
        <section className="space-y-8 bg-surface-container-low -mx-5 md:-mx-16 px-5 md:px-16 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto space-y-12">
            <div data-animate className="space-y-4 max-w-2xl">
              <div className="text-label-sm text-secondary uppercase tracking-widest">The Challenge</div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg">
                Why is historical Tagalog hard to translate?
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Rizal&rsquo;s works use 19th-century spelling, literary structures, and culturally
                specific terms that modern MT models struggle with. See what normalization looks like:
              </p>
            </div>

            <div
              data-animate
              style={{ "--animate-delay": "100ms" } as CSSVars}
              className="bg-surface p-8 ink-border shadow-sm flex flex-col md:flex-row gap-8 items-stretch justify-center relative"
            >
              <div className="flex-1 bg-surface-container p-6 ink-border relative">
                <div className="absolute -top-3 left-6 bg-surface px-2 text-[10px] text-label-sm text-secondary uppercase tracking-wider">
                  Historical Tagalog
                </div>
                <p className="text-body-lg italic text-on-background mt-2">
                  Caya siya umalis na ualang imik.
                </p>
              </div>
              <div className="flex-1 bg-tertiary-fixed p-6 ink-border relative">
                <div className="absolute -top-3 left-6 bg-surface px-2 text-[10px] text-label-sm text-secondary uppercase tracking-wider">
                  Normalized Tagalog
                </div>
                <p className="text-body-lg italic text-on-background mt-2">
                  Kaya siya umalis na walang imik.
                </p>
              </div>
            </div>

            <p
              data-animate
              style={{ "--animate-delay": "180ms" } as CSSVars}
              className="text-center text-caption text-on-surface-variant"
            >
              Old spelling like{" "}
              <span className="bg-surface-variant px-1 rounded-sm ink-border mx-1">ualang</span>,{" "}
              <span className="bg-surface-variant px-1 rounded-sm ink-border mx-1">caya</span>,{" "}
              <span className="bg-surface-variant px-1 rounded-sm ink-border mx-1">mg&agrave;</span>{" "}
              must be normalized before translation
            </p>
          </div>
        </section>

        {/* ── Pipeline ── */}
        <section className="space-y-12 py-12 ink-divider pb-24">
          <div data-animate className="space-y-4 max-w-2xl">
            <div className="text-label-sm text-secondary uppercase tracking-widest">How it works</div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg">
              Our 4-stage improvement pipeline
            </h2>
            <p className="text-body-md text-on-surface-variant">
              We improved the baseline Helsinki-NLP/opus-mt-tl-en model through a hybrid pipeline
              that operates before, during, and after translation.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-8 pt-8 relative">
            {/* line sits at pt-8 (32px) + half of h-20 (40px) = 72px from container top */}
            <div className="hidden md:block absolute top-[72px] left-[10%] right-[10%] h-px bg-outline-variant z-0" />
            {[
              {
                bg: "bg-secondary-container",
                icon: <span className="text-[2rem] leading-none font-garamond text-secondary">T</span>,
                title: "Normalization",
                desc: "Convert old Tagalog spelling to modern forms",
                delay: "0ms",
              },
              {
                bg: "bg-tertiary-fixed",
                icon: <span className="material-symbols-outlined text-3xl text-tertiary">book_4</span>,
                title: "Glossary",
                desc: "Domain-specific terms from Rizal's world",
                delay: "120ms",
              },
              {
                bg: "bg-surface-container-high",
                icon: <span className="material-symbols-outlined text-3xl text-primary-container">tune</span>,
                title: "LoRA fine-tuning",
                desc: "Lightweight model adaptation on curated data",
                delay: "240ms",
              },
              {
                bg: "bg-surface-variant",
                icon: <span className="material-symbols-outlined text-3xl text-secondary">auto_fix_high</span>,
                title: "Post-processing",
                desc: "Correct cultural terms and fix fluency errors",
                delay: "360ms",
              },
            ].map(({ bg, icon, title, desc, delay }) => (
              <div
                key={title}
                data-animate
                style={{ "--animate-delay": delay } as CSSVars}
                className="flex flex-col items-center text-center z-10 w-full md:w-1/4"
              >
                <div className={`w-20 h-20 rounded-full ${bg} flex items-center justify-center ink-border mb-4 shadow-sm`}>
                  {icon}
                </div>
                <h4 className="text-body-lg font-medium">{title}</h4>
                <p className="text-caption text-on-surface-variant mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Translation Improvement ── */}
        <section className="space-y-8 bg-surface-container-low -mx-5 md:-mx-16 px-5 md:px-16 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto space-y-8">
            <div data-animate className="space-y-4 max-w-2xl">
              <div className="text-label-sm text-secondary uppercase tracking-widest">
                Translation Improvement
              </div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg">
                Before vs after our pipeline
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Our post-processing module corrects cultural terms, proper names, and unnatural phrasing.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  raw: (<>The <strong>prayer</strong> had great power in the town.</>),
                  fixed: (<>The <strong>friar</strong> had great power in the town.</>),
                  delay: "0ms",
                },
                {
                  raw: (<>So he left <strong>without a mute</strong>.</>),
                  fixed: (<>So he left <strong>without saying a word</strong>.</>),
                  delay: "130ms",
                },
              ].map(({ raw, fixed, delay }, i) => (
                <div
                  key={i}
                  data-animate
                  style={{ "--animate-delay": delay } as CSSVars}
                  className="flex flex-col md:flex-row gap-4 items-center"
                >
                  <div className="flex-1 bg-surface p-6 ink-border w-full relative">
                    <div className="absolute -top-3 left-6 bg-surface px-2 text-[10px] text-label-sm text-secondary uppercase tracking-wider">
                      Raw MT Output
                    </div>
                    <p className="text-body-md mt-2">{raw}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant hidden md:block">
                    arrow_right_alt
                  </span>
                  <div className="flex-1 bg-tertiary-fixed p-6 ink-border w-full relative">
                    <div className="absolute -top-3 left-6 bg-surface px-2 text-[10px] text-label-sm text-secondary uppercase tracking-wider">
                      Post-Processed
                    </div>
                    <p className="text-body-md mt-2">{fixed}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cultural Vocabulary ── */}
        <section className="space-y-8 py-12 ink-divider pb-24">
          <div data-animate className="space-y-4 max-w-2xl">
            <div className="text-label-sm text-secondary uppercase tracking-widest">
              Cultural Vocabulary
            </div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg">Rizal-domain glossary</h2>
            <p className="text-body-md text-on-surface-variant">
              Historical texts use terms with no modern equivalent. Our glossary ensures these are
              translated consistently and correctly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tl: "prayle",          en: "friar",                          delay: "0ms" },
              { tl: "guardia civil",   en: "civil guard",                    delay: "80ms" },
              { tl: "gobernadorcillo", en: "town mayor / local governor",    delay: "160ms" },
              { tl: "kura",            en: "parish priest",                  delay: "0ms" },
              { tl: "tulisan",         en: "bandit / outlaw",                delay: "80ms" },
              { tl: "bayan",           en: "town / nation (context-dependent)", delay: "160ms" },
            ].map(({ tl, en, delay }) => (
              <div
                key={tl}
                data-animate
                style={{ "--animate-delay": delay } as CSSVars}
                className="bg-surface-container p-6 ink-border flex flex-col justify-between h-32"
              >
                <h4 className="text-body-lg italic text-primary-container">{tl}</h4>
                <p className="text-caption text-on-surface-variant">{en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dataset Sources ── */}
        <section className="space-y-8 bg-surface-container-low -mx-5 md:-mx-16 px-5 md:px-16 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto space-y-8">
            <div data-animate className="space-y-4 max-w-2xl">
              <div className="text-label-sm text-secondary uppercase tracking-widest">Dataset Sources</div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg">
                Texts used for training &amp; evaluation
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Our curated dataset is drawn from Project Gutenberg&rsquo;s digitized versions of
                Rizal&rsquo;s works and their verified English translations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  bg: "bg-secondary-container",
                  title: "Noli Me Tangere",
                  sub: "Tagalog translation by Pascual H. Poblete",
                  ref: "English ref: The Social Cancer (Derbyshire)",
                  delay: "0ms",
                },
                {
                  bg: "bg-tertiary-fixed",
                  title: "El Filibusterismo",
                  sub: "Tagalog: Ang Filibusterismo by Patricio Mariano",
                  ref: "English ref: The Reign of Greed (Derbyshire)",
                  delay: "120ms",
                },
              ].map(({ bg, title, sub, ref, delay }) => (
                <div
                  key={title}
                  data-animate
                  style={{ "--animate-delay": delay } as CSSVars}
                  className="bg-surface p-6 ink-border flex items-start gap-6 shadow-sm"
                >
                  <div className={`w-16 h-20 ${bg} ink-border flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-secondary">menu_book</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-body-lg font-medium">{title}</h4>
                    <p className="text-caption text-on-surface-variant">{sub}</p>
                    <p className="text-caption text-on-surface-variant italic">{ref}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Evaluation ── */}
        <section className="space-y-12 py-12">
          <div data-animate className="space-y-4 max-w-2xl">
            <div className="text-label-sm text-secondary uppercase tracking-widest">Evaluation</div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg">
              How translations are scored
            </h2>
            <p className="text-body-md text-on-surface-variant">
              We use four complementary metrics to evaluate accuracy, fluency, and cultural term
              handling.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "BLEU",  desc: "N-gram precision against reference",    delay: "0ms" },
              { name: "chrF",  desc: "Character n-gram F-score",              delay: "80ms" },
              { name: "COMET", desc: "Neural MT quality estimation",           delay: "160ms" },
              { name: "Human", desc: "Rated for naturalness & accuracy",       delay: "240ms" },
            ].map(({ name, desc, delay }) => (
              <div
                key={name}
                data-animate
                style={{ "--animate-delay": delay } as CSSVars}
                className="bg-surface-container p-6 ink-border text-center flex flex-col justify-center min-h-32"
              >
                <h4 className="text-body-lg font-medium">{name}</h4>
                <p className="text-caption text-on-surface-variant mt-2">{desc}</p>
              </div>
            ))}
          </div>

          <div
            data-animate
            className="mt-16 text-center space-y-6 pt-12 border-t border-outline-variant/30"
          >
            <p className="text-body-md text-on-surface-variant">
              Ready to compete against our AI? Take the challenge and see how your human intuition
              holds up.
            </p>
            <Link
              href="/play"
              className="bg-primary-container text-on-primary px-8 py-3 text-label-sm uppercase tracking-wider hover:bg-on-primary-fixed-variant transition-colors ink-border shadow-sm inline-flex items-center gap-2"
            >
              Start the Challenge{" "}
              <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
