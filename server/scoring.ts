/**
 * PilotPath Lead Scoring Engine
 * Max score: 100
 * Hot: 75–100 | Warm: 45–74 | Cold: <45
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
}

export interface ScoreResult {
  score: number;
  category: "Hot" | "Warm" | "Cold";
  breakdown: {
    intent: number;
    finance: number;
    suitability: number;
    engagement: number;
  };
}

export function scoreLead(input: LeadInput): ScoreResult {
  let intent = 0;
  let finance = 0;
  let suitability = 0;
  let engagement = 0;

  // ── Intent (max 40) ──────────────────────────────────────────────────────
  if (input.pilotGoal === "Airline pilot") {
    intent += 15;
  }

  const urgentStart = ["Immediately", "Within 3 months", "Within 6 months", "Within 12 months"];
  const highSeriousness = ["I want to start as soon as possible", "I want to start within 12 months"];
  if (
    (input.seriousness && highSeriousness.includes(input.seriousness)) ||
    (input.seriousness === "I want to start within 1-3 years")
  ) {
    intent += input.seriousness === "I want to start within 1-3 years" ? 8 : 15;
  }

  if (
    input.spokenToSchool === "I have booked a visit/open day" ||
    input.spokenToSchool === "I have already applied somewhere"
  ) {
    intent += 10;
  } else if (input.spokenToSchool === "Yes") {
    intent += 5;
  }

  intent = Math.min(intent, 40);

  // ── Finance (max 30) ─────────────────────────────────────────────────────
  if (
    input.budgetRange === "£50,000-£100,000" ||
    input.budgetRange === "£100,000+"
  ) {
    finance += 15;
  } else if (input.budgetRange === "£25,000-£50,000") {
    finance += 8;
  }

  const solidFunding = ["Self-funded", "Family support", "Loan/finance"];
  if (input.fundingMethod && solidFunding.includes(input.fundingMethod)) {
    finance += 10;
  } else if (input.fundingMethod === "Scholarship" || input.fundingMethod === "Employer/airline sponsored") {
    finance += 7;
  }

  if (input.wantsFinanceInfo === "Yes") {
    finance += 5;
  } else if (input.wantsFinanceInfo === "Maybe") {
    finance += 2;
  }

  finance = Math.min(finance, 30);

  // ── Suitability (max 20) ─────────────────────────────────────────────────
  if (input.age !== null && input.age !== undefined) {
    if (input.age >= 18 && input.age <= 35) {
      suitability += 8;
    } else if (input.age > 35 && input.age <= 45) {
      suitability += 4;
    }
  }

  if (
    input.class1Medical === "Yes" ||
    input.class1Medical === "I plan to get one"
  ) {
    suitability += 5;
  }

  if (
    input.flyingExperience === "Trial lesson/discovery flight" ||
    input.flyingExperience === "PPL student" ||
    input.flyingExperience === "PPL holder" ||
    input.flyingExperience === "Other licence/rating"
  ) {
    suitability += 4;
  }

  if (input.rightToWorkStudy === "Yes") {
    suitability += 3;
  }

  suitability = Math.min(suitability, 20);

  // ── Engagement (max 10) ──────────────────────────────────────────────────
  if (input.phone && input.phone.trim().length > 5) {
    engagement += 5;
  }
  if (input.writtenAnswer && input.writtenAnswer.trim().length > 20) {
    engagement += 5;
  }

  engagement = Math.min(engagement, 10);

  const score = intent + finance + suitability + engagement;

  let category: "Hot" | "Warm" | "Cold";
  if (score >= 75) {
    category = "Hot";
  } else if (score >= 45) {
    category = "Warm";
  } else {
    category = "Cold";
  }

  return { score, category, breakdown: { intent, finance, suitability, engagement } };
}
