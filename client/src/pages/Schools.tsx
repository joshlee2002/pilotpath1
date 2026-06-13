import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import {
  MapPin,
  Globe,
  CreditCard,
  Home,
  Building2,
  ExternalLink,
  Search,
  Filter,
  X,
  Loader2,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";

const COUNTRIES = [
  "United Kingdom", "United States", "Australia", "Canada", "Ireland",
  "Germany", "France", "Spain", "Netherlands", "New Zealand", "South Africa",
  "UAE", "Singapore", "Other",
];

export default function Schools() {
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

  const schools = (schoolsQuery.data ?? []).filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      (s.country ?? "").toLowerCase().includes(term) ||
      (s.city ?? "").toLowerCase().includes(term)
    );
  });

  const hasFilters = country || trainingType || financeFilter || searchTerm;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-4xl text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Flight School Directory
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Browse accredited flight schools and training providers. Filter by country, training type and finance options.
            </p>
            <Link href="/quiz" className="btn-cta text-sm">
              Get matched to a school
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-5xl">
            {/* Filters */}
            <div className="card-base p-4 mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search schools…"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
                  />
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
                >
                  <option value="">All countries</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
                >
                  <option value="">All training types</option>
                  <option value="integrated">Integrated ATPL</option>
                  <option value="modular">Modular ATPL</option>
                  <option value="ppl">PPL</option>
                </select>
                <select
                  value={financeFilter}
                  onChange={(e) => setFinanceFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:border-[var(--color-primary)] outline-none"
                >
                  <option value="">Finance: any</option>
                  <option value="yes">Finance available</option>
                  <option value="no">No finance</option>
                </select>
                {hasFilters && (
                  <button
                    onClick={() => { setCountry(""); setTrainingType(""); setFinanceFilter(""); setSearchTerm(""); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              {schoolsQuery.isLoading ? "Loading…" : `${schools.length} school${schools.length !== 1 ? "s" : ""} found`}
            </p>

            {/* School grid */}
            {schoolsQuery.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : schools.length === 0 ? (
              <div className="card-base p-10 text-center">
                <Building2 className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-3" />
                <h3 className="font-display font-bold text-[var(--color-navy)] mb-2">No schools found</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  We are still expanding our school network. Take the assessment and we will notify you when suitable schools are added.
                </p>
                <Link href="/quiz" className="btn-primary text-sm">Take the assessment</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schools.map((school) => (
                  <div key={school.id} className="card-base p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display font-bold text-[var(--color-navy)] text-lg">{school.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {[school.city, school.country].filter(Boolean).join(", ")}
                          {school.airport && <span className="text-xs">· {school.airport}</span>}
                        </div>
                      </div>
                      {school.website && (
                        <a
                          href={school.website.startsWith("http") ? school.website : `https://${school.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => Analytics.schoolRecommendationClicked(school.name)}
                          className="flex-shrink-0 p-2 rounded-lg bg-[var(--color-muted)] hover:bg-[var(--color-primary-light)] transition-colors"
                          title="Visit website"
                        >
                          <ExternalLink className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                        </a>
                      )}
                    </div>

                    {/* Course tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {school.integratedAtpl && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                          Integrated ATPL
                        </span>
                      )}
                      {school.modularAtpl && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                          Modular ATPL
                        </span>
                      )}
                      {school.ppl && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-medium">
                          PPL
                        </span>
                      )}
                      {school.financeAvailable === "yes" && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-medium">
                          Finance available
                        </span>
                      )}
                      {school.accommodationAvailable === "yes" && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 font-medium">
                          Accommodation
                        </span>
                      )}
                    </div>

                    {school.description && (
                      <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-4 line-clamp-3">
                        {school.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                      <div className="space-y-1">
                        {school.priceRange && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                            <CreditCard className="w-3 h-3" />
                            {school.priceRange}
                          </div>
                        )}
                        {school.airlinePartnerships && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                            <Globe className="w-3 h-3" />
                            {school.airlinePartnerships}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {school.contactEmail && (
                          <a
                            href={`mailto:${school.contactEmail}`}
                            onClick={() => Analytics.contactRequested()}
                            className="p-2 rounded-lg bg-[var(--color-muted)] hover:bg-[var(--color-primary-light)] transition-colors"
                            title="Send email"
                          >
                            <Mail className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                          </a>
                        )}
                        {school.phone && (
                          <a
                            href={`tel:${school.phone}`}
                            className="p-2 rounded-lg bg-[var(--color-muted)] hover:bg-[var(--color-primary-light)] transition-colors"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 card-base p-6 bg-[var(--color-navy)] text-white text-center">
              <h3 className="font-display font-bold text-xl mb-2">Not sure which school is right for you?</h3>
              <p className="text-white/70 text-sm mb-4">Take the free assessment and get matched to schools that fit your budget, country and training goal.</p>
              <Link href="/quiz" className="btn-cta text-sm">
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
