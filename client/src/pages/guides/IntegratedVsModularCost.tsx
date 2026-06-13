import GuideLayout from "@/components/GuideLayout";

const IntegratedVsModularCost = () => {
  return (
    <GuideLayout
      title="Integrated vs Modular ATPL: Which is Actually Cheaper? (2026)"
      subtitle="A brutally honest breakdown of the real costs of pilot training. We compare the £100k+ integrated route against the £60k modular route, including hidden costs and lost earnings."
      canonical="/guides/integrated-vs-modular-cost"
      metaDescription="Integrated vs Modular ATPL cost comparison 2026. Discover why Integrated costs £100k+ while Modular costs £60k, and which route actually makes financial sense for you."
      readTime="9 min read"
      ctaHref="/calculator"
      ctaText="Calculate your training cost"
      faqSchema={[
        { question: "How much does Integrated ATPL training cost?", answer: "In 2026, Integrated ATPL training in the UK costs between £90,000 and £130,000. This is usually paid in large installments over the 18-24 month course. It does not always include living costs or the final Type Rating." },
        { question: "How much does Modular ATPL training cost?", answer: "Modular ATPL training typically costs between £50,000 and £75,000 in total. Because you pay for each module (PPL, Hour Building, ATPL Theory, CPL, IR, ME) separately, you can spread the cost over several years and work alongside your training." },
        { question: "Why is Integrated training so much more expensive?", answer: "Integrated schools charge a premium for the convenience of a fully managed, full-time course, brand-new facilities, airline partnerships, and dedicated placement teams. You are paying for the structure and the brand name, not a different licence." },
        { question: "Do airlines prefer Integrated or Modular pilots?", answer: "Historically, legacy carriers preferred Integrated graduates from partner schools. However, in 2026, the severe pilot shortage means airlines like Ryanair, easyJet, and Jet2 actively recruit Modular graduates. Once you have 1,500 hours, no airline cares which route you took." }
      ]}
      relatedGuides={[
        { title: "Pilot Training Costs UK 2026", href: "/guides/pilot-training-costs", time: "8 min" },
        { title: "How to Finance Pilot Training", href: "/guides/how-to-finance-pilot-training-uk", time: "7 min" },
      ]}
      sections={[
        {
          heading: "The £50,000 Question",
          content: (
            <>
              <p>
                If you want to become an airline pilot in the UK, you have to choose between two training routes: Integrated or Modular. Both result in the exact same piece of paper — a "Frozen" ATPL (Airline Transport Pilot Licence).
              </p>
              <p>
                Yet one route costs around £110,000, and the other costs around £60,000. 
              </p>
              <p>
                Why is there a £50,000 difference for the same licence? And more importantly, is the expensive route actually worth the premium? In this guide, we break down the real costs of both routes in 2026, including the hidden fees the brochures don't mention.
              </p>
            </>
          )
        },
        {
          heading: "Integrated ATPL: The Premium Package",
          content: (
            <>
              <p>
                Integrated training is a full-time, intensive course that takes you from zero hours to a Frozen ATPL in 18 to 24 months. You complete all your training at one large academy (like CAE, Skyborne, or L3Harris).
              </p>
              
              <h3 className="text-lg font-bold mt-6 mb-2 text-[var(--color-navy)]">The True Cost of Integrated</h3>
              <p>
                The headline price for an Integrated course in the UK currently sits between <strong>£90,000 and £115,000</strong>. However, this is rarely the final amount you will spend.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 mb-4 text-[var(--color-foreground)]">
                <li><strong>Base Course Fee:</strong> ~£105,000</li>
                <li><strong>Living Costs (18 months):</strong> ~£15,000 (Accommodation is rarely included)</li>
                <li><strong>CAA Exam & Licence Fees:</strong> ~£1,500</li>
                <li><strong>Class 1 Medical (Initial + Renewal):</strong> ~£800</li>
                <li><strong>Type Rating (if not bonded):</strong> ~£30,000 (If you get a job with Ryanair or similar, you pay for your own type rating)</li>
              </ul>
              <p>
                <strong>Realistic Total Cost: £122,000 - £152,000</strong>
              </p>

              <h3 className="text-lg font-bold mt-6 mb-2 text-[var(--color-navy)]">What are you paying the premium for?</h3>
              <p>
                You are not paying for a better licence. You are paying for speed (18 months), convenience (they organize everything), state-of-the-art facilities, and crucially, <strong>airline relationships</strong>. Integrated schools have dedicated placement teams and direct pipelines into airlines like easyJet and British Airways.
              </p>
            </>
          )
        },
        {
          heading: "Modular ATPL: The Pay-As-You-Go Route",
          content: (
            <>
              <p>
                Modular training allows you to complete your training in distinct chunks (PPL, Hour Building, ATPL Theory, CPL, IR, ME). You can do this full-time in about 2 years, or part-time over 3-5 years while working.
              </p>

              <h3 className="text-lg font-bold mt-6 mb-2 text-[var(--color-navy)]">The True Cost of Modular</h3>
              <p>
                Because you shop around for the best value at each stage, Modular is drastically cheaper.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 mb-4 text-[var(--color-foreground)]">
                <li><strong>Private Pilot Licence (PPL):</strong> ~£10,000</li>
                <li><strong>Hour Building (100 hours):</strong> ~£15,000 (Can be cheaper if done in the US/Eastern Europe)</li>
                <li><strong>ATPL Theory (Distance Learning):</strong> ~£2,500</li>
                <li><strong>CPL / ME / IR (The professional flying phase):</strong> ~£25,000</li>
                <li><strong>APS MCC (Multi-Crew Cooperation):</strong> ~£6,000</li>
                <li><strong>CAA Exam & Licence Fees:</strong> ~£1,500</li>
              </ul>
              <p>
                <strong>Realistic Total Cost: £60,000 - £70,000</strong>
              </p>

              <h3 className="text-lg font-bold mt-6 mb-2 text-[var(--color-navy)]">The hidden financial advantage of Modular</h3>
              <p>
                The biggest financial benefit of the Modular route isn't just the £50k saving on training — it's <strong>opportunity cost</strong>. Because you can train part-time, you can continue to work your normal job. You don't lose 2 years of salary, and you don't need to take out a massive, high-interest unsecured loan.
              </p>
            </>
          )
        },
        {
          heading: "The Verdict: Which is better?",
          content: (
            <>
              <p>
                Ten years ago, airlines strongly preferred Integrated graduates. Today, the landscape has changed. The pilot shortage means airlines are desperate for qualified First Officers, regardless of how they trained. Ryanair, easyJet, Jet2, and Loganair all actively recruit Modular graduates.
              </p>
              <p>
                <strong>Choose Integrated if:</strong> You have access to £120,000 in cash or secured funding, you want to be in the right-hand seat as fast as humanly possible (18 months), and you want the school to handle all the logistics and airline introductions.
              </p>
              <p>
                <strong>Choose Modular if:</strong> You need to work while you train, you are paying for it yourself out of savings, you want to graduate with zero debt, or you prefer the flexibility to train at your own pace.
              </p>
              <div className="p-4 rounded-xl mt-6" style={{ background: "oklch(0.72 0.18 65 / 0.1)", border: "1px solid oklch(0.72 0.18 65 / 0.2)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.15 65)" }}>Calculate your exact costs</p>
                <p className="text-sm text-[var(--color-foreground)] mb-0">
                  Use our <a href="/calculator" className="underline font-semibold" style={{ color: "oklch(0.85 0.15 65)" }}>Training Cost Calculator</a> to build a personalized estimate based on your chosen route, location, and living expenses.
                </p>
              </div>
            </>
          )
        }
      ]}
    />
  );
};

export default IntegratedVsModularCost;
