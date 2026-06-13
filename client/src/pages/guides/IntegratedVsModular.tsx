import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read" },
  { title: "Pilot training costs", href: "/guides/pilot-training-costs", time: "7 min read" },
  { title: "Best route to airline", href: "/guides/best-route-to-airline", time: "6 min read" },
  { title: "Finance guide", href: "/guides/finance-guide", time: "6 min read" },
];

export default function IntegratedVsModular() {
  return (
    <GuideLayout
      title="Integrated vs Modular ATPL Training"
      subtitle="The two main routes to an Airline Transport Pilot Licence explained — and how to decide which is right for you."
      readTime="6 min read"
      relatedGuides={related}
      sections={[
        {
          heading: "What is the difference?",
          content: (
            <>
              <p>Both routes lead to the same qualification — a frozen ATPL (fATPL) — and the same job opportunities. The difference is in how you get there.</p>
              <p><strong>Integrated ATPL:</strong> A full-time, structured programme at a single approved training organisation (ATO). All theory and flight training is completed in sequence, typically in 18–24 months. You live and breathe aviation for the duration.</p>
              <p><strong>Modular ATPL:</strong> A self-directed route where you complete each licence and rating separately, at your own pace, at one or multiple schools. You can work between modules and spread costs over 3–5 years.</p>
            </>
          ),
        },
        {
          heading: "Integrated ATPL: pros and cons",
          content: (
            <>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Fastest route to an airline (18–24 months)</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Structured environment — ideal if you need guidance and accountability</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Airline partnerships and cadet sponsorships available at some schools</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>All-inclusive fee makes budgeting simpler</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>Higher upfront cost: £80,000–£120,000</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>Less flexibility — you cannot easily pause or change schools</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>Requires full-time commitment — you cannot work during training</span></li>
              </ul>
            </>
          ),
        },
        {
          heading: "Modular ATPL: pros and cons",
          content: (
            <>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Lower total cost: £40,000–£80,000</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Can work between modules to fund training</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Flexible — complete modules at your own pace</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span><span>Can shop around for the best schools for each module</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>Takes longer: 3–5 years is typical</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>Requires more self-discipline and organisation</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>No airline partnerships — you apply independently after qualifying</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">−</span><span>Currency issues if gaps between modules are too long</span></li>
              </ul>
            </>
          ),
        },
        {
          heading: "Which route do airlines prefer?",
          content: (
            <>
              <p>Airlines do not formally prefer one route over the other — both produce equally qualified pilots. What matters to airlines is your total flight time, your performance in selection assessments, and your attitude and aptitude.</p>
              <p>Some airlines run cadet programmes exclusively with integrated schools, which can give integrated graduates a direct pathway. However, modular graduates apply successfully to the same airlines through open recruitment.</p>
            </>
          ),
        },
        {
          heading: "How to decide which route is right for you",
          content: (
            <>
              <p>Consider the following questions:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Do you have £80,000–£120,000 available?</strong> If yes, integrated may be the faster, simpler option.</li>
                <li><strong>Do you need to keep working?</strong> If yes, modular is the only realistic option.</li>
                <li><strong>How quickly do you want to qualify?</strong> If speed is the priority, integrated wins.</li>
                <li><strong>Are you self-disciplined?</strong> Modular requires you to manage your own progress over several years.</li>
                <li><strong>Do you have family or other commitments?</strong> Modular offers more flexibility around life events.</li>
              </ul>
              <p className="mt-3">Take the PilotPath assessment to get a personalised recommendation based on your specific profile.</p>
            </>
          ),
        },
      ]}
    />
  );
}
