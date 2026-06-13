import { useState, useMemo } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Calculator as CalcIcon, Info } from "lucide-react";

interface CostItem {
  label: string;
  min: number;
  max: number;
  note?: string;
}

const ROUTES: Record<string, { label: string; description: string; items: CostItem[] }> = {
  integrated_uk: {
    label: "Integrated ATPL (UK)",
    description: "Full-time residential programme covering all ATPL theory and flight training in one package.",
    items: [
      { label: "Course fees (full integrated)", min: 75000, max: 110000 },
      { label: "ATPL theory exams (14 exams)", min: 2000, max: 4000 },
      { label: "Medical (Class 1)", min: 500, max: 800 },
      { label: "Accommodation & living (18 months)", min: 10000, max: 25000 },
      { label: "Headset & equipment", min: 800, max: 1500 },
      { label: "Miscellaneous / contingency", min: 2000, max: 5000 },
    ],
  },
  modular_uk: {
    label: "Modular ATPL (UK)",
    description: "Flexible self-paced route. Complete each module separately, often while working.",
    items: [
      { label: "PPL training", min: 8000, max: 14000 },
      { label: "ATPL theory course (ground school)", min: 2500, max: 5000 },
      { label: "ATPL theory exams (14 exams)", min: 2000, max: 4000 },
      { label: "Night rating", min: 800, max: 1500 },
      { label: "Instrument rating (IR)", min: 8000, max: 15000 },
      { label: "Multi-engine rating (MEP)", min: 2500, max: 5000 },
      { label: "Commercial pilot licence (CPL)", min: 5000, max: 10000 },
      { label: "Multi-crew cooperation (MCC)", min: 2000, max: 4000 },
      { label: "Jet orientation course (JOC)", min: 1500, max: 3000 },
      { label: "Medical (Class 1)", min: 500, max: 800 },
      { label: "Miscellaneous / contingency", min: 2000, max: 5000 },
    ],
  },
  ppl_uk: {
    label: "Private Pilot Licence (UK)",
    description: "Fly for pleasure or personal travel. Minimum 45 hours flight time required.",
    items: [
      { label: "Flight training (45–60 hours)", min: 7000, max: 12000 },
      { label: "Ground school / theory", min: 500, max: 1500 },
      { label: "PPL skills test fee", min: 300, max: 500 },
      { label: "Medical (Class 2)", min: 200, max: 400 },
      { label: "Headset & equipment", min: 400, max: 900 },
      { label: "Miscellaneous", min: 500, max: 1000 },
    ],
  },
  integrated_us: {
    label: "Integrated ATPL (USA / FAA)",
    description: "FAA-approved airline transport pilot programme at a Part 141 school.",
    items: [
      { label: "Private pilot certificate", min: 8000, max: 14000 },
      { label: "Instrument rating", min: 8000, max: 14000 },
      { label: "Commercial pilot certificate (multi)", min: 15000, max: 30000 },
      { label: "Certified flight instructor (CFI/CFII)", min: 5000, max: 10000 },
      { label: "ATP certificate / CTP course", min: 5000, max: 8000 },
      { label: "Living costs (2–3 years)", min: 20000, max: 45000 },
      { label: "Miscellaneous", min: 3000, max: 6000 },
    ],
  },
  integrated_eu: {
    label: "Integrated ATPL (Europe / EASA)",
    description: "EASA-approved integrated programme at a certified ATO.",
    items: [
      { label: "Course fees (integrated ATPL)", min: 70000, max: 100000 },
      { label: "ATPL theory exams", min: 1500, max: 3500 },
      { label: "Medical (Class 1)", min: 400, max: 700 },
      { label: "Accommodation & living (18 months)", min: 12000, max: 28000 },
      { label: "Miscellaneous", min: 2000, max: 5000 },
    ],
  },
};

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export default function Calculator() {
  const [selectedRoute, setSelectedRoute] = useState("integrated_uk");
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const route = ROUTES[selectedRoute];

  const totals = useMemo(() => {
    let min = 0;
    let max = 0;
    route.items.forEach((item) => {
      const adj = adjustments[item.label] ?? 0;
      min += item.min + adj;
      max += item.max + adj;
    });
    return { min, max };
  }, [route, adjustments]);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Pilot Training Cost Calculator
            </h1>
            <p className="text-lg text-white/80">
              Estimate the total cost of your pilot training based on your chosen route and country.
            </p>
          </div>
        </div>

        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-3xl">
            {/* Route selector */}
            <div className="card-base p-6 mb-6">
              <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-3">
                Select your training route
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(ROUTES).map(([key, r]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setSelectedRoute(key); setAdjustments({}); }}
                    className={`text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
                      selectedRoute === key
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <div className={`font-display font-semibold text-sm ${selectedRoute === key ? "text-[var(--color-primary)]" : "text-[var(--color-navy)]"}`}>
                      {r.label}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-3 leading-relaxed">
                {route.description}
              </p>
            </div>

            {/* Cost breakdown */}
            <div className="card-base p-6 mb-6">
              <h2 className="font-display font-bold text-[var(--color-navy)] text-xl mb-1">Cost breakdown</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
                All figures are estimates in GBP. Actual costs vary by school, location and individual progress.
              </p>
              <div className="space-y-3">
                {route.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-3 border-b border-[var(--color-border)] last:border-0">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</div>
                      {item.note && <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{item.note}</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--color-navy)]">
                        {formatGBP(item.min + (adjustments[item.label] ?? 0))} – {formatGBP(item.max + (adjustments[item.label] ?? 0))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="card-base p-6 mb-6 border-[var(--color-primary)] bg-[var(--color-primary-light)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-primary)] mb-1">Estimated total cost</div>
                  <div className="text-3xl font-display font-bold text-[var(--color-navy)]">
                    {formatGBP(totals.min)} – {formatGBP(totals.max)}
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)] mt-1">
                    Midpoint estimate: {formatGBP(Math.round((totals.min + totals.max) / 2))}
                  </div>
                </div>
                <CalcIcon className="w-12 h-12 text-[var(--color-primary)]/30" />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-8">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                These are indicative estimates only. Actual costs depend on your school, location, individual progress, exchange rates and additional fees. Always get a detailed quote from your chosen school. This calculator does not constitute financial advice.
              </p>
            </div>

            {/* CTA */}
            <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center">
              <h3 className="font-display font-bold text-xl mb-2">Want a personalised cost estimate?</h3>
              <p className="text-white/70 text-sm mb-4">
                Take the free assessment and get a tailored cost breakdown based on your specific profile, country and training goal.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/quiz" className="btn-cta text-sm">
                  Get personalised estimate
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/guides/pilot-training-costs" className="btn-outline text-sm border-white/30 text-white hover:bg-white/10">
                  Full cost guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
