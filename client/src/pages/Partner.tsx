import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle2,
  Users,
  BarChart3,
  Flame,
  Star,
  Globe,
  ArrowRight,
  Building2,
  TrendingUp,
  Shield,
  Zap,
  Check,
  Mail,
} from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  country: z.string().optional(),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email required"),
  website: z.string().optional(),
  coursesOffered: z.string().optional(),
  financeAvailable: z.boolean().optional(),
  interestedInLeads: z.boolean().optional(),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

// ─── Pricing tiers ────────────────────────────────────────────────────────────
const tiers = [
  {
    name: "Basic Listing",
    price: "£149",
    period: "/month",
    description: "Get discovered by aspiring pilots searching for UK flight schools.",
    highlight: false,
    badge: null,
    features: [
      "Standard listing in the flight school directory",
      "School profile: name, location, courses, website",
      "Matched to relevant candidates by route & country",
      "AviatorIQ badge for your website",
      "Monthly performance report (impressions, clicks)",
    ],
    notIncluded: [
      "Lead introductions",
      "Featured placement",
      "Lead notifications",
    ],
    cta: "Apply for Basic",
  },
  {
    name: "Featured",
    price: "£349",
    period: "/month",
    description: "Stand out in the directory and receive introduction requests from matched candidates.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Basic",
      "Featured placement — top of matched results",
      "Receive lead introduction requests",
      "Full lead profile on each introduction (score, budget, goal, timeline)",
      "Explicit consent confirmed on every lead",
      "Monthly lead summary report",
    ],
    notIncluded: [
      "Real-time lead notifications",
    ],
    cta: "Apply for Featured",
  },
  {
    name: "Premium",
    price: "£699",
    period: "/month",
    description: "Maximum visibility and instant notification on every Flight Ready lead that matches your school.",
    highlight: false,
    badge: "Best for Growth",
    features: [
      "Everything in Featured",
      "Real-time email notification on every new Flight Ready lead",
      "Priority placement above all other schools",
      "Dedicated account review call (quarterly)",
      "Co-branded content opportunity (guide feature, case study)",
      "Early access to new AviatorIQ tools and data",
    ],
    notIncluded: [],
    cta: "Apply for Premium",
  },
];

// ─── Example lead profile card ────────────────────────────────────────────────
function ExampleLeadCard() {
  return (
    <div className="rounded-2xl border border-white/10 shadow-lg p-6 max-w-sm mx-auto" style={{ background: 'oklch(0.14 0.08 252)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">Example Lead Profile</span>
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
          <Flame className="w-3 h-3" /> Flight Ready
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">AviatorIQ Score</span>
          <span className="font-bold text-white">84 / 100</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Goal</span>
          <span className="font-semibold">Airline Pilot (ATPL)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Country</span>
          <span className="font-semibold">United Kingdom</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Budget</span>
          <span className="font-semibold">£50,000–£100,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Timeline</span>
          <span className="font-semibold">Within 12 months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Funding</span>
          <span className="font-semibold">Self-funded + loan</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Medical</span>
          <span className="font-semibold">Class 1 planned</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Preferred route</span>
          <span className="font-semibold">Integrated ATPL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">Contact method</span>
          <span className="font-semibold">Email &amp; Phone</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-muted-foreground)] italic">
          This candidate has requested an introduction to 2 UK flight schools.
        </p>
      </div>
    </div>
  );
}

// ─── What Flight Ready means ──────────────────────────────────────────────────
const classifications = [
  {
    label: "Flight Ready",
    color: "border-red-500/30",
    badge: "bg-red-500/20 text-red-300",
    icon: <Flame className="w-4 h-4" />,
    description: "Strong candidate. Clear goal, realistic budget, timeline within 12 months. Ready to speak with schools immediately.",
    score: "75–100",
  },
  {
    label: "Development Phase",
    color: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    icon: <Star className="w-4 h-4" />,
    description: "Good candidate. Needs finance planning, medical booking, or further research. Likely to convert within 6–18 months.",
    score: "45–74",
  },
  {
    label: "Exploration Phase",
    color: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    icon: <Globe className="w-4 h-4" />,
    description: "Early-stage researcher. Interested but not yet committed. Valuable for nurturing and brand awareness.",
    score: "0–44",
  },
];

// ─── Data points collected ────────────────────────────────────────────────────
const dataPoints = [
  "Full name, email, phone, country, city",
  "Pilot goal (airline, corporate, PPL, instructor)",
  "Preferred training route (Integrated / Modular / PPL)",
  "Budget range and funding method",
  "Start timeframe (ASAP / 12 months / 1–3 years)",
  "Class 1 Medical status",
  "Flying experience",
  "Right to work / study in chosen country",
  "Preferred contact method (Email / Phone / WhatsApp)",
  "Consent to be contacted by schools, finance providers, medicals",
  "AviatorIQ Score across 5 dimensions",
  "AI-generated readiness summary",
];

// ─── Benefits ─────────────────────────────────────────────────────────────────
const benefits = [
  {
    icon: <Users className="w-5 h-5 text-[var(--color-primary)]" />,
    title: "Pre-qualified leads only",
    body: "Every lead has completed a 15-question assessment. You receive candidates who have already declared their goal, budget, and timeline — not cold enquiries.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />,
    title: "Scored and classified",
    body: "Each lead carries an AviatorIQ Score (0–100) and a classification: Flight Ready, Development Phase, or Exploration Phase. Filter by what matters to you.",
  },
  {
    icon: <Shield className="w-5 h-5 text-[var(--color-primary)]" />,
    title: "Explicit consent",
    body: "Every candidate has consented to be contacted by flight schools. No cold outreach, no GDPR headaches.",
  },
  {
    icon: <Zap className="w-5 h-5 text-[var(--color-primary)]" />,
    title: "Introduction-first model",
    body: "Candidates request introductions to specific schools. You only receive leads who have actively chosen to hear from you.",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />,
    title: "Market intelligence",
    body: "As a partner, you gain access to aggregated data: average budgets, most common goals, country distribution, and funding method trends across all assessments.",
  },
  {
    icon: <Building2 className="w-5 h-5 text-[var(--color-primary)]" />,
    title: "Directory listing",
    body: "Your school appears in the AviatorIQ flight school directory, matched to candidates based on country, training type, and finance availability.",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function Partner() {
  useEffect(() => {
    document.title = "Partner With AviatorIQ – Flight School Directory";
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const joinWaitlist = trpc.partner.joinWaitlist.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application received — we'll be in touch shortly.");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { financeAvailable: false, interestedInLeads: true },
  });

  const financeAvailable = watch("financeAvailable");
  const interestedInLeads = watch("interestedInLeads");

  const onSubmit = (data: FormData) => {
    const notesWithTier = selectedTier
      ? `Interested tier: ${selectedTier}${data.notes ? `\n\n${data.notes}` : ""}`
      : data.notes;
    joinWaitlist.mutate({ ...data, notes: notesWithTier });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.08 252)' }}>
      <SEO
        title="Partner With AviatorIQ | Flight School Lead Generation"
        description="Join the AviatorIQ partner programme. Receive pre-qualified, scored aspiring pilots who have actively requested an introduction to your flight school. Three tiers from £149/month."
        canonical="/partner"
      />
      <PublicNav />

      {/* ── Hero ── */}
      <section className="bg-[var(--color-navy)] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            For Flight Schools &amp; Training Providers
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Partner With AviatorIQ
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Receive pre-qualified, scored aspiring pilots who have actively requested an introduction to your school — not cold enquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#pricing" className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-colors">
              View Pricing <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#apply" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-colors border border-white/20">
              Apply Now
            </a>
          </div>
        </div>
      </section>

      {/* ── What is AviatorIQ ── */}
      <section className="py-16 px-4" style={{ background: 'oklch(0.12 0.09 252)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-4 text-center">What is AviatorIQ?</h2>
          <p className="text-white/60 text-center max-w-2xl mx-auto mb-10">
            AviatorIQ is a pilot career assessment platform. Aspiring pilots complete a 15-question assessment covering their goal, budget, timeline, medical status, and funding method. The platform scores them across five dimensions, generates a personalised training roadmap, and — crucially — lets them request introductions to matched flight schools.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'oklch(0.14 0.08 252)' }}>
              <div className="text-3xl font-display font-bold text-[var(--color-primary)] mb-2">15+</div>
              <div className="text-sm text-white/50">Questions per assessment</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'oklch(0.14 0.08 252)' }}>
              <div className="text-3xl font-display font-bold text-[var(--color-primary)] mb-2">5</div>
              <div className="text-sm text-white/50">Score dimensions per lead</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'oklch(0.14 0.08 252)' }}>
              <div className="text-3xl font-display font-bold text-[var(--color-primary)] mb-2">100%</div>
              <div className="text-sm text-white/50">Explicit consent to be contacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead classifications ── */}
      <section className="py-16 px-4" style={{ background: 'oklch(0.10 0.08 252)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-3 text-center">How leads are classified</h2>
          <p className="text-white/60 text-center mb-10 max-w-xl mx-auto">
            Every candidate receives an AviatorIQ Score and a classification based on their readiness to start training.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {classifications.map((c) => (
              <div key={c.label} className={`rounded-2xl border p-6 ${c.color}`} style={{ background: 'oklch(0.13 0.09 252)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {c.icon} {c.label}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white mb-1">Score: {c.score}</div>
                <p className="text-sm text-white/60">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example lead profile ── */}
      <section className="py-16 px-4" style={{ background: 'oklch(0.12 0.09 252)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">What a lead looks like</h2>
              <p className="text-white/60 mb-6">
                When a Flight Ready candidate requests an introduction to your school, you receive a structured profile with everything you need to have a meaningful first conversation — no cold calling, no guessing.
              </p>
              <ul className="space-y-2">
                {dataPoints.slice(0, 6).map((dp) => (
                  <li key={dp} className="flex items-start gap-2 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {dp}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-white/50 italic">
                  <CheckCircle2 className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                  + {dataPoints.length - 6} more data points
                </li>
              </ul>
            </div>
            <ExampleLeadCard />
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-16 px-4" style={{ background: 'oklch(0.10 0.08 252)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-3 text-center">Why partner with AviatorIQ?</h2>
          <p className="text-white/60 text-center mb-10 max-w-xl mx-auto">
            We are not a directory. We are a qualification engine that sits between aspiring pilots and the schools that want to reach them.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-5 rounded-2xl border border-white/10" style={{ background: 'oklch(0.13 0.09 252)' }}>
                <div className="shrink-0 mt-0.5">{b.icon}</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{b.title}</h3>
                  <p className="text-sm text-white/60">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-4" style={{ background: 'oklch(0.12 0.09 252)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Partner pricing</h2>
            <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
              All plans are billed monthly with no long-term contract. Cancel at any time. Prices exclude VAT.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-7 flex flex-col transition-shadow ${
                  tier.highlight
                    ? "border-[var(--color-primary)] shadow-xl ring-2 ring-[var(--color-primary)]/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              style={{ background: tier.highlight ? 'oklch(0.15 0.10 252)' : 'oklch(0.13 0.09 252)' }}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                    tier.highlight ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-navy)] text-white"
                  }`}>
                    {tier.badge}
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-display font-bold text-lg text-white mb-1">{tier.name}</h3>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-3xl font-display font-bold text-white">{tier.price}</span>
                    <span className="text-sm text-white/50 mb-1">{tier.period}</span>
                  </div>
                  <p className="text-sm text-white/60">{tier.description}</p>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {tier.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/30 line-through">
                      <span className="w-4 h-4 mt-0.5 shrink-0 text-center text-xs leading-4">✕</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#apply"
                  onClick={() => setSelectedTier(tier.name)}
                  className={`w-full text-center py-3 px-5 rounded-xl font-bold text-sm transition-colors ${
                    tier.highlight
                  ? "bg-[var(--color-primary)] hover:bg-orange-600 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/40 mt-6">
            Not sure which tier is right for you? <a href="mailto:hello@aviatoriq.co.uk" className="text-[var(--color-primary)] hover:underline">Email us</a> and we will help you decide.
          </p>
        </div>
      </section>

      {/* ── Application form ── */}
      <section id="apply" className="py-20 px-4 bg-[var(--color-navy)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Apply to join the partner programme</h2>
            <p className="text-blue-100">
              Complete the form below and we will be in touch with onboarding details and next steps — usually within 2 business days.
            </p>
            {selectedTier && (
              <div className="mt-4 inline-flex items-center gap-2 bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-white text-sm px-4 py-2 rounded-full">
                <Check className="w-4 h-4 text-[var(--color-primary)]" />
                Applying for: <strong>{selectedTier}</strong>
                <button onClick={() => setSelectedTier(null)} className="ml-1 text-white/60 hover:text-white text-xs">✕</button>
              </div>
            )}
          </div>

          {submitted ? (
            <div className="rounded-2xl p-10 text-center border border-white/10" style={{ background: 'oklch(0.14 0.08 252)' }}>
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-white mb-2">Application received</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Thank you for your interest in partnering with AviatorIQ. We will review your application and be in touch within 2 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:underline">
                  Back to AviatorIQ <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="mailto:hello@aviatoriq.co.uk" className="inline-flex items-center gap-2 text-[var(--color-muted-foreground)] font-semibold hover:underline text-sm">
                  <Mail className="w-4 h-4" /> hello@aviatoriq.co.uk
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl p-8 space-y-5 border border-white/10" style={{ background: 'oklch(0.14 0.08 252)' }}>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="schoolName" className="text-white/80 font-semibold mb-1.5 block">School / Organisation name *</Label>
                  <Input id="schoolName" {...register("schoolName")} placeholder="e.g. Oxford Aviation Academy" />
                  {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-white/80 font-semibold mb-1.5 block">Country</Label>
                  <Input id="country" {...register("country")} placeholder="e.g. United Kingdom" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="contactName" className="text-white/80 font-semibold mb-1.5 block">Contact name *</Label>
                  <Input id="contactName" {...register("contactName")} placeholder="Your full name" />
                  {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-white/80 font-semibold mb-1.5 block">Email address *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="you@school.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="website" className="text-white/80 font-semibold mb-1.5 block">School website</Label>
                <Input id="website" {...register("website")} placeholder="https://yourschool.com" />
              </div>

              <div>
                <Label htmlFor="coursesOffered" className="text-white/80 font-semibold mb-1.5 block">Courses offered</Label>
                <Textarea
                  id="coursesOffered"
                  {...register("coursesOffered")}
                  placeholder="e.g. Integrated ATPL, Modular ATPL, PPL, IR, CPL..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="financeAvailable"
                    checked={!!financeAvailable}
                    onCheckedChange={(v) => setValue("financeAvailable", !!v)}
                  />
                  <Label htmlFor="financeAvailable" className="text-sm text-white/70 cursor-pointer">
                    We offer training finance or payment plans
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="interestedInLeads"
                    checked={interestedInLeads !== false}
                    onCheckedChange={(v) => setValue("interestedInLeads", !!v)}
                  />
                  <Label htmlFor="interestedInLeads" className="text-sm text-white/70 cursor-pointer">
                    We are interested in receiving pre-qualified lead introductions
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-white/80 font-semibold mb-1.5 block">
                  Anything else you'd like us to know?
                  {selectedTier && (
                    <span className="ml-2 text-xs font-normal text-white/40">(Tier: {selectedTier} pre-selected)</span>
                  )}
                </Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="e.g. specific intake dates, cadet programmes, airline partnerships, preferred tier..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || joinWaitlist.isPending}
                className="w-full bg-[var(--color-primary)] hover:bg-orange-600 text-white font-bold py-3 text-base"
              >
                {joinWaitlist.isPending ? "Submitting..." : "Submit Partner Application"}
              </Button>

              <p className="text-xs text-white/40 text-center">
                By submitting this form you agree to be contacted by the AviatorIQ team regarding partnership opportunities. We do not share your details with third parties.
              </p>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
