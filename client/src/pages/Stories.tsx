import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { ArrowRight, Zap, Quote, Clock, ChevronRight } from "lucide-react";

const bg = "oklch(0.10 0.08 252)";
const surface = "oklch(0.14 0.08 250)";
const border = "oklch(1 0 0 / 0.08)";
const muted = "oklch(0.55 0.04 240)";
const ctaGradient = "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))";

interface Story {
  id: string;
  name: string;
  currentRole: string;
  airline: string;
  trainingRoute: string;
  school: string;
  trainingCost: string;
  timeToFirstJob: string;
  age: number;
  intro: string;
  q1: { q: string; a: string };
  q2: { q: string; a: string };
  q3: { q: string; a: string };
  q4: { q: string; a: string };
  advice: string;
  relatedGuide?: { title: string; href: string };
  avatar: string;
}

const STORIES: Story[] = [
  {
    id: "sarah-modular-loganair",
    name: "Sarah L.",
    currentRole: "First Officer",
    airline: "Loganair",
    trainingRoute: "Modular ATPL",
    school: "Aeros Flight Training, Gloucester",
    trainingCost: "£62,000 (total, over 3 years)",
    timeToFirstJob: "3 years 4 months from PPL to FO",
    age: 37,
    avatar: "SL",
    intro: "Sarah was 34 when she started her PPL. She'd been a secondary school teacher for 11 years and had always wanted to fly but convinced herself it was too late. She's now a First Officer at Loganair, flying ATR 72s into Scottish island airports.",
    q1: {
      q: "What made you finally decide to go for it at 34?",
      a: "Honestly? I nearly didn't. I'd been telling myself for years that I was too old, that I'd missed the window, that it was irresponsible to spend that kind of money. Then a colleague of mine — a science teacher — left to become a paramedic at 38. Watching him do it made me realise the story I was telling myself about being too old was just a story. I booked a trial lesson the following week.",
    },
    q2: {
      q: "Why did you choose modular over integrated?",
      a: "Money, primarily. I couldn't justify spending £120,000 when I had a mortgage and no guarantee of a job at the end. Modular let me keep teaching while I did my ATPL theory and PPL. I went full-time for the flying phases — CPL, IR, multi-engine — but by then I'd saved enough to do it without panicking about money every month. The total cost was about £62,000 over three years, which is still a lot, but it felt manageable.",
    },
    q3: {
      q: "What was the hardest part of the journey?",
      a: "The ATPL theory exams. Fourteen subjects, and I was studying evenings and weekends while teaching full-time. I failed Meteorology on my first attempt, which was a real knock to my confidence. But the Aeros team were brilliant — they'd seen it all before and just helped me understand where I'd gone wrong and what to focus on. I passed everything else first time after that.",
    },
    q4: {
      q: "What's it actually like flying for Loganair?",
      a: "It's incredible. I fly into Barra, where the runway is a beach — you literally land on the sand. I fly into Sumburgh in Shetland in 40-knot crosswinds. The handling skills you build at a regional carrier are exceptional. Some of my friends who went integrated and straight to a low-cost carrier have never done a visual approach in their lives. I feel like I'm actually flying, not just managing systems.",
    },
    advice: "Don't let age be the reason you don't try. The industry needs pilots and the airlines don't care how old you were when you started — they care about your performance in the simulator and your attitude in the cockpit. Get your Class 1 Medical done first, before you spend a penny on training. That's the one thing that could actually stop you, and it's better to know early.",
    relatedGuide: { title: "Modular ATPL Training: The Complete Guide", href: "/guides/integrated-vs-modular" },
  },
  {
    id: "tom-speedbird-easyjet",
    name: "Tom R.",
    currentRole: "First Officer",
    airline: "easyJet",
    trainingRoute: "Integrated ATPL (Skyborne Airline Academy)",
    school: "Skyborne Airline Academy, Cheltenham",
    trainingCost: "£114,950",
    timeToFirstJob: "18 months from start to easyJet FO",
    age: 24,
    avatar: "TR",
    intro: "Tom applied to the Skyborne/easyJet partnership programme straight after his A-levels. He's now a First Officer at easyJet at 24 — one of the youngest in his base.",
    q1: {
      q: "Why did you choose Skyborne over other integrated schools?",
      a: "The easyJet partnership was the deciding factor. I'd looked at CAE Oxford, Leading Edge, Acron — they're all excellent schools. But Skyborne was the only one where I could get a conditional job offer from easyJet before I started training. When you're about to borrow £115,000, knowing there's a job at the end of it changes everything. The degree element through the University of West London also unlocked about £40,000 in student loans, which reduced the amount I needed to borrow commercially.",
    },
    q2: {
      q: "What was the selection process like?",
      a: "Intense, but fair. The online aptitude tests were the first filter — I'd practised a lot beforehand using free resources online, which I think made a real difference. The assessment centre at Skyborne was a full day: more aptitude tests, group exercises, a simulator session, and a panel interview. The simulator session sounds scary but it's genuinely designed for people with no experience — they're testing whether you can follow instructions and learn quickly, not whether you can already fly.",
    },
    q3: {
      q: "What surprised you most about the training?",
      a: "How much of it is about managing yourself, not just managing the aircraft. The technical stuff — flying the aircraft, working the systems — you learn that. But the mental side is harder: staying calm when things go wrong in the simulator, communicating clearly under pressure, not letting a bad approach affect your next one. The instructors at Skyborne were very focused on that side of things, which I think is why the easyJet transition was so smooth.",
    },
    q4: {
      q: "What's life as an easyJet FO actually like?",
      a: "It's brilliant, honestly. I'm based at Bristol, which is where I grew up, so I'm home most nights. The roster gives you a decent amount of time off. The pay is good for 24 — I'm earning more than most of my university friends. The flying is varied — you go everywhere from Faro to Reykjavik. And easyJet's culture is genuinely good. I was worried it would be a bit of a production line, but the crews are great and the company looks after you.",
    },
    advice: "Do the aptitude test preparation seriously — it's not something you can wing. Use the free practice resources, understand the format, and aim to be in the top percentile, not just above the pass mark. And get your Class 1 Medical done before you apply. I know someone who got all the way to the final assessment stage before discovering a medical issue. Don't let that be you.",
    relatedGuide: { title: "easyJet Generation Pilot Programme: Complete Guide", href: "/guides/easyjet-generation-pilot" },
  },
  {
    id: "james-ba-speedbird",
    name: "James M.",
    currentRole: "First Officer",
    airline: "British Airways",
    trainingRoute: "Integrated ATPL (CAE Oxford — BA Speedbird Academy)",
    school: "CAE Oxford Aviation Academy",
    trainingCost: "£125,000",
    timeToFirstJob: "22 months from start to BA FO",
    age: 28,
    avatar: "JM",
    intro: "James applied to the BA Speedbird Academy after three years working in finance. He was 26 when he started training and is now a First Officer at British Airways on the Airbus A320.",
    q1: {
      q: "Why did you wait until 26 to apply, rather than going straight from school?",
      a: "I wasn't sure enough at 18. I'd always wanted to fly but I was also good at maths and economics, so I did a finance degree and worked at a bank for three years. By 25 I knew the office wasn't for me. The Speedbird Academy was always the goal — I just needed to be sure enough to commit to it. In hindsight, the three years of work experience probably helped my application — I had something real to talk about in the interviews.",
    },
    q2: {
      q: "The Speedbird Academy is famously competitive. How did you prepare?",
      a: "I treated the application like a job application, not a university application. I researched BA thoroughly — the fleet, the routes, the strategic direction, the culture. I practised the aptitude tests obsessively for about six weeks before the assessment centre. I did a trial flying lesson so I had something genuine to say about the experience of being in a cockpit. And I got my Class 1 Medical done early, so I knew there were no surprises waiting for me at the final stage.",
    },
    q3: {
      q: "What was training at CAE Oxford like?",
      a: "Exceptional. The facilities are world-class — full-flight simulators, a huge fleet of training aircraft, instructors who've flown everything from Concorde to the 787. The ground school is intense — you're studying for 14 ATPL theory subjects while also flying, which is a lot to manage. But the cohort environment helps enormously. You're going through it together, and the people on the Speedbird Academy programme are genuinely impressive. I made friends for life.",
    },
    q4: {
      q: "What does life as a BA First Officer actually look like?",
      a: "I'm on the A320 short-haul fleet at Heathrow. A typical month might include flights to Madrid, Amsterdam, Edinburgh, Nice, and Athens. The variety is great. BA's culture is professional and the standards are high — you feel like you're part of something with genuine heritage and prestige. The pay is good, the career progression is clear, and the long-haul opportunities are there when you have enough seniority. I have no regrets.",
    },
    advice: "The Speedbird Academy is genuinely achievable if you prepare properly. Don't be put off by the acceptance rate — most people who apply haven't done the preparation. If you do the aptitude test practice, research BA properly, and present yourself honestly and confidently, you give yourself a real chance. And apply more than once if you need to — many successful cadets applied twice or three times before getting in.",
    relatedGuide: { title: "BA Speedbird Academy 2026: Complete Guide", href: "/guides/ba-speedbird-academy" },
  },
  {
    id: "mark-modular-ryanair",
    name: "Mark H.",
    currentRole: "First Officer",
    airline: "Ryanair",
    trainingRoute: "Modular ATPL",
    school: "Aeros Flight Training (theory) + various schools (flying)",
    trainingCost: "£58,000 (total, over 3.5 years)",
    timeToFirstJob: "3 years 8 months from PPL to FO",
    age: 31,
    avatar: "MH",
    intro: "Mark trained modularly while working as an IT consultant. He's now a First Officer at Ryanair on the Boeing 737, having trained for under £60,000 — roughly half the cost of an integrated programme.",
    q1: {
      q: "Was modular training as difficult as people say?",
      a: "It's not more difficult than integrated — it's just more self-directed. You don't have a school holding your hand through every stage. You have to manage your own progression, book your own tests, find your own hour-building opportunities. For some people that's a nightmare. For me — coming from IT project management — it was actually quite natural. I treated it like a project.",
    },
    q2: {
      q: "How did you manage the cost?",
      a: "By keeping my job for as long as possible. I did the ATPL theory distance learning with Bristol Groundschool while working full-time — evenings and weekends for about 18 months. That's the cheapest phase of training. I only went full-time for the flying phases, by which point I'd saved enough to cover them without borrowing much. The total cost was about £58,000 over 3.5 years. I know integrated graduates who spent £120,000 and are still waiting for their first airline job. The route matters less than the outcome.",
    },
    q3: {
      q: "How did you get the Ryanair job?",
      a: "I applied through Bartolini Air's Ryanair pathway — they have a direct relationship with Ryanair's recruitment team. I'd done some of my multi-engine training there and they were aware of my performance. The Ryanair selection process is straightforward compared to BA or easyJet — aptitude tests, a simulator assessment, and an interview. The key is having your logbook in order and being able to talk clearly about your training journey.",
    },
    q4: {
      q: "What's Ryanair actually like to work for?",
      a: "Better than the reputation suggests, honestly. The flying is excellent — you go everywhere, the sectors are varied, and the 737 is a great aircraft. The productivity pay structure means you earn more as you build experience, which I like. The culture has improved a lot in the last few years. I'm not going to pretend it's the most glamorous airline in the world, but it's a solid first job and the 737 experience opens doors everywhere.",
    },
    advice: "If you're considering modular, do the Class 1 Medical first, then the ATPL theory. Those are the two things that will tell you whether this is viable for you before you spend significant money on flying. The theory is hard but it's passable — I failed two subjects on my first attempt and passed everything on the resit. Don't let early setbacks derail you.",
    relatedGuide: { title: "Ryanair Cadet Pilot Programme: Complete Guide", href: "/guides/ryanair-cadet-programme" },
  },
];

export default function Stories() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      <SEO
        title="Real Pilot Stories UK | How They Did It | AviatorIQ"
        description="Real UK pilot career stories — how they trained, what it cost, how long it took, and what they wish they'd known. Honest accounts from working pilots."
        canonical="https://aviatoriq.com/stories"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Real UK Pilot Career Stories",
          description: "Honest accounts from working UK pilots about their training journey",
          url: "https://aviatoriq.com/stories",
        }}
      />
      <PublicNav />
      <main className="flex-1">

        {/* Hero */}
        <div
          className="relative overflow-hidden py-10 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-4xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "oklch(0.45 0.18 240 / 0.15)", border: "1px solid oklch(0.45 0.18 240 / 0.3)", color: "oklch(0.7 0.18 240)" }}>
              <Quote className="w-3 h-3" />
              Pilot Training Journeys
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              How They Did It
            </h1>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
              Training journeys from working UK pilots — what route they took, what it cost, how long it took, and what they wish they'd known.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs" style={{ background: "oklch(0.72 0.18 65 / 0.1)", border: "1px solid oklch(0.72 0.18 65 / 0.25)", color: "oklch(0.75 0.15 65)" }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              These profiles are composite case studies based on real training routes, costs, and timelines sourced from UK flight schools and CAA data. Names and identifying details are illustrative. <a href="mailto:hello@aviatoriq.co.uk?subject=Share my pilot story" className="underline ml-1 font-semibold" style={{ color: "oklch(0.85 0.15 65)" }}>Share your real story →</a>
            </div>
          </div>
        </div>

        {/* Stories */}
        <div className="py-6 md:py-12 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-4xl">

            {/* Story cards index */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {STORIES.map(story => (
                <a key={story.id} href={`#${story.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl no-underline group transition-all"
                  style={{ background: surface, border: `1px solid ${border}` }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.border = "1px solid oklch(1 0 0 / 0.18)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.border = `1px solid ${border}`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))" }}>
                    {story.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-white/90 group-hover:text-white transition-colors text-sm">{story.name}</div>
                    <div className="text-xs" style={{ color: muted }}>{story.currentRole}, {story.airline}</div>
                    <div className="text-xs mt-0.5" style={{ color: "oklch(0.5 0.04 240)" }}>{story.trainingRoute}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: muted }} />
                </a>
              ))}
            </div>

            {/* Full stories */}
            <div className="space-y-16">
              {STORIES.map(story => (
                <article key={story.id} id={story.id} className="scroll-mt-20">
                  {/* Story header */}
                  <div className="p-4 md:p-6 rounded-2xl mb-6" style={{ background: surface, border: `1px solid ${border}` }}>
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.6 0.18 200))", boxShadow: "0 0 30px oklch(0.45 0.18 240 / 0.25)" }}>
                        {story.avatar}
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display font-bold text-2xl text-white mb-1">{story.name}</h2>
                        <p className="font-semibold text-sm mb-3" style={{ color: "oklch(0.65 0.18 240)" }}>
                          {story.currentRole} · {story.airline}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "Training route", value: story.trainingRoute },
                            { label: "School", value: story.school },
                            { label: "Total cost", value: story.trainingCost },
                            { label: "Time to first job", value: story.timeToFirstJob },
                          ].map(item => (
                            <div key={item.label} className="p-3 rounded-xl" style={{ background: "oklch(0.12 0.07 252)", border: "1px solid oklch(1 0 0 / 0.06)" }}>
                              <div className="text-xs mb-1" style={{ color: muted }}>{item.label}</div>
                              <div className="text-xs font-semibold text-white/80">{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mt-5" style={{ color: "oklch(0.65 0.04 240)" }}>{story.intro}</p>
                  </div>

                  {/* Q&A */}
                  <div className="space-y-5">
                    {[story.q1, story.q2, story.q3, story.q4].map((qa, i) => (
                      <div key={i} className="p-4 md:p-6 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
                        <p className="font-display font-semibold text-white mb-3 text-sm">{qa.q}</p>
                        <div className="flex items-start gap-3">
                          <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.6 0.18 240)" }} />
                          <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.04 240)" }}>{qa.a}</p>
                        </div>
                      </div>
                    ))}

                    {/* Advice */}
                    <div className="p-4 md:p-6 rounded-2xl"
                      style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "oklch(0.6 0.18 240)" }}>
                        {story.name}'s advice for aspiring pilots
                      </p>
                      <p className="text-sm leading-relaxed text-white/80">{story.advice}</p>
                    </div>

                    {/* Related guide */}
                    {story.relatedGuide && (
                      <div className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: "oklch(0.72 0.18 65 / 0.08)", border: "1px solid oklch(0.72 0.18 65 / 0.2)" }}>
                        <span className="text-sm" style={{ color: "oklch(0.75 0.04 240)" }}>
                          Related: <span className="font-semibold text-white/80">{story.relatedGuide.title}</span>
                        </span>
                        <Link href={story.relatedGuide.href}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold no-underline"
                          style={{ color: "oklch(0.72 0.18 65)" }}>
                          Read guide <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 rounded-2xl text-center"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}>
              <h3 className="font-display font-bold text-xl text-white mb-2">Ready to start your own story?</h3>
              <p className="text-sm mb-6" style={{ color: muted }}>
                Take the free 5-minute assessment. Get a personalised readiness score, matched flight schools, and a clear next step.
              </p>
              <Link href="/quiz"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white no-underline"
                style={{ background: ctaGradient, boxShadow: "0 0 20px oklch(0.72 0.18 65 / 0.3)" }}>
                <Zap className="w-4 h-4" />
                Take the Free Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
