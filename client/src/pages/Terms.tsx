import { useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Use – AviatorIQ";
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <h1 className="text-3xl font-display font-bold text-white mb-3">Terms of Use</h1>
            <p className="text-white/80">Last updated: June 2025</p>
          </div>
        </div>
        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-3xl">
            <div className="card-base p-6 md:p-8 space-y-8">
              {[
                {
                  heading: "1. Acceptance of terms",
                  content: "By using AviatorIQ, you agree to these terms. If you do not agree, please do not use our platform.",
                },
                {
                  heading: "2. Nature of the service",
                  content: "AviatorIQ provides career guidance information and school matching for aspiring pilots. The information on this platform is for general guidance only and does not constitute professional advice. Always verify information with your chosen school, the Civil Aviation Authority, and qualified advisers.",
                },
                {
                  heading: "3. Assessment and roadmap",
                  content: "The career assessment and AI-generated roadmap are tools to help you explore your options. They are based on the information you provide and general training data. We do not guarantee the accuracy of cost estimates, timelines, or school recommendations. Individual results will vary.",
                },
                {
                  heading: "4. School directory",
                  content: "Flight schools listed in our directory have provided their own information. We do not endorse any particular school and are not responsible for the accuracy of school-provided content. Always conduct your own due diligence before enrolling.",
                },
                {
                  heading: "5. User conduct",
                  content: "You agree not to: provide false information in the assessment, attempt to access other users' data, use the platform for any unlawful purpose, or attempt to disrupt or damage the platform.",
                },
                {
                  heading: "6. Intellectual property",
                  content: "All content on AviatorIQ, including guides, tools, and the assessment, is owned by AviatorIQ and protected by copyright. You may not reproduce or distribute our content without permission.",
                },
                {
                  heading: "7. Limitation of liability",
                  content: "AviatorIQ is not liable for any loss or damage arising from your use of the platform, reliance on information provided, or decisions made based on our recommendations. Our total liability to you shall not exceed £100.",
                },
                {
                  heading: "8. Changes to terms",
                  content: "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.",
                },
                {
                  heading: "9. Governing law",
                  content: "These terms are governed by English law. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
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
