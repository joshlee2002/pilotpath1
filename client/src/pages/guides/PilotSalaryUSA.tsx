import GuideLayout from "@/components/GuideLayout";

const PilotSalaryUSA = () => {
  return (
    <GuideLayout
      title="Airline Pilot Salary USA 2026: First Officer & Captain Pay at Every Major Airline"
      subtitle="Real 2026 salary data for regional and major airline pilots — what you will earn at every stage of your career."
      canonical="/us/guides/airline-pilot-salary-usa"
      metaDescription="US airline pilot salary guide 2026. Real pay data for regional FOs, major airline first officers, and captains at Delta, United, American, Southwest, FedEx and UPS."
      faqSchema={[
        {
          question: "How much does a first officer make at a US major airline?",
          answer: "First officers at major airlines (Delta, United, American, Southwest) typically earn between $80,000 and $150,000 in their first year, rising to $120,000 to $200,000 with seniority. Total compensation including per diem, profit sharing, and benefits is significantly higher than base pay alone.",
        },
        {
          question: "How much does a regional airline first officer make?",
          answer: "Regional airline first officers typically start at $45,000 to $70,000 per year. Signing bonuses of $10,000 to $30,000 are common due to the pilot shortage. After 2 to 3 years, regional FOs can earn $70,000 to $100,000, and regional captains earn $90,000 to $140,000.",
        },
        {
          question: "How much does an airline captain make in the USA?",
          answer: "Captains at major airlines earn $180,000 to $350,000 or more per year in base pay. At FedEx and UPS, captain salaries exceed $300,000. Total compensation including per diem, profit sharing, and benefits can push total earnings well above these figures for senior captains.",
        },
        {
          question: "How long does it take to upgrade from first officer to captain?",
          answer: "Upgrade timelines have shortened dramatically due to the pilot shortage. At regional airlines, upgrades are happening in 1 to 3 years. At major airlines, pilots who joined in 2019 to 2022 have been upgrading in 5 to 10 years, compared to 15 to 20 years historically.",
        },
        {
          question: "What is per diem and how much do pilots earn from it?",
          answer: "Per diem is a daily allowance paid to pilots when away from their base, intended to cover meals and incidentals. Rates vary by airline but typically range from $2.00 to $3.50 per hour away from base. A pilot away from base 15 days per month at $2.50 per hour earns approximately $900 to $1,200 per month in per diem, largely tax-advantaged.",
        },
      ]}
      readTime="10 min read"
      ctaHref="/us/roadmap"
      ctaText="Get my free US pilot roadmap"
      sections={[
        {
          heading: "The US Pilot Salary Landscape in 2026",
          content: (
            <>
              <p>
                US airline pilot salaries have risen dramatically over the past five years, driven by a combination of mandatory retirement at age 65, post-pandemic travel demand recovery, and the structural pilot shortage that has been building since the 2013 first officer experience rule changes. The result is that pilots entering the profession today face a more financially rewarding career than any previous generation.
              </p>
              <p>
                Understanding pilot compensation requires looking beyond base pay. Total compensation includes base salary, per diem (a daily allowance when away from base), profit sharing (which at Delta and Southwest has added $20,000 to $50,000 per year for senior pilots), 401(k) contributions, health insurance, travel benefits, and signing bonuses. For senior captains at major carriers, total compensation routinely exceeds $400,000 per year.
              </p>
              <p>
                The career path typically follows a predictable arc: start as a regional airline first officer, upgrade to regional captain or move directly to a major airline as a first officer, then work through the seniority list to captain. The timeline for each stage has compressed significantly — what took 20 years in the 1990s now takes 8 to 12 years for many pilots.
              </p>
            </>
          ),
        },
        {
          heading: "Regional Airline Salaries: Where Most Careers Begin",
          content: (
            <>
              <p>
                Most pilots begin their airline careers at regional carriers — airlines such as SkyWest, Envoy, Piedmont, PSA, Horizon, GoJet, and Republic that operate regional jets under the banners of the major carriers. Regional airlines are the primary path for pilots who have built their 1,500 hours (or R-ATP minimums) as a CFI or in other roles.
              </p>
              <p>
                Regional first officer starting salaries have risen sharply. In 2018, many regional FOs started at $25,000 to $35,000 per year. By 2026, starting salaries at most regionals are $50,000 to $75,000, with signing bonuses of $10,000 to $30,000 common. SkyWest, Envoy, and Horizon have been particularly competitive. Total first-year compensation including signing bonus and per diem can exceed $80,000.
              </p>
              <p>
                Regional captain salaries range from $90,000 to $140,000 depending on the carrier and aircraft type. Upgrade timelines have compressed to 1 to 3 years at many regionals due to rapid expansion and attrition to major carriers. The regional captain role is often used as a stepping stone to major airline first officer positions, where seniority resets but pay increases significantly.
              </p>
            </>
          ),
        },
        {
          heading: "Major Airline First Officer Pay",
          content: (
            <>
              <p>
                Major airline first officer salaries are governed by collective bargaining agreements negotiated by pilot unions (ALPA at most carriers, SWAPA at Southwest). The following figures represent approximate 2026 base pay ranges for first officers at the major US carriers:
              </p>
              <div style={{ overflowX: "auto", margin: "1rem 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Airline</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Year 1 FO</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Year 5 FO</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Year 10 FO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Delta Air Lines", "$100,000", "$145,000", "$185,000"],
                      ["United Airlines", "$95,000", "$140,000", "$180,000"],
                      ["American Airlines", "$90,000", "$135,000", "$175,000"],
                      ["Southwest Airlines", "$85,000", "$130,000", "$170,000"],
                      ["Alaska Airlines", "$80,000", "$125,000", "$160,000"],
                      ["FedEx Express", "$105,000", "$155,000", "$195,000"],
                      ["UPS Airlines", "$100,000", "$150,000", "$190,000"],
                    ].map(([airline, y1, y5, y10]) => (
                      <tr key={airline} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem" }}>{airline}</td>
                        <td style={{ padding: "0.75rem" }}>{y1}</td>
                        <td style={{ padding: "0.75rem" }}>{y5}</td>
                        <td style={{ padding: "0.75rem" }}>{y10}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                These figures are base pay only. Per diem, profit sharing, and 401(k) contributions add substantially to total compensation. Delta's profit sharing has historically added $15,000 to $40,000 per year for first officers. Southwest's profit sharing has been similarly generous in profitable years.
              </p>
            </>
          ),
        },
        {
          heading: "Major Airline Captain Salaries",
          content: (
            <>
              <p>
                Captain salaries at major US airlines represent some of the highest compensation packages in any profession. The following figures represent approximate 2026 base pay for captains at major carriers:
              </p>
              <div style={{ overflowX: "auto", margin: "1rem 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Airline</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Year 1 Captain</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Senior Captain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Delta Air Lines", "$200,000", "$320,000+"],
                      ["United Airlines", "$195,000", "$310,000+"],
                      ["American Airlines", "$185,000", "$295,000+"],
                      ["Southwest Airlines", "$180,000", "$285,000+"],
                      ["FedEx Express", "$220,000", "$360,000+"],
                      ["UPS Airlines", "$215,000", "$350,000+"],
                    ].map(([airline, y1, senior]) => (
                      <tr key={airline} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem" }}>{airline}</td>
                        <td style={{ padding: "0.75rem" }}>{y1}</td>
                        <td style={{ padding: "0.75rem" }}>{senior}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                FedEx and UPS captain salaries are among the highest in the industry because cargo operations often involve less desirable schedules (night flying, weekends, holidays) and the unions have negotiated premium compensation accordingly. Total compensation for senior FedEx and UPS captains, including per diem, profit sharing, and benefits, regularly exceeds $400,000 per year.
              </p>
            </>
          ),
        },
        {
          heading: "Career Timeline: How Long to Reach Each Salary Level",
          content: (
            <>
              <p>
                The timeline from zero hours to major airline captain has compressed significantly. A typical career path in 2026 looks like this:
              </p>
              <ul style={{ paddingLeft: "1.5rem", lineHeight: "2.2" }}>
                <li><strong>Years 0 to 2:</strong> Flight training (PPL, IR, CPL, CFI) — earning $30,000 to $50,000 as a CFI</li>
                <li><strong>Years 2 to 4:</strong> Regional airline first officer — earning $50,000 to $90,000</li>
                <li><strong>Years 4 to 6:</strong> Regional captain or major airline FO hire — earning $90,000 to $130,000</li>
                <li><strong>Years 6 to 12:</strong> Major airline first officer — earning $100,000 to $185,000</li>
                <li><strong>Years 12 to 20:</strong> Major airline captain — earning $200,000 to $320,000+</li>
              </ul>
              <p>
                These timelines are approximate and depend heavily on the state of the industry, the specific airline, and individual circumstances. The pilot shortage has compressed timelines at every stage — pilots who would have waited 15 years for a major airline captain seat in 2005 are upgrading in 8 to 10 years today.
              </p>
              <p>
                The investment in training ($80,000 to $150,000 for the full pathway) is typically recovered within 3 to 5 years of reaching a major airline first officer position. The lifetime earnings potential of a major airline captain who retires at 65 is substantial — often exceeding $5 to $8 million in total career earnings.
              </p>
            </>
          ),
        },
        {
          heading: "Beyond Base Pay: The Full Compensation Picture",
          content: (
            <>
              <p>
                Pilot compensation is more complex than base salary alone. Understanding the full picture helps you evaluate offers and plan your career:
              </p>
              <p>
                <strong>Per diem:</strong> Paid at $2.00 to $3.50 per hour away from base. A pilot away from base 15 days per month earns $720 to $1,260 per month in per diem, which is largely tax-advantaged as it is intended to cover expenses. Annual per diem income of $8,000 to $15,000 is typical for active pilots.
              </p>
              <p>
                <strong>Profit sharing:</strong> Delta, Southwest, and Alaska have historically paid significant profit sharing. Delta paid 10% of eligible earnings in profit sharing in recent years, adding $10,000 to $40,000 to annual compensation for first officers and captains respectively.
              </p>
              <p>
                <strong>401(k) and pension:</strong> Most major airlines contribute 15 to 17% of base pay to a 401(k) plan. Some carriers also have defined benefit pension plans for pilots hired before certain dates. The retirement benefits alone add $25,000 to $50,000 per year in equivalent compensation for senior pilots.
              </p>
              <p>
                <strong>Travel benefits:</strong> Free and heavily discounted travel for pilots and their immediate family members on their airline and often partner airlines. For pilots who value travel, this benefit alone is worth thousands of dollars per year.
              </p>
            </>
          ),
        },
      ]}
      relatedGuides={[
        { title: "US Pilot Career Outlook 2026: Is Now the Best Time to Start?", href: "/us/guides/us-pilot-career-outlook", time: "8 min read" },
        { title: "How to Fund Pilot Training in the USA", href: "/us/guides/how-to-fund-pilot-training-usa", time: "8 min read" },
        { title: "ATP Certificate USA: Requirements & How to Get One", href: "/us/guides/atp-certificate-usa", time: "10 min read" },
      ]}
    />
  );
};

export default PilotSalaryUSA;
