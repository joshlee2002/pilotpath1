import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Plane, AlertCircle, Shield, Clock, Star } from "lucide-react";

// ─── Auto-advance helper ──────────────────────────────────────────────────────
// Returns an updater that sets the field AND calls onAdvance after a short delay
function useAutoAdvance(update: (k: keyof QuizData, v: string) => void, onAdvance: () => void) {
  return useCallback((key: keyof QuizData, value: string) => {
    update(key, value);
    // Small delay so the selected state renders before advancing
    setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance]);
}

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
  biggestConcern: string;
  preferredRoute: string;
  openToAbroad: string;
  fundingMethod: string;
  budgetRange: string;
  wantsFinanceInfo: string;
  educationLevel: string;
  class1Medical: string;
  flyingExperience: string;
  rightToWorkStudy: string;
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

// ─── Dark Option Button ───────────────────────────────────────────────────────
function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 font-medium text-sm ${
        selected
          ? "border-[oklch(0.55_0.18_240)] bg-[oklch(0.55_0.18_240/0.15)] text-white shadow-[0_0_20px_oklch(0.55_0.18_240/0.2)]"
          : "border-[oklch(1_0_0/0.1)] bg-[oklch(1_0_0/0.04)] text-[oklch(0.85_0_0)] hover:border-[oklch(0.55_0.18_240/0.5)] hover:bg-[oklch(0.55_0.18_240/0.08)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          selected ? "border-[oklch(0.55_0.18_240)] bg-[oklch(0.55_0.18_240)]" : "border-[oklch(1_0_0/0.3)]"
        }`}>
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
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[oklch(0.6_0_0)] uppercase tracking-widest">Step {step} of {total}</span>
        <span className="text-xs font-bold text-[oklch(0.55_0.18_240)]">{pct}% complete</span>
      </div>
      <div className="h-1.5 bg-[oklch(1_0_0/0.08)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, oklch(0.55 0.18 240), oklch(0.65 0.18 200))"
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i + 1 <= step ? "bg-[oklch(0.55_0.18_240)]" : "bg-[oklch(1_0_0/0.15)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────
function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-[oklch(0.65_0_0)] mb-8 leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  );
}

// ─── Field Error ──────────────────────────────────────────────────────────────
function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5" role="alert">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

// ─── Dark Input ───────────────────────────────────────────────────────────────
function DarkInput({ label, type = "text", value, onChange, onBlur, placeholder, hint, error, min, max }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  onBlur?: () => void; placeholder?: string; hint?: string; error?: string | null; min?: string; max?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[oklch(0.85_0_0)] mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-[oklch(1_0_0/0.05)] text-white placeholder-[oklch(0.5_0_0)] ${
          error
            ? "border-red-500/60 focus:border-red-400"
            : "border-[oklch(1_0_0/0.12)] focus:border-[oklch(0.55_0.18_240)] focus:bg-[oklch(0.55_0.18_240/0.05)]"
        }`}
      />
      {error ? <FieldError message={error} /> : hint && <p className="text-xs text-[oklch(0.5_0_0)] mt-1.5">{hint}</p>}
    </div>
  );
}

// ─── Dark Select ──────────────────────────────────────────────────────────────
function DarkSelect({ label, value, onChange, options, hint }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[oklch(0.85_0_0)] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[oklch(1_0_0/0.12)] focus:border-[oklch(0.55_0.18_240)] outline-none text-sm transition-all bg-[oklch(0.12_0_0)] text-white"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hint && <p className="text-xs text-[oklch(0.5_0_0)] mt-1.5">{hint}</p>}
    </div>
  );
}

// ─── Step 1: Contact details ──────────────────────────────────────────────────
function Step1({ data, update, showErrors }: { data: QuizData; update: (k: keyof QuizData, v: string) => void; showErrors: boolean }) {
  const [touchedAge, setTouchedAge] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedName, setTouchedName] = useState(false);

  const countries = ["United Kingdom","Ireland","United States","Canada","Australia","New Zealand","Germany","France","Spain","Netherlands","Sweden","Norway","Denmark","South Africa","UAE","Singapore","India","Other"];

  const nameError = (touchedName || showErrors) && data.fullName.trim().length < 2 ? "Please enter your full name." : null;
  const emailError = (touchedEmail || showErrors) && !data.email.includes("@") ? "Please enter a valid email address." : null;
  const ageNum = data.age ? parseInt(data.age, 10) : null;
  const ageError = (touchedAge || showErrors) && data.age !== "" && (isNaN(ageNum!) || ageNum! < 14 || ageNum! > 99) ? "Age must be between 14 and 99." : null;

  return (
    <StepCard title="Let's start with you" subtitle="Your roadmap will be personalised to your exact profile. We'll never share your details without your permission.">
      <div className="space-y-5">
        <DarkInput label="Full name *" value={data.fullName} onChange={(v) => update("fullName", v)} onBlur={() => setTouchedName(true)} placeholder="Your full name" error={nameError} />
        <DarkInput label="Email address *" value={data.email} onChange={(v) => update("email", v)} onBlur={() => setTouchedEmail(true)} placeholder="your@email.com" type="email" hint="Your personalised roadmap will be sent here." error={emailError} />
        <div className="grid grid-cols-2 gap-4">
          <DarkSelect label="Country" value={data.country} onChange={(v) => update("country", v)} options={countries} hint="Helps us tailor school matches." />
          <DarkInput label="Age" type="number" value={data.age} onChange={(v) => update("age", v)} onBlur={() => setTouchedAge(true)} placeholder="e.g. 25" min="14" max="99" hint="Must be 14–99." error={ageError} />
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 2: Goal & commitment ────────────────────────────────────────────────
function Step2({ data, update, onAdvance }: { data: QuizData; update: (k: keyof QuizData, v: string) => void; onAdvance: () => void }) {
  const autoAdvance = useAutoAdvance(update, onAdvance);
  // Step 2 has two questions — only auto-advance after both are answered
  const handlePilotGoal = useCallback((v: string) => {
    update("pilotGoal", v);
    // If spokenToSchool already answered, advance
    if (data.spokenToSchool) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.spokenToSchool]);
  const handleSpokenToSchool = useCallback((v: string) => {
    update("spokenToSchool", v);
    // If pilotGoal already answered, advance
    if (data.pilotGoal) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.pilotGoal]);
  return (
    <StepCard title="Your goal and where you are now" subtitle="Honest answers lead to better guidance. There are no wrong answers here.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">What type of pilot do you want to become?</p>
          <div className="space-y-2">
            {["Airline pilot (commercial)", "Private pilot (for fun)", "Corporate / private jet pilot", "Flight instructor", "Military pilot", "Not sure yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.pilotGoal === o} onClick={() => handlePilotGoal(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-2">What have you actually done about it so far?</p>
          <p className="text-xs text-[oklch(0.5_0_0)] mb-4">This is one of the most useful questions — be honest.</p>
          <div className="space-y-2">
            {["I've applied to a flight school","I've visited a flight school or attended an open day","I've done a trial lesson","I've researched schools and training routes","I've watched videos and read forums","Mostly just thought about it"].map((o) => (
              <OptionButton key={o} label={o} selected={data.spokenToSchool === o} onClick={() => handleSpokenToSchool(o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 3: Barriers ────────────────────────────────────────────────────────
function Step3({ data, update, onAdvance }: { data: QuizData; update: (k: keyof QuizData, v: string) => void; onAdvance: () => void }) {
  const handleConcern = useCallback((v: string) => {
    update("biggestConcern", v);
    if (data.seriousness) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.seriousness]);
  const handleSeriousness = useCallback((v: string) => {
    update("seriousness", v);
    if (data.biggestConcern) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.biggestConcern]);
  return (
    <StepCard title="What's really stopping you?" subtitle="This is the most important question in the assessment. Your answer shapes everything that follows.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-2">If a flight school offered you a place tomorrow, what would stop you starting?</p>
          <p className="text-xs text-[oklch(0.5_0_0)] mb-4">Pick the one that feels most true right now.</p>
          <div className="space-y-2">
            {["The cost — I can't fund it","I'm not sure I could actually do it","I'm worried about passing the medical","I don't have the time right now","I think I might be too old","I'd be risking too much (career, income, stability)","I have too many unanswered questions","Nothing — I'm ready to start"].map((o) => (
              <OptionButton key={o} label={o} selected={data.biggestConcern === o} onClick={() => handleConcern(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">How often do you think about becoming a pilot?</p>
          <div className="space-y-2">
            {["Every day — it's always on my mind","Most weeks","Occasionally","Rarely — I'm just exploring"].map((o) => (
              <OptionButton key={o} label={o} selected={data.seriousness === o} onClick={() => handleSeriousness(o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 4: Training route ───────────────────────────────────────────────────
function Step4({ data, update, onAdvance }: { data: QuizData; update: (k: keyof QuizData, v: string) => void; onAdvance: () => void }) {
  const handleRoute = useCallback((v: string) => {
    update("preferredRoute", v);
    if (data.openToAbroad) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.openToAbroad]);
  const handleAbroad = useCallback((v: string) => {
    update("openToAbroad", v);
    if (data.preferredRoute) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.preferredRoute]);
  return (
    <StepCard title="Training route" subtitle="Not sure of the difference between integrated and modular? We'll explain it in your roadmap.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Which training route interests you most?</p>
          <div className="space-y-2">
            {["Integrated ATPL (full-time, 18–24 months, £80k–£120k)","Modular ATPL (part-time, 3–5 years, £40k–£80k)","PPL only (private licence, £8k–£15k)","I don't know the difference yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.preferredRoute === o} onClick={() => handleRoute(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Are you open to training abroad?</p>
          <div className="space-y-2">
            {["Yes — I'd consider it for the right school","No — I want to train in my home country","Maybe, depending on cost","I need guidance on this"].map((o) => (
              <OptionButton key={o} label={o} selected={data.openToAbroad === o} onClick={() => handleAbroad(o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 5: Finance ──────────────────────────────────────────────────────────
function Step5({ data, update, onAdvance }: { data: QuizData; update: (k: keyof QuizData, v: string) => void; onAdvance: () => void }) {
  const handleFunding = useCallback((v: string) => {
    update("fundingMethod", v);
    if (data.budgetRange && data.wantsFinanceInfo) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.budgetRange, data.wantsFinanceInfo]);
  const handleBudget = useCallback((v: string) => {
    update("budgetRange", v);
    if (data.fundingMethod && data.wantsFinanceInfo) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.fundingMethod, data.wantsFinanceInfo]);
  const handleFinanceInfo = useCallback((v: string) => {
    update("wantsFinanceInfo", v);
    if (data.fundingMethod && data.budgetRange) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.fundingMethod, data.budgetRange]);
  return (
    <StepCard title="Can you afford it?" subtitle="This is one of the 10 questions aspiring pilots ask most. Let's be honest about your situation.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">How do you expect to fund your training?</p>
          <div className="space-y-2">
            {["Self-funded from savings","Family support","Career development loan or finance","Airline cadet sponsorship","Scholarship","I haven't figured this out yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.fundingMethod === o} onClick={() => handleFunding(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">What training budget are you realistically working with?</p>
          <div className="space-y-2">
            {["Under £10,000","£10,000–£25,000","£25,000–£50,000","£50,000–£100,000","£100,000+","I need finance — I don't have savings"].map((o) => (
              <OptionButton key={o} label={o} selected={data.budgetRange === o} onClick={() => handleBudget(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Would you like information about finance options?</p>
          <div className="space-y-2">
            {["Yes — please include this","No","Maybe"].map((o) => (
              <OptionButton key={o} label={o} selected={data.wantsFinanceInfo === o} onClick={() => handleFinanceInfo(o)} />
            ))}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

// ─── Step 6: Background & medical ────────────────────────────────────────────
function Step6({ data, update, onAdvance }: { data: QuizData; update: (k: keyof QuizData, v: string) => void; onAdvance: () => void }) {
  const handleFlying = useCallback((v: string) => {
    update("flyingExperience", v);
    if (data.class1Medical && data.rightToWorkStudy && data.educationLevel) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.class1Medical, data.rightToWorkStudy, data.educationLevel]);
  const handleMedical = useCallback((v: string) => {
    update("class1Medical", v);
    if (data.flyingExperience && data.rightToWorkStudy && data.educationLevel) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.flyingExperience, data.rightToWorkStudy, data.educationLevel]);
  const handleRightToWork = useCallback((v: string) => {
    update("rightToWorkStudy", v);
    if (data.flyingExperience && data.class1Medical && data.educationLevel) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.flyingExperience, data.class1Medical, data.educationLevel]);
  const handleEducation = useCallback((v: string) => {
    update("educationLevel", v);
    if (data.flyingExperience && data.class1Medical && data.rightToWorkStudy) setTimeout(() => onAdvance(), 280);
  }, [update, onAdvance, data.flyingExperience, data.class1Medical, data.rightToWorkStudy]);
  return (
    <StepCard title="Your background" subtitle="This helps us assess your readiness and flag anything that needs attention before you spend a penny.">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Have you ever been in the cockpit?</p>
          <div className="space-y-2">
            {["Never — complete beginner","I've done a trial lesson or two","I hold a PPL or LAPL","I have 50+ hours of flight time","I hold a commercial licence"].map((o) => (
              <OptionButton key={o} label={o} selected={data.flyingExperience === o} onClick={() => handleFlying(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-2">How confident are you about passing a Class 1 medical?</p>
          <p className="text-xs text-[oklch(0.5_0_0)] mb-4">Required for commercial flying. Most people pass — but uncertainty is common.</p>
          <div className="space-y-2">
            {["I already hold a Class 1 medical","No concerns — I'm in good health","Minor concerns but probably fine","I genuinely don't know","I have significant concerns"].map((o) => (
              <OptionButton key={o} label={o} selected={data.class1Medical === o} onClick={() => handleMedical(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Do you have the right to study or work in your chosen training country?</p>
          <div className="space-y-2">
            {["Yes","No","Unsure"].map((o) => (
              <OptionButton key={o} label={o} selected={data.rightToWorkStudy === o} onClick={() => handleRightToWork(o)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">What is your highest education level?</p>
          <div className="space-y-2">
            {["GCSE or equivalent","A-levels or equivalent","Degree","Currently studying","Other"].map((o) => (
              <OptionButton key={o} label={o} selected={data.educationLevel === o} onClick={() => handleEducation(o)} />
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
        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">When do you want to start training?</p>
          <div className="space-y-2">
            {["As soon as possible — I'm ready now","Within the next 12 months","In the next 1–3 years","Someday — no fixed timeline","I'm not sure yet"].map((o) => (
              <OptionButton key={o} label={o} selected={data.startTimeframe === o} onClick={() => update("startTimeframe", o)} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Would you like suitable flight schools to contact you?</p>
          <div className="space-y-2">
            {["Yes","No"].map((o) => (
              <OptionButton key={o} label={o} selected={data.wantsSchoolContact === o} onClick={() => update("wantsSchoolContact", o)} />
            ))}
          </div>
        </div>

        {data.wantsSchoolContact === "Yes" && (
          <div>
            <p className="text-sm font-semibold text-[oklch(0.85_0_0)] mb-4">Preferred contact method</p>
            <div className="space-y-2">
              {["Email","Phone","WhatsApp","Any"].map((o) => (
                <OptionButton key={o} label={o} selected={data.preferredContact === o} onClick={() => update("preferredContact", o)} />
              ))}
            </div>
          </div>
        )}

        {/* Optional written answer */}
        <div className="p-5 rounded-xl bg-[oklch(0.55_0.18_240/0.08)] border border-[oklch(0.55_0.18_240/0.2)]">
          <p className="text-sm font-semibold text-white mb-2">Optional: In your own words</p>
          <p className="text-sm text-[oklch(0.6_0_0)] mb-3">Why do you want to become a pilot, and what is the one thing that's really holding you back? Your answer helps us give you better guidance.</p>
          <textarea
            value={data.writtenAnswer}
            onChange={(e) => update("writtenAnswer", e.target.value)}
            rows={4}
            placeholder="Write as much or as little as you like…"
            className="w-full px-4 py-3 rounded-xl border border-[oklch(1_0_0/0.12)] focus:border-[oklch(0.55_0.18_240)] outline-none text-sm transition-all bg-[oklch(1_0_0/0.05)] text-white placeholder-[oklch(0.45_0_0)] resize-none"
          />
        </div>

        {/* Contact consent */}
        <div className="p-5 rounded-xl bg-[oklch(1_0_0/0.04)] border border-[oklch(1_0_0/0.08)]">
          <p className="text-sm font-semibold text-white mb-1">Who are you happy to be contacted by?</p>
          <p className="text-xs text-[oklch(0.5_0_0)] mb-4">Optional — tick all that apply.</p>
          <div className="space-y-3">
            {([
              { key: "contactConsentSchools" as const, label: "Flight schools" },
              { key: "contactConsentFinance" as const, label: "Pilot training finance providers" },
              { key: "contactConsentMedical" as const, label: "Aviation medical examiners" },
              { key: "contactConsentPartners" as const, label: "Training partners (ground schools, simulators)" },
            ]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    data[key] ? "bg-[oklch(0.55_0.18_240)] border-[oklch(0.55_0.18_240)]" : "border-[oklch(1_0_0/0.25)] group-hover:border-[oklch(0.55_0.18_240/0.6)]"
                  }`}
                  onClick={() => update(key, !data[key])}
                >
                  {data[key] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-[oklch(0.75_0_0)]">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="p-5 rounded-xl bg-[oklch(1_0_0/0.04)] border border-[oklch(1_0_0/0.08)]">
          <p className="text-sm font-semibold text-white mb-1">How did you hear about AviatorIQ?</p>
          <p className="text-xs text-[oklch(0.5_0_0)] mb-4">Optional.</p>
          <div className="grid grid-cols-2 gap-2">
            {["Google / Search","Instagram","Facebook","Reddit","YouTube","A friend","Forum / Community","Other"].map((opt) => (
              <button key={opt} type="button" onClick={() => update("source", data.source === opt ? "" : opt)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
                  data.source === opt
                    ? "border-[oklch(0.55_0.18_240)] bg-[oklch(0.55_0.18_240/0.15)] text-white"
                    : "border-[oklch(1_0_0/0.1)] bg-[oklch(1_0_0/0.04)] text-[oklch(0.65_0_0)] hover:border-[oklch(0.55_0.18_240/0.4)]"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div className="p-5 rounded-xl bg-[oklch(1_0_0/0.04)] border border-[oklch(1_0_0/0.08)]">
          <p className="text-sm font-semibold text-white mb-1">Phone number <span className="font-normal text-[oklch(0.5_0_0)]">(optional)</span></p>
          <p className="text-xs text-[oklch(0.5_0_0)] mb-3">Only used if a school or our team needs to reach you directly. Never shared without your permission.</p>
          <input type="tel" value={data.phone as string} onChange={(e) => update("phone", e.target.value)} placeholder="+44 7700 000000"
            className="w-full px-4 py-3 rounded-xl border border-[oklch(1_0_0/0.12)] focus:border-[oklch(0.55_0.18_240)] outline-none text-sm transition-all bg-[oklch(1_0_0/0.05)] text-white placeholder-[oklch(0.45_0_0)]" />
        </div>

        {/* Consent */}
        <div className="space-y-4 p-5 rounded-xl bg-[oklch(1_0_0/0.04)] border border-[oklch(1_0_0/0.08)]">
          <h3 className="font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[oklch(0.55_0.18_240)]" />
            Your consent
          </h3>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                data.consentToContact ? "bg-[oklch(0.55_0.18_240)] border-[oklch(0.55_0.18_240)]" : "border-[oklch(1_0_0/0.25)] group-hover:border-[oklch(0.55_0.18_240/0.6)]"
              }`}
              onClick={() => update("consentToContact", !data.consentToContact)}
            >
              {data.consentToContact && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-[oklch(0.75_0_0)] leading-relaxed">
              <strong className="text-white">Required:</strong> I agree to AviatorIQ storing my answers and contacting me about pilot training options. I also agree that AviatorIQ may share my details with relevant flight schools or training partners where I have requested introductions.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                data.consentToShare ? "bg-[oklch(0.55_0.18_240)] border-[oklch(0.55_0.18_240)]" : "border-[oklch(1_0_0/0.25)] group-hover:border-[oklch(0.55_0.18_240/0.6)]"
              }`}
              onClick={() => update("consentToShare", !data.consentToShare)}
            >
              {data.consentToShare && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-[oklch(0.75_0_0)] leading-relaxed">
              Optional: I am happy for AviatorIQ to use my anonymised data to improve its school matching and guidance services.
            </span>
          </label>
          <p className="text-xs text-[oklch(0.45_0_0)] leading-relaxed">
            Your data is stored securely and never sold. You can request deletion at any time.{" "}
            <a href="/privacy" className="text-[oklch(0.55_0.18_240)] hover:underline">Privacy Policy</a>.
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
  const topRef = useRef<HTMLDivElement>(null);
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [, navigate] = useLocation();

  const submitMutation = trpc.leads.submit.useMutation({
    onSuccess: (result) => {
      Analytics.quizCompleted();
      Analytics.leadSubmitted(result.score, result.category);
      if (result.category === "Hot") Analytics.hotLeadGenerated(data.country);
      navigate(`/results/${result.leadId}`);
    },
  });

  const update = useCallback((key: keyof QuizData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleStart = () => { setStarted(true); Analytics.quizStarted(); };

  const canAdvance = () => {
    if (step === 1) return data.fullName.trim().length >= 2 && data.email.includes("@");
    return true;
  };

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = useCallback(() => {
    if (step === 1 && !canAdvance()) { setShowStep1Errors(true); return; }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      scrollToTop();
    }
  }, [step, canAdvance, scrollToTop]);

  const handleBack = () => { if (step > 1) setStep((s) => s - 1); };

  const handleSubmit = () => {
    if (!data.consentToContact) return;
    submitMutation.mutate({ ...data, age: data.age ? parseInt(data.age, 10) : undefined, source: data.source || undefined });
  };

  // ─── Landing / intro screen ───────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.01 240)" }}>
        <PublicNav />
        <main className="flex-1 flex items-center justify-center py-16 px-4 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
              style={{ background: "radial-gradient(ellipse, oklch(0.55 0.18 240), transparent 70%)" }} />
          </div>

          <div className="max-w-xl w-full text-center relative z-10">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 relative"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 240), oklch(0.45 0.18 260))", boxShadow: "0 0 40px oklch(0.55 0.18 240 / 0.4)" }}>
              <Plane className="w-10 h-10 text-white" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.55_0.18_240/0.3)] bg-[oklch(0.55_0.18_240/0.1)] text-[oklch(0.7_0.1_240)] text-xs font-semibold uppercase tracking-widest mb-6">
              <Star className="w-3 h-3" />
              Free Career Assessment
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 leading-tight">
              Find out exactly what's<br />
              <span style={{ background: "linear-gradient(135deg, oklch(0.7 0.18 240), oklch(0.8 0.15 200))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                standing between you and the cockpit
              </span>
            </h1>

            <p className="text-lg text-[oklch(0.65_0_0)] mb-4 leading-relaxed max-w-md mx-auto">
              10 minutes. We'll identify your biggest barrier, your strongest asset, and give you a personalised training roadmap — not generic advice.
            </p>
            <p className="text-sm text-[oklch(0.5_0_0)] mb-10 leading-relaxed">
              Most people who take this assessment say the result describes them better than they expected. That's the point.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: <Clock className="w-5 h-5" />, label: "10 minutes", sub: "to complete" },
                { icon: <Star className="w-5 h-5" />, label: "100% free", sub: "no payment ever" },
                { icon: <Plane className="w-5 h-5" />, label: "AI roadmap", sub: "personalised to you" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-[oklch(1_0_0/0.08)] bg-[oklch(1_0_0/0.04)] text-center">
                  <div className="flex justify-center mb-2 text-[oklch(0.55_0.18_240)]">{item.icon}</div>
                  <div className="font-display font-bold text-white text-base">{item.label}</div>
                  <div className="text-xs text-[oklch(0.5_0_0)] mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-5 px-8 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.18 240), oklch(0.45 0.2 260))",
                boxShadow: "0 8px 32px oklch(0.55 0.18 240 / 0.35)"
              }}
            >
              Start the assessment
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[oklch(0.45_0_0)]">
              <Shield className="w-3.5 h-3.5" />
              No registration required. Your data is handled in accordance with our Privacy Policy.
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const stepUpdate = update as (k: keyof QuizData, v: string) => void;
  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1 data={data} update={stepUpdate} showErrors={showStep1Errors} />,
    2: <Step2 data={data} update={stepUpdate} onAdvance={handleNext} />,
    3: <Step3 data={data} update={stepUpdate} onAdvance={handleNext} />,
    4: <Step4 data={data} update={stepUpdate} onAdvance={handleNext} />,
    5: <Step5 data={data} update={stepUpdate} onAdvance={handleNext} />,
    6: <Step6 data={data} update={stepUpdate} onAdvance={handleNext} />,
    7: <Step7 data={data} update={update} />,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.01 240)" }}>
      <PublicNav />
      <main className="flex-1 py-8 px-4 relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, oklch(0.55 0.18 240), transparent 70%)" }} />

        <div ref={topRef} className="max-w-2xl mx-auto relative z-10">
          <ProgressBar step={step} total={TOTAL_STEPS} />

          {/* Step card */}
          <div className="rounded-2xl border border-[oklch(1_0_0/0.08)] bg-[oklch(1_0_0/0.04)] backdrop-blur-sm p-6 md:p-10 mb-6">
            {stepComponents[step]}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[oklch(1_0_0/0.12)] text-[oklch(0.65_0_0)] text-sm font-medium transition-all hover:border-[oklch(1_0_0/0.25)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 240), oklch(0.45 0.2 260))", boxShadow: "0 4px 20px oklch(0.55 0.18 240 / 0.3)" }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!data.consentToContact || submitMutation.isPending}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.2 45))", boxShadow: "0 4px 20px oklch(0.72 0.18 65 / 0.3)" }}
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Generating your roadmap…</>
                ) : (
                  <>Get my pilot roadmap <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>

          {submitMutation.isError && (
            <p className="text-red-400 text-sm text-center mt-4 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
