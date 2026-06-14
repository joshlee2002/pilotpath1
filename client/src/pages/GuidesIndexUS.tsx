import { useEffect } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, ChevronRight, BookOpen, Zap, DollarSign, Stethoscope, Scale } from "lucide-react";
import SEO from "@/components/SEO";

const usGuides = [
  // Getting Started
  {
    title: "How to Become a Pilot in the USA",
    description: "The complete 2026 guide to FAA licences, Part 141 vs Part 61, ATP minimums, airline cadet programmes, and the R-ATP 1,000-hour advantage.",
    href: "/us/guides/how-to-become-a-pilot",
    time: "9 min read",
    category: "Getting Started",
    emoji: "🛫",
  },
  {
    title: "Part 61 vs Part 141: Which is Right for You?",
    description: "The honest comparison of the two FAA training structures — minimum hours, cost differences, school types, and which route fits your situation.",
    href: "/us/guides/part-61-vs-141",
    time: "8 min read",
    category: "Getting Started",
    emoji: "⚖️",
  },
  {
    title: "PPL Requirements USA (2026)",
    description: "Everything you need to know about getting your FAA Private Pilot Licence — minimum hours, written test, checkride, costs, and how long it takes.",
    href: "/us/guides/ppl-requirements-usa",
    time: "7 min read",
    category: "Getting Started",
    emoji: "🪂",
  },
  {
    title: "Commercial Pilot Certificate USA",
    description: "How to earn your FAA Commercial Pilot Certificate — hour requirements, knowledge test, practical test standards, and what jobs it unlocks.",
    href: "/us/guides/commercial-pilot-certificate-usa",
    time: "8 min read",
    category: "Getting Started",
    emoji: "🏆",
  },
  {
    title: "ATP Certificate USA: The Final Step to the Airlines",
    description: "The Airline Transport Pilot certificate explained — R-ATP vs full ATP, hour requirements, knowledge test, and how to get hired at a regional airline.",
    href: "/us/guides/atp-certificate-usa",
    time: "8 min read",
    category: "Getting Started",
    emoji: "✈️",
  },
  // Career & Salary
  {
    title: "US Airline Pilot Salary (2026)",
    description: "Regional vs major airline pay, First Officer vs Captain earnings, per diem, and how long it takes to reach the six-figure salary at United, Delta, and American.",
    href: "/us/guides/airline-pilot-salary-usa",
    time: "7 min read",
    category: "Career & Salary",
    emoji: "💰",
  },
  {
    title: "US Pilot Career Outlook 2026",
    description: "Is the pilot shortage real? Hiring trends at regional and major airlines, mandatory retirement age, and what the next 10 years look like for new pilots.",
    href: "/us/guides/us-pilot-career-outlook",
    time: "7 min read",
    category: "Career & Salary",
    emoji: "📈",
  },
  {
    title: "CFI Career USA: Become a Flight Instructor",
    description: "How to become a Certified Flight Instructor — CFI, CFII, MEI ratings, pay rates, hour-building strategy, and using instructing as a pathway to the airlines.",
    href: "/us/guides/cfi-career-usa",
    time: "7 min read",
    category: "Career & Salary",
    emoji: "🎓",
  },
  // Finance & Funding
  {
    title: "How to Fund Pilot Training in the USA",
    description: "Sallie Mae flight school loans, AOPA finance, VA benefits, scholarships, and the Part 141 federal student aid advantage — every funding option explained.",
    href: "/us/guides/how-to-fund-pilot-training-usa",
    time: "8 min read",
    category: "Finance & Funding",
    emoji: "🏦",
  },
  {
    title: "GI Bill Flight Training: The Complete Guide",
    description: "How veterans can use the Post-9/11 GI Bill and Montgomery GI Bill for FAA pilot training — eligible programmes, approved schools, and how to apply.",
    href: "/us/guides/gi-bill-flight-training",
    time: "8 min read",
    category: "Finance & Funding",
    emoji: "🎖️",
  },
  // Medical
  {
    title: "FAA Medical Requirements (2026)",
    description: "First, Second, and Third Class medical standards — what the AME checks, common disqualifiers, Special Issuance, and how to prepare for your exam.",
    href: "/us/guides/faa-medical-requirements",
    time: "7 min read",
    category: "Medical",
    emoji: "🏥",
  },
  {
    title: "ADHD and FAA Medical: What You Need to Know",
    description: "Can you get an FAA medical with ADHD? The Special Issuance process, approved medications, neuropsychological testing requirements, and real approval timelines.",
    href: "/us/guides/adhd-faa-medical",
    time: "7 min read",
    category: "Medical",
    emoji: "🧠",
  },
  // Ratings
  {
    title: "Instrument Rating USA: Complete Guide",
    description: "FAA Instrument Rating requirements, training structure, written test, checkride, and why it's the most important rating you'll earn after your PPL.",
    href: "/us/guides/instrument-rating-usa",
    time: "7 min read",
    category: "Ratings",
    emoji: "🌫️",
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Getting Started":    { bg: "oklch(0.45 0.18 240 / 0.12)", text: "oklch(0.7 0.18 240)",  border: "oklch(0.45 0.18 240 / 0.25)" },
  "Career & Salary":    { bg: "oklch(0.55 0.18 145 / 0.12)", text: "oklch(0.7 0.18 145)",  border: "oklch(0.55 0.18 145 / 0.25)" },
  "Finance & Funding":  { bg: "oklch(0.72 0.18 65 / 0.12)",  text: "oklch(0.85 0.15 65)",  border: "oklch(0.72 0.18 65 / 0.25)"  },
  "Medical":            { bg: "oklch(0.60 0.15 340 / 0.12)", text: "oklch(0.75 0.15 340)", border: "oklch(0.60 0.15 340 / 0.25)" },
  "Ratings":            { bg: "oklch(0.6 0.18 200 / 0.12)",  text: "oklch(0.75 0.15 200)", border: "oklch(0.6 0.18 200 / 0.25)"  },
};

const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.18)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";

const usTools = [
  { label: "US Cost Calculator", href: "/us/calculator", emoji: "🧮", desc: "Part 141 vs Part 61 vs University R-ATP — real 2026 USD costs." },
  { label: "FAA Medical Lookup", href: "/us/medical-lookup", emoji: "🏥", desc: "Check 20+ conditions against FAA medical standards." },
  { label: "Cadet Eligibility Checker", href: "/us/cadet-eligibility", emoji: "🎓", desc: "See if you qualify for United Aviate, American, Delta Propel, or Southwest 225°." },
  { label: "US Training Roadmap", href: "/us/roadmap", emoji: "🗺️", desc: "5 questions. A personalised FAA training roadmap built for your situation." },
];

export default function GuidesIndexUS() {
  useEffect(() => { document.title = "US Pilot Training Guides (2026) – AviatorIQ"; }, []);

  const categoryOrder = ["Getting Started", "Career & Salary", "Finance & Funding", "Medical", "Ratings"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <SEO
        title="US Pilot Training Guides (2026) | AviatorIQ"
        description="Free guides for aspiring US pilots — FAA licences, Part 141 vs Part 61, ATP certificate, medical requirements, GI Bill, airline cadet programmes, and pilot salaries. Updated for 2026."
        canonical="https://www.aviatoriq.com/us/guides"
      />
      <PublicNav />
      <main className="flex-1">

        {/* Hero */}
        <div
          className="relative overflow-hidden py-10 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-3xl text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ background: "oklch(0.55 0.2 25 / 0.12)", border: "1px solid oklch(0.55 0.2 25 / 0.25)", color: "oklch(0.75 0.18 25)" }}>
              <BookOpen className="w-3 h-3" />
              🇺🇸 US Pilot Guides
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
              US Pilot Training Guides
            </h1>
            <p className="text-base md:text-lg mb-2" style={{ color: "oklch(0.65 0.04 240)" }}>
              Everything you need to understand before starting FAA pilot training. Written clearly, updated for 2026, built for the US market.
            </p>
            <p className="text-sm mb-6" style={{ color: "oklch(0.5 0.04 240)" }}>
              13 free guides covering FAA licences, medical, funding, career, and ratings.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/us/roadmap"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient, boxShadow: "0 0 24px oklch(0.72 0.18 65 / 0.3)" }}
              >
                <Zap className="w-4 h-4" />
                Get my US roadmap
              </Link>
              <Link
                href="/us/calculator"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: "oklch(1 0 0 / 0.07)", border: "1px solid oklch(1 0 0 / 0.12)" }}
              >
                <DollarSign className="w-4 h-4" />
                US cost calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Guides by category */}
        <div className="py-6 md:py-12 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-4xl">

            {categoryOrder.map((cat) => {
              const guides = usGuides.filter((g) => g.category === cat);
              if (!guides.length) return null;
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
                    {guides.map((guide) => (
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

            {/* US Tools section */}
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider"
                  style={{ background: "oklch(0.55 0.2 25 / 0.12)", color: "oklch(0.75 0.18 25)", border: "1px solid oklch(0.55 0.2 25 / 0.25)" }}>
                  🇺🇸 US Decision Tools
                </span>
                <div className="flex-1 h-px" style={{ background: border }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-200 no-underline"
                    style={{ background: surface, border: `1px solid ${border}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{tool.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-white/90 group-hover:text-white transition-colors mb-1.5 text-sm leading-snug">
                        {tool.label}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: muted }}>
                        {tool.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1" style={{ color: "oklch(0.4 0.04 240)" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="p-5 md:p-8 rounded-2xl text-center mt-4"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
            >
              <h3 className="font-display font-bold text-xl text-white mb-2">Ready to find your FAA path?</h3>
              <p className="text-sm mb-5" style={{ color: muted }}>
                Answer 5 questions and get a personalised US pilot training roadmap — Part 141, Part 61, airline cadet, or university R-ATP.
              </p>
              <Link
                href="/us/roadmap"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" }}
              >
                Get your free US roadmap
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
