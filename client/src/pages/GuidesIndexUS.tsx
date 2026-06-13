import { useEffect } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, ChevronRight, BookOpen, Zap, DollarSign, Stethoscope, Scale } from "lucide-react";
import SEO from "@/components/SEO";

const usGuides = [
  {
    title: "How to Become a Pilot in the USA",
    description: "The complete 2026 guide to FAA licences, Part 141 vs Part 61, ATP minimums, airline cadet programmes, and the R-ATP 1,000-hour advantage.",
    href: "/us/guides/how-to-become-a-pilot",
    time: "9 min read",
    category: "Getting Started",
    emoji: "🛫",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "FAA Medical Requirements (2026)",
    description: "First, Second, and Third Class medical standards — what the AME checks, common disqualifiers, Special Issuance, and how to prepare for your exam.",
    href: "/us/guides/faa-medical-requirements",
    time: "7 min read",
    category: "Medical",
    emoji: "🏥",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    title: "Part 61 vs Part 141: Which is Right for You?",
    description: "The honest comparison of the two FAA training structures — minimum hours, cost differences, school types, and which route fits your situation.",
    href: "/us/guides/part-61-vs-141",
    time: "8 min read",
    category: "Training Routes",
    emoji: "⚖️",
    icon: <Scale className="w-5 h-5" />,
  },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Getting Started": { bg: "oklch(0.45 0.18 240 / 0.12)", text: "oklch(0.7 0.18 240)", border: "oklch(0.45 0.18 240 / 0.25)" },
  "Medical": { bg: "oklch(0.55 0.18 145 / 0.12)", text: "oklch(0.7 0.18 145)", border: "oklch(0.55 0.18 145 / 0.25)" },
  "Training Routes": { bg: "oklch(0.6 0.18 200 / 0.12)", text: "oklch(0.75 0.15 200)", border: "oklch(0.6 0.18 200 / 0.25)" },
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
  useEffect(() => { document.title = "US Pilot Training Guides – AviatorIQ"; }, []);

  const categories = Array.from(new Set(usGuides.map((g) => g.category)));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <SEO
        title="US Pilot Training Guides (2026) | AviatorIQ"
        description="Free guides for aspiring US pilots — FAA licences, Part 141 vs Part 61, medical requirements, airline cadet programmes, and the R-ATP 1,000-hour advantage. Updated for 2026."
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
            <p className="text-base md:text-lg mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
              Everything you need to understand before starting FAA pilot training. Written clearly, updated for 2026, built for the US market.
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
                    {usGuides.filter((g) => g.category === cat).map((guide) => (
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
                  🇺🇸 US Tools
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
