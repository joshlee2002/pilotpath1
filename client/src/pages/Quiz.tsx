import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Plane } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuizData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  age: string;
  pilotGoal: string;
  seriousness: string;
  spokenToSchool: string;
  preferredRoute: string;
  openToAbroad: string;
  fundingMethod: string;
  budgetRange: string;
  wantsFinanceInfo: string;
  educationLevel: string;
  class1Medical: string;
  flyingExperience: string;
  rightToWorkStudy: string;
  biggestConcern: string;
  startTimeframe: string;
  wantsSchoolContact: string;
  writtenAnswer: string;
  consentToContact: boolean;
  consentToShare: boolean;
}

const EMPTY: QuizData = {
  fullName: "", email: "", phone: "", country: "", city: "", age: "",
  pilotGoal: "", seriousness: "", spokenToSchool: "",
  preferredRoute: "", openToAbroad: "",
  fundingMethod: "", budgetRange: "", wantsFinanceInfo: "",
  educationLevel: "", class1Medical: "", flyingExperience: "", rightToWorkStudy: "",
  biggestConcern: "", startTimeframe: "", wantsSchoolContact: "",
  writtenAnswer: "", consentToContact: false, consentToShare: false,
};

const TOTAL_STEPS = 7;

// ─── Option button ────────────────────────────────────────────────────────────
function OptionButton({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-150 ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)]"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        {label}
      </div>
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
          Step {step} of {total}
        </span>
        <span className="text-xs font-bold text-[var(--color-primary)]">{pct}% complete</span>
      </div>
      <div className="h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────
function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-navy)] mb-2">{title}</h2>
      {subtitle && <p className="text-[var(--color-muted-foreground)] mb-8">{subtitle}</p>}
      {children}
    </div>
  );
}

// ─── Step 1: Basic Details ────────────────────────────────────────────────────
function Step1({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  const countries = [
    "United Kingdom", "United States", "Australia", "Canada", "Ireland",
    "Germany", "France", "Spain", "Netherlands", "New Zealand", "South Africa",
    "UAE", "Singapore", "India", "Other",
  ];

  return (
    <StepCard title="Let's start with the basics" subtitle="Tell us a little about yourself so we can personalise your roadmap.">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Full name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Email address *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Phone number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+44 7700 000000"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Country</label>
            <select
              value={data.country}
              onChange={(e) => update("country", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
            >
              <option value="">Select country…</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">City / nearest airport</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="e.g. London"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Age</label>
          <input
            type="number"
            value={data.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="Your age"
            min="14"
            max="99"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
          />
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 2: Pilot Goal ───────────────────────────────────────────────────────
function Step2({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="What's your pilot goal?" subtitle="This helps us recommend the right training route for you.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What type of pilot do you want to become?</p>
          <div className="space-y-2">
            {["Airline pilot", "Private pilot", "Corporate/private jet pilot", "Flight instructor", "Military pilot", "Not sure yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.pilotGoal === o} onClick={() => update("pilotGoal", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">How serious are you about pilot training?</p>
          <div className="space-y-2">
            {["Just researching", "Interested but unsure", "I want to start within 1-3 years", "I want to start within 12 months", "I want to start as soon as possible"].map((o) => (
              <OptionButton key={o} label={o} selected={data.seriousness === o} onClick={() => update("seriousness", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Have you spoken to a flight school before?</p>
          <div className="space-y-2">
            {["Yes", "No", "I have booked a visit/open day", "I have already applied somewhere"].map((o) => (
              <OptionButton key={o} label={o} selected={data.spokenToSchool === o} onClick={() => update("spokenToSchool", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 3: Training Route ───────────────────────────────────────────────────
function Step3({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Training route preference" subtitle="Not sure of the difference? We'll explain it in your roadmap.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Which training route interests you most?</p>
          <div className="space-y-2">
            {["Integrated ATPL", "Modular ATPL", "PPL only", "I do not know the difference yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.preferredRoute === o} onClick={() => update("preferredRoute", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Are you open to training abroad?</p>
          <div className="space-y-2">
            {["Yes", "No", "Maybe, depending on cost", "I need guidance"].map((o) => (
              <OptionButton key={o} label={o} selected={data.openToAbroad === o} onClick={() => update("openToAbroad", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 4: Finance ──────────────────────────────────────────────────────────
function Step4({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Funding your training" subtitle="This helps us match you with schools that fit your budget and finance needs.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">How do you expect to fund your training?</p>
          <div className="space-y-2">
            {["Self-funded", "Family support", "Loan/finance", "Scholarship", "Employer/airline sponsored", "Unsure"].map((o) => (
              <OptionButton key={o} label={o} selected={data.fundingMethod === o} onClick={() => update("fundingMethod", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What training budget are you realistically working with?</p>
          <div className="space-y-2">
            {["Under £10,000", "£10,000-£25,000", "£25,000-£50,000", "£50,000-£100,000", "£100,000+", "I need finance"].map((o) => (
              <OptionButton key={o} label={o} selected={data.budgetRange === o} onClick={() => update("budgetRange", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Would you like information about finance options?</p>
          <div className="space-y-2">
            {["Yes", "No", "Maybe"].map((o) => (
              <OptionButton key={o} label={o} selected={data.wantsFinanceInfo === o} onClick={() => update("wantsFinanceInfo", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 5: Suitability ──────────────────────────────────────────────────────
function Step5({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Your background" subtitle="This helps us assess your readiness and suggest the most suitable path.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What is your highest education level?</p>
          <div className="space-y-2">
            {["GCSE or equivalent", "A-levels or equivalent", "Degree", "Currently studying", "Other"].map((o) => (
              <OptionButton key={o} label={o} selected={data.educationLevel === o} onClick={() => update("educationLevel", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Do you currently hold a Class 1 Medical?</p>
          <div className="space-y-2">
            {["Yes", "No", "I plan to get one", "I do not know what this is"].map((o) => (
              <OptionButton key={o} label={o} selected={data.class1Medical === o} onClick={() => update("class1Medical", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Have you ever flown an aircraft?</p>
          <div className="space-y-2">
            {["No", "Trial lesson/discovery flight", "PPL student", "PPL holder", "Other licence/rating"].map((o) => (
              <OptionButton key={o} label={o} selected={data.flyingExperience === o} onClick={() => update("flyingExperience", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Do you have the right to study/work in your chosen training country?</p>
          <div className="space-y-2">
            {["Yes", "No", "Unsure"].map((o) => (
              <OptionButton key={o} label={o} selected={data.rightToWorkStudy === o} onClick={() => update("rightToWorkStudy", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 6: Intent ───────────────────────────────────────────────────────────
function Step6({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Your timeline and concerns" subtitle="Almost done — just a few more questions to complete your profile.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What is your biggest concern about becoming a pilot?</p>
          <div className="space-y-2">
            {["Cost", "Medical requirements", "Finding the right school", "Getting a job after training", "Age", "Academic requirements", "I do not know where to start"].map((o) => (
              <OptionButton key={o} label={o} selected={data.biggestConcern === o} onClick={() => update("biggestConcern", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">When would you like to start training?</p>
          <div className="space-y-2">
            {["Immediately", "Within 3 months", "Within 6 months", "Within 12 months", "1-3 years", "Just researching"].map((o) => (
              <OptionButton key={o} label={o} selected={data.startTimeframe === o} onClick={() => update("startTimeframe", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Would you like suitable flight schools to contact you?</p>
          <div className="space-y-2">
            {["Yes", "No"].map((o) => (
              <OptionButton key={o} label={o} selected={data.wantsSchoolContact === o} onClick={() => update("wantsSchoolContact", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 7: AI Answer + Consent ─────────────────────────────────────────────
function Step7({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string | boolean) => void }) {
  return (
    <StepCard title="Almost there" subtitle="One optional question, then your consent and you're done.">
      <div className="space-y-8">
        {/* Optional AI question */}
        <div className="p-5 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-2">
            Optional: Tell us in your own words
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
            Why do you want to become a pilot, and what is stopping you from starting? Your answer helps us give you better guidance.
          </p>
          <textarea
            value={data.writtenAnswer}
            onChange={(e) => update("writtenAnswer", e.target.value)}
            rows={4}
            placeholder="Write as much or as little as you like…"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white resize-none"
          />
        </div>

        {/* Consent */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-[var(--color-navy)]">Your consent</h3>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                data.consentToContact
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                  : "border-[var(--color-border)] group-hover:border-[var(--color-primary)]"
              }`}
              onClick={() => update("consentToContact", !data.consentToContact)}
            >
              {data.consentToContact && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-[var(--color-foreground)] leading-relaxed">
              <strong>Required:</strong> I agree to PilotPath storing my answers and contacting me about pilot training options. I also agree that PilotPath may share my details with relevant flight schools or training partners where I have requested introductions.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                data.consentToShare
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                  : "border-[var(--color-border)] group-hover:border-[var(--color-primary)]"
              }`}
              onClick={() => update("consentToShare", !data.consentToShare)}
            >
              {data.consentToShare && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-[var(--color-foreground)] leading-relaxed">
              Optional: I am happy for PilotPath to use my anonymised data to improve its school matching and guidance services.
            </span>
          </label>

          <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
            Your data is stored securely and never sold. You can request deletion at any time by contacting us. See our{" "}
            <a href="/privacy" className="text-[var(--color-primary)] underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────
export default function Quiz() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>(EMPTY);
  const [started, setStarted] = useState(false);
  const [, navigate] = useLocation();

  const submitMutation = trpc.leads.submit.useMutation({
    onSuccess: (result) => {
      Analytics.quizCompleted();
      Analytics.leadSubmitted(result.score, result.category);
      if (result.category === "Hot") {
        Analytics.hotLeadGenerated(data.country);
      }
      navigate(`/results/${result.leadId}`);
    },
  });

  const update = useCallback((key: keyof QuizData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleStart = () => {
    setStarted(true);
    Analytics.quizStarted();
  };

  const canAdvance = () => {
    if (step === 1) return data.fullName.trim().length >= 2 && data.email.includes("@");
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!data.consentToContact) return;
    submitMutation.mutate({
      ...data,
      age: data.age ? parseInt(data.age, 10) : undefined,
    });
  };

  // Landing / intro screen
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <main className="flex-1 bg-sky-subtle flex items-center justify-center py-16 px-4">
          <div className="max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-4">
              Free Pilot Career Assessment
            </h1>
            <p className="text-lg text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
              Answer 15–20 questions about your goals, budget and background. Get a personalised pilot training roadmap and be matched with suitable flight schools.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "5 minutes", sub: "to complete" },
                { label: "100% free", sub: "no payment" },
                { label: "AI roadmap", sub: "personalised" },
              ].map((item) => (
                <div key={item.label} className="card-base p-4 text-center">
                  <div className="font-display font-bold text-[var(--color-primary)] text-lg">{item.label}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">{item.sub}</div>
                </div>
              ))}
            </div>
            <button onClick={handleStart} className="btn-cta w-full text-base py-4">
              Start the assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-4">
              No registration required. Your data is handled in accordance with our Privacy Policy.
            </p>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1 data={data} update={update as (k: keyof QuizData, v: string) => void} />,
    2: <Step2 data={data} update={update as (k: keyof QuizData, v: string) => void} />,
    3: <Step3 data={data} update={update as (k: keyof QuizData, v: string) => void} />,
    4: <Step4 data={data} update={update as (k: keyof QuizData, v: string) => void} />,
    5: <Step5 data={data} update={update as (k: keyof QuizData, v: string) => void} />,
    6: <Step6 data={data} update={update as (k: keyof QuizData, v: string) => void} />,
    7: <Step7 data={data} update={update} />,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 bg-sky-subtle py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <ProgressBar step={step} total={TOTAL_STEPS} />
          <div className="card-base p-6 md:p-10 mb-6">
            {stepComponents[step]}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="btn-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!data.consentToContact || submitMutation.isPending}
                className="btn-cta text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating your roadmap…
                  </>
                ) : (
                  <>
                    Get my pilot roadmap
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {submitMutation.isError && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              Something went wrong. Please check your details and try again.
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
