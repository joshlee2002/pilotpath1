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

  const resultQuery = trpc.leads.getResult.useQuery({ leadId }, { enabled: !!leadId });
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

  useEffect(() => {
    if (resultQuery.data && !roadmap && !roadmapMutation.isPending && !roadmapMutation.isSuccess) {
      const cached = resultQuery.data.lead.aiRoadmap;
      if (cached) {
        try { setRoadmap(JSON.parse(cached)); } catch { roadmapMutation.mutate({ leadId }); }
      } else {
        roadmapMutation.mutate({ leadId });
      }
    }
  }, [resultQuery.data]);

  useEffect(() => {
    if (resultQuery.data) Analytics.quizCompleted();
  }, [resultQuery.data]);
  useEffect(() => {
    document.title = "Your AviatorIQ Pilot Blueprint – Results";
  }, []);

  const toggleSchool = (id: number) => {
    setSelectedSchoolIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

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

  if (resultQuery.isLoading || !resultQuery.data) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
            <p className="font-semibold text-[var(--color-navy)] mb-1">Calculating your AviatorIQ Score…</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">Analysing your profile and matching training routes.</p>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const { lead, matchedSchools } = resultQuery.data;
  const dimensions = (resultQuery.data as unknown as { dimensions?: Dimensions }).dimensions;
  const labels = (resultQuery.data as unknown as { labels?: DimensionLabels }).labels;
  const nextAction = (resultQuery.data as unknown as { nextAction?: string }).nextAction;
  const biggestRisk = (resultQuery.data as unknown as { biggestRisk?: string }).biggestRisk;
  const estimatedCostRange = (resultQuery.data as unknown as { estimatedCostRange?: string }).estimatedCostRange;
  const estimatedTimeline = (resultQuery.data as unknown as { estimatedTimeline?: string }).estimatedTimeline;
  const recommendedRoute = (resultQuery.data as unknown as { recommendedRoute?: string }).recommendedRoute;

  const isGenerating = roadmapMutation.isPending || (!roadmap && !roadmapError);
  const { formatPrice, currency } = useCurrency();

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
      <main className="flex-1 bg-sky-subtle">

        {/* ── Hero: AviatorIQ Score ── */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <div className="flex flex-col items-center text-center gap-4 animate-fade-in-up">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-cta)]" />
                Assessment complete — your AviatorIQ Score is ready
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                {lead.fullName}'s Pilot Readiness Report
              </h1>
              <ScoreRing score={lead.leadScore} />
              <div className="flex items-center gap-2">
                <CategoryBadge category={lead.leadCategory} />
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-white/50 hover:text-white/90 transition-colors" aria-label="What does this phase mean?">
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-left p-4 space-y-2">
                      <p className="font-semibold text-sm">
                        {lead.leadCategory === "Hot" ? "Flight Ready" : lead.leadCategory === "Warm" ? "Development Phase" : "Exploration Phase"}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lead.leadCategory === "Hot"
                          ? "You have strong readiness across finance, medical, and career clarity. You're well-positioned to begin serious training conversations with flight schools."
                          : lead.leadCategory === "Warm"
                          ? "You're building solid foundations but have a few areas to develop — typically finance, medical clearance, or training route clarity. Work through your roadmap below to progress to Flight Ready."
                          : "You're at the start of your pilot journey — exactly where most pilots begin. Use your personalised roadmap below to understand what steps will move you toward Development Phase and beyond."}
                      </p>
                      <p className="text-xs font-medium">
                        {lead.leadCategory === "Hot"
                          ? "Score: 85–100"
                          : lead.leadCategory === "Warm"
                          ? "Score: 55–84"
                          : "Score: 0–54"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-white/70 text-sm max-w-md">
                {lead.leadCategory === "Hot"
                  ? "Your profile shows strong readiness. You have the foundations to start training seriously."
                  : lead.leadCategory === "Warm"
                  ? "You're building towards readiness. A few key areas to develop before you begin."
                  : "You're in the exploration phase — exactly where many pilots start. Let's map out your path forward."}
              </p>
              {/* PDF Download */}
              {pdfQuery.data?.pdfUrl ? (
                <a
                  href={pdfQuery.data.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  Download Your Pilot Blueprint PDF
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white/50 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating your Blueprint PDF…
                </div>
              )}

              {/* Social sharing */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <span className="text-white/60 text-xs font-medium uppercase tracking-wide">Share your result</span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Could you actually become an airline pilot? I just took the AviatorIQ assessment to find out. ✈️')}&url=${encodeURIComponent('https://pilotpath-mchvfa42.manus.space/quiz')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 hover:bg-black/50 border border-white/20 text-white text-sm font-medium transition-colors no-underline"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent('Could you actually become an airline pilot? I just took the AviatorIQ assessment to find out: https://pilotpath-mchvfa42.manus.space/quiz ✈️')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/70 hover:bg-green-600/90 border border-white/20 text-white text-sm font-medium transition-colors no-underline"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Share on WhatsApp
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
                <div key={i} className="card-base p-4 text-center">
                  <div className="flex justify-center text-[var(--color-primary)] mb-2">{item.icon}</div>
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-[var(--color-navy)] leading-tight">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Matched Schools + Request Introduction ── */}
          <div className="card-base p-6 animate-fade-in-up">
            <h2 className="font-display font-bold text-[var(--color-navy)] text-xl mb-1">Matched Flight Schools</h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
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
                        className={`border rounded-xl p-4 transition-all cursor-pointer ${
                          introSubmitted ? "opacity-60 cursor-default" :
                          isSelected ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm" :
                          isDisabled ? "border-border opacity-50 cursor-not-allowed" :
                          "border-border hover:border-[var(--color-primary)]/50 hover:bg-muted/30"
                        }`}
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
                              <h3 className="font-display font-semibold text-[var(--color-navy)] text-sm">{school.name}</h3>
                              {school.financeAvailable === "yes" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Finance available</span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {[school.city, school.country].filter(Boolean).join(", ")}
                              {school.priceRange && ` · ${convertPriceString(school.priceRange, formatPrice)}${currency.code !== "GBP" ? ` (${currency.code})` : ""}`}
                            </p>
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {school.integratedAtpl && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Integrated ATPL</span>}
                              {school.modularAtpl && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Modular ATPL</span>}
                              {school.ppl && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">PPL</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!introSubmitted ? (
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--color-muted-foreground)]">
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
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Introduction requests sent!</p>
                      <p className="text-xs text-green-700 mt-0.5">We've notified the selected schools. Expect to hear back within 2–3 business days.</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Globe className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-3" />
                <p className="font-display font-semibold text-[var(--color-navy)] mb-1">Expanding our school network</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  We are still adding schools that match your profile. Your results have been saved.
                </p>
                <Link href="/schools" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] mt-3">
                  Browse all schools <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Next Action ── */}
          {nextAction && (
            <div className="card-base p-5 border-[var(--color-primary)] bg-[var(--color-primary-light)] animate-fade-in-up flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">Your Next Action</p>
                <p className="font-semibold text-[var(--color-navy)]">{nextAction}</p>
              </div>
            </div>
          )}

          {/* ── 5-Dimension Score Card ── */}
          {dimensions && labels && (
            <div className="card-base p-6 animate-fade-in-up">
              <h2 className="font-display font-bold text-[var(--color-navy)] text-lg mb-1">Your 5-Dimension AviatorIQ Breakdown</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-5">Each dimension is scored 0–100 based on your answers.</p>
              <div className="space-y-4">
                {dimensionConfig.map(({ key, label, icon, color }) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={color}>{icon}</span>
                        <span className="text-sm font-semibold text-[var(--color-navy)]">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          dimensions[key] >= 70 ? "bg-green-100 text-green-700" :
                          dimensions[key] >= 45 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>{labels[key]}</span>
                        <span className="text-sm font-bold text-[var(--color-navy)] w-8 text-right">{dimensions[key]}</span>
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
            <div className="card-base p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <PoundSterling className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-green-900 mb-1">You may qualify for pilot training finance</h3>
                  <p className="text-sm text-green-800 mb-3">
                    Many aspiring pilots fund their training through specialist aviation loans, career development loans, school payment plans, and airline cadet sponsorships.
                  </p>
                  <Link href="/guides/finance-guide" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                    Read the Finance Guide <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── AI Roadmap ── */}
          {isGenerating ? (
            <div className="card-base p-8 text-center animate-fade-in">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
              <p className="font-display font-semibold text-[var(--color-navy)] mb-1">Generating your personalised roadmap…</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Our AI is analysing your profile and preparing your training recommendations.</p>
            </div>
          ) : roadmapError ? (
            <div className="card-base p-6 border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Roadmap generation delayed</span>
              </div>
              <p className="text-sm text-amber-600">We were unable to generate your AI roadmap right now. Your results have been saved and we will follow up with you shortly.</p>
            </div>
          ) : roadmap ? (
            <div className="space-y-5">
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
                          {formatPrice(roadmap.estimatedCostMin!)} – {formatPrice(roadmap.estimatedCostMax!)}
                          {currency.code !== "GBP" && (
                            <div className="text-xs font-normal text-[var(--color-muted-foreground)] mt-0.5">
                              ≈ £{roadmap.estimatedCostMin!.toLocaleString("en-GB")} – £{roadmap.estimatedCostMax!.toLocaleString("en-GB")} GBP
                            </div>
                          )}
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
                        <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-[var(--color-foreground)] leading-relaxed text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

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

          {/* ── Finance Referral Card ── */}
          <div className="card-base p-6 border-2 border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary-light)] to-white animate-fade-in-up">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <PoundSterling className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[var(--color-navy)] text-lg mb-1">Get free finance guidance</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">Funding is the biggest barrier for most aspiring pilots. Leave your details and we will connect you with specialist aviation finance guidance — no obligation, no hard sell.</p>
              </div>
            </div>
            {financeSubmitted ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
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
                    <label className="block text-xs font-semibold text-[var(--color-navy)] mb-1">Your name *</label>
                    <input value={financeName} onChange={e => setFinanceName(e.target.value)} placeholder="Full name" className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-navy)] mb-1">Email address *</label>
                    <input value={financeEmail} onChange={e => setFinanceEmail(e.target.value)} placeholder="you@example.com" type="email" className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-navy)] mb-1">Phone (optional)</label>
                    <input value={financePhone} onChange={e => setFinancePhone(e.target.value)} placeholder="07xxx xxxxxx" className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-navy)] mb-1">Training route</label>
                    <select value={financeRoute} onChange={e => setFinanceRoute(e.target.value as any)} className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                      <option value="unsure">Not sure yet</option>
                      <option value="integrated">Integrated ATPL</option>
                      <option value="modular">Modular</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--color-navy)] mb-1">Estimated training budget</label>
                    <select value={financeBudget} onChange={e => setFinanceBudget(e.target.value as any)} className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
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
                  <span className="text-xs text-[var(--color-muted-foreground)]">I consent to being contacted with finance guidance. I understand this is not financial advice.</span>
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
          <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center">
            <Clock className="w-8 h-8 text-[var(--color-cta)] mx-auto mb-3" />
            <h3 className="font-display font-bold text-xl mb-2">Ready to take the next step?</h3>
            <p className="text-white/70 text-sm mb-5">Browse all flight schools in our directory or use the cost calculator to plan your budget.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/schools" className="btn-cta text-sm">
                Browse all schools <ArrowRight className="w-4 h-4" />
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
