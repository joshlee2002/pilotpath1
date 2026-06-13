import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertPriceString } from "@/lib/currencyUtils";
import SEO from "@/components/SEO";
import {
  MapPin,
  Globe,
  CreditCard,
  Building2,
  Search,
  X,
  Loader2,
  ArrowRight,
  ChevronRight,
  Zap,
  CheckCircle,
  Quote,
} from "lucide-react";
import { STATIC_SCHOOLS, type StaticSchool } from "@/data/schools";

const COUNTRIES = [
  "United Kingdom", "United States", "Australia", "Canada", "Ireland",
  "Germany", "France", "Spain", "Netherlands", "New Zealand", "South Africa",
  "UAE", "Singapore", "Other",
];

const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.16)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";
const brandGradient = "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))";

export default function Schools() {
  const { formatPrice, currency } = useCurrency();
  const [country, setCountry] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [financeFilter, setFinanceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = {
    country: country || undefined,
    integratedAtpl: trainingType === "integrated" ? true : undefined,
    modularAtpl: trainingType === "modular" ? true : undefined,
    ppl: trainingType === "ppl" ? true : undefined,
    financeAvailable: financeFilter || undefined,
  };

  const schoolsQuery = trpc.schools.list.useQuery(filters);

  // Use static data as fallback when DB is unavailable
  const dbSchools = schoolsQuery.data ?? [];
  const sourceSchools: StaticSchool[] = dbSchools.length > 0
    ? (dbSchools as unknown as StaticSchool[])
    : STATIC_SCHOOLS;

  const schools = sourceSchools.filter((s) => {
    if (country && s.country !== country) return false;
    if (trainingType === "integrated" && !s.integratedAtpl) return false;
    if (trainingType === "modular" && !s.modularAtpl) return false;
    if (trainingType === "ppl" && !s.ppl) return false;
    if (financeFilter && s.financeAvailable !== financeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(term) ||
        (s.country ?? "").toLowerCase().includes(term) ||
        (s.city ?? "").toLowerCase().includes(term)
      );
    }
    return true;
  });

  const hasFilters = country || trainingType || financeFilter || searchTerm;

  const selectStyle: React.CSSProperties = {
    background: "oklch(0.16 0.08 250)",
    border: `1px solid ${border}`,
    color: "oklch(0.75 0.04 240)",
    borderRadius: "10px",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <SEO
        title="Flight School Directory UK 2026 | AviatorIQ"
        description="Browse 54+ UK and international flight schools. Filter by country, training type and finance. Request an introduction through AviatorIQ — we match you with the right school."
        canonical="/schools"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Flight School Directory",
          description: "Directory of UK and international flight schools for aspiring pilots",
          url: "https://aviatoriq.com/schools",
        }}
      />
      <PublicNav />
      <main className="flex-1">

        {/* Hero */}
        <div
          className="relative overflow-hidden py-10 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/images/training-aircraft.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.09 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-3xl text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5" style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
              <Building2 className="w-3 h-3" />
              Flight School Directory
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
              Find Your Flight School
            </h1>
            <p className="text-base md:text-lg mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
              Browse accredited flight schools and training providers across the UK and worldwide. Filter by training type, country, and finance options.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
              style={{ background: ctaGradient, boxShadow: "0 0 24px oklch(0.72 0.18 65 / 0.3)" }}
            >
              <Zap className="w-4 h-4" />
              Get matched to a school
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="py-6 md:py-10 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-5xl">

            {/* Filters */}
            <div className="p-4 rounded-2xl mb-6" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: muted }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search schools…"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "oklch(0.16 0.08 250)", border: `1px solid ${border}`, color: "oklch(0.75 0.04 240)" }}
                  />
                </div>
                <select value={country} onChange={(e) => setCountry(e.target.value)} style={selectStyle}>
                  <option value="">All countries</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={trainingType} onChange={(e) => setTrainingType(e.target.value)} style={selectStyle}>
                  <option value="">All training types</option>
                  <option value="integrated">Integrated ATPL</option>
                  <option value="modular">Modular ATPL</option>
                  <option value="ppl">PPL</option>
                </select>
                <select value={financeFilter} onChange={(e) => setFinanceFilter(e.target.value)} style={selectStyle}>
                  <option value="">Finance: any</option>
                  <option value="yes">Finance available</option>
                  <option value="no">No finance</option>
                </select>
                {hasFilters && (
                  <button
                    onClick={() => { setCountry(""); setTrainingType(""); setFinanceFilter(""); setSearchTerm(""); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ border: `1px solid ${border}`, color: muted, background: "transparent" }}
                  >
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm mb-5" style={{ color: muted }}>
              {schoolsQuery.isLoading ? "Loading…" : `${schools.length} school${schools.length !== 1 ? "s" : ""} found`}
            </p>

            {/* School grid */}
            {schoolsQuery.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.45 0.18 240)" }} />
              </div>
            ) : schools.length === 0 ? (
              <div className="p-10 rounded-2xl text-center" style={{ background: surface, border: `1px solid ${border}` }}>
                <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: muted }} />
                <h3 className="font-display font-bold text-white mb-2">No schools found</h3>
                <p className="text-sm mb-4" style={{ color: muted }}>
                  We are still expanding our school network. Take the assessment and we will notify you when suitable schools are added.
                </p>
                <Link href="/quiz" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white no-underline" style={{ background: brandGradient }}>
                  Take the assessment
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schools.map((school) => (
                  <div
                    key={school.id}
                    className="p-4 md:p-6 rounded-2xl transition-all duration-200"
                    style={{ background: surface, border: `1px solid ${border}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-display font-bold text-white text-lg">{school.name}</h3>
                          {(school as StaticSchool).badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "oklch(0.72 0.18 65 / 0.15)", color: "oklch(0.85 0.15 65)", border: "1px solid oklch(0.72 0.18 65 / 0.3)" }}>
                              {(school as StaticSchool).badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: muted }}>
                          <MapPin className="w-3.5 h-3.5" />
                          {[school.city, school.country].filter(Boolean).join(", ")}
                          {school.airport && <span className="text-xs">· {school.airport}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Course tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {school.integratedAtpl && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "oklch(0.45 0.18 240 / 0.15)", color: "oklch(0.7 0.18 240)", border: "1px solid oklch(0.45 0.18 240 / 0.25)" }}>
                          Integrated ATPL
                        </span>
                      )}
                      {school.modularAtpl && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "oklch(0.6 0.18 200 / 0.15)", color: "oklch(0.75 0.15 200)", border: "1px solid oklch(0.6 0.18 200 / 0.25)" }}>
                          Modular ATPL
                        </span>
                      )}
                      {school.ppl && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.7 0.18 145)", border: "1px solid oklch(0.55 0.18 145 / 0.25)" }}>
                          PPL
                        </span>
                      )}
                      {school.financeAvailable === "yes" && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "oklch(0.72 0.18 65 / 0.15)", color: "oklch(0.85 0.15 65)", border: "1px solid oklch(0.72 0.18 65 / 0.25)" }}>
                          Finance available
                        </span>
                      )}
                      {school.accommodationAvailable === "yes" && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "oklch(0.6 0.15 180 / 0.15)", color: "oklch(0.75 0.15 180)", border: "1px solid oklch(0.6 0.15 180 / 0.25)" }}>
                          Accommodation
                        </span>
                      )}
                    </div>

                    {school.description && (
                      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: muted }}>
                        {school.description}
                      </p>
                    )}

                    {/* Highlights */}
                    {(school as StaticSchool).highlights && (
                      <ul className="space-y-1 mb-4">
                        {(school as StaticSchool).highlights.slice(0, 3).map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.65 0.04 240)" }}>
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.55 0.18 145)" }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Testimonials */}
                    {(school as StaticSchool).testimonials && (school as StaticSchool).testimonials!.length > 0 && (
                      <div className="mb-4 space-y-3">
                        {(school as StaticSchool).testimonials!.slice(0, 1).map((t, i) => (
                          <div key={i} className="p-3 rounded-xl" style={{ background: "oklch(0.12 0.07 252)", border: "1px solid oklch(1 0 0 / 0.06)" }}>
                            <div className="flex items-start gap-2">
                              <Quote className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.6 0.18 240)" }} />
                              <p className="text-xs leading-relaxed italic" style={{ color: "oklch(0.65 0.04 240)" }}>"{t.quote}"</p>
                            </div>
                            <p className="text-xs mt-2 font-semibold" style={{ color: "oklch(0.5 0.04 240)" }}>— {t.name}, {t.role}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${border}` }}>
                      <div className="space-y-1">
                        {school.priceRange && (
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: muted }}>
                            <CreditCard className="w-3 h-3" />
                            <span title={school.priceRange}>
                              {convertPriceString(school.priceRange, formatPrice)}
                              {currency.code !== "GBP" && (
                                <span className="ml-1 opacity-60">({currency.code})</span>
                              )}
                            </span>
                          </div>
                        )}
                        {school.airlinePartnerships && (
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: muted }}>
                            <Globe className="w-3 h-3" />
                            {school.airlinePartnerships}
                          </div>
                        )}
                      </div>
                      <Link
                        href="/quiz"
                        onClick={() => Analytics.schoolRecommendationClicked(school.name)}
                        className="flex items-center gap-1.5 text-xs font-semibold no-underline transition-all"
                        style={{ color: "oklch(0.65 0.18 240)" }}
                      >
                        Request introduction
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div
              className="mt-10 p-8 rounded-2xl text-center"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
            >
              <h3 className="font-display font-bold text-xl text-white mb-2">Not sure which school is right for you?</h3>
              <p className="text-sm mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
                Take the free assessment and get matched to schools that fit your budget, country and training goal.
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" }}
              >
                Get matched now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
