import { useEffect } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact AviatorIQ";
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Contact Us</h1>
            <p className="text-lg text-white/80">Have a question about pilot training or AviatorIQ? We are here to help.</p>
          </div>
        </div>
        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div className="card-base p-6">
                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)] mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-[var(--color-navy)] mb-2">Take the assessment</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  The fastest way to get personalised guidance is to take the free career assessment. You will receive a tailored roadmap and matched schools within minutes.
                </p>
                <Link href="/quiz" className="btn-primary text-sm">Start assessment <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="card-base p-6">
                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)] mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-[var(--color-navy)] mb-2">Email us</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  For general enquiries, school partnership requests, or feedback about AviatorIQ, email us directly.
                </p>
                <a href="mailto:hello@aviatoriq.co.uk" className="btn-outline text-sm">hello@aviatoriq.co.uk</a>
              </div>
            </div>
            <div className="card-base p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-[var(--color-navy)] mb-4">Frequently asked questions</h2>
              <div className="space-y-5">
                {[
                  { q: "Is AviatorIQ free to use?", a: "Yes. The career assessment, personalised roadmap, school directory and all guides are completely free for aspiring pilots." },
                  { q: "How does AviatorIQ make money?", a: "We work with flight schools and training providers who pay to be featured in our directory and receive matched leads from the assessment." },
                  { q: "Will I be contacted by flight schools?", a: "Only if you consent during the assessment. You control whether your details are shared with schools." },
                  { q: "Is the AI roadmap accurate?", a: "The roadmap is generated based on your assessment responses and current training data. It is a guide, not a guarantee. Always verify costs and timelines with your chosen school." },
                ].map((item) => (
                  <div key={item.q} className="border-b border-[var(--color-border)] pb-5 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-[var(--color-navy)] mb-2">{item.q}</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
