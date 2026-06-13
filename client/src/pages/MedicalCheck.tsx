import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, ChevronRight, ChevronLeft, Heart, AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface Question {
  id: string;
  text: string;
  subtext?: string;
  options: { label: string; value: string; risk: number; flag?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "vision",
    text: "How is your uncorrected vision?",
    subtext: "The CAA requires minimum uncorrected visual acuity. Corrected vision (glasses/contacts) is acceptable.",
    options: [
      { label: "Good — no glasses or contacts needed", value: "good", risk: 0 },
      { label: "I wear glasses or contact lenses", value: "corrected", risk: 0 },
      { label: "I've had laser eye surgery", value: "laser", risk: 1, flag: "Laser eye surgery is accepted by the CAA after a suitable recovery period (typically 12 months). Mention this to your AME." },
      { label: "I have a significant eye condition", value: "condition", risk: 3, flag: "Certain eye conditions can affect Class 1 medical eligibility. Consult an AME before committing to training." },
    ],
  },
  {
    id: "heart",
    text: "Do you have any known cardiovascular conditions?",
    subtext: "Heart conditions are assessed carefully for pilot medicals.",
    options: [
      { label: "No known heart conditions", value: "none", risk: 0 },
      { label: "I have high blood pressure (controlled by medication)", value: "bp_meds", risk: 2, flag: "Controlled hypertension is often acceptable but requires careful AME assessment. Some medications are permitted, others are not." },
      { label: "I have high blood pressure (uncontrolled)", value: "bp_uncontrolled", risk: 3, flag: "Uncontrolled hypertension is likely to prevent Class 1 certification until managed. See a GP first." },
      { label: "I have or have had a more serious heart condition", value: "serious", risk: 4, flag: "Serious cardiovascular conditions require specialist AME assessment. Some conditions can be accommodated with an OML (Operational Multi-crew Limitation)." },
    ],
  },
  {
    id: "mental",
    text: "Have you ever been diagnosed with a mental health condition?",
    subtext: "The CAA assesses mental health on a case-by-case basis. Many conditions are manageable.",
    options: [
      { label: "No mental health diagnoses", value: "none", risk: 0 },
      { label: "Mild anxiety or depression, no medication", value: "mild_no_meds", risk: 1, flag: "Mild, well-controlled anxiety or depression without medication is often acceptable. Be honest with your AME." },
      { label: "Anxiety or depression, currently on medication", value: "meds", risk: 2, flag: "Some antidepressants (SSRIs) are now accepted by the CAA. Others are not. Your AME will advise based on your specific medication and history." },
      { label: "More significant mental health history", value: "significant", risk: 3, flag: "More complex mental health history requires specialist assessment. Consult an AME before starting training — it may still be possible." },
    ],
  },
  {
    id: "diabetes",
    text: "Do you have diabetes?",
    options: [
      { label: "No", value: "none", risk: 0 },
      { label: "Diet-controlled diabetes", value: "diet", risk: 1, flag: "Diet-controlled diabetes is often acceptable for Class 1 medical. Disclose to your AME." },
      { label: "Tablet-controlled diabetes", value: "tablets", risk: 2, flag: "Tablet-controlled diabetes may be acceptable with an OML. Requires specialist AME assessment." },
      { label: "Insulin-dependent diabetes", value: "insulin", risk: 4, flag: "Insulin-dependent diabetes is generally incompatible with Class 1 medical certification. Consult an AME for the latest guidance as regulations do evolve." },
    ],
  },
  {
    id: "hearing",
    text: "How is your hearing?",
    options: [
      { label: "Normal hearing", value: "normal", risk: 0 },
      { label: "Mild hearing loss", value: "mild", risk: 1, flag: "Mild hearing loss may be acceptable depending on the degree. An AME will conduct an audiometric test." },
      { label: "Significant hearing loss or hearing aids", value: "significant", risk: 3, flag: "Significant hearing loss is likely to affect Class 1 eligibility. Consult an AME before committing to training." },
    ],
  },
  {
    id: "neuro",
    text: "Do you have any neurological conditions?",
    subtext: "This includes epilepsy, seizures, migraines, head injuries, or neurological diagnoses.",
    options: [
      { label: "No neurological conditions", value: "none", risk: 0 },
      { label: "History of migraines (well controlled)", value: "migraine", risk: 1, flag: "Well-controlled migraines without aura are often acceptable. Migraines with aura require more careful assessment." },
      { label: "History of seizures or epilepsy", value: "epilepsy", risk: 4, flag: "Epilepsy and seizure history is a significant barrier to Class 1 certification. Consult an AME — some cases can be accommodated after a seizure-free period." },
      { label: "Other neurological condition", value: "other", risk: 3, flag: "Neurological conditions are assessed individually. Consult an AME before committing to training." },
    ],
  },
  {
    id: "bmi",
    text: "How would you describe your current weight and fitness?",
    options: [
      { label: "Healthy weight and reasonably fit", value: "good", risk: 0 },
      { label: "Slightly overweight but otherwise healthy", value: "overweight", risk: 1, flag: "Mild overweight is not automatically disqualifying but the AME will assess your overall health. A healthy BMI is beneficial." },
      { label: "Significantly overweight or obese", value: "obese", risk: 2, flag: "Significant obesity can affect Class 1 eligibility due to associated health risks. Weight management before your medical is advisable." },
    ],
  },
];

type Answers = Record<string, string>;

function getResult(answers: Answers, questions: Question[]) {
  let totalRisk = 0;
  const flags: string[] = [];

  for (const q of questions) {
    const ans = answers[q.id];
    if (!ans) continue;
    const opt = q.options.find((o) => o.value === ans);
    if (opt) {
      totalRisk += opt.risk;
      if (opt.flag) flags.push(opt.flag);
    }
  }

  let level: "green" | "amber" | "red";
  if (totalRisk <= 1) level = "green";
  else if (totalRisk <= 5) level = "amber";
  else level = "red";

  return { totalRisk, flags, level };
}

const RESULT_COPY = {
  green: {
    title: "Your medical profile looks straightforward",
    summary:
      "Based on your answers, you don't have any obvious red flags that would prevent you from obtaining a Class 1 medical. This is not a guarantee — only a CAA-approved AME can make that determination — but your profile suggests you should proceed with confidence.",
    colour: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    advice: "Book your Class 1 medical with a CAA-approved AME before committing to expensive training. It's the most important first step.",
  },
  amber: {
    title: "Some factors worth discussing with an AME",
    summary:
      "Your answers flag one or more areas that require careful assessment. This does not mean you cannot get a Class 1 medical — many pilots fly with conditions that require management or an OML. However, you should consult a CAA-approved AME before committing to training.",
    colour: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    advice: "Speak to a CAA-approved AME before starting training. An initial consultation (often £150–£300) can clarify your position before you commit to any costs.",
  },
  red: {
    title: "We recommend speaking to an AME before committing to training",
    summary:
      "Your answers suggest one or more factors that could significantly affect your Class 1 medical eligibility. This does not necessarily mean you cannot become a pilot — regulations evolve and individual cases vary — but you should get specialist AME advice before spending money on training.",
    colour: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    advice: "Book an AME consultation as your first step. Do not commit to training costs until you have clarity on your medical eligibility.",
  },
};

const DISCLAIMER =
  "This tool is for general guidance only and does not constitute medical advice. Only a CAA-approved Aeromedical Examiner (AME) can assess your eligibility for a Class 1 medical certificate. Always consult a qualified AME before making financial commitments to pilot training.";

export default function MedicalCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string | null>(null);

  const isIntro = step === 0;
  const isResult = step === QUESTIONS.length + 1;
  const currentQ = !isIntro && !isResult ? QUESTIONS[step - 1] : null;
  const progress = isResult ? 100 : Math.round((step / (QUESTIONS.length + 1)) * 100);

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

  const result = isResult ? getResult(answers, QUESTIONS) : null;
  const resultCopy = result ? RESULT_COPY[result.level] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Class 1 Medical Readiness Check | AviatorIQ"
        description="Answer 7 questions and find out if your health profile is likely to be compatible with a CAA Class 1 medical certificate. Free, confidential, no registration required."
        canonical="/tools/class-1-medical-check"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Class 1 Medical Readiness Check",
          description: "Free tool to assess whether your health profile is compatible with a CAA Class 1 medical certificate",
          url: "https://aviatoriq.com/tools/class-1-medical-check",
          applicationCategory: "HealthApplication",
        }}
      />
      <PublicNav />
      <main className="flex-1 bg-sky-subtle py-10 px-4">
        <div className="container max-w-2xl">

          {/* Intro */}
          {isIntro && (
            <div className="card-base p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                <Heart className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-navy)] mb-3">
                Class 1 Medical Readiness Check
              </h1>
              <p className="text-[var(--color-muted-foreground)] mb-4 max-w-md mx-auto">
                The Class 1 medical is the biggest unknown for many aspiring pilots. Answer 7 questions and find out if your health profile is likely to be compatible — before you commit to expensive training.
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left mb-8 max-w-md mx-auto">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{DISCLAIMER}</p>
                </div>
              </div>
              <button onClick={handleNext} className="btn-cta">
                Start the check
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Question */}
          {currentQ && (
            <div className="card-base p-8">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mb-1.5">
                  <span>Question {step} of {QUESTIONS.length}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-500"
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
                    onClick={() => setSelected(opt.value)}
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
                  {step === QUESTIONS.length ? "See my result" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {isResult && result && resultCopy && (
            <div className="space-y-5">
              {/* Verdict */}
              <div className={`card-base p-6 border-2 ${resultCopy.bg}`}>
                <div className="flex items-start gap-3 mb-3">
                  {resultCopy.icon}
                  <h2 className={`font-display font-bold text-xl ${resultCopy.colour}`}>{resultCopy.title}</h2>
                </div>
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{resultCopy.summary}</p>
              </div>

              {/* Flags */}
              {result.flags.length > 0 && (
                <div className="card-base p-6">
                  <h3 className="font-display font-bold text-[var(--color-navy)] mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[var(--color-primary)]" />
                    Areas to discuss with your AME
                  </h3>
                  <ul className="space-y-3">
                    {result.flags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)] p-3 rounded-lg bg-[var(--color-muted)]/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Advice */}
              <div className="card-base p-6 bg-[var(--color-navy)] text-white">
                <h3 className="font-display font-bold text-lg mb-2">Recommended next step</h3>
                <p className="text-white/80 text-sm mb-5">{resultCopy.advice}</p>
                <Link href="/quiz" className="btn-cta mb-3 w-full justify-center">
                  Take the full pilot assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setStep(0); setAnswers({}); setSelected(null); }}
                  className="text-sm text-white/60 hover:text-white transition-colors w-full text-center"
                >
                  Start over
                </button>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[var(--color-muted-foreground)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--color-muted-foreground)]">{DISCLAIMER}</p>
                </div>
              </div>

              {/* Read the guide */}
              <div className="flex items-center justify-center">
                <Link
                  href="/guides/class-1-medical"
                  className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:text-[var(--color-navy)] transition-colors"
                >
                  Read the full Class 1 Medical guide
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
