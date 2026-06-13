import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";

const guides = [
  {
    title: "How to Become a Pilot",
    description: "A complete step-by-step guide from zero experience to your first airline job.",
    href: "/guides/how-to-become-a-pilot",
    time: "8 min read",
    category: "Getting Started",
  },
  {
    title: "Pilot Training Cost Guide",
    description: "A detailed breakdown of what pilot training costs in the UK, Europe and USA.",
    href: "/guides/pilot-training-costs",
    time: "7 min read",
    category: "Costs & Finance",
  },
  {
    title: "Integrated vs Modular ATPL",
    description: "The two main routes to an ATPL explained — and how to choose between them.",
    href: "/guides/integrated-vs-modular",
    time: "6 min read",
    category: "Training Routes",
  },
  {
    title: "Class 1 Medical Guide",
    description: "What the Class 1 Medical tests, how to pass it, and what to do with a health condition.",
    href: "/guides/class-1-medical",
    time: "5 min read",
    category: "Medical",
  },
  {
    title: "Airline Pilot Salary Guide",
    description: "What do airline pilots actually earn? First officer and captain salaries explained.",
    href: "/guides/airline-pilot-salary",
    time: "7 min read",
    category: "Career",
  },
  {
    title: "Best Route to Becoming an Airline Pilot",
    description: "The fastest and most cost-effective paths from zero to a first officer seat.",
    href: "/guides/best-route-to-airline",
    time: "6 min read",
    category: "Training Routes",
  },
  {
    title: "Pilot Training Finance Guide",
    description: "How to fund your training — loans, sponsorships, payment plans and government schemes.",
    href: "/guides/finance-guide",
    time: "6 min read",
    category: "Costs & Finance",
  },
  {
    title: "Pilot Training Timeline Guide",
    description: "How long does it take to become a pilot? Realistic timelines for every route.",
    href: "/guides/training-timeline",
    time: "5 min read",
    category: "Getting Started",
  },
];

const categories = Array.from(new Set(guides.map((g) => g.category)));

export default function GuidesIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-4xl text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Pilot Training Guides
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Everything you need to understand before starting your pilot training journey.
            </p>
            <Link href="/quiz" className="btn-cta text-sm">
              Take the free assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-4xl">
            {categories.map((cat) => (
              <div key={cat} className="mb-10">
                <h2 className="text-xl font-display font-bold text-[var(--color-navy)] mb-4">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guides.filter((g) => g.category === cat).map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group card-base p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display font-bold text-[var(--color-navy)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                            {guide.title}
                          </h3>
                          <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-3">
                            {guide.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                            <Clock className="w-3.5 h-3.5" />
                            {guide.time}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] flex-shrink-0 mt-1 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center mt-4">
              <h3 className="font-display font-bold text-xl mb-2">Ready to take the next step?</h3>
              <p className="text-white/70 text-sm mb-4">
                Take the free 5-minute assessment and get a personalised pilot training roadmap.
              </p>
              <Link href="/quiz" className="btn-cta text-sm">
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
