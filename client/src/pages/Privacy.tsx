import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <h1 className="text-3xl font-display font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-white/80">Last updated: June 2025</p>
          </div>
        </div>
        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-3xl">
            <div className="card-base p-6 md:p-8 space-y-8">
              {[
                {
                  heading: "1. Who we are",
                  content: "PilotPath is a career guidance platform for aspiring pilots. We help users understand their training options and connect with flight schools. References to 'we', 'us' or 'our' in this policy refer to PilotPath.",
                },
                {
                  heading: "2. What data we collect",
                  content: "When you complete the career assessment, we collect: your name and email address (if provided), your assessment responses (age range, country, budget, training goals, etc.), your IP address and browser information for analytics purposes, and your consent preferences.",
                },
                {
                  heading: "3. How we use your data",
                  content: "We use your data to: generate your personalised pilot training roadmap, match you with relevant flight schools (only with your consent), send you relevant information about pilot training (only with your consent), improve our assessment and recommendations, and comply with legal obligations.",
                },
                {
                  heading: "4. Data sharing",
                  content: "We will only share your personal data with flight schools if you explicitly consent to this during the assessment. We do not sell your data to third parties. We may share anonymised, aggregated data with our school partners for market research purposes.",
                },
                {
                  heading: "5. Your rights",
                  content: "Under UK GDPR, you have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, withdraw consent at any time, and lodge a complaint with the Information Commissioner's Office (ICO). To exercise any of these rights, email us at privacy@pilotpath.co.uk.",
                },
                {
                  heading: "6. Data retention",
                  content: "We retain your assessment data for up to 24 months from the date of submission. You may request deletion at any time by contacting us.",
                },
                {
                  heading: "7. Cookies",
                  content: "We use essential cookies to operate the platform and analytics cookies to understand how users interact with our site. You can control cookie preferences through your browser settings.",
                },
                {
                  heading: "8. Contact",
                  content: "For privacy-related enquiries, email privacy@pilotpath.co.uk.",
                },
              ].map((section) => (
                <div key={section.heading}>
                  <h2 className="text-lg font-display font-bold text-[var(--color-navy)] mb-3">{section.heading}</h2>
                  <p className="text-[var(--color-foreground)] leading-relaxed text-sm">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
