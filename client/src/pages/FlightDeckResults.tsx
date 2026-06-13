import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { scoreFlightDeckQuiz, FlightDeckResult, FlightDeckInput } from "@/lib/flightDeckScoring";
import {
  Plane,
  Share2,
  ArrowRight,
  AlertCircle,
  Clock,
  Route,
  RefreshCw,
} from "lucide-react";

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, phase }: { score: number; phase: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const phaseColour =
    phase === "Flight Ready"
      ? "#22c55e"
      : phase === "Development"
      ? "#f59e0b"
      : "#60a5fa";

  const phaseLabel =
    phase === "Flight Ready"
      ? "Flight Ready"
      : phase === "Development"
      ? "Development Phase"
      : "Exploration Phase";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={phaseColour}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.23,1,0.32,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-bold text-white leading-none">{score}</span>
          <span className="text-white/40 text-xs mt-1">/ 100</span>
        </div>
      </div>
      <div
        className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: phaseColour }}
      >
        {phaseLabel}
      </div>
      <p className="text-white/35 text-xs mt-2">Flight Potential Score</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FlightDeckResults() {
  const [, navigate] = useLocation();
  const [result, setResult] = useState<FlightDeckResult | null>(null);

  useEffect(() => {
    document.title = "Your Flight Potential Score | AviatorIQ";
    const stored = sessionStorage.getItem("flightDeckAnswers");
    if (!stored) {
      navigate("/quiz/flight-deck");
      return;
    }
    try {
      const answers = JSON.parse(stored) as FlightDeckInput;
      setResult(scoreFlightDeckQuiz(answers));
    } catch {
      navigate("/quiz/flight-deck");
    }
  }, [navigate]);

  if (!result) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/quiz/flight-deck`;
    if (navigator.share) {
      navigator.share({
        title: "How Close Are You To The Flight Deck?",
        text: result.shareText,
        url,
      }).catch(() => {});
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.shareText + "\n" + url)}`,
        "_blank"
      );
    }
  };

  const phaseColour =
    result.phase === "Flight Ready"
      ? "text-green-400 border-green-500/30 bg-green-500/10"
      : result.phase === "Development"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-sky-400 border-sky-500/30 bg-sky-500/10";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Plane className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="font-display font-bold text-sm">AviatorIQ</span>
        </Link>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-white/45 hover:text-white/70 text-xs transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share your score
        </button>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10 space-y-5">

        {/* ── Score card ── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Your result</p>
          <ScoreRing score={result.score} phase={result.phase} />
          <h1 className="text-xl md:text-2xl font-display font-bold text-white mt-6 mb-2 leading-tight">
            {result.headline}
          </h1>
          <p className="text-white/65 text-sm leading-relaxed max-w-sm mx-auto">
            {result.subheadline}
          </p>
        </div>

        {/* ── Biggest barrier ── */}
        <div className={`rounded-2xl border p-5 ${phaseColour}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-70">
                Your biggest barrier
              </p>
              <p className="font-bold text-white text-base mb-2">{result.biggestBarrier}</p>
              <p className="text-white/70 text-sm leading-relaxed">{result.barrierAdvice}</p>
            </div>
          </div>
        </div>

        {/* ── Timeline + route ── */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="text-white/45 text-xs uppercase tracking-wider">Estimated timeline</span>
            </div>
            <p className="text-white/85 text-sm leading-relaxed">{result.estimatedTimeline}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Route className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="text-white/45 text-xs uppercase tracking-wider">Recommended route</span>
            </div>
            <p className="text-white font-semibold text-sm">{result.recommendedRoute}</p>
          </div>
        </div>

        {/* ── Main CTA ── */}
        <div className="rounded-2xl border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/5 p-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Unlock your full Pilot Blueprint</p>
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Take the AviatorIQ Career Readiness Assessment
          </h2>
          <p className="text-white/55 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
            Go deeper. Get your personalised AviatorIQ Score, an AI-generated training roadmap, your biggest obstacle in detail, and matched flight schools — completely free.
          </p>
          <Link href="/quiz">
            <button className="w-full py-4 rounded-xl bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-sm hover:bg-[var(--color-gold)]/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Take the Career Readiness Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center justify-center gap-4 mt-3 text-white/25 text-xs">
            <span>✓ Free PDF blueprint</span>
            <span>✓ Matched schools</span>
            <span>✓ AI roadmap</span>
          </div>
        </div>

        {/* ── Secondary actions ── */}
        <div className="flex items-center justify-center gap-6 pb-6">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share your score
          </button>
          <Link href="/quiz/flight-deck">
            <button className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Retake quiz
            </button>
          </Link>
          <Link href="/quiz/licence">
            <button className="text-white/30 hover:text-white/55 text-xs transition-colors">
              Which licence? →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
