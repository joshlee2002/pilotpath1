import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "Pilot training costs", href: "/guides/pilot-training-costs", time: "7 min read" },
  { title: "Integrated vs Modular", href: "/guides/integrated-vs-modular", time: "6 min read" },
  { title: "Best route to airline", href: "/guides/best-route-to-airline", time: "6 min read" },
];

export default function FinanceGuide() {
  return (
    <GuideLayout
      title="Pilot Training Finance Guide"
      subtitle="How to fund your pilot training — from career development loans and school payment plans to airline sponsorships and government schemes."
      readTime="6 min read"
      relatedGuides={related}
      ctaText="Check your finance eligibility"
      sections={[
        {
          heading: "Can I get a loan for pilot training?",
          content: (
            <>
              <p>Yes — several financing options exist for pilot training, though they vary by country and individual circumstances. The most common options in the UK are:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Professional development loans:</strong> Unsecured personal loans from high street banks for vocational training. Amounts typically up to £25,000.</li>
                <li><strong>Specialist aviation finance:</strong> Some lenders specialise in pilot training loans and offer amounts up to £100,000 secured against future earnings or assets.</li>
                <li><strong>Flight school payment plans:</strong> Many schools offer staged payment plans that allow you to pay in instalments rather than upfront.</li>
                <li><strong>Family loans:</strong> Informal arrangements with family members, often interest-free.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Airline cadet sponsorships",
          content: (
            <>
              <p>Some airlines offer cadet programmes where they sponsor part or all of the training cost in exchange for a commitment to fly for them after qualifying. These programmes are highly competitive and typically require candidates to pass rigorous selection assessments.</p>
              <p>Sponsored programmes may include: full funding with a bond (you repay from salary), partial funding, or guaranteed employment after training. Examples include programmes run by airlines in partnership with approved training organisations.</p>
              <p>Availability of sponsored programmes fluctuates with airline capacity and pilot demand. Research current opportunities before applying.</p>
            </>
          ),
        },
        {
          heading: "Government-backed schemes",
          content: (
            <>
              <p>In the UK, the <strong>Advanced Learner Loan</strong> can be used for some aviation qualifications at approved providers. The loan is repaid through the student loan system once you earn above the repayment threshold.</p>
              <p>Some regions and devolved governments offer additional funding for vocational training. Check with your local enterprise partnership or skills funding body for current schemes.</p>
            </>
          ),
        },
        {
          heading: "Modular training as a finance strategy",
          content: (
            <>
              <p>The modular route is inherently a finance strategy as much as a training route. By completing modules over several years while working, you can fund training from income rather than taking on large amounts of debt.</p>
              <p>A typical approach: complete PPL and ATPL theory while working (cost: £10,000–£19,000 over 1–2 years), then take a career break or reduce hours to complete the flight training modules (cost: £25,000–£50,000 over 1–2 years).</p>
            </>
          ),
        },
        {
          heading: "What lenders look for",
          content: (
            <>
              <p>If applying for a pilot training loan, lenders will typically assess:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your credit history and existing debts</li>
                <li>Your income and employment status</li>
                <li>The reputation and accreditation of your chosen school</li>
                <li>Evidence of your Class 1 Medical (confirming you are medically eligible)</li>
                <li>Your commitment and motivation (some lenders conduct interviews)</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Important considerations",
          content: (
            <>
              <p>Pilot training finance is a significant commitment. Before taking on debt, consider:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The job market at the time you expect to qualify</li>
                <li>Your ability to service the debt if employment is delayed</li>
                <li>Whether the school you choose has a good employment record for graduates</li>
                <li>The total cost of borrowing including interest</li>
              </ul>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">This guide is for information only and does not constitute financial advice. Consult a qualified financial adviser before making borrowing decisions.</p>
            </>
          ),
        },
      ]}
    />
  );
}
