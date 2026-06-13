/**
 * AviatorIQ Lead Scoring Engine
 * Overall score: 0–100
 * Hot: 85–100 | Warm: 55–84 | Cold: <55
 *
 * Sub-scores (each 0–100) power the 5-dimension score card on the results page:
 *   readiness  – commitment, urgency, timeline
 *   finance    – budget, funding method, finance awareness
 *   medical    – Class 1 status, age eligibility
 *   career     – goal clarity, right to work/study, experience
 *   pathway    – route fit based on budget + goal + country
 *
 * intentScore (0–100, hidden from users) – commercial intent signal based on
 *   school contact desire, timeframe urgency, phone provided, finance awareness.
 *   A lead with intentScore 80+ who requests introductions is likely more
 *   commercially valuable than a high AviatorIQ score alone.
 *   Track: Hot Lead → Introduction Request % over time to validate the model.
 */

export interface LeadInput {
  pilotGoal?: string | null;
  seriousness?: string | null;
  spokenToSchool?: string | null;
  fundingMethod?: string | null;
  budgetRange?: string | null;
  wantsFinanceInfo?: string | null;
  age?: number | null;
  class1Medical?: string | null;
  flyingExperience?: string | null;
  rightToWorkStudy?: string | null;
  phone?: string | null;
  writtenAnswer?: string | null;
  preferredRoute?: string | null;
  country?: string | null;
  startTimeframe?: string | null;
}

export interface ScoreResult {
  score: number;
  category: "Hot" | "Warm" | "Cold";
  /** Legacy breakdown kept for backward compat */
  breakdown: {
    intent: number;
    finance: number;
    suitability: number;
    engagement: number;
  };
  /** 5-dimension sub-scores (0–100 each) for the AviatorIQ score card */
  dimensions: {
    readiness: number;
    finance: number;
    medical: number;
    career: number;
    pathway: number;
  };
  /** Human-readable label for each dimension */
  labels: {
    readiness: string;
    finance: string;
    medical: string;
    career: string;
    pathway: string;
  };
  /** Specific next action recommendation */
  nextAction: string;
  /** Biggest risk flag */
  biggestRisk: string;
  /** Estimated training cost range */
  estimatedCostRange: string;
  /** Estimated timeline */
  estimatedTimeline: string;
  /** Recommended route */
  recommendedRoute: string;
  /**
   * Intent Score (0–100) — hidden from users, admin-only.
   * Measures commercial intent: school contact desire, timeframe urgency,
   * phone provided, finance awareness.
   * Use alongside AviatorIQ score to prioritise leads for outreach.
   * Key metric to track: Hot Lead → Introduction Request conversion rate.
   */
  intentScore: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, max = 100): number {
  return Math.min(Math.max(v, 0), max);
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs attention";
}

// ── Main scoring function ─────────────────────────────────────────────────────

export function scoreLead(input: LeadInput): ScoreResult {

  // ── 1. READINESS (commitment, urgency, timeline) ─────────────────────────
  let readinessRaw = 0;

  const highSeriousness = ["I want to start as soon as possible", "I want to start within 12 months"];
  const medSeriousness = ["I want to start within 1-3 years"];
  if (input.seriousness && highSeriousness.includes(input.seriousness)) readinessRaw += 40;
  else if (input.seriousness && medSeriousness.includes(input.seriousness)) readinessRaw += 25;
  else if (input.seriousness) readinessRaw += 10;

  if (input.spokenToSchool === "I have already applied somewhere") readinessRaw += 30;
  else if (input.spokenToSchool === "I have booked a visit/open day") readinessRaw += 25;
  else if (input.spokenToSchool === "Yes") readinessRaw += 15;

  if (input.writtenAnswer && input.writtenAnswer.trim().length > 50) readinessRaw += 20;
  else if (input.writtenAnswer && input.writtenAnswer.trim().length > 20) readinessRaw += 10;

  if (input.phone && input.phone.trim().length > 5) readinessRaw += 10;

  const readiness = clamp(readinessRaw);

  // ── 2. FINANCE (budget, funding, finance awareness) ──────────────────────
  let financeRaw = 0;

  if (input.budgetRange === "£100,000+") financeRaw += 40;
  else if (input.budgetRange === "£50,000-£100,000") financeRaw += 35;
  else if (input.budgetRange === "£25,000-£50,000") financeRaw += 20;
  else if (input.budgetRange === "£10,000-£25,000") financeRaw += 10;

  const solidFunding = ["Self-funded", "Family support"];
  const loanFunding = ["Loan/finance", "Scholarship", "Employer/airline sponsored"];
  if (input.fundingMethod && solidFunding.includes(input.fundingMethod)) financeRaw += 40;
  else if (input.fundingMethod && loanFunding.includes(input.fundingMethod)) financeRaw += 25;
  else if (input.fundingMethod) financeRaw += 10;

  if (input.wantsFinanceInfo === "Yes") financeRaw += 15;
  else if (input.wantsFinanceInfo === "Maybe") financeRaw += 8;

  const finance = clamp(financeRaw);

  // ── 3. MEDICAL (Class 1 status, age eligibility) ─────────────────────────
  let medicalRaw = 0;

  if (input.class1Medical === "Yes") medicalRaw += 60;
  else if (input.class1Medical === "I plan to get one") medicalRaw += 40;
  else if (input.class1Medical === "I'm not sure") medicalRaw += 20;
  else if (input.class1Medical === "No") medicalRaw += 5;

  if (input.age !== null && input.age !== undefined) {
    if (input.age >= 17 && input.age <= 30) medicalRaw += 40;
    else if (input.age > 30 && input.age <= 40) medicalRaw += 25;
    else if (input.age > 40 && input.age <= 55) medicalRaw += 10;
    else if (input.age > 55) medicalRaw += 0;
    else if (input.age < 17) medicalRaw += 15; // too young but still possible future
  }

  const medical = clamp(medicalRaw);

  // ── 4. CAREER (goal clarity, right to work, experience) ──────────────────
  let careerRaw = 0;

  if (input.pilotGoal === "Airline pilot") careerRaw += 40;
  else if (input.pilotGoal === "Corporate/private jet pilot") careerRaw += 30;
  else if (input.pilotGoal === "Flight instructor") careerRaw += 25;
  else if (input.pilotGoal === "Private Pilot Licence (PPL) only") careerRaw += 15;
  else if (input.pilotGoal) careerRaw += 10;

  if (input.rightToWorkStudy === "Yes") careerRaw += 30;
  else if (input.rightToWorkStudy === "I need to check") careerRaw += 10;

  if (input.flyingExperience === "PPL holder" || input.flyingExperience === "Other licence/rating") careerRaw += 30;
  else if (input.flyingExperience === "PPL student") careerRaw += 20;
  else if (input.flyingExperience === "Trial lesson/discovery flight") careerRaw += 10;

  const career = clamp(careerRaw);

  // ── 5. PATHWAY (route fit based on budget + goal + country) ──────────────
  let pathwayRaw = 0;

  // Route clarity
  if (input.preferredRoute === "Integrated ATPL (full-time, 18-24 months)") pathwayRaw += 30;
  else if (input.preferredRoute === "Modular ATPL (flexible, part-time option)") pathwayRaw += 30;
  else if (input.preferredRoute === "Not sure yet") pathwayRaw += 15;
  else if (input.preferredRoute) pathwayRaw += 20;

  // Budget-route alignment
  const highBudget = input.budgetRange === "£100,000+" || input.budgetRange === "£50,000-£100,000";
  const medBudget = input.budgetRange === "£25,000-£50,000";
  const isAirline = input.pilotGoal === "Airline pilot";

  if (highBudget && isAirline) pathwayRaw += 40;
  else if (medBudget && isAirline) pathwayRaw += 25;
  else if (highBudget) pathwayRaw += 30;
  else if (medBudget) pathwayRaw += 15;

  // Country availability
  if (input.country) pathwayRaw += 15;

  const pathway = clamp(pathwayRaw);

  // ── Overall score (legacy-compatible) ────────────────────────────────────
  // Weighted average: readiness 25%, finance 25%, medical 20%, career 20%, pathway 10%
  const score = Math.round(
    readiness * 0.25 +
    finance * 0.25 +
    medical * 0.20 +
    career * 0.20 +
    pathway * 0.10
  );

  // ── Category thresholds (tightened for launch) ────────────────────────────
  // Hot is intentionally hard to achieve. False positives damage school trust.
  // Review thresholds after first 100 assessments using real conversion data.
  let category: "Hot" | "Warm" | "Cold";
  if (score >= 85) category = "Hot";
  else if (score >= 55) category = "Warm";
  else category = "Cold";

  // ── Intent Score (0–100, hidden from users, admin-only) ───────────────────
  // Measures commercial intent independent of the AviatorIQ score.
  // A lead with intentScore 80+ who requests introductions is likely more
  // commercially valuable than a high AviatorIQ score alone.
  // Key metric: track Hot Lead → Introduction Request % over time.
  let intentRaw = 0;
  // Already engaging with schools (strongest signal)
  if (input.spokenToSchool === "I have already applied somewhere") intentRaw += 30;
  else if (input.spokenToSchool === "I have booked a visit/open day") intentRaw += 25;
  else if (input.spokenToSchool === "Yes") intentRaw += 15;
  // Timeframe urgency
  if (input.seriousness === "I want to start as soon as possible") intentRaw += 30;
  else if (input.seriousness === "I want to start within 12 months") intentRaw += 25;
  else if (input.seriousness === "I want to start within 1-3 years") intentRaw += 10;
  // Phone provided = willing to be contacted
  if (input.phone && input.phone.trim().length > 5) intentRaw += 25;
  // Finance awareness = actively thinking about how to fund it
  if (input.wantsFinanceInfo === "Yes") intentRaw += 15;
  const intentScore = clamp(intentRaw);

  // ── Legacy breakdown ──────────────────────────────────────────────────────
  const intent = Math.round(readiness * 0.4);
  const financeLegacy = Math.round(finance * 0.3);
  const suitability = Math.round((medical + career) * 0.1);
  const engagement = Math.round(readiness * 0.1);

  // ── Derived recommendations ───────────────────────────────────────────────

  let recommendedRoute = "Modular ATPL";
  if (input.budgetRange === "£100,000+" && input.pilotGoal === "Airline pilot") {
    recommendedRoute = "Integrated ATPL";
  } else if (input.pilotGoal === "Private Pilot Licence (PPL) only") {
    recommendedRoute = "PPL Only";
  } else if (input.pilotGoal === "Flight instructor") {
    recommendedRoute = "Modular ATPL + FI Rating";
  }

  let estimatedCostRange = "£40,000 – £80,000";
  if (recommendedRoute === "Integrated ATPL") estimatedCostRange = "£80,000 – £120,000";
  else if (recommendedRoute === "PPL Only") estimatedCostRange = "£8,000 – £15,000";
  else if (recommendedRoute === "Modular ATPL + FI Rating") estimatedCostRange = "£45,000 – £85,000";

  let estimatedTimeline = "3 – 5 years (modular, part-time)";
  if (recommendedRoute === "Integrated ATPL") estimatedTimeline = "18 – 24 months";
  else if (recommendedRoute === "PPL Only") estimatedTimeline = "6 – 18 months";

  let biggestRisk = "Funding";
  if (finance >= 70) biggestRisk = "Medical clearance";
  if (finance >= 70 && medical >= 70) biggestRisk = "Finding the right school";
  if (readiness < 40) biggestRisk = "Commitment / timeline clarity";
  if (career < 40) biggestRisk = "Goal clarity";

  let nextAction = "Book a free consultation with a training advisor";
  if (medical < 40) nextAction = "Book a Class 1 Medical assessment";
  else if (finance < 40) nextAction = "Explore pilot training finance options";
  else if (readiness >= 70 && finance >= 60) nextAction = "Request introductions to matched flight schools";

  return {
    score,
    category,
    intentScore,
    breakdown: {
      intent: clamp(intent, 40),
      finance: clamp(financeLegacy, 30),
      suitability: clamp(suitability, 20),
      engagement: clamp(engagement, 10),
    },
    dimensions: { readiness, finance, medical, career, pathway },
    labels: {
      readiness: scoreLabel(readiness),
      finance: scoreLabel(finance),
      medical: scoreLabel(medical),
      career: scoreLabel(career),
      pathway: scoreLabel(pathway),
    },
    nextAction,
    biggestRisk,
    estimatedCostRange,
    estimatedTimeline,
    recommendedRoute,
  };
}
