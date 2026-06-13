import { useState } from "react";
import { Link } from "wouter";
import {
  Plane, Calculator, Stethoscope, Compass,
  BookOpen, Target, CheckCircle2, ArrowRight,
  Briefcase, Users, BrainCircuit, MonitorPlay,
  Building2, GraduationCap, Zap, ChevronRight,
  DollarSign, Clock, MapPin
} from "lucide-react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";

const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.16)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";
const brandGradient = "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))";
const accent = "oklch(0.65 0.22 45)";

export default function HomeUS() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.11 0.09 252)" }}>
      <SEO
        title="AviatorIQ US — FAA Pilot Training Guidance, Costs & Flight Schools 2026"
        description="The most personalised pilot training guidance platform for the US. Part 141 vs 61, FAA medical requirements, ATP costs, airline cadet programmes, and the best US flight schools."
        canonical="https://www.aviatoriq.com/us"
      />
      <PublicNav />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, oklch(0.65 0.18 240), transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 65), transparent 70%)", transform: "translate(-30%, 30%)" }} />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Copy */}
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
                style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
                🇺🇸 US Edition — FAA Certified
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6" style={{ letterSpacing: "-0.02em", lineHeight: "1.08" }}>
                Your personalised<br />
                <span style={{ color: "oklch(0.65 0.18 240)" }}>FAA training roadmap</span><br />
                starts here
              </h1>

              <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: muted }}>
                Part 141 or Part 61? How much will it actually cost? Which airline cadet programme can you get into? We answer all of it — for free, in 5 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white no-underline transition-all hover:scale-[1.02]"
                  style={{ background: ctaGradient, boxShadow: "0 0 30px oklch(0.72 0.18 65 / 0.3)" }}
                >
                  <Zap className="w-5 h-5" />
                  Start free assessment
                </Link>
                <Link
                  href="/us/calculator"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base no-underline transition-all"
                  style={{ border: "1px solid oklch(1 0 0 / 0.15)", color: "white" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Calculator className="w-5 h-5" />
                  Estimate my costs
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm" style={{ color: muted }}>
                {[
                  "Free forever",
                  "No registration",
                  "5 minutes",
                  "FAA-accurate data",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" style={{ color: "oklch(0.65 0.18 240)" }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Mock result card */}
            <div className="flex-1 w-full max-w-md hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: surface, border: "1px solid oklch(1 0 0 / 0.12)" }}>
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid oklch(1 0 0 / 0.08)", background: "oklch(0.12 0.08 252)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: brandGradient }}>
                      <Plane className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display font-bold text-sm text-white">Your US Training Roadmap</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.65 0.18 145)", border: "1px solid oklch(0.55 0.18 145 / 0.25)" }}>Free</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="p-4 rounded-xl" style={{ background: "oklch(0.45 0.18 240 / 0.08)", border: "1px solid oklch(0.45 0.18 240 / 0.15)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4" style={{ color: "oklch(0.65 0.18 240)" }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Recommended route</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Part 141 — Accelerated Commercial</p>
                    <p className="text-xs mt-1" style={{ color: muted }}>Fastest path to ATP minimums. Eligible for federal student aid.</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>Estimated total cost</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-display font-bold text-white">$89,995</span>
                      <span className="text-xs" style={{ color: muted }}>— $104,995</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: muted }}>Finance available via Sallie Mae & AOPA</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>Matched schools</p>
                    {["ATP Flight School", "L3Harris (Sanford, FL)", "CAE USA (Dothan, AL)"].map((s) => (
                      <div key={s} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid oklch(1 0 0 / 0.06)" }}>
                        <span className="text-sm text-white">{s}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "oklch(0.55 0.18 145 / 0.1)", color: "oklch(0.65 0.18 145)" }}>Strong match</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "oklch(0.13 0.08 252)", borderTop: "1px solid oklch(1 0 0 / 0.07)", borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}>
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "14+", label: "US flight schools listed" },
              { stat: "3", label: "US-specific tools" },
              { stat: "4", label: "Airline cadet programmes" },
              { stat: "Free", label: "Always, no paywall" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-display font-black text-white mb-1">{item.stat}</div>
                <div className="text-sm font-medium" style={{ color: muted }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* US TOOLS SECTION */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5" style={{ background: "oklch(0.72 0.18 65 / 0.1)", border: "1px solid oklch(0.72 0.18 65 / 0.25)", color: "oklch(0.72 0.18 65)" }}>
              <Zap className="w-3 h-3" />
              Decision Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Tools built for the US market
            </h2>
            <p className="text-lg" style={{ color: muted }}>
              Stop guessing. Use real FAA data to plan your training route and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                href: "/us/calculator",
                icon: <Calculator className="w-6 h-6" />,
                color: "oklch(0.72 0.18 65)",
                title: "US Cost Calculator",
                desc: "Itemised breakdown of Part 61 vs 141 costs, checkrides, FAA written exams, and living expenses.",
                badge: "Most used",
              },
              {
                href: "/us/medical-lookup",
                icon: <Stethoscope className="w-6 h-6" />,
                color: "oklch(0.6 0.18 200)",
                title: "FAA Medical Lookup",
                desc: "Check specific conditions (ADHD, vision, diabetes, etc.) against FAA First, Second, and Third Class medical standards.",
                badge: null,
              },
              {
                href: "/us/cadet-eligibility",
                icon: <Compass className="w-6 h-6" />,
                color: "oklch(0.45 0.18 240)",
                title: "US Cadet Eligibility",
                desc: "See if you qualify for United Aviate, American Airlines Cadet Academy, Delta Propel, or Southwest Destination 225°.",
                badge: null,
              },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <div
                  className="p-6 rounded-2xl transition-all duration-300 cursor-pointer group h-full"
                  style={{ background: surface, border: `1px solid ${border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${tool.color.replace(")", " / 0.15)")}`, color: tool.color }}>
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "oklch(0.72 0.18 65 / 0.12)", color: "oklch(0.72 0.18 65)", border: "1px solid oklch(0.72 0.18 65 / 0.25)" }}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: muted }}>{tool.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all" style={{ color: tool.color }}>
                    Open tool <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* US COST BREAKDOWN */}
      <section className="py-20" style={{ background: "oklch(0.12 0.09 252)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5" style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
                <DollarSign className="w-3 h-3" />
                US Training Costs
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>
                How much does pilot training cost in the US?
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: muted }}>
                The total cost of becoming an airline pilot in the US depends heavily on your chosen route. Part 141 accelerated programmes are typically faster but more expensive upfront. Part 61 offers more flexibility. University programmes (Embry-Riddle, UND) offer the R-ATP advantage at 1,000 hours.
              </p>
              <Link
                href="/us/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient }}
              >
                <Calculator className="w-4 h-4" />
                Get my personalised cost estimate
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { route: "Part 141 — Accelerated Commercial", range: "$85,000 – $105,000", duration: "7–10 months", color: "oklch(0.45 0.18 240)", note: "Fastest airline route" },
                { route: "Part 61 — Flexible Commercial", range: "$60,000 – $90,000", duration: "1–3 years", color: "oklch(0.6 0.18 200)", note: "Best for part-time students" },
                { route: "University / R-ATP Programme", range: "$95,000 – $130,000", duration: "4 years (BSc)", color: "oklch(0.72 0.18 65)", note: "ATP at 1,000 hours" },
              ].map((item) => (
                <div key={item.route} className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <h3 className="font-display font-semibold text-white text-sm">{item.route}</h3>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${item.color.replace(")", " / 0.1)")}`, color: item.color, border: `1px solid ${item.color.replace(")", " / 0.2)")}` }}>
                          {item.note}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: muted }}>
                          <Clock className="w-3 h-3" /> {item.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display font-bold text-white">{item.range}</div>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs px-1" style={{ color: muted }}>
                Costs include flight training, ground school, checkride fees, and FAA written exams. Living costs not included. Finance available at most Part 141 schools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* US GUIDES SECTION */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: "oklch(0.6 0.18 200 / 0.1)", border: "1px solid oklch(0.6 0.18 200 / 0.25)", color: "oklch(0.7 0.18 200)" }}>
                <BookOpen className="w-3 h-3" />
                US Pilot Guides
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                Everything you need to know about flying in America
              </h2>
            </div>
            <Link href="/guides" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold no-underline flex-shrink-0" style={{ color: "oklch(0.65 0.18 240)" }}>
              View all guides <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: "/us/guides/how-to-become-a-pilot", badge: "Step-by-step", title: "How to Become a Pilot in the USA", desc: "The complete 2026 guide to FAA licences, from Student Pilot Certificate to ATP.", color: "oklch(0.45 0.18 240)" },
              { href: "/us/guides/part-61-vs-141", badge: "Training Routes", title: "Part 61 vs Part 141 Flight Schools", desc: "Which route is actually cheaper and faster for airline-bound students? The honest answer.", color: "oklch(0.72 0.18 65)" },
              { href: "/us/guides/faa-medical-requirements", badge: "Medical", title: "FAA First Class Medical Guide", desc: "What the AME actually checks, disqualifying conditions, and how to get a special issuance.", color: "oklch(0.6 0.18 200)" },
            ].map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group h-full"
                  style={{ background: surface, border: `1px solid ${border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div className="h-32 relative" style={{ background: `${guide.color.replace(")", " / 0.12)")}` }}>
                    <div className="absolute inset-0 flex items-end p-4">
                      <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ background: `${guide.color.replace(")", " / 0.3)")}`, border: `1px solid ${guide.color.replace(")", " / 0.4)")}` }}>
                        {guide.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-white mb-2 group-hover:text-[oklch(0.65_0.18_240)] transition-colors">{guide.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: muted }}>{guide.desc}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold" style={{ color: guide.color }}>
                      Read guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AIRLINE CADET PROGRAMMES */}
      <section className="py-20" style={{ background: "oklch(0.12 0.09 252)" }}>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5" style={{ background: "oklch(0.65 0.2 300 / 0.1)", border: "1px solid oklch(0.65 0.2 300 / 0.25)", color: "oklch(0.7 0.2 300)" }}>
              <Plane className="w-3 h-3" />
              Airline Cadet Programmes
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              The fast track to the majors
            </h2>
            <p className="text-lg" style={{ color: muted }}>
              All four major US airline cadet programmes — United Aviate, American Airlines Cadet Academy, Delta Propel, and Southwest Destination 225° — offer structured pathways from zero hours to a First Officer seat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { airline: "United Airlines", programme: "Aviate Academy", location: "Goodyear, AZ", note: "Pathway to United Express & mainline", color: "oklch(0.45 0.18 240)" },
              { airline: "American Airlines", programme: "Cadet Academy", location: "Multiple locations", note: "Pathway to American Eagle & mainline", color: "oklch(0.72 0.18 65)" },
              { airline: "Delta Air Lines", programme: "Propel Flight Academy", location: "Multiple locations", note: "Pathway to Delta Connection & mainline", color: "oklch(0.6 0.18 200)" },
              { airline: "Southwest Airlines", programme: "Destination 225°", location: "Multiple locations", note: "Pathway to Southwest Airlines mainline", color: "oklch(0.65 0.2 300)" },
            ].map((item) => (
              <div key={item.airline} className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color.replace(")", " / 0.15)")}` }}>
                  <Plane className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: item.color }}>{item.airline}</div>
                <h3 className="font-display font-bold text-white mb-2">{item.programme}</h3>
                <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: muted }}>
                  <MapPin className="w-3 h-3" /> {item.location}
                </div>
                <p className="text-xs" style={{ color: muted }}>{item.note}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/us/cadet-eligibility"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline"
              style={{ background: ctaGradient }}
            >
              <Target className="w-4 h-4" />
              Check your cadet eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* US SCHOOLS CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
                <Building2 className="w-3 h-3" />
                US Flight School Directory
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
                Compare the best US flight schools side by side
              </h2>
              <p className="text-base" style={{ color: muted }}>
                ATP, Embry-Riddle, CAE USA, L3Harris, UND, and more — with pricing, airline partnerships, financing options, and real student testimonials.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link
                href="/us/schools"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient }}
              >
                <Building2 className="w-4 h-4" />
                View US flight schools
              </Link>
              <Link
                href="/us/calculator"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold no-underline transition-all"
                style={{ border: "1px solid oklch(1 0 0 / 0.15)", color: "white" }}
                onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Calculator className="w-4 h-4" />
                Estimate training costs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
