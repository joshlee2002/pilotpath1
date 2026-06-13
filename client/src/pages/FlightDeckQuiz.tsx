import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Plane, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import type { FlightDeckInput } from "@/lib/flightDeckScoring";

// ─── Types ────────────────────────────────────────────────────────────────────
type Answers = {
  dream: string;
  barrier: string;
  age: string;
  budget: string;
  experience: string;
  timeline: string;
};

type Option = { label: string; value: string; hint?: string; emoji?: string };
type Step = { id: keyof Answers; question: string; subtext?: string; options: Option[] };

const STEPS: Step[] = [
  {
    id: "dream",
    question: "What's your aviation dream?",
    subtext: "Be honest — there's no wrong answer here.",
    options: [
      { emoji: "✈️", label: "Airline Captain", value: "airline_captain", hint: "Flying for a major or regional airline" },
      { emoji: "📦", label: "Cargo Pilot", value: "cargo", hint: "Freight, logistics, night operations" },
      { emoji: "🛩️", label: "Private Jet Pilot", value: "private_jet", hint: "Business aviation, charter, VIP" },
      { emoji: "🌤️", label: "Just want to fly for fun", value: "fun", hint: "Weekends, touring, personal freedom" },
      { emoji: "🤔", label: "Not sure yet", value: "not_sure", hint: "Still exploring what's possible" },
    ],
  },
  {
    id: "barrier",
    question: "What's stopping you from starting pilot training tomorrow?",
    subtext: "Pick the one that feels most true right now.",
    options: [
      { emoji: "💰", label: "The cost", value: "cost", hint: "Training is expensive and I'm not sure how to fund it" },
      { emoji: "⏰", label: "I don't have the time", value: "time", hint: "Work, family, or other commitments" },
      { emoji: "🏥", label: "Medical concerns", value: "medical", hint: "Not sure if I'd pass a Class 1 medical" },
      { emoji: "😰", label: "Not sure I could actually do it", value: "confidence", hint: "Confidence or self-belief" },
      { emoji: "🗺️", label: "I don't know where to start", value: "no_idea", hint: "No idea what the process even looks like" },
    ],
  },
  {
    id: "age",
    question: "How old are you?",
    subtext: "Age affects your training timeline and route options — but it rarely rules anything out.",
    options: [
      { label: "Under 18", value: "under18" },
      { label: "18–25", value: "18_25" },
      { label: "26–35", value: "26_35" },
      { label: "36–45", value: "36_45" },
      { label: "Over 45", value: "over45" },
    ],
  },
  {
    id: "budget",
    question: "How would you describe your training budget right now?",
    subtext: "Honest answers lead to realistic recommendations.",
    options: [
      { label: "I have nothing saved yet", value: "none" },
      { label: "I have some savings but not enough", value: "some", hint: "Under £20,000" },
      { label: "I could fund part of it", value: "moderate", hint: "£20,000 – £50,000" },
      { label: "I'm serious about funding this", value: "serious", hint: "£50,000+" },
      { label: "I have a funding plan or sponsor", value: "funded", hint: "Loan, employer, scholarship, or family" },
    ],
  },
  {
    id: "experience",
    question: "Have you ever been in the cockpit?",
    options: [
      { label: "Never — complete beginner", value: "none" },
      { label: "I've done a trial lesson or two", value: "trial" },
      { label: "I hold a PPL or LAPL", value: "ppl" },
      { label: "I have 50+ hours of flight time", value: "hours_50plus" },
    ],
  },
  {
    id: "timeline",
    question: "When would you love to be sitting in the cockpit?",
    subtext: "Your answer helps us estimate a realistic timeline for your situation.",
    options: [
      { label: "As soon as possible — I'm ready now", value: "asap" },
      { label: "Within the next year", value: "one_year" },
      { label: "In the next 2–5 years", value: "two_five" },
      { label: "Someday — no rush", value: "someday" },
      { label: "I'm not sure", value: "not_sure" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function FlightDeckQuiz() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "How Close Are You To The Flight Deck? | AviatorIQ";
  }, []);

  const step = STEPS[currentStep];
  const progress = (currentStep / STEPS.length) * 100;
  const selectedValue = answers[step.id];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // All 6 answers collected — score client-side and navigate
        setIsSubmitting(true);
        sessionStorage.setItem("flightDeckAnswers", JSON.stringify(newAnswers));
        navigate("/quiz/flight-deck/results");
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Plane className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="font-display font-bold text-sm">AviatorIQ</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">{currentStep + 1} / {STEPS.length}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/10">
        <div
          className="h-full bg-[var(--color-gold)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Quiz label */}
          <p className="text-white/35 text-xs uppercase tracking-widest mb-5 text-center">
            How Close Are You To The Flight Deck?
          </p>

          {/* Question */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 text-center leading-tight">
            {step.question}
          </h1>
          {step.subtext && (
            <p className="text-white/50 text-sm mb-8 text-center">{step.subtext}</p>
          )}
          {!step.subtext && <div className="mb-8" />}

          {/* Options */}
          <div className="space-y-2.5">
            {step.options.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={isSubmitting}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-150 group
                    ${isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 scale-[0.99]"
                      : "border-white/12 bg-white/5 hover:border-white/25 hover:bg-white/8 active:scale-[0.98]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {option.emoji && (
                      <span className="text-xl w-8 shrink-0 text-center">{option.emoji}</span>
                    )}
                    <div className="flex-1">
                      <span className={`font-semibold text-sm md:text-base ${isSelected ? "text-[var(--color-gold)]" : "text-white"}`}>
                        {option.label}
                      </span>
                      {option.hint && (
                        <p className="text-white/40 text-xs mt-0.5">{option.hint}</p>
                      )}
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/35 shrink-0 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back */}
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="mt-6 flex items-center gap-1.5 text-white/35 hover:text-white/60 text-sm transition-colors mx-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {isSubmitting && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-white/50 text-sm">
                <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
                Calculating your flight potential…
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pb-6 px-4">
        <p className="text-white/20 text-xs">
          Free · No registration · 6 questions · Takes 2 minutes
        </p>
      </div>
    </div>
  );
}
