import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import {
  Loader2,
  CheckCircle2,
  ArrowRight,
  Flame,
  Thermometer,
  Snowflake,
  MapPin,
  Globe,
  CreditCard,
  GraduationCap,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
// FlightSchool type inline to avoid cross-boundary import
interface FlightSchool {
  id: number;
  name: string;
  country: string | null;
  city: string | null;
  airport: string | null;
  integratedAtpl: boolean | null;
  modularAtpl: boolean | null;
  ppl: boolean | null;
  priceRange: string | null;
  financeAvailable: "yes" | "no" | "unknown" | null;
  website: string | null;
  active: boolean;
}

// ─── Roadmap data shape ───────────────────────────────────────────────────────
interface RoadmapData {
  pilotGoalSummary?: string;
  recommendedRoute?: string;
  routeRationale?: string;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  estimatedDuration?: string;
  readinessLabel?: string;
  readinessExplanation?: string;
  nextSteps?: string[];
  medicalAdvice?: string;
  financeConsiderations?: string;
  schoolTypeRecommendation?: string;
  disclaimer?: string;
}

function CategoryBadge({ category }: { category: string }) {
  if (category === "Hot") {
    return (
      <span className="badge-hot">
        <Flame className="w-3 h-3" /> Hot Lead
      </span>
    );
  }
  if (category === "Warm") {
    return (
      <span className="badge-warm">
        <Thermometer className="w-3 h-3" /> Warm Lead
      </span>
    );
  }
  return (
    <span className="badge-cold">
      <Snowflake className="w-3 h-3" /> Early Stage
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "var(--color-hot)" : score >= 45 ? "var(--color-warm)" : "var(--color-cold)";

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="56" cy="56" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-display font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-[var(--color-muted-foreground)]">/ 100</div>
      </div>
    </div>
  );
}

function SchoolCard({ school }: { school: FlightSchool }) {
  return (
    <div className="card-base p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-display font-bold text-[var(--color-navy)] text-sm">{school.name}</h4>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] mt-1">
            <MapPin className="w-3 h-3" />
            {school.city ? `${school.city}, ` : ""}{school.country}
          </div>
        </div>
        {school.website && (
          <a
            href={school.website.startsWith("http") ? school.website : `https://${school.website}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => Analytics.schoolRecommendationClicked(school.name)}
            className="flex-shrink-0 p-2 rounded-lg bg-[var(--color-muted)] hover:bg-[var(--color-primary-light)] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
          </a>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {school.integratedAtpl && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Integrated ATPL</span>}
        {school.modularAtpl && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">Modular ATPL</span>}
        {school.ppl && <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">PPL</span>}
        {school.financeAvailable === "yes" && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Finance available</span>}
      </div>
      {school.priceRange && (
        <div className="text-xs text-[var(--color-muted-foreground)]">
          <CreditCard className="w-3 h-3 inline mr-1" />
          {school.priceRange}
        </div>
      )}
    </div>
  );
}

export default function Results() {
  const params = useParams<{ leadId: string }>();
  const leadId = parseInt(params.leadId ?? "0", 10);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [roadmapError, setRoadmapError] = useState(false);

  const resultQuery = trpc.leads.getResult.useQuery({ leadId }, { enabled: !!leadId });
  const roadmapMutation = trpc.leads.generateRoadmap.useMutation({
    onSuccess: (data) => {
      try {
        setRoadmap(JSON.parse(data.roadmap));
      } catch {
        setRoadmapError(true);
      }
    },
    onError: () => setRoadmapError(true),
  });

  useEffect(() => {
    if (resultQuery.data && !roadmap && !roadmapMutation.isPending && !roadmapMutation.isSuccess) {
      // Check if cached roadmap exists
      const cached = resultQuery.data.lead.aiRoadmap;
      if (cached) {
        try {
          setRoadmap(JSON.parse(cached));
        } catch {
          roadmapMutation.mutate({ leadId });
        }
      } else {
        roadmapMutation.mutate({ leadId });
      }
    }
  }, [resultQuery.data]);

  if (resultQuery.isLoading || !resultQuery.data) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--color-muted-foreground)]">Loading your results…</p>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const { lead, matchedSchools } = resultQuery.data;
  const isGenerating = roadmapMutation.isPending || (!roadmap && !roadmapError);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 bg-sky-subtle">
        {/* Header */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <div className="flex items-start gap-4 animate-fade-in-up">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-cta)]" />
                  <span className="text-white/80 text-sm font-medium">Assessment complete</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                  Your Pilot Training Roadmap
                </h1>
                <p className="text-white/70">
                  Personalised for {lead.fullName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-3xl py-10 px-4">
          {/* Score card */}
          <div className="card-base p-6 md:p-8 mb-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={lead.leadScore} />
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <CategoryBadge category={lead.leadCategory} />
                </div>
                <h2 className="text-xl font-display font-bold text-[var(--color-navy)] mb-1">
                  Your Readiness Score: {lead.leadScore}/100
                </h2>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {lead.leadCategory === "Hot"
                    ? "You look like a strong candidate for pilot training. Your profile suggests you are ready to take the next steps."
                    : lead.leadCategory === "Warm"
                    ? "You are developing well as a candidate. A few areas to work on before starting training."
                    : "You are in the early stages of your pilot training journey. There is plenty of time to build your readiness."}
                </p>
              </div>
            </div>
          </div>

          {/* AI Roadmap */}
          {isGenerating ? (
            <div className="card-base p-8 mb-6 text-center animate-fade-in">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
              <p className="font-display font-semibold text-[var(--color-navy)] mb-1">Generating your personalised roadmap…</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Our AI is analysing your profile and preparing your training recommendations.</p>
            </div>
          ) : roadmapError ? (
            <div className="card-base p-6 mb-6 border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Roadmap generation delayed</span>
              </div>
              <p className="text-sm text-amber-600">We were unable to generate your AI roadmap right now. Your results have been saved and we will follow up with you shortly.</p>
            </div>
          ) : roadmap ? (
            <div className="space-y-5 mb-6">
              {/* Goal summary */}
              {roadmap.pilotGoalSummary && (
                <div className="card-base p-6 animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-display font-bold text-[var(--color-navy)]">Your pilot goal</h3>
                  </div>
                  <p className="text-[var(--color-muted-foreground)] leading-relaxed">{roadmap.pilotGoalSummary}</p>
                </div>
              )}

              {/* Recommended route */}
              {roadmap.recommendedRoute && (
                <div className="card-base p-6 animate-fade-in-up delay-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-display font-bold text-[var(--color-navy)]">Your best training route</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-display font-bold text-sm mb-3">
                    {roadmap.recommendedRoute}
                  </div>
                  {roadmap.routeRationale && (
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">{roadmap.routeRationale}</p>
                  )}
                </div>
              )}

              {/* Cost & duration */}
              {(roadmap.estimatedCostMin || roadmap.estimatedDuration) && (
                <div className="card-base p-6 animate-fade-in-up delay-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-display font-bold text-[var(--color-navy)]">Estimated cost & duration</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {roadmap.estimatedCostMin && roadmap.estimatedCostMax && (
                      <div className="p-4 rounded-xl bg-[var(--color-muted)]">
                        <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Estimated cost range</div>
                        <div className="font-display font-bold text-[var(--color-navy)]">
                          £{roadmap.estimatedCostMin.toLocaleString()} – £{roadmap.estimatedCostMax.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {roadmap.estimatedDuration && (
                      <div className="p-4 rounded-xl bg-[var(--color-muted)]">
                        <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Estimated duration</div>
                        <div className="font-display font-bold text-[var(--color-navy)]">{roadmap.estimatedDuration}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Readiness */}
              {roadmap.readinessLabel && (
                <div className="card-base p-6 animate-fade-in-up delay-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                      <Flame className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-display font-bold text-[var(--color-navy)]">Your readiness assessment</h3>
                  </div>
                  <div className="font-display font-bold text-[var(--color-primary)] mb-2">{roadmap.readinessLabel}</div>
                  {roadmap.readinessExplanation && (
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">{roadmap.readinessExplanation}</p>
                  )}
                </div>
              )}

              {/* Next steps */}
              {roadmap.nextSteps && roadmap.nextSteps.length > 0 && (
                <div className="card-base p-6 animate-fade-in-up delay-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-display font-bold text-[var(--color-navy)]">What to do next</h3>
                  </div>
                  <ol className="space-y-3">
                    {roadmap.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-[var(--color-foreground)] leading-relaxed text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Medical & Finance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in-up delay-400">
                {roadmap.medicalAdvice && (
                  <div className="card-base p-5">
                    <h4 className="font-display font-bold text-[var(--color-navy)] text-sm mb-2">Medical considerations</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{roadmap.medicalAdvice}</p>
                    <Link href="/guides/class-1-medical" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] mt-2 no-underline">
                      Class 1 Medical guide <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
                {roadmap.financeConsiderations && (
                  <div className="card-base p-5">
                    <h4 className="font-display font-bold text-[var(--color-navy)] text-sm mb-2">Finance considerations</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{roadmap.financeConsiderations}</p>
                    <Link href="/guides/finance-guide" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] mt-2 no-underline">
                      Finance guide <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              {roadmap.disclaimer && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in-up">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">{roadmap.disclaimer}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Matched schools */}
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-[var(--color-navy)] mb-2">
              Matched flight schools
            </h2>
            <p className="text-[var(--color-muted-foreground)] mb-5 text-sm">
              These schools match your training goal, country and budget preferences.
            </p>
            {matchedSchools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedSchools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            ) : (
              <div className="card-base p-6 text-center">
                <Globe className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-3" />
                <p className="font-display font-semibold text-[var(--color-navy)] mb-1">Expanding our school network</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  We are still adding schools that match your profile. Your results have been saved and we may contact you when suitable options become available.
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center">
            <Clock className="w-8 h-8 text-[var(--color-cta)] mx-auto mb-3" />
            <h3 className="font-display font-bold text-xl mb-2">Ready to take the next step?</h3>
            <p className="text-white/70 text-sm mb-5">
              Browse all flight schools in our directory or use the cost calculator to plan your budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/schools" className="btn-cta text-sm">
                Browse all schools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/calculator" className="btn-outline text-sm border-white/30 text-white hover:bg-white/10">
                Cost calculator
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
