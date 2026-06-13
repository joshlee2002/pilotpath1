import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, CheckCircle2, ArrowRight, AlertTriangle, MapPin, Clock, PoundSterling, Shield, ChevronRight, Plane, Target, BookOpen, Users, Zap } from 'lucide-react';
import { roadmapQuestions, roadmapResults, PathId } from '../data/roadmap';
import SEO from '../components/SEO';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import { Link } from 'wouter';

const pathGradients: Record<PathId, { from: string; to: string; glow: string; badge: string; badgeText: string }> = {
  sponsored: {
    from: 'oklch(0.55 0.22 145)',
    to: 'oklch(0.40 0.20 165)',
    glow: 'oklch(0.55 0.22 145 / 0.35)',
    badge: 'oklch(0.55 0.22 145 / 0.15)',
    badgeText: 'oklch(0.75 0.20 145)',
  },
  integrated: {
    from: 'oklch(0.50 0.22 255)',
    to: 'oklch(0.38 0.20 270)',
    glow: 'oklch(0.50 0.22 255 / 0.35)',
    badge: 'oklch(0.50 0.22 255 / 0.15)',
    badgeText: 'oklch(0.72 0.18 255)',
  },
  modular: {
    from: 'oklch(0.65 0.20 50)',
    to: 'oklch(0.52 0.22 35)',
    glow: 'oklch(0.65 0.20 50 / 0.35)',
    badge: 'oklch(0.65 0.20 50 / 0.15)',
    badgeText: 'oklch(0.82 0.16 55)',
  },
  hybrid: {
    from: 'oklch(0.58 0.22 300)',
    to: 'oklch(0.42 0.20 320)',
    glow: 'oklch(0.58 0.22 300 / 0.35)',
    badge: 'oklch(0.58 0.22 300 / 0.15)',
    badgeText: 'oklch(0.76 0.18 300)',
  },
  future: {
    from: 'oklch(0.60 0.22 200)',
    to: 'oklch(0.45 0.20 220)',
    glow: 'oklch(0.60 0.22 200 / 0.35)',
    badge: 'oklch(0.60 0.22 200 / 0.15)',
    badgeText: 'oklch(0.78 0.18 200)',
  },
};

const pathIcons: Record<PathId, string> = {
  sponsored: '🏆',
  integrated: '⚡',
  modular: '🧩',
  hybrid: '🤝',
  future: '🚀',
};

export default function RoadmapGenerator() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PathId | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calcPhase, setCalcPhase] = useState(0);

  const handleStart = () => setCurrentStep(0);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentStep < roadmapQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 280);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    setIsCalculating(true);
    setCurrentStep(roadmapQuestions.length);
    setCalcPhase(0);

    const scores: Record<PathId, number> = { sponsored: 0, integrated: 0, modular: 0, hybrid: 0, future: 0 };
    roadmapQuestions.forEach(q => {
      const option = q.options.find(o => o.value === finalAnswers[q.id]);
      if (option?.points) {
        Object.entries(option.points).forEach(([path, pts]) => { scores[path as PathId] += pts as number; });
      }
    });

    let winningPath: PathId = 'modular';
    const budget = finalAnswers['budget'];
    const time = finalAnswers['time'];
    const relocation = finalAnswers['relocation'];
    const education = finalAnswers['education'];
    const age = finalAnswers['age'];

    if (age === 'under18') {
      winningPath = 'future';
    } else if (budget === 'low' && education !== 'none') {
      // No money → aim for sponsored cadet
      winningPath = 'sponsored';
    } else if (budget === 'veryhigh' && time === 'fulltime') {
      // £90k+ and full-time → UK integrated
      winningPath = 'integrated';
    } else if (budget === 'veryhigh_eu' && time === 'fulltime' && relocation === 'yes') {
      // £70–90k + willing to relocate → European integrated is viable
      winningPath = 'integrated';
    } else if (budget === 'veryhigh_eu' && time === 'fulltime' && relocation === 'no') {
      // £70–90k but UK only → modular is safer (UK integrated is a stretch)
      winningPath = 'modular';
    } else if ((budget === 'medium' || budget === 'high') && relocation === 'yes') {
      // £10–70k + willing to relocate → airline-bonded hybrid
      winningPath = 'hybrid';
    } else if (time === 'parttime') {
      // Needs to keep working → modular only real option
      winningPath = 'modular';
    } else {
      let maxScore = -1;
      Object.entries(scores).forEach(([path, score]) => {
        if (score > maxScore) { maxScore = score; winningPath = path as PathId; }
      });
    }

    // Animate through calculation phases
    setTimeout(() => setCalcPhase(1), 600);
    setTimeout(() => setCalcPhase(2), 1300);
    setTimeout(() => setCalcPhase(3), 2000);
    setTimeout(() => { setResult(winningPath); setIsCalculating(false); }, 2800);
  };

  const handleShare = async () => {
    const text = `I just got my personalised pilot training roadmap from AviatorIQ — my path is: ${roadmapResults[result!].title}. Get yours free:`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'My Pilot Training Roadmap — AviatorIQ', text, url }); } catch {}
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const reset = () => { setCurrentStep(-1); setAnswers({}); setResult(null); setCalcPhase(0); };

  const grad = result ? pathGradients[result] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.08 252)' }}>
      <SEO
        title="Personalised Pilot Training Roadmap | AviatorIQ"
        description="Answer 5 questions. Get a data-driven, personalised pilot training roadmap — costs, timeline, matched schools, and a step-by-step action plan built for your exact situation."
      />
      <PublicNav />

      <main className="flex-1">
        <AnimatePresence mode="wait">

          {/* ─── INTRO SCREEN ─── */}
          {currentStep === -1 && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              {/* Hero */}
              <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, oklch(0.45 0.18 240 / 0.12) 0%, transparent 70%)' }} />

                <div className="container max-w-4xl text-center relative py-20 px-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8" style={{ background: 'oklch(0.45 0.18 240 / 0.12)', border: '1px solid oklch(0.45 0.18 240 / 0.25)', color: 'oklch(0.65 0.18 240)' }}>
                      <Plane className="w-3.5 h-3.5" />
                      Free · Personalised · 2 Minutes
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6" style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                      Find Your Path<br />
                      <span style={{ background: 'linear-gradient(135deg, oklch(0.65 0.18 240), oklch(0.72 0.18 200))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        to the Flight Deck
                      </span>
                    </h1>
                    <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                      The internet is full of generic advice. Answer 5 honest questions about your age, budget, and timeline — and we'll generate a highly specific, data-driven training roadmap built for your exact situation.
                    </p>
                  </motion.div>

                  {/* Feature pills */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-wrap justify-center gap-3 mb-12">
                    {[
                      { icon: <PoundSterling className="w-4 h-4" />, label: 'Real 2026 costs' },
                      { icon: <Clock className="w-4 h-4" />, label: 'Realistic timelines' },
                      { icon: <MapPin className="w-4 h-4" />, label: 'Matched schools' },
                      { icon: <Target className="w-4 h-4" />, label: '5-step action plan' },
                      { icon: <Shield className="w-4 h-4" />, label: 'Risk assessment' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.08)', color: 'oklch(0.75 0.04 240)' }}>
                        <span style={{ color: 'oklch(0.65 0.18 240)' }}>{f.icon}</span>
                        {f.label}
                      </div>
                    ))}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <button
                      onClick={handleStart}
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white transition-all duration-200 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, oklch(0.50 0.22 255), oklch(0.45 0.20 240))', boxShadow: '0 0 40px oklch(0.50 0.22 255 / 0.4), 0 8px 32px oklch(0 0 0 / 0.3)' }}
                    >
                      <Zap className="w-5 h-5" />
                      Generate My Roadmap
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="mt-4 text-sm" style={{ color: 'oklch(0.45 0.04 240)' }}>Free. No email required. Takes 2 minutes.</p>
                  </motion.div>

                  {/* Social proof */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 flex flex-wrap justify-center gap-8">
                    {[
                      { value: '5 Paths', label: 'Researched routes' },
                      { value: '2026', label: 'Updated costs' },
                      { value: '100%', label: 'Free to use' },
                    ].map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl font-display font-bold text-white">{s.value}</div>
                        <div className="text-sm mt-1" style={{ color: 'oklch(0.45 0.04 240)' }}>{s.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── QUESTION FLOW ─── */}
          {currentStep >= 0 && currentStep < roadmapQuestions.length && (
            <motion.div key={`q-${currentStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
              className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
              style={{ background: 'linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.12 0.08 252) 100%)' }}
            >
              <div className="w-full max-w-2xl">
                {/* Progress */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium" style={{ color: 'oklch(0.55 0.04 240)' }}>
                      Question {currentStep + 1} of {roadmapQuestions.length}
                    </span>
                    <span className="text-sm font-bold" style={{ color: 'oklch(0.65 0.18 240)' }}>
                      {Math.round(((currentStep + 1) / roadmapQuestions.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'oklch(1 0 0 / 0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, oklch(0.50 0.22 255), oklch(0.60 0.22 200))' }}
                      initial={{ width: `${(currentStep / roadmapQuestions.length) * 100}%` }}
                      animate={{ width: `${((currentStep + 1) / roadmapQuestions.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  {/* Step dots */}
                  <div className="flex justify-between mt-3">
                    {roadmapQuestions.map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{ background: i <= currentStep ? 'oklch(0.65 0.18 240)' : 'oklch(1 0 0 / 0.1)' }} />
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8" style={{ letterSpacing: '-0.02em' }}>
                  {roadmapQuestions[currentStep].title}
                </h2>

                <div className="space-y-3">
                  {roadmapQuestions[currentStep].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      onClick={() => handleAnswer(roadmapQuestions[currentStep].id, option.value)}
                      className="w-full text-left p-5 rounded-2xl transition-all duration-200 group flex items-center justify-between"
                      style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.08)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'oklch(0.50 0.22 255 / 0.12)';
                        (e.currentTarget as HTMLElement).style.border = '1px solid oklch(0.50 0.22 255 / 0.35)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'oklch(1 0 0 / 0.04)';
                        (e.currentTarget as HTMLElement).style.border = '1px solid oklch(1 0 0 / 0.08)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                      }}
                    >
                      <span className="text-lg text-white/80 group-hover:text-white font-medium transition-colors">{option.label}</span>
                      <ChevronRight className="w-5 h-5 flex-shrink-0 transition-all" style={{ color: 'oklch(0.40 0.04 240)' }} />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── CALCULATING ─── */}
          {isCalculating && (
            <motion.div key="calculating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-4"
              style={{ background: 'linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.12 0.08 252) 100%)' }}
            >
              <div className="text-center max-w-md">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 animate-spin" style={{ borderColor: 'oklch(0.50 0.22 255 / 0.15)', borderTopColor: 'oklch(0.65 0.18 240)' }} />
                  <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.50 0.22 255 / 0.1)' }}>
                    <Plane className="w-6 h-6" style={{ color: 'oklch(0.65 0.18 240)' }} />
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">Analysing your profile…</h3>
                <div className="space-y-2 mt-6">
                  {[
                    'Cross-referencing 2026 training costs…',
                    'Matching airline cadet requirements…',
                    'Building your personalised roadmap…',
                  ].map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: calcPhase > i ? 1 : 0.2, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-sm py-1"
                      style={{ color: calcPhase > i ? 'oklch(0.75 0.04 240)' : 'oklch(0.35 0.04 240)' }}
                    >
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: calcPhase > i ? 'oklch(0.55 0.22 145 / 0.2)' : 'oklch(1 0 0 / 0.05)', border: `1px solid ${calcPhase > i ? 'oklch(0.55 0.22 145 / 0.4)' : 'oklch(1 0 0 / 0.1)'}` }}
                      >
                        {calcPhase > i && <CheckCircle2 className="w-2.5 h-2.5" style={{ color: 'oklch(0.65 0.20 145)' }} />}
                      </div>
                      {msg}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {result && !isCalculating && grad && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Result Hero — full-width immersive banner */}
              <div className="relative overflow-hidden py-20 px-4" style={{ background: `linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.13 0.10 252) 100%)` }}>
                {/* Glow orb */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${grad.glow} 0%, transparent 65%)` }} />
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(oklch(1 0 0 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.02) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />

                <div className="container max-w-3xl text-center relative">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    {/* Path icon */}
                    <div className="text-6xl mb-5">{pathIcons[result]}</div>

                    {/* Tagline badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-5"
                      style={{ background: grad.badge, border: `1px solid ${grad.badgeText}40`, color: grad.badgeText }}>
                      {roadmapResults[result].tagline}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
                      {roadmapResults[result].title}
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'oklch(0.70 0.04 240)' }}>
                      {roadmapResults[result].description}
                    </p>
                  </motion.div>

                  {/* Key metrics — 3 big stats */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                    {[
                      { icon: <PoundSterling className="w-5 h-5" />, label: 'Estimated Cost', value: roadmapResults[result].cost },
                      { icon: <Clock className="w-5 h-5" />, label: 'Timeline', value: roadmapResults[result].timeline },
                      { icon: <Shield className="w-5 h-5" />, label: 'Financial Risk', value: roadmapResults[result].risk },
                    ].map((stat, i) => (
                      <div key={i} className="p-6 rounded-2xl text-center"
                        style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.08)', backdropFilter: 'blur(12px)' }}>
                        <div className="flex justify-center mb-2" style={{ color: grad.badgeText }}>{stat.icon}</div>
                        <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'oklch(0.45 0.04 240)' }}>{stat.label}</div>
                        <div className="text-lg font-display font-bold text-white leading-tight">{stat.value}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* ─── CONTENT SECTIONS ─── */}
              <div style={{ background: 'oklch(0.11 0.08 252)' }}>
                <div className="container max-w-3xl px-4 py-16 space-y-12">

                  {/* 5-Step Action Plan */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: grad.badge, border: `1px solid ${grad.badgeText}30` }}>
                        <Target className="w-4 h-4" style={{ color: grad.badgeText }} />
                      </div>
                      <h2 className="text-xl font-display font-bold text-white">Your 5-Step Action Plan</h2>
                    </div>
                    <div className="space-y-3">
                      {roadmapResults[result].steps.map((step, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.08 }}
                          className="flex items-start gap-4 p-5 rounded-2xl"
                          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.07)' }}>
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: grad.badge, border: `1px solid ${grad.badgeText}40`, color: grad.badgeText }}>
                            {idx + 1}
                          </div>
                          <p className="text-white/75 leading-relaxed pt-1 flex-1">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Matched Programmes */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: grad.badge, border: `1px solid ${grad.badgeText}30` }}>
                        <BookOpen className="w-4 h-4" style={{ color: grad.badgeText }} />
                      </div>
                      <h2 className="text-xl font-display font-bold text-white">Matched Programmes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {roadmapResults[result].schools.map((school, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + idx * 0.08 }}
                          className="p-5 rounded-2xl"
                          style={{ background: 'oklch(1 0 0 / 0.04)', border: '1px solid oklch(1 0 0 / 0.08)' }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: grad.badge }}>
                            <Plane className="w-4 h-4" style={{ color: grad.badgeText }} />
                          </div>
                          <h3 className="font-display font-bold text-white mb-2 text-sm">{school.name}</h3>
                          <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.50 0.04 240)' }}>{school.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Reality Check */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                    <div className="p-6 rounded-2xl" style={{ background: 'oklch(0.65 0.20 50 / 0.08)', border: '1px solid oklch(0.65 0.20 50 / 0.25)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.75 0.18 55)' }} />
                        <h3 className="font-display font-bold text-base" style={{ color: 'oklch(0.82 0.16 55)' }}>Reality Check</h3>
                      </div>
                      <p className="leading-relaxed" style={{ color: 'oklch(0.70 0.08 55)' }}>{roadmapResults[result].watchOut}</p>
                    </div>
                  </motion.div>

                  {/* Primary CTA — Free Assessment */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                    <div className="p-8 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.17 0.10 248))', border: '1px solid oklch(0.55 0.18 240 / 0.25)' }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.2 45))', boxShadow: '0 0 30px oklch(0.72 0.18 65 / 0.3)' }}>
                        <Plane className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white mb-3">Want your full personalised assessment?</h3>
                      <p className="text-sm mb-2 max-w-md mx-auto" style={{ color: 'oklch(0.60 0.04 240)' }}>
                        This roadmap is a starting point. The Free Assessment goes much deeper — it analyses your exact barriers, scores you across 5 dimensions, matches you with specific schools, and generates an AI-powered PDF roadmap you can keep and share.
                      </p>
                      <p className="text-xs mb-6 font-semibold" style={{ color: 'oklch(0.65 0.18 240)' }}>Free · Takes 5 minutes · No obligation</p>
                      <Link href="/quiz"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:scale-[1.02] w-full sm:w-auto no-underline"
                        style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.62 0.2 45))', boxShadow: '0 4px 24px oklch(0.72 0.18 65 / 0.35)' }}
                      >
                        <Plane className="w-5 h-5" />
                        Get My Free Pilot Assessment
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <Link href="/schools" className="inline-flex items-center gap-1 text-xs no-underline transition-all" style={{ color: 'oklch(0.50 0.04 240)' }}>
                          Browse Schools <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span style={{ color: 'oklch(0.30 0 0)' }}>·</span>
                        <Link href="/calculator" className="inline-flex items-center gap-1 text-xs no-underline transition-all" style={{ color: 'oklch(0.50 0.04 240)' }}>
                          Cost Calculator <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span style={{ color: 'oklch(0.30 0 0)' }}>·</span>
                        <Link href="/guides" className="inline-flex items-center gap-1 text-xs no-underline transition-all" style={{ color: 'oklch(0.50 0.04 240)' }}>
                          Training Guides <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>

                  {/* Share + Recalculate */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button onClick={handleShare}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`, boxShadow: `0 0 24px ${grad.glow}`, color: 'white' }}>
                      <Share2 className="w-4 h-4" />
                      {copied ? '✓ Link Copied!' : 'Share My Roadmap'}
                    </button>
                    <button onClick={reset}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: 'oklch(1 0 0 / 0.05)', border: '1px solid oklch(1 0 0 / 0.10)', color: 'oklch(0.55 0.04 240)' }}>
                      Recalculate Roadmap
                    </button>
                  </motion.div>

                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {result && !isCalculating && <PublicFooter />}
    </div>
  );
}
