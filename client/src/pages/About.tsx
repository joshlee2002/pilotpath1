import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Target, Shield, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="bg-hero py-12 px-4">
          <div className="container max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">About PilotPath</h1>
            <p className="text-lg text-white/80">Helping aspiring pilots find the right training route since day one.</p>
          </div>
        </div>
        <div className="bg-sky-subtle py-10 px-4">
          <div className="container max-w-3xl">
            <div className="card-base p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-display font-bold text-[var(--color-navy)] mb-4">Our mission</h2>
              <p className="text-[var(--color-foreground)] leading-relaxed mb-4">
                PilotPath exists to make the pilot training journey clearer, less daunting, and more accessible. We know that aspiring pilots face a bewildering array of choices — integrated or modular, which school, which country, how to fund it — and that the wrong decision can cost tens of thousands of pounds and years of time.
              </p>
              <p className="text-[var(--color-foreground)] leading-relaxed">
                Our free career assessment and AI-powered roadmap tool helps you cut through the noise and find the training route that genuinely fits your goals, budget and background.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {[
                { icon: <Target className="w-6 h-6" />, title: "Personalised guidance", desc: "Every roadmap is tailored to your specific profile — not generic advice." },
                { icon: <Shield className="w-6 h-6" />, title: "Your data, protected", desc: "We never sell your data. You control who contacts you." },
                { icon: <Users className="w-6 h-6" />, title: "School matching", desc: "Matched to schools that fit your budget, country and training goal." },
              ].map((item) => (
                <div key={item.title} className="card-base p-5 text-center">
                  <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center text-[var(--color-primary)] mx-auto mb-3">{item.icon}</div>
                  <h3 className="font-display font-bold text-[var(--color-navy)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="card-base p-6 bg-[var(--color-navy)] text-white text-center">
              <h3 className="font-display font-bold text-xl mb-2">Ready to find your route?</h3>
              <p className="text-white/70 text-sm mb-4">Take the free 5-minute assessment and get your personalised pilot training roadmap.</p>
              <Link href="/quiz" className="btn-cta text-sm">Start the assessment <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
