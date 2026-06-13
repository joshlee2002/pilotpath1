import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Plane, ChevronDown, Zap } from "lucide-react";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/contexts/CurrencyContext";
import { useCountry } from "@/contexts/CountryContext";

const announcements = [
  { text: "New guide: BA Speedbird Academy 2026 requirements", href: "/guides/ba-speedbird-academy" },
  { text: "New tool: Medical Condition Lookup — check any condition against Class 1 standards", href: "/tools/medical-condition-lookup" },
  { text: "New guide: Can you become a pilot with ADHD? 2026 CAA rules explained", href: "/guides/adhd-pilot-uk" },
  { text: "New tool: Cadet Eligibility Checker — find which airline programmes you qualify for", href: "/tools/cadet-eligibility" },
  { text: "New guide: Integrated vs Modular ATPL — which is actually cheaper in 2026?", href: "/guides/integrated-vs-modular-cost" },
];

function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const ann = announcements[current];

  return (
    <div
      className="w-full text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2"
      style={{ background: "oklch(0.55 0.20 65)", color: "oklch(0.10 0.05 50)" }}
    >
      <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        style={{ background: "oklch(0.10 0.05 50 / 0.15)" }}>
        NEW
      </span>
      <a href={ann.href} className="hover:underline transition-all" style={{ color: "inherit" }}>
        {ann.text}
      </a>
    </div>
  );
}

const ukNavLinks = [
  { label: "Quizzes", href: "/quizzes" },
  { label: "Flight Schools", href: "/schools" },
  { label: "Guides", href: "/guides" },
  { label: "Pilot Stories", href: "/stories" },
  { label: "Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
];

const usNavLinks = [
  { label: "US Guides", href: "/guides" },
  { label: "Flight Schools", href: "/schools" },
  { label: "Jobs", href: "/jobs" },
  { label: "Stories", href: "/stories" },
  { label: "About", href: "/about" },
];

const ukToolLinks = [
  { label: "Pilot Roadmap Generator", href: "/roadmap", desc: "Get your personalised training roadmap", icon: "🗺️" },
  { label: "Cost Calculator", href: "/calculator", desc: "Estimate your total training cost", icon: "🧮" },
  { label: "Integrated vs Modular", href: "/tools/integrated-vs-modular", desc: "Find the right training route", icon: "⚖️" },
  { label: "Medical Readiness Check", href: "/tools/class-1-medical-check", desc: "Assess your Class 1 eligibility", icon: "🩺" },
  { label: "Medical Condition Lookup", href: "/tools/medical-condition-lookup", desc: "Check any condition against Class 1 standards", icon: "🔍" },
  { label: "Cadet Eligibility Checker", href: "/tools/cadet-eligibility", desc: "Find which cadet programmes you qualify for", icon: "✈️" },
];

const usToolLinks = [
  { label: "US Cost Calculator", href: "/us/calculator", desc: "Part 61 vs 141 costs, checkrides, and FAA exams", icon: "🧮" },
  { label: "FAA Medical Condition Lookup", href: "/us/medical-lookup", desc: "Check conditions against FAA First Class standards", icon: "🔍" },
  { label: "US Cadet Eligibility Checker", href: "/us/cadet-eligibility", desc: "United Aviate, Delta Propel, American, Southwest", icon: "✈️" },
];

const FOR_SCHOOLS = { label: "For Schools", href: "/partner" };

// ─── Currency Switcher ────────────────────────────────────────────────────────
function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        style={{ color: "oklch(0.7 0.04 240)", border: "1px solid oklch(1 0 0 / 0.12)" }}
        aria-label="Change currency"
        aria-expanded={open}
      >
        <span>{currency.flag}</span>
        <span className="font-semibold text-white/80">{currency.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl z-50 py-1 animate-fade-in"
          style={{
            background: "oklch(0.14 0.08 250)",
            border: "1px solid oklch(1 0 0 / 0.12)",
            boxShadow: "0 16px 40px oklch(0 0 0 / 0.5)",
          }}
        >
          <p className="text-xs px-3 py-2 font-medium uppercase tracking-wider" style={{ color: "oklch(0.55 0.04 240)", borderBottom: "1px solid oklch(1 0 0 / 0.08)" }}>
            Select currency
          </p>
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                currency.code === c.code
                  ? "text-[var(--color-primary)]"
                  : "text-white/70 hover:text-white"
              }`}
              style={currency.code === c.code ? { background: "oklch(0.45 0.18 240 / 0.15)" } : {}}
            >
              <span className="text-base">{c.flag}</span>
              <span className="font-medium">{c.code}</span>
              <span className="text-xs ml-auto" style={{ color: "oklch(0.5 0.04 240)" }}>{c.name}</span>
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
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [location, navigate] = useLocation();
  const { currency, setCurrency } = useCurrency();
  const { country, setCountry } = useCountry();
  const [scrolled, setScrolled] = useState(false);

  const isUS = country === "us";
  const navLinks = isUS ? usNavLinks : ukNavLinks;
  const toolLinks = isUS ? usToolLinks : ukToolLinks;
  const homeHref = isUS ? "/us" : "/";
  const ctaHref = isUS ? "/us" : "/quiz";
  const ctaLabel = isUS ? "US Platform" : "Free Assessment";

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    background: scrolled ? "oklch(0.10 0.08 250 / 0.92)" : "oklch(0.10 0.08 250 / 0.75)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid oklch(1 0 0 / 0.08)",
    transition: "background 0.3s ease",
  };

  const isActive = (href: string) => location === href;

  return (
    <>
    <div className="sticky top-0 z-50">
    <AnnouncementBar />
    <nav style={navStyle}>
      <div className="container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={homeHref} className="flex items-center gap-2.5 font-display font-bold text-xl text-white no-underline group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))" }}
            >
              <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span>AviatorIQ</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  toolLinks.some(t => isActive(t.href))
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-72 rounded-xl z-50 py-2 animate-fade-in"
                  style={{
                    background: "oklch(0.12 0.08 250)",
                    border: "1px solid oklch(1 0 0 / 0.12)",
                    boxShadow: "0 20px 60px oklch(0 0 0 / 0.6)",
                  }}
                >
                  <p className="text-xs px-4 py-2 font-semibold uppercase tracking-widest" style={{ color: "oklch(0.45 0.04 240)" }}>
                    {isUS ? "US Decision Tools" : "Decision Tools"}
                  </p>
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition-colors no-underline group/item"
                      style={{ borderRadius: "0" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 0.05)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="text-lg mt-0.5 flex-shrink-0">{t.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-white/90 group-hover/item:text-white transition-colors">{t.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "oklch(0.5 0.04 240)" }}>{t.desc}</div>
                      </div>
                    </Link>
                  ))}
                  {/* Show UK tools link when on US, and vice versa */}
                  <div style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }} className="mt-1 pt-1">
                    <Link
                      href={isUS ? "/tools/medical-condition-lookup" : "/us/calculator"}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs no-underline transition-colors"
                      style={{ color: "oklch(0.5 0.04 240)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.65 0.22 45)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.5 0.04 240)")}
                    >
                      {isUS ? "→ View UK tools" : "→ View US tools"}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: CTA + currency */}
          <div className="hidden md:flex items-center gap-2">
            <CurrencySwitcher />
            {/* Country Switcher */}
            <button
              type="button"
              onClick={() => {
                const next = country === "us" ? "uk" : "us";
                setCountry(next);
                navigate(next === "us" ? "/us" : "/");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/8"
              style={{ color: "oklch(0.75 0.04 240)", border: "1px solid oklch(1 0 0 / 0.12)" }}
              title={country === "us" ? "Switch to UK version" : "Switch to US version"}
            >
              {country === "us" ? "🇺🇸 US" : "🇬🇧 UK"}
            </button>

            <Link
              href={FOR_SCHOOLS.href}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all no-underline"
              style={{ color: "white", border: "1px solid oklch(1 0 0 / 0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              For Schools
            </Link>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold text-white no-underline transition-all"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))",
                boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)",
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden py-3 animate-fade-in"
            style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium rounded-lg no-underline transition-colors"
                style={{ color: isActive(link.href) ? "white" : "oklch(0.7 0.04 240)" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.45 0.04 240)" }}>Tools</p>
            </div>
            {toolLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg no-underline transition-colors"
                style={{ color: "oklch(0.7 0.04 240)" }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Country switcher in mobile */}
            <div className="px-4 py-3" style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
              <button
                type="button"
                onClick={() => {
                  const next = country === "us" ? "uk" : "us";
                  setCountry(next);
                  navigate(next === "us" ? "/us" : "/");
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ border: "1px solid oklch(1 0 0 / 0.15)", color: "oklch(0.75 0.04 240)" }}
              >
                {country === "us" ? "🇬🇧 Switch to UK version" : "🇺🇸 Switch to US version"}
              </button>
            </div>

            <Link
              href={FOR_SCHOOLS.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold rounded-lg no-underline"
              style={{ color: "oklch(0.7 0.04 240)" }}
            >
              For Schools
            </Link>

            {/* Mobile currency picker */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "oklch(0.45 0.04 240)" }}>Currency</p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { setCurrency(c.code); setMobileOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{
                      border: `1px solid ${currency.code === c.code ? "oklch(0.45 0.18 240)" : "oklch(1 0 0 / 0.12)"}`,
                      background: currency.code === c.code ? "oklch(0.45 0.18 240 / 0.15)" : "transparent",
                      color: currency.code === c.code ? "oklch(0.7 0.18 240)" : "oklch(0.7 0.04 240)",
                      fontWeight: currency.code === c.code ? "700" : "500",
                    }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pt-2 pb-1">
              <Link
                href={ctaHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold text-white no-underline"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))" }}
              >
                <Zap className="w-4 h-4" />
                {ctaLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    </div>
    </>
  );
}
