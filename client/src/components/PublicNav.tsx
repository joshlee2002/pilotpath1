import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Plane } from "lucide-react";

const navLinks = [
  { label: "Flight Schools", href: "/schools" },
  { label: "Guides", href: "/guides" },
  { label: "Cost Calculator", href: "/calculator" },
  { label: "About", href: "/about" },
];

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-border)] shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-[var(--color-navy)] no-underline">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            PilotPath
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  location === link.href
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/quiz" className="btn-cta text-sm py-2 px-5">
              Take Free Assessment
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] py-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] rounded-lg no-underline"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 pb-1">
              <Link
                href="/quiz"
                onClick={() => setMobileOpen(false)}
                className="btn-cta w-full justify-center text-sm"
              >
                Take Free Assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
