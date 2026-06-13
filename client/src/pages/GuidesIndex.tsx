import { useEffect, useState } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, ChevronRight, BookOpen, Zap } from "lucide-react";

const guides = [
  { title: "How to Become a Pilot", description: "A complete step-by-step guide from zero experience to your first airline job.", href: "/guides/how-to-become-a-pilot", time: "8 min read", category: "Getting Started", emoji: "🛫", market: "UK" },
  { title: "Pilot Training Cost Guide", description: "A detailed breakdown of what pilot training costs in the UK, Europe and USA.", href: "/guides/pilot-training-costs", time: "7 min read", category: "Costs & Finance", emoji: "💰", market: "UK" },
  { title: "Integrated vs Modular ATPL", description: "The two main routes to an ATPL explained — and how to choose between them.", href: "/guides/integrated-vs-modular", time: "6 min read", category: "Training Routes", emoji: "⚖️", market: "UK" },
  { title: "Class 1 Medical Guide", description: "What the Class 1 Medical tests, how to pass it, and what to do with a health condition.", href: "/guides/class-1-medical", time: "5 min read", category: "Medical", emoji: "🩺", market: "UK" },
  { title: "Can I Become a Pilot with ADHD?", description: "The 2026 UK CAA rules on ADHD, medication, and the exact steps to get your Class 1 Medical.", href: "/guides/adhd-pilot-uk", time: "6 min read", category: "Medical", emoji: "🧠", market: "UK" },
  { title: "Airline Pilot Salary Guide", description: "What do airline pilots actually earn? First officer and captain salaries explained.", href: "/guides/airline-pilot-salary", time: "7 min read", category: "Career", emoji: "📈", market: "UK" },
  { title: "Best Route to Becoming an Airline Pilot", description: "The fastest and most cost-effective paths from zero to a first officer seat.", href: "/guides/best-route-to-airline", time: "6 min read", category: "Training Routes", emoji: "🗺️", market: "UK" },
  { title: "Pilot Training Finance Guide", description: "How to fund your training — loans, sponsorships, payment plans and government schemes.", href: "/guides/finance-guide", time: "6 min read", category: "Costs & Finance", emoji: "🏦", market: "UK" },
  { title: "Pilot Training Timeline Guide", description: "How long does it take to become a pilot? Realistic timelines for every route.", href: "/guides/training-timeline", time: "5 min read", category: "Getting Started", emoji: "📅", market: "UK" },
  { title: "Am I Too Old to Become a Pilot?", description: "The honest answer on age limits, career runway, and whether training at 30, 40 or 50 makes sense.", href: "/guides/am-i-too-old-to-become-a-pilot", time: "6 min read", category: "Getting Started", emoji: "🎂", market: "UK" },
  { title: "Am I Ready to Start Pilot Training?", description: "8 questions to answer honestly before committing money to flight training.", href: "/guides/am-i-ready-to-start-pilot-training", time: "7 min read", category: "Getting Started", emoji: "✅", market: "UK" },
  { title: "The UK Pilot Shortage 2026", description: "Is the shortage real? What it means for your hiring prospects, salary, and career timeline.", href: "/guides/uk-pilot-shortage-2026", time: "7 min read", category: "Career", emoji: "📊", market: "UK" },
  { title: "UK Pilot Salary Guide 2026", description: "Real salary figures for first officers and captains at every major UK airline.", href: "/guides/uk-pilot-salary-2026", time: "8 min read", category: "Career", emoji: "💷", market: "UK" },
  { title: "Airline Pilot Interview Guide", description: "What happens in airline selection, what assessors look for, and how to prepare properly.", href: "/guides/airline-pilot-interview", time: "9 min read", category: "Career", emoji: "🎯", market: "UK" },
  { title: "Women in Aviation UK", description: "Scholarships, challenges, industry progress and support organisations for women pursuing a pilot career.", href: "/guides/women-in-aviation-uk", time: "7 min read", category: "Career", emoji: "✈️", market: "UK" },
  { title: "Class 1 Medical Disqualifiers", description: "What conditions disqualify you from a Class 1 medical — and which ones don't.", href: "/guides/class-1-medical-disqualifiers", time: "7 min read", category: "Medical", emoji: "❤️", market: "UK" },
  { title: "How to Finance Pilot Training (2026)", description: "Every realistic funding option — HSBC pilot loan, cadet bonds, savings strategies, and what to avoid.", href: "/guides/how-to-finance-pilot-training-uk", time: "9 min read", category: "Costs & Finance", emoji: "🏦", market: "UK" },
  { title: "Pilot Training Over 40", description: "Is it worth training as a pilot in your 40s? Real numbers, ROI calculation, and what airlines think.", href: "/guides/pilot-training-over-40", time: "7 min read", category: "Costs & Finance", emoji: "📐", market: "UK" },
  { title: "Cadet Pilot Programmes UK", description: "Every sponsored cadet scheme in the UK — BA, Jet2, Ryanair, easyJet — eligibility and how to apply.", href: "/guides/cadet-pilot-programmes-uk", time: "8 min read", category: "Training Routes", emoji: "🎓", market: "UK" },
  { title: "Modular vs Integrated: The Definitive Guide", description: "Real cost comparison, hiring outcomes, and which route is right for your situation. Not flight school marketing.", href: "/guides/modular-vs-integrated-pilot-training", time: "11 min read", category: "Training Routes", emoji: "⚖️", market: "UK" },
  { title: "Integrated vs Modular: Which is Actually Cheaper?", description: "A brutally honest breakdown of the real costs of pilot training. We compare the £100k+ integrated route against the £60k modular route.", href: "/guides/integrated-vs-modular-cost", time: "9 min read", category: "Costs & Finance", emoji: "🧮", market: "UK" },
  { title: "RAF vs Civilian Pilot Training", description: "Honest comparison of military and civilian routes — costs, timelines, lifestyle, and career outcomes.", href: "/guides/raf-vs-civilian-pilot-training", time: "8 min read", category: "Training Routes", emoji: "🪖", market: "UK" },
  { title: "Best Flight Schools UK 2026", description: "Data-driven comparison of the UK's top flight schools — outcomes, costs, fleet, and what students say.", href: "/guides/best-flight-schools-uk-2026", time: "10 min read", category: "Training Routes", emoji: "🏫", market: "UK" },
  { title: "ATPL Theory Exams: Complete Guide", description: "All 14 subjects, pass rates, difficulty ratings, and the study strategies that work.", href: "/guides/atpl-theory-exams-uk", time: "10 min read", category: "Training Routes", emoji: "📚", market: "UK" },
  { title: "Hour Building for Pilots", description: "How to build your 200 hours cheaply and efficiently — best locations, aircraft, and strategies.", href: "/guides/hour-building-pilot-uk", time: "8 min read", category: "Training Routes", emoji: "⏱️", market: "UK" },
  { title: "Pilot Type Ratings UK 2026", description: "What type ratings are, what they cost, and whether to self-fund or wait for airline sponsorship.", href: "/guides/pilot-type-rating-uk", time: "7 min read", category: "Training Routes", emoji: "🛩️", market: "UK" },
  { title: "Pilot CV & Cover Letter Guide", description: "How to write a pilot CV and cover letter that gets you to interview — structure, content, and what to avoid.", href: "/guides/pilot-cv-cover-letter", time: "8 min read", category: "Career", emoji: "📄", market: "UK" },
  { title: "Pilot Aptitude Test Preparation", description: "What the tests measure, how to prepare, and free resources — without paying £200 for a prep course.", href: "/guides/pilot-aptitude-test-preparation", time: "9 min read", category: "Getting Started", emoji: "🧠", market: "UK" },
  { title: "Airline Simulator Assessment Guide", description: "What to expect in the sim assessment, how it's scored, and how to prepare for raw flying and CRM.", href: "/guides/airline-simulator-assessment", time: "8 min read", category: "Career", emoji: "🕹️", market: "UK" },
  // Cadet programme guides
  { title: "BA Speedbird Academy 2026", description: "Complete guide to BA's flagship cadet programme — selection, training at CAE Oxford, costs, and guaranteed FO job.", href: "/guides/ba-speedbird-academy", time: "10 min read", category: "Cadet Programmes", emoji: "✈️", market: "UK" },
  { title: "easyJet Generation Pilot 2026", description: "The MPL route from zero hours to easyJet First Officer — how it works, costs, and how to get in.", href: "/guides/easyjet-generation-pilot", time: "9 min read", category: "Cadet Programmes", emoji: "🟠", market: "UK" },
  { title: "Ryanair Cadet Programme 2026", description: "How Ryanair recruits cadets via FTEJerez, Bartolini Air, and MATS — costs from £47k, selection, and career.", href: "/guides/ryanair-cadet-programme", time: "8 min read", category: "Cadet Programmes", emoji: "🔵", market: "UK" },
  { title: "Wizz Air Pilot Academy 2026", description: "Europe's fastest-growing airline's cadet programme — training, costs, and what a Wizz Air career looks like.", href: "/guides/wizz-air-pilot-academy", time: "8 min read", category: "Cadet Programmes", emoji: "🟣", market: "UK" },
  { title: "TUI Airways MPL Programme 2026", description: "TUI's MPL cadet pathway from zero hours to Boeing 737 FO — selection, training, costs, and career.", href: "/guides/tui-mpl-cadet-programme", time: "8 min read", category: "Cadet Programmes", emoji: "🌴", market: "UK" },
  // New UK licence & career guides
  { title: "Private Pilot Licence (PPL) UK", description: "PPL requirements, costs (£8,000–£15,000), theory exams, and what you can do with a PPL.", href: "/guides/ppl-uk", time: "8 min read", category: "Training Routes", emoji: "🛩️", market: "UK" },
  { title: "Commercial Pilot Licence (CPL) UK", description: "CPL requirements, costs, what jobs it unlocks, and how it fits into the ATPL pathway.", href: "/guides/cpl-uk", time: "8 min read", category: "Training Routes", emoji: "📋", market: "UK" },
  { title: "Instrument Rating (IR) UK", description: "EASA IR vs UK IR vs EIR — requirements, costs, and why it's essential for an airline career.", href: "/guides/instrument-rating-uk", time: "8 min read", category: "Training Routes", emoji: "🧭", market: "UK" },
  { title: "Frozen ATPL UK: What It Is & How to Get One", description: "What a frozen ATPL is, the 14 theory subjects, how long it takes, and how to unfreeze it.", href: "/guides/frozen-atpl-uk", time: "9 min read", category: "Training Routes", emoji: "❄️", market: "UK" },
  { title: "How to Become a First Officer at a UK Airline", description: "Minimum requirements, type rating costs, FO salary, and which airlines hire low-hours pilots.", href: "/guides/first-officer-uk", time: "9 min read", category: "Career", emoji: "🪑", market: "UK" },
  { title: "How to Become a Flight Instructor (FI) UK", description: "FI rating requirements, costs, salary, and how instructing fits into the hour-building strategy.", href: "/guides/flight-instructor-uk", time: "8 min read", category: "Training Routes", emoji: "👨‍🏫", market: "UK" },
  { title: "MCC & JOC Course UK", description: "What MCC and JOC are, cost (£3,500–£8,000), duration, and which airlines require which.", href: "/guides/mcc-joc-uk", time: "7 min read", category: "Training Routes", emoji: "🤝", market: "UK" },
  { title: "Pilot Eyesight Requirements UK", description: "Can you become a pilot with glasses or contacts? Class 1 vision standards and colour vision rules.", href: "/guides/pilot-eyesight-requirements-uk", time: "6 min read", category: "Medical", emoji: "👁️", market: "UK" },
  // US guides
  { title: "How to Become a Pilot in the USA", description: "The complete 2026 guide to FAA licences, Part 141 vs Part 61, ATP minimums, and airline cadet programmes.", href: "/us/guides/how-to-become-a-pilot", time: "9 min read", category: "Getting Started", emoji: "🇺🇸", market: "US" },
  { title: "FAA Medical Requirements (2026)", description: "First, Second, and Third Class medical standards — what the AME checks and how to prepare.", href: "/us/guides/faa-medical-requirements", time: "7 min read", category: "Medical", emoji: "🏥", market: "US" },
  { title: "Part 61 vs Part 141: Which is Right for You?", description: "The honest comparison of the two FAA training structures — cost, speed, and which schools offer what.", href: "/us/guides/part-61-vs-141", time: "8 min read", category: "Training Routes", emoji: "⚖️", market: "US" },
  // New US guides
  { title: "Airline Pilot Salary USA 2026", description: "Real pay data for regional FOs, major airline first officers, and captains at Delta, United, American, Southwest, FedEx and UPS.", href: "/us/guides/airline-pilot-salary-usa", time: "10 min read", category: "Career", emoji: "💵", market: "US" },
  { title: "How to Fund Pilot Training in the USA", description: "Sallie Mae loans, GI Bill, AOPA Finance, scholarships, and income share agreements — every realistic option.", href: "/us/guides/how-to-fund-pilot-training-usa", time: "9 min read", category: "Costs & Finance", emoji: "🏦", market: "US" },
  { title: "PPL Requirements USA", description: "FAA PPL requirements, cost ($8,000–$15,000), knowledge test, checkride, and what you can do with a PPL.", href: "/us/guides/ppl-requirements-usa", time: "8 min read", category: "Training Routes", emoji: "🛩️", market: "US" },
  { title: "Commercial Pilot Certificate USA", description: "FAA CPL requirements, cost, what jobs it unlocks, and how it fits into the airline career path.", href: "/us/guides/commercial-pilot-certificate-usa", time: "8 min read", category: "Training Routes", emoji: "📋", market: "US" },
  { title: "Using the GI Bill for Flight School", description: "Which GI Bill chapters cover flight training, which schools are VA-approved, and how to apply.", href: "/us/guides/gi-bill-flight-training", time: "8 min read", category: "Costs & Finance", emoji: "🎖️", market: "US" },
  { title: "Instrument Rating USA", description: "FAA IR requirements, cost ($8,000–$15,000), what it allows you to do, and how to maintain currency.", href: "/us/guides/instrument-rating-usa", time: "8 min read", category: "Training Routes", emoji: "🧭", market: "US" },
  { title: "US Pilot Career Outlook 2026", description: "Is now the best time to become a pilot? The real scale of the shortage, hiring timelines, and salary trajectory.", href: "/us/guides/us-pilot-career-outlook", time: "8 min read", category: "Career", emoji: "📊", market: "US" },
  { title: "Can You Be a Pilot with ADHD in the USA?", description: "FAA's position on ADHD, Special Issuance process, medication rules, and neuropsychological testing requirements.", href: "/us/guides/adhd-faa-medical", time: "8 min read", category: "Medical", emoji: "🧠", market: "US" },
  { title: "ATP Certificate USA", description: "FAA ATP requirements, R-ATP pathways, ATP-CTP course, checkride, and what the ATP unlocks for your career.", href: "/us/guides/atp-certificate-usa", time: "10 min read", category: "Training Routes", emoji: "🏆", market: "US" },
  { title: "How to Become a CFI in the USA", description: "CFI requirements, salary ($30,000–$60,000), how many hours you build per year, and the CFI to airline timeline.", href: "/us/guides/cfi-career-usa", time: "8 min read", category: "Career", emoji: "👨‍🏫", market: "US" },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Getting Started": { bg: "oklch(0.45 0.18 240 / 0.12)", text: "oklch(0.7 0.18 240)", border: "oklch(0.45 0.18 240 / 0.25)" },
  "Costs & Finance": { bg: "oklch(0.72 0.18 65 / 0.12)", text: "oklch(0.85 0.15 65)", border: "oklch(0.72 0.18 65 / 0.25)" },
  "Training Routes": { bg: "oklch(0.6 0.18 200 / 0.12)", text: "oklch(0.75 0.15 200)", border: "oklch(0.6 0.18 200 / 0.25)" },
  "Medical": { bg: "oklch(0.55 0.18 145 / 0.12)", text: "oklch(0.7 0.18 145)", border: "oklch(0.55 0.18 145 / 0.25)" },
  "Career": { bg: "oklch(0.65 0.2 300 / 0.12)", text: "oklch(0.78 0.18 300)", border: "oklch(0.65 0.2 300 / 0.25)" },
  "Cadet Programmes": { bg: "oklch(0.55 0.2 145 / 0.12)", text: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.2 145 / 0.25)" },
};

type MarketFilter = "All" | "UK" | "US";

const surface = "oklch(0.14 0.08 250)";
const borderStyle = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.18)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";

export default function GuidesIndex() {
  useEffect(() => { document.title = "Pilot Training Guides – AviatorIQ"; }, []);
  const [market, setMarket] = useState<MarketFilter>("All");

  const filtered = guides.filter((g) => market === "All" || g.market === market);
  const categories = Array.from(new Set(filtered.map((g) => g.category)));

  const tabStyle = (active: boolean) => ({
    background: active ? "oklch(0.50 0.22 255)" : "oklch(1 0 0 / 0.05)",
    border: `1px solid ${active ? "oklch(0.50 0.22 255)" : "oklch(1 0 0 / 0.10)"}`,
    color: active ? "white" : "oklch(0.55 0.04 240)",
    fontWeight: 700,
    fontSize: "0.8rem",
    padding: "0.4rem 1rem",
    borderRadius: "9999px",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <PublicNav />
      <main className="flex-1">

        {/* Hero */}
        <div
          className="relative overflow-hidden py-10 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-3xl text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5" style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
              <BookOpen className="w-3 h-3" />
              Free Guides
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
              Pilot Training Guides
            </h1>
            <p className="text-base md:text-lg mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
              Everything you need to understand before starting your pilot training journey. Written clearly, updated for 2026.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
              style={{ background: ctaGradient, boxShadow: "0 0 24px oklch(0.72 0.18 65 / 0.3)" }}
            >
              <Zap className="w-4 h-4" />
              Take the free assessment
            </Link>
          </div>
        </div>

        {/* Market filter tabs */}
        <div className="px-4 pt-6 pb-2" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider mr-1" style={{ color: muted }}>Show:</span>
              {(["All", "UK", "US"] as MarketFilter[]).map((m) => (
                <button key={m} style={tabStyle(market === m)} onClick={() => setMarket(m)}>
                  {m === "UK" ? "🇬🇧 UK Guides" : m === "US" ? "🇺🇸 US Guides" : "All Guides"}
                </button>
              ))}
              <span className="ml-auto text-xs" style={{ color: muted }}>
                {filtered.length} guide{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Guides by category */}
        <div className="py-6 md:py-8 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-4xl">
            {categories.map((cat) => {
              const catColor = categoryColors[cat] ?? categoryColors["Getting Started"];
              return (
                <div key={cat} className="mb-8 md:mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider"
                      style={{ background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}
                    >
                      {cat}
                    </span>
                    <div className="flex-1 h-px" style={{ background: borderStyle }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.filter((g) => g.category === cat).map((guide) => (
                      <Link
                        key={guide.href}
                        href={guide.href}
                        className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-200 no-underline"
                        style={{ background: surface, border: `1px solid ${borderStyle}` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderStyle}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                      >
                        <span className="text-2xl flex-shrink-0 mt-0.5">{guide.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-white/90 group-hover:text-white transition-colors text-sm leading-snug">
                              {guide.title}
                            </h3>
                            {guide.market === "US" && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "oklch(0.55 0.2 25 / 0.15)", color: "oklch(0.75 0.18 25)", border: "1px solid oklch(0.55 0.2 25 / 0.25)" }}>US</span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed mb-3" style={{ color: muted }}>
                            {guide.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.45 0.04 240)" }}>
                            <Clock className="w-3 h-3" />
                            {guide.time}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1" style={{ color: "oklch(0.4 0.04 240)" }} />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div
              className="p-5 md:p-8 rounded-2xl text-center mt-4"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
            >
              <h3 className="font-display font-bold text-xl text-white mb-2">Ready to take the next step?</h3>
              <p className="text-sm mb-5" style={{ color: muted }}>
                Take the free 5-minute assessment and get a personalised pilot training roadmap.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                  style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" }}
                >
                  Get your free UK roadmap
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/us/roadmap"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                  style={{ background: "oklch(1 0 0 / 0.07)", border: "1px solid oklch(1 0 0 / 0.12)" }}
                >
                  🇺🇸 Get your free US roadmap
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
