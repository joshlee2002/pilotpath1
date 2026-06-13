// ─── Licence Quiz Scoring Engine ─────────────────────────────────────────────
// Determines which of 6 pilot licences to recommend based on 8 quiz answers.
// All logic is deterministic and testable — no LLM required.

export type LicenceQuizInput = {
  goal: string;           // professional | recreational | business | exploring
  timeCommitment: string; // fulltime | parttime | flexible | limited
  budget: string;         // under10k | 10k_30k | 30k_80k | 80k_130k | over130k | unsure
  wantsCommercial: string; // yes_commercial | maybe | no
  experience: string;     // none | trial | has_licence | experienced
  location: string;       // uk | europe | north_america | aus_nz | other
  speedPriority: string;  // fast | balanced | slow
  mainPriority: string;   // get_flying | career | research | value
};

export type LicenceResult = {
  licence: "LAPL" | "PPL" | "CPL" | "Integrated_ATPL" | "Modular_ATPL" | "FAA_PPL";
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  estimatedCost: string;
  estimatedTimeline: string;
  bestFor: string;
  ctaText: string;
  /** % of users with this result who go on to take the career assessment (social proof) */
  careerAssessmentRate: number;
};

const RESULTS: Record<LicenceResult["licence"], Omit<LicenceResult, "licence">> = {
  LAPL: {
    title: "LAPL — Light Aircraft Pilot Licence",
    tagline: "The fastest and most affordable way to get airborne.",
    description:
      "The LAPL is the most accessible entry point into aviation. With fewer required hours than a PPL and no formal medical certificate needed, it's designed for people who want to fly for the joy of it without a major financial commitment.",
    bullets: [
      "Minimum 30 hours of flight training — 15 fewer than a PPL",
      "Restricted to aircraft under 2,000 kg with up to 3 passengers",
      "A GP declaration replaces the formal medical certificate",
    ],
    estimatedCost: "£6,000 – £12,000",
    estimatedTimeline: "12–24 months part-time",
    bestFor: "Recreational flyers on a budget, beginners wanting to start quickly",
    ctaText: "Find out if you're ready for professional training",
    careerAssessmentRate: 42,
  },
  PPL: {
    title: "PPL — Private Pilot Licence",
    tagline: "The classic starting point — flexible, internationally recognised, and a solid foundation.",
    description:
      "The PPL is the most widely held pilot licence in the world. It gives you the freedom to fly almost anywhere, carry passengers, and keep your options open for further training toward a commercial licence.",
    bullets: [
      "Minimum 45 hours, recognised in most countries (EASA, FAA, UK)",
      "No commercial privileges — but a strong stepping stone to CPL or ATPL",
      "Can be completed part-time alongside work or study",
    ],
    estimatedCost: "£8,000 – £18,000",
    estimatedTimeline: "12–36 months part-time",
    bestFor: "Hobbyists, business flyers, and those who want to keep options open",
    ctaText: "See which flight schools offer PPL training near you",
    careerAssessmentRate: 58,
  },
  CPL: {
    title: "CPL — Commercial Pilot Licence",
    tagline: "The licence that lets you get paid to fly — without the full airline commitment.",
    description:
      "A CPL unlocks paid flying work: charter, aerial photography, flight instruction, and more. It's typically built on top of a PPL and instrument rating, and forms the backbone of the modular ATPL pathway.",
    bullets: [
      "Requires PPL + Instrument Rating + 200 hours minimum flight time",
      "Allows paid flying: charter, aerial work, instructing",
      "The most common modular route toward a frozen ATPL",
    ],
    estimatedCost: "£40,000 – £70,000 (modular, building on PPL)",
    estimatedTimeline: "3–5 years part-time modular",
    bestFor: "Career changers, those who want commercial flying without integrated training costs",
    ctaText: "Take the full AviatorIQ assessment to plan your CPL roadmap",
    careerAssessmentRate: 74,
  },
  Integrated_ATPL: {
    title: "Integrated ATPL — Airline Transport Pilot Licence",
    tagline: "The direct route to the flight deck — intensive, expensive, and the fastest path to an airline career.",
    description:
      "Integrated ATPL training takes you from zero experience to a frozen ATPL in 18–24 months of full-time study. Most major UK airlines recruit directly from integrated programmes, making this the most direct airline pathway.",
    bullets: [
      "Full-time training from zero to frozen ATPL in 18–24 months",
      "Includes PPL, IR, CPL, and MCC in one structured programme",
      "Most UK airlines recruit directly from integrated graduates",
    ],
    estimatedCost: "£90,000 – £130,000",
    estimatedTimeline: "18–24 months full-time",
    bestFor: "School leavers, career changers with funding, those who want the fastest airline route",
    ctaText: "Take the AviatorIQ assessment to see if you're ready for integrated training",
    careerAssessmentRate: 81,
  },
  Modular_ATPL: {
    title: "Modular ATPL — Airline Transport Pilot Licence (Flexible Route)",
    tagline: "The same destination as integrated — on your own timeline and at significantly lower cost.",
    description:
      "The modular route to an ATPL lets you build qualifications in stages: PPL, then an instrument rating, then a CPL, then your MCC. It takes longer but costs considerably less and can be done alongside a job.",
    bullets: [
      "Build qualifications in stages: PPL → IR → CPL → MCC → frozen ATPL",
      "Can be completed alongside employment — no need to go full-time",
      "Costs 30–40% less than the integrated route over the same period",
    ],
    estimatedCost: "£50,000 – £80,000 total",
    estimatedTimeline: "3–6 years part-time",
    bestFor: "Self-funders, career changers who can't go full-time, older applicants",
    ctaText: "Take the AviatorIQ assessment to build your modular training plan",
    careerAssessmentRate: 77,
  },
  FAA_PPL: {
    title: "FAA PPL — US Private Pilot Licence",
    tagline: "A faster and often cheaper route to a licence — popular for those open to training abroad.",
    description:
      "Training in the USA under FAA rules is significantly cheaper than in the UK, particularly in Florida and Arizona where flying weather is near-perfect year-round. An FAA licence can later be converted to a UK/EASA licence.",
    bullets: [
      "FAA PPL requires only 40 hours minimum — 5 fewer than EASA",
      "Significantly cheaper in the USA, especially in Florida and Arizona",
      "Can be converted to a UK/EASA licence after returning home",
    ],
    estimatedCost: "£5,000 – £12,000 (in USA)",
    estimatedTimeline: "6–12 months full-time abroad",
    bestFor: "Those open to training overseas, budget-conscious candidates, gap year students",
    ctaText: "Take the full AviatorIQ assessment to plan your complete training route",
    careerAssessmentRate: 53,
  },
};

// ─── Scoring Decision Tree ────────────────────────────────────────────────────

export function scoreLicenceQuiz(input: LicenceQuizInput): LicenceResult {
  const { goal, timeCommitment, budget, wantsCommercial, experience, location, speedPriority, mainPriority } = input;

  const isProfessional = goal === "professional" || wantsCommercial === "yes_commercial";
  const isRecreational = goal === "recreational" || wantsCommercial === "no";
  const isBusiness = goal === "business";
  const isExploring = goal === "exploring";

  const isFullTime = timeCommitment === "fulltime";
  const isPartTime = timeCommitment === "parttime" || timeCommitment === "flexible";
  const isLimited = timeCommitment === "limited";

  const budgetTier = (() => {
    if (budget === "under10k") return 1;
    if (budget === "10k_30k") return 2;
    if (budget === "30k_80k") return 3;
    if (budget === "80k_130k" || budget === "over130k") return 4;
    return 2; // unsure → assume moderate
  })();

  const hasExperience = experience === "has_licence" || experience === "experienced";
  const isNorthAmerica = location === "north_america";
  const wantsSpeed = speedPriority === "fast";
  const wantsValue = mainPriority === "value" || speedPriority === "slow";

  // ── Decision tree ──────────────────────────────────────────────────────────

  // 1. FAA route — open to abroad + tight budget
  if (isNorthAmerica && budgetTier <= 2) {
    return { licence: "FAA_PPL", ...RESULTS.FAA_PPL };
  }
  if ((isRecreational || isExploring) && budgetTier === 1 && !isProfessional) {
    // Very tight budget — suggest FAA or LAPL
    if (location === "north_america" || location === "other") {
      return { licence: "FAA_PPL", ...RESULTS.FAA_PPL };
    }
    return { licence: "LAPL", ...RESULTS.LAPL };
  }

  // 2. Integrated ATPL — professional + full-time + high budget
  if (isProfessional && isFullTime && budgetTier >= 4 && wantsSpeed) {
    return { licence: "Integrated_ATPL", ...RESULTS.Integrated_ATPL };
  }
  if (isProfessional && isFullTime && budgetTier >= 3 && mainPriority === "career") {
    return { licence: "Integrated_ATPL", ...RESULTS.Integrated_ATPL };
  }

  // 3. Modular ATPL — professional + part-time or value-focused
  if (isProfessional && (isPartTime || isLimited || wantsValue) && budgetTier >= 2) {
    return { licence: "Modular_ATPL", ...RESULTS.Modular_ATPL };
  }
  if (isProfessional && hasExperience && budgetTier >= 2) {
    return { licence: "Modular_ATPL", ...RESULTS.Modular_ATPL };
  }

  // 4. CPL — has experience, wants commercial but not full airline
  if (hasExperience && wantsCommercial === "yes_commercial" && budgetTier >= 3) {
    return { licence: "CPL", ...RESULTS.CPL };
  }
  if (hasExperience && (goal === "business" || wantsCommercial === "maybe") && budgetTier >= 3) {
    return { licence: "CPL", ...RESULTS.CPL };
  }

  // 5. LAPL — recreational + limited time or tight budget
  if ((isRecreational || isExploring) && (isLimited || budgetTier <= 1)) {
    return { licence: "LAPL", ...RESULTS.LAPL };
  }
  if (mainPriority === "get_flying" && budgetTier <= 2) {
    return { licence: "LAPL", ...RESULTS.LAPL };
  }

  // 6. PPL — default for most recreational/business/exploring users
  return { licence: "PPL", ...RESULTS.PPL };
}
