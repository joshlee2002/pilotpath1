import { Link } from "wouter";
import SEO from "@/components/SEO";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react";

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
}

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
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${title} | AviatorIQ`}
        description={metaDescription || subtitle}
        canonical={canonical}
        schema={schemas}
      />
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <Link href="/guides" className="hover:text-white transition-colors no-underline">Guides</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/80">{title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{title}</h1>
            <p className="text-lg text-white/80 mb-4">{subtitle}</p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-4 h-4" />
              {readTime}
            </div>
          </div>
        </div>

        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-3xl">
            {/* Mid-page CTA */}
            <div className="card-base p-5 mb-8 flex flex-col sm:flex-row items-center gap-4 border-[var(--color-primary)] bg-[var(--color-primary-light)]">
              <div className="flex-1">
                <p className="font-display font-bold text-[var(--color-navy)] text-sm mb-0.5">Get your personalised pilot roadmap</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">Free 5-minute assessment. No registration required.</p>
              </div>
              <Link href={ctaHref} className="btn-cta text-sm whitespace-nowrap flex-shrink-0">
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Content */}
            <div className="card-base p-6 md:p-8 mb-6 prose-guide">
              {sections.map((section, i) => (
                <div key={i} className={i > 0 ? "mt-8 pt-8 border-t border-[var(--color-border)]" : ""}>
                  <h2 className="text-xl font-display font-bold text-[var(--color-navy)] mb-4">{section.heading}</h2>
                  <div className="text-[var(--color-foreground)] leading-relaxed space-y-4">{section.content}</div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center mb-8">
              <BookOpen className="w-8 h-8 text-[var(--color-cta)] mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl mb-2">Ready to plan your pilot training?</h3>
              <p className="text-white/70 text-sm mb-4">Take the free assessment and get a personalised roadmap, readiness score and matched flight schools.</p>
              <Link href={ctaHref} className="btn-cta text-sm">
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related guides */}
            {relatedGuides.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-[var(--color-navy)] text-lg mb-4">Related guides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedGuides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all no-underline"
                    >
                      <div>
                        <div className="font-display font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-primary)] transition-colors text-sm">
                          {guide.title}
                        </div>
                        <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{guide.time}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] flex-shrink-0" />
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
