import GuideLayout from "@/components/GuideLayout";

export default function SimulatorAssessmentGuide() {
  return (
    <GuideLayout
      title="Airline Simulator Assessment Guide 2026: What to Expect and How to Prepare"
      subtitle="The simulator assessment is the stage where most technically qualified candidates fail — not because they cannot fly, but because they do not understand what assessors are actually looking for."
      canonical="/guides/airline-simulator-assessment"
      metaDescription="How to pass an airline pilot simulator assessment in 2026. What assessors look for, common scenarios, CRM tips, and how to prepare for the sim check. UK airline selection guide."
      readTime="8 min read"
      lastUpdated="June 2026"
      ctaHref="/quiz"
      ctaText="Take the free pilot readiness assessment"
      faqSchema={[
        { question: "What happens in an airline pilot simulator assessment?", answer: "A typical airline simulator assessment lasts 60-90 minutes and includes: a pre-flight briefing, normal operations (departure, cruise, approach), an instrument approach (usually an ILS to minimums), a go-around, and at least one abnormal or emergency scenario (engine failure, system malfunction). You will be assessed on flying accuracy, CRM, and how you handle unexpected events." },
        { question: "What aircraft type will I fly in the simulator assessment?", answer: "This varies by airline. Most major airlines use the aircraft type you are applying to fly — typically an Airbus A320 or Boeing 737. Some airlines use a generic multi-engine simulator for ab-initio candidates. Check the airline's recruitment information or ask the recruitment team before your assessment." },
        { question: "What is CRM and why does it matter in a simulator assessment?", answer: "CRM stands for Crew Resource Management — the non-technical skills required to operate safely as part of a crew. It includes communication, workload management, situational awareness, decision-making, and leadership. Assessors weight CRM heavily because it predicts safe, professional behaviour in line operations. Many technically strong candidates fail simulator assessments due to poor CRM." },
        { question: "How should I prepare for an airline simulator assessment?", answer: "Book preparation sessions in a simulator of the same type as your assessment. Focus on instrument flying, ILS approaches, go-arounds, and engine failures after V1. Practice thinking aloud and communicating with your assessor as if they were your first officer. Review the aircraft's standard operating procedures (SOPs) if available." },
        { question: "Can I fail a simulator assessment and reapply?", answer: "Yes, most airlines allow reapplication after a waiting period (typically 6-12 months). If you fail, ask for feedback if the airline offers it. Use the waiting period to address the specific areas where you underperformed — whether that is flying accuracy, CRM, or handling abnormal procedures." },
      ]}
      relatedGuides={[
        { title: "How to Pass an Airline Pilot Interview", href: "/guides/airline-pilot-interview", time: "9 min read" },
        { title: "Pilot Aptitude Tests: Complete Preparation Guide", href: "/guides/pilot-aptitude-test-preparation", time: "8 min read" },
        { title: "UK Cadet Pilot Programmes 2026", href: "/guides/cadet-pilot-programmes-uk", time: "8 min read" },
      ]}
      sections={[
        {
          heading: "What Assessors Are Actually Looking For",
          content: (
            <>
              <p>
                The most important thing to understand about a simulator assessment is this: it is not primarily a flying test. It is a CRM assessment that happens to involve flying.
              </p>
              <p>
                Assessors are not looking for perfect flying. They are looking for safe, professional behaviour — the kind of behaviour that will keep passengers and crew safe in line operations over a 30-year career. A candidate who flies a slightly imperfect ILS but communicates clearly, manages workload effectively, and handles an engine failure calmly will score higher than a candidate who flies a technically perfect approach but is silent, reactive, and flustered when something goes wrong.
              </p>
              <p>
                The specific behaviours assessors are looking for are defined by the ICAO and EASA competency frameworks:
              </p>
              <p>
                <strong>Communication:</strong> Clear, concise, and timely. You should brief your assessor (as first officer) before each phase of flight. Call out deviations before the assessor does. Confirm readbacks. Speak at a normal pace — stress causes candidates to speak too quickly.
              </p>
              <p>
                <strong>Workload management:</strong> Prioritise tasks correctly. Aviate, navigate, communicate — in that order. Do not become fixated on one task at the expense of others. Use automation appropriately.
              </p>
              <p>
                <strong>Situational awareness:</strong> Know where you are, where you are going, and what is likely to happen next. Anticipate — do not just react. "I'm expecting the ILS to become active in about 10 miles" demonstrates situational awareness. Silence until the ILS activates does not.
              </p>
              <p>
                <strong>Decision-making:</strong> Make decisions clearly and in good time. Announce your decisions to the assessor. "I'm going to go around — flaps to go-around, TOGA" is better than silently initiating a go-around.
              </p>
            </>
          ),
        },
        {
          heading: "Typical Assessment Scenarios and How to Handle Them",
          content: (
            <>
              <p>
                While every airline's assessment is different, the following scenarios appear in the vast majority of airline simulator assessments:
              </p>
              <p>
                <strong>ILS approach to minimums:</strong> The most common scenario. You will fly an ILS approach, likely in simulated IMC, to decision height. The assessor will either give you visual references at DH (land) or not (go-around). Fly the approach accurately, communicate your intentions, and make a clear decision at DH. Do not continue below DH without visual references.
              </p>
              <p>
                <strong>Go-around:</strong> Expect at least one go-around, either from a planned missed approach or from an unexpected event (runway incursion, wind shear warning). The go-around procedure must be executed correctly and promptly. Brief the go-around procedure before the approach so you are not trying to recall it under pressure.
              </p>
              <p>
                <strong>Engine failure after V1:</strong> The classic emergency scenario. After V1, the engine failure must be continued — do not reject the takeoff. Maintain directional control, rotate at Vr, establish a positive rate of climb, retract gear, and follow the engine failure procedure. Communicate with the assessor throughout.
              </p>
              <p>
                <strong>System malfunction:</strong> A hydraulic failure, pressurisation problem, or other system abnormality. The correct response is: aviate first, then diagnose. Do not dive into the QRH while the aircraft is deviating from its cleared altitude. Stabilise the aircraft, then work the abnormal procedure methodically.
              </p>
              <p>
                <strong>TCAS RA:</strong> A traffic alert requiring an immediate vertical manoeuvre. Respond immediately and correctly: "TCAS RA — CLIMB" (or descend), disconnect the autopilot if required, and follow the RA. Inform ATC after the RA is resolved.
              </p>
            </>
          ),
        },
        {
          heading: "How to Prepare: A Practical Guide",
          content: (
            <>
              <p>
                Preparation for a simulator assessment should begin at least four weeks before the assessment date. Here is a structured approach:
              </p>
              <p>
                <strong>Book simulator time:</strong> This is non-negotiable. You cannot prepare adequately for a full-motion simulator assessment by flying a desktop simulator. Book preparation sessions at a type rating training centre that operates the same simulator type as your assessment. Most centres offer assessment preparation packages. Expect to pay £200-500 per session — it is worth it.
              </p>
              <p>
                <strong>Review the SOPs:</strong> If the airline has published standard operating procedures (SOPs) for the aircraft type, study them. Know the callouts for each phase of flight. Know the go-around procedure by memory. Know the engine failure after V1 procedure by memory. You should not be reading checklists for these procedures during the assessment.
              </p>
              <p>
                <strong>Practice thinking aloud:</strong> This is the single most effective thing you can do to improve your CRM score. During every practice session, narrate your actions and intentions continuously. "Setting 3,000 feet on the MCP. Arming the approach. Checking the ILS frequency is set. Briefing the go-around: TOGA, flaps to go-around, positive rate, gear up." It feels unnatural at first. It becomes natural with practice.
              </p>
              <p>
                <strong>Debrief every session:</strong> After each practice session, debrief with your instructor. Identify the three things you did well and the three things you need to improve. Focus your next session on the improvements. Do not just fly the same scenarios repeatedly without reflection.
              </p>
            </>
          ),
        },
        {
          heading: "On the Day: Managing Nerves and Performing Under Pressure",
          content: (
            <>
              <p>
                Simulator assessments are stressful. Every candidate feels nervous. The assessors know this and account for it. What they are assessing is not whether you feel nervous — it is how you perform despite feeling nervous.
              </p>
              <p>
                <strong>Arrive early and brief thoroughly:</strong> Use the pre-flight briefing time fully. Brief the departure, the expected routing, the approach, and the go-around procedure. Ask the assessor (as your first officer) to confirm the briefing. This establishes the professional tone for the session and demonstrates good CRM from the start.
              </p>
              <p>
                <strong>If you make an error, recover and move on:</strong> Every candidate makes errors in simulator assessments. The assessors know this. What they are watching is how you recover. Acknowledge the error ("I've deviated from the cleared altitude — correcting now"), correct it, and move on. Do not dwell on it. Do not apologise repeatedly. Do not let one error cascade into a loss of situational awareness.
              </p>
              <p>
                <strong>Communicate even when you are busy:</strong> The natural response to a high-workload situation is to go silent and focus. Resist this. Even a brief "I'm managing the engine failure — standby" keeps the assessor informed and demonstrates workload management. Silence is interpreted as loss of situational awareness.
              </p>
              <p>
                <strong>After the assessment:</strong> Ask for feedback. Not all airlines offer it, but those that do provide valuable information about your performance. If you are unsuccessful, use the feedback to guide your preparation for the next attempt. The waiting period before reapplication is an opportunity, not a punishment.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
