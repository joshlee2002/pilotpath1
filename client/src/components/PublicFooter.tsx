import { Link } from "wouter";
import { Plane } from "lucide-react";

const guideLinks = [
  { label: "How to Become a Pilot", href: "/guides/how-to-become-a-pilot" },
  { label: "Pilot Training Costs", href: "/guides/pilot-training-costs" },
  { label: "Integrated vs Modular", href: "/guides/integrated-vs-modular" },
  { label: "Class 1 Medical", href: "/guides/class-1-medical" },
  { label: "Airline Pilot Salary", href: "/guides/airline-pilot-salary" },
  { label: "Best Route to Airline", href: "/guides/best-route-to-airline" },
  { label: "Finance Guide", href: "/guides/finance-guide" },
  { label: "Training Timeline", href: "/guides/training-timeline" },
];

const platformLinks = [
  { label: "Flight School Directory", href: "/schools" },
  { label: "Cost Calculator", href: "/calculator" },
  { label: "How Close Are You To The Flight Deck?", href: "/quiz/flight-deck" },
  { label: "Which Licence Is Right For You?", href: "/quiz/licence" },
  { label: "Career Readiness Assessment", href: "/quiz" },
  { label: "Partner With AviatorIQ", href: "/partner" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-[var(--color-navy)] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl">AviatorIQ</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Find your best route into pilot training. Personalised guidance for aspiring pilots.
            </p>
          </div>

          {/* Guides */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/50 mb-4">Pilot Guides</h4>
            <ul className="space-y-2">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/50 mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/50 mb-4">Get Started</h4>
            <p className="text-sm text-white/70 mb-4">Take the free pilot career assessment and get your personalised roadmap.</p>
            <Link href="/quiz" className="btn-cta text-sm">
              Free Assessment →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} AviatorIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-white/50 hover:text-white/80 transition-colors no-underline">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/60">
            Guidance only — not official career, medical or financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
