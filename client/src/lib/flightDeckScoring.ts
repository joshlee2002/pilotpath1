// ─── "How Close Are You To The Flight Deck?" Scoring Engine ──────────────────
// Client-side copy — keeps the scoring in the browser (no server call needed).

export type FlightDeckInput = {
  dream: string;
  barrier: string;
  age: string;
  budget: string;
  experience: string;
  timeline: string;
};

export type FlightDeckResult = {
  score: number;
  phase: "Exploration" | "Development" | "Flight Ready";
  headline: string;
  subheadline: string;
  biggestBarrier: string;
  barrierAdvice: string;
  estimatedTimeline: string;
  recommendedRoute: string;
  shareText: string;
};

function scoreDream(dream: string): number {
  if (dream === "airline_captain") return 20;
  if (dream === "cargo") return 18;
  if (dream === "private_jet") return 16;
  if (dream === "fun") return 10;
  return 8;
}

function scoreBarrier(barrier: string): number {
  if (barrier === "cost") return 18;
  if (barrier === "time") return 15;
  if (barrier === "no_idea") return 12;
  if (barrier === "confidence") return 10;
  if (barrier === "medical") return 8;
  return 12;
}

function scoreAge(age: string): number {
  if (age === "18_25") return 20;
  if (age === "26_35") return 18;
  if (age === "under18") return 16;
  if (age === "36_45") return 12;
  return 8;
}

function scoreBudget(budget: string): number {
  if (budget === "funded") return 22;
  if (budget === "serious") return 18;
  if (budget === "moderate") return 12;
  if (budget === "some") return 7;
  return 3;
}

function scoreExperience(experience: string): number {
  if (experience === "hours_50plus") return 10;
  if (experience === "ppl") return 9;
  if (experience === "trial") return 6;
  return 3;
}

function scoreTimeline(timeline: string): number {
  if (timeline === "asap") return 10;
  if (timeline === "one_year") return 9;
  if (timeline === "two_five") return 7;
  if (timeline === "someday") return 4;
  return 5;
}

function getPhase(score: number): FlightDeckResult["phase"] {
  if (score >= 75) return "Flight Ready";
  if (score >= 45) return "Development";
  return "Exploration";
}

function getBarrierLabel(barrier: string): string {
  const map: Record<string, string> = {
    cost: "Funding",
    time: "Time availability",
    medical: "Medical uncertainty",
    confidence: "Self-confidence",
    no_idea: "Not knowing where to start",
  };
  return map[barrier] ?? "Finding the right path";
}

function getBarrierAdvice(barrier: string): string {
  const map: Record<string, string> = {
    cost: "Most aspiring pilots self-fund through a combination of savings, career development loans, and modular training — you don't need the full amount upfront.",
    time: "The modular route lets you train part-time over 3–5 years alongside a job — many pilots qualify this way without ever going full-time.",
    medical: "A Class 1 medical is required for airline flying, but most common health conditions don't automatically disqualify you — an AME assessment takes less than a day.",
    confidence: "Every airline pilot started with zero hours. Confidence comes from taking the first step — a trial lesson is less than £200 and changes most people's perspective entirely.",
    no_idea: "The most common starting point. A free career assessment takes 10 minutes and gives you a personalised roadmap, recommended route, and matched schools.",
  };
  return map[barrier] ?? "The best next step is a structured assessment to understand your specific situation.";
}

function getTimeline(score: number, timeline: string, age: string): string {
  if (timeline === "asap" && score >= 60) return "You could realistically begin training within the next 3–6 months.";
  if (score >= 75) return "Based on your profile, you could be qualified within 2–3 years.";
  if (score >= 55) return "With the right preparation, qualification is realistic within 3–5 years.";
  if (age === "over45") return "Training is still very achievable — a PPL or modular CPL route is well within reach.";
  return "Your timeline depends on resolving your biggest barrier first — but most people in your position qualify within 4–6 years.";
}

function getRoute(dream: string, budget: string, timeline: string): string {
  if (dream === "fun") return "Private Pilot Licence (PPL)";
  if (budget === "funded" || budget === "serious") {
    if (timeline === "asap" || timeline === "one_year") return "Integrated ATPL (fastest route to airline)";
    return "Modular ATPL (flexible, lower cost)";
  }
  if (dream === "airline_captain" || dream === "cargo") return "Modular ATPL (build qualifications in stages)";
  if (dream === "private_jet") return "CPL + IR (commercial licence with instrument rating)";
  return "PPL as a starting point, then reassess";
}

function getHeadline(score: number, barrier: string): string {
  if (score >= 75) return "You're genuinely close to the flight deck.";
  if (score >= 60) return "You're closer than most people think.";
  if (score >= 45) {
    if (barrier === "cost") return "The gap between you and the cockpit is mostly financial.";
    if (barrier === "medical") return "One medical assessment could change everything.";
    return "You have a real path — it just needs a plan.";
  }
  if (score >= 30) return "You're at the start of something real.";
  return "Every pilot starts somewhere. This is your starting point.";
}

function getSubheadline(score: number, dream: string, barrier: string, age: string): string {
  const dreamLabel: Record<string, string> = {
    airline_captain: "airline captain",
    cargo: "cargo pilot",
    private_jet: "private jet pilot",
    fun: "private pilot",
    not_sure: "pilot",
  };
  const label = dreamLabel[dream] ?? "pilot";
  if (score >= 75) return `Your profile matches someone who could realistically become a ${label} — your biggest challenge is taking the next step.`;
  if (score >= 55) return `You have the right mindset for a career as a ${label}. Your main obstacle is ${getBarrierLabel(barrier).toLowerCase()}, which is solvable.`;
  if (score >= 40) return `Becoming a ${label} is achievable from your position — but it will require a clear plan and some preparation first.`;
  if (age === "under18") return `You have more time than almost anyone. Starting to build your knowledge now puts you ahead of 90% of aspiring pilots.`;
  return `Thousands of pilots started exactly where you are. The first step is understanding your specific path.`;
}

function getShareText(score: number, phase: string, licence: string): string {
  return `I just took the AviatorIQ flight potential quiz and scored ${score}/100 — ${phase} phase. My recommended route: ${licence}. How close are you? 👇`;
}

export function scoreFlightDeckQuiz(input: FlightDeckInput): FlightDeckResult {
  const { dream, barrier, age, budget, experience, timeline } = input;
  const raw =
    scoreDream(dream) +
    scoreBarrier(barrier) +
    scoreAge(age) +
    scoreBudget(budget) +
    scoreExperience(experience) +
    scoreTimeline(timeline);
  const score = Math.min(100, Math.max(0, raw));
  const phase = getPhase(score);
  const route = getRoute(dream, budget, timeline);
  return {
    score,
    phase,
    headline: getHeadline(score, barrier),
    subheadline: getSubheadline(score, dream, barrier, age),
    biggestBarrier: getBarrierLabel(barrier),
    barrierAdvice: getBarrierAdvice(barrier),
    estimatedTimeline: getTimeline(score, timeline, age),
    recommendedRoute: route,
    shareText: getShareText(score, phase, route),
  };
}
