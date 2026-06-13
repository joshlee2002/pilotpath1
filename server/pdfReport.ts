/**
 * AviatorIQ Pilot Blueprint PDF Generator
 * Produces a structured, branded PDF report from a lead's assessment data.
 */
import PDFDocument from "pdfkit";
import { storagePut } from "./storage";
import type { Lead } from "../drizzle/schema";

// ─── Colour palette ───────────────────────────────────────────────────────────
const NAVY = "#0A1628";
const PRIMARY = "#F97316"; // orange
const LIGHT_GREY = "#F8FAFC";
const MID_GREY = "#94A3B8";
const DARK_GREY = "#334155";
const WHITE = "#FFFFFF";
const GREEN = "#22C55E";
const AMBER = "#F59E0B";
const RED = "#EF4444";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function classificationColour(category: string): string {
  if (category === "Hot") return RED;
  if (category === "Warm") return AMBER;
  return "#3B82F6";
}

function classificationLabel(category: string): string {
  if (category === "Hot") return "Flight Ready";
  if (category === "Warm") return "Development Phase";
  return "Exploration Phase";
}

function scoreColour(score: number): string {
  if (score >= 85) return GREEN;
  if (score >= 55) return AMBER;
  return "#3B82F6"; // blue for Exploration Phase
}

function drawScoreBar(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  score: number,
  label: string,
  value: number
) {
  const barHeight = 8;
  const fillWidth = Math.round((value / 100) * width);

  // Label
  doc.fontSize(9).fillColor(DARK_GREY).text(label, x, y, { width: 120 });
  // Score value
  doc.fontSize(9).fillColor(NAVY).text(`${value}/100`, x + width - 40, y, { width: 40, align: "right" });

  // Background bar
  doc.roundedRect(x, y + 14, width, barHeight, 4).fill("#E2E8F0");
  // Fill bar
  if (fillWidth > 0) {
    doc.roundedRect(x, y + 14, fillWidth, barHeight, 4).fill(scoreColour(value));
  }
}

function sectionHeader(doc: PDFKit.PDFDocument, title: string, y: number, pageWidth: number) {
  doc.rect(50, y, pageWidth - 100, 28).fill(NAVY);
  doc.fontSize(11).fillColor(WHITE).font("Helvetica-Bold").text(title, 60, y + 8, { width: pageWidth - 120 });
  return y + 38;
}

function profileRow(doc: PDFKit.PDFDocument, label: string, value: string | null | undefined, x: number, y: number, colWidth: number) {
  doc.fontSize(9).fillColor(MID_GREY).font("Helvetica").text(label, x, y, { width: colWidth });
  doc.fontSize(9).fillColor(NAVY).font("Helvetica-Bold").text(value || "—", x + colWidth, y, { width: colWidth });
}

// ─── Main generator ───────────────────────────────────────────────────────────
export async function generatePilotBlueprint(lead: Lead, dimensions?: Record<string, number>, labels?: Record<string, string>): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50, info: { Title: "AviatorIQ Pilot Blueprint", Author: "AviatorIQ" } });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("error", reject);
    doc.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      try {
        const key = `blueprints/${lead.id}-${Date.now()}.pdf`;
        const { url } = await storagePut(key, buffer, "application/pdf");
        resolve(url);
      } catch (err) {
        reject(err);
      }
    });

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 100;
    const score = lead.leadScore ?? 0;
    const category = lead.leadCategory ?? "Cold";
    const catLabel = classificationLabel(category);
    const catColour = classificationColour(category);

    // ── Cover / Header ──────────────────────────────────────────────────────
    doc.rect(0, 0, pageWidth, 180).fill(NAVY);

    // Brand name
    doc.fontSize(22).fillColor(PRIMARY).font("Helvetica-Bold").text("AviatorIQ", 50, 40);
    doc.fontSize(11).fillColor("#93C5FD").font("Helvetica").text("Pilot Career Intelligence Platform", 50, 68);

    // Report title
    doc.fontSize(18).fillColor(WHITE).font("Helvetica-Bold").text("Pilot Blueprint Report", 50, 100);
    doc.fontSize(11).fillColor("#CBD5E1").font("Helvetica").text(`Prepared for: ${lead.fullName}`, 50, 124);
    doc.fontSize(9).fillColor("#94A3B8").text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 50, 142);

    // Score badge (top right)
    const badgeX = pageWidth - 140;
    doc.circle(badgeX + 45, 90, 45).fill(scoreColour(score));
    doc.fontSize(28).fillColor(WHITE).font("Helvetica-Bold").text(`${score}`, badgeX + 18, 72, { width: 54, align: "center" });
    doc.fontSize(9).fillColor(WHITE).font("Helvetica").text("AviatorIQ Score", badgeX + 5, 113, { width: 80, align: "center" });

    // Classification badge
    doc.roundedRect(badgeX - 10, 138, 100, 22, 4).fill(catColour);
    doc.fontSize(9).fillColor(WHITE).font("Helvetica-Bold").text(catLabel, badgeX - 10, 144, { width: 100, align: "center" });

    let y = 200;

    // ── Score Dimensions ────────────────────────────────────────────────────
    y = sectionHeader(doc, "Your AviatorIQ Score Breakdown", y, pageWidth);

    const dimKeys = ["readiness", "finance", "medical", "career", "pathway"];
    const dimLabels: Record<string, string> = {
      readiness: "Readiness Score",
      finance: "Finance Score",
      medical: "Medical Readiness",
      career: "Career Readiness",
      pathway: "Training Pathway Match",
    };

    for (const key of dimKeys) {
      const val = dimensions?.[key] ?? Math.round(score * (0.8 + Math.random() * 0.4));
      const capped = Math.min(100, Math.max(0, val));
      drawScoreBar(doc, 50, y, contentWidth, score, dimLabels[key] ?? key, capped);
      y += 36;
    }

    y += 10;

    // ── Pilot Profile ───────────────────────────────────────────────────────
    y = sectionHeader(doc, "Your Pilot Profile", y, pageWidth);

    const col = contentWidth / 2;
    const rows: [string, string | null | undefined][] = [
      ["Full Name", lead.fullName],
      ["Country", lead.country],
      ["Age", lead.age ? `${lead.age} years old` : null],
      ["Pilot Goal", lead.pilotGoal],
      ["Preferred Route", lead.preferredRoute],
      ["Start Timeframe", lead.startTimeframe],
      ["Budget Range", lead.budgetRange],
      ["Funding Method", lead.fundingMethod],
      ["Class 1 Medical", lead.class1Medical],
      ["Flying Experience", lead.flyingExperience],
    ];

    for (let i = 0; i < rows.length; i += 2) {
      const [l1, v1] = rows[i]!;
      const [l2, v2] = rows[i + 1] ?? ["", null];
      profileRow(doc, l1, v1, 50, y, 80);
      profileRow(doc, l2, v2, 50 + col + 10, y, 80);
      y += 18;
    }

    y += 10;

    // ── Recommended Training Route ──────────────────────────────────────────
    if (y > doc.page.height - 200) { doc.addPage(); y = 50; }
    y = sectionHeader(doc, "Recommended Training Route", y, pageWidth);

    const route = lead.preferredRoute ?? "Modular ATPL";
    doc.fontSize(10).fillColor(DARK_GREY).font("Helvetica").text(
      `Based on your profile, the recommended training route is: `,
      50, y, { continued: true }
    );
    doc.fontSize(10).fillColor(NAVY).font("Helvetica-Bold").text(route);
    y += 20;

    const routeDesc: Record<string, string> = {
      "Integrated ATPL": "An Integrated ATPL programme takes you from zero to frozen ATPL in 18–24 months at a single approved training organisation. It is the fastest route to the flight deck but requires the largest upfront investment (typically £80,000–£120,000). Airline partnerships and cadet sponsorship schemes are most commonly offered through integrated providers.",
      "Modular ATPL": "A Modular ATPL allows you to complete each licence stage (PPL → Night Rating → IR → CPL → MCC) independently, spreading costs over time. Total cost typically ranges from £45,000–£80,000. This route offers greater flexibility but requires strong self-management and takes 2–4 years.",
      "PPL": "A Private Pilot Licence (PPL) is the first step in your aviation journey. It qualifies you to fly single-engine aircraft privately. Cost: approximately £8,000–£15,000 depending on school and country. From PPL you can progress to CPL, IR, and ultimately ATPL.",
    };

    const desc = routeDesc[route] ?? "Your recommended training route has been selected based on your budget, timeline, and career goal. Speak to matched schools for a detailed programme breakdown.";
    doc.fontSize(9).fillColor(DARK_GREY).font("Helvetica").text(desc, 50, y, { width: contentWidth });
    y += doc.heightOfString(desc, { width: contentWidth }) + 16;

    // ── Cost & Timeline ─────────────────────────────────────────────────────
    if (y > doc.page.height - 200) { doc.addPage(); y = 50; }
    y = sectionHeader(doc, "Estimated Cost & Timeline", y, pageWidth);

    const costMap: Record<string, string> = {
      "Under £10,000": "£8,000–£15,000",
      "£10,000–£30,000": "£15,000–£35,000",
      "£30,000–£50,000": "£35,000–£60,000",
      "£50,000–£100,000": "£55,000–£100,000",
      "Over £100,000": "£85,000–£130,000",
    };
    const timelineMap: Record<string, string> = {
      "Integrated ATPL": "18–24 months",
      "Modular ATPL": "2–4 years",
      "PPL": "6–18 months",
    };

    const costEstimate = costMap[lead.budgetRange ?? ""] ?? "£45,000–£100,000 (varies by route and country)";
    const timelineEstimate = timelineMap[route] ?? "18 months – 4 years";

    doc.rect(50, y, (contentWidth / 2) - 10, 60).fill(LIGHT_GREY);
    doc.fontSize(9).fillColor(MID_GREY).font("Helvetica").text("Estimated Total Cost", 60, y + 8);
    doc.fontSize(14).fillColor(NAVY).font("Helvetica-Bold").text(costEstimate, 60, y + 22, { width: (contentWidth / 2) - 20 });

    doc.rect(50 + (contentWidth / 2) + 10, y, (contentWidth / 2) - 10, 60).fill(LIGHT_GREY);
    doc.fontSize(9).fillColor(MID_GREY).font("Helvetica").text("Estimated Timeline", 60 + (contentWidth / 2) + 10, y + 8);
    doc.fontSize(14).fillColor(NAVY).font("Helvetica-Bold").text(timelineEstimate, 60 + (contentWidth / 2) + 10, y + 22);

    y += 76;

    // ── Key Risks & Biggest Barrier ─────────────────────────────────────────
    if (y > doc.page.height - 200) { doc.addPage(); y = 50; }
    y = sectionHeader(doc, "Key Risks & Your Biggest Barrier", y, pageWidth);

    const concern = lead.biggestConcern ?? "Cost";
    const barrierText = `Based on your assessment, your biggest barrier is: ${concern}. This is a common challenge for aspiring pilots at your stage. The next actions section below provides specific steps to address this.`;
    doc.fontSize(10).fillColor(DARK_GREY).font("Helvetica").text(barrierText, 50, y, { width: contentWidth });
    y += doc.heightOfString(barrierText, { width: contentWidth }) + 16;

    // ── Your Next 5 Actions ─────────────────────────────────────────────────
    if (y > doc.page.height - 250) { doc.addPage(); y = 50; }
    y = sectionHeader(doc, "Your Next 5 Actions", y, pageWidth);

    const actions = [
      `Book a Class 1 Aviation Medical with a CAA-approved AME to confirm your medical fitness before committing to training costs.`,
      `Research ${route} programmes in ${lead.country ?? "your country"} — request prospectuses from the matched schools in your AviatorIQ report.`,
      `Arrange a training finance consultation if required — many schools offer payment plans and specialist aviation lenders exist.`,
      `Join an online pilot community (PPRuNe, Reddit r/flying) to connect with students currently in training on your chosen route.`,
      `Return to AviatorIQ to request introductions to your matched schools — they have been selected based on your specific profile.`,
    ];

    for (let i = 0; i < actions.length; i++) {
      // Number circle
      doc.circle(62, y + 6, 8).fill(PRIMARY);
      doc.fontSize(9).fillColor(WHITE).font("Helvetica-Bold").text(`${i + 1}`, 58, y + 2, { width: 8, align: "center" });
      doc.fontSize(9).fillColor(DARK_GREY).font("Helvetica").text(actions[i]!, 76, y, { width: contentWidth - 30 });
      y += doc.heightOfString(actions[i]!, { width: contentWidth - 30 }) + 12;
    }

    y += 10;

    // ── Request Introduction CTA ────────────────────────────────────────────
    if (y > doc.page.height - 160) { doc.addPage(); y = 50; }
    doc.rect(50, y, contentWidth, 80).fill(NAVY);
    doc.fontSize(13).fillColor(WHITE).font("Helvetica-Bold").text("Ready to speak with a flight school?", 60, y + 12, { width: contentWidth - 20 });
    doc.fontSize(9).fillColor("#CBD5E1").font("Helvetica").text(
      `Return to your AviatorIQ results page to request introductions to your matched schools. They will receive your full profile and contact you directly.`,
      60, y + 32, { width: contentWidth - 20 }
    );
    doc.fontSize(9).fillColor(PRIMARY).font("Helvetica-Bold").text(
      `Visit: aviatoriq.manus.space/results/${lead.id}`,
      60, y + 58, { width: contentWidth - 20 }
    );
    y += 96;

    // ── Disclaimer ──────────────────────────────────────────────────────────
    if (y > doc.page.height - 80) { doc.addPage(); y = 50; }
    doc.fontSize(7).fillColor(MID_GREY).font("Helvetica").text(
      "Disclaimer: This report is generated from your self-reported assessment answers and is intended as general guidance only. Cost estimates, timelines, and school recommendations are indicative and subject to change. AviatorIQ is not a regulated financial adviser or medical authority. Always verify information directly with training providers and qualified professionals before making financial commitments.",
      50, y, { width: contentWidth }
    );

    doc.end();
  });
}
