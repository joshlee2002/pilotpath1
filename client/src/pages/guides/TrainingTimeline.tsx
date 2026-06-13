import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read" },
  { title: "Integrated vs Modular", href: "/guides/integrated-vs-modular", time: "6 min read" },
  { title: "Best route to airline", href: "/guides/best-route-to-airline", time: "6 min read" },
  { title: "Pilot training costs", href: "/guides/pilot-training-costs", time: "7 min read" },
];

export default function TrainingTimeline() {
  return (
    <GuideLayout
      title="Pilot Training Timeline Guide"
      subtitle="How long does it take to become a pilot? A realistic timeline for integrated, modular and PPL training routes."
      readTime="5 min read"
      relatedGuides={related}
      ctaText="Get your personalised timeline"
      sections={[
        {
          heading: "How long does it take to become an airline pilot?",
          content: (
            <>
              <p>The time from zero experience to a first officer seat at an airline depends on the route you choose and your individual progress. Here is a realistic overview:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="bg-[var(--color-muted)]">
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Route</th>
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Training duration</th>
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Time to airline job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Integrated ATPL", "18–24 months", "24–36 months total"],
                      ["Modular ATPL", "3–5 years", "4–6 years total"],
                      ["PPL only", "6–18 months", "N/A (not commercial)"],
                    ].map(([route, dur, airline]) => (
                      <tr key={route} className="border border-[var(--color-border)]">
                        <td className="p-3 font-medium">{route}</td>
                        <td className="p-3 text-[var(--color-primary)] font-semibold">{dur}</td>
                        <td className="p-3 text-[var(--color-muted-foreground)]">{airline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          heading: "Integrated ATPL timeline",
          content: (
            <>
              <p>The integrated route is the fastest path to an airline. A typical timeline:</p>
              <div className="space-y-3 mt-2">
                {[
                  { period: "Months 1–6", activity: "ATPL theory ground school (14 subjects). Typically classroom-based or online." },
                  { period: "Months 6–12", activity: "Basic flight training: PPL standard, solo flying, cross-country navigation." },
                  { period: "Months 12–18", activity: "Advanced flight training: instrument rating, multi-engine, commercial operations." },
                  { period: "Months 18–24", activity: "Multi-crew cooperation (MCC), jet orientation course (JOC), skills tests." },
                  { period: "Months 24–30", activity: "Airline applications, type rating, line training." },
                ].map((item) => (
                  <div key={item.period} className="flex gap-4 p-3 rounded-lg bg-[var(--color-muted)]">
                    <div className="w-28 text-xs font-bold text-[var(--color-primary)] flex-shrink-0 pt-0.5">{item.period}</div>
                    <div className="text-sm text-[var(--color-foreground)]">{item.activity}</div>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          heading: "Modular ATPL timeline",
          content: (
            <>
              <p>The modular route is more flexible but takes longer. A typical timeline for a part-time student working full-time:</p>
              <div className="space-y-3 mt-2">
                {[
                  { period: "Year 1", activity: "PPL training (weekends and evenings). ATPL theory study begins." },
                  { period: "Year 2", activity: "Complete ATPL theory exams. Night rating. Continue building hours." },
                  { period: "Year 3", activity: "Instrument rating (IR). Multi-engine rating (MEP). Reduce work hours." },
                  { period: "Year 4", activity: "Commercial pilot licence (CPL). MCC course. JOC." },
                  { period: "Year 5+", activity: "Airline applications, type rating, line training." },
                ].map((item) => (
                  <div key={item.period} className="flex gap-4 p-3 rounded-lg bg-[var(--color-muted)]">
                    <div className="w-28 text-xs font-bold text-[var(--color-primary)] flex-shrink-0 pt-0.5">{item.period}</div>
                    <div className="text-sm text-[var(--color-foreground)]">{item.activity}</div>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          heading: "What can slow down your training?",
          content: (
            <>
              <p>Several factors can extend your training timeline:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Weather:</strong> Poor flying weather can delay flight training, especially in the UK. Schools with bases in sunnier climates (Spain, USA) can offer more consistent progress.</li>
                <li><strong>ATPL exam resits:</strong> Failing and resitting exams adds time and cost. Allow sufficient study time for each subject.</li>
                <li><strong>Aircraft availability:</strong> Popular schools can have waiting lists for aircraft and instructors.</li>
                <li><strong>Personal circumstances:</strong> Illness, financial issues, or life events can interrupt training.</li>
                <li><strong>Currency requirements:</strong> If you take long breaks between modules, you may need to complete refresher training to maintain currency.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Age and timeline considerations",
          content: (
            <>
              <p>There is no upper age limit for starting pilot training, but age does affect your career timeline. A 40-year-old qualifying as a first officer has fewer years to reach captain and maximise earnings compared to a 25-year-old.</p>
              <p>That said, many career changers qualify in their 30s and 40s and build successful airline careers. Airlines value experience, maturity and professionalism — qualities that career changers often bring in abundance.</p>
            </>
          ),
        },
      ]}
    />
  );
}
