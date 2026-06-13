import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { Briefcase, MapPin, Clock, ArrowRight, Zap, ExternalLink, RefreshCw, ChevronRight } from "lucide-react";

const bg = "oklch(0.10 0.08 252)";
const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";

interface Job {
  id: number;
  title: string;
  airline: string;
  location: string;
  type: "First Officer" | "Captain" | "Cadet" | "Instructor" | "Other";
  hours?: string;
  salary?: string;
  deadline?: string;
  link: string;
  badge?: string;
  description: string;
  posted: string;
}

const JOBS: Job[] = [
  {
    id: 1,
    title: "First Officer — Airbus A320 Family",
    airline: "easyJet",
    location: "UK Bases (Gatwick, Bristol, Luton, Manchester, Edinburgh)",
    type: "First Officer",
    hours: "500+ hours total time",
    salary: "£50,000 – £75,000 (base + allowances)",
    link: "https://careers.easyjet.com/",
    badge: "Active Recruiting",
    description: "easyJet is actively recruiting First Officers across its UK bases for the A319/A320/A321. Candidates must hold a valid EUK ATPL or fATPL, Class 1 Medical, and have the right to work in the UK. MCC/JOC required. easyJet offers a structured career progression path from FO to Captain.",
    posted: "June 2026",
  },
  {
    id: 2,
    title: "First Officer — Boeing 737",
    airline: "Ryanair",
    location: "UK & Ireland Bases",
    type: "First Officer",
    hours: "200+ hours (low-hours programme available)",
    salary: "€45,000 – €65,000 (base + productivity pay)",
    link: "https://www.ryanair.com/gb/en/careers",
    badge: "Low Hours Welcome",
    description: "Ryanair's First Officer programme is one of the most accessible routes into commercial aviation for low-hours graduates. The airline regularly recruits from its cadet partner schools (FTEJerez, Bartolini Air, MATS) and accepts external applications. Productivity pay means earnings increase significantly with experience.",
    posted: "June 2026",
  },
  {
    id: 3,
    title: "Cadet Pilot — Speedbird Academy 2026",
    airline: "British Airways",
    location: "Training: CAE Oxford. Base: Heathrow",
    type: "Cadet",
    hours: "No experience required",
    salary: "Self-funded (£100,000–£130,000 training cost)",
    link: "https://www.britishairways.com/en-gb/information/about-ba/careers/speedbird-academy",
    badge: "Applications Open",
    description: "The British Airways Speedbird Academy is one of the most prestigious cadet programmes in the world. Successful applicants train at CAE Oxford Aviation Academy and are guaranteed a First Officer position with British Airways on completion. Selection is highly competitive — typically 2,000+ applicants for ~20 places per intake.",
    posted: "June 2026",
  },
  {
    id: 4,
    title: "First Officer — Airbus A320",
    airline: "Jet2",
    location: "UK Bases (Leeds, Manchester, Birmingham, Glasgow, Newcastle, East Midlands)",
    type: "First Officer",
    hours: "500+ hours total time",
    salary: "£52,000 – £72,000",
    link: "https://www.jet2.com/careers",
    badge: "Active Recruiting",
    description: "Jet2 is one of the UK's fastest-growing airlines and consistently ranks as one of the best places to work in UK aviation. The airline operates a modern A320 family fleet and offers a clear Captain upgrade path. Known for a positive working culture and strong employee benefits.",
    posted: "June 2026",
  },
  {
    id: 5,
    title: "Cadet Pilot — Generation easyJet MPL",
    airline: "easyJet / CAE Oxford",
    location: "Training: CAE Oxford. Base: Multiple UK",
    type: "Cadet",
    hours: "No experience required",
    salary: "Self-funded (£99,900 training cost)",
    link: "https://www.cae.com/civil-aviation/become-a-pilot/generation-easyjet/",
    badge: "MPL Programme",
    description: "The Generation easyJet Multi-Crew Pilot Licence (MPL) programme is a direct pathway from zero hours to easyJet First Officer. Training is conducted at CAE Oxford Aviation Academy. The MPL licence is type-specific, meaning you train on the A320 simulator from an early stage. Guaranteed job offer on successful completion.",
    posted: "June 2026",
  },
  {
    id: 6,
    title: "First Officer — Boeing 737 MAX",
    airline: "TUI Airways",
    location: "UK Bases (Gatwick, Manchester, Birmingham, Bristol)",
    type: "First Officer",
    hours: "500+ hours",
    salary: "£50,000 – £70,000",
    link: "https://careers.tui.co.uk/",
    badge: "Active Recruiting",
    description: "TUI Airways operates a modern Boeing 737 MAX fleet on leisure routes across Europe, the Caribbean, and beyond. As a TUI FO you'll fly to some of the world's most desirable destinations. The airline has an MPL cadet programme and also recruits experienced FOs directly.",
    posted: "June 2026",
  },
  {
    id: 7,
    title: "First Officer — ATR 72 / Saab 340",
    airline: "Loganair",
    location: "Scotland & UK Regional Bases",
    type: "First Officer",
    hours: "200+ hours (low-hours considered)",
    salary: "£35,000 – £50,000",
    link: "https://www.loganair.co.uk/about-loganair/careers/",
    badge: "Regional Aviation",
    description: "Loganair is the UK's largest regional airline and an excellent first job for low-hours graduates. Flying into remote Scottish islands and UK regional airports, the role builds exceptional handling skills and decision-making experience. Many Loganair FOs progress to major carriers within 3–5 years.",
    posted: "June 2026",
  },
  {
    id: 8,
    title: "Flight Instructor — PPL / IR",
    airline: "Skyborne Airline Academy",
    location: "Cheltenham / Bournemouth",
    type: "Instructor",
    hours: "CPL/IR required, FI rating preferred",
    salary: "£28,000 – £40,000 + benefits",
    link: "https://www.skyborne.com/careers",
    badge: "Instructor Role",
    description: "Skyborne is expanding its instructor team at both its Gloucestershire and Bournemouth campuses. Flight Instructor roles are an excellent way to build hours and experience while earning. Skyborne offers a structured pathway for instructors who want to progress into airline careers.",
    posted: "June 2026",
  },
  {
    id: 9,
    title: "First Officer — Airbus A320",
    airline: "Wizz Air",
    location: "UK & European Bases",
    type: "First Officer",
    hours: "500+ hours",
    salary: "€42,000 – €62,000",
    link: "https://careers.wizzair.com/",
    description: "Wizz Air is one of Europe's fastest-growing low-cost carriers and actively recruits UK-based pilots. The airline operates an all-Airbus A320 family fleet and has a Pilot Academy cadet programme for zero-hours applicants. Strong productivity pay structure.",
    posted: "June 2026",
  },
  {
    id: 10,
    title: "Captain — Airbus A320",
    airline: "easyJet",
    location: "UK Bases",
    type: "Captain",
    hours: "3,000+ hours, 1,000+ A320 family",
    salary: "£90,000 – £120,000",
    link: "https://careers.easyjet.com/",
    description: "easyJet promotes from within and also accepts external Captain applications. Candidates must hold an unrestricted ATPL, significant A320 family experience, and strong CRM skills. easyJet Captains benefit from one of the best pay and lifestyle packages in UK short-haul aviation.",
    posted: "June 2026",
  },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  "First Officer": { bg: "oklch(0.45 0.18 240 / 0.15)", text: "oklch(0.7 0.18 240)", border: "oklch(0.45 0.18 240 / 0.3)" },
  "Captain": { bg: "oklch(0.72 0.18 65 / 0.15)", text: "oklch(0.85 0.15 65)", border: "oklch(0.72 0.18 65 / 0.3)" },
  "Cadet": { bg: "oklch(0.55 0.18 145 / 0.15)", text: "oklch(0.7 0.18 145)", border: "oklch(0.55 0.18 145 / 0.3)" },
  "Instructor": { bg: "oklch(0.6 0.18 200 / 0.15)", text: "oklch(0.75 0.15 200)", border: "oklch(0.6 0.18 200 / 0.3)" },
  "Other": { bg: "oklch(0.5 0.04 240 / 0.15)", text: "oklch(0.65 0.04 240)", border: "oklch(0.5 0.04 240 / 0.3)" },
};

const jobSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "UK Airline Pilot Jobs 2026",
  description: "Current UK airline pilot vacancies — First Officer, Captain, Cadet, and Instructor roles",
  url: "https://aviatoriq.com/jobs",
};

export default function Jobs() {
  const foRoles = JOBS.filter(j => j.type === "First Officer");
  const cadetRoles = JOBS.filter(j => j.type === "Cadet");
  const captainRoles = JOBS.filter(j => j.type === "Captain");
  const instructorRoles = JOBS.filter(j => j.type === "Instructor");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      <SEO
        title="Pilot Jobs UK 2026 | Airline & Aviation Vacancies | AviatorIQ"
        description="Current UK airline pilot jobs — First Officer, Captain, Cadet, and Instructor vacancies at easyJet, Ryanair, British Airways, Jet2, TUI, and more. Updated June 2026."
        canonical="https://aviatoriq.com/jobs"
        schema={jobSchema}
      />
      <PublicNav />
      <main className="flex-1">

        {/* Hero */}
        <div
          className="relative overflow-hidden py-10 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/images/airline-fleet.jpg')", backgroundSize: "cover", backgroundPosition: "center 50%", opacity: 0.09 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-4xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "oklch(0.45 0.18 240 / 0.15)", border: "1px solid oklch(0.45 0.18 240 / 0.3)", color: "oklch(0.7 0.18 240)" }}>
              <Briefcase className="w-3 h-3" />
              Pilot Jobs Board
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              UK Pilot Jobs 2026
            </h1>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
              Current vacancies at UK airlines — First Officer, Captain, Cadet, and Instructor roles. Updated monthly.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: muted }}>
                <RefreshCw className="w-4 h-4" />
                Last updated: June 2026
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: muted }}>
                <Briefcase className="w-4 h-4" />
                {JOBS.length} active listings
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="py-6 md:py-12 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-4xl">

            {/* Notice */}
            <div className="p-4 rounded-xl mb-8 flex items-start gap-3"
              style={{ background: "oklch(0.45 0.18 240 / 0.08)", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "oklch(0.45 0.18 240 / 0.2)", color: "oklch(0.7 0.18 240)" }}>
                <span className="text-xs font-bold">i</span>
              </div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.04 240)" }}>
                These listings are curated from official airline careers pages and verified as active in June 2026. Always apply directly through the airline's official website. AviatorIQ is not a recruitment agency and does not charge fees.
              </p>
            </div>

            {/* Not yet trained? CTA */}
            <div className="p-6 rounded-2xl mb-10 flex flex-col sm:flex-row items-center gap-5"
              style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white mb-1">Still in training or just starting out?</h3>
                <p className="text-sm" style={{ color: muted }}>Take the free assessment to get a personalised roadmap, matched flight schools, and a realistic timeline to your first FO role.</p>
              </div>
              <Link href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline whitespace-nowrap flex-shrink-0"
                style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.25)" }}>
                <Zap className="w-4 h-4" />
                Free Assessment
              </Link>
            </div>

            {/* Cadet roles */}
            {cadetRoles.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-xl text-white mb-1">Cadet Programmes</h2>
                <p className="text-sm mb-5" style={{ color: muted }}>Zero-hours pathways with guaranteed airline positions on completion.</p>
                <div className="space-y-4">
                  {cadetRoles.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </section>
            )}

            {/* FO roles */}
            {foRoles.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-xl text-white mb-1">First Officer Vacancies</h2>
                <p className="text-sm mb-5" style={{ color: muted }}>Direct-entry FO roles at UK and European airlines.</p>
                <div className="space-y-4">
                  {foRoles.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </section>
            )}

            {/* Captain roles */}
            {captainRoles.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-xl text-white mb-1">Captain Vacancies</h2>
                <p className="text-sm mb-5" style={{ color: muted }}>Command upgrade and direct-entry Captain positions.</p>
                <div className="space-y-4">
                  {captainRoles.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </section>
            )}

            {/* Instructor roles */}
            {instructorRoles.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-xl text-white mb-1">Instructor & Other Roles</h2>
                <p className="text-sm mb-5" style={{ color: muted }}>Flight instructor and aviation support roles — great for building hours.</p>
                <div className="space-y-4">
                  {instructorRoles.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </section>
            )}

            {/* More resources */}
            <div className="p-6 rounded-2xl mb-6" style={{ background: surface, border: `1px solid ${border}` }}>
              <h3 className="font-display font-bold text-white mb-4">Useful resources for job applications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Airline Interview Guide", href: "/guides/airline-pilot-interview", desc: "How to prepare for airline pilot assessments" },
                  { title: "Pilot Salary UK 2026", href: "/guides/uk-pilot-salary-2026", desc: "What to expect at each career stage" },
                  { title: "Type Rating Guide", href: "/guides/pilot-type-rating-uk", desc: "How type ratings work and what they cost" },
                  { title: "Hour Building Guide", href: "/guides/hour-building-pilot-uk", desc: "How to build hours efficiently after training" },
                ].map(link => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center justify-between p-4 rounded-xl no-underline group transition-all"
                    style={{ background: "oklch(0.12 0.07 252)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.14)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.06)"}>
                    <div>
                      <div className="font-semibold text-white/80 group-hover:text-white transition-colors text-sm">{link.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: muted }}>{link.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: muted }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* External job boards */}
            <div className="p-6 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
              <h3 className="font-display font-bold text-white mb-2">More pilot job boards</h3>
              <p className="text-sm mb-4" style={{ color: muted }}>For a wider range of vacancies, these specialist aviation job boards are worth bookmarking.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Aviation Job Search", url: "https://www.aviationjobsearch.com", desc: "UK's largest aviation job board" },
                  { name: "BALPA Job Board", url: "https://www.balpa.org/jobs", desc: "British Airline Pilots' Association" },
                  { name: "Pilot Career Centre", url: "https://www.pilotcareercentre.com", desc: "European pilot vacancies" },
                ].map(board => (
                  <a key={board.url} href={board.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 rounded-xl no-underline group transition-all"
                    style={{ background: "oklch(0.12 0.07 252)", border: "1px solid oklch(1 0 0 / 0.06)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.14)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.06)"}>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.6 0.18 240)" }} />
                    <div>
                      <div className="font-semibold text-white/80 group-hover:text-white transition-colors text-sm">{board.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: muted }}>{board.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const colors = typeColors[job.type] || typeColors["Other"];
  return (
    <div className="p-4 md:p-6 rounded-2xl transition-all duration-200"
      style={{ background: "oklch(0.14 0.08 250)", border: "1px solid oklch(1 0 0 / 0.08)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.16)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-white">{job.title}</h3>
            {job.badge && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "oklch(0.72 0.18 65 / 0.15)", color: "oklch(0.85 0.15 65)", border: "1px solid oklch(0.72 0.18 65 / 0.3)" }}>
                {job.badge}
              </span>
            )}
          </div>
          <p className="font-semibold text-sm" style={{ color: "oklch(0.65 0.18 240)" }}>{job.airline}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: muted }}>
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </div>
        {job.hours && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: muted }}>
            <Clock className="w-3.5 h-3.5" />
            {job.hours}
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.18 145)" }}>
            {job.salary}
          </div>
        )}
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.65 0.04 240)" }}>{job.description}</p>

      <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid oklch(1 0 0 / 0.07)" }}>
        <span className="text-xs" style={{ color: muted }}>Posted: {job.posted}</span>
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-colors"
          style={{ color: "oklch(0.65 0.18 240)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "oklch(0.8 0.18 240)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.18 240)"}
        >
          Apply on official site
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
