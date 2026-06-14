import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useCurrency } from "@/contexts/CurrencyContext";
import { convertPriceString } from "@/lib/currencyUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  ChevronRight,
  Heart,
  Briefcase,
  Map,
  PoundSterling,
  Plane,
  School,
  FileDown,
  Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────
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

interface Dimensions {
  readiness: number;
  finance: number;
  medical: number;
  career: number;
  pathway: number;
}

interface DimensionLabels {
  readiness: string;
  finance: string;
  medical: string;
  career: string;
  pathway: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#f97316" : score >= 55 ? "#f59e0b" : "#60a5fa";
  const phase = score >= 85 ? "Flight Ready" : score >= 55 ? "Development" : "Exploration";
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="text-center text-white">
        <div className="text-4xl font-black">{score}</div>
        <div className="text-xs font-semibold mt-0.5" style={{ color }}>{phase}</div>
      </div>
    </div>
  );
}

function AnimatedBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400);
    return () => clearTimeout(t);
  }, [score]);
  const color = score >= 85 ? "bg-orange-500" : score >= 55 ? "bg-amber-500" : "bg-blue-400";
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  if (category === "Hot") return <span className="badge-hot"><Flame className="w-3 h-3" /> Flight Ready</span>;
  if (category === "Warm") return <span className="badge-warm"><Thermometer className="w-3 h-3" /> Development Phase</span>;
  return <span className="badge-cold"><Snowflake className="w-3 h-3" /> Exploration Phase</span>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Results() {
  const params = useParams<{ leadId: string }>();
  const leadId = parseInt(params.leadId ?? "0", 10);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [roadmapError, setRoadmapError] = useState(false);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<number[]>([]);
  const [introSubmitted, setIntroSubmitted] = useState(false);

  // Try to load cached result from sessionStorage (set by Quiz.tsx on submit)
  const [cachedResult] = useState<typeof resultQuery.data | null>(() => {
    try {
      const raw = sessionStorage.getItem(`quiz_result_${leadId}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const resultQuery = trpc.leads.getResult.useQuery(
    { leadId },
    // Skip DB fetch if we already have the result from sessionStorage
    { enabled: !!leadId && !cachedResult }
  );
  const pdfQuery = trpc.leads.getPdfUrl.useQuery({ leadId }, { enabled: !!leadId, refetchInterval: (q) => (!q.state.data?.pdfUrl ? 5000 : false) });
  const roadmapMutation = trpc.leads.generateRoadmap.useMutation({
    onSuccess: (data) => {
      try { setRoadmap(JSON.parse(data.roadmap)); } catch { setRoadmapError(true); }
    },
    onError: () => setRoadmapError(true),
  });
  const requestIntros = trpc.introductions.requestIntroductions.useMutation();
  const [financeFormOpen, setFinanceFormOpen] = useState(false);
  const [financeSubmitted, setFinanceSubmitted] = useState(false);
  const [financeName, setFinanceName] = useState("");
  const [financeEmail, setFinanceEmail] = useState("");
  const [financePhone, setFinancePhone] = useState("");
  const [financeRoute, setFinanceRoute] = useState<"integrated" | "modular" | "unsure">("unsure");
  const [financeBudget, setFinanceBudget] = useState<"under50k" | "50k_80k" | "80k_100k" | "over100k" | "unsure">("unsure");
  const [financeConsent, setFinanceConsent] = useState(false);
  const submitFinanceInterest = trpc.finance.submitInterest.useMutation({
    onSuccess: () => { setFinanceSubmitted(true); toast.success("We'll be in touch with finance guidance."); },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  // Use cachedResult (from sessionStorage) OR the DB query result
  const activeResult = resultQuery.data ?? cachedResult;

  useEffect(() => {
    if (activeResult && !roadmap && !roadmapMutation.isPending && !roadmapMutation.isSuccess) {
      const cached = (activeResult.lead as any).aiRoadmap;
      if (cached) {
        try { setRoadmap(JSON.parse(cached)); } catch {
          roadmapMutation.mutate({ leadId, leadData: activeResult.lead as any });
        }
      } else {
        // Pass lead data as fallback so server can generate roadmap without DB
        roadmapMutation.mutate({ leadId, leadData: activeResult.lead as any });
      }
    }
  }, [activeResult]);

  useEffect(() => {
    if (activeResult) Analytics.quizCompleted();
  }, [activeResult]);
  useEffect(() => {
    document.title = "Your AviatorIQ Pilot Blueprint – Results";
  }, []);

  const toggleSchool = (id: number) => {
    setSelectedSchoolIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const { formatPrice, currency } = useCurrency();

  const handleRequestIntros = async () => {
    if (!selectedSchoolIds.length) return;
    try {
      await requestIntros.mutateAsync({ leadId, schoolIds: selectedSchoolIds });
      setIntroSubmitted(true);
      Analytics.contactRequested();
      toast.success("Introduction requests sent! We'll be in touch shortly.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if ((resultQuery.isLoading && !cachedResult) || !activeResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <main className="flex-1 flex items-center justify-center py-20" style={{ background: "oklch(0.10 0.01 240)" }}>
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "oklch(0.55 0.18 240)" }} />
            <p className="font-semibold text-white mb-1">Calculating your AviatorIQ Score…</p>
            <p className="text-sm" style={{ color: "oklch(0.6 0 0)" }}>Analysing your profile and matching training routes.</p>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const { lead, matchedSchools } = activeResult;
  const dimensions = (activeResult as unknown as { dimensions?: Dimensions }).dimensions;
  const labels = (activeResult as unknown as { labels?: DimensionLabels }).labels;
  const nextAction = (activeResult as unknown as { nextAction?: string }).nextAction;
  const biggestRisk = (activeResult as unknown as { biggestRisk?: string }).biggestRisk;
  const estimatedCostRange = (activeResult as unknown as { estimatedCostRange?: string }).estimatedCostRange;
  const estimatedTimeline = (activeResult as unknown as { estimatedTimeline?: string }).estimatedTimeline;
  const recommendedRoute = (activeResult as unknown as { recommendedRoute?: string }).recommendedRoute;

  const isGenerating = roadmapMutation.isPending || (!roadmap && !roadmapError);

  const dimensionConfig = [
    { key: "readiness" as const, label: "Readiness", icon: <Clock className="w-4 h-4" />, color: "text-blue-500" },
    { key: "finance" as const, label: "Finance", icon: <PoundSterling className="w-4 h-4" />, color: "text-green-500" },
    { key: "medical" as const, label: "Medical", icon: <Heart className="w-4 h-4" />, color: "text-red-500" },
    { key: "career" as const, label: "Career Clarity", icon: <Briefcase className="w-4 h-4" />, color: "text-purple-500" },
    { key: "pathway" as const, label: "Pathway Match", icon: <Map className="w-4 h-4" />, color: "text-indigo-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1" style={{ background: "oklch(0.10 0.01 240)" }}>

        {/* ── Mission Control Hero ── */}
        <div className="bg-hero relative overflow-hidden">
          {/* Radar grid */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, oklch(0.65 0.18 230) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

          <div className="container relative py-10 md:py-14">
            {/* Status bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-cockpit-green)] animate-pulse" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Assessment Complete</span>
              </div>
              <div className="flex items-center gap-3">
                {pdfQuery.data?.pdfUrl ? (
                  <a href={pdfQuery.data.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white text-xs font-medium transition-colors no-underline"
                    style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)" }}>
                    <FileDown className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 text-xs"
                    style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating PDF…
                  </div>
                )}
              </div>
            </div>

            {/* Main instrument panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">

              {/* Score gauge */}
              <div className="flex flex-col items-center gap-3 animate-scale-in">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
                    <circle
                      cx="80" cy="80" r="66" fill="none"
                      stroke={lead.leadScore >= 85 ? "oklch(0.72 0.2 145)" : lead.leadScore >= 55 ? "oklch(0.78 0.18 75)" : "oklch(0.65 0.18 230)"}
                      strokeWidth="12" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 66}`}
                      strokeDashoffset={`${2 * Math.PI * 66 * (1 - lead.leadScore / 100)}`}
                      style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.23,1,0.32,1)" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white leading-none">{lead.leadScore}</span>
                    <span className="text-white/60 text-xs mt-1">/ 100</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-center mb-1">
                    <CategoryBadge category={lead.leadCategory} />
                  </div>
                  <p className="text-white/65 text-xs text-center">AviatorIQ Score</p>
                </div>
              </div>

              {/* Right panel */}
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                    {lead.fullName.split(" ")[0]}'s Pilot Command Centre
                  </h1>
                  <p className="text-white/60 text-sm">
                    {lead.leadCategory === "Hot"
                      ? "Strong readiness across all dimensions. You're positioned to begin serious training conversations."
                      : lead.leadCategory === "Warm"
                      ? "Building solid foundations. A few key areas to develop before you're flight-ready."
                      : "Exploration phase — exactly where most pilots start. Your roadmap is below."}
                  </p>
                </div>

                {/* 4-tile instrument panel */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    { label: "Biggest Risk", value: biggestRisk ?? "—", color: "oklch(0.78 0.18 25)", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                    { label: "Best Route", value: recommendedRoute ?? "—", color: "oklch(0.65 0.18 230)", icon: <Plane className="w-3.5 h-3.5" /> },
                    { label: "Est. Cost", value: estimatedCostRange ? estimatedCostRange.split("–")[0].trim() + "–" + (estimatedCostRange.split("–")[1] ?? "").trim() : "—", color: "oklch(0.72 0.2 145)", icon: <PoundSterling className="w-3.5 h-3.5" /> },
                    { label: "Timeline", value: estimatedTimeline ?? "—", color: "oklch(0.75 0.12 290)", icon: <Clock className="w-3.5 h-3.5" /> },
                  ].map((tile) => (
                    <div key={tile.label} className="stat-tile">
                      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: tile.color }}>
                        {tile.icon}
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{tile.label}</span>
                      </div>
                      <div className="text-white font-display font-bold text-sm leading-tight">{tile.value}</div>
                    </div>
                  ))}
                </div>

                {/* Share row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wide">Share</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Could you actually become an airline pilot? I just took the AviatorIQ assessment to find out. ✈️')}&url=${encodeURIComponent(window.location.origin + '/quiz')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white text-xs font-medium transition-colors no-underline"
                    style={{ background: "oklch(0 0 0 / 0.3)", border: "1px solid oklch(1 0 0 / 0.15)" }}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent('Could you actually become an airline pilot? I just took the AviatorIQ assessment to find out: ' + window.location.origin + '/quiz ✈️')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white text-xs font-medium transition-colors no-underline"
                    style={{ background: "oklch(0.45 0.18 145 / 0.4)", border: "1px solid oklch(1 0 0 / 0.15)" }}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-3xl py-10 px-4 space-y-6">

          {/* ── Quick summary cards ── */}
          {(recommendedRoute || estimatedCostRange || estimatedTimeline || biggestRisk) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up">
              {[
                { icon: <Plane className="w-4 h-4" />, label: "Recommended Route", value: recommendedRoute },
                { icon: <PoundSterling className="w-4 h-4" />, label: `Estimated Cost${currency.code !== "GBP" ? ` (${currency.code})` : ""}`, value: estimatedCostRange ? convertPriceString(estimatedCostRange, formatPrice) : undefined },
                { icon: <Clock className="w-4 h-4" />, label: "Timeline", value: estimatedTimeline },
                { icon: <AlertTriangle className="w-4 h-4" />, label: "Biggest Risk", value: biggestRisk },
              ].filter(c => c.value).map((item, i) => (
                <div key={i} className="rounded-xl p-4 text-center" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.1)" }}>
                  <div className="flex justify-center mb-2" style={{ color: "oklch(0.65 0.18 240)" }}>{item.icon}</div>
                  <p className="text-xs mb-1" style={{ color: "oklch(0.55 0 0)" }}>{item.label}</p>
                  <p className="text-sm font-bold text-white leading-tight">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Matched Schools + Request Introduction ── */}
          <div className="rounded-2xl p-6 animate-fade-in-up" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.1)" }}>
            <h2 className="font-display font-bold text-white text-xl mb-1">Matched Flight Schools</h2>
            <p className="text-sm mb-5" style={{ color: "oklch(0.65 0 0)" }}>
              {matchedSchools.length > 0
                ? `We found ${matchedSchools.length} school${matchedSchools.length !== 1 ? "s" : ""} that match your profile. Select up to 3 and request an introduction — we'll make the connection on your behalf.`
                : "We're expanding our school network. Your profile has been saved and we'll notify you when suitable schools are added."}
            </p>

            {matchedSchools.length > 0 ? (
              <>
                <div className="space-y-3 mb-5">
                  {(matchedSchools as FlightSchool[]).map((school) => {
                    const isSelected = selectedSchoolIds.includes(school.id);
                    const isDisabled = !isSelected && selectedSchoolIds.length >= 3;
                    return (
                      <div
                        key={school.id}
                        onClick={() => !introSubmitted && !isDisabled && toggleSchool(school.id)}
                        className={`rounded-xl p-4 transition-all cursor-pointer ${
                          introSubmitted ? "opacity-60 cursor-default" :
                          isSelected ? "shadow-sm" :
                          isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        style={{
                          border: isSelected ? "1px solid oklch(0.55 0.18 240)" : "1px solid oklch(1 0 0 / 0.1)",
                          background: isSelected ? "oklch(0.55 0.18 240 / 0.12)" : "oklch(1 0 0 / 0.04)"
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={introSubmitted || isDisabled}
                            onCheckedChange={() => !introSubmitted && !isDisabled && toggleSchool(school.id)}
                            className="mt-0.5 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display font-semibold text-white text-sm">{school.name}</h3>
                              {school.financeAvailable === "yes" && (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.45 0.18 145 / 0.2)", color: "oklch(0.75 0.18 145)" }}>Finance available</span>
                              )}
                            </div>
                            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "oklch(0.6 0 0)" }}>
                              <MapPin className="w-3 h-3" />
                              {[school.city, school.country].filter(Boolean).join(", ")}
                              {school.priceRange && ` · ${convertPriceString(school.priceRange, formatPrice)}${currency.code !== "GBP" ? ` (${currency.code})` : ""}`}
                            </p>
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {school.integratedAtpl && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.18 240 / 0.15)", color: "oklch(0.75 0.15 240)" }}>Integrated ATPL</span>}
                              {school.modularAtpl && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.18 290 / 0.15)", color: "oklch(0.75 0.15 290)" }}>Modular ATPL</span>}
                              {school.ppl && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.45 0.18 145 / 0.15)", color: "oklch(0.75 0.18 145)" }}>PPL</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!introSubmitted ? (
                  <div className="space-y-3">
                    <p className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>
                      {selectedSchoolIds.length === 0
                        ? "Select up to 3 schools above to request introductions."
                        : `${selectedSchoolIds.length} school${selectedSchoolIds.length !== 1 ? "s" : ""} selected. We'll send your qualified profile to them — no cold calls, no spam.`}
                    </p>
                    <Button
                      onClick={handleRequestIntros}
                      disabled={selectedSchoolIds.length === 0 || requestIntros.isPending}
                      className="w-full btn-cta"
                      size="lg"
                    >
                      {requestIntros.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending requests…</>
                      ) : (
                        <><School className="w-4 h-4 mr-2" /> Request Introductions ({selectedSchoolIds.length})</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "oklch(0.45 0.18 145 / 0.15)", border: "1px solid oklch(0.45 0.18 145 / 0.3)" }}>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "oklch(0.75 0.18 145)" }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "oklch(0.85 0.1 145)" }}>Introduction requests sent!</p>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.7 0.08 145)" }}>We've notified the selected schools. Expect to hear back within 2–3 business days.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Globe className="w-8 h-8 mx-auto mb-3" style={{ color: "oklch(0.5 0 0)" }} />
                <p className="font-display font-semibold text-white mb-1">Expanding our school network</p>
                <p className="text-sm" style={{ color: "oklch(0.6 0 0)" }}>
                  We are still adding schools that match your profile. Your results have been saved.
                </p>
                <Link href="/schools" className="inline-flex items-center gap-1 text-sm font-semibold mt-3" style={{ color: "oklch(0.65 0.18 240)" }}>
                  Browse all schools <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Next Action ── */}
          {nextAction && (
            <div className="rounded-2xl p-5 animate-fade-in-up flex items-start gap-4" style={{ background: "oklch(0.55 0.18 240 / 0.1)", border: "1px solid oklch(0.55 0.18 240 / 0.25)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 240)" }}>
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "oklch(0.65 0.18 240)" }}>Your Next Action</p>
                <p className="font-semibold text-white">{nextAction}</p>
              </div>
            </div>
          )}

          {/* ── 5-Dimension Score Card ── */}
          {dimensions && labels && (
            <div className="rounded-2xl p-6 animate-fade-in-up" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.1)" }}>
              <h2 className="font-display font-bold text-white text-lg mb-1">Your 5-Dimension AviatorIQ Breakdown</h2>
              <p className="text-sm mb-5" style={{ color: "oklch(0.6 0 0)" }}>Each dimension is scored 0–100 based on your answers.</p>
              <div className="space-y-4">
                {dimensionConfig.map(({ key, label, icon, color }) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={color}>{icon}</span>
                        <span className="text-sm font-semibold text-white">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                          background: dimensions[key] >= 70 ? "oklch(0.45 0.18 145 / 0.2)" : dimensions[key] >= 45 ? "oklch(0.72 0.18 65 / 0.2)" : "oklch(0.55 0.18 25 / 0.2)",
                          color: dimensions[key] >= 70 ? "oklch(0.75 0.18 145)" : dimensions[key] >= 45 ? "oklch(0.82 0.18 65)" : "oklch(0.75 0.18 25)"
                        }}>{labels[key]}</span>
                        <span className="text-sm font-bold text-white w-8 text-right">{dimensions[key]}</span>
                      </div>
                    </div>
                    <AnimatedBar score={dimensions[key]} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Finance nudge ── */}
          {lead.wantsFinanceInfo === "Yes" && (
            <div className="rounded-2xl p-6 animate-fade-in-up" style={{ background: "oklch(0.45 0.18 145 / 0.1)", border: "1px solid oklch(0.45 0.18 145 / 0.25)" }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.45 0.18 145 / 0.3)" }}>
                  <PoundSterling className="w-5 h-5" style={{ color: "oklch(0.75 0.18 145)" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-white mb-1">You may qualify for pilot training finance</h3>
                  <p className="text-sm mb-3" style={{ color: "oklch(0.7 0 0)" }}>
                    Many aspiring pilots fund their training through specialist aviation loans, career development loans, school payment plans, and airline cadet sponsorships.
                  </p>
                  <Link href="/guides/finance-guide" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "oklch(0.75 0.18 145)" }}>
                    Read the Finance Guide <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Flight Plan (AI Roadmap) ── */}
          {isGenerating ? (
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-navy)", border: "1px solid oklch(1 0 0 / 0.1)" }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 0.1)" }}>
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-[var(--color-gold)]" />
                  <span className="text-white font-display font-bold text-sm uppercase tracking-widest">Flight Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--color-gold)]" />
                  <span className="text-white/50 text-xs">Generating…</span>
                </div>
              </div>
              <div className="p-8 text-center">
                <p className="text-white/70 text-sm">Our AI is analysing your profile and preparing your personalised training plan.</p>
              </div>
            </div>
          ) : roadmapError ? (
            <div className="card-base p-6 border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Flight Plan generation delayed</span>
              </div>
              <p className="text-sm text-amber-600">We were unable to generate your AI roadmap right now. Your results have been saved and we will follow up with you shortly.</p>
            </div>
          ) : roadmap ? (
            <div className="rounded-2xl overflow-hidden animate-fade-in-up" style={{ background: "var(--color-navy)", border: "1px solid oklch(1 0 0 / 0.1)" }}>
              {/* Header bar */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(1 0 0 / 0.1)" }}>
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-[var(--color-gold)]" />
                  <span className="text-white font-display font-bold text-sm uppercase tracking-widest">Flight Plan</span>
                </div>
                {roadmap.recommendedRoute && (
                  <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "oklch(0.65 0.18 230 / 0.2)", color: "oklch(0.8 0.15 230)", border: "1px solid oklch(0.65 0.18 230 / 0.3)" }}>
                    {roadmap.recommendedRoute}
                  </span>
                )}
              </div>

              <div className="p-6 space-y-0">
                {/* Goal summary */}
                {roadmap.pilotGoalSummary && (
                  <div className="mb-6 p-4 rounded-xl" style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                    <p className="text-white/70 text-sm leading-relaxed">{roadmap.pilotGoalSummary}</p>
                  </div>
                )}

                {/* Cost & Duration row */}
                {(roadmap.estimatedCostMin || roadmap.estimatedDuration) && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {roadmap.estimatedCostMin && roadmap.estimatedCostMax && (
                      <div className="p-4 rounded-xl" style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-1">Est. Cost</div>
                        <div className="font-display font-bold text-[var(--color-gold)] text-sm">
                          {formatPrice(roadmap.estimatedCostMin!)} – {formatPrice(roadmap.estimatedCostMax!)}
                        </div>
                        {currency.code !== "GBP" && (
                          <div className="text-[10px] text-white/60 mt-0.5">≈ £{roadmap.estimatedCostMin!.toLocaleString("en-GB")} – £{roadmap.estimatedCostMax!.toLocaleString("en-GB")} GBP</div>
                        )}
                      </div>
                    )}
                    {roadmap.estimatedDuration && (
                      <div className="p-4 rounded-xl" style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-1">Duration</div>
                        <div className="font-display font-bold text-white text-sm">{roadmap.estimatedDuration}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Waypoints — next steps */}
                {roadmap.nextSteps && roadmap.nextSteps.length > 0 && (
                  <div className="mb-6">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/65 mb-4">Waypoints</div>
                    <div className="relative">
                      {/* Vertical runway line */}
                      <div className="absolute left-[18px] top-6 bottom-6 w-px" style={{ background: "linear-gradient(to bottom, oklch(0.72 0.18 65 / 0.6), oklch(0.65 0.18 230 / 0.3))" }} />
                      <ol className="space-y-4">
                        {roadmap.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-4">
                            {/* Waypoint dot */}
                            <div className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-display font-black text-xs"
                              style={{
                                background: i === 0 ? "oklch(0.72 0.18 65)" : "oklch(1 0 0 / 0.08)",
                                border: i === 0 ? "none" : "1px solid oklch(1 0 0 / 0.15)",
                                color: i === 0 ? "oklch(0.15 0.05 240)" : "oklch(0.8 0.05 230)",
                              }}>
                              {i + 1}
                            </div>
                            <div className="flex-1 pt-1.5">
                              <p className="text-white/85 text-sm leading-relaxed">{step}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* Medical & Finance advisory row */}
                {(roadmap.medicalAdvice || roadmap.financeConsiderations) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {roadmap.medicalAdvice && (
                      <div className="p-4 rounded-xl" style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/65 mb-2">Medical Advisory</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-2">{roadmap.medicalAdvice}</p>
                        <Link href="/guides/class-1-medical" className="inline-flex items-center gap-1 text-[10px] font-semibold no-underline" style={{ color: "oklch(0.72 0.18 65)" }}>
                          Class 1 Medical guide <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    )}
                    {roadmap.financeConsiderations && (
                      <div className="p-4 rounded-xl" style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/65 mb-2">Finance Advisory</div>
                        <p className="text-white/70 text-xs leading-relaxed mb-2">{roadmap.financeConsiderations}</p>
                        <Link href="/guides/finance-guide" className="inline-flex items-center gap-1 text-[10px] font-semibold no-underline" style={{ color: "oklch(0.72 0.18 65)" }}>
                          Finance guide <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                {roadmap.disclaimer && (
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "oklch(0.72 0.18 65 / 0.08)", border: "1px solid oklch(0.72 0.18 65 / 0.15)" }}>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.72 0.18 65)" }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: "oklch(0.72 0.18 65 / 0.8)" }}>{roadmap.disclaimer}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* ── Finance Referral Card ── */}
          <div className="rounded-2xl p-6 animate-fade-in-up" style={{ background: "oklch(0.55 0.18 240 / 0.08)", border: "1px solid oklch(0.55 0.18 240 / 0.2)" }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.18 240)" }}>
                <PoundSterling className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg mb-1">Get free finance guidance</h3>
                <p className="text-sm" style={{ color: "oklch(0.65 0 0)" }}>Funding is the biggest barrier for most aspiring pilots. Leave your details and we will connect you with specialist aviation finance guidance — no obligation, no hard sell.</p>
              </div>
            </div>
            {financeSubmitted ? (
              <div className="flex items-center gap-2 rounded-lg p-3" style={{ background: "oklch(0.45 0.18 145 / 0.15)", color: "oklch(0.75 0.18 145)" }}>
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">Received — we will be in touch shortly.</span>
              </div>
            ) : !financeFormOpen ? (
              <button onClick={() => setFinanceFormOpen(true)} className="btn-cta text-sm w-full sm:w-auto">
                Get finance guidance <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Your name *</label>
                    <input value={financeName} onChange={e => setFinanceName(e.target.value)} placeholder="Full name" className="w-full rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[oklch(0.45_0_0)]" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.12)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Email address *</label>
                    <input value={financeEmail} onChange={e => setFinanceEmail(e.target.value)} placeholder="you@example.com" type="email" className="w-full rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[oklch(0.45_0_0)]" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.12)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Phone (optional)</label>
                    <input value={financePhone} onChange={e => setFinancePhone(e.target.value)} placeholder="07xxx xxxxxx" className="w-full rounded-lg px-3 py-2 text-sm outline-none text-white placeholder-[oklch(0.45_0_0)]" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.12)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Training route</label>
                    <select value={financeRoute} onChange={e => setFinanceRoute(e.target.value as any)} className="w-full rounded-lg px-3 py-2 text-sm outline-none text-white" style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(1 0 0 / 0.12)" }}>
                      <option value="unsure">Not sure yet</option>
                      <option value="integrated">Integrated ATPL</option>
                      <option value="modular">Modular</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-white mb-1">Estimated training budget</label>
                    <select value={financeBudget} onChange={e => setFinanceBudget(e.target.value as any)} className="w-full rounded-lg px-3 py-2 text-sm outline-none text-white" style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(1 0 0 / 0.12)" }}>
                      <option value="unsure">Not sure yet</option>
                      <option value="under50k">Under £50,000</option>
                      <option value="50k_80k">£50,000 – £80,000</option>
                      <option value="80k_100k">£80,000 – £100,000</option>
                      <option value="over100k">Over £100,000</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={financeConsent} onChange={e => setFinanceConsent(e.target.checked)} className="mt-0.5" />
                  <span className="text-xs" style={{ color: "oklch(0.6 0 0)" }}>I consent to being contacted with finance guidance. I understand this is not financial advice.</span>
                </label>
                <button
                  onClick={() => {
                    if (!financeName || !financeEmail || !financeConsent) { toast.error("Please fill in your name, email, and consent."); return; }
                    submitFinanceInterest.mutate({ name: financeName, email: financeEmail, phone: financePhone || undefined, trainingRoute: financeRoute, estimatedBudget: financeBudget, source: "results_page", leadId: leadId || undefined, consentToContact: financeConsent });
                  }}
                  disabled={submitFinanceInterest.isPending}
                  className="btn-cta text-sm w-full"
                >
                  {submitFinanceInterest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                </button>
              </div>
            )}
          </div>
          {/* ── Final CTA ── */}
          <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 240 / 0.15), oklch(0.45 0.2 260 / 0.1))", border: "1px solid oklch(0.55 0.18 240 / 0.25)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.2 45))", boxShadow: "0 0 30px oklch(0.72 0.18 65 / 0.3)" }}>
              <Plane className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-display font-bold text-white text-2xl mb-3">Your roadmap is ready.</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "oklch(0.65 0 0)" }}>Share your results, browse matched schools, or use the cost calculator to plan your budget in detail.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/schools" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.2 45))", boxShadow: "0 4px 20px oklch(0.72 0.18 65 / 0.3)" }}>
                Browse matched schools <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/calculator" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10" style={{ border: "1px solid oklch(1 0 0 / 0.2)", color: "oklch(0.75 0 0)" }}>
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
