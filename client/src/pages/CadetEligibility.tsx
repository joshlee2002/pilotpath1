import { useState } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { CheckCircle2, XCircle, ChevronRight, ArrowRight, Plane, AlertTriangle, Star, Info } from "lucide-react";

// ─── Cadet programme data ─────────────────────────────────────────────────────
interface Programme {
  id: string;
  airline: string;
  name: string;
  logo: string;
  href: string;
  minAge: number;
  maxAge: number | null;
  minBudget: number; // £k — candidate must be able to fund this much (some are funded, some bonded)
  selfFunded: boolean; // true = candidate pays; false = airline-funded/bonded
  minHours: number; // PPL hours minimum (0 = no requirement)
  educationReq: "none" | "gcse" | "a_level" | "degree";
  locations: string[]; // UK, EU, etc.
  description: string;
  keyFacts: string[];
  guideHref: string;
}

const PROGRAMMES: Programme[] = [
  {
    id: "ba_speedbird",
    airline: "British Airways",
    name: "BA Speedbird Academy",
    logo: "BA",
    href: "/guides/ba-speedbird-academy",
    minAge: 18,
    maxAge: null,
    minBudget: 0,
    selfFunded: false,
    minHours: 0,
    educationReq: "a_level",
    locations: ["UK"],
    description: "British Airways' flagship cadet programme. Fully funded training with a guaranteed First Officer role at BA on completion. Highly competitive — typically 1,000+ applicants per place.",
    keyFacts: [
      "Fully funded — no training costs to the candidate",
      "Guaranteed First Officer job at British Airways",
      "Training at CAE Oxford (Oxford/Bournemouth)",
      "Bond period applies after qualification",
      "Minimum 5 GCSEs (A*–C) including Maths and English; 2 A-levels or equivalent",
      "No upper age limit",
    ],
    guideHref: "/guides/ba-speedbird-academy",
  },
  {
    id: "easyjet_generation",
    airline: "easyJet",
    name: "easyJet Generation Pilot",
    logo: "EJ",
    href: "/guides/easyjet-generation-pilot",
    minAge: 18,
    maxAge: null,
    minBudget: 0,
    selfFunded: false,
    minHours: 0,
    educationReq: "gcse",
    locations: ["UK", "EU"],
    description: "easyJet's cadet programme offering funded training and a guaranteed First Officer role. Highly competitive with multiple selection stages.",
    keyFacts: [
      "Funded training — no upfront cost to candidate",
      "Guaranteed First Officer job at easyJet",
      "Training at approved ATOs across Europe",
      "Bond period applies after qualification",
      "Minimum 5 GCSEs (A*–C) including Maths and English",
      "No upper age limit",
    ],
    guideHref: "/guides/easyjet-generation-pilot",
  },
  {
    id: "ryanair_cadet",
    airline: "Ryanair",
    name: "Ryanair Cadet Programme",
    logo: "FR",
    href: "/guides/ryanair-cadet-programme",
    minAge: 18,
    maxAge: null,
    minBudget: 45,
    selfFunded: true,
    minHours: 0,
    educationReq: "gcse",
    locations: ["UK", "EU"],
    description: "Ryanair's cadet programme through partner schools (FTEJerez, Bartolini Air, MATS). Self-funded training with a pathway to a First Officer role at Ryanair.",
    keyFacts: [
      "Self-funded — candidate pays training costs (approx. £45,000–£65,000)",
      "Pathway to First Officer role at Ryanair (not guaranteed)",
      "Training at FTEJerez (Spain), Bartolini Air (Poland), or MATS (Malta)",
      "No bond period — but no guarantee of employment",
      "Minimum 5 GCSEs (A*–C) including Maths and English",
      "No upper age limit",
    ],
    guideHref: "/guides/ryanair-cadet-programme",
  },
  {
    id: "wizz_air",
    airline: "Wizz Air",
    name: "Wizz Air Pilot Academy",
    logo: "W6",
    href: "/guides/wizz-air-pilot-academy",
    minAge: 18,
    maxAge: null,
    minBudget: 50,
    selfFunded: true,
    minHours: 0,
    educationReq: "gcse",
    locations: ["EU"],
    description: "Wizz Air's cadet programme through partner ATOs. Self-funded training with a pathway to a First Officer role at one of Europe's fastest-growing airlines.",
    keyFacts: [
      "Self-funded — candidate pays training costs (approx. £50,000–£70,000)",
      "Pathway to First Officer role at Wizz Air",
      "Training at approved ATOs in Europe",
      "Primarily based in Central/Eastern Europe",
      "Minimum 5 GCSEs or equivalent",
      "No upper age limit",
    ],
    guideHref: "/guides/wizz-air-pilot-academy",
  },
  {
    id: "tui_mpl",
    airline: "TUI Airways",
    name: "TUI MPL Programme",
    logo: "TUI",
    href: "/guides/tui-mpl-cadet-programme",
    minAge: 18,
    maxAge: null,
    minBudget: 0,
    selfFunded: false,
    minHours: 0,
    educationReq: "a_level",
    locations: ["UK"],
    description: "TUI's Multi-Pilot Licence (MPL) programme. Fully integrated training with a guaranteed First Officer role at TUI Airways.",
    keyFacts: [
      "Funded training — no upfront cost to candidate",
      "Guaranteed First Officer job at TUI Airways",
      "MPL licence (multi-crew focused, not standalone ATPL)",
      "Bond period applies after qualification",
      "Minimum 5 GCSEs (A*–C) including Maths and English; 2 A-levels or equivalent",
      "No upper age limit",
    ],
    guideHref: "/guides/tui-mpl-cadet-programme",
  },
];

// ─── Questions ────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  subtext?: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "age",
    text: "How old are you?",
    subtext: "All five programmes accept applicants aged 18 and over with no upper age limit.",
    options: [
      { label: "Under 18", value: "under_18" },
      { label: "18–25", value: "18_25" },
      { label: "26–35", value: "26_35" },
      { label: "36–45", value: "36_45" },
      { label: "Over 45", value: "over_45" },
    ],
  },
  {
    id: "budget",
    text: "What is your available budget for training?",
    subtext: "Some programmes are fully funded by the airline. Others require you to self-fund.",
    options: [
      { label: "No budget — I need a funded programme", value: "zero" },
      { label: "Up to £30,000", value: "30k" },
      { label: "£30,000–£60,000", value: "60k" },
      { label: "£60,000–£100,000", value: "100k" },
      { label: "Over £100,000", value: "100k_plus" },
    ],
  },
  {
    id: "hours",
    text: "Do you have any existing flying hours?",
    subtext: "Most cadet programmes accept complete beginners. Flying hours are a bonus, not a requirement.",
    options: [
      { label: "No flying experience", value: "zero" },
      { label: "Some trial lessons (under 10 hours)", value: "trial" },
      { label: "PPL or 10–50 hours", value: "ppl" },
      { label: "50+ hours", value: "50_plus" },
    ],
  },
  {
    id: "education",
    text: "What is your highest level of education?",
    subtext: "Minimum academic requirements vary by programme.",
    options: [
      { label: "No formal qualifications", value: "none" },
      { label: "GCSEs (or equivalent)", value: "gcse" },
      { label: "A-levels (or equivalent)", value: "a_level" },
      { label: "Degree or higher", value: "degree" },
    ],
  },
  {
    id: "location",
    text: "Where are you based?",
    subtext: "Some programmes are UK-only; others are open to EU applicants.",
    options: [
      { label: "United Kingdom", value: "uk" },
      { label: "European Union", value: "eu" },
      { label: "Outside UK/EU", value: "other" },
    ],
  },
];

// ─── Eligibility logic ────────────────────────────────────────────────────────
type Answers = Record<string, string>;

function checkEligibility(programme: Programme, answers: Answers): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Age
  if (answers.age === "under_18") {
    reasons.push("You must be at least 18 years old to apply.");
  }

  // Budget
  if (programme.selfFunded) {
    const budgetMap: Record<string, number> = { zero: 0, "30k": 30, "60k": 60, "100k": 100, "100k_plus": 150 };
    const budget = budgetMap[answers.budget] ?? 0;
    if (budget < programme.minBudget) {
      reasons.push(`This programme requires self-funding of approximately £${programme.minBudget}k+. Your stated budget may be insufficient.`);
    }
  }

  // Education
  const eduRank: Record<string, number> = { none: 0, gcse: 1, a_level: 2, degree: 3 };
  const reqRank = eduRank[programme.educationReq] ?? 0;
  const candidateRank = eduRank[answers.education] ?? 0;
  if (candidateRank < reqRank) {
    const reqLabel = programme.educationReq === "gcse" ? "GCSEs (A*–C)" : "A-levels or equivalent";
    reasons.push(`This programme requires a minimum of ${reqLabel}.`);
  }

  // Location
  if (answers.location === "other") {
    reasons.push("This programme is typically open to UK/EU residents only. Check the airline's current requirements.");
  } else if (answers.location === "eu" && !programme.locations.includes("EU")) {
    reasons.push("This programme is currently UK-based and may not be open to EU applicants.");
  }

  return { eligible: reasons.length === 0, reasons };
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ProgrammeResult({ programme, answers }: { programme: Programme; answers: Answers }) {
  const { eligible, reasons } = checkEligibility(programme, answers);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        eligible
          ? "border-green-300 bg-green-50"
          : "border-gray-200 bg-gray-50 opacity-75"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
          eligible ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
        }`}>
          {programme.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-[var(--color-navy)]">{programme.name}</h3>
            {eligible ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" /> Potentially Eligible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 w-fit">
                <XCircle className="w-3.5 h-3.5" /> May Not Be Eligible
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-2">
            {programme.airline} · {programme.selfFunded ? `Self-funded (~£${programme.minBudget}k+)` : "Funded by airline"}
          </p>
          <p className="text-sm text-[var(--color-foreground)]">{programme.description}</p>

          {!eligible && reasons.length > 0 && (
            <div className="mt-3 space-y-1">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-red-700">
                  <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {r}
                </div>
              ))}
            </div>
          )}

          {expanded && (
            <div className="mt-3 space-y-2">
              <ul className="space-y-1.5">
                {programme.keyFacts.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[var(--color-foreground)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              {expanded ? "Show less" : "Key facts"}
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>
            <Link
              href={programme.guideHref}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 no-underline"
            >
              Full guide <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CadetEligibility() {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setComplete(true);
    }
  };

  const reset = () => {
    setAnswers({});
    setCurrentQ(0);
    setComplete(false);
  };

  const eligibleProgrammes = PROGRAMMES.filter((p) => checkEligibility(p, answers).eligible);
  const ineligibleProgrammes = PROGRAMMES.filter((p) => !checkEligibility(p, answers).eligible);

  const progress = complete ? 100 : Math.round((currentQ / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <SEO
        title="Cadet Programme Eligibility Checker | Which Airline Cadet Scheme Can I Apply For? | AviatorIQ"
        description="Answer 5 questions to find out which UK airline cadet programmes you are eligible for — BA Speedbird Academy, easyJet Generation Pilot, Ryanair, Wizz Air, and TUI MPL."
        canonical="/tools/cadet-eligibility"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What are the UK airline cadet programmes?", acceptedAnswer: { "@type": "Answer", text: "The main UK airline cadet programmes are: BA Speedbird Academy (British Airways), easyJet Generation Pilot, Ryanair Cadet Programme, Wizz Air Pilot Academy, and TUI MPL Programme." } },
            { "@type": "Question", name: "Are airline cadet programmes funded?", acceptedAnswer: { "@type": "Answer", text: "BA Speedbird Academy, easyJet Generation Pilot, and TUI MPL are fully funded by the airline. Ryanair and Wizz Air programmes are self-funded by the candidate." } },
            { "@type": "Question", name: "What qualifications do I need for a cadet programme?", acceptedAnswer: { "@type": "Answer", text: "Most cadet programmes require a minimum of 5 GCSEs (A*–C) including Maths and English. BA Speedbird Academy and TUI MPL also require 2 A-levels or equivalent." } },
          ],
        }}
      />
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <div
          className="relative overflow-hidden py-12 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/images/cadet-simulator.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.09 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-2xl relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "oklch(0.45 0.18 240 / 0.15)", color: "oklch(0.75 0.12 240)", border: "1px solid oklch(0.45 0.18 240 / 0.25)" }}>
              <Star className="w-3.5 h-3.5" /> Cadet Programme Tool
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Cadet Programme Eligibility Checker
            </h1>
            <p className="text-base md:text-lg mb-4" style={{ color: "oklch(0.65 0.04 240)" }}>
              Answer 5 questions to find out which of the UK's main airline cadet programmes you are eligible for — including BA, easyJet, Ryanair, Wizz Air, and TUI.
            </p>
            <p className="text-sm" style={{ color: "oklch(0.5 0.04 240)" }}>
              Takes 60 seconds · No registration required
            </p>
          </div>
        </div>

        {/* Quiz / Results */}
        <div className="py-10 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-2xl">

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2" style={{ color: "oklch(0.55 0.04 240)" }}>
                <span>{complete ? "Complete" : `Question ${currentQ + 1} of ${QUESTIONS.length}`}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "oklch(0.18 0.06 250)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))" }}
                />
              </div>
            </div>

            {!complete ? (
              /* Question card */
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ background: "oklch(0.14 0.08 250)", border: "1px solid oklch(1 0 0 / 0.08)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-5 h-5" style={{ color: "oklch(0.72 0.18 65)" }} />
                  <span className="text-xs font-semibold" style={{ color: "oklch(0.72 0.18 65)" }}>
                    Question {currentQ + 1} of {QUESTIONS.length}
                  </span>
                </div>
                <h2 className="font-display font-bold text-white text-xl mb-2">{QUESTIONS[currentQ].text}</h2>
                {QUESTIONS[currentQ].subtext && (
                  <p className="text-sm mb-5" style={{ color: "oklch(0.6 0.04 240)" }}>{QUESTIONS[currentQ].subtext}</p>
                )}
                <div className="space-y-2.5">
                  {QUESTIONS[currentQ].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(QUESTIONS[currentQ].id, opt.value)}
                      className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: "oklch(0.18 0.08 250)",
                        border: "1px solid oklch(1 0 0 / 0.1)",
                        color: "oklch(0.8 0.04 240)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "oklch(0.22 0.10 250)";
                        (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.18 65 / 0.5)";
                        (e.currentTarget as HTMLElement).style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "oklch(0.18 0.08 250)";
                        (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 0.1)";
                        (e.currentTarget as HTMLElement).style.color = "oklch(0.8 0.04 240)";
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {currentQ > 0 && (
                  <button
                    onClick={() => setCurrentQ((q) => q - 1)}
                    className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline"
                    style={{ color: "oklch(0.55 0.04 240)" }}
                  >
                    ← Back
                  </button>
                )}
              </div>
            ) : (
              /* Results */
              <div className="space-y-6">
                {/* Summary */}
                <div
                  className="rounded-2xl p-5 md:p-6"
                  style={{ background: "oklch(0.14 0.08 250)", border: "1px solid oklch(1 0 0 / 0.08)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: eligibleProgrammes.length > 0 ? "oklch(0.72 0.18 65 / 0.15)" : "oklch(0.5 0.04 240 / 0.15)" }}>
                      {eligibleProgrammes.length > 0
                        ? <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(0.72 0.18 65)" }} />
                        : <AlertTriangle className="w-5 h-5" style={{ color: "oklch(0.6 0.04 240)" }} />
                      }
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-white text-lg">
                        {eligibleProgrammes.length > 0
                          ? `You may be eligible for ${eligibleProgrammes.length} programme${eligibleProgrammes.length !== 1 ? "s" : ""}`
                          : "No programmes matched your current profile"
                        }
                      </h2>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.04 240)" }}>
                        Based on your answers. Eligibility is indicative — always check the airline's current requirements.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "oklch(0.72 0.18 65)" }}
                  >
                    ← Start again
                  </button>
                </div>

                {/* Eligible programmes */}
                {eligibleProgrammes.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Programmes you may be eligible for
                    </h3>
                    <div className="space-y-3">
                      {eligibleProgrammes.map((p) => (
                        <ProgrammeResult key={p.id} programme={p} answers={answers} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Ineligible programmes */}
                {ineligibleProgrammes.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2" style={{ color: "oklch(0.7 0.04 240)" }}>
                      <XCircle className="w-4 h-4" style={{ color: "oklch(0.55 0.04 240)" }} />
                      Programmes with eligibility barriers
                    </h3>
                    <div className="space-y-3">
                      {ineligibleProgrammes.map((p) => (
                        <ProgrammeResult key={p.id} programme={p} answers={answers} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "oklch(0.14 0.08 250)", border: "1px solid oklch(1 0 0 / 0.08)" }}
                >
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "oklch(0.72 0.18 65)" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.6 0.04 240)" }}>
                      This tool provides indicative eligibility guidance only. Cadet programme requirements change frequently. Always check the airline's official website for current requirements before applying. Meeting the minimum criteria does not guarantee selection — these programmes are highly competitive.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div
                  className="rounded-2xl p-6 md:p-8 text-center"
                  style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
                >
                  <h3 className="font-display font-bold text-xl text-white mb-2">Want a full personalised roadmap?</h3>
                  <p className="text-sm mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
                    Take the free 10-question AviatorIQ assessment to get a personalised training roadmap, readiness score, and matched flight schools.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/quiz"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline"
                      style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))", boxShadow: "0 0 16px oklch(0.72 0.18 65 / 0.25)" }}
                    >
                      Take the full assessment <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/guides/cadet-pilot-programmes-uk"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline"
                      style={{ background: "oklch(0.45 0.18 240 / 0.15)", color: "oklch(0.75 0.12 240)", border: "1px solid oklch(0.45 0.18 240 / 0.3)" }}
                    >
                      Cadet programmes guide
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
