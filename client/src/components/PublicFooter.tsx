import { Link } from "wouter";
import { Plane, ArrowRight, Zap } from "lucide-react";

const guideLinks = [
  { label: "How to Become a Pilot", href: "/guides/how-to-become-a-pilot" },
  { label: "Pilot Training Costs", href: "/guides/pilot-training-costs" },
  { label: "Integrated vs Modular", href: "/guides/integrated-vs-modular" },
  { label: "Class 1 Medical", href: "/guides/class-1-medical" },
  { label: "BA Speedbird Academy", href: "/guides/ba-speedbird-academy" },
  { label: "easyJet Generation Pilot", href: "/guides/easyjet-generation-pilot" },
  { label: "Ryanair Cadet Programme", href: "/guides/ryanair-cadet-programme" },
  { label: "Pilot Aptitude Tests", href: "/guides/pilot-aptitude-test-uk" },
];

const toolLinks = [
  { label: "Pilot Roadmap Generator", href: "/roadmap" },
  { label: "Cost Calculator", href: "/calculator" },
  { label: "Integrated vs Modular Tool", href: "/tools/integrated-vs-modular" },
  { label: "Medical Readiness Check", href: "/tools/class-1-medical-check" },
  { label: "Medical Condition Lookup", href: "/tools/medical-condition-lookup" },
  { label: "Cadet Eligibility Checker", href: "/tools/cadet-eligibility" },
];

const platformLinks = [
  { label: "Flight School Directory", href: "/schools" },
  { label: "Quiz Hub", href: "/quizzes" },
  { label: "Career Readiness Assessment", href: "/quiz" },
  { label: "Real Pilot Stories", href: "/stories" },
  { label: "Pilot Jobs Board", href: "/jobs" },
  { label: "Partner With AviatorIQ", href: "/partner" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function PublicFooter() {
  return (
    <footer style={{ background: "oklch(0.08 0.07 252)", borderTop: "1px solid oklch(1 0 0 / 0.07)" }}>
      <div className="container py-8 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-10 mb-8 md:mb-12">

          {/* Brand — spans 2 cols */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 no-underline group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))" }}
              >
                <Plane className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl text-white">AviatorIQ</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.5 0.04 240)" }}>
              The UK's most personalised pilot training guidance platform. Find your route, understand your costs, and get matched with the right flight school.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white no-underline transition-all"
              style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))", boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.25)" }}
            >
              <Zap className="w-3.5 h-3.5" />
              Free Assessment
            </Link>
          </div>

          {/* Guides */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.04 240)" }}>Pilot Guides</h4>
            <ul className="space-y-2.5">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm no-underline transition-colors" style={{ color: "oklch(0.55 0.04 240)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.55 0.04 240)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.04 240)" }}>Tools</h4>
            <ul className="space-y-2.5 mb-6">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm no-underline transition-colors" style={{ color: "oklch(0.55 0.04 240)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.55 0.04 240)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.04 240)" }}>Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm no-underline transition-colors" style={{ color: "oklch(0.55 0.04 240)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.55 0.04 240)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust signals */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "oklch(0.45 0.04 240)" }}>Why AviatorIQ</h4>
            <div className="space-y-3">
              {[
                { stat: "16+", label: "UK & international schools" },
                { stat: "33+", label: "In-depth training guides" },
                { stat: "Free", label: "Always, no paywall" },
                { stat: "2026", label: "Data up to date" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="font-display font-bold text-sm" style={{ color: "oklch(0.65 0.18 240)" }}>{item.stat}</span>
                  <span className="text-xs" style={{ color: "oklch(0.5 0.04 240)" }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.45 0.04 240)" }}>
                Guidance only — not official career, medical or financial advice. Always verify with a qualified aviation professional.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5" style={{ borderTop: "1px solid oklch(1 0 0 / 0.07)" }}>
          <p className="text-xs" style={{ color: "oklch(0.4 0.04 240)" }}>
            © {new Date().getFullYear()} AviatorIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs no-underline transition-colors" style={{ color: "oklch(0.4 0.04 240)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.65 0.04 240)")}
                onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.4 0.04 240)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
