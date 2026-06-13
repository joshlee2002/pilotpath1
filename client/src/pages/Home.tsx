import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
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
} from "lucide-react";

function HeroSection() {
  return (
    <section className="bg-hero relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="container relative py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-sm font-medium mb-6 animate-fade-in">
            <Star className="w-3.5 h-3.5 text-[var(--color-cta)]" />
            Free pilot career assessment — takes 5 minutes
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 animate-fade-in-up">
            Find your best route into{" "}
            <span className="text-[var(--color-cta)]">pilot training</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed animate-fade-in-up delay-100">
            Answer a few questions about your goals, budget and background. Get a personalised pilot training roadmap and be matched with suitable flight schools — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
            <Link href="/quiz" className="btn-cta text-base px-8 py-4">
              Take the Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/schools" className="btn-outline text-base px-8 py-4 border-white/40 text-white hover:bg-white/10">
              Browse Flight Schools
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-10 animate-fade-in-up delay-300">
            {[
              "No registration required",
              "Personalised AI roadmap",
              "Matched to real schools",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-cta)]" />
                {item}
              </div>
            ))}
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
      title: "Answer a few questions",
      description:
        "Tell us about your pilot goal, budget, background and timeline. The assessment takes around 5 minutes and is completely free.",
    },
    {
      number: "02",
      icon: <Target className="w-6 h-6" />,
      title: "Get your personalised roadmap",
      description:
        "Receive an AI-powered pilot training roadmap tailored to your profile — including recommended route, estimated costs and readiness score.",
    },
    {
      number: "03",
      icon: <Building2 className="w-6 h-6" />,
      title: "Compare schools and routes",
      description:
        "See flight schools that match your country, budget and training preferences. Request introductions to the ones that interest you.",
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)] mb-4">
            How PilotPath works
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
            Whether you want to fly for an airline, for pleasure, or as a career change, PilotPath helps you find the right route.
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
            After your assessment, PilotPath matches you with flight schools based on your country, training goal, budget and preferences — not random results.
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
            Ready to find your pilot training route?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Take the free 5-minute career assessment. Get a personalised roadmap, readiness score and matched flight schools — no registration required.
          </p>
          <Link href="/quiz" className="btn-cta text-base px-10 py-4">
            Get your free pilot roadmap
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
      <PublicNav />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
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
