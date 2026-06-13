export type PathIdUS =
  | "cadet"
  | "part141"
  | "part61"
  | "university"
  | "future";

export interface QuestionUS {
  id: string;
  title: string;
  options: {
    label: string;
    value: string;
    points: Partial<Record<PathIdUS, number>>;
  }[];
}

export interface RoadmapResultUS {
  id: PathIdUS;
  title: string;
  tagline: string;
  description: string;
  cost: string;
  timeline: string;
  risk: string;
  steps: string[];
  schools: {
    name: string;
    description: string;
  }[];
  watchOut: string;
}

export const roadmapQuestionsUS: QuestionUS[] = [
  {
    id: "age",
    title: "How old are you?",
    options: [
      { label: "Under 18", value: "under18", points: { future: 10 } },
      { label: "18 – 30", value: "18to30", points: { cadet: 3, part141: 3, university: 3, part61: 1 } },
      { label: "31 – 45", value: "31to45", points: { part141: 4, part61: 4 } },
      { label: "46+", value: "over46", points: { part61: 6 } },
    ],
  },
  {
    id: "budget",
    title: "What is your realistic budget or funding capacity?",
    options: [
      { label: "Less than $20,000", value: "low", points: { cadet: 8, future: 2 } },
      { label: "$20,000 – $60,000", value: "medium", points: { part61: 6, cadet: 3 } },
      { label: "$60,000 – $90,000", value: "high", points: { part141: 5, part61: 4 } },
      { label: "$90,000 – $130,000", value: "veryhigh", points: { part141: 8, university: 4 } },
      { label: "$130,000+ or student loans", value: "top", points: { university: 10, part141: 5 } },
    ],
  },
  {
    id: "time",
    title: "How much time can you commit to training?",
    options: [
      { label: "Full-time — I can stop working", value: "fulltime", points: { part141: 4, cadet: 4, university: 3 } },
      { label: "Part-time — I need to keep my job", value: "parttime", points: { part61: 10 } },
    ],
  },
  {
    id: "education",
    title: "What is your highest level of education?",
    options: [
      { label: "High school diploma or GED", value: "highschool", points: { part141: 3, part61: 2 } },
      { label: "Some college", value: "somecollege", points: { part141: 2, part61: 2, university: 2 } },
      { label: "Bachelor's degree or higher", value: "degree", points: { cadet: 4, part141: 3, university: 2 } },
    ],
  },
  {
    id: "goal",
    title: "What is your ultimate flying goal?",
    options: [
      { label: "Major US airline (United, Delta, American, Southwest)", value: "major", points: { cadet: 5, part141: 4, university: 5 } },
      { label: "Regional airline (SkyWest, Envoy, Endeavor, etc.)", value: "regional", points: { part141: 6, part61: 3 } },
      { label: "Corporate / charter / cargo flying", value: "corporate", points: { part61: 5, part141: 3 } },
      { label: "Recreational / private flying only", value: "recreational", points: { part61: 10 } },
    ],
  },
];

export const roadmapResultsUS: Record<PathIdUS, RoadmapResultUS> = {
  cadet: {
    id: "cadet",
    title: "The Airline Cadet Programme",
    tagline: "The Sponsored Fast Track",
    description:
      "Based on your profile, you are a strong candidate for one of the four major US airline cadet programmes — United Aviate, American Airlines Cadet Academy, Delta Propel, or Southwest Destination 225°. These programmes provide a structured, often partially funded pathway directly to a First Officer seat at a major or regional carrier. Competition is real, but the payoff is a guaranteed airline career with a clear timeline.",
    cost: "$0 – $30,000 upfront (programme-dependent)",
    timeline: "18–36 months to First Officer",
    risk: "Low Financial Risk / Competitive Selection",
    steps: [
      "Get your FAA First Class Medical certificate immediately — this is a hard requirement for all cadet programmes and the single most important first step.",
      "Research all four programmes: United Aviate (Goodyear, AZ), American Airlines Cadet Academy (multiple locations), Delta Propel, and Southwest Destination 225°.",
      "Most programmes require a minimum of a PPL or Student Pilot Certificate before applying. Start flight training now to be eligible.",
      "Prepare for the airline-style selection process: aptitude testing, panel interviews, and simulator assessments. Practice COMPASS and ADAPT tests.",
      "Build a strong non-technical profile: customer service, leadership, and teamwork experience all carry weight in the selection process.",
    ],
    schools: [
      {
        name: "United Aviate Academy (Goodyear, AZ)",
        description:
          "United Airlines' own flight academy. Provides a direct pipeline to United Express and eventually mainline United. Competitive but well-structured.",
      },
      {
        name: "ATP Flight School (80+ locations)",
        description:
          "The largest Part 141 school in the US. Direct hiring partnerships with SkyWest, Envoy, Endeavor, and Republic. The most common feeder into regional airline cadet programmes.",
      },
      {
        name: "L3Harris Flight Academy (Sanford, FL / Goodyear, AZ)",
        description:
          "Official training provider for American Airlines' cadet programme. Accelerated Part 141 with a direct pathway to American Eagle and mainline American.",
      },
    ],
    watchOut:
      "Do not pay for a PPL just to boost your cadet application without confirming your FAA medical first. A disqualifying condition discovered after spending $10,000 on training is a painful and avoidable mistake. Book the medical first.",
  },
  part141: {
    id: "part141",
    title: "The Part 141 Accelerated Route",
    tagline: "The Fastest Path to the Airlines",
    description:
      "You have the time and budget to commit fully to accelerated training. Part 141 is the FAA's structured, approved-curriculum route — it requires fewer minimum hours than Part 61 (190 hours for CPL vs 250) and is the most direct path to the ATP minimums needed for an airline job. The top Part 141 schools have direct hiring partnerships with regional airlines, meaning you can go from zero to a First Officer interview in as little as 7–10 months.",
    cost: "$85,000 – $105,000",
    timeline: "7–10 months (zero to Commercial)",
    risk: "High Financial Commitment / Fastest Completion",
    steps: [
      "Get your FAA First Class Medical certificate before spending a dollar on training. This is non-negotiable for an airline career.",
      "Research Part 141 schools with verified airline hiring partnerships — ATP, L3Harris, CAE USA, and Aerosim are the industry leaders.",
      "Confirm financing options upfront. Sallie Mae, AOPA Finance, and some schools' own loan programmes can cover 80–100% of costs.",
      "Budget an extra 10–15% for hidden costs: checkride fees ($700–$1,500 each), FAA written exam fees ($175 each), and living costs during training.",
      "After your Commercial certificate, begin building hours as a CFI (Certified Flight Instructor) — the most common path to the 1,500 ATP hours.",
    ],
    schools: [
      {
        name: "ATP Flight School (80+ locations)",
        description:
          "The largest Part 141 school in the US. Zero to Commercial in ~7 months. Direct hiring partnerships with SkyWest, Envoy, Endeavor, Republic, Mesa, and GoJet.",
      },
      {
        name: "CAE USA (Dothan, AL)",
        description:
          "The same globally recognised CAE standard as Oxford and Melbourne. Preferred provider for SkyWest and PSA Airlines.",
      },
      {
        name: "L3Harris Flight Academy (Sanford, FL)",
        description:
          "Official training provider for American Airlines' cadet programme. Accelerated Part 141 with direct airline pathways.",
      },
    ],
    watchOut:
      "The quoted headline price rarely includes all checkride fees, FAA written exam fees, or living costs during training. Always request a full all-in cost breakdown before enrolling. The real number is typically 10–15% higher than the advertised price.",
  },
  part61: {
    id: "part61",
    title: "The Part 61 Flexible Route",
    tagline: "Train on Your Terms",
    description:
      "You need flexibility — to keep working, spread the cost, or train at your own pace. Part 61 has no fixed curriculum, which means you can train at local flight schools, community airports, and on your own schedule. It requires more total hours than Part 141 (250 hours for CPL vs 190), but it is significantly cheaper if you are disciplined and strategic about where and how you fly. Many successful airline pilots took this route.",
    cost: "$55,000 – $85,000",
    timeline: "1–4 years (self-paced)",
    risk: "Lower Financial Risk / Requires High Discipline",
    steps: [
      "Get your FAA Third Class Medical first (or First Class if you are aiming for the airlines). Confirm eligibility before spending anything on training.",
      "Find a reputable local flight school or independent CFI with a strong pass-rate record. Avoid schools with high instructor turnover.",
      "Complete your Private Pilot Certificate (PPL) first — typically 40–60 hours and $8,000–$15,000 at a local flight school.",
      "Study for your FAA written exams using Sporty's, King Schools, or Gleim. Pass the written before your checkride.",
      "Build hours strategically after your Commercial certificate — CFI, banner towing, aerial survey, and pipeline patrol are common hour-building jobs.",
    ],
    schools: [
      {
        name: "Local FBOs and flight schools",
        description:
          "Part 61 training is available at thousands of local airports across the US. Look for schools with modern aircraft, good instructor continuity, and transparent pricing.",
      },
      {
        name: "Sporty's Flight Academy (Batavia, OH)",
        description:
          "One of the most respected Part 61 training providers in the US. Known for quality instruction and a strong ground school curriculum.",
      },
      {
        name: "AOPA Flight Training",
        description:
          "The Aircraft Owners and Pilots Association maintains a directory of vetted flight schools and offers financing resources for Part 61 students.",
      },
    ],
    watchOut:
      "Skill decay is the biggest risk of the Part 61 route. If you leave too long between lessons, you will need expensive refresher flights to get back to standard. Aim for at least 2–3 flights per week during active training phases. Treat it like a second job.",
  },
  university: {
    id: "university",
    title: "The University / R-ATP Route",
    tagline: "The Degree + Airline Advantage",
    description:
      "You have the time, the academic background, and the budget for the university route — and it pays off. Graduates of FAA-approved aviation degree programmes (Embry-Riddle, UND, MTSU, and others) qualify for the Restricted-ATP (R-ATP) at just 1,000 hours instead of the standard 1,500. That saves 12–18 months of flight instructing time — and gets you to a major airline interview significantly earlier than the standard route. You also graduate with a Bachelor's degree, which is a hard requirement for most major airline applications.",
    cost: "$95,000 – $130,000 (4-year degree total)",
    timeline: "4 years (BSc + all FAA ratings)",
    risk: "High Upfront Cost / Strongest Long-Term Career Position",
    steps: [
      "Get your FAA First Class Medical before committing to any aviation programme. This is a hard requirement and should be your first step.",
      "Research Embry-Riddle (Daytona Beach or Prescott), University of North Dakota, Middle Tennessee State University, and other AABI-accredited programmes.",
      "Apply for FAFSA, GI Bill (if applicable), and school-specific aviation scholarships. Federal student aid is available at all accredited university programmes.",
      "Confirm the school has direct airline partnerships (all four major cadet programmes recruit heavily from ERAU and UND).",
      "Use your summers and breaks to build hours faster — many university students reach 1,000 hours before graduation by instructing part-time.",
    ],
    schools: [
      {
        name: "Embry-Riddle Aeronautical University (Daytona Beach, FL / Prescott, AZ)",
        description:
          "The world's most prestigious aviation university. R-ATP at 1,000 hours. Direct pipelines to all four major airline cadet programmes. FAFSA and GI Bill eligible.",
      },
      {
        name: "University of North Dakota (Grand Forks, ND)",
        description:
          "The second most recognised aviation university in the US. R-ATP at 1,000 hours. Known for exceptional winter flying training and strong regional airline placement.",
      },
      {
        name: "Middle Tennessee State University (Murfreesboro, TN)",
        description:
          "AABI-accredited aviation programme with R-ATP eligibility. More affordable than ERAU or UND, with strong regional airline partnerships.",
      },
    ],
    watchOut:
      "Not all university aviation programmes qualify for the R-ATP 1,000-hour reduction. The programme must be AABI-accredited and FAA-approved. Always confirm R-ATP eligibility before enrolling — it is the entire point of the university route.",
  },
  future: {
    id: "future",
    title: "The Future Aviator",
    tagline: "Laying the Groundwork",
    description:
      "You are too young to start commercial training — which is actually a significant advantage. You have time to build exactly the profile airlines are looking for, without spending a fortune. Focus on your education, explore free flying opportunities through Civil Air Patrol, and start saving. Pilots who plan early almost always have a smoother, cheaper path to the airlines.",
    cost: "Minimal now",
    timeline: "Ongoing until age 17–18",
    risk: "Zero Financial Risk",
    steps: [
      "Join the Civil Air Patrol (CAP) — the official US Air Force Auxiliary. It provides free aviation education, orientation flights, and the opportunity to solo at 14 and get a PPL at 16.",
      "Focus on your GPA and take Maths, Physics, and English seriously — these subjects are directly tested in FAA written exams.",
      "Start saving now. Even $100/month from a part-time job will fund a significant portion of your PPL by 17.",
      "Research university aviation programmes (Embry-Riddle, UND) and the R-ATP 1,000-hour advantage — this is the most powerful tool available to you.",
      "Visit airfields, attend EAA AirVenture Oshkosh, and read widely about the industry. The more you know before you start training, the faster you will progress.",
    ],
    schools: [
      {
        name: "Civil Air Patrol (CAP)",
        description:
          "The best possible start for a US teenager. Free orientation flights, the chance to solo at 14, and a structured aviation education programme available in all 50 states.",
      },
      {
        name: "EAA Young Eagles Programme",
        description:
          "Free introductory flights for young people aged 8–17, provided by volunteer EAA member pilots. Over 2.2 million flights given since 1992.",
      },
      {
        name: "Embry-Riddle Aeronautical University",
        description:
          "Start researching now. ERAU's aviation degree programme with R-ATP eligibility at 1,000 hours is the most powerful career accelerator available to a US pilot.",
      },
    ],
    watchOut:
      "You do not need a degree to become a commercial pilot in the US — but a Bachelor's degree is a de facto requirement for most major airline applications. If you plan to go to university anyway, choose an AABI-accredited aviation programme and get the R-ATP advantage for free.",
  },
};
