import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "Integrated vs Modular", href: "/guides/integrated-vs-modular", time: "6 min read" },
  { title: "Airline pilot salary", href: "/guides/airline-pilot-salary", time: "7 min read" },
  { title: "Training timeline", href: "/guides/training-timeline", time: "5 min read" },
  { title: "Finance guide", href: "/guides/finance-guide", time: "6 min read" },
];

export default function BestRouteToAirline() {
  return (
    <GuideLayout
      title="Best Route to Becoming an Airline Pilot"
      subtitle="A practical guide to the fastest and most cost-effective paths from zero experience to a first officer seat at an airline."
      readTime="6 min read"
      relatedGuides={related}
      ctaText="Get your personalised airline roadmap"
      sections={[
        {
          heading: "Overview: the two main routes",
          content: (
            <>
              <p>There is no single "best" route — the right path depends on your budget, timeline, and personal circumstances. However, there are two well-established routes that most aspiring airline pilots follow:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Integrated ATPL:</strong> Full-time, 18–24 months, £80,000–£120,000. Fastest route to an airline seat.</li>
                <li><strong>Modular ATPL:</strong> Self-paced, 3–5 years, £40,000–£80,000. More affordable but takes longer.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "The cadet pathway",
          content: (
            <>
              <p>Some airlines run structured cadet programmes in partnership with approved flight schools. These programmes offer a direct pathway from training to employment, and some include sponsored or bonded training where the airline funds part of the cost in exchange for a commitment to fly for them after qualifying.</p>
              <p>Cadet programmes are competitive and typically require candidates to pass airline-style aptitude tests, psychometric assessments, and interviews. They are generally only available through integrated schools.</p>
              <p>Examples include the Ryanair Mentored Programme, easyJet Pilot Academy, and various programmes run by training organisations in partnership with airlines.</p>
            </>
          ),
        },
        {
          heading: "The self-funded route",
          content: (
            <>
              <p>Most pilots self-fund their training and apply to airlines independently after qualifying. This is the most common route and does not disadvantage you in the job market — airlines hire from both cadet programmes and open recruitment.</p>
              <p>After qualifying with a frozen ATPL, you will need to complete a type rating on the aircraft you will fly (e.g. Boeing 737 or Airbus A320). This costs £20,000–£35,000 and is sometimes funded by the airline, or offered as a "pay-to-fly" scheme where you fund it yourself.</p>
            </>
          ),
        },
        {
          heading: "Building hours as a flight instructor",
          content: (
            <>
              <p>Many modular graduates and some integrated graduates build flight time as a flight instructor (FI) before applying to airlines. Instructing is a well-regarded way to build hours and develop flying skills, and the experience is viewed positively by airlines.</p>
              <p>A Flight Instructor rating (FI(A)) can be added after obtaining a CPL and costs approximately £3,000–£6,000. Instructors typically earn £20,000–£35,000 per year while building hours.</p>
            </>
          ),
        },
        {
          heading: "What airlines look for",
          content: (
            <>
              <p>Airlines assess candidates on multiple dimensions beyond just flying ability:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Aptitude:</strong> Psychometric tests covering spatial reasoning, multi-tasking, and situational awareness.</li>
                <li><strong>Personality:</strong> Crew resource management, communication, and decision-making under pressure.</li>
                <li><strong>Academic performance:</strong> ATPL exam scores and training records.</li>
                <li><strong>Flying skills:</strong> Simulator assessment and technical knowledge.</li>
                <li><strong>Professionalism:</strong> Presentation, communication, and attitude throughout the selection process.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Timeline from zero to airline",
          content: (
            <>
              <p>A realistic timeline for the integrated route:</p>
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-2"><span className="w-24 text-xs font-semibold text-[var(--color-primary)]">Month 0</span> Start integrated ATPL training</li>
                <li className="flex items-center gap-2"><span className="w-24 text-xs font-semibold text-[var(--color-primary)]">Month 18–24</span> Complete training, hold frozen ATPL</li>
                <li className="flex items-center gap-2"><span className="w-24 text-xs font-semibold text-[var(--color-primary)]">Month 24–30</span> Apply to airlines, complete type rating</li>
                <li className="flex items-center gap-2"><span className="w-24 text-xs font-semibold text-[var(--color-primary)]">Month 30–36</span> First officer line training and qualification</li>
                <li className="flex items-center gap-2"><span className="w-24 text-xs font-semibold text-[var(--color-primary)]">Year 5–10</span> Senior first officer or captain upgrade</li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}
