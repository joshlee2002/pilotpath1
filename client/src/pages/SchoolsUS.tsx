import { useState } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  MapPin,
  Globe,
  CreditCard,
  Building2,
  Search,
  X,
  ArrowRight,
  Zap,
  CheckCircle,
  Quote,
  GraduationCap,
  Plane,
} from "lucide-react";
import { US_SCHOOLS, type StaticSchool } from "@/data/schools";

const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.16)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";
const brandGradient = "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))";

const US_STATES = [
  "All States", "Alabama", "Arizona", "California", "Colorado", "Florida",
  "Georgia", "Illinois", "Michigan", "Minnesota", "Nevada", "New York",
  "North Dakota", "Ohio", "Oregon", "Pennsylvania", "Tennessee", "Texas",
  "Virginia", "Washington", "Wisconsin",
];

const TRAINING_TYPES = [
  { value: "", label: "All training types" },
  { value: "part141", label: "Part 141 (Accelerated)" },
  { value: "part61", label: "Part 61 (Flexible)" },
  { value: "university", label: "University / Degree" },
];

export default function SchoolsUS() {
  const { formatPrice } = useCurrency();
  const [stateFilter, setStateFilter] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [financeFilter, setFinanceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const schools = US_SCHOOLS.filter((s) => {
    if (stateFilter && stateFilter !== "All States") {
      const city = (s.city ?? "").toLowerCase();
      if (!city.includes(stateFilter.toLowerCase().slice(0, 4))) return false;
    }
    if (trainingType === "part141" && !s.modularAtpl) return false;
    if (trainingType === "university" && !(s.badge ?? "").toLowerCase().includes("university") && !s.name.toLowerCase().includes("university") && !s.name.toLowerCase().includes("riddle") && !s.name.toLowerCase().includes("und")) return false;
    if (financeFilter && s.financeAvailable !== financeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(term) ||
        (s.city ?? "").toLowerCase().includes(term) ||
        (s.description ?? "").toLowerCase().includes(term)
      );
    }
    return true;
  });

  const hasFilters = stateFilter || trainingType || financeFilter || searchTerm;

  return (
    <>
      <SEO
        title="US Flight Schools Directory 2026 — Find Your FAA Training Academy | AviatorIQ"
        description="Compare the best US flight schools in 2026. ATP, Embry-Riddle, CAE USA, L3Harris, and more. Part 141 vs Part 61, costs, airline partnerships, and financing options."
        canonical="/us/schools"
      />
      <PublicNav />

      {/* Hero */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(180deg, oklch(0.10 0.09 252) 0%, oklch(0.13 0.09 250) 100%)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
              <Plane className="w-3 h-3" />
              🇺🇸 US Flight School Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>
              Find the right US flight school for you
            </h1>
            <p className="text-lg md:text-xl mb-8" style={{ color: muted }}>
              {US_SCHOOLS.length} US flight schools compared — Part 141, Part 61, university programmes, airline cadet partnerships, and financing options.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: muted }}>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" style={{ color: "oklch(0.65 0.18 240)" }} /> FAA-approved schools only</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" style={{ color: "oklch(0.65 0.18 240)" }} /> Airline partnership info</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" style={{ color: "oklch(0.65 0.18 240)" }} /> 2026 pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAA Route Explainer */}
      <section className="py-10" style={{ background: "oklch(0.12 0.09 252)", borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "⚡", title: "Part 141 — Accelerated", desc: "FAA-approved structured curriculum. Minimum hours are lower (190 hrs for CPL vs 250 for Part 61). Best for full-time students who want the fastest route to the airlines.", color: "oklch(0.72 0.18 65)" },
              { icon: "🔄", title: "Part 61 — Flexible", desc: "No fixed curriculum. Train at your own pace. Requires more total hours (250 hrs for CPL) but offers maximum flexibility for part-time students or those with prior experience.", color: "oklch(0.45 0.18 240)" },
              { icon: "🎓", title: "University / R-ATP", desc: "4-year degree + FAA ratings. Graduates of qualifying aviation programmes qualify for the Restricted-ATP at just 1,000 hours — saving 12–18 months vs the standard 1,500-hour requirement.", color: "oklch(0.6 0.18 200)" },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="py-10" style={{ background: "oklch(0.11 0.09 252)" }}>
        <div className="container">
          {/* Filters */}
          <div className="p-5 rounded-2xl mb-8" style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: muted }} />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "oklch(0.10 0.07 252)", border: `1px solid ${border}`, color: "white" }}
                />
              </div>

              {/* Training type */}
              <select
                value={trainingType}
                onChange={(e) => setTrainingType(e.target.value)}
                className="px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                style={{ background: "oklch(0.10 0.07 252)", border: `1px solid ${border}`, color: trainingType ? "white" : muted }}
              >
                {TRAINING_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              {/* Finance */}
              <select
                value={financeFilter}
                onChange={(e) => setFinanceFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                style={{ background: "oklch(0.10 0.07 252)", border: `1px solid ${border}`, color: financeFilter ? "white" : muted }}
              >
                <option value="">Finance: all options</option>
                <option value="yes">Finance available</option>
                <option value="partial">Partial finance</option>
                <option value="no">No finance</option>
              </select>

              {/* Clear */}
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => { setStateFilter(""); setTrainingType(""); setFinanceFilter(""); setSearchTerm(""); }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ border: `1px solid ${border}`, color: muted }}
                >
                  <X className="w-4 h-4" /> Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm" style={{ color: muted }}>
              Showing <span className="text-white font-semibold">{schools.length}</span> of {US_SCHOOLS.length} US schools
            </p>
            <Link href="/us/calculator" className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline" style={{ color: "oklch(0.65 0.18 240)" }}>
              Estimate your costs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* School cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>

          {schools.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-white mb-2">No schools match your filters</p>
              <p className="text-sm mb-4" style={{ color: muted }}>Try adjusting your search or clearing the filters.</p>
              <button
                type="button"
                onClick={() => { setStateFilter(""); setTrainingType(""); setFinanceFilter(""); setSearchTerm(""); }}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: ctaGradient }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "oklch(0.12 0.09 252)" }}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Not sure which school is right for you?
            </h2>
            <p className="text-base mb-6" style={{ color: muted }}>
              Use the US cost calculator to estimate your total training cost across Part 141 and Part 61 routes — including checkrides, FAA exams, and living costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/us/calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient }}
              >
                <Zap className="w-4 h-4" />
                US Cost Calculator
              </Link>
              <Link
                href="/us/cadet-eligibility"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all"
                style={{ border: "1px solid oklch(1 0 0 / 0.15)", color: "white" }}
                onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Check Cadet Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}

function SchoolCard({ school }: { school: StaticSchool }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: surface, border: `1px solid ${border}` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-bold text-lg text-white">{school.name}</h3>
              {school.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "oklch(0.72 0.18 65 / 0.15)", color: "oklch(0.72 0.18 65)", border: "1px solid oklch(0.72 0.18 65 / 0.25)" }}>
                  {school.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: muted }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{school.city}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold text-white">{school.priceRange}</div>
            {school.duration && <div className="text-xs mt-0.5" style={{ color: muted }}>{school.duration}</div>}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {school.modularAtpl && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: "oklch(0.45 0.18 240 / 0.12)", color: "oklch(0.65 0.18 240)", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}>
              Part 141
            </span>
          )}
          {school.ppl && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: "oklch(0.6 0.18 200 / 0.12)", color: "oklch(0.7 0.18 200)", border: "1px solid oklch(0.6 0.18 200 / 0.2)" }}>
              PPL
            </span>
          )}
          {school.financeAvailable === "yes" && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1" style={{ background: "oklch(0.55 0.18 145 / 0.1)", color: "oklch(0.65 0.18 145)", border: "1px solid oklch(0.55 0.18 145 / 0.2)" }}>
              <CreditCard className="w-3 h-3" /> Finance available
            </span>
          )}
          {school.accommodationAvailable === "yes" && (
            <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: "oklch(0.65 0.2 300 / 0.1)", color: "oklch(0.7 0.2 300)", border: "1px solid oklch(0.65 0.2 300 / 0.15)" }}>
              Accommodation
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: muted }}>
          {expanded ? school.description : `${school.description?.slice(0, 180)}...`}
        </p>

        {/* Highlights */}
        {school.highlights && school.highlights.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {school.highlights.slice(0, expanded ? undefined : 3).map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.65 0.18 240)" }} />
                <span style={{ color: "oklch(0.7 0.04 240)" }}>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Airline partnerships */}
        {school.airlinePartnerships && (
          <div className="flex items-start gap-2 mb-4 p-3 rounded-lg" style={{ background: "oklch(0.45 0.18 240 / 0.07)", border: "1px solid oklch(0.45 0.18 240 / 0.15)" }}>
            <Plane className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.65 0.18 240)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.65 0.18 240)" }}>Airline partnerships</p>
              <p className="text-xs" style={{ color: muted }}>{school.airlinePartnerships}</p>
            </div>
          </div>
        )}

        {/* Testimonials */}
        {expanded && school.testimonials && school.testimonials.length > 0 && (
          <div className="space-y-3 mb-4">
            {school.testimonials.map((t) => (
              <div key={t.name} className="p-3 rounded-xl" style={{ background: "oklch(0.10 0.07 252)", border: `1px solid ${border}` }}>
                <div className="flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.65 0.18 240)" }} />
                  <p className="text-xs italic leading-relaxed" style={{ color: "oklch(0.65 0.04 240)" }}>{t.quote}</p>
                </div>
                <p className="text-xs font-semibold mt-2" style={{ color: muted }}>— {t.name}, {t.role}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2" style={{ borderTop: `1px solid ${border}` }}>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-semibold transition-colors"
            style={{ color: "oklch(0.65 0.18 240)" }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white no-underline transition-all"
              style={{ background: ctaGradient }}
            >
              <Globe className="w-3.5 h-3.5" />
              Visit school
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
