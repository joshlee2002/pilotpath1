import { Link } from "wouter";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { trpc } from "@/lib/trpc";
import {
  Plane,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  BookOpen,
  Calculator,
  Building2,
  ChevronRight,
  Shield,
  Clock,
  Target,
  Zap,
  Activity,
  MapPin,
  Stethoscope,
  GraduationCap,
  Compass,
  BarChart3,
  Lock,
  Award,
  BadgeCheck,
  Quote,
} from "lucide-react";

// ─── Shared style tokens ──────────────────────────────────────────────────────
const surface = "oklch(0.14 0.08 250)";
const surfaceHover = "oklch(0.17 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.16)";
const muted = "oklch(0.55 0.04 240)";
const brandGradient = "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const statsQuery = trpc.platform.stats.useQuery(undefined, { staleTime: 60_000 });
  const stats = statsQuery.data;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 50%, oklch(0.12 0.08 240) 100%)",
        minHeight: "auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Hero background photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/hero-cockpit.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.12,
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Radial glows */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: "700px", height: "700px", background: "radial-gradient(circle, oklch(0.45 0.18 240 / 0.12) 0%, transparent 65%)", transform: "translate(25%, -25%)" }} />
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, oklch(0.6 0.18 200 / 0.07) 0%, transparent 65%)", transform: "translate(-25%, 25%)" }} />

      <div className="container relative w-full py-12 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in"
              style={{ background: "oklch(1 0 0 / 0.07)", border: "1px solid oklch(1 0 0 / 0.15)", color: "oklch(0.75 0.04 240)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Free · No registration · 5 minutes
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-display font-bold text-white mb-4 leading-[1.1] animate-fade-in-up"
              style={{ letterSpacing: "-0.02em" }}
            >
              Your Personalised{" "}
              <span style={{ background: ctaGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Pilot Training Roadmap
              </span>
            </h1>

            <p className="text-base md:text-lg mb-6 leading-relaxed animate-fade-in-up delay-100" style={{ color: "oklch(0.72 0.04 240)" }}>
              Answer 5 questions about your age, budget, and availability. Get a specific, data-driven training roadmap — your exact route, realistic costs, timeline, and matched flight schools. No generic advice.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white no-underline transition-all"
                style={{ background: ctaGradient, boxShadow: "0 0 30px oklch(0.72 0.18 65 / 0.35)" }}
              >
                Generate My Roadmap
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-white/80 no-underline transition-all hover:text-white"
                style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.15)" }}
              >
                Career Readiness Assessment
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-8 animate-fade-in-up delay-300">
              {["Free · No registration", "Real 2026 costs & timelines", "Matched flight schools"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.6 0.04 240)" }}>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.72 0.18 65)" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Platform preview — decorative, no competing CTAs */}
          <div className="hidden lg:block animate-fade-in-up delay-200">
            <div
              className="rounded-2xl p-6"
              style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.12)", backdropFilter: "blur(20px)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.55 0.04 240)" }}>Sample Roadmap</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.72 0.18 65 / 0.2)", color: "oklch(0.85 0.15 65)" }}>Free</span>
              </div>

              {/* Candidate summary */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "oklch(0.45 0.18 240 / 0.1)", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: ctaGradient }}>JM</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Jamie, 24 — London</div>
                    <div className="text-xs" style={{ color: "oklch(0.6 0.04 240)" }}>Goal: Airline Pilot (ATPL)</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-display font-black" style={{ background: ctaGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>84</div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "oklch(0.55 0.04 240)" }}>IQ Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Route", value: "Integrated ATPL" },
                    { label: "Budget", value: "£50k–£100k" },
                    { label: "Timeline", value: "Within 12 months" },
                    { label: "Top barrier", value: "Finance" },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg px-3 py-2" style={{ background: "oklch(1 0 0 / 0.05)" }}>
                      <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "oklch(0.5 0.04 240)" }}>{item.label}</div>
                      <div className="text-xs font-semibold text-white/80">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended schools */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(0.4 0.04 240)" }}>Matched Flight Schools</div>
                <div className="space-y-1.5">
                  {[
                    { name: "Oxford Aviation Academy", match: "98%", location: "Oxford, UK" },
                    { name: "L3Harris Airline Academy", match: "94%", location: "Bournemouth, UK" },
                    { name: "CAE Oxford", match: "91%", location: "Oxford, UK" },
                  ].map(school => (
                    <div
                      key={school.name}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                      style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }}
                    >
                      <div>
                        <div className="text-xs font-medium text-white/80">{school.name}</div>
                        <div className="text-[10px]" style={{ color: "oklch(0.5 0.04 240)" }}>{school.location}</div>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "oklch(0.72 0.18 65 / 0.15)", color: "oklch(0.85 0.15 65)" }}>{school.match}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Social proof bar ─────────────────────────────────────────────────────────
function SocialProofBar() {
  return (
    <div style={{ background: "oklch(0.12 0.08 250)", borderBottom: "1px solid oklch(1 0 0 / 0.08)" }}>
      <div className="container py-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {[
            { value: "16+", label: "UK flight schools listed" },
            { value: "33+", label: "In-depth training guides" },
            { value: "11", label: "Free interactive tools" },
            { value: "Free", label: "Always, no registration" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="font-display font-bold text-lg" style={{ background: brandGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.value}
              </span>
              <span className="text-sm" style={{ color: muted }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { number: "01", icon: <BookOpen className="w-6 h-6" />, title: "Answer a few honest questions", description: "Tell us about your goal, your situation, and — most importantly — what's been stopping you. The assessment takes around 5 minutes and is completely free.", color: "oklch(0.45 0.18 240)" },
    { number: "02", icon: <Target className="w-6 h-6" />, title: "Discover your biggest barrier", description: "Get your AviatorIQ Score and a clear, honest answer to the question you've been avoiding: what is actually standing between you and the cockpit?", color: "oklch(0.72 0.18 65)" },
    { number: "03", icon: <Building2 className="w-6 h-6" />, title: "Get a personalised roadmap", description: "Receive a training roadmap that addresses your specific barrier, recommends the right route, and matches you with real flight schools.", color: "oklch(0.6 0.18 200)" },
  ];

  return (
    <section className="section" style={{ background: "oklch(0.11 0.08 252)" }}>
      <div className="container">
        <div className="text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: "oklch(0.45 0.18 240 / 0.12)", border: "1px solid oklch(0.45 0.18 240 / 0.25)", color: "oklch(0.65 0.18 240)" }}>
            How it works
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Three steps from curiosity to a clear plan
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: muted }}>
            No generic advice. No information overload. Just a clear answer to the question you actually need answered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative p-5 md:p-8 rounded-2xl transition-all duration-300"
              style={{ background: surface, border: `1px solid ${border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${step.color.replace(")", " / 0.15)")}`, color: step.color }}>
                  {step.icon}
                </div>
                <span className="text-5xl font-display font-black leading-none mt-1" style={{ color: "oklch(1 0 0 / 0.06)" }}>
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{step.title}</h3>
              <p className="leading-relaxed text-sm" style={{ color: muted }}>{step.description}</p>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 z-10" style={{ color: "oklch(1 0 0 / 0.15)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white no-underline transition-all"
            style={{ background: brandGradient, boxShadow: "0 0 24px oklch(0.45 0.18 240 / 0.3)" }}
          >
            Start your assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Why Trust Us ─────────────────────────────────────────────────────────────
function ExpertCredibilitySection() {
  const pillars = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No sponsored rankings",
      body: "Flight schools are listed on merit, not because they pay us. Every school in our directory is included because it's a legitimate, CAA or EASA approved training provider.",
      color: "oklch(0.45 0.18 240)",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Researched from primary sources",
      body: "Every cost figure, timeline, and requirement in our guides is sourced from the CAA, EASA, and direct school prospectuses — not copied from other websites. We cite our sources.",
      color: "oklch(0.6 0.18 200)",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Updated for 2026",
      body: "Pilot training costs and requirements change. We review and update every guide at least twice a year. Every page shows its last-updated date so you know what you're reading.",
      color: "oklch(0.72 0.18 65)",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Built for one decision",
      body: "AviatorIQ exists for one purpose: to help you decide whether and how to become a pilot. We don't sell courses, we don't run a flight school. We have no incentive to mislead you.",
      color: "oklch(0.55 0.18 145)",
    },
  ];

  return (
    <section className="section" style={{ background: "oklch(0.11 0.08 252)" }}>
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: "oklch(0.72 0.18 65 / 0.12)", border: "1px solid oklch(0.72 0.18 65 / 0.25)", color: "oklch(0.85 0.15 65)" }}>
            <Shield className="w-3 h-3" />
            Why trust AviatorIQ
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Honest information. No agenda.
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: muted }}>
            The internet is full of flight school websites dressed up as advice. AviatorIQ is independent. Here's what that means in practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="p-5 md:p-7 rounded-2xl flex gap-5 transition-all duration-300"
              style={{ background: surface, border: `1px solid ${border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${p.color.replace(")", " / 0.15)")}`, color: p.color }}>
                {p.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pilot community note */}
        <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: "oklch(0.45 0.18 240 / 0.06)", border: "1px solid oklch(0.45 0.18 240 / 0.15)" }}>
          <p className="text-sm" style={{ color: "oklch(0.65 0.04 240)" }}>
            <span className="font-semibold text-white">Are you a pilot or flight instructor?</span>{" "}
            If you spot anything inaccurate in our guides, we want to know.{" "}
            <a href="mailto:hello@aviatoriq.com" className="underline" style={{ color: "oklch(0.65 0.18 240)" }}>Email us</a>{" "}
            and we'll review and credit you.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Quiz Teaser ──────────────────────────────────────────────────────────────
function QuizTeaserSection() {
  const quizCards = [
    {
      emoji: "✈️",
      badge: "2 minutes",
      badgeColor: "oklch(0.45 0.18 240)",
      tag: "New",
      title: "What's Really Stopping You?",
      desc: "7 questions. Find your biggest barrier, your strongest asset, and your Flight Potential Score — no sign-up needed.",
      href: "/quiz/flight-deck",
      cta: "Find out now",
      variant: "secondary",
    },
    {
      emoji: "🎓",
      badge: "2–3 minutes",
      badgeColor: "oklch(0.6 0.18 200)",
      tag: null,
      title: "Which Pilot Licence Is Right For You?",
      desc: "PPL, ATPL, LAPL or CPL? Answer 8 questions and get a personalised licence recommendation with cost estimates.",
      href: "/quiz/licence",
      cta: "Find my licence",
      variant: "secondary",
    },
    {
      emoji: "🛫",
      badge: "5–10 minutes",
      badgeColor: "oklch(0.72 0.18 65)",
      tag: "Most popular",
      title: "Career Readiness Assessment",
      desc: "Your AviatorIQ Score, biggest barrier, AI training roadmap, matched flight schools, and a free PDF blueprint.",
      href: "/quiz",
      cta: "Take the assessment",
      variant: "primary",
    },
  ];

  return (
    <section className="section" style={{ background: "oklch(0.13 0.09 250)" }}>
      <div className="container">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: "oklch(0.72 0.18 65 / 0.12)", border: "1px solid oklch(0.72 0.18 65 / 0.25)", color: "oklch(0.85 0.15 65)" }}>
            Three assessments
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Find your answer in minutes
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: muted }}>
            Each assessment is designed to give you one thing: certainty. Not information — certainty. Pick the question you most need answered right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quizCards.map((card) => (
            <div
              key={card.href}
              className="flex flex-col p-5 md:p-7 rounded-2xl transition-all duration-300"
              style={{
                background: card.variant === "primary" ? "oklch(0.45 0.18 240 / 0.08)" : surface,
                border: card.variant === "primary" ? "1px solid oklch(0.45 0.18 240 / 0.3)" : `1px solid ${border}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div className="text-3xl mb-5">{card.emoji}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: card.badgeColor }}>{card.badge}</span>
                {card.tag && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: card.variant === "primary" ? ctaGradient : "oklch(0.45 0.18 240 / 0.2)", color: "white" }}>
                    {card.tag}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-3">{card.title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: muted }}>{card.desc}</p>
              <Link
                href={card.href}
                className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold text-white no-underline transition-all"
                style={card.variant === "primary" ? { background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" } : { background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)" }}
              >
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Quiz hub link */}
        <div className="text-center mt-8">
          <Link href="/quizzes" className="inline-flex items-center gap-2 text-sm font-semibold no-underline transition-all" style={{ color: "oklch(0.65 0.18 240)" }}>
            Browse all 7 quizzes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Training Routes ──────────────────────────────────────────────────────────
function TrainingRoutesSection() {
  const routes = [
    { icon: <Plane className="w-6 h-6" />, color: "oklch(0.45 0.18 240)", title: "Airline Pilot Training", description: "The most common goal. Choose between Integrated ATPL (fastest, £80k–£120k) or Modular ATPL (flexible, £40k–£80k). Both lead to the same licence.", cta: "Find airline training", href: "/quiz" },
    { icon: <Compass className="w-6 h-6" />, color: "oklch(0.6 0.18 200)", title: "Private Pilot Licence", description: "Fly for pleasure or personal travel. A PPL typically takes 6–18 months and costs £8,000–£15,000 depending on location and aircraft type.", cta: "Explore PPL training", href: "/quiz" },
    { icon: <Building2 className="w-6 h-6" />, color: "oklch(0.72 0.18 65)", title: "Corporate & Private Jets", description: "Fly high-net-worth individuals on business jets. Requires ATPL and type ratings. A growing sector with strong demand for experienced pilots.", cta: "Learn about corporate", href: "/quiz" },
    { icon: <GraduationCap className="w-6 h-6" />, color: "oklch(0.65 0.2 300)", title: "Flight Instructor", description: "Teach others to fly while building your own hours. A popular route for modular students to build flight time before airline applications.", cta: "Explore instructing", href: "/quiz" },
  ];

  return (
    <section className="section" style={{ background: "oklch(0.11 0.08 252)" }}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Every type of pilot training, covered
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: muted }}>
            Whether you want to fly for an airline, for pleasure, or as a career change, AviatorIQ helps you find the right route.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {routes.map((route) => (
            <div
              key={route.title}
              className="p-5 md:p-7 rounded-2xl transition-all duration-300 group"
              style={{ background: surface, border: `1px solid ${border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${route.color.replace(")", " / 0.15)")}`, color: route.color }}>
                {route.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{route.title}</h3>
              <p className="leading-relaxed mb-5 text-sm" style={{ color: muted }}>{route.description}</p>
              <Link href={route.href} className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-all" style={{ color: route.color }}>
                {route.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cost Section ─────────────────────────────────────────────────────────────
function CostSection() {
  const costData = [
    { route: "Integrated ATPL", range: "£80,000 – £120,000", duration: "18–24 months", flag: "🇬🇧", color: "oklch(0.45 0.18 240)" },
    { route: "Modular ATPL", range: "£40,000 – £80,000", duration: "3–5 years", flag: "🇬🇧", color: "oklch(0.6 0.18 200)" },
    { route: "PPL Only", range: "£8,000 – £15,000", duration: "6–18 months", flag: "🇬🇧", color: "oklch(0.72 0.18 65)" },
  ];

  return (
    <section className="section" style={{ background: "oklch(0.13 0.09 250)" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-5" style={{ letterSpacing: "-0.02em" }}>
              How much does pilot training cost?
            </h2>
            <p className="text-lg mb-7 leading-relaxed" style={{ color: muted }}>
              Training costs vary significantly depending on your chosen route, country and school. Use our cost calculator for a personalised estimate, or take the assessment to see what suits your budget.
            </p>
            <div className="space-y-3 mb-8">
              {costData.map((item) => (
                <div
                  key={item.route}
                  className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{ background: surface, border: `1px solid ${border}` }}
                >
                  <div>
                    <div className="font-display font-semibold text-white text-sm">{item.flag} {item.route}</div>
                    <div className="text-xs mt-0.5" style={{ color: muted }}>{item.duration}</div>
                  </div>
                  <div className="font-bold text-sm" style={{ color: item.color }}>{item.range}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculator" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white no-underline" style={{ background: brandGradient }}>
                <Calculator className="w-4 h-4" />
                Cost Calculator
              </Link>
              <Link href="/guides/pilot-training-costs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 no-underline transition-all hover:text-white" style={{ background: "oklch(1 0 0 / 0.06)", border: `1px solid ${border}` }}>
                Full Cost Guide
              </Link>
            </div>
          </div>

          <div className="rounded-2xl p-8" style={{ background: "oklch(0.16 0.10 248)", border: "1px solid oklch(1 0 0 / 0.12)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ctaGradient }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white">Finance options available</div>
                <div className="text-sm" style={{ color: muted }}>For qualifying candidates</div>
              </div>
            </div>
            <p className="mb-6 leading-relaxed text-sm" style={{ color: muted }}>
              Many flight schools offer finance plans, career development loans, and payment structures to help spread the cost of training.
            </p>
            <ul className="space-y-3 mb-6">
              {["Career development loans", "School payment plans", "Airline cadet sponsorships", "Government-backed schemes"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.72 0.04 240)" }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.72 0.18 65)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/guides/finance-guide" className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-all" style={{ color: "oklch(0.72 0.18 65)" }}>
              Read the finance guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── School Matching ──────────────────────────────────────────────────────────
function SchoolMatchingSection() {
  return (
    <section className="section" style={{ background: "oklch(0.11 0.08 252)" }}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Matched to the right flight school
          </h2>
          <p className="text-lg" style={{ color: muted }}>
            After your assessment, AviatorIQ matches you with flight schools based on your country, training goal, budget and preferences — not random results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            { icon: <Users className="w-6 h-6" />, color: "oklch(0.45 0.18 240)", title: "Qualified matches only", desc: "Schools are filtered by your training goal, budget range and location preferences." },
            { icon: <Lock className="w-6 h-6" />, color: "oklch(0.6 0.18 200)", title: "Your data is protected", desc: "We only share your details with schools you explicitly request introductions from." },
            { icon: <Clock className="w-6 h-6" />, color: "oklch(0.72 0.18 65)", title: "No cold calls", desc: "You control who contacts you. No unsolicited calls from schools you haven't chosen." },
          ].map((item) => (
            <div key={item.title} className="p-7 rounded-2xl text-center" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${item.color.replace(")", " / 0.15)")}`, color: item.color }}>
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: muted }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center flex flex-wrap gap-4 justify-center">
          <Link href="/schools" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white/70 no-underline transition-all hover:text-white" style={{ background: "oklch(1 0 0 / 0.06)", border: `1px solid ${border}` }}>
            Browse All Schools
          </Link>
          <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline" style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.25)" }}>
            Get Matched Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Guides ───────────────────────────────────────────────────────────────────
function GuidesSection() {
  const guides = [
    { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read", icon: "🛫" },
    { title: "Integrated vs Modular training", href: "/guides/integrated-vs-modular", time: "6 min read", icon: "⚖️" },
    { title: "What is a Class 1 Medical?", href: "/guides/class-1-medical", time: "5 min read", icon: "🩺" },
    { title: "Airline pilot salary guide", href: "/guides/airline-pilot-salary", time: "7 min read", icon: "💰" },
    { title: "How long does training take?", href: "/guides/training-timeline", time: "5 min read", icon: "📅" },
    { title: "Can I afford pilot training?", href: "/guides/finance-guide", time: "6 min read", icon: "🏦" },
  ];

  return (
    <section className="section" style={{ background: "oklch(0.13 0.09 250)" }}>
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              Pilot training guides
            </h2>
            <p style={{ color: muted }}>Everything you need to understand before you start.</p>
          </div>
          <Link href="/guides" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 no-underline transition-all hover:text-white whitespace-nowrap" style={{ background: "oklch(1 0 0 / 0.06)", border: `1px solid ${border}` }}>
            All guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex items-center gap-4 p-5 rounded-xl transition-all duration-200 no-underline"
              style={{ background: surface, border: `1px solid ${border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <span className="text-2xl flex-shrink-0">{guide.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-white/90 group-hover:text-white transition-colors text-sm truncate">{guide.title}</div>
                <div className="text-xs mt-0.5" style={{ color: muted }}>{guide.time}</div>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: muted }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CtaBannerSection() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, oklch(0.12 0.12 255) 0%, oklch(0.16 0.14 248) 50%, oklch(0.14 0.10 240) 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "600px", height: "600px", background: "radial-gradient(circle, oklch(0.45 0.18 240 / 0.15) 0%, transparent 65%)" }} />

      <div className="container relative text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)", color: "oklch(0.7 0.04 240)" }}>
            <Zap className="w-3 h-3" style={{ color: "oklch(0.72 0.18 65)" }} />
            Free · No registration required
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Your Roadmap Is 5 Questions Away.
          </h2>
          <p className="text-lg mb-8" style={{ color: "oklch(0.72 0.04 240)" }}>
            Answer 5 questions. Get your specific training route, real 2026 costs, a step-by-step action plan, and matched flight schools. Free, no registration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-bold text-white no-underline transition-all"
              style={{ background: ctaGradient, boxShadow: "0 0 40px oklch(0.72 0.18 65 / 0.4)" }}
            >
              Generate My Roadmap
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white/70 no-underline transition-all hover:text-white"
              style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)" }}
            >
              Full Career Assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="AviatorIQ – What's Really Stopping You Becoming A Pilot?"
        description="Find your best route into pilot training. Take the free AviatorIQ career assessment and get a personalised pilot training roadmap matched to real flight schools."
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AviatorIQ",
          "url": "https://aviatoriq.com",
          "description": "The decision platform for people thinking about becoming a pilot.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://aviatoriq.com/schools?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <PublicNav />
      <main className="flex-1">
        <HeroSection />
        <SocialProofBar />
        <HowItWorksSection />
        <ExpertCredibilitySection />
        <QuizTeaserSection />
        <TrainingRoutesSection />
        <CostSection />
        <SchoolMatchingSection />
        <GuidesSection />
        <CtaBannerSection />
      </main>
      <PublicFooter />
    </div>
  );
}
