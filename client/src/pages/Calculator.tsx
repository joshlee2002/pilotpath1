import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, ArrowLeft, Calculator as CalcIcon, Info, CheckCircle2, ChevronRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { trpc } from "@/lib/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────

type Route = "integrated_uk" | "modular_uk" | "ppl_uk" | "integrated_eu" | "integrated_us";
type Location = "uk_south" | "uk_north" | "europe" | "usa" | "online_only";
type Pace = "full_time" | "part_time" | "flexible";
type Experience = "zero" | "ppl" | "ppl_night" | "ppl_ir";
type Funding = "self_funded" | "loan" | "cadet" | "part_funded";

interface CalcInputs {
  route: Route | "";
  location: Location | "";
  pace: Pace | "";
  experience: Experience | "";
  funding: Funding | "";
}

// ─── Cost Engine ──────────────────────────────────────────────────────────────

interface CostItem {
  label: string;
  amount: number;
  note?: string;
  category: "training" | "exams" | "living" | "medical" | "equipment" | "contingency";
}

interface CalcResult {
  items: CostItem[];
  total: number;
  low: number;
  high: number;
  months: number;
  monthlyPayment: number;
  insight: string;
  fundingNote: string;
}

type BaseItem = Omit<CostItem, "amount"> & { base: number };
const BASE_COSTS: Record<Route, { items: BaseItem[], months: Record<Pace, number> }> = {
  integrated_uk: {
    items: [
      { label: "Integrated ATPL course fees", base: 92000, category: "training", note: "Full-time residential programme" },
      { label: "ATPL theory exams (14 papers)", base: 3000, category: "exams", note: "CAA exam fees + resit allowance" },
      { label: "Class 1 Medical", base: 650, category: "medical", note: "Initial + renewal during training" },
      { label: "Accommodation & living costs", base: 18000, category: "living", note: "Adjusted for location and duration" },
      { label: "Headset, kneeboard & equipment", base: 1200, category: "equipment" },
      { label: "Contingency (10%)", base: 9500, category: "contingency", note: "Resits, extra hours, delays" },
    ],
    months: { full_time: 18, part_time: 36, flexible: 30 },
  },
  modular_uk: {
    items: [
      { label: "PPL training (45–60 hrs)", base: 11000, category: "training" },
      { label: "ATPL theory ground school", base: 3500, category: "training", note: "Distance learning or classroom" },
      { label: "ATPL theory exams (14 papers)", base: 3000, category: "exams" },
      { label: "Night rating", base: 1200, category: "training" },
      { label: "Instrument rating (IR)", base: 12000, category: "training" },
      { label: "Multi-engine rating (MEP)", base: 3500, category: "training" },
      { label: "Commercial pilot licence (CPL)", base: 7500, category: "training" },
      { label: "Multi-crew cooperation (MCC)", base: 3000, category: "training" },
      { label: "Jet orientation course (JOC)", base: 2000, category: "training" },
      { label: "Class 1 Medical", base: 650, category: "medical" },
      { label: "Contingency (10%)", base: 4800, category: "contingency" },
    ],
    months: { full_time: 24, part_time: 48, flexible: 36 },
  },
  ppl_uk: {
    items: [
      { label: "Flight training (45–60 hours)", base: 9500, category: "training", note: "At typical UK rate of ~£180/hr" },
      { label: "Ground school & theory materials", base: 900, category: "training" },
      { label: "PPL skills test fee", base: 400, category: "exams" },
      { label: "Class 2 Medical", base: 300, category: "medical" },
      { label: "Headset & equipment", base: 650, category: "equipment" },
      { label: "Contingency (10%)", base: 1100, category: "contingency" },
    ],
    months: { full_time: 6, part_time: 18, flexible: 12 },
  },
  integrated_eu: {
    items: [
      { label: "Integrated ATPL course fees (EASA)", base: 85000, category: "training", note: "ATO-approved programme" },
      { label: "ATPL theory exams", base: 2500, category: "exams" },
      { label: "Class 1 Medical", base: 550, category: "medical" },
      { label: "Accommodation & living costs", base: 20000, category: "living" },
      { label: "Headset & equipment", base: 1200, category: "equipment" },
      { label: "Contingency (10%)", base: 8700, category: "contingency" },
    ],
    months: { full_time: 18, part_time: 36, flexible: 28 },
  },
  integrated_us: {
    items: [
      { label: "Private pilot certificate (Part 141)", base: 11000, category: "training" },
      { label: "Instrument rating", base: 11000, category: "training" },
      { label: "Commercial certificate (multi-engine)", base: 22000, category: "training" },
      { label: "CFI / CFII certificates", base: 7500, category: "training", note: "Required to build hours" },
      { label: "ATP certificate & CTP course", base: 6500, category: "training" },
      { label: "Living costs (2–3 years)", base: 32000, category: "living" },
      { label: "Contingency (10%)", base: 9000, category: "contingency" },
    ],
    months: { full_time: 30, part_time: 54, flexible: 42 },
  },
};

// Location multipliers for living costs
const LOCATION_LIVING_MULT: Record<Location, number> = {
  uk_south: 1.3,
  uk_north: 0.85,
  europe: 1.0,
  usa: 1.15,
  online_only: 0.5,
};

// Location multipliers for training costs (school pricing varies)
const LOCATION_TRAINING_MULT: Record<Location, number> = {
  uk_south: 1.1,
  uk_north: 0.95,
  europe: 0.92,
  usa: 1.0,
  online_only: 1.0,
};

// Experience credits (deducted from base cost)
const EXPERIENCE_CREDITS: Record<Route, Record<Experience, number>> = {
  integrated_uk: { zero: 0, ppl: 0, ppl_night: 0, ppl_ir: 0 }, // integrated doesn't credit prior licences
  modular_uk: { zero: 0, ppl: 11000, ppl_night: 12200, ppl_ir: 24200 },
  ppl_uk: { zero: 0, ppl: 9500, ppl_night: 9500, ppl_ir: 9500 },
  integrated_eu: { zero: 0, ppl: 0, ppl_night: 0, ppl_ir: 0 },
  integrated_us: { zero: 0, ppl: 11000, ppl_night: 11000, ppl_ir: 22000 },
};

// Funding adjustments (interest / discount)
const FUNDING_NOTES: Record<Funding, string> = {
  self_funded: "Self-funded: no interest costs. Consider phasing payments to manage cash flow.",
  loan: "Career development loan: add ~15–25% for interest over a typical 7-year term. Effective total cost increases significantly.",
  cadet: "Cadet scheme: if accepted, your airline covers training costs in exchange for a bond period (typically 5 years). Competitive — fewer than 5% of applicants are accepted.",
  part_funded: "Part-funded: you cover a deposit (typically £10,000–£20,000) and the remainder is financed. Check the loan terms carefully.",
};

function computeResult(inputs: Required<CalcInputs>): CalcResult {
  const routeData = BASE_COSTS[inputs.route as Route];
  const months = routeData.months[inputs.pace as Pace];
  const experienceCredit = EXPERIENCE_CREDITS[inputs.route as Route][inputs.experience as Experience];
  const livingMult = LOCATION_LIVING_MULT[inputs.location as Location];
  const trainingMult = LOCATION_TRAINING_MULT[inputs.location as Location];

  const items: CostItem[] = routeData.items.map((item: BaseItem) => {
    let amount = item.base;
    if (item.category === "living") amount = Math.round(item.base * livingMult * (months / 18));
    else if (item.category === "training") amount = Math.round(item.base * trainingMult);
    return { label: item.label, amount, note: item.note, category: item.category };
  });

  // Apply experience credit to training items
  let remainingCredit = experienceCredit;
  const adjustedItems: CostItem[] = items.map((item: CostItem) => {
    if (item.category === "training" && remainingCredit > 0) {
      const deduction = Math.min(item.amount, remainingCredit);
      remainingCredit -= deduction;
      if (deduction > 0) {
        return { ...item, amount: item.amount - deduction, note: `${item.note ? item.note + " · " : ""}Reduced: existing qualification credited` };
      }
    }
    return item;
  });

  const total = adjustedItems.reduce((sum, i) => sum + i.amount, 0);
  const low = Math.round(total * 0.88);
  const high = Math.round(total * 1.14);

  // Monthly payment (loan scenario adds 20% interest)
  const loanMultiplier = inputs.funding === "loan" ? 1.2 : inputs.funding === "part_funded" ? 1.1 : 1.0;
  const monthlyPayment = inputs.funding === "cadet" ? 0 : Math.round((total * loanMultiplier) / months);

  // Insight paragraph
  const routeLabels: Record<Route, string> = {
    integrated_uk: "UK integrated ATPL",
    modular_uk: "UK modular ATPL",
    ppl_uk: "UK PPL",
    integrated_eu: "European EASA integrated ATPL",
    integrated_us: "FAA integrated programme",
  };
  const paceLabels: Record<Pace, string> = {
    full_time: "full-time",
    part_time: "part-time while working",
    flexible: "flexible",
  };
  const locationLabels: Record<Location, string> = {
    uk_south: "southern UK",
    uk_north: "northern UK",
    europe: "Europe",
    usa: "the USA",
    online_only: "online / distance learning",
  };

  let insight = `Based on your inputs, a ${routeLabels[inputs.route as Route]} completed ${paceLabels[inputs.pace as Pace]} in ${locationLabels[inputs.location as Location]} is estimated to cost around £${total.toLocaleString("en-GB")}. `;

  if (inputs.experience !== "zero") {
    insight += `Your existing qualifications have reduced the training cost by approximately £${experienceCredit.toLocaleString("en-GB")}. `;
  }
  if (inputs.pace === "part_time") {
    insight += `Training part-time extends your timeline to around ${months} months, which reduces monthly pressure but increases total living costs. `;
  }
  if (inputs.location === "uk_south") {
    insight += `Training in southern England typically costs 10–15% more than the national average due to higher school fees and living costs. `;
  }
  if (inputs.funding === "loan") {
    insight += `If financing with a career development loan, your effective total cost rises to approximately £${Math.round(total * 1.2).toLocaleString("en-GB")} once interest is included. `;
  }

  return {
    items: adjustedItems,
    total,
    low,
    high,
    months,
    monthlyPayment,
    insight,
    fundingNote: FUNDING_NOTES[inputs.funding as Funding],
  };
}

// ─── Step Config ──────────────────────────────────────────────────────────────

const STEP_LABELS = ["Training route", "Location", "Pace", "Experience", "Funding"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Calculator() {
  useEffect(() => {
    document.title = "Personalised Pilot Training Cost Calculator – AviatorIQ";
  }, []);

  const { formatPrice, currency } = useCurrency();
  const isGBP = currency.code === "GBP";

  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<CalcInputs>({
    route: "",
    location: "",
    pace: "",
    experience: "",
    funding: "",
  });
  const [sessionSaved, setSessionSaved] = useState(false);

  const saveSession = trpc.calculator.saveSession.useMutation();

  const isComplete = inputs.route && inputs.location && inputs.pace && inputs.experience && inputs.funding;

  const result = useMemo<CalcResult | null>(() => {
    if (!isComplete) return null;
    return computeResult(inputs as Required<CalcInputs>);
  }, [inputs, isComplete]);

  // Save session once when result is first computed
  useEffect(() => {
    if (result && !sessionSaved) {
      setSessionSaved(true);
      saveSession.mutate({
        route: inputs.route as string,
        location: inputs.location as string,
        pace: inputs.pace as string,
        experience: inputs.experience as string,
        funding: inputs.funding as string,
        totalEstimate: result.total,
      });
    }
  }, [result, sessionSaved]);

  const stepKeys: (keyof CalcInputs)[] = ["route", "location", "pace", "experience", "funding"];
  const currentKey = stepKeys[step];

  function select(value: string) {
    setInputs((prev) => ({ ...prev, [currentKey]: value }));
    if (step < 4) setStep(step + 1);
  }

  const STEP_OPTIONS: Record<keyof CalcInputs, { value: string; label: string; sub?: string }[]> = {
    route: [
      { value: "integrated_uk", label: "Integrated ATPL (UK)", sub: "Full-time residential · ~18 months · £85k–£120k" },
      { value: "modular_uk", label: "Modular ATPL (UK)", sub: "Flexible self-paced · 2–4 years · £40k–£70k" },
      { value: "ppl_uk", label: "Private Pilot Licence (UK)", sub: "Fly for pleasure · 6–18 months · £8k–£15k" },
      { value: "integrated_eu", label: "Integrated ATPL (Europe / EASA)", sub: "ATO-approved · ~18 months · €75k–€110k" },
      { value: "integrated_us", label: "Integrated Programme (USA / FAA)", sub: "Part 141 school · 2–3 years · $80k–$120k" },
    ],
    location: [
      { value: "uk_south", label: "Southern England", sub: "Oxford, Bournemouth, Wycombe — higher costs" },
      { value: "uk_north", label: "Northern England / Scotland", sub: "Carlisle, Glasgow, Prestwick — lower costs" },
      { value: "europe", label: "Mainland Europe", sub: "Spain, Netherlands, Germany, Portugal" },
      { value: "usa", label: "United States", sub: "Florida, Arizona, California" },
      { value: "online_only", label: "Online / Distance Learning", sub: "Ground school only — no residential costs" },
    ],
    pace: [
      { value: "full_time", label: "Full-time", sub: "Fastest route — no other commitments during training" },
      { value: "part_time", label: "Part-time while working", sub: "Longer timeline, lower monthly cost, more flexibility" },
      { value: "flexible", label: "Flexible / mixed", sub: "Some full-time blocks, some part-time study" },
    ],
    experience: [
      { value: "zero", label: "Zero hours — complete beginner", sub: "No prior flight training" },
      { value: "ppl", label: "I hold a PPL", sub: "Private Pilot Licence already obtained" },
      { value: "ppl_night", label: "PPL + Night Rating", sub: "PPL with night qualification" },
      { value: "ppl_ir", label: "PPL + Instrument Rating", sub: "PPL with IR — significant credit on modular route" },
    ],
    funding: [
      { value: "self_funded", label: "Self-funded / savings", sub: "No borrowing — pay as you go or upfront" },
      { value: "loan", label: "Career development loan", sub: "Borrow full amount — interest adds ~15–25% to total cost" },
      { value: "cadet", label: "Airline cadet scheme", sub: "Airline-sponsored — highly competitive, bond period applies" },
      { value: "part_funded", label: "Part-funded (deposit + loan)", sub: "Deposit from savings, remainder financed" },
    ],
  };

  const categoryColors: Record<CostItem["category"], string> = {
    training: "bg-blue-100 text-blue-700",
    exams: "bg-purple-100 text-purple-700",
    living: "bg-amber-100 text-amber-700",
    medical: "bg-green-100 text-green-700",
    equipment: "bg-slate-100 text-slate-600",
    contingency: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <CalcIcon className="w-3.5 h-3.5" />
              Personalised estimate — not a generic range
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Pilot Training Cost Calculator
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Answer 5 questions and get a specific cost estimate tailored to your route, location, pace, experience and funding plan.
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-10 px-4">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEP_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => i <= step && setStep(i)}
                  className={`flex-1 text-center text-xs font-medium transition-colors ${
                    i < step
                      ? "text-[var(--color-primary)] cursor-pointer"
                      : i === step
                      ? "text-[var(--color-navy)]"
                      : "text-[var(--color-muted-foreground)] cursor-default"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4 mx-auto mb-0.5 text-[var(--color-primary)]" /> : <span className={`block w-6 h-6 rounded-full mx-auto mb-0.5 text-xs flex items-center justify-center font-bold ${i === step ? "bg-[var(--color-navy)] text-white" : "bg-[var(--color-border)] text-[var(--color-muted-foreground)]"}`}>{i + 1}</span>}
                  <span className="hidden sm:block">{label}</span>
                </button>
              ))}
            </div>
            <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step panel */}
          {!isComplete ? (
            <div className="card-base p-6 mb-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-bold text-[var(--color-navy)] text-xl">
                  {step + 1}. {STEP_LABELS[step]}
                </h2>
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-navy)] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
                {step === 0 && "Which type of training are you considering?"}
                {step === 1 && "Where are you planning to train? This affects school fees and living costs."}
                {step === 2 && "How quickly do you want to complete training?"}
                {step === 3 && "What flying experience do you already have?"}
                {step === 4 && "How are you planning to fund your training?"}
              </p>
              <div className="space-y-3">
                {STEP_OPTIONS[currentKey].map((opt) => {
                  const isSelected = inputs[currentKey] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => select(opt.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between group ${
                        isSelected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary-light)]/30"
                      }`}
                    >
                      <div>
                        <div className={`font-semibold text-sm ${isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-navy)]"}`}>
                          {opt.label}
                        </div>
                        {opt.sub && (
                          <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{opt.sub}</div>
                        )}
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Results panel */}
          {result && (
            <div className="space-y-5">
              {/* Summary card */}
              <div className="card-base p-6 bg-[var(--color-navy)] text-white">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-white/60 mb-1">Your personalised estimate</div>
                    <div className="text-4xl font-display font-bold">
                      {isGBP ? `£${result.total.toLocaleString("en-GB")}` : formatPrice(result.total)}
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      Likely range: {isGBP ? `£${result.low.toLocaleString("en-GB")}` : formatPrice(result.low)} – {isGBP ? `£${result.high.toLocaleString("en-GB")}` : formatPrice(result.high)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-white/60 mb-1">Training duration</div>
                    <div className="text-2xl font-display font-bold">{result.months} months</div>
                    {result.monthlyPayment > 0 && (
                      <div className="text-sm text-white/60 mt-1">
                        ~{isGBP ? `£${result.monthlyPayment.toLocaleString("en-GB")}` : formatPrice(result.monthlyPayment)}/month
                      </div>
                    )}
                    {inputs.funding === "cadet" && (
                      <div className="text-sm text-white/60 mt-1">Airline-funded (if accepted)</div>
                    )}
                  </div>
                </div>
                {/* Input summary chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    STEP_OPTIONS.route.find((o) => o.value === inputs.route)?.label,
                    STEP_OPTIONS.location.find((o) => o.value === inputs.location)?.label,
                    STEP_OPTIONS.pace.find((o) => o.value === inputs.pace)?.label,
                    STEP_OPTIONS.experience.find((o) => o.value === inputs.experience)?.label,
                    STEP_OPTIONS.funding.find((o) => o.value === inputs.funding)?.label,
                  ].map((label) => label && (
                    <span key={label} className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-full">{label}</span>
                  ))}
                  <button
                    onClick={() => { setStep(0); setSessionSaved(false); }}
                    className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    Edit inputs ✎
                  </button>
                </div>
              </div>

              {/* Insight */}
              <div className="card-base p-5 border-l-4 border-[var(--color-primary)]">
                <div className="text-sm font-semibold text-[var(--color-navy)] mb-1">What this means for you</div>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{result.insight}</p>
              </div>

              {/* Itemised breakdown */}
              <div className="card-base p-6">
                <h2 className="font-display font-bold text-[var(--color-navy)] text-lg mb-4">Full cost breakdown</h2>
                <div className="space-y-2">
                  {result.items.map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-[var(--color-border)] last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${categoryColors[item.category]}`}>
                            {item.category}
                          </span>
                        </div>
                        {item.note && <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{item.note}</div>}
                      </div>
                      <div className="text-sm font-bold text-[var(--color-navy)] flex-shrink-0">
                        {isGBP ? `£${item.amount.toLocaleString("en-GB")}` : formatPrice(item.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-[var(--color-navy)]">
                  <span className="font-display font-bold text-[var(--color-navy)]">Total estimate</span>
                  <span className="font-display font-bold text-[var(--color-navy)] text-xl">
                    {isGBP ? `£${result.total.toLocaleString("en-GB")}` : formatPrice(result.total)}
                  </span>
                </div>
              </div>

              {/* Funding note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">{result.fundingNote}</p>
              </div>

              {/* Monthly payment breakdown */}
              {result.monthlyPayment > 0 && (
                <div className="card-base p-6">
                  <h2 className="font-display font-bold text-[var(--color-navy)] text-lg mb-3">Monthly payment plan</h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-[var(--color-primary-light)]">
                      <div className="text-2xl font-display font-bold text-[var(--color-primary)]">
                        {isGBP ? `£${result.monthlyPayment.toLocaleString("en-GB")}` : formatPrice(result.monthlyPayment)}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] mt-1">Per month</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--color-border)]/30">
                      <div className="text-2xl font-display font-bold text-[var(--color-navy)]">{result.months}</div>
                      <div className="text-xs text-[var(--color-muted-foreground)] mt-1">Months total</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--color-border)]/30">
                      <div className="text-2xl font-display font-bold text-[var(--color-navy)]">
                        {isGBP ? `£${result.total.toLocaleString("en-GB")}` : formatPrice(result.total)}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] mt-1">Total cost</div>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-3">
                    Monthly figure assumes costs are spread evenly across the training period. Integrated courses typically require a large upfront payment or staged payments per module.
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  These are indicative estimates based on typical UK market rates as of 2025. Actual costs vary by school, individual progress, exchange rates, and additional fees. Always obtain a detailed quote from your chosen school. This calculator does not constitute financial advice.
                </p>
              </div>

              {/* CTA */}
              <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center">
                <h3 className="font-display font-bold text-xl mb-2">Know your cost. Now understand your readiness.</h3>
                <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
                  The Career Readiness Assessment identifies your biggest barrier to starting — whether that's funding, medical, confidence, or timing — and gives you a personalised plan to overcome it.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/quiz" className="btn-cta text-sm">
                    Find my biggest barrier
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/guides/pilot-training-costs" className="btn-outline text-sm border-white/30 text-white hover:bg-white/10">
                    Full cost guide
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
