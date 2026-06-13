import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
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

// ─── Example lead profile card ────────────────────────────────────────────────
function ExampleLeadCard() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white shadow-lg p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">Example Lead Profile</span>
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
          <Flame className="w-3 h-3" /> Flight Ready
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-muted-foreground)]">AviatorIQ Score</span>
          <span className="font-bold text-[var(--color-navy)]">84 / 100</span>
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
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: <Flame className="w-4 h-4" />,
    description: "Strong candidate. Clear goal, realistic budget, timeline within 12 months. Ready to speak with schools immediately.",
    score: "75–100",
  },
  {
    label: "Development Phase",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    icon: <Star className="w-4 h-4" />,
    description: "Good candidate. Needs finance planning, medical booking, or further research. Likely to convert within 6–18 months.",
    score: "45–74",
  },
  {
    label: "Exploration Phase",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
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
    joinWaitlist.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
          <a href="#apply" className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-colors">
            Apply to Join the Partner Programme <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── What is AviatorIQ ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[var(--color-navy)] mb-4 text-center">What is AviatorIQ?</h2>
          <p className="text-[var(--color-muted-foreground)] text-center max-w-2xl mx-auto mb-10">
            AviatorIQ is a pilot career assessment platform. Aspiring pilots complete a 15-question assessment covering their goal, budget, timeline, medical status, and funding method. The platform scores them across five dimensions, generates a personalised training roadmap, and — crucially — lets them request introductions to matched flight schools.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="text-3xl font-display font-bold text-[var(--color-primary)] mb-2">15+</div>
              <div className="text-sm text-[var(--color-muted-foreground)]">Questions per assessment</div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="text-3xl font-display font-bold text-[var(--color-primary)] mb-2">5</div>
              <div className="text-sm text-[var(--color-muted-foreground)]">Score dimensions per lead</div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="text-3xl font-display font-bold text-[var(--color-primary)] mb-2">100%</div>
              <div className="text-sm text-[var(--color-muted-foreground)]">Explicit consent to be contacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead classifications ── */}
      <section className="py-16 px-4 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[var(--color-navy)] mb-3 text-center">How leads are classified</h2>
          <p className="text-[var(--color-muted-foreground)] text-center mb-10 max-w-xl mx-auto">
            Every candidate receives an AviatorIQ Score and a classification based on their readiness to start training.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {classifications.map((c) => (
              <div key={c.label} className={`rounded-2xl border p-6 ${c.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {c.icon} {c.label}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[var(--color-navy)] mb-1">Score: {c.score}</div>
                <p className="text-sm text-[var(--color-muted-foreground)]">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example lead profile ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-[var(--color-navy)] mb-4">What a lead looks like</h2>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                When a Flight Ready candidate requests an introduction to your school, you receive a structured profile with everything you need to have a meaningful first conversation — no cold calling, no guessing.
              </p>
              <ul className="space-y-2">
                {dataPoints.slice(0, 6).map((dp) => (
                  <li key={dp} className="flex items-start gap-2 text-sm text-[var(--color-foreground)]">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {dp}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-[var(--color-muted-foreground)] italic">
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
      <section className="py-16 px-4 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[var(--color-navy)] mb-3 text-center">Why partner with AviatorIQ?</h2>
          <p className="text-[var(--color-muted-foreground)] text-center mb-10 max-w-xl mx-auto">
            We are not a directory. We are a qualification engine that sits between aspiring pilots and the schools that want to reach them.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-5 rounded-2xl bg-white border border-[var(--color-border)]">
                <div className="shrink-0 mt-0.5">{b.icon}</div>
                <div>
                  <h3 className="font-semibold text-[var(--color-navy)] mb-1">{b.title}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ── */}
      <section id="apply" className="py-20 px-4 bg-[var(--color-navy)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Apply to join the partner programme</h2>
            <p className="text-blue-100">
              We are currently building our partner network ahead of launch. Complete the form below and we will be in touch with partnership details, pricing, and next steps.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl p-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-[var(--color-navy)] mb-2">Application received</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Thank you for your interest. We will review your application and be in touch within 2 business days.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:underline">
                Back to AviatorIQ <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="schoolName" className="text-[var(--color-navy)] font-semibold mb-1.5 block">School / Organisation name *</Label>
                  <Input id="schoolName" {...register("schoolName")} placeholder="e.g. Oxford Aviation Academy" />
                  {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-[var(--color-navy)] font-semibold mb-1.5 block">Country</Label>
                  <Input id="country" {...register("country")} placeholder="e.g. United Kingdom" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="contactName" className="text-[var(--color-navy)] font-semibold mb-1.5 block">Contact name *</Label>
                  <Input id="contactName" {...register("contactName")} placeholder="Your full name" />
                  {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-[var(--color-navy)] font-semibold mb-1.5 block">Email address *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="you@school.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="website" className="text-[var(--color-navy)] font-semibold mb-1.5 block">School website</Label>
                <Input id="website" {...register("website")} placeholder="https://yourschool.com" />
              </div>

              <div>
                <Label htmlFor="coursesOffered" className="text-[var(--color-navy)] font-semibold mb-1.5 block">Courses offered</Label>
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
                  <Label htmlFor="financeAvailable" className="text-sm text-[var(--color-foreground)] cursor-pointer">
                    We offer training finance or payment plans
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="interestedInLeads"
                    checked={interestedInLeads !== false}
                    onCheckedChange={(v) => setValue("interestedInLeads", !!v)}
                  />
                  <Label htmlFor="interestedInLeads" className="text-sm text-[var(--color-foreground)] cursor-pointer">
                    We are interested in receiving pre-qualified lead introductions
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-[var(--color-navy)] font-semibold mb-1.5 block">Anything else you'd like us to know?</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="e.g. specific intake dates, cadet programmes, airline partnerships..."
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

              <p className="text-xs text-[var(--color-muted-foreground)] text-center">
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
