import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { scoreFlightDeckQuiz, FlightDeckResult, FlightDeckInput } from "@/lib/flightDeckScoring";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Plane,
  Share2,
  ArrowRight,
  AlertCircle,
  Star,
  Zap,
  RefreshCw,
  ChevronRight,
  Link2,
  CheckCircle2,
} from "lucide-react";

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, phase }: { score: number; phase: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const phaseColour =
    phase === "Flight Ready" ? "#22c55e" : phase === "Development" ? "#f59e0b" : "#60a5fa";
  const phaseLabel =
    phase === "Flight Ready" ? "Flight Ready" : phase === "Development" ? "Development Phase" : "Exploration Phase";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius} fill="none" stroke={phaseColour} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.23,1,0.32,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-bold text-white leading-none">{score}</span>
          <span className="text-white/40 text-xs mt-1">/ 100</span>
        </div>
      </div>
      <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: phaseColour }}>
        {phaseLabel}
      </div>
      <p className="text-white/30 text-xs mt-1.5">Flight Potential Score</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FlightDeckResults() {
  const [, navigate] = useLocation();
  const [result, setResult] = useState<FlightDeckResult | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const saveShare = trpc.flightDeck.saveShare.useMutation({
    onSuccess: (data) => setShareId(data.shareId),
  });
  useEffect(() => {
    document.title = "Your Pilot Profile | AviatorIQ";
    const stored = sessionStorage.getItem("flightDeckAnswers");
    if (!stored) {
      navigate("/quiz/flight-deck");
      return;
    }
    try {
      const answers = JSON.parse(stored) as FlightDeckInput;
      const scored = scoreFlightDeckQuiz(answers);
      setResult(scored);
      // Save to DB for shareable URL
      saveShare.mutate({ resultJson: JSON.stringify(scored) });
    } catch {
      navigate("/quiz/flight-deck");
    }
  }, [navigate]);
  if (!result) return null;
  const shareUrl = shareId
    ? `${window.location.origin}/quiz/flight-deck/share/${shareId}`
    : `${window.location.origin}/quiz/flight-deck`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      toast.error("Could not copy link");
    }
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "What's Really Stopping You Becoming A Pilot?", text: result.shareText, url: shareUrl }).catch(() => {});
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.shareText + "\n" + shareUrl)}`,
        "_blank"
      );
    }
  };

  const barrierColour =
    result.phase === "Flight Ready"
      ? "text-green-400 border-green-500/30 bg-green-500/10"
      : result.phase === "Development"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-sky-400 border-sky-500/30 bg-sky-500/10";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Plane className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="font-display font-bold text-sm">AviatorIQ</span>
        </Link>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-white/45 hover:text-white/70 text-xs transition-colors">
          <Share2 className="w-4 h-4" />
          Share result
        </button>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10 space-y-4">

        {/* ── Headline card ── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-center">
          <p className="text-white/35 text-xs uppercase tracking-widest mb-5">Your pilot profile</p>
          <h1 className="text-2xl md:text-2xl font-display font-bold text-white mb-2 leading-tight">
            {result.headline}
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto mb-6">
            {result.subheadline}
          </p>
          <ScoreRing score={result.score} phase={result.phase} />
        </div>

        {/* ── Archetype ── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-white/35 text-xs uppercase tracking-widest mb-2">You are</p>
          <p className="font-display font-bold text-white text-lg mb-2">{result.archetype}</p>
          <p className="text-white/60 text-sm leading-relaxed">{result.archetypeDescription}</p>
        </div>

        {/* ── Two-column: Barrier + Asset ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Biggest barrier */}
          <div className={`rounded-2xl border p-5 ${barrierColour}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Biggest barrier</p>
            </div>
            <p className="font-display font-bold text-white text-xl mb-2">{result.biggestBarrier}</p>
            <p className="text-white/65 text-sm leading-relaxed">{result.barrierAdvice}</p>
          </div>

          {/* Strongest asset */}
          <div className="rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/8 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-gold)]/70">Strongest asset</p>
            </div>
            <p className="font-display font-bold text-white text-xl mb-2">{result.strongestAsset}</p>
            <p className="text-white/65 text-sm leading-relaxed">{result.assetDescription}</p>
          </div>
        </div>

        {/* ── Next action ── */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
            <p className="text-xs uppercase tracking-wider font-semibold text-white/50">Your next action</p>
          </div>
          <p className="text-white font-semibold text-base leading-relaxed">{result.nextAction}</p>
        </div>

        {/* ── Main CTA ── */}
        <div className="rounded-2xl overflow-hidden">
          <div className="bg-[var(--color-gold)] px-6 pt-6 pb-5 text-center">
            <p className="text-[var(--color-navy)]/60 text-xs uppercase tracking-widest font-semibold mb-2">Your next step</p>
            <h2 className="text-xl font-display font-bold text-[var(--color-navy)] mb-2">
              Get Your Full Pilot Blueprint
            </h2>
            <p className="text-[var(--color-navy)]/75 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
              10 minutes. Full AviatorIQ Score, AI training roadmap, 5-dimension breakdown, and matched flight schools — completely free.
            </p>
            <Link href="/quiz">
              <button className="w-full py-4 rounded-xl bg-[var(--color-navy)] text-white font-bold text-sm hover:bg-[var(--color-navy)]/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                Take the Career Readiness Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <div className="bg-[var(--color-navy)]/40 border-t border-white/10 flex items-center justify-center gap-5 py-3 text-white/50 text-xs">
            <span>✓ Free PDF blueprint</span>
            <span>✓ Matched schools</span>
            <span>✓ AI roadmap</span>
          </div>
        </div>

        {/* ── Secondary actions ── */}
        <div className="flex items-center justify-center gap-6 pb-6">
          <button onClick={handleCopyLink} className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors">
            {linkCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
            {linkCopied ? "Copied!" : "Copy link"}
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <Link href="/quiz/flight-deck">
            <button className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Retake
            </button>
          </Link>
          <Link href="/schools">
            <button className="flex items-center gap-1 text-white/30 hover:text-white/55 text-xs transition-colors">
              Browse schools
              <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
