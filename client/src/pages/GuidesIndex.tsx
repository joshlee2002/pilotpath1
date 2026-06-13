import { useEffect } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, ChevronRight, BookOpen, Zap } from "lucide-react";

const guides = [
  { title: "How to Become a Pilot", description: "A complete step-by-step guide from zero experience to your first airline job.", href: "/guides/how-to-become-a-pilot", time: "8 min read", category: "Getting Started", emoji: "🛫" },
  { title: "Pilot Training Cost Guide", description: "A detailed breakdown of what pilot training costs in the UK, Europe and USA.", href: "/guides/pilot-training-costs", time: "7 min read", category: "Costs & Finance", emoji: "💰" },
  { title: "Integrated vs Modular ATPL", description: "The two main routes to an ATPL explained — and how to choose between them.", href: "/guides/integrated-vs-modular", time: "6 min read", category: "Training Routes", emoji: "⚖️" },
  { title: "Class 1 Medical Guide", description: "What the Class 1 Medical tests, how to pass it, and what to do with a health condition.", href: "/guides/class-1-medical", time: "5 min read", category: "Medical", emoji: "🩺" },
  { title: "Can I Become a Pilot with ADHD?", description: "The 2026 UK CAA rules on ADHD, medication, and the exact steps to get your Class 1 Medical.", href: "/guides/adhd-pilot-uk", time: "6 min read", category: "Medical", emoji: "🧠" },
  { title: "Airline Pilot Salary Guide", description: "What do airline pilots actually earn? First officer and captain salaries explained.", href: "/guides/airline-pilot-salary", time: "7 min read", category: "Career", emoji: "📈" },
  { title: "Best Route to Becoming an Airline Pilot", description: "The fastest and most cost-effective paths from zero to a first officer seat.", href: "/guides/best-route-to-airline", time: "6 min read", category: "Training Routes", emoji: "🗺️" },
  { title: "Pilot Training Finance Guide", description: "How to fund your training — loans, sponsorships, payment plans and government schemes.", href: "/guides/finance-guide", time: "6 min read", category: "Costs & Finance", emoji: "🏦" },
  { title: "Pilot Training Timeline Guide", description: "How long does it take to become a pilot? Realistic timelines for every route.", href: "/guides/training-timeline", time: "5 min read", category: "Getting Started", emoji: "📅" },
  // New SEO guides
  { title: "Am I Too Old to Become a Pilot?", description: "The honest answer on age limits, career runway, and whether training at 30, 40 or 50 makes sense.", href: "/guides/am-i-too-old-to-become-a-pilot", time: "6 min read", category: "Getting Started", emoji: "🎂" },
  { title: "Am I Ready to Start Pilot Training?", description: "8 questions to answer honestly before committing money to flight training.", href: "/guides/am-i-ready-to-start-pilot-training", time: "7 min read", category: "Getting Started", emoji: "✅" },
  { title: "The UK Pilot Shortage 2026", description: "Is the shortage real? What it means for your hiring prospects, salary, and career timeline.", href: "/guides/uk-pilot-shortage-2026", time: "7 min read", category: "Career", emoji: "📊" },
  { title: "UK Pilot Salary Guide 2026", description: "Real salary figures for first officers and captains at every major UK airline.", href: "/guides/uk-pilot-salary-2026", time: "8 min read", category: "Career", emoji: "💷" },
  { title: "Airline Pilot Interview Guide", description: "What happens in airline selection, what assessors look for, and how to prepare properly.", href: "/guides/airline-pilot-interview", time: "9 min read", category: "Career", emoji: "🎯" },
  { title: "Women in Aviation UK", description: "Scholarships, challenges, industry progress and support organisations for women pursuing a pilot career.", href: "/guides/women-in-aviation-uk", time: "7 min read", category: "Career", emoji: "✈️" },
  { title: "Class 1 Medical Disqualifiers", description: "What conditions disqualify you from a Class 1 medical — and which ones don't.", href: "/guides/class-1-medical-disqualifiers", time: "7 min read", category: "Medical", emoji: "❤️" },
  { title: "How to Finance Pilot Training (2026)", description: "Every realistic funding option — HSBC pilot loan, cadet bonds, savings strategies, and what to avoid.", href: "/guides/how-to-finance-pilot-training-uk", time: "9 min read", category: "Costs & Finance", emoji: "🏦" },
  { title: "Pilot Training Over 40", description: "Is it worth training as a pilot in your 40s? Real numbers, ROI calculation, and what airlines think.", href: "/guides/pilot-training-over-40", time: "7 min read", category: "Costs & Finance", emoji: "📐" },
  { title: "Cadet Pilot Programmes UK", description: "Every sponsored cadet scheme in the UK — BA, Jet2, Ryanair, easyJet — eligibility and how to apply.", href: "/guides/cadet-pilot-programmes-uk", time: "8 min read", category: "Training Routes", emoji: "🎓" },
  { title: "Modular vs Integrated: The Definitive Guide", description: "Real cost comparison, hiring outcomes, and which route is right for your situation. Not flight school marketing.", href: "/guides/modular-vs-integrated-pilot-training", time: "11 min read", category: "Training Routes", emoji: "⚖️" },
  { title: "Integrated vs Modular: Which is Actually Cheaper?", description: "A brutally honest breakdown of the real costs of pilot training. We compare the £100k+ integrated route against the £60k modular route.", href: "/guides/integrated-vs-modular-cost", time: "9 min read", category: "Costs & Finance", emoji: "🧮" },
  { title: "RAF vs Civilian Pilot Training", description: "Honest comparison of military and civilian routes — costs, timelines, lifestyle, and career outcomes.", href: "/guides/raf-vs-civilian-pilot-training", time: "8 min read", category: "Training Routes", emoji: "🪖" },
  { title: "Best Flight Schools UK 2026", description: "Data-driven comparison of the UK's top flight schools — outcomes, costs, fleet, and what students say.", href: "/guides/best-flight-schools-uk-2026", time: "10 min read", category: "Training Routes", emoji: "🏫" },
  { title: "ATPL Theory Exams: Complete Guide", description: "All 14 subjects, pass rates, difficulty ratings, and the study strategies that work.", href: "/guides/atpl-theory-exams-uk", time: "10 min read", category: "Training Routes", emoji: "📚" },
  { title: "Hour Building for Pilots", description: "How to build your 200 hours cheaply and efficiently — best locations, aircraft, and strategies.", href: "/guides/hour-building-pilot-uk", time: "8 min read", category: "Training Routes", emoji: "⏱️" },
  { title: "Pilot Type Ratings UK 2026", description: "What type ratings are, what they cost, and whether to self-fund or wait for airline sponsorship.", href: "/guides/pilot-type-rating-uk", time: "7 min read", category: "Training Routes", emoji: "🛩️" },
  // Cadet programme guides
  { title: "BA Speedbird Academy 2026", description: "Complete guide to BA's flagship cadet programme — selection, training at CAE Oxford, costs, and guaranteed FO job.", href: "/guides/ba-speedbird-academy", time: "10 min read", category: "Cadet Programmes", emoji: "✈️" },
  { title: "easyJet Generation Pilot 2026", description: "The MPL route from zero hours to easyJet First Officer — how it works, costs, and how to get in.", href: "/guides/easyjet-generation-pilot", time: "9 min read", category: "Cadet Programmes", emoji: "🟠" },
  { title: "Ryanair Cadet Programme 2026", description: "How Ryanair recruits cadets via FTEJerez, Bartolini Air, and MATS — costs from £47k, selection, and career.", href: "/guides/ryanair-cadet-programme", time: "8 min read", category: "Cadet Programmes", emoji: "🔵" },
  { title: "Wizz Air Pilot Academy 2026", description: "Europe's fastest-growing airline's cadet programme — training, costs, and what a Wizz Air career looks like.", href: "/guides/wizz-air-pilot-academy", time: "8 min read", category: "Cadet Programmes", emoji: "🟣" },
  { title: "TUI Airways MPL Programme 2026", description: "TUI's MPL cadet pathway from zero hours to Boeing 737 FO — selection, training, costs, and career.", href: "/guides/tui-mpl-cadet-programme", time: "8 min read", category: "Cadet Programmes", emoji: "🌴" },
  { title: "Pilot Aptitude Tests: Free Prep Guide", description: "What the tests measure, how to prepare, and free resources — without paying £200 for a prep course.", href: "/guides/pilot-aptitude-test-uk", time: "11 min read", category: "Getting Started", emoji: "🧠" },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Getting Started": { bg: "oklch(0.45 0.18 240 / 0.12)", text: "oklch(0.7 0.18 240)", border: "oklch(0.45 0.18 240 / 0.25)" },
  "Costs & Finance": { bg: "oklch(0.72 0.18 65 / 0.12)", text: "oklch(0.85 0.15 65)", border: "oklch(0.72 0.18 65 / 0.25)" },
  "Training Routes": { bg: "oklch(0.6 0.18 200 / 0.12)", text: "oklch(0.75 0.15 200)", border: "oklch(0.6 0.18 200 / 0.25)" },
  "Medical": { bg: "oklch(0.55 0.18 145 / 0.12)", text: "oklch(0.7 0.18 145)", border: "oklch(0.55 0.18 145 / 0.25)" },
  "Career": { bg: "oklch(0.65 0.2 300 / 0.12)", text: "oklch(0.78 0.18 300)", border: "oklch(0.65 0.2 300 / 0.25)" },
  "Cadet Programmes": { bg: "oklch(0.55 0.2 145 / 0.12)", text: "oklch(0.72 0.18 145)", border: "oklch(0.55 0.2 145 / 0.25)" },
};

const categories = Array.from(new Set(guides.map((g) => g.category)));
const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.18)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";

export default function GuidesIndex() {
  useEffect(() => { document.title = "Pilot Training Guides – AviatorIQ"; }, []);

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

        {/* Guides by category */}
        <div className="py-6 md:py-12 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
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
                    <div className="flex-1 h-px" style={{ background: border }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guides.filter((g) => g.category === cat).map((guide) => (
                      <Link
                        key={guide.href}
                        href={guide.href}
                        className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-200 no-underline"
                        style={{ background: surface, border: `1px solid ${border}` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                      >
                        <span className="text-2xl flex-shrink-0 mt-0.5">{guide.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-white/90 group-hover:text-white transition-colors mb-1.5 text-sm leading-snug">
                            {guide.title}
                          </h3>
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
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" }}
              >
                Get your free roadmap
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
