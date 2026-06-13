import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "Integrated vs Modular training", href: "/guides/integrated-vs-modular", time: "6 min read" },
  { title: "Pilot training cost guide", href: "/guides/pilot-training-costs", time: "7 min read" },
  { title: "Class 1 Medical guide", href: "/guides/class-1-medical", time: "5 min read" },
  { title: "Training timeline guide", href: "/guides/training-timeline", time: "5 min read" },
];

export default function HowToBecomePilot() {
  return (
    <GuideLayout
      title="How to Become a Pilot"
      subtitle="A complete step-by-step guide to starting your pilot training journey, from choosing your licence to landing your first airline job."
      readTime="8 min read"
      relatedGuides={related}
      sections={[
        {
          heading: "Step 1: Choose your pilot goal",
          content: (
            <>
              <p>The first decision is what type of pilot you want to become. The most common goal is an <strong>Airline Transport Pilot Licence (ATPL)</strong>, which allows you to fly commercially for an airline. Other options include a Private Pilot Licence (PPL) for recreational flying, or a Commercial Pilot Licence (CPL) for charter, cargo or corporate work.</p>
              <p>Your goal determines which training route you take, how long it takes, and how much it costs. If you are unsure, the PilotPath assessment can help you identify the best route based on your background and ambitions.</p>
            </>
          ),
        },
        {
          heading: "Step 2: Check your medical eligibility",
          content: (
            <>
              <p>Before committing to training, you must obtain a <strong>Class 1 Medical Certificate</strong> from a Civil Aviation Authority (CAA) approved Aviation Medical Examiner (AME). This is a mandatory requirement for commercial pilot training.</p>
              <p>The Class 1 Medical assesses your eyesight, hearing, cardiovascular health, and general fitness. Most healthy people pass without issue, but it is important to get this done early — ideally before spending money on training — to confirm you are medically eligible.</p>
              <p>A Class 2 Medical is sufficient for a PPL if your goal is recreational flying only.</p>
            </>
          ),
        },
        {
          heading: "Step 3: Choose your training route",
          content: (
            <>
              <p>There are two main routes to an ATPL in the UK and Europe:</p>
              <ul className="list-disc pl-5 space-y-2 text-[var(--color-foreground)]">
                <li><strong>Integrated ATPL:</strong> A full-time, residential programme lasting 18–24 months. All training is completed at a single school. Typically costs £80,000–£120,000. Fastest route to an airline.</li>
                <li><strong>Modular ATPL:</strong> A flexible, self-paced route where you complete each module separately. Can be done part-time while working. Typically costs £40,000–£80,000 over 3–5 years.</li>
              </ul>
              <p>Both routes lead to the same licence and the same job opportunities. The right choice depends on your budget, lifestyle and how quickly you want to qualify.</p>
            </>
          ),
        },
        {
          heading: "Step 4: Complete your ATPL theory",
          content: (
            <>
              <p>All commercial pilot candidates must pass <strong>14 ATPL theory examinations</strong> covering subjects including Air Law, Navigation, Meteorology, Aircraft Performance, and Human Performance. These are set and administered by the CAA (UK) or EASA (Europe).</p>
              <p>Theory can be studied via an approved ground school (classroom or online) or through self-study with approved materials. Most integrated schools include theory training in their package. Modular students typically study independently or attend a ground school.</p>
            </>
          ),
        },
        {
          heading: "Step 5: Complete your flight training",
          content: (
            <>
              <p>Flight training is divided into several stages: basic handling, instrument flying, multi-engine flying, and commercial operations. For an ATPL, you will need a minimum of <strong>200 hours total flight time</strong> (integrated route) or more hours via the modular route.</p>
              <p>Training is conducted in single-engine and multi-engine aircraft, and includes simulator time for instrument and multi-crew procedures. You will also complete a Multi-Crew Cooperation (MCC) course, which prepares you for operating as part of a two-pilot airline crew.</p>
            </>
          ),
        },
        {
          heading: "Step 6: Apply for airline jobs",
          content: (
            <>
              <p>Once you hold a frozen ATPL (fATPL), you can apply for first officer positions at airlines. Most airlines require candidates to complete a type rating on the aircraft they will fly (e.g. Boeing 737 or Airbus A320), which costs an additional £20,000–£35,000 and is often funded by the airline or paid back from salary.</p>
              <p>Competition for first officer roles varies by airline and market conditions. Building additional hours as a flight instructor or in general aviation can strengthen your application.</p>
            </>
          ),
        },
        {
          heading: "Age requirements and limits",
          content: (
            <>
              <p>There is no upper age limit for starting pilot training in the UK or Europe, though airlines typically require candidates to be under 65 for commercial operations. The minimum age for a PPL is 17, for a CPL is 18, and for an ATPL is 21.</p>
              <p>Career changers in their 30s and 40s successfully qualify and find employment every year. The key factors are medical fitness, financial readiness and commitment to training.</p>
            </>
          ),
        },
      ]}
    />
  );
}
