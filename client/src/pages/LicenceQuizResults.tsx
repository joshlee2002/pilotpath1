import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  Plane,
  CheckCircle2,
  ChevronRight,
  Clock,
  PoundSterling,
  Users,
  ArrowRight,
  Share2,
} from "lucide-react";

type LicenceResult = {
  licence: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  estimatedCost: string;
  estimatedTimeline: string;
  bestFor: string;
  ctaText: string;
  careerAssessmentRate: number;
};

type StoredData = {
  id: number;
  result: LicenceResult;
};

// Colour mapping per licence
const LICENCE_COLOURS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  LAPL:             { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", badge: "bg-emerald-500" },
  PPL:              { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30",     badge: "bg-sky-500" },
  CPL:              { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30",  badge: "bg-violet-500" },
  Integrated_ATPL:  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",   badge: "bg-amber-500" },
  Modular_ATPL:     { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/30",  badge: "bg-orange-500" },
  FAA_PPL:          { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/30",    badge: "bg-rose-500" },
};

const LICENCE_LABELS: Record<string, string> = {
  LAPL: "LAPL",
  PPL: "PPL",
  CPL: "CPL",
  Integrated_ATPL: "Integrated ATPL",
  Modular_ATPL: "Modular ATPL",
  FAA_PPL: "FAA PPL",
};

export default function LicenceQuizResults() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<StoredData | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const statsQuery = trpc.licenceQuiz.stats.useQuery();
  const captureEmailMutation = trpc.licenceQuiz.captureEmail.useMutation({
    onSuccess: () => setEmailSubmitted(true),
    onError: () => setEmailError("Something went wrong. Please try again."),
  });

  useEffect(() => {
    document.title = "Your Pilot Licence Recommendation | AviatorIQ";
    const stored = sessionStorage.getItem("licenceQuizResult");
    if (!stored) {
      navigate("/quiz/licence");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      navigate("/quiz/licence");
    }
  }, [navigate]);

  if (!data) return null;

  const { result } = data;
  const colours = LICENCE_COLOURS[result.licence] ?? LICENCE_COLOURS.PPL;
  const label = LICENCE_LABELS[result.licence] ?? result.licence;

  // Social proof: use live DB rate if available, else fall back to baked-in rate
  const liveStats = statsQuery.data?.[result.licence];
  const proceededRate = liveStats && liveStats.total >= 10
    ? liveStats.proceededRate
    : result.careerAssessmentRate;
  const totalAssessed = liveStats?.total ?? null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    captureEmailMutation.mutate({ id: data.id, email, consentToContact: consent });
  };

  const handleShare = () => {
    const text = `I just found out which pilot licence is right for me — ${label}. Find out yours 👇`;
    const url = `${window.location.origin}/quiz/licence`;
    if (navigator.share) {
      navigator.share({ title: "Which Pilot Licence Is Right For You?", text, url }).catch(() => {});
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + "\n" + url)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-navy)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Plane className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="font-display font-bold text-sm">AviatorIQ</span>
        </Link>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-xs transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share result
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* ── Result card ── */}
        <div className={`rounded-2xl border ${colours.border} ${colours.bg} p-6 md:p-8`}>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Your recommended licence</p>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${colours.badge} mb-3`}>
                {label}
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                {result.title}
              </h1>
            </div>
          </div>
          <p className={`text-base font-medium mb-3 ${colours.text}`}>{result.tagline}</p>
          <p className="text-white/70 text-sm leading-relaxed">{result.description}</p>
        </div>

        {/* ── Key facts ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <PoundSterling className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="text-white/50 text-xs uppercase tracking-wider">Estimated Cost</span>
            </div>
            <p className="text-white font-semibold text-sm">{result.estimatedCost}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="text-white/50 text-xs uppercase tracking-wider">Timeline</span>
            </div>
            <p className="text-white font-semibold text-sm">{result.estimatedTimeline}</p>
          </div>
        </div>

        {/* ── Bullets ── */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">What this means for you</p>
          {result.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${colours.text}`} />
              <span className="text-white/80 text-sm">{b}</span>
            </div>
          ))}
        </div>

        {/* ── Best for ── */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-white/50 text-xs uppercase tracking-wider">Best for</span>
          </div>
          <p className="text-white/80 text-sm">{result.bestFor}</p>
        </div>

        {/* ── Social proof ── */}
        <div className="text-center py-2">
          <p className="text-white/35 text-xs">
            {proceededRate}% of people with this recommendation go on to take the full Career Readiness Assessment.
            {totalAssessed && totalAssessed >= 10 && (
              <span className="ml-1">Based on {totalAssessed} assessments.</span>
            )}
          </p>
        </div>

        {/* ── Email gate for detailed breakdown ── */}
        <div className="rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-6">
          {emailSubmitted ? (
            <div className="text-center py-2">
              <CheckCircle2 className="w-8 h-8 text-[var(--color-gold)] mx-auto mb-3" />
              <h3 className="text-white font-display font-bold text-lg mb-1">On its way.</h3>
              <p className="text-white/60 text-sm">
                Your full {label} breakdown — costs, timeline, training steps and next actions — is heading to your inbox.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-white font-display font-bold text-lg mb-1">
                Want your full {label} breakdown?
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Get a detailed breakdown of your recommended licence — costs, training steps, timeline, and exactly what to do next — sent straight to your inbox.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                />
                {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 accent-[var(--color-gold)]"
                  />
                  <span className="text-white/45 text-xs leading-relaxed">
                    I'm happy to hear from AviatorIQ about training options and matched flight schools.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={captureEmailMutation.isPending}
                  className="w-full py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-sm hover:bg-[var(--color-gold)]/90 transition-colors disabled:opacity-60"
                >
                  {captureEmailMutation.isPending ? "Sending…" : "Send me the full breakdown"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── Main CTA: funnel to Career Readiness Assessment ── */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Ready for the next step?</p>
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Take the AviatorIQ Career Readiness Assessment
          </h2>
          <p className="text-white/60 text-sm mb-5 max-w-md mx-auto">
            Discover your personalised readiness score, your biggest obstacle, an AI-generated training roadmap, and matched flight schools — in under 10 minutes.
          </p>
          <div className="space-y-3">
            <Link href="/quiz">
              <button className="w-full py-3.5 rounded-xl bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-sm hover:bg-[var(--color-gold)]/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                Take the Career Readiness Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <div className="flex items-center justify-center gap-4 text-white/30 text-xs">
              <span>✓ Personalised AI roadmap</span>
              <span>✓ Matched flight schools</span>
              <span>✓ Free PDF report</span>
            </div>
          </div>
        </div>

        {/* ── Retake / explore ── */}
        <div className="flex items-center justify-center gap-6 pb-8">
          <Link href="/quiz/licence">
            <button className="text-white/35 hover:text-white/60 text-xs transition-colors">
              Retake this quiz
            </button>
          </Link>
          <Link href="/schools">
            <button className="text-white/35 hover:text-white/60 text-xs transition-colors flex items-center gap-1">
              Browse flight schools <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
