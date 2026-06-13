import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Plane, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import type { FlightDeckInput } from "@/lib/flightDeckScoring";

// ─── Types ────────────────────────────────────────────────────────────────────
type Answers = FlightDeckInput;
type Option = { label: string; value: string; hint?: string; emoji?: string };
type Step = { id: keyof Answers; question: string; subtext?: string; options: Option[] };

// ─── Gen 2 Questions — barrier-first, insight-led ────────────────────────────
const STEPS: Step[] = [
  {
    id: "dream",
    question: "What kind of pilot do you want to be?",
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
    id: "commitment",
    question: "What have you actually done about it so far?",
    subtext: "Actions speak louder than intentions — this is one of the most important questions.",
    options: [
      { emoji: "🛫", label: "I've applied to a flight school", value: "applied", hint: "Or I'm in active conversation with one" },
      { emoji: "🏫", label: "I've visited a flight school", value: "visited_school", hint: "Open days, tours, or meetings" },
      { emoji: "🎮", label: "I've done a trial lesson", value: "trial_lesson", hint: "I've actually been in the cockpit" },
      { emoji: "🔍", label: "I've researched schools and routes", value: "researched_schools", hint: "Compared options, read guides" },
      { emoji: "📺", label: "I've watched videos and read forums", value: "watched_videos", hint: "Mentour Pilot, Reddit, YouTube" },
      { emoji: "💭", label: "Mostly just thought about it", value: "just_dreaming", hint: "Haven't taken any concrete steps yet" },
    ],
  },
  {
    id: "barrier",
    question: "If a flight school offered you a place tomorrow, what would stop you starting?",
    subtext: "Pick the one that feels most true right now.",
    options: [
      { emoji: "💰", label: "The cost — I can't fund it", value: "cost", hint: "Training is expensive and I'm not sure how" },
      { emoji: "😰", label: "I'm not sure I could actually do it", value: "confidence", hint: "Self-belief, imposter syndrome" },
      { emoji: "🏥", label: "I'm worried about the medical", value: "medical", hint: "Not sure if I'd pass a Class 1" },
      { emoji: "⏰", label: "I don't have the time right now", value: "time", hint: "Work, family, or other commitments" },
      { emoji: "🎂", label: "I think I might be too old", value: "age", hint: "Worried about age limits or career length" },
      { emoji: "💼", label: "I'd be risking too much", value: "career_risk", hint: "Current career, income, or stability" },
      { emoji: "🗺️", label: "I have too many unanswered questions", value: "information_overload", hint: "Don't know which route, school, or path" },
    ],
  },
  {
    id: "budget",
    question: "How would you describe your financial situation for training?",
    subtext: "Honest answers lead to realistic recommendations.",
    options: [
      { emoji: "🚫", label: "Nothing saved yet — I'd need to finance it all", value: "nothing_yet" },
      { emoji: "🔍", label: "I'm researching finance options", value: "researching_finance", hint: "Loans, payment plans, sponsorships" },
      { emoji: "💷", label: "I have some savings but not enough", value: "some_savings", hint: "Under £30,000" },
      { emoji: "💰", label: "I have serious savings set aside", value: "serious_savings", hint: "£30,000–£80,000+" },
      { emoji: "✅", label: "I have a funding plan or sponsor", value: "funded_or_sponsored", hint: "Loan approved, employer, scholarship, or family" },
    ],
  },
  {
    id: "medical",
    question: "How confident are you about passing a Class 1 medical?",
    subtext: "Required for commercial flying. Most people pass — but uncertainty is a common barrier.",
    options: [
      { emoji: "✅", label: "I already hold a Class 1 medical", value: "have_class1" },
      { emoji: "😊", label: "No concerns — I'm in good health", value: "no_concerns" },
      { emoji: "🤔", label: "Minor concerns but probably fine", value: "minor_concerns", hint: "Vision, minor conditions, medication" },
      { emoji: "❓", label: "I genuinely don't know", value: "not_sure", hint: "Haven't looked into it yet" },
      { emoji: "😟", label: "I have significant concerns", value: "significant_concerns", hint: "Serious conditions, past issues" },
    ],
  },
  {
    id: "risk",
    question: "What's your current life situation?",
    subtext: "This helps us understand how much flexibility you have.",
    options: [
      { emoji: "🚀", label: "I'm ready to commit — nothing holding me back", value: "ready_to_commit" },
      { emoji: "💼", label: "I have a job I'd be willing to leave", value: "would_leave_job", hint: "For the right opportunity" },
      { emoji: "🏠", label: "I need to keep my income while training", value: "need_to_keep_income", hint: "Mortgage, family, dependants" },
      { emoji: "🔒", label: "I have too much to lose to take the risk", value: "too_much_to_lose", hint: "Career, income, or stability concerns" },
      { emoji: "🌱", label: "No major commitments — I'm free to act", value: "no_commitments", hint: "Student, early career, or flexible" },
    ],
  },
  {
    id: "timeline",
    question: "When do you want to start training?",
    subtext: "Your answer helps us understand how serious you are right now.",
    options: [
      { emoji: "⚡", label: "As soon as possible — I'm ready now", value: "asap" },
      { emoji: "📅", label: "Within the next 12 months", value: "within_year" },
      { emoji: "🗓️", label: "In the next 1–3 years", value: "one_to_three" },
      { emoji: "🌅", label: "Someday — no fixed timeline", value: "someday" },
      { emoji: "❓", label: "I'm not sure yet", value: "not_sure" },
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
    document.title = "What's Really Stopping You Becoming A Pilot? | AviatorIQ";
  }, []);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const selectedValue = answers[step.id];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
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
          <span className="text-white/70 text-xs">{currentStep + 1} / {STEPS.length}</span>
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
          <p className="text-white/60 text-xs uppercase tracking-widest mb-5 text-center">
            What's Really Stopping You?
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
                        <p className="text-white/65 text-xs mt-0.5">{option.hint}</p>
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
              className="mt-6 flex items-center gap-1.5 text-white/55 hover:text-white/80 text-sm transition-colors mx-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {isSubmitting && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-white/50 text-sm">
                <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
                Analysing your profile…
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pb-6 px-4">
        <p className="text-white/50 text-xs">
          Free · No registration · 7 questions · Takes 2 minutes
        </p>
      </div>
    </div>
  );
}
