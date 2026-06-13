import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Plane, ChevronDown } from "lucide-react";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/contexts/CurrencyContext";

const navLinks = [
  { label: "Quizzes", href: "/quiz/flight-deck" },
  { label: "Flight Schools", href: "/schools" },
  { label: "Guides", href: "/guides" },
  { label: "Cost Calculator", href: "/calculator" },
  { label: "About", href: "/about" },
];

const FOR_SCHOOLS = { label: "For Schools", href: "/partner" };

// ─── Currency Switcher ────────────────────────────────────────────────────────

function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors border border-[var(--color-border)]"
        aria-label="Change currency"
        aria-expanded={open}
      >
        <span>{currency.flag}</span>
        <span className="font-semibold text-[var(--color-navy)]">{currency.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-[var(--color-border)] shadow-lg z-50 py-1 animate-fade-in">
          <p className="text-xs text-[var(--color-muted-foreground)] px-3 py-2 border-b border-[var(--color-border)]">
            Select currency
          </p>
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                currency.code === c.code
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span className="font-medium">{c.code}</span>
              <span className="text-[var(--color-muted-foreground)] text-xs ml-auto">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Nav ─────────────────────────────────────────────────────────────────

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { currency, setCurrency } = useCurrency();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-border)] shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-[var(--color-navy)] no-underline">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            AviatorIQ
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

          {/* CTA + currency */}
          <div className="hidden md:flex items-center gap-2">
            <CurrencySwitcher />
            <Link
              href={FOR_SCHOOLS.href}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors no-underline"
            >
              For Schools
            </Link>
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
            <Link
              href={FOR_SCHOOLS.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-lg no-underline"
            >
              For Schools
            </Link>

            {/* Mobile currency picker */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs text-[var(--color-muted-foreground)] mb-2 font-medium uppercase tracking-wide">Currency</p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { setCurrency(c.code); setMobileOpen(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      currency.code === c.code
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                        : "border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pt-2 pb-1">
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
