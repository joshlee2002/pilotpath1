import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read" },
  { title: "Best route to airline", href: "/guides/best-route-to-airline", time: "6 min read" },
  { title: "Pilot training costs", href: "/guides/pilot-training-costs", time: "7 min read" },
];

export default function AirlinePilotSalary() {
  return (
    <GuideLayout
      title="Airline Pilot Salary Guide"
      subtitle="What do airline pilots actually earn? A realistic breakdown of first officer and captain salaries at UK and European airlines."
      readTime="7 min read"
      relatedGuides={related}
      ctaText="Find your best route to an airline"
      sections={[
        {
          heading: "How much do airline pilots earn?",
          content: (
            <>
              <p>Pilot salaries vary significantly by airline, aircraft type, seniority and country. Here is a realistic overview of what to expect at different career stages:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="bg-[var(--color-muted)]">
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Role</th>
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">UK salary range</th>
                      <th className="text-left p-3 font-semibold border border-[var(--color-border)]">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["New first officer (LCC)", "£35,000 – £55,000", "First year, type rating often self-funded"],
                      ["Senior first officer", "£60,000 – £90,000", "3–7 years experience"],
                      ["Junior captain", "£90,000 – £130,000", "Newly promoted"],
                      ["Senior captain (LCC)", "£120,000 – £180,000", "Long-haul or senior narrow-body"],
                      ["Long-haul captain (legacy)", "£150,000 – £220,000+", "BA, Virgin, etc."],
                    ].map(([role, salary, notes]) => (
                      <tr key={role} className="border border-[var(--color-border)]">
                        <td className="p-3 font-medium">{role}</td>
                        <td className="p-3 text-[var(--color-primary)] font-semibold">{salary}</td>
                        <td className="p-3 text-[var(--color-muted-foreground)] text-xs">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">Figures are approximate and based on publicly available data. Actual salaries depend on airline, contract type, and individual circumstances.</p>
            </>
          ),
        },
        {
          heading: "What affects a pilot's salary?",
          content: (
            <>
              <p>Several factors influence how much a pilot earns:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Airline type:</strong> Low-cost carriers (Ryanair, easyJet) typically pay less than legacy carriers (British Airways, Lufthansa) but offer faster promotion.</li>
                <li><strong>Aircraft type:</strong> Wide-body (long-haul) aircraft command higher salaries than narrow-body (short-haul).</li>
                <li><strong>Seniority:</strong> Pilot pay is heavily seniority-based. The longer you stay at an airline, the higher your pay.</li>
                <li><strong>Contract type:</strong> Permanent employed contracts pay more than self-employed or agency contracts.</li>
                <li><strong>Country:</strong> Middle Eastern airlines (Emirates, Qatar, Etihad) offer tax-free salaries that can be significantly higher than UK equivalents.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Return on investment",
          content: (
            <>
              <p>If you invest £100,000 in integrated training and earn £45,000 in your first year, rising to £80,000 by year five, the training cost is typically recovered within 5–8 years. Over a 30-year career, the lifetime earnings potential is substantial.</p>
              <p>The key risk is the time between qualifying and securing employment. Periods of high pilot demand (as seen in 2022–2024) can mean quick employment; downturns (as in 2020) can mean a longer wait.</p>
            </>
          ),
        },
        {
          heading: "Pilot salaries outside the UK",
          content: (
            <>
              <p>Middle Eastern carriers offer some of the highest pilot salaries globally, often tax-free with accommodation and travel benefits included. A captain at Emirates or Qatar Airways can earn the equivalent of £200,000–£300,000 when benefits are included.</p>
              <p>In the USA, major airline captains (United, Delta, American) earn $300,000–$500,000+ at senior levels, though the path to that level takes longer than in Europe due to the hour-building requirements (1,500 hours for an ATP certificate).</p>
            </>
          ),
        },
      ]}
    />
  );
}
