import { useState } from "react";
import { Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, BookOpen, ChevronRight, Zap, Mail, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── Inline Email Capture ────────────────────────────────────────────
function InlineEmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [location] = useLocation();

  const subscribe = trpc.guides.subscribe.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => setSubmitted(true), // still show success to user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    subscribe.mutate({ email, source: `guide:${location}` });
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl my-6" style={{ background: "oklch(0.55 0.18 145 / 0.1)", border: "1px solid oklch(0.55 0.18 145 / 0.25)" }}>
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "oklch(0.7 0.18 145)" }} />
        <p className="text-sm" style={{ color: "oklch(0.75 0.04 240)" }}>
          <strong className="text-white">You're on the list.</strong> We'll email you when new guides and tools drop — no spam, unsubscribe any time.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl my-6" style={{ background: "oklch(0.45 0.18 240 / 0.07)", border: "1px solid oklch(0.45 0.18 240 / 0.18)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4" style={{ color: "oklch(0.65 0.18 240)" }} />
        <p className="text-sm font-semibold text-white">Get new guides before everyone else</p>
      </div>
      <p className="text-xs mb-3" style={{ color: "oklch(0.55 0.04 240)" }}>We publish new pilot training guides and tools monthly. No spam. Unsubscribe any time.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "oklch(0.16 0.08 250)", border: "1px solid oklch(1 0 0 / 0.12)", color: "white" }}
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="px-4 py-2 rounded-lg text-sm font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))", opacity: subscribe.isPending ? 0.7 : 1 }}
        >
          {subscribe.isPending ? "..." : "Notify me"}
        </button>
      </form>
    </div>
  );
}

interface GuideSection {
  heading: string;
  content: React.ReactNode;
}

interface RelatedGuide {
  title: string;
  href: string;
  time: string;
}

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  readTime: string;
  sections: GuideSection[];
  relatedGuides?: RelatedGuide[];
  ctaText?: string;
  ctaHref?: string;
  canonical?: string;
  metaDescription?: string;
  faqSchema?: { question: string; answer: string }[];
  author?: string;
  authorRole?: string;
  lastUpdated?: string;
}

const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const borderHover = "oklch(1 0 0 / 0.18)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";
const brandGradient = "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))";

export default function GuideLayout({
  title,
  subtitle,
  readTime,
  sections,
  relatedGuides = [],
  ctaText = "Take the free pilot assessment",
  ctaHref = "/quiz",
  canonical,
  metaDescription,
  faqSchema,
  author = "Joshua Fagan",
  authorRole = "Founder, AviatorIQ — researched from CAA, EASA & official school prospectuses",
  lastUpdated = "June 2026",
}: GuideLayoutProps) {
  const schemas: object[] = [];

  if (faqSchema && faqSchema.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqSchema.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: metaDescription || subtitle,
    publisher: { "@type": "Organization", name: "AviatorIQ", url: "https://aviatoriq.com" },
    author: { "@type": "Person", name: "Joshua Fagan", url: "https://aviatoriq.com/about" },
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <SEO
        title={`${title} | AviatorIQ`}
        description={metaDescription || subtitle}
        canonical={canonical}
        schema={schemas}
      />
      <PublicNav />
      <main className="flex-1">

        {/* Hero */}
        <div
          className="relative overflow-hidden py-10 md:py-14"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/images/airplane-takeoff.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.08 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-3xl relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-5" style={{ color: "oklch(0.5 0.04 240)" }}>
              <Link href="/guides" className="no-underline transition-colors hover:text-white" style={{ color: "oklch(0.5 0.04 240)" }}>Guides</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span style={{ color: "oklch(0.7 0.04 240)" }}>{title}</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>{title}</h1>
            <p className="text-base md:text-lg mb-4" style={{ color: "oklch(0.65 0.04 240)" }}>{subtitle}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "oklch(0.5 0.04 240)" }}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.45 0.18 240 / 0.2)", color: "oklch(0.65 0.18 240)" }}>JF</div>
                <Link href="/about" className="no-underline hover:text-white transition-colors" style={{ color: "oklch(0.5 0.04 240)" }}>{author}</Link>
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.55 0.18 145)" }} />
                <span style={{ color: "oklch(0.55 0.18 145)" }}>Updated {lastUpdated}</span>
              </span>
            </div>
            {authorRole && (
              <p className="text-xs mt-2" style={{ color: "oklch(0.42 0.04 240)" }}>{authorRole}</p>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="py-6 md:py-10 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-3xl">

            {/* Mid-page CTA banner */}
            <div
              className="flex flex-col sm:flex-row items-center gap-3 p-4 md:p-5 rounded-2xl mb-6"
              style={{ background: "oklch(0.45 0.18 240 / 0.08)", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
            >
              <div className="flex-1">
                <p className="font-display font-bold text-white text-sm mb-0.5">Get your personalised pilot roadmap</p>
                <p className="text-xs" style={{ color: muted }}>Free 5-minute assessment. No registration required.</p>
              </div>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white no-underline whitespace-nowrap flex-shrink-0"
                style={{ background: ctaGradient, boxShadow: "0 0 16px oklch(0.72 0.18 65 / 0.25)" }}
              >
                <Zap className="w-3.5 h-3.5" />
                {ctaText}
              </Link>
            </div>

            {/* Article content */}
            <div
              className="p-5 md:p-8 lg:p-10 rounded-2xl mb-6"
              style={{ background: surface, border: `1px solid ${border}` }}
            >
              {sections.map((section, i) => (
                <div key={i} className={i > 0 ? "mt-10 pt-10" : ""} style={i > 0 ? { borderTop: `1px solid ${border}` } : {}}>
                  <h2 className="text-xl font-display font-bold text-white mb-4">{section.heading}</h2>
                  <div
                    className="leading-relaxed space-y-4 text-sm"
                    style={{ color: "oklch(0.7 0.04 240)" }}
                  >
                    {section.content}
                  </div>
                  {/* Inject email capture after the 3rd section */}
                  {i === 2 && <InlineEmailCapture />}
                </div>
              ))}
              {/* If fewer than 3 sections, show email capture at the end */}
              {sections.length <= 2 && <div className="mt-10 pt-10" style={{ borderTop: `1px solid ${border}` }}><InlineEmailCapture /></div>}
            </div>

            {/* Bottom CTA */}
            <div
              className="p-5 md:p-8 rounded-2xl text-center mb-8"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.72 0.18 65 / 0.15)", color: "oklch(0.85 0.15 65)" }}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Ready to plan your pilot training?</h3>
              <p className="text-sm mb-5" style={{ color: muted }}>Take the free assessment and get a personalised roadmap, readiness score and matched flight schools.</p>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" }}
              >
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related guides */}
            {relatedGuides.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-white text-lg mb-4">Related guides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedGuides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group flex items-center justify-between p-4 rounded-xl transition-all no-underline"
                      style={{ background: surface, border: `1px solid ${border}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${borderHover}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                      <div>
                        <div className="font-display font-semibold text-white/80 group-hover:text-white transition-colors text-sm">
                          {guide.title}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: muted }}>{guide.time}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: muted }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
