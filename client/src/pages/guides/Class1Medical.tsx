import GuideLayout from "@/components/GuideLayout";

const related = [
  { title: "How to become a pilot", href: "/guides/how-to-become-a-pilot", time: "8 min read" },
  { title: "Best route to airline", href: "/guides/best-route-to-airline", time: "6 min read" },
  { title: "Training timeline", href: "/guides/training-timeline", time: "5 min read" },
];

export default function Class1Medical() {
  return (
    <GuideLayout
      title="Class 1 Medical Certificate Guide"
      subtitle="Everything you need to know about the Class 1 Medical — what it tests, how to pass it, and what to do if you have a health condition."
      readTime="5 min read"
      relatedGuides={related}
      ctaText="Check your readiness with the assessment"
      sections={[
        {
          heading: "What is a Class 1 Medical?",
          content: (
            <>
              <p>A Class 1 Medical Certificate is a mandatory requirement for anyone training to fly commercially. It is issued by a Civil Aviation Authority (CAA) approved Aviation Medical Examiner (AME) and confirms that you meet the medical standards required to hold a commercial pilot licence.</p>
              <p>In the UK, Class 1 Medicals are issued by the UK CAA. In Europe, they are issued by EASA-approved AMEs. The standards are largely equivalent and mutually recognised.</p>
            </>
          ),
        },
        {
          heading: "What does the Class 1 Medical test?",
          content: (
            <>
              <p>The examination covers several areas:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Vision:</strong> Visual acuity, colour vision, depth perception, and field of vision. Corrective lenses are permitted within defined limits.</li>
                <li><strong>Hearing:</strong> Pure tone audiometry to assess hearing ability at various frequencies.</li>
                <li><strong>Cardiovascular:</strong> ECG, blood pressure, and general heart health. More extensive cardiac testing for applicants over 40.</li>
                <li><strong>Respiratory:</strong> Lung function tests.</li>
                <li><strong>Neurological:</strong> Assessment for conditions that could affect flying safety.</li>
                <li><strong>Psychiatric:</strong> Mental health screening and history review.</li>
                <li><strong>General health:</strong> Blood tests, urine analysis, BMI, and overall physical examination.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "How much does it cost and where do I get one?",
          content: (
            <>
              <p>A Class 1 Medical in the UK typically costs <strong>£500–£800</strong> for the initial examination. Renewal costs are lower (£200–£400). The examination must be conducted at a CAA-approved Aeromedical Centre (AMC) or by an approved AME.</p>
              <p>The main UK CAA Aeromedical Centre is at Gatwick Airport. There are also approved AMEs across the UK. Book directly through the CAA website or through an approved AME.</p>
            </>
          ),
        },
        {
          heading: "What if I have a health condition?",
          content: (
            <>
              <p>Many common health conditions do not automatically disqualify you from a Class 1 Medical. The CAA takes a case-by-case approach and may issue a certificate with limitations or require additional testing.</p>
              <p>Conditions that are commonly managed include: corrected vision, controlled hypertension, some forms of diabetes, and certain mental health conditions with appropriate treatment and monitoring. Colour blindness may restrict the type of licence you can hold.</p>
              <p>If you have a known health condition, it is strongly recommended to seek an informal opinion from an AME before committing to expensive training. This is called an <strong>informal medical assessment</strong> and can save significant time and money.</p>
            </>
          ),
        },
        {
          heading: "When should I get my Class 1 Medical?",
          content: (
            <>
              <p>The most important advice is: <strong>get your Class 1 Medical before you start training</strong>. Discovering a disqualifying condition after spending £10,000–£80,000 on training would be devastating.</p>
              <p>Most flight schools require evidence of a valid Class 1 Medical before enrolling you on a commercial training programme. Some schools offer a provisional place subject to medical clearance.</p>
              <p>The Class 1 Medical is valid for 12 months initially (6 months for pilots over 40 operating commercial air transport). It must be renewed regularly throughout your career.</p>
            </>
          ),
        },
        {
          heading: "Class 1 vs Class 2 Medical",
          content: (
            <>
              <p>A <strong>Class 2 Medical</strong> is required for a Private Pilot Licence (PPL) and is less stringent than a Class 1. If your goal is recreational flying only, a Class 2 is sufficient.</p>
              <p>A <strong>Class 1 Medical</strong> is required for all commercial licences including CPL and ATPL. If you aspire to fly commercially, you must hold a Class 1.</p>
              <p>Note: A Class 1 Medical also satisfies the requirements for a Class 2, so you do not need both.</p>
            </>
          ),
        },
      ]}
    />
  );
}
