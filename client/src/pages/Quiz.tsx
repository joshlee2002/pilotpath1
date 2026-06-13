import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Plane, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuizData {
  // Step 1 — Contact details
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  age: string;
  // Step 2 — Goal & commitment
  pilotGoal: string;
  seriousness: string;
  spokenToSchool: string;
  // Step 3 — Barriers (the real questions)
  biggestConcern: string;
  // Step 4 — Training route
  preferredRoute: string;
  openToAbroad: string;
  // Step 5 — Finance (can they afford it?)
  fundingMethod: string;
  budgetRange: string;
  wantsFinanceInfo: string;
  // Step 6 — Background & medical
  educationLevel: string;
  class1Medical: string;
  flyingExperience: string;
  rightToWorkStudy: string;
  // Step 7 — Consent & context
  startTimeframe: string;
  wantsSchoolContact: string;
  preferredContact: string;
  contactConsentSchools: boolean;
  contactConsentFinance: boolean;
  contactConsentMedical: boolean;
  contactConsentPartners: boolean;
  writtenAnswer: string;
  consentToContact: boolean;
  consentToShare: boolean;
  source: string;
}

const EMPTY: QuizData = {
  fullName: "", email: "", phone: "", country: "", city: "", age: "",
  pilotGoal: "", seriousness: "", spokenToSchool: "",
  biggestConcern: "",
  preferredRoute: "", openToAbroad: "",
  fundingMethod: "", budgetRange: "", wantsFinanceInfo: "",
  educationLevel: "", class1Medical: "", flyingExperience: "", rightToWorkStudy: "",
  startTimeframe: "", wantsSchoolContact: "", preferredContact: "",
  contactConsentSchools: true, contactConsentFinance: false, contactConsentMedical: false, contactConsentPartners: false,
  writtenAnswer: "", consentToContact: false, consentToShare: false,
  source: "",
};

const TOTAL_STEPS = 7;

// ─── Option button ────────────────────────────────────────────────────────────
function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
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
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]" : "border-[var(--color-border)]"}`}>
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
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">Step {step} of {total}</span>
        <span className="text-xs font-bold text-[var(--color-primary)]">{pct}% complete</span>
      </div>
      <div className="h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
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

// ─── Inline field error ───────────────────────────────────────────────────────
function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5" role="alert">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

// ─── Step 1: Contact details ──────────────────────────────────────────────────
function Step1({
  data,
  update,
  showErrors,
}: {
  data: QuizData;
  update: (k: keyof QuizData, v: string) => void;
  showErrors: boolean;
}) {
  const [touchedAge, setTouchedAge] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedName, setTouchedName] = useState(false);

  const countries = [
    "United Kingdom", "Ireland", "United States", "Canada", "Australia", "New Zealand",
    "Germany", "France", "Spain", "Netherlands", "Sweden", "Norway", "Denmark",
    "South Africa", "UAE", "Singapore", "India", "Other",
  ];

  // Validation helpers
  const nameError = (touchedName || showErrors) && data.fullName.trim().length < 2
    ? "Please enter your full name (at least 2 characters)."
    : null;

  const emailError = (touchedEmail || showErrors) && !data.email.includes("@")
    ? "Please enter a valid email address."
    : null;

  const ageNum = data.age ? parseInt(data.age, 10) : null;
  const ageError = (touchedAge || showErrors) && data.age !== ""
    ? (isNaN(ageNum!) || ageNum! < 14 || ageNum! > 99
        ? "Age must be between 14 and 99."
        : null)
    : null;

  const nameInvalid = !!(touchedName || showErrors) && data.fullName.trim().length < 2;
  const emailInvalid = !!(touchedEmail || showErrors) && !data.email.includes("@");
  const ageInvalid = !!(touchedAge || showErrors) && data.age !== "" && (isNaN(ageNum!) || ageNum! < 14 || ageNum! > 99);

  return (
    <StepCard title="Let's start with you" subtitle="Your roadmap will be personalised to your profile. We'll never share your details without your permission.">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Full name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            onBlur={() => setTouchedName(true)}
            placeholder="Your full name"
            aria-invalid={nameInvalid}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm transition-colors bg-white ${
              nameInvalid
                ? "border-red-400 focus:border-red-500"
                : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
            }`}
          />
          {nameError && <FieldError message={nameError} />}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Email address *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => setTouchedEmail(true)}
            placeholder="your@email.com"
            aria-invalid={emailInvalid}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm transition-colors bg-white ${
              emailInvalid
                ? "border-red-400 focus:border-red-500"
                : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
            }`}
          />
          {emailError
            ? <FieldError message={emailError} />
            : <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Your roadmap will be sent here.</p>
          }
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Country</label>
            <select
              value={data.country}
              onChange={(e) => update("country", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white"
            >
              <option value="">Select country</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Helps us tailor school matches.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-2">Age</label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => update("age", e.target.value)}
              onBlur={() => setTouchedAge(true)}
              placeholder="e.g. 25"
              min="14"
              max="99"
              aria-invalid={ageInvalid}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm transition-colors bg-white ${
                ageInvalid
                  ? "border-red-400 focus:border-red-500"
                  : "border-[var(--color-border)] focus:border-[var(--color-primary)]"
              }`}
            />
            {ageError
              ? <FieldError message={ageError} />
              : <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Must be 14–99.</p>
            }
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 2: Goal & commitment ────────────────────────────────────────────────
function Step2({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Your goal and where you are now" subtitle="Honest answers lead to better guidance.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What type of pilot do you want to become?</p>
          <div className="space-y-2">
            {["Airline pilot (commercial)", "Private pilot (for fun)", "Corporate / private jet pilot", "Flight instructor", "Military pilot", "Not sure yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.pilotGoal === o} onClick={() => update("pilotGoal", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What have you actually done about it so far?</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">This is one of the most useful questions — be honest.</p>
          <div className="space-y-2">
            {[
              "I've applied to a flight school",
              "I've visited a flight school or attended an open day",
              "I've done a trial lesson",
              "I've researched schools and training routes",
              "I've watched videos and read forums",
              "Mostly just thought about it",
            ].map((o) => (
              <OptionButton key={o} label={o} selected={data.spokenToSchool === o} onClick={() => update("spokenToSchool", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 3: Barriers — the real questions ────────────────────────────────────
function Step3({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="What's really stopping you?" subtitle="This is the most important question in the assessment. Your answer shapes everything that follows.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">If a flight school offered you a place tomorrow, what would stop you starting?</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Pick the one that feels most true right now.</p>
          <div className="space-y-2">
            {[
              "The cost — I can't fund it",
              "I'm not sure I could actually do it",
              "I'm worried about passing the medical",
              "I don't have the time right now",
              "I think I might be too old",
              "I'd be risking too much (career, income, stability)",
              "I have too many unanswered questions",
              "Nothing — I'm ready to start",
            ].map((o) => (
              <OptionButton key={o} label={o} selected={data.biggestConcern === o} onClick={() => update("biggestConcern", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">How often do you think about becoming a pilot?</p>
          <div className="space-y-2">
            {[
              "Every day — it's always on my mind",
              "Most weeks",
              "Occasionally",
              "Rarely — I'm just exploring",
            ].map((o) => (
              <OptionButton key={o} label={o} selected={data.seriousness === o} onClick={() => update("seriousness", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 4: Training route ───────────────────────────────────────────────────
function Step4({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Training route" subtitle="Not sure of the difference between integrated and modular? We'll explain it in your roadmap.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Which training route interests you most?</p>
          <div className="space-y-2">
            {[
              "Integrated ATPL (full-time, 18–24 months, £80k–£120k)",
              "Modular ATPL (part-time, 3–5 years, £40k–£80k)",
              "PPL only (private licence, £8k–£15k)",
              "I don't know the difference yet",
            ].map((o) => (
              <OptionButton key={o} label={o} selected={data.preferredRoute === o} onClick={() => update("preferredRoute", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Are you open to training abroad?</p>
          <div className="space-y-2">
            {["Yes — I'd consider it for the right school", "No — I want to train in my home country", "Maybe, depending on cost", "I need guidance on this"].map((o) => (
              <OptionButton key={o} label={o} selected={data.openToAbroad === o} onClick={() => update("openToAbroad", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 5: Finance ──────────────────────────────────────────────────────────
function Step5({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Can you afford it?" subtitle="This is one of the 10 questions aspiring pilots ask most. Let's be honest about your situation.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">How do you expect to fund your training?</p>
          <div className="space-y-2">
            {["Self-funded from savings", "Family support", "Career development loan or finance", "Airline cadet sponsorship", "Scholarship", "I haven't figured this out yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.fundingMethod === o} onClick={() => update("fundingMethod", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What training budget are you realistically working with?</p>
          <div className="space-y-2">
            {["Under £10,000", "£10,000–£25,000", "£25,000–£50,000", "£50,000–£100,000", "£100,000+", "I need finance — I don't have savings"].map((o) => (
              <OptionButton key={o} label={o} selected={data.budgetRange === o} onClick={() => update("budgetRange", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Would you like information about finance options?</p>
          <div className="space-y-2">
            {["Yes — please include this", "No", "Maybe"].map((o) => (
              <OptionButton key={o} label={o} selected={data.wantsFinanceInfo === o} onClick={() => update("wantsFinanceInfo", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 6: Background & medical ────────────────────────────────────────────
function Step6({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string) => void }) {
  return (
    <StepCard title="Your background" subtitle="This helps us assess your readiness and flag anything that needs attention.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Have you ever been in the cockpit?</p>
          <div className="space-y-2">
            {[
              "Never — complete beginner",
              "I've done a trial lesson or two",
              "I hold a PPL or LAPL",
              "I have 50+ hours of flight time",
              "I hold a commercial licence",
            ].map((o) => (
              <OptionButton key={o} label={o} selected={data.flyingExperience === o} onClick={() => update("flyingExperience", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">How confident are you about passing a Class 1 medical?</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Required for commercial flying. Most people pass — but uncertainty is common.</p>
          <div className="space-y-2">
            {[
              "I already hold a Class 1 medical",
              "No concerns — I'm in good health",
              "Minor concerns but probably fine",
              "I genuinely don't know",
              "I have significant concerns",
            ].map((o) => (
              <OptionButton key={o} label={o} selected={data.class1Medical === o} onClick={() => update("class1Medical", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Do you have the right to study or work in your chosen training country?</p>
          <div className="space-y-2">
            {["Yes", "No", "Unsure"].map((o) => (
              <OptionButton key={o} label={o} selected={data.rightToWorkStudy === o} onClick={() => update("rightToWorkStudy", o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">What is your highest education level?</p>
          <div className="space-y-2">
            {["GCSE or equivalent", "A-levels or equivalent", "Degree", "Currently studying", "Other"].map((o) => (
              <OptionButton key={o} label={o} selected={data.educationLevel === o} onClick={() => update("educationLevel", o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 7: Timeline, contact & consent ─────────────────────────────────────
function Step7({ data, update }: { data: QuizData; update: (k: keyof QuizData, v: string | boolean) => void }) {
  return (
    <StepCard title="Almost there" subtitle="One final section, then your personalised roadmap is ready.">
      <div className="space-y-8">
        {/* Timeline */}
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">When do you want to start training?</p>
          <div className="space-y-2">
            {["As soon as possible — I'm ready now", "Within the next 12 months", "In the next 1–3 years", "Someday — no fixed timeline", "I'm not sure yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.startTimeframe === o} onClick={() => update("startTimeframe", o)} />
            ))}
          </div>
        </div>

        {/* School contact */}
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Would you like suitable flight schools to contact you?</p>
          <div className="space-y-2">
            {["Yes", "No"].map((o) => (
              <OptionButton key={o} label={o} selected={data.wantsSchoolContact === o} onClick={() => update("wantsSchoolContact", o)} />
            ))}
          </div>
        </div>

        {/* Preferred contact */}
        {data.wantsSchoolContact === "Yes" && (
          <div>
            <p className="text-sm font-semibold text-[var(--color-foreground)] mb-3">Preferred contact method</p>
            <div className="space-y-2">
              {["Email", "Phone", "WhatsApp", "Any"].map((o) => (
                <OptionButton key={o} label={o} selected={data.preferredContact === o} onClick={() => update("preferredContact", o)} />
              ))}
            </div>
          </div>
        )}

        {/* Optional written answer */}
        <div className="p-5 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-2">Optional: In your own words</p>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
            Why do you want to become a pilot, and what is the one thing that's really holding you back? Your answer helps us give you better guidance.
          </p>
          <textarea
            value={data.writtenAnswer}
            onChange={(e) => update("writtenAnswer", e.target.value)}
            rows={4}
            placeholder="Write as much or as little as you like…"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white resize-none"
          />
        </div>

        {/* Contact consent */}
        <div className="p-5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-1">Who are you happy to be contacted by?</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Optional — tick all that apply.</p>
          <div className="space-y-2">
            {([
              { key: "contactConsentSchools" as const, label: "Flight schools" },
              { key: "contactConsentFinance" as const, label: "Pilot training finance providers" },
              { key: "contactConsentMedical" as const, label: "Aviation medical examiners" },
              { key: "contactConsentPartners" as const, label: "Training partners (ground schools, simulators)" },
            ]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${data[key] ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)]"}`}
                  onClick={() => update(key, !data[key])}
                >
                  {data[key] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-[var(--color-foreground)]">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="p-5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-1">How did you hear about AviatorIQ?</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Optional.</p>
          <div className="grid grid-cols-2 gap-2">
            {["Google / Search", "Instagram", "Facebook", "Reddit", "YouTube", "A friend", "Forum / Community", "Other"].map((opt) => (
              <button key={opt} type="button" onClick={() => update("source", data.source === opt ? "" : opt)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors text-left ${data.source === opt ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 text-[var(--color-foreground)]"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div className="p-5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-1">Phone number <span className="font-normal text-[var(--color-muted-foreground)]">(optional)</span></p>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Only used if a school or our team needs to reach you directly. Never shared without your permission.</p>
          <input type="tel" value={data.phone as string} onChange={(e) => update("phone", e.target.value)} placeholder="+44 7700 000000"
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none text-sm transition-colors bg-white" />
        </div>

        {/* Consent */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-[var(--color-navy)]">Your consent</h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${data.consentToContact ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-[var(--color-border)] group-hover:border-[var(--color-primary)]"}`}
              onClick={() => update("consentToContact", !data.consentToContact)}
            >
              {data.consentToContact && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-[var(--color-foreground)] leading-relaxed">
              <strong>Required:</strong> I agree to AviatorIQ storing my answers and contacting me about pilot training options. I also agree that AviatorIQ may share my details with relevant flight schools or training partners where I have requested introductions.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${data.consentToShare ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-[var(--color-border)] group-hover:border-[var(--color-primary)]"}`}
              onClick={() => update("consentToShare", !data.consentToShare)}
            >
              {data.consentToShare && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-[var(--color-foreground)] leading-relaxed">
              Optional: I am happy for AviatorIQ to use my anonymised data to improve its school matching and guidance services.
            </span>
          </label>
          <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
            Your data is stored securely and never sold. You can request deletion at any time.{" "}
            <a href="/privacy" className="text-[var(--color-primary)] underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────
export default function Quiz() {
  useEffect(() => {
    document.title = "Free Pilot Career Assessment – AviatorIQ";
  }, []);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>(EMPTY);
  const [started, setStarted] = useState(false);
  const [showStep1Errors, setShowStep1Errors] = useState(false);
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
    if (step === 1 && !canAdvance()) {
      setShowStep1Errors(true);
      return;
    }
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
      source: data.source || undefined,
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
              Career Readiness Assessment
            </h1>
            <p className="text-lg text-[var(--color-muted-foreground)] mb-3 leading-relaxed">
              10 minutes. We'll identify your biggest barrier, your strongest asset, and give you a personalised training roadmap — not generic advice.
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
              Most people who take this assessment say the result describes them better than they expected. That's the point.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "10 minutes", sub: "to complete" },
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
    1: <Step1 data={data} update={update as (k: keyof QuizData, v: string) => void} showErrors={showStep1Errors} />,
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
            <button onClick={handleBack} disabled={step === 1} className="btn-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {step < TOTAL_STEPS ? (
              <button onClick={handleNext} className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!data.consentToContact || submitMutation.isPending} className="btn-cta text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                {submitMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Generating your roadmap…</>
                ) : (
                  <>Get my pilot roadmap<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
          {submitMutation.isError && (
            <p className="text-red-500 text-sm text-center mt-4">Something went wrong. Please try again.</p>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
