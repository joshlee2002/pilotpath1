import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Plane } from "lucide-react";

interface Question {
  id: string;
  text: string;
  subtext?: string;
  options: { label: string; value: string; score: { integrated: number; modular: number } }[];
}

const QUESTIONS: Question[] = [
  {
    id: "fulltime",
    text: "Can you train full-time for 18–24 months?",
    subtext: "Integrated training requires full-time commitment. You cannot work alongside it.",
    options: [
      { label: "Yes — I can commit fully", value: "yes", score: { integrated: 3, modular: 0 } },
      { label: "Possibly, but it would be difficult", value: "maybe", score: { integrated: 1, modular: 1 } },
      { label: "No — I need to keep working", value: "no", score: { integrated: 0, modular: 3 } },
    ],
  },
  {
    id: "budget",
    text: "What is your available budget for training?",
    subtext: "Integrated training typically costs £90,000–£130,000 upfront. Modular can be spread over time.",
    options: [
      { label: "£90,000+ available or financed", value: "high", score: { integrated: 3, modular: 1 } },
      { label: "£40,000–£90,000", value: "mid", score: { integrated: 0, modular: 3 } },
      { label: "Under £40,000 right now", value: "low", score: { integrated: 0, modular: 3 } },
    ],
  },
  {
    id: "speed",
    text: "How important is it to qualify as fast as possible?",
    subtext: "Integrated gets you to frozen ATPL in 18–24 months. Modular typically takes 3–5 years.",
    options: [
      { label: "Very important — I want to fly commercially ASAP", value: "high", score: { integrated: 3, modular: 0 } },
      { label: "Somewhat important", value: "mid", score: { integrated: 2, modular: 1 } },
      { label: "I'm happy to take my time", value: "low", score: { integrated: 0, modular: 3 } },
    ],
  },
  {
    id: "structure",
    text: "Do you prefer a structured programme or self-directed learning?",
    subtext: "Integrated provides a clear, guided pathway. Modular requires you to manage your own progression.",
    options: [
      { label: "I prefer a structured, guided programme", value: "structured", score: { integrated: 3, modular: 0 } },
      { label: "I'm comfortable with both", value: "either", score: { integrated: 1, modular: 1 } },
      { label: "I prefer to manage my own learning", value: "self", score: { integrated: 0, modular: 3 } },
    ],
  },
  {
    id: "risk",
    text: "How do you feel about financial risk?",
    subtext: "Integrated requires committing most of the cost upfront. Modular lets you pause if circumstances change.",
    options: [
      { label: "I'm comfortable committing the full amount upfront", value: "low", score: { integrated: 3, modular: 1 } },
      { label: "I'd prefer to spread the financial risk", value: "mid", score: { integrated: 0, modular: 3 } },
      { label: "I need maximum flexibility — life might change", value: "high", score: { integrated: 0, modular: 3 } },
    ],
  },
  {
    id: "family",
    text: "Do you have significant personal commitments (family, mortgage, etc.)?",
    subtext: "Integrated training abroad or away from home can be difficult with family commitments.",
    options: [
      { label: "No major commitments — I have full flexibility", value: "none", score: { integrated: 3, modular: 1 } },
      { label: "Some commitments but manageable", value: "some", score: { integrated: 1, modular: 2 } },
      { label: "Significant commitments I can't step away from", value: "heavy", score: { integrated: 0, modular: 3 } },
    ],
  },
];

type Answers = Record<string, string>;

function getResult(answers: Answers) {
  let integrated = 0;
  let modular = 0;

  for (const q of QUESTIONS) {
    const ans = answers[q.id];
    if (!ans) continue;
    const opt = q.options.find((o) => o.value === ans);
    if (opt) {
      integrated += opt.score.integrated;
      modular += opt.score.modular;
    }
  }

  const total = integrated + modular;
  const intPct = total > 0 ? Math.round((integrated / total) * 100) : 50;
  const modPct = 100 - intPct;

  let recommendation: "integrated" | "modular" | "either";
  if (intPct >= 65) recommendation = "integrated";
  else if (modPct >= 65) recommendation = "modular";
  else recommendation = "either";

  return { integrated, modular, intPct, modPct, recommendation };
}

const RESULT_COPY = {
  integrated: {
    title: "Integrated ATPL Training looks like the right fit",
    summary:
      "Based on your answers, you have the financial readiness, time availability and preference for structure that makes integrated training a strong match. You'll qualify faster and benefit from a clear, guided pathway to the airlines.",
    pros: [
      "Qualify in 18–24 months — the fastest route to the flight deck",
      "Structured programme with built-in mentoring and progression",
      "Strong employer recognition from major airlines",
      "Type rating often included or discounted",
    ],
    risks: [
      "High upfront cost: £90,000–£130,000",
      "No flexibility to pause — you commit to the full programme",
      "Training often requires relocating or living away from home",
    ],
    cta: "Get a personalised training roadmap",
    ctaHref: "/quiz",
  },
  modular: {
    title: "Modular ATPL Training is the better route for you",
    summary:
      "Your situation — whether that's financial constraints, personal commitments, or a preference for flexibility — points strongly toward modular training. You can build your licences in stages, keep working, and manage your financial risk.",
    pros: [
      "Lower total cost: £40,000–£80,000 spread over time",
      "Keep working while you train — no need to give up your income",
      "Flexibility to pause if life circumstances change",
      "Train at your own pace and choose your own schools",
    ],
    risks: [
      "Takes 3–5 years vs 18–24 months for integrated",
      "Requires self-discipline to manage your own progression",
      "Some airlines historically preferred integrated graduates (though this is changing)",
    ],
    cta: "Find modular schools that match your budget",
    ctaHref: "/schools",
  },
  either: {
    title: "Either route could work for you",
    summary:
      "Your answers suggest you sit in the middle — you have some flexibility but also some constraints. Both integrated and modular training could work. The right choice depends on factors like your exact budget, timeline flexibility and personal circumstances.",
    pros: [
      "You have genuine options — this is a good position to be in",
      "Integrated would get you there faster if you can stretch the budget",
      "Modular gives you more financial control and flexibility",
    ],
    risks: [
      "The decision requires careful financial planning either way",
      "Consider speaking to an admissions advisor at both types of school",
    ],
    cta: "Take the full assessment for a personalised roadmap",
    ctaHref: "/quiz",
  },
};

export default function IntModDecision() {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = questions, 7 = result
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string | null>(null);

  const isIntro = step === 0;
  const isResult = step === QUESTIONS.length + 1;
  const currentQ = !isIntro && !isResult ? QUESTIONS[step - 1] : null;
  const progress = isResult ? 100 : Math.round((step / (QUESTIONS.length + 1)) * 100);

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (currentQ && selected) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: selected }));
      setSelected(null);
      setStep((s) => s + 1);
    } else if (isIntro) {
      setStep(1);
    }
  }

  function handleBack() {
    if (step > 0) {
      setSelected(answers[QUESTIONS[step - 2]?.id] ?? null);
      setStep((s) => s - 1);
    }
  }

  const result = isResult ? getResult(answers) : null;
  const resultCopy = result ? RESULT_COPY[result.recommendation] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Integrated vs Modular Pilot Training: Which Is Right for You? | AviatorIQ"
        description="Answer 6 questions and find out whether integrated or modular ATPL training suits your situation. Free personalised recommendation with pros, risks and next steps."
        canonical="/tools/integrated-vs-modular"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Integrated vs Modular Decision Tool",
          description: "Free tool to determine whether integrated or modular ATPL training is right for your situation",
          url: "https://aviatoriq.com/tools/integrated-vs-modular",
          applicationCategory: "EducationalApplication",
        }}
      />
      <PublicNav />
      <main className="flex-1 bg-sky-subtle py-10 px-4">
        <div className="container max-w-2xl">

          {/* Intro */}
          {isIntro && (
            <div className="card-base p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-5">
                <Plane className="w-7 h-7 text-[var(--color-primary)]" />
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-navy)] mb-3">
                Integrated or Modular?
              </h1>
              <p className="text-[var(--color-muted-foreground)] mb-2 max-w-md mx-auto">
                This is one of the most important decisions you'll make about pilot training. Answer 6 questions and get a personalised recommendation.
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-8 max-w-md mx-auto">
                Takes about 2 minutes. No registration required.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="font-display font-bold text-blue-800 text-sm mb-1">Integrated</div>
                  <div className="text-xs text-blue-700">18–24 months · £90k–£130k · Full-time</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="font-display font-bold text-purple-800 text-sm mb-1">Modular</div>
                  <div className="text-xs text-purple-700">3–5 years · £40k–£80k · Flexible</div>
                </div>
              </div>
              <button onClick={handleNext} className="btn-cta">
                Start the decision tool
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Question */}
          {currentQ && (
            <div className="card-base p-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mb-1.5">
                  <span>Question {step} of {QUESTIONS.length}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <h2 className="font-display font-bold text-xl text-[var(--color-navy)] mb-2">{currentQ.text}</h2>
              {currentQ.subtext && (
                <p className="text-sm text-[var(--color-muted-foreground)] mb-6">{currentQ.subtext}</p>
              )}

              <div className="space-y-3 mb-8">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                      selected === opt.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        selected === opt.value
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-[var(--color-border)]"
                      }`}>
                        {selected === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium text-[var(--color-navy)] text-sm">{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-navy)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className="btn-cta disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === QUESTIONS.length ? "See my recommendation" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {isResult && result && resultCopy && (
            <div className="space-y-5">
              {/* Score bar */}
              <div className="card-base p-6">
                <h2 className="font-display font-bold text-xl text-[var(--color-navy)] mb-1">{resultCopy.title}</h2>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-5">{resultCopy.summary}</p>

                <div className="mb-2 flex justify-between text-xs font-semibold">
                  <span className="text-blue-700">Integrated {result.intPct}%</span>
                  <span className="text-purple-700">Modular {result.modPct}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden bg-purple-100 flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-700"
                    style={{ width: `${result.intPct}%` }}
                  />
                </div>
              </div>

              {/* Pros */}
              <div className="card-base p-6">
                <h3 className="font-display font-bold text-[var(--color-navy)] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Why this route suits you
                </h3>
                <ul className="space-y-2">
                  {resultCopy.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="card-base p-6">
                <h3 className="font-display font-bold text-[var(--color-navy)] mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Things to be aware of
                </h3>
                <ul className="space-y-2">
                  {resultCopy.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center">
                <h3 className="font-display font-bold text-lg mb-2">Ready to take the next step?</h3>
                <p className="text-white/70 text-sm mb-5">
                  Get a full personalised roadmap — including cost estimate, timeline, and matched flight schools.
                </p>
                <Link href={resultCopy.ctaHref} className="btn-cta mb-3 w-full justify-center">
                  {resultCopy.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setStep(0); setAnswers({}); setSelected(null); }}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Start over
                </button>
              </div>

              {/* Read the guide */}
              <div className="flex items-center justify-center">
                <Link
                  href="/guides/integrated-vs-modular"
                  className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:text-[var(--color-navy)] transition-colors"
                >
                  Read the full Integrated vs Modular guide
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
