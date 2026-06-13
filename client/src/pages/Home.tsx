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
  MapPin,
  Activity,
  FlaskConical,
  Stethoscope,
} from "lucide-react";

function HeroSection() {
  const statsQuery = trpc.platform.stats.useQuery(undefined, { staleTime: 60_000 });
  const stats = statsQuery.data;

  return (
    <section className="bg-hero relative overflow-hidden">
      {/* Radar grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, oklch(0.65 0.18 230) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

      <div className="container relative py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Identity-led copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
              <Activity className="w-3 h-3 text-[var(--color-cta)]" />
              Free · No registration · 5 minutes
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-display font-bold text-white mb-5 leading-[1.1] animate-fade-in-up">
              Could You Actually{" "}
              <span className="text-[var(--color-cta)]">Become An Airline Pilot?</span>
            </h1>
            <p className="text-lg text-white/75 mb-8 leading-relaxed animate-fade-in-up delay-100">
              Most people never find out — not because they can't, but because they don't know what's really standing in the way. AviatorIQ identifies your biggest barrier and gives you a personalised roadmap to overcome it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
              <Link href="/quiz" className="btn-cta text-base px-8 py-4">
                Find My Biggest Barrier
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/quiz/flight-deck" className="btn-outline text-base px-6 py-4 border-white/30 text-white hover:bg-white/10">
                2-min quick check
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-8 animate-fade-in-up delay-300">
              {[
                "No registration required",
                "Real flight schools matched",
                "Free PDF blueprint",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-cta)] flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live stats / instrument panel */}
          <div className="animate-fade-in-up delay-200">
            <div className="glass-card-strong p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-cockpit-green)] animate-pulse" />
                  <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">AviatorIQ Platform</span>
                </div>
                <span className="text-white/60 text-xs">Live</span>
              </div>

              {/* Live platform stats */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  {
                    label: "Assessments Taken",
                    value: stats ? (stats.totalAssessments >= 1000 ? `${(stats.totalAssessments / 1000).toFixed(1)}k` : stats.totalAssessments.toString()) : "—",
                    icon: <Users className="w-3.5 h-3.5" />,
                    color: "oklch(0.65 0.18 230)",
                  },
                  {
                    label: "Avg IQ Score",
                    value: stats ? `${stats.avgScore}` : "—",
                    icon: <Activity className="w-3.5 h-3.5" />,
                    color: "oklch(0.72 0.18 65)",
                  },
                  {
                    label: "Top Barrier",
                    value: stats ? (stats.mostCommonBarrier.length > 12 ? stats.mostCommonBarrier.slice(0, 12) + "…" : stats.mostCommonBarrier) : "Finance",
                    icon: <TrendingUp className="w-3.5 h-3.5" />,
                    color: "oklch(0.78 0.18 25)",
                  },
                ].map((tile) => (
                  <div key={tile.label} className="stat-tile">
                    <div className="flex items-center gap-1.5 mb-1.5" style={{ color: tile.color }}>
                      {tile.icon}
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60 leading-tight">{tile.label}</span>
                    </div>
                    <div className="text-white font-display font-bold text-base">{tile.value}</div>
                  </div>
                ))}
              </div>

              {/* Platform tools */}
              <div className="space-y-2">
                <div className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-2">Decision Tools</div>
                {[
                  { label: "Career Readiness Assessment", href: "/quiz", badge: "Most popular" },
                  { label: "Integrated vs Modular Tool", href: "/tools/integrated-vs-modular", badge: null },
                  { label: "Class 1 Medical Check", href: "/tools/class-1-medical-check", badge: null },
                  { label: "Training Cost Calculator", href: "/calculator", badge: null },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href}
                    className="flex items-center justify-between px-3 py-2 rounded-lg transition-all no-underline group"
                    style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}
                  >
                    <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">{tool.label}</span>
                    <div className="flex items-center gap-2">
                      {tool.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.72 0.18 65 / 0.25)", color: "oklch(0.85 0.15 65)" }}>{tool.badge}</span>}
                      <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-white/70 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: <BookOpen className="w-6 h-6" />,
      title: "Answer a few honest questions",
      description:
        "Tell us about your goal, your situation, and — most importantly — what's been stopping you. The assessment takes around 5 minutes and is completely free.",
    },
    {
      number: "02",
      icon: <Target className="w-6 h-6" />,
      title: "Discover your biggest barrier",
      description:
        "Get your AviatorIQ Score and a clear, honest answer to the question you've been avoiding: what is actually standing between you and the cockpit?",
    },
    {
      number: "03",
      icon: <Building2 className="w-6 h-6" />,
      title: "Get a personalised roadmap",
      description:
        "Receive an AI-powered training roadmap that addresses your specific barrier, recommends the right route, and matches you with real flight schools.",
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-4">
            How AviatorIQ works
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            Three steps from curiosity to a clear pilot training plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative p-8 rounded-2xl border border-[var(--color-border)] bg-white hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                  {step.icon}
                </div>
                <span className="text-4xl font-display font-bold text-[var(--color-border)] leading-none mt-1">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-[var(--color-navy)] mb-3">
                {step.title}
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-[var(--color-border)] z-10" />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/quiz" className="btn-primary">
            Start your assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuizTeaserSection() {
  return (
    <section className="section bg-[var(--color-muted)]">
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider mb-4">
            Three assessments
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-4">
            Find your answer in minutes
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            Each assessment is designed to give you one thing: certainty. Not information — certainty. Pick the question you most need answered right now.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Flight Deck quiz — top of funnel */}
          <div className="card-base p-6 flex flex-col">
            <div className="text-3xl mb-4">✈️</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">2 minutes</span>
              <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full font-semibold">New</span>
            </div>
            <h3 className="text-lg font-display font-bold text-[var(--color-navy)] mb-2">
              What's Really Stopping You?
            </h3>
            <p className="text-[var(--color-muted-foreground)] text-sm mb-5 flex-1 leading-relaxed">
              7 questions. Find your biggest barrier, your strongest asset, and your Flight Potential Score — no sign-up needed.
            </p>
            <Link href="/quiz/flight-deck" className="btn-primary text-sm text-center no-underline">
              Find out now →
            </Link>
          </div>
          {/* Licence quiz */}
          <div className="card-base p-6 flex flex-col">
            <div className="text-3xl mb-4">🎓</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">2–3 minutes</span>
            </div>
            <h3 className="text-lg font-display font-bold text-[var(--color-navy)] mb-2">
              Which Pilot Licence Is Right For You?
            </h3>
            <p className="text-[var(--color-muted-foreground)] text-sm mb-5 flex-1 leading-relaxed">
              PPL, ATPL, LAPL or CPL? Answer 8 questions and get a personalised licence recommendation with cost estimates.
            </p>
            <Link href="/quiz/licence" className="btn-secondary text-sm text-center no-underline">
              Find my licence →
            </Link>
          </div>
          {/* Career assessment */}
          <div className="card-base p-6 flex flex-col border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
            <div className="text-3xl mb-4">🛫</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">5–10 minutes</span>
              <span className="text-xs bg-[var(--color-cta)] text-white px-2 py-0.5 rounded-full font-semibold">Most popular</span>
            </div>
            <h3 className="text-lg font-display font-bold text-[var(--color-navy)] mb-2">
              Career Readiness Assessment
            </h3>
            <p className="text-[var(--color-muted-foreground)] text-sm mb-5 flex-1 leading-relaxed">
              Your AviatorIQ Score, biggest barrier, AI training roadmap, matched flight schools, and a free PDF blueprint.
            </p>
            <Link href="/quiz" className="btn-cta text-sm text-center no-underline">
              Take the assessment →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrainingRoutesSection() {
  const routes = [
    {
      icon: "✈️",
      title: "Airline Pilot Training",
      description:
        "The most common goal. Choose between Integrated ATPL (fastest, £80k–£120k) or Modular ATPL (flexible, £40k–£80k). Both lead to the same licence.",
      cta: "Find airline training",
      href: "/quiz",
    },
    {
      icon: "🛩️",
      title: "Private Pilot Licence",
      description:
        "Fly for pleasure or personal travel. A PPL typically takes 6–18 months and costs £8,000–£15,000 depending on location and aircraft type.",
      cta: "Explore PPL training",
      href: "/quiz",
    },
    {
      icon: "🏢",
      title: "Corporate & Private Jets",
      description:
        "Fly high-net-worth individuals on business jets. Requires ATPL and type ratings. A growing sector with strong demand for experienced pilots.",
      cta: "Learn about corporate",
      href: "/quiz",
    },
    {
      icon: "🎓",
      title: "Flight Instructor",
      description:
        "Teach others to fly while building your own hours. A popular route for modular students to build flight time before airline applications.",
      cta: "Explore instructing",
      href: "/quiz",
    },
  ];

  return (
    <section className="section bg-sky-subtle">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-4">
            Every type of pilot training, covered
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            Whether you want to fly for an airline, for pleasure, or as a career change, AviatorIQ helps you find the right route.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {routes.map((route) => (
            <div
              key={route.title}
              className="card-base p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-4">{route.icon}</div>
              <h3 className="text-xl font-display font-bold text-[var(--color-navy)] mb-3">
                {route.title}
              </h3>
              <p className="text-[var(--color-muted-foreground)] mb-5 leading-relaxed">
                {route.description}
              </p>
              <Link
                href={route.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:gap-2.5 transition-all no-underline"
              >
                {route.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CostSection() {
  const costData = [
    { route: "Integrated ATPL", range: "£80,000 – £120,000", duration: "18–24 months", flag: "🇬🇧" },
    { route: "Modular ATPL", range: "£40,000 – £80,000", duration: "3–5 years", flag: "🇬🇧" },
    { route: "PPL Only", range: "£8,000 – £15,000", duration: "6–18 months", flag: "🇬🇧" },
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-5">
              How much does pilot training cost?
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] mb-6 leading-relaxed">
              Training costs vary significantly depending on your chosen route, country and school. Use our cost calculator for a personalised estimate, or take the assessment to see what suits your budget.
            </p>
            <div className="space-y-3 mb-8">
              {costData.map((item) => (
                <div
                  key={item.route}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]"
                >
                  <div>
                    <div className="font-display font-semibold text-[var(--color-navy)] text-sm">
                      {item.flag} {item.route}
                    </div>
                    <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                      {item.duration}
                    </div>
                  </div>
                  <div className="font-bold text-[var(--color-primary)] text-sm">{item.range}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculator" className="btn-primary text-sm">
                <Calculator className="w-4 h-4" />
                Cost Calculator
              </Link>
              <Link href="/guides/pilot-training-costs" className="btn-outline text-sm">
                Full Cost Guide
              </Link>
            </div>
          </div>
          <div className="bg-[var(--color-navy)] rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--color-cta)] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--color-cta-foreground)]" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">Finance options available</div>
                <div className="text-white/60 text-sm">For qualifying candidates</div>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Many flight schools offer finance plans, career development loans, and payment structures to help spread the cost of training. Take the assessment to see if you qualify.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Career development loans",
                "School payment plans",
                "Airline cadet sponsorships",
                "Government-backed schemes",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-cta)] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/guides/finance-guide" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-cta)] hover:gap-2.5 transition-all no-underline">
              Read the finance guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SchoolMatchingSection() {
  return (
    <section className="section bg-sky-subtle">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-4">
            Matched to the right flight school
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)]">
            After your assessment, AviatorIQ matches you with flight schools based on your country, training goal, budget and preferences — not random results.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: <Users className="w-6 h-6" />,
              title: "Qualified matches only",
              desc: "Schools are filtered by your training goal, budget range and location preferences.",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Your data is protected",
              desc: "We only share your details with schools you explicitly request introductions from.",
            },
            {
              icon: <Clock className="w-6 h-6" />,
              title: "No cold calls",
              desc: "You control who contacts you. No unsolicited calls from schools you haven't chosen.",
            },
          ].map((item) => (
            <div key={item.title} className="card-base p-6 text-center">
              <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)] mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-[var(--color-navy)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/schools" className="btn-outline mr-4">
            Browse All Schools
          </Link>
          <Link href="/quiz" className="btn-cta">
            Get Matched Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GuidesSection() {
  const guides = [
    { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read" },
    { title: "Integrated vs Modular training", href: "/guides/integrated-vs-modular", time: "6 min read" },
    { title: "What is a Class 1 Medical?", href: "/guides/class-1-medical", time: "5 min read" },
    { title: "Airline pilot salary guide", href: "/guides/airline-pilot-salary", time: "7 min read" },
    { title: "How long does training take?", href: "/guides/training-timeline", time: "5 min read" },
    { title: "Can I afford pilot training?", href: "/guides/finance-guide", time: "6 min read" },
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-[var(--color-navy)] mb-2">
              Pilot training guides
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Everything you need to understand before you start.
            </p>
          </div>
          <Link href="/guides" className="btn-outline text-sm whitespace-nowrap">
            All guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex items-center justify-between p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-200 no-underline"
            >
              <div>
                <div className="font-display font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-primary)] transition-colors text-sm mb-1">
                  {guide.title}
                </div>
                <div className="text-xs text-[var(--color-muted-foreground)]">{guide.time}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBannerSection() {
  return (
    <section className="bg-hero py-16">
      <div className="container text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Stop Wondering. Start Knowing.
          </h2>
          <p className="text-lg text-white/80 mb-8">
            The Career Readiness Assessment identifies your biggest barrier, names your strongest asset, and gives you a personalised roadmap with matched flight schools. Free. No registration required.
          </p>
          <Link href="/quiz" className="btn-cta text-base px-10 py-4">
            Find my biggest barrier
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

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
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <PublicNav />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
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
