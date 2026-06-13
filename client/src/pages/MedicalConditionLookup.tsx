import { useState, useRef } from "react";
import { Link } from "wouter";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import { Search, AlertTriangle, CheckCircle2, XCircle, HelpCircle, ChevronRight, ArrowRight, Info } from "lucide-react";

// ─── Condition database ───────────────────────────────────────────────────────
// Each entry: keywords (for matching), verdict, explanation, caveats, source
type Verdict = "likely_ok" | "case_by_case" | "likely_disqualifying" | "unknown";

interface ConditionEntry {
  name: string;
  keywords: string[];
  verdict: Verdict;
  summary: string;
  detail: string;
  caveats?: string;
  source?: string;
}

const CONDITIONS: ConditionEntry[] = [
  {
    name: "Asthma",
    keywords: ["asthma", "asthmatic", "bronchial asthma", "reactive airway"],
    verdict: "case_by_case",
    summary: "Mild, well-controlled asthma is generally acceptable. Severe or poorly controlled asthma may not be.",
    detail: "The CAA assesses asthma on a case-by-case basis. Mild asthma that is well-controlled with minimal medication (e.g. a low-dose inhaler used infrequently) is usually acceptable for a Class 1 Medical. Severe asthma, frequent use of oral steroids, or asthma requiring hospital admission will require further assessment. You must declare all asthma medication. Some medications (e.g. oral corticosteroids) may themselves be disqualifying.",
    caveats: "You must disclose all asthma history and current medication at your medical. Do not attempt to conceal it — this is a serious offence.",
    source: "CAA AMS Policy — Respiratory",
  },
  {
    name: "ADHD (Attention Deficit Hyperactivity Disorder)",
    keywords: ["adhd", "attention deficit", "hyperactivity", "add", "attention deficit hyperactivity"],
    verdict: "case_by_case",
    summary: "ADHD is not automatically disqualifying, but ADHD medication (stimulants) is not permitted while flying.",
    detail: "A diagnosis of ADHD does not automatically prevent you from obtaining a Class 1 Medical. However, the standard ADHD medications — methylphenidate (Ritalin, Concerta) and amphetamine-based drugs (Adderall, Vyvanse) — are not approved for use by pilots. If you have ADHD and are not on medication, or have been off medication for a significant period with no functional impairment, the CAA may consider your application. A neuropsychological assessment is typically required. Each case is assessed individually by the CAA's Aeromedical Section.",
    caveats: "If you are currently taking stimulant medication for ADHD, you will need to discuss cessation with your psychiatrist well in advance of applying. Do not stop medication without medical advice.",
    source: "CAA AMS Policy — Psychiatry/Neurology",
  },
  {
    name: "Colour Blindness",
    keywords: ["colour blind", "color blind", "colour blindness", "color blindness", "colour deficiency", "color deficiency", "cvd", "deuteranopia", "protanopia", "tritanopia", "red green colour", "red green color"],
    verdict: "case_by_case",
    summary: "Colour vision deficiency does not automatically disqualify you, but you must pass specific colour vision tests.",
    detail: "The CAA requires pilots to have 'safe colour vision'. If you fail the Ishihara test (the standard dot test), you are not automatically disqualified. You will be referred for further testing including the CAD (Colour Assessment and Diagnosis) test at City University London. If you pass the CAD test at the required level, you can be issued a Class 1 Medical with a limitation: 'Valid only when the holder wears colour correcting lenses' or 'OML — valid only with co-pilot who has normal colour vision'. The specific limitation depends on your result. Severe colour vision deficiency (e.g. achromatopsia) is disqualifying.",
    caveats: "The CAD test is the definitive test for pilots. Book it early — there can be a waiting list. The result determines what, if any, operational limitations apply.",
    source: "CAA AMS Policy — Colour Vision; CAD Test (City University London)",
  },
  {
    name: "Diabetes",
    keywords: ["diabetes", "diabetic", "type 1 diabetes", "type 2 diabetes", "insulin", "metformin", "blood sugar", "hyperglycaemia", "hypoglycaemia"],
    verdict: "case_by_case",
    summary: "Type 2 diabetes controlled by diet or metformin may be acceptable. Insulin-treated diabetes has strict requirements.",
    detail: "Type 2 diabetes managed by diet alone or with metformin is generally acceptable for a Class 1 Medical, subject to satisfactory HbA1c levels and no complications. Insulin-treated diabetes (Type 1 or Type 2) was historically disqualifying for Class 1, but EASA regulations now permit insulin-treated diabetic pilots to hold a Class 1 Medical under strict conditions: stable insulin regimen, no hypoglycaemic episodes, regular monitoring, and specific operational limitations (must fly with a co-pilot who is aware of the condition). This is a complex area — early engagement with the CAA's Aeromedical Section is strongly recommended.",
    caveats: "Diabetic complications (retinopathy, neuropathy, nephropathy) may be separately disqualifying. All medications must be declared.",
    source: "CAA AMS Policy — Endocrinology; EASA Part-MED",
  },
  {
    name: "Depression",
    keywords: ["depression", "depressive", "major depressive", "low mood", "antidepressant", "ssri", "sertraline", "fluoxetine", "citalopram", "escitalopram", "venlafaxine"],
    verdict: "case_by_case",
    summary: "A history of depression is not automatically disqualifying. Certain antidepressants are now permitted in some circumstances.",
    detail: "The CAA assesses depression on a case-by-case basis. A single episode of mild-to-moderate depression that has fully resolved may not prevent you from obtaining a Class 1 Medical. Recurrent, severe, or treatment-resistant depression is more likely to be disqualifying. Regarding medication: since 2015, EASA has permitted pilots to fly while taking certain SSRIs (sertraline, citalopram, escitalopram, fluoxetine) subject to a stability period and satisfactory assessment. Not all antidepressants are approved. A psychiatric assessment is typically required.",
    caveats: "Honesty is essential. Concealing a mental health history is a serious offence and can result in licence revocation. The CAA's approach to mental health has become significantly more supportive in recent years.",
    source: "CAA AMS Policy — Psychiatry; EASA AMC/GM Part-MED",
  },
  {
    name: "Anxiety",
    keywords: ["anxiety", "anxious", "anxiety disorder", "gad", "generalised anxiety", "panic attacks", "panic disorder", "social anxiety", "phobia"],
    verdict: "case_by_case",
    summary: "Mild anxiety that is well-managed may be acceptable. Severe or disabling anxiety disorders are more likely to be disqualifying.",
    detail: "Anxiety disorders are assessed individually by the CAA. Mild, situational anxiety that has resolved without medication may not be a barrier. Generalised Anxiety Disorder (GAD), panic disorder, or anxiety requiring ongoing medication requires careful assessment. Some medications used for anxiety (benzodiazepines, beta-blockers) are not permitted for pilots. The CAA's approach to mental health has become more nuanced — early, honest engagement with an Aeromedical Examiner (AME) is the best approach.",
    caveats: "Do not attempt to hide anxiety history. The CAA is more likely to work with you if you are transparent from the outset.",
    source: "CAA AMS Policy — Psychiatry",
  },
  {
    name: "Epilepsy",
    keywords: ["epilepsy", "epileptic", "seizure", "seizures", "fits", "convulsions", "tonic clonic", "absence seizure", "febrile convulsion"],
    verdict: "likely_disqualifying",
    summary: "Epilepsy is generally disqualifying for a Class 1 Medical. A single unprovoked seizure may also be disqualifying.",
    detail: "Epilepsy is one of the most significant medical conditions for pilots. A diagnosis of epilepsy is generally disqualifying for a Class 1 Medical. A single unprovoked seizure (without a subsequent diagnosis of epilepsy) may be considered after a seizure-free period (typically 4–10 years depending on circumstances). Provoked seizures (e.g. from a head injury, fever, or drug/alcohol withdrawal) may be assessed differently. Anti-epileptic medication is not permitted for pilots. If you have had a seizure, you must disclose it and engage with the CAA's Aeromedical Section for individual assessment.",
    caveats: "Childhood febrile convulsions are treated differently from adult seizures and may not be disqualifying. Always disclose and seek individual assessment.",
    source: "CAA AMS Policy — Neurology",
  },
  {
    name: "Hearing Loss",
    keywords: ["hearing loss", "deaf", "deafness", "hearing impairment", "tinnitus", "hearing aid", "otosclerosis", "meniere"],
    verdict: "case_by_case",
    summary: "Mild hearing loss may be acceptable with a hearing aid. Severe hearing loss is more likely to be disqualifying.",
    detail: "Pilots must meet minimum hearing standards. The Class 1 Medical requires you to hear a conversational voice at 2 metres in a quiet room. Audiometric testing is required. Mild-to-moderate hearing loss that is correctable with a hearing aid may be acceptable — pilots can fly with a hearing aid with an appropriate limitation. Severe hearing loss, particularly at speech frequencies, is more likely to be disqualifying. Tinnitus alone is generally not disqualifying unless it causes significant functional impairment. Meniere's disease (vertigo + hearing loss) is typically disqualifying due to the unpredictable vertigo component.",
    caveats: "Hearing aids are permitted in the cockpit. The key test is whether you can hear ATC communications reliably.",
    source: "CAA AMS Policy — ENT",
  },
  {
    name: "Vision / Eyesight",
    keywords: ["short sighted", "long sighted", "myopia", "hyperopia", "hypermetropia", "astigmatism", "glasses", "contact lenses", "laser eye surgery", "lasik", "prk", "vision", "eyesight", "visual acuity"],
    verdict: "likely_ok",
    summary: "Corrected vision requirements are achievable for most people. Glasses and contact lenses are permitted.",
    detail: "The Class 1 Medical has specific vision standards. Corrected visual acuity must be at least 6/9 in each eye and 6/6 binocularly. Uncorrected vision must be at least 6/60. Glasses and contact lenses are permitted — most pilots wear them. Laser eye surgery (LASIK, PRK) is generally acceptable after a stability period (typically 3–6 months post-surgery with stable refraction). There are limits on the degree of refractive error: myopia must not exceed -6.00 dioptres, hyperopia must not exceed +5.00 dioptres. Significant astigmatism may require assessment. Colour vision is assessed separately.",
    caveats: "If you have had laser eye surgery, you must declare it and provide surgical records. The CAA has specific guidance on post-refractive surgery assessment.",
    source: "CAA AMS Policy — Ophthalmology",
  },
  {
    name: "Heart Condition / Cardiac",
    keywords: ["heart", "cardiac", "heart attack", "myocardial infarction", "arrhythmia", "atrial fibrillation", "afib", "svt", "heart murmur", "palpitations", "coronary artery disease", "angina", "bypass", "stent", "pacemaker", "ecg", "ekg", "cardiomyopathy", "heart failure"],
    verdict: "case_by_case",
    summary: "Cardiac conditions are assessed individually. Some are acceptable with treatment; others are disqualifying.",
    detail: "Cardiac conditions are one of the most complex areas of aviation medicine. The CAA assesses each condition individually. A history of myocardial infarction (heart attack) may be acceptable after a recovery period and satisfactory cardiac investigations. Atrial fibrillation (AF) may be acceptable if well-controlled. Significant coronary artery disease, cardiomyopathy, or heart failure is more likely to be disqualifying. Pacemakers: some types are acceptable for Class 1, others are not. The CAA requires regular cardiac investigations (ECG, stress test, echocardiogram) for many cardiac conditions. Early engagement with an AME and cardiologist is essential.",
    caveats: "Cardiac conditions require individual assessment. Do not assume disqualification without consulting an AME — many pilots with treated cardiac conditions hold Class 1 Medicals.",
    source: "CAA AMS Policy — Cardiology",
  },
  {
    name: "High Blood Pressure (Hypertension)",
    keywords: ["high blood pressure", "hypertension", "hypertensive", "blood pressure medication", "amlodipine", "lisinopril", "ramipril", "atenolol", "bisoprolol"],
    verdict: "likely_ok",
    summary: "Controlled hypertension is generally acceptable. Most blood pressure medications are permitted.",
    detail: "Hypertension (high blood pressure) is very common and generally acceptable for a Class 1 Medical if well-controlled. Blood pressure must be below 160/100 mmHg at the medical examination. Most antihypertensive medications are approved for pilots, including ACE inhibitors, calcium channel blockers, and thiazide diuretics. Beta-blockers are generally acceptable but may require additional assessment. Uncontrolled hypertension, or hypertension with end-organ damage (e.g. kidney disease, heart disease, stroke), requires more detailed assessment.",
    caveats: "You must declare all blood pressure medication. The CAA will want to see that your blood pressure is stable and well-controlled.",
    source: "CAA AMS Policy — Cardiology",
  },
  {
    name: "Mental Health History",
    keywords: ["mental health", "psychiatric", "psychiatry", "bipolar", "schizophrenia", "psychosis", "borderline personality", "bpd", "ptsd", "post traumatic", "ocd", "obsessive compulsive", "eating disorder", "anorexia", "bulimia", "self harm", "suicide", "suicidal"],
    verdict: "case_by_case",
    summary: "Mental health history is assessed individually. Many conditions are manageable; some are disqualifying.",
    detail: "Mental health is assessed on a case-by-case basis. The CAA has moved significantly towards a more supportive approach in recent years, recognising that untreated mental health conditions are a greater safety risk than treated ones. Conditions such as bipolar disorder, schizophrenia, and psychosis are generally disqualifying. PTSD, OCD, and personality disorders are assessed individually. A history of self-harm or suicidal ideation requires careful assessment. The key factors are: current stability, insight, treatment compliance, and functional capacity. A psychiatric assessment is typically required for any significant mental health history.",
    caveats: "Honesty is the most important thing. The CAA's Aeromedical Section is experienced in working with pilots with mental health histories. Concealment is far more dangerous to your career than disclosure.",
    source: "CAA AMS Policy — Psychiatry",
  },
  {
    name: "Kidney Disease / Renal",
    keywords: ["kidney", "renal", "kidney disease", "kidney failure", "kidney stones", "nephrotic", "glomerulonephritis", "polycystic kidney", "dialysis", "kidney transplant"],
    verdict: "case_by_case",
    summary: "Mild kidney conditions may be acceptable. Significant kidney disease or dialysis is likely disqualifying.",
    detail: "Renal conditions are assessed individually. Mild chronic kidney disease (CKD Stage 1–2) with stable function may be acceptable. More advanced CKD, dialysis, or kidney transplant is more likely to be disqualifying due to the unpredictability of the condition and the medications involved. Kidney stones: a single episode that has fully resolved may be acceptable; recurrent stones require assessment. The CAA will want to see stable renal function and no medications that are themselves disqualifying.",
    source: "CAA AMS Policy — Renal",
  },
  {
    name: "Diabetes Type 1",
    keywords: ["type 1 diabetes", "t1d", "t1dm", "insulin dependent diabetes", "juvenile diabetes", "insulin pump"],
    verdict: "case_by_case",
    summary: "Type 1 diabetes is no longer automatically disqualifying under EASA rules, but strict conditions apply.",
    detail: "Since 2012, EASA regulations have permitted insulin-treated diabetic pilots to hold a Class 1 Medical under strict conditions. Requirements include: stable insulin regimen for at least 3 months, HbA1c within acceptable range, no severe hypoglycaemic episodes, regular blood glucose monitoring (including in-flight), and a multi-crew operational limitation (must fly with a co-pilot). The assessment process is complex and lengthy. You will need to engage with the CAA's Aeromedical Section and provide extensive medical documentation. This is achievable — there are Type 1 diabetic commercial pilots in the UK — but it requires significant preparation.",
    caveats: "Start the process early. The CAA assessment for insulin-treated diabetes can take 6–12 months. You will need a specialist diabetologist's support.",
    source: "CAA AMS Policy — Endocrinology; EASA Part-MED",
  },
  {
    name: "Sleep Apnoea",
    keywords: ["sleep apnoea", "sleep apnea", "obstructive sleep apnoea", "osa", "cpap", "snoring", "sleep disorder"],
    verdict: "case_by_case",
    summary: "Treated sleep apnoea (CPAP) may be acceptable. Untreated moderate-to-severe sleep apnoea is disqualifying.",
    detail: "Obstructive Sleep Apnoea (OSA) is increasingly recognised in aviation medicine. Untreated moderate-to-severe OSA is disqualifying due to the risk of excessive daytime sleepiness and cognitive impairment. However, OSA that is effectively treated with CPAP (continuous positive airway pressure) may be acceptable for a Class 1 Medical, subject to satisfactory compliance data and symptom control. You will need to demonstrate consistent CPAP use and symptom resolution. The CAA will typically require a sleep study report and CPAP compliance data.",
    caveats: "If you suspect you have sleep apnoea, get a diagnosis and start treatment before your medical. Treated OSA is much more likely to be acceptable than untreated.",
    source: "CAA AMS Policy — Respiratory/Sleep",
  },
  {
    name: "Back Pain / Spinal",
    keywords: ["back pain", "back injury", "spinal", "disc herniation", "disc prolapse", "sciatica", "scoliosis", "spondylosis", "lower back", "lumbar"],
    verdict: "case_by_case",
    summary: "Back conditions are assessed individually. Many are acceptable; severe or disabling conditions may not be.",
    detail: "Back pain and spinal conditions are common and assessed individually. Mild-to-moderate back pain that does not significantly impair function is generally acceptable. Disc herniation or prolapse that has resolved (with or without surgery) may be acceptable after a recovery period. Significant neurological deficits (e.g. foot drop, bladder/bowel dysfunction) from spinal conditions are more likely to be disqualifying. Scoliosis is generally acceptable unless severe. The key question is whether the condition could cause sudden incapacitation or significantly impair your ability to operate aircraft controls.",
    source: "CAA AMS Policy — Musculoskeletal",
  },
  {
    name: "Alcohol / Substance Use",
    keywords: ["alcohol", "alcoholism", "alcohol dependency", "substance abuse", "drug use", "cannabis", "cocaine", "addiction", "rehabilitation", "rehab", "detox"],
    verdict: "case_by_case",
    summary: "A history of alcohol or substance misuse requires individual assessment. Active dependency is disqualifying.",
    detail: "Active alcohol or substance dependency is disqualifying for a Class 1 Medical. A history of alcohol or substance misuse that has been fully resolved, with a sustained period of abstinence and no relapse, may be acceptable after individual assessment. The CAA will typically require evidence of treatment, sustained abstinence (usually 2+ years), and may impose monitoring conditions. Honesty is essential — the CAA's approach is to support recovery, not to punish it. Concealing a history of substance misuse is far more dangerous to your career than disclosing it.",
    caveats: "Random drug and alcohol testing is a condition of holding a pilot licence in the UK. Any positive test result will result in licence suspension.",
    source: "CAA AMS Policy — Psychiatry/Substance Misuse",
  },
  {
    name: "Cancer / Oncology",
    keywords: ["cancer", "tumour", "tumor", "oncology", "leukaemia", "leukemia", "lymphoma", "melanoma", "chemotherapy", "radiotherapy", "remission", "carcinoma"],
    verdict: "case_by_case",
    summary: "Cancer history is assessed individually. Many cancers in remission are acceptable; active treatment is not.",
    detail: "A history of cancer does not automatically disqualify you from a Class 1 Medical. The CAA assesses each case individually, considering the type of cancer, treatment received, time since treatment, and current status. Many pilots with a history of cancer (in full remission, with no ongoing treatment) hold Class 1 Medicals. Active cancer treatment (chemotherapy, radiotherapy) is generally disqualifying during treatment. Cancers with a high risk of sudden incapacitation (e.g. brain tumours) are more likely to be permanently disqualifying. The CAA will typically require oncology reports and a defined remission period.",
    source: "CAA AMS Policy — Oncology",
  },
  {
    name: "Head Injury / Brain Injury",
    keywords: ["head injury", "brain injury", "concussion", "tbi", "traumatic brain injury", "skull fracture", "brain surgery", "neurosurgery"],
    verdict: "case_by_case",
    summary: "Mild head injuries that have fully resolved may be acceptable. Significant brain injuries require detailed assessment.",
    detail: "Head injuries are assessed individually. A mild concussion that has fully resolved with no ongoing symptoms is generally acceptable. Significant traumatic brain injury (TBI), skull fracture, or brain surgery requires detailed neurological assessment including neuropsychological testing and neuroimaging. The key concerns are: risk of post-traumatic epilepsy, cognitive impairment, and neurological deficits. The CAA will typically require a neurologist's report and may require a seizure-free period before granting a Class 1 Medical.",
    source: "CAA AMS Policy — Neurology",
  },
  {
    name: "HIV",
    keywords: ["hiv", "aids", "antiretroviral", "art", "hiv positive"],
    verdict: "case_by_case",
    summary: "HIV is not automatically disqualifying. Well-controlled HIV on antiretroviral therapy may be acceptable.",
    detail: "HIV infection is not automatically disqualifying for a Class 1 Medical. The CAA assesses HIV on a case-by-case basis. Well-controlled HIV with a stable, undetectable viral load and good CD4 count, on an approved antiretroviral regimen, may be acceptable. The assessment considers the specific antiretroviral medications (some are approved for pilots, others are not), the stability of the condition, and the absence of HIV-related complications. This is a rapidly evolving area of aviation medicine — early engagement with the CAA's Aeromedical Section is recommended.",
    source: "CAA AMS Policy — Infectious Disease",
  },
  {
    name: "Kidney Stones",
    keywords: ["kidney stones", "renal calculi", "renal stones", "urinary stones", "nephrolithiasis"],
    verdict: "case_by_case",
    summary: "A single resolved episode of kidney stones may be acceptable. Recurrent stones require assessment.",
    detail: "Kidney stones (renal calculi) are assessed individually. A single episode that has fully passed or been treated, with no residual stones on imaging, may be acceptable after a defined period. The concern is sudden incapacitation from renal colic in flight. Recurrent kidney stones, or residual stones on imaging, require more detailed assessment. The CAA may impose a requirement for regular imaging to confirm no residual stones.",
    source: "CAA AMS Policy — Renal/Urology",
  },
];

// ─── Verdict display config ───────────────────────────────────────────────────
const VERDICT_CONFIG: Record<Verdict, { label: string; icon: React.ReactNode; bg: string; border: string; text: string }> = {
  likely_ok: {
    label: "Likely Acceptable",
    icon: <CheckCircle2 className="w-5 h-5" />,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
  },
  case_by_case: {
    label: "Case-by-Case Assessment",
    icon: <HelpCircle className="w-5 h-5" />,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
  },
  likely_disqualifying: {
    label: "Likely Disqualifying",
    icon: <XCircle className="w-5 h-5" />,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
  },
  unknown: {
    label: "Insufficient Information",
    icon: <AlertTriangle className="w-5 h-5" />,
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
  },
};

// ─── Search logic ─────────────────────────────────────────────────────────────
function searchConditions(query: string): ConditionEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return CONDITIONS.filter((c) =>
    c.keywords.some((kw) => kw.includes(q) || q.includes(kw)) ||
    c.name.toLowerCase().includes(q)
  ).sort((a, b) => {
    // Exact name match first
    const aExact = a.name.toLowerCase() === q;
    const bExact = b.name.toLowerCase() === q;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    // Keyword starts with query
    const aStarts = a.keywords.some((k) => k.startsWith(q));
    const bStarts = b.keywords.some((k) => k.startsWith(q));
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ConditionResult({ entry }: { entry: ConditionEntry }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = VERDICT_CONFIG[entry.verdict];

  return (
    <div className={`rounded-2xl border p-5 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`mt-0.5 ${cfg.text}`}>{cfg.icon}</div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-[var(--color-navy)] text-lg">{entry.name}</h3>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text} w-fit`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
          <p className="text-sm text-[var(--color-foreground)] font-medium">{entry.summary}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3 text-sm text-[var(--color-foreground)]">
          <p className="leading-relaxed">{entry.detail}</p>
          {entry.caveats && (
            <div className="flex gap-2 p-3 rounded-xl bg-white/60 border border-white/80">
              <Info className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <p className="text-xs">{entry.caveats}</p>
            </div>
          )}
          {entry.source && (
            <p className="text-xs text-[var(--color-muted-foreground)]">Source: {entry.source}</p>
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
      >
        {expanded ? "Show less" : "Read full assessment"}
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
    </div>
  );
}

// ─── Popular conditions ───────────────────────────────────────────────────────
const POPULAR = ["Asthma", "ADHD", "Colour Blindness", "Depression", "Diabetes", "Epilepsy", "Anxiety", "High Blood Pressure"];

// ─── Main component ───────────────────────────────────────────────────────────
export default function MedicalConditionLookup() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = submitted ? searchConditions(submitted) : [];

  const handleSearch = (q: string) => {
    setSubmitted(q);
    setQuery(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const faqSchema = [
    { question: "Can I become a pilot with asthma?", answer: "Mild, well-controlled asthma is generally acceptable for a Class 1 Medical. Severe or poorly controlled asthma requires individual assessment by the CAA." },
    { question: "Can I become a pilot with ADHD?", answer: "ADHD is not automatically disqualifying, but standard ADHD medications (stimulants) are not permitted while flying. Each case is assessed individually by the CAA." },
    { question: "Can I become a pilot with colour blindness?", answer: "Colour vision deficiency does not automatically disqualify you. You must pass the CAD test at City University London. A limitation may be placed on your licence depending on the result." },
    { question: "Can I become a pilot with depression?", answer: "A history of depression is not automatically disqualifying. Certain SSRIs are now permitted under EASA rules. Each case is assessed individually." },
    { question: "Can I become a pilot with diabetes?", answer: "Type 2 diabetes controlled by diet or metformin may be acceptable. Insulin-treated diabetes (Type 1 or 2) may be acceptable under strict EASA conditions with multi-crew limitations." },
    { question: "Can I become a pilot with epilepsy?", answer: "Epilepsy is generally disqualifying for a Class 1 Medical. A single unprovoked seizure may be considered after a seizure-free period. Each case requires individual assessment." },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.08 252)" }}>
      <SEO
        title="Class 1 Medical Condition Lookup | Can I Become a Pilot? | AviatorIQ"
        description="Search any medical condition to find out if it affects your Class 1 Medical eligibility for UK pilot training. Covers asthma, ADHD, colour blindness, diabetes, depression, epilepsy and more."
        canonical="/tools/medical-condition-lookup"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSchema.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <div
          className="relative overflow-hidden py-12 md:py-16"
          style={{ background: "linear-gradient(160deg, oklch(0.10 0.10 255) 0%, oklch(0.14 0.12 248) 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/images/aviation-medical.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.09 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="container max-w-3xl relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "oklch(0.45 0.18 240 / 0.15)", color: "oklch(0.75 0.12 240)", border: "1px solid oklch(0.45 0.18 240 / 0.25)" }}>
              <Search className="w-3.5 h-3.5" /> Class 1 Medical Tool
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Medical Condition Lookup
            </h1>
            <p className="text-base md:text-lg mb-8" style={{ color: "oklch(0.65 0.04 240)" }}>
              Search any medical condition to get a plain-English answer about Class 1 Medical eligibility for UK pilot training. Covers 20+ conditions including the most-searched topics.
            </p>

            {/* Search form */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "oklch(0.5 0.04 240)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. asthma, ADHD, colour blindness, diabetes..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none"
                  style={{
                    background: "oklch(0.16 0.08 250)",
                    border: "1px solid oklch(1 0 0 / 0.12)",
                    color: "white",
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors"
                  style={{ background: "oklch(0.72 0.18 65)", boxShadow: "0 0 12px oklch(0.72 0.18 65 / 0.3)" }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSearch(p)}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{ background: "oklch(0.16 0.08 250)", border: "1px solid oklch(1 0 0 / 0.1)", color: "oklch(0.65 0.04 240)" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="py-10 px-4" style={{ background: "oklch(0.11 0.08 252)" }}>
          <div className="container max-w-3xl">

            {submitted && results.length === 0 && (
              <div
                className="rounded-2xl p-8 text-center mb-8"
                style={{ background: "oklch(0.14 0.08 250)", border: "1px solid oklch(1 0 0 / 0.08)" }}
              >
                <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: "oklch(0.72 0.18 65)" }} />
                <h3 className="font-display font-bold text-white text-lg mb-2">Condition not found</h3>
                <p className="text-sm mb-4" style={{ color: "oklch(0.65 0.04 240)" }}>
                  We don't have specific information for "<strong className="text-white">{submitted}</strong>" yet. This tool covers the most common conditions — for less common conditions, consult an Aeromedical Examiner (AME) directly.
                </p>
                <a
                  href="https://www.caa.co.uk/commercial-industry/aircraft/medical/aeromedical-examiners/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "oklch(0.72 0.18 65)" }}
                >
                  Find a CAA Aeromedical Examiner <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-4 mb-10">
                <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.04 240)" }}>
                  Showing {results.length} result{results.length !== 1 ? "s" : ""} for "<strong className="text-white">{submitted}</strong>"
                </p>
                {results.map((entry) => (
                  <ConditionResult key={entry.name} entry={entry} />
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div
              className="rounded-2xl p-5 mb-8"
              style={{ background: "oklch(0.14 0.08 250)", border: "1px solid oklch(1 0 0 / 0.08)" }}
            >
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "oklch(0.72 0.18 65)" }} />
                <div>
                  <p className="font-semibold text-white text-sm mb-1">Important disclaimer</p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.6 0.04 240)" }}>
                    This tool provides general guidance only and is not medical or legal advice. Aviation medicine is complex and every case is assessed individually by the CAA. The information here is based on published CAA and EASA policy but may not reflect the most recent changes. <strong className="text-white">Always consult a CAA-approved Aeromedical Examiner (AME) for a definitive assessment of your specific situation.</strong> Do not make training or career decisions based solely on this tool.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-6 md:p-8 text-center"
              style={{ background: "linear-gradient(135deg, oklch(0.14 0.12 255), oklch(0.18 0.14 248))", border: "1px solid oklch(0.45 0.18 240 / 0.2)" }}
            >
              <h3 className="font-display font-bold text-xl text-white mb-2">Not sure if you're eligible?</h3>
              <p className="text-sm mb-5" style={{ color: "oklch(0.65 0.04 240)" }}>
                Take the free Class 1 Medical Readiness Check — 5 questions, instant result, no registration required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/class-1-medical-check"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 65), oklch(0.65 0.2 50))", boxShadow: "0 0 16px oklch(0.72 0.18 65 / 0.25)" }}
                >
                  Take the Medical Check <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/guides/class-1-medical"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline"
                  style={{ background: "oklch(0.45 0.18 240 / 0.15)", color: "oklch(0.75 0.12 240)", border: "1px solid oklch(0.45 0.18 240 / 0.3)" }}
                >
                  Read the Class 1 Medical Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
