import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plane, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────
type Answers = {
  goal: string;
  timeCommitment: string;
  budget: string;
  wantsCommercial: string;
  experience: string;
  location: string;
  speedPriority: string;
  mainPriority: string;
};

type Option = { label: string; value: string; hint?: string };

type Step = {
  id: keyof Answers;
  question: string;
  subtext?: string;
  options: Option[];
};

const STEPS: Step[] = [
  {
    id: "goal",
    question: "What is your main goal?",
    subtext: "This shapes everything — your licence type, training route, and timeline.",
    options: [
      { label: "Fly for a living", value: "professional", hint: "Airlines, commercial aviation, charter" },
      { label: "Fly as a hobby or for personal travel", value: "recreational", hint: "Weekend flying, touring, leisure" },
      { label: "Fly for business", value: "business", hint: "Own aircraft, corporate travel, charter" },
      { label: "I'm not sure yet — I just want to start flying", value: "exploring", hint: "Exploring options before committing" },
    ],
  },
  {
    id: "timeCommitment",
    question: "How much time can you commit to training?",
    subtext: "Honest answers here lead to more realistic recommendations.",
    options: [
      { label: "Full-time", value: "fulltime", hint: "Training every day for 1–2 years" },
      { label: "Part-time", value: "parttime", hint: "Evenings and weekends over 2–4 years" },
      { label: "Flexible", value: "flexible", hint: "Some free time but it varies" },
      { label: "Very limited", value: "limited", hint: "Occasional training only" },
    ],
  },
  {
    id: "budget",
    question: "What is your approximate budget for training?",
    subtext: "This is one of the biggest factors in which licence is realistic for you.",
    options: [
      { label: "Under £10,000", value: "under10k" },
      { label: "£10,000 – £30,000", value: "10k_30k" },
      { label: "£30,000 – £80,000", value: "30k_80k" },
      { label: "£80,000 – £130,000", value: "80k_130k" },
      { label: "Over £130,000", value: "over130k" },
      { label: "I'm not sure yet", value: "unsure" },
    ],
  },
  {
    id: "wantsCommercial",
    question: "Do you want to fly passengers or cargo commercially?",
    options: [
      { label: "Yes — that's the goal", value: "yes_commercial" },
      { label: "Maybe in the future, but not immediately", value: "maybe" },
      { label: "No — purely private or recreational", value: "no" },
    ],
  },
  {
    id: "experience",
    question: "Do you have any existing flying experience?",
    options: [
      { label: "None — complete beginner", value: "none" },
      { label: "A few trial lessons", value: "trial" },
      { label: "I hold a LAPL or PPL already", value: "has_licence" },
      { label: "I have significant hours (50+)", value: "experienced" },
    ],
  },
  {
    id: "location",
    question: "Where are you based or where do you want to train?",
    options: [
      { label: "United Kingdom", value: "uk" },
      { label: "Europe (outside UK)", value: "europe" },
      { label: "USA or Canada", value: "north_america" },
      { label: "Australia or New Zealand", value: "aus_nz" },
      { label: "Elsewhere / not sure", value: "other" },
    ],
  },
  {
    id: "speedPriority",
    question: "How important is speed to qualification?",
    subtext: "Some licences can be achieved in months; others take years.",
    options: [
      { label: "Very important — qualify as fast as possible", value: "fast" },
      { label: "Balanced — speed and cost in equal measure", value: "balanced" },
      { label: "Not important — I'd rather take my time and save money", value: "slow" },
    ],
  },
  {
    id: "mainPriority",
    question: "What matters most to you right now?",
    options: [
      { label: "Getting airborne as quickly and cheaply as possible", value: "get_flying" },
      { label: "Building towards a professional career", value: "career" },
      { label: "Understanding all my options before committing", value: "research" },
      { label: "Finding the most cost-effective route to commercial flying", value: "value" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LicenceQuiz() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Which Pilot Licence Is Right For You? | AviatorIQ";
  }, []);

  const submitMutation = trpc.licenceQuiz.submit.useMutation({
    onSuccess: (data) => {
      // Store result in sessionStorage so results page can read it
      sessionStorage.setItem("licenceQuizResult", JSON.stringify(data));
      navigate("/quiz/licence/results");
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const step = STEPS[currentStep];
  const progress = ((currentStep) / STEPS.length) * 100;
  const selectedValue = answers[step.id];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // Final step — submit
        const complete = newAnswers as Answers;
        setIsSubmitting(true);
        const source = new URLSearchParams(window.location.search).get("source") ?? undefined;
        submitMutation.mutate({ ...complete, source });
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-navy)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Plane className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="font-display font-bold text-sm">AviatorIQ</span>
        </Link>
        <span className="text-white/50 text-xs">
          Question {currentStep + 1} of {STEPS.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-[var(--color-gold)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] text-xs font-bold">
              {currentStep + 1}
            </span>
            <span className="text-white/65 text-xs uppercase tracking-widest">
              Which Pilot Licence Is Right For You?
            </span>
          </div>

          {/* Question */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
            {step.question}
          </h1>
          {step.subtext && (
            <p className="text-white/60 text-sm mb-8">{step.subtext}</p>
          )}
          {!step.subtext && <div className="mb-8" />}

          {/* Options */}
          <div className="space-y-3">
            {step.options.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={isSubmitting}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 group
                    ${isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 scale-[0.99]"
                      : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/8 active:scale-[0.98]"
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <span className={`font-medium text-sm md:text-base ${isSelected ? "text-[var(--color-gold)]" : "text-white"}`}>
                        {option.label}
                      </span>
                      {option.hint && (
                        <p className="text-white/65 text-xs mt-0.5">{option.hint}</p>
                      )}
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 shrink-0 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back button */}
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="mt-6 flex items-center gap-1.5 text-white/55 hover:text-white/80 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Loading overlay for final submit */}
          {isSubmitting && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-white/60 text-sm">
                <div className="w-4 h-4 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
                Calculating your recommendation…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-6 px-4">
        <p className="text-white/55 text-xs">
          Free · No registration required · Takes 2–3 minutes
        </p>
      </div>
    </div>
  );
}
