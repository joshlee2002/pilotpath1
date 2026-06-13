import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { FlightDeckResult } from "@/lib/flightDeckScoring";
import {
  Plane,
  ArrowRight,
  AlertCircle,
  Star,
  Zap,
  RefreshCw,
} from "lucide-react";

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

export default function FlightDeckShare() {
  const params = useParams<{ shareId: string }>();
  const shareId = params.shareId ?? "";

  const { data, isLoading, isError } = trpc.flightDeck.getShare.useQuery(
    { shareId },
    { enabled: !!shareId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}>
        <div className="text-white/40 text-sm animate-pulse">Loading result...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}>
        <AlertCircle className="w-10 h-10 text-white/30" />
        <p className="text-white/60 text-sm">This result link has expired or does not exist.</p>
        <Link href="/quiz/flight-deck">
          <button className="mt-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/15 transition-colors">
            Take the quiz
          </button>
        </Link>
      </div>
    );
  }

  let result: FlightDeckResult;
  try {
    result = JSON.parse(data.resultJson) as FlightDeckResult;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}>
        <p className="text-white/40 text-sm">Unable to load this result.</p>
      </div>
    );
  }

  const barrierColour =
    result.phase === "Flight Ready"
      ? "text-green-400 border-green-500/30 bg-green-500/10"
      : result.phase === "Development"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-sky-400 border-sky-500/30 bg-sky-500/10";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a2d4e 60%, #0f2040 100%)" }}>
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Plane className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="font-display font-bold text-sm">AviatorIQ</span>
        </Link>
        <span className="text-white/30 text-xs">Shared result</span>
      </header>
      <div className="bg-white/5 border-b border-white/10 px-6 py-3 text-center">
        <p className="text-white/45 text-xs">Someone shared their AviatorIQ pilot profile with you.</p>
      </div>
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-center">
          <p className="text-white/35 text-xs uppercase tracking-widest mb-5">Their pilot profile</p>
          <h1 className="text-2xl font-display font-bold text-white mb-2 leading-tight">{result.headline}</h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto mb-6">{result.subheadline}</p>
          <ScoreRing score={result.score} phase={result.phase} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-white/35 text-xs uppercase tracking-widest mb-2">Archetype</p>
          <p className="font-display font-bold text-white text-lg mb-2">{result.archetype}</p>
          <p className="text-white/60 text-sm leading-relaxed">{result.archetypeDescription}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`rounded-2xl border p-5 ${barrierColour}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Biggest barrier</p>
            </div>
            <p className="font-display font-bold text-white text-xl mb-2">{result.biggestBarrier}</p>
            <p className="text-white/65 text-sm leading-relaxed">{result.barrierAdvice}</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/8 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-gold)]/70">Strongest asset</p>
            </div>
            <p className="font-display font-bold text-white text-xl mb-2">{result.strongestAsset}</p>
            <p className="text-white/65 text-sm leading-relaxed">{result.assetDescription}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
            <p className="text-xs uppercase tracking-wider font-semibold text-white/50">Their next action</p>
          </div>
          <p className="text-white font-semibold text-base leading-relaxed">{result.nextAction}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/5 p-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Curious about your own profile?</p>
          <h2 className="text-xl font-display font-bold text-white mb-2">Find your biggest barrier</h2>
          <p className="text-white/55 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
            Take the free 2-minute Flight Deck quiz and discover what is really stopping you becoming a pilot.
          </p>
          <Link href="/quiz/flight-deck">
            <button className="w-full py-4 rounded-xl bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-sm hover:bg-[var(--color-gold)]/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Take the Flight Deck Quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center justify-center gap-4 mt-3 text-white/25 text-xs">
            <span>Free</span>
            <span>2 minutes</span>
            <span>Instant result</span>
          </div>
        </div>
        <div className="flex items-center justify-center pb-6">
          <Link href="/quiz/flight-deck">
            <button className="flex items-center gap-1.5 text-white/30 hover:text-white/55 text-xs transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Take the quiz yourself
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
