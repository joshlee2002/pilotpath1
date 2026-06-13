export type PathId = 'sponsored' | 'integrated' | 'modular' | 'hybrid' | 'future';

export interface Question {
  id: string;
  title: string;
  options: {
    label: string;
    value: string;
    points: Partial<Record<PathId, number>>;
  }[];
}

export interface RoadmapResult {
  id: PathId;
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

export const roadmapQuestions: Question[] = [
  {
    id: 'age',
    title: 'How old are you?',
    options: [
      { label: 'Under 18', value: 'under18', points: { future: 10 } },
      { label: '18 – 35', value: '18to35', points: { sponsored: 2, integrated: 2, hybrid: 2, modular: 1 } },
      { label: '36 – 50', value: '36to50', points: { modular: 5, integrated: 1 } },
      { label: '51+', value: 'over50', points: { modular: 5 } }
    ]
  },
  {
    id: 'budget',
    title: 'What is your realistic budget or funding capacity?',
    options: [
      { label: 'Less than £10,000', value: 'low', points: { sponsored: 10, hybrid: 1 } },
      { label: '£10,000 – £50,000', value: 'medium', points: { hybrid: 5, modular: 3 } },
      { label: '£50,000 – £70,000', value: 'high', points: { modular: 6, hybrid: 2 } },
      { label: '£70,000 – £90,000', value: 'veryhigh_eu', points: { integrated: 6, modular: 3, hybrid: 1 } },
      { label: '£90,000+', value: 'veryhigh', points: { integrated: 10, modular: 2 } }
    ]
  },
  {
    id: 'time',
    title: 'How much time can you dedicate to training?',
    options: [
      { label: 'Full-time (I can stop working)', value: 'fulltime', points: { integrated: 3, sponsored: 3, hybrid: 3, modular: 1 } },
      { label: 'Part-time (I need to keep my job)', value: 'parttime', points: { modular: 10 } }
    ]
  },
  {
    id: 'education',
    title: 'What is your highest level of education?',
    options: [
      { label: 'No GCSEs / High School equivalent yet', value: 'none', points: { future: 5, modular: 1 } },
      { label: 'GCSEs / High School equivalent', value: 'gcses', points: { modular: 2, integrated: 2, hybrid: 2 } },
      { label: 'A-Levels / Degree', value: 'degree', points: { sponsored: 3, integrated: 2, hybrid: 2, modular: 1 } }
    ]
  },
  {
    id: 'relocation',
    title: 'Are you willing to relocate to Europe for training?',
    options: [
      { label: 'Yes — I will go wherever is cheapest/best', value: 'yes', points: { integrated: 2, modular: 2, hybrid: 3 } },
      { label: 'No — I need to stay in the UK', value: 'no', points: { integrated: 2, modular: 1 } }
    ]
  }
];

export const roadmapResults: Record<PathId, RoadmapResult> = {
  sponsored: {
    id: 'sponsored',
    title: 'The Fully Sponsored Cadet',
    tagline: 'The Golden Ticket',
    description: 'Based on your age, academics, and budget, your best shot is aiming for a fully funded airline cadet programme. These are highly competitive (often less than 1% acceptance rates), but they cover the entire £100k+ cost of training. If you don\'t secure a spot, you\'ll need to look at military options or save aggressively for the modular route.',
    cost: '£0 (Airline covers tuition)',
    timeline: '18–24 months',
    risk: 'Low Financial Risk / High Competition',
    steps: [
      'Book a Class 1 Medical to confirm you are commercially eligible before applying to anything.',
      'Research the BA Speedbird Academy, Jet2 FlightPath, and Wizz Air Pilot Academy programmes.',
      'Invest in aptitude testing preparation — airlines use Cut-e, PILAPT, and Compass assessments.',
      'Build your non-technical profile: customer service, leadership, and teamwork experience all count.',
      'Create a solid Plan B (modular route) in case selection does not go your way first time.'
    ],
    schools: [
      { name: 'BA Speedbird Academy', description: 'Fully funded by British Airways. Trains at CAE Oxford and Jerez. Extremely competitive — roughly 1,500 applicants per 30 places.' },
      { name: 'Jet2 FlightPath Academy', description: 'Fully funded ATPL with a guaranteed Jet2 first officer position on the Boeing 737/757 fleet.' },
      { name: 'Royal Air Force (RAF)', description: 'Paid to train with a world-class military flying programme, but requires a 12-year service commitment.' }
    ],
    watchOut: 'Do not pay for a PPL just to boost your cadet application. Airlines test aptitude and personality, not existing flying hours. Spend that money on psychometric test prep instead.'
  },
  integrated: {
    id: 'integrated',
    title: 'The Fast-Track Integrated',
    tagline: 'The Direct Route',
    description: 'You have the capital and the time to commit fully to training. The Integrated ATPL takes you from zero to a frozen ATPL in one continuous, structured programme — typically 18 months. It is the most expensive route, but it is fast, focused, and the major schools offer strong airline placement support. If you are willing to train in Europe, you can save £15,000–£25,000 versus a UK school for an identical qualification.',
    cost: '£85,000 – £130,000 (UK) · €75,000 – €110,000 (Europe)',
    timeline: '18–24 months',
    risk: 'High Financial Risk / Fast Completion',
    steps: [
      'Book a Class 1 Medical immediately — do not spend £100k+ without confirming you can fly commercially.',
      'Visit at least 3 integrated flight schools on their open days and ask for their verified placement statistics.',
      'If budget is a constraint, compare European EASA schools (Spain, Netherlands, Portugal) — the licence is identical.',
      'Secure your funding before enrolling. If using a loan secured against property, understand the full risk.',
      'Budget an extra 15–20% for hidden costs: Type Rating (£25k–£35k), living costs, and resit fees are rarely included in the headline price.'
    ],
    schools: [
      { name: 'CAE Oxford Aviation Academy', description: 'Premium global academy with campuses in Oxford and Phoenix. Strong airline partnerships with easyJet and Wizz Air.' },
      { name: 'Skyborne Airline Academy', description: 'Modern UK academy (Gloucestershire) partnered with BA and Jet2. Transparent pricing and strong placement record.' },
      { name: 'FTEJerez (Spain)', description: 'All-inclusive EASA campus in southern Spain. Popular with UK cadets — typically £20k cheaper than equivalent UK schools.' },
      { name: 'L3Harris Airline Academy', description: 'Campuses in Bournemouth and Palma. One of the largest integrated providers in Europe with direct airline pathways.' }
    ],
    watchOut: 'The quoted headline price almost never includes the Type Rating (£25k–£35k) or living costs during training. Always ask for a full all-in cost breakdown before signing anything.'
  },
  modular: {
    id: 'modular',
    title: 'The Smart Modular',
    tagline: 'The Flexible Route',
    description: 'You need flexibility — to keep working, spread the cost, or simply save money. The Modular route lets you complete training step-by-step: PPL, ATPL theory, hour building, then CPL/IR. It requires immense self-discipline and takes longer, but you end up with the exact same licence as an integrated student for £30,000–£50,000 less. Many successful airline pilots took this route.',
    cost: '£45,000 – £75,000',
    timeline: '2–4 years (self-paced)',
    risk: 'Lower Financial Risk / Requires High Discipline',
    steps: [
      'Book a Class 1 Medical before spending a penny on training — confirm commercial eligibility first.',
      'Find a local flying club with a good reputation and start your PPL. Aim for a club with modern aircraft and a structured syllabus.',
      'Enrol in a distance-learning ATPL theory course (Bristol Groundschool or ATPL Online are the industry standards).',
      'Plan your hour building carefully — Greece, Portugal, and the US offer better weather and cheaper aircraft rental than the UK.',
      'Save aggressively between modules and pay cash as you go to avoid compounding debt.'
    ],
    schools: [
      { name: 'Bristol Groundschool', description: 'The UK industry standard for distance-learning ATPL theory. Excellent pass rates and comprehensive study materials.' },
      { name: 'Bartolini Air (Kraków, Poland)', description: 'Highly respected for modular CPL/IR training. Official Ryanair partner school with strong placement support.' },
      { name: 'Aeros Flying Club (Wellesbourne)', description: 'One of the best-value PPL training clubs in the UK Midlands — modern fleet, structured syllabus, good instructor continuity.' },
      { name: 'Tayside Aviation (Dundee)', description: 'Established Scottish ATO offering modular CPL/IR and multi-engine training with competitive pricing.' }
    ],
    watchOut: 'Skill decay is the silent killer of the modular route. If you leave too long between modules, you will need expensive refresher flights to get back to standard. Keep momentum — treat it like a second job.'
  },
  hybrid: {
    id: 'hybrid',
    title: 'The Airline-Bonded Programme',
    tagline: 'The Middle Ground',
    description: 'You have some capital but not enough for a full £100k integrated course. Your best route is an airline-bonded or pre-financed programme. You pay a smaller upfront fee (typically £15k–£40k), and the airline finances the rest — deducting it from your future salary over several years. You are bonded to that airline, but you get a guaranteed job on completion.',
    cost: '£15,000 – £40,000 upfront (remainder deducted from salary)',
    timeline: '18–24 months',
    risk: 'Medium Financial Risk / Bonded to Airline',
    steps: [
      'Book a Class 1 Medical — all bonded programmes require this before selection.',
      'Research the Wizz Air Pilot Academy, Ryanair Future Flyer, and TUI MPL programmes in detail.',
      'Prepare intensively for aptitude and psychometric testing — Cut-e and PILAPT are the most common platforms used.',
      'Understand the geography: most bonded programmes base you in Eastern or Central Europe initially.',
      'Read every line of the bond contract. Understand exactly what you owe if you fail training or leave early.'
    ],
    schools: [
      { name: 'Wizz Air Pilot Academy', description: 'Requires approximately €14,000 upfront. The remainder is deducted from your salary over 5 years. Based in Budapest.' },
      { name: 'Ryanair Future Flyer', description: 'You fund the ATPL training yourself, but the Type Rating is provided and bonded. Strong placement guarantee.' },
      { name: 'TUI MPL Programme', description: 'Multi-Crew Pilot Licence route — trains you specifically for TUI operations. Lower upfront cost than a full integrated ATPL.' }
    ],
    watchOut: 'If you fail the course or resign before your bond expires, you will be liable for the full remaining training cost. Read the contract with a lawyer before signing.'
  },
  future: {
    id: 'future',
    title: 'The Future Aviator',
    tagline: 'Laying the Groundwork',
    description: 'You are too young to start commercial training — which is actually a significant advantage. You have time to build exactly the profile airlines are looking for, without spending a fortune. Focus on your education, get free flying experience through the Air Cadets, and start saving. Pilots who plan early almost always have a smoother path.',
    cost: 'Minimal now',
    timeline: 'Ongoing until age 18',
    risk: 'Zero Financial Risk',
    steps: [
      'Join the Air Training Corps (ATC / RAFAC). It provides aviation exposure, discipline, and often free gliding and powered flying lessons.',
      'Focus on your GCSEs and A-Levels — Maths and Physics are the most relevant subjects for ATPL theory.',
      'Start saving now. Even a part-time job putting aside £100/month will fund a significant portion of your PPL by 18.',
      'If you plan to go to university, look into University Air Squadrons (UAS) — free military flying training alongside your degree.',
      'Visit airfields, attend aviation events (RIAT, Farnborough), and read widely about the industry.'
    ],
    schools: [
      { name: 'Air Training Corps (RAFAC)', description: 'The best possible start for a UK teenager. Free gliding, powered flying scholarships, and a structured aviation education.' },
      { name: 'University Air Squadrons', description: 'Free military flying training on the Grob Tutor while completing your degree. Available at 18 UK universities.' },
      { name: 'The Air League', description: 'Apply for their annual flying and gliding scholarships — open to young people aged 14–24 with financial need.' }
    ],
    watchOut: 'You do not need a degree to become a commercial pilot. But strong GCSEs (especially Maths and English) are essential for ATPL theory. Do not let anyone tell you otherwise.'
  }
};
