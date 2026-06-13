import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read" },
  { title: "Finance guide", href: "/guides/finance-guide", time: "6 min read" },
  { title: "Integrated vs Modular", href: "/guides/integrated-vs-modular", time: "6 min read" },
  { title: "Training timeline", href: "/guides/training-timeline", time: "5 min read" },
];

export default function PilotTrainingCosts() {
  return (
    <GuideLayout
      title="Pilot Training Cost Guide"
      subtitle="A detailed breakdown of what pilot training costs in the UK, Europe and USA — including hidden costs most guides miss."
      readTime="7 min read"
      relatedGuides={related}
      ctaText="Get a personalised cost estimate"
      sections={[
        {
          heading: "How much does it cost to become a pilot?",
          content: (
            <>
              <p>Pilot training is a significant investment. The total cost depends on your chosen route, country, school and individual progress. Here is a realistic overview of what to expect:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="bg-[var(--color-muted)]">
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Route</th>
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Typical cost (UK)</th>
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Integrated ATPL", "£80,000 – £120,000", "18–24 months"],
                      ["Modular ATPL", "£40,000 – £80,000", "3–5 years"],
                      ["PPL only", "£8,000 – £15,000", "6–18 months"],
                      ["PPL + IR + CPL (modular)", "£35,000 – £65,000", "2–4 years"],
                    ].map(([route, cost, dur]) => (
                      <tr key={route} className="border border-[var(--color-border)]">
                        <td className="p-3 font-medium">{route}</td>
                        <td className="p-3 text-[var(--color-primary)] font-semibold">{cost}</td>
                        <td className="p-3 text-[var(--color-muted-foreground)]">{dur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          heading: "What is included in integrated ATPL fees?",
          content: (
            <>
              <p>Most integrated ATPL programmes quote an all-inclusive fee that covers: ATPL theory ground school, all flight training hours, simulator time, CAA exam fees, skills test fees, and sometimes accommodation. Always check what is and is not included before comparing schools.</p>
              <p>Additional costs to budget for include: Class 1 Medical (£500–£800), headset and equipment (£800–£1,500), living costs if not included (£10,000–£25,000 over 18 months), and a type rating after qualifying (£20,000–£35,000, often funded by airlines).</p>
            </>
          ),
        },
        {
          heading: "Modular ATPL cost breakdown",
          content: (
            <>
              <p>The modular route allows you to spread costs over several years. Here is a typical breakdown:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>PPL: £8,000–£14,000</li>
                <li>ATPL theory (ground school): £2,500–£5,000</li>
                <li>ATPL exams (14 papers): £2,000–£4,000</li>
                <li>Night rating: £800–£1,500</li>
                <li>Instrument rating (IR): £8,000–£15,000</li>
                <li>Multi-engine rating (MEP): £2,500–£5,000</li>
                <li>Commercial pilot licence (CPL): £5,000–£10,000</li>
                <li>Multi-crew cooperation (MCC): £2,000–£4,000</li>
                <li>Jet orientation course (JOC): £1,500–£3,000</li>
              </ul>
              <p className="mt-3">Total: approximately £33,000–£62,000 in training fees, plus living costs and contingency.</p>
            </>
          ),
        },
        {
          heading: "Training abroad: is it cheaper?",
          content: (
            <>
              <p>Many students train in the USA, Spain, Portugal or South Africa where flying hours are cheaper due to better weather (more flying days) and lower operating costs. A PPL in Arizona or Florida can cost 30–40% less than in the UK.</p>
              <p>However, you need to factor in: flights, accommodation, visa costs, and the cost of converting a foreign licence to a UK/EASA licence if required. For integrated programmes, some schools have bases in multiple countries to take advantage of better flying weather.</p>
            </>
          ),
        },
        {
          heading: "Hidden costs to budget for",
          content: (
            <>
              <p>Many students underestimate the total cost of training. Common hidden or overlooked costs include:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Resit fees for failed ATPL exams (£150–£300 per paper)</li>
                <li>Additional flight hours if you need more than the minimum</li>
                <li>Travel to and from the training location</li>
                <li>Aviation headset (£400–£1,500)</li>
                <li>iPad and aviation apps (£500–£1,000)</li>
                <li>Uniform and professional clothing</li>
                <li>Type rating after qualifying (if self-funded)</li>
                <li>Loss of income during full-time training</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Is pilot training worth the cost?",
          content: (
            <>
              <p>A newly qualified first officer at a European low-cost carrier typically earns £35,000–£50,000 in their first year, rising to £60,000–£90,000 as a senior first officer, and £100,000–£180,000+ as a captain. The return on investment is strong for those who qualify and secure airline employment.</p>
              <p>The key risk is the job market at the time of qualification. Demand for pilots fluctuates with airline capacity. Research the current market before committing to training.</p>
            </>
          ),
        },
      ]}
    />
  );
}
