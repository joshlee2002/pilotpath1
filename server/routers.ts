import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getPublicPlatformStats,
  createLead,
  createFlightSchool,
  createIntroductionRequest,
  createLeadAssignment,
  createSchoolWaitlistEntry,
  deleteLead,
  deleteFlightSchool,
  createAdminNote,
  getAdminNotesByLeadId,
  getAllLeadsForExport,
  getFlightSchoolById,
  getIntroductionRequestsByLeadId,
  getLeadAssignments,
  getLeadById,
  getLeadAnalytics,
  getLaunchStats,
  listAllIntroductionRequests,
  listFlightSchools,
  listLeads,
  listSchoolWaitlist,
  matchSchoolsForLead,
  updateFlightSchool,
  updateLead,
} from "./db";
import { scoreLead } from "./scoring";
import { generatePilotBlueprint } from "./pdfReport";
import { scoreLicenceQuiz } from "./licenceQuizScoring";
import { createLicenceQuizLead, getLicenceQuizStats, updateLicenceQuizEmail, createFinanceInterest, createFlightDeckShare, getFlightDeckShare, createCalcSession, createFlightDeckEmailCapture } from "./db";
import { nanoid } from "nanoid";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Lead submission schema ───────────────────────────────────────────────────
const leadSubmitSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  age: z.number().int().min(14).max(99).optional(),
  pilotGoal: z.string().optional(),
  seriousness: z.string().optional(),
  spokenToSchool: z.string().optional(),
  preferredRoute: z.string().optional(),
  openToAbroad: z.string().optional(),
  fundingMethod: z.string().optional(),
  budgetRange: z.string().optional(),
  wantsFinanceInfo: z.string().optional(),
  educationLevel: z.string().optional(),
  class1Medical: z.string().optional(),
  flyingExperience: z.string().optional(),
  rightToWorkStudy: z.string().optional(),
  biggestConcern: z.string().optional(),
  startTimeframe: z.string().optional(),
  wantsSchoolContact: z.string().optional(),
  preferredContact: z.string().optional(),
  source: z.string().optional(),
  contactConsentSchools: z.boolean().optional(),
  contactConsentFinance: z.boolean().optional(),
  contactConsentMedical: z.boolean().optional(),
  contactConsentPartners: z.boolean().optional(),
  consentToContact: z.boolean(),
  consentToShare: z.boolean(),
  writtenAnswer: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Leads ────────────────────────────────────────────────────────────────
  leads: router({
    submit: publicProcedure
      .input(leadSubmitSchema)
      .mutation(async ({ input }) => {
        if (!input.consentToContact) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Consent is required" });
        }

        // Score the lead
        const scoreResult = scoreLead({
          pilotGoal: input.pilotGoal,
          seriousness: input.seriousness,
          spokenToSchool: input.spokenToSchool,
          fundingMethod: input.fundingMethod,
          budgetRange: input.budgetRange,
          wantsFinanceInfo: input.wantsFinanceInfo,
          age: input.age,
          class1Medical: input.class1Medical,
          flyingExperience: input.flyingExperience,
          rightToWorkStudy: input.rightToWorkStudy,
          phone: input.phone,
          writtenAnswer: input.writtenAnswer,
          preferredRoute: input.preferredRoute,
          country: input.country,
          startTimeframe: input.startTimeframe,
          biggestConcern: input.biggestConcern,
        });
        const { score, category, intentScore } = scoreResult;

        // Generate AI summary (non-blocking, best-effort)
        let aiSummary: string | undefined;
        try {
          const summaryPrompt = `You are an aviation training advisor. Summarise this pilot training enquiry in 2-3 sentences for an admin dashboard. Lead with their biggest stated barrier, then their commitment level, then their readiness. Be concise and factual.

Lead details:
- Name: ${input.fullName}
- Country: ${input.country ?? "Unknown"}
- Age: ${input.age ?? "Unknown"}
- Pilot goal: ${input.pilotGoal ?? "Unknown"}
- Commitment level (what they've done): ${input.spokenToSchool ?? "Unknown"}
- How often they think about it: ${input.seriousness ?? "Unknown"}
- Biggest stated barrier: ${input.biggestConcern ?? "Unknown"}
- Training route: ${input.preferredRoute ?? "Unknown"}
- Budget: ${input.budgetRange ?? "Unknown"}
- Funding method: ${input.fundingMethod ?? "Unknown"}
- Start timeframe: ${input.startTimeframe ?? "Unknown"}
- Medical confidence: ${input.class1Medical ?? "Unknown"}
- Flying experience: ${input.flyingExperience ?? "Unknown"}
- Written answer: ${input.writtenAnswer ?? "None"}

AviatorIQ Score: ${score}/100 (${category})`;

          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a helpful aviation training advisor assistant. Be concise and professional." },
              { role: "user", content: summaryPrompt },
            ],
          });
          const content = response.choices[0]?.message?.content;
          aiSummary = typeof content === 'string' ? content : undefined;
        } catch (e) {
          console.warn("[AI] Summary generation failed:", e);
        }

        // Compute lead value (admin-only, not shown to user)
        const leadValue = (() => {
          if (score >= 75 && (input.startTimeframe === "As soon as possible — I'm ready now" || input.startTimeframe === 'Within the next 12 months' || input.startTimeframe === 'Immediately' || input.startTimeframe === 'Within 3 months' || input.startTimeframe === 'Within 6 months')) return 'High';
          if (score >= 45) return 'Medium';
          return 'Low';
        })();

                // Normalise optional string fields: undefined and empty string both become null
        const ns = (v: string | undefined | null): string | null => (v === undefined || v === '' ? null : v);

        // Attempt to save lead to DB; fall back to an in-memory ID if DB is unavailable
        let leadId: number;
        try {
          leadId = await createLead({
          fullName: input.fullName,
          email: input.email,
          phone: ns(input.phone),
          country: ns(input.country),
          city: ns(input.city),
          age: input.age ?? null,
          pilotGoal: ns(input.pilotGoal),
          seriousness: ns(input.seriousness),
          spokenToSchool: ns(input.spokenToSchool),
          preferredRoute: ns(input.preferredRoute),
          openToAbroad: ns(input.openToAbroad),
          fundingMethod: ns(input.fundingMethod),
          budgetRange: ns(input.budgetRange),
          wantsFinanceInfo: ns(input.wantsFinanceInfo),
          educationLevel: ns(input.educationLevel),
          class1Medical: ns(input.class1Medical),
          flyingExperience: ns(input.flyingExperience),
          rightToWorkStudy: ns(input.rightToWorkStudy),
          biggestConcern: ns(input.biggestConcern),
          startTimeframe: ns(input.startTimeframe),
          wantsSchoolContact: ns(input.wantsSchoolContact),
          preferredContact: ns(input.preferredContact),
          source: ns(input.source),
          contactConsentSchools: input.contactConsentSchools ?? true,
          contactConsentFinance: input.contactConsentFinance ?? false,
          contactConsentMedical: input.contactConsentMedical ?? false,
          contactConsentPartners: input.contactConsentPartners ?? false,
          consentToContact: input.consentToContact,
          consentToShare: input.consentToShare,
          writtenAnswer: ns(input.writtenAnswer),
          aiSummary: aiSummary ?? null,
          leadScore: score,
          leadCategory: category,
          leadValue,
          intentScore,
          status: "New",
          });
        } catch (dbErr) {
          console.warn("[DB] Lead save failed, using in-memory fallback:", dbErr);
          leadId = Date.now(); // fallback: use timestamp as pseudo-ID
        }

        // Generate PDF blueprint (non-blocking, best-effort)
        const leadForPdf = await getLeadById(leadId);
        if (leadForPdf) {
          generatePilotBlueprint(leadForPdf, scoreResult.dimensions, scoreResult.labels)
            .then(async (pdfUrl) => {
              await updateLead(leadId, { pdfKey: pdfUrl });
            })
            .catch((e) => console.warn('[PDF] Blueprint generation failed:', e));
        }

        // Notify owner on Hot leads
        if (category === "Hot") {
          try {
            await notifyOwner({
              title: `🔥 Hot Lead: ${input.fullName}`,
              content: `New hot lead submitted!\n\nName: ${input.fullName}\nEmail: ${input.email}\nCountry: ${input.country ?? "Unknown"}\nGoal: ${input.pilotGoal ?? "Unknown"}\nBudget: ${input.budgetRange ?? "Unknown"}\nTimeframe: ${input.startTimeframe ?? "Unknown"}\nScore: ${score}/100\n\nAI Summary: ${aiSummary ?? "Generating..."}`,
            });
          } catch (e) {
            console.warn("[Notification] Owner notify failed:", e);
          }
        }

        // Match schools
        const matchedSchools = await matchSchoolsForLead({
          country: input.country,
          preferredRoute: input.preferredRoute,
          budgetRange: input.budgetRange,
          wantsFinanceInfo: input.wantsFinanceInfo,
          openToAbroad: input.openToAbroad,
        });

        return { leadId, score, category, leadValue, matchedSchools, dimensions: scoreResult.dimensions, labels: scoreResult.labels, nextAction: scoreResult.nextAction, biggestRisk: scoreResult.biggestRisk, estimatedCostRange: scoreResult.estimatedCostRange, estimatedTimeline: scoreResult.estimatedTimeline, recommendedRoute: scoreResult.recommendedRoute };
      }),

    getResult: publicProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        const lead = await getLeadById(input.leadId);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND" });

        const matchedSchools = await matchSchoolsForLead({
          country: lead.country,
          preferredRoute: lead.preferredRoute,
          budgetRange: lead.budgetRange,
          wantsFinanceInfo: lead.wantsFinanceInfo,
          openToAbroad: lead.openToAbroad,
        });

        const scoreResult = scoreLead({
          pilotGoal: lead.pilotGoal,
          seriousness: lead.seriousness,
          spokenToSchool: lead.spokenToSchool,
          fundingMethod: lead.fundingMethod,
          budgetRange: lead.budgetRange,
          wantsFinanceInfo: lead.wantsFinanceInfo,
          age: lead.age,
          class1Medical: lead.class1Medical,
          flyingExperience: lead.flyingExperience,
          rightToWorkStudy: lead.rightToWorkStudy,
          phone: lead.phone,
          writtenAnswer: lead.writtenAnswer,
          preferredRoute: lead.preferredRoute,
          country: lead.country,
          startTimeframe: lead.startTimeframe,
          biggestConcern: lead.biggestConcern,
        });
        return { lead, matchedSchools, dimensions: scoreResult.dimensions, labels: scoreResult.labels, nextAction: scoreResult.nextAction, biggestRisk: scoreResult.biggestRisk, estimatedCostRange: scoreResult.estimatedCostRange, estimatedTimeline: scoreResult.estimatedTimeline, recommendedRoute: scoreResult.recommendedRoute };
      }),

    getPdfUrl: publicProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        const lead = await getLeadById(input.leadId);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND" });
        return { pdfUrl: lead.pdfKey ?? null };
      }),

    generateRoadmap: publicProcedure
      .input(z.object({
        leadId: z.number(),
        // Optional client-side lead data for when DB is unavailable
        leadData: z.object({
          fullName: z.string().optional(),
          age: z.number().optional().nullable(),
          country: z.string().optional().nullable(),
          pilotGoal: z.string().optional().nullable(),
          biggestConcern: z.string().optional().nullable(),
          spokenToSchool: z.string().optional().nullable(),
          seriousness: z.string().optional().nullable(),
          preferredRoute: z.string().optional().nullable(),
          budgetRange: z.string().optional().nullable(),
          fundingMethod: z.string().optional().nullable(),
          wantsFinanceInfo: z.string().optional().nullable(),
          class1Medical: z.string().optional().nullable(),
          flyingExperience: z.string().optional().nullable(),
          startTimeframe: z.string().optional().nullable(),
          openToAbroad: z.string().optional().nullable(),
          writtenAnswer: z.string().optional().nullable(),
          leadScore: z.number().optional().nullable(),
          leadCategory: z.string().optional().nullable(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const dbLead = await getLeadById(input.leadId);
        // Use DB lead if available, otherwise fall back to client-provided data
        const lead = dbLead ?? (input.leadData ? { ...input.leadData, id: input.leadId, aiRoadmap: null } as any : null);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND" });

        // Return cached roadmap if available
        if (lead.aiRoadmap) {
          return { roadmap: lead.aiRoadmap };
        }

        const prompt = `You are an expert aviation career advisor. Generate a personalised pilot training roadmap for this candidate. Format your response as structured JSON.

IMPORTANT: This roadmap must be insight-led. Start with the candidate's biggest barrier and address it directly. Do not just recommend a route — tell them what's actually standing between them and the cockpit, and what to do about it.

Candidate profile:
- Name: ${lead.fullName}
- Age: ${lead.age ?? "Unknown"}
- Country: ${lead.country ?? "Unknown"}
- Pilot goal: ${lead.pilotGoal ?? "Unknown"}
- Biggest stated barrier: ${lead.biggestConcern ?? "Unknown"}
- What they've already done: ${lead.spokenToSchool ?? "Unknown"}
- How often they think about it: ${lead.seriousness ?? "Unknown"}
- Preferred route: ${lead.preferredRoute ?? "Unknown"}
- Budget: ${lead.budgetRange ?? "Unknown"}
- Funding method: ${lead.fundingMethod ?? "Unknown"}
- Wants finance info: ${lead.wantsFinanceInfo ?? "Unknown"}
- Medical confidence: ${lead.class1Medical ?? "Unknown"}
- Flying experience: ${lead.flyingExperience ?? "Unknown"}
- Start timeframe: ${lead.startTimeframe ?? "Unknown"}
- Open to training abroad: ${lead.openToAbroad ?? "Unknown"}
- Written answer: ${lead.writtenAnswer ?? "None provided"}
- AviatorIQ Score: ${lead.leadScore}/100 (${lead.leadCategory === "Hot" ? "Flight Ready" : lead.leadCategory === "Warm" ? "Development Phase" : "Exploration Phase"})

Return a JSON object with these exact keys:
{
  "pilotGoalSummary": "1-2 sentence summary of their goal and current situation",
  "biggestBarrier": "Name their biggest barrier in plain English — be specific and honest",
  "barrierAdvice": "2-3 sentences of specific, actionable advice to address their biggest barrier",
  "strongestAsset": "What is already working in their favour — be specific",
  "recommendedRoute": "The recommended training route name",
  "routeRationale": "2-3 sentences explaining why this route suits them specifically",
  "estimatedCostMin": number (GBP, no currency symbol),
  "estimatedCostMax": number (GBP, no currency symbol),
  "estimatedDuration": "e.g. 18-24 months",
  "readinessLabel": "Flight Ready | Development Phase | Exploration Phase",
  "readinessExplanation": "1-2 sentences about their readiness — be honest, not just encouraging",
  "nextSteps": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "medicalAdvice": "1-2 sentences about Class 1 Medical relevant to their specific situation",
  "financeConsiderations": "1-2 sentences about financing relevant to their budget and funding method",
  "schoolTypeRecommendation": "What type of school to look for and why",
  "disclaimer": "This report is guidance only and not official career, medical or financial advice. Always consult qualified professionals before making training decisions."
}

Use honest, direct language. If their barrier is funding, say so clearly and give real options. If their timeline is unrealistic, say so kindly. Do not make promises about employment or medical approval. The goal is to give them the certainty they need to make a decision — not just to encourage them.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert aviation career advisor. Always respond with valid JSON only, no markdown." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        });

        const rawContent = response.choices[0]?.message?.content;
        const roadmap = typeof rawContent === 'string' ? rawContent : "{}";

        // Cache the roadmap
        await updateLead(lead.id, { aiRoadmap: roadmap });

        return { roadmap };
      }),
  }),

  // ─── Admin ────────────────────────────────────────────────────────────────
  admin: router({
    listLeads: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          country: z.string().optional(),
          category: z.string().optional(),
          status: z.string().optional(),
          pilotGoal: z.string().optional(),
          budgetRange: z.string().optional(),
          startTimeframe: z.string().optional(),
          wantsFinanceInfo: z.string().optional(),
          minScore: z.number().optional(),
          maxScore: z.number().optional(),
          page: z.number().default(1),
          pageSize: z.number().default(50),
          sortBy: z.enum(["createdAt", "leadScore", "intentScore"]).optional(),
          sortDir: z.enum(["asc", "desc"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return listLeads(input);
      }),

    getLead: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lead = await getLeadById(input.id);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND" });
        const notes = await getAdminNotesByLeadId(input.id);
        const assignments = await getLeadAssignments(input.id);
        return { lead, notes, assignments };
      }),

    updateLeadStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum([
            "New",
            "Reviewed",
            "Contacted",
            "Sent to School",
            "School Interested",
            "Not Suitable",
            "Converted",
            "Archived",
          ]),
        })
      )
      .mutation(async ({ input }) => {
        await updateLead(input.id, { status: input.status });
        return { success: true };
      }),

    addNote: adminProcedure
      .input(z.object({ leadId: z.number(), note: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        await createAdminNote({ leadId: input.leadId, note: input.note, authorId: ctx.user.id });
        return { success: true };
      }),

    assignToSchool: adminProcedure
      .input(
        z.object({
          leadId: z.number(),
          schoolId: z.number(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createLeadAssignment({
          leadId: input.leadId,
          schoolId: input.schoolId,
          notes: input.notes,
          status: "Assigned",
        });
        await updateLead(input.leadId, { status: "Sent to School" });
        return { success: true };
      }),

    deleteLead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLead(input.id);
        return { success: true };
      }),

    exportLeads: adminProcedure.query(async () => {
      const allLeads = await getAllLeadsForExport();
      return allLeads;
    }),

    // Flight school management
    listSchools: adminProcedure.query(async () => {
      return listFlightSchools({ activeOnly: false });
    }),

    createSchool: adminProcedure
      .input(
        z.object({
          name: z.string().min(2),
          country: z.string().optional(),
          city: z.string().optional(),
          airport: z.string().optional(),
          courses: z.string().optional(),
          integratedAtpl: z.boolean().optional(),
          modularAtpl: z.boolean().optional(),
          ppl: z.boolean().optional(),
          priceRange: z.string().optional(),
          financeAvailable: z.enum(["yes", "no", "unknown"]).optional(),
          accommodationAvailable: z.enum(["yes", "no", "unknown"]).optional(),
          airlinePartnerships: z.string().optional(),
          website: z.string().optional(),
          contactEmail: z.string().optional(),
          phone: z.string().optional(),
          description: z.string().optional(),
          active: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createFlightSchool(input);
        return { id };
      }),

    updateSchool: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(2).optional(),
          country: z.string().optional(),
          city: z.string().optional(),
          airport: z.string().optional(),
          courses: z.string().optional(),
          integratedAtpl: z.boolean().optional(),
          modularAtpl: z.boolean().optional(),
          ppl: z.boolean().optional(),
          priceRange: z.string().optional(),
          financeAvailable: z.enum(["yes", "no", "unknown"]).optional(),
          accommodationAvailable: z.enum(["yes", "no", "unknown"]).optional(),
          airlinePartnerships: z.string().optional(),
          website: z.string().optional(),
          contactEmail: z.string().optional(),
          phone: z.string().optional(),
          description: z.string().optional(),
          active: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateFlightSchool(id, data);
        return { success: true };
      }),

    deleteSchool: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteFlightSchool(input.id);
        return { success: true };
      }),
  }),

  // ─── Flight Schools (public) ──────────────────────────────────────────────
  schools: router({
    list: publicProcedure
      .input(
        z.object({
          country: z.string().optional(),
          integratedAtpl: z.boolean().optional(),
          modularAtpl: z.boolean().optional(),
          ppl: z.boolean().optional(),
          financeAvailable: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return listFlightSchools({ ...input, activeOnly: true });
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const school = await getFlightSchoolById(input.id);
        if (!school || !school.active) throw new TRPCError({ code: "NOT_FOUND" });
        return school;
      }),
  }),
  // ─── Introduction Requests ────────────────────────────────────────────────────
  introductions: router({
    requestIntroductions: publicProcedure
      .input(z.object({
        leadId: z.number(),
        schoolIds: z.array(z.number()).min(1).max(5),
      }))
      .mutation(async ({ input }) => {
        const lead = await getLeadById(input.leadId);
        if (!lead) throw new TRPCError({ code: 'NOT_FOUND' });

        const results = [];
        for (const schoolId of input.schoolIds) {
          const school = await getFlightSchoolById(schoolId);
          if (!school) continue;
          const id = await createIntroductionRequest({
            leadId: input.leadId,
            schoolId,
            schoolName: school.name,
            status: 'Pending',
          });
          results.push({ id, schoolName: school.name });
        }

        // Notify owner
        try {
          await notifyOwner({
            title: `🏫 Introduction Request: ${lead.fullName}`,
            content: `${lead.fullName} has requested introductions to ${results.length} school(s):\n${results.map(r => `- ${r.schoolName}`).join('\n')}\n\nLead score: ${lead.leadScore}/100 (${lead.leadCategory})`,
          });
        } catch (e) {
          console.warn('[Notification] Introduction request notify failed:', e);
        }

        return { success: true, count: results.length, schools: results };
      }),

    getByLeadId: publicProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        return getIntroductionRequestsByLeadId(input.leadId);
      }),

    listAll: adminProcedure
      .query(async () => {
        return listAllIntroductionRequests();
      }),
  }),
  // ─── Partner / School Waitlist ───────────────────────────────────────────
  partner: router({
    joinWaitlist: publicProcedure
      .input(
        z.object({
          schoolName: z.string().min(2),
          country: z.string().optional(),
          contactName: z.string().min(2),
          email: z.string().email(),
          website: z.string().optional(),
          coursesOffered: z.string().optional(),
          financeAvailable: z.boolean().optional(),
          interestedInLeads: z.boolean().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const entry = await createSchoolWaitlistEntry({
          schoolName: input.schoolName,
          country: input.country ?? null,
          contactName: input.contactName,
          email: input.email,
          website: input.website ?? null,
          coursesOffered: input.coursesOffered ?? null,
          financeAvailable: input.financeAvailable ?? false,
          interestedInLeads: input.interestedInLeads ?? true,
          notes: input.notes ?? null,
        });
        // Notify owner
        try {
          await notifyOwner({
            title: `🏫 New School Partner Application: ${input.schoolName}`,
            content: `School: ${input.schoolName}\nCountry: ${input.country ?? 'N/A'}\nContact: ${input.contactName}\nEmail: ${input.email}\nWebsite: ${input.website ?? 'N/A'}\nCourses: ${input.coursesOffered ?? 'N/A'}\nFinance: ${input.financeAvailable ? 'Yes' : 'No'}\nWants leads: ${input.interestedInLeads ? 'Yes' : 'No'}`,
          });
        } catch (e) {
          console.warn('[Notification] Partner waitlist notify failed:', e);
        }
        return { success: true, id: entry.id };
      }),
    listWaitlist: adminProcedure.query(async () => {
      return listSchoolWaitlist();
    }),
  }),

  // ─── Licence Quiz ──────────────────────────────────────────────────────────
  licenceQuiz: router({
    /** Submit answers, get result back immediately. Saves a record without email. */
    submit: publicProcedure
      .input(z.object({
        goal: z.string(),
        timeCommitment: z.string(),
        budget: z.string(),
        wantsCommercial: z.string(),
        experience: z.string(),
        location: z.string(),
        speedPriority: z.string(),
        mainPriority: z.string(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = scoreLicenceQuiz(input);
        const record = await createLicenceQuizLead({
          ...input,
          recommendedLicence: result.licence,
          source: input.source ?? null,
        });
        return { id: record.id, result };
      }),

    /** Capture email after result is shown — gated behind detailed breakdown. */
    captureEmail: publicProcedure
      .input(z.object({
        id: z.number(),
        email: z.string().email(),
        consentToContact: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await updateLicenceQuizEmail(input.id, input.email, input.consentToContact);
        return { success: true };
      }),

    /** Social proof stats — how many with each result proceeded to main quiz. */
    stats: publicProcedure.query(async () => {
      return getLicenceQuizStats();
    }),
  }),

  // ─── Finance Interest ──────────────────────────────────────────────────────
  finance: router({
    submitInterest: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        trainingRoute: z.enum(["integrated", "modular", "unsure"]).optional(),
        estimatedBudget: z.enum(["under50k", "50k_80k", "80k_100k", "over100k", "unsure"]).optional(),
        message: z.string().optional(),
        source: z.string().optional(),
        leadId: z.number().optional(),
        consentToContact: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        const id = await createFinanceInterest(input);
        await notifyOwner({
          title: "New Finance Interest Lead",
          content: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone ?? "N/A"}\nRoute: ${input.trainingRoute ?? "N/A"}\nBudget: ${input.estimatedBudget ?? "N/A"}\nSource: ${input.source ?? "N/A"}`,
        });
        return { success: true, id };
      }),
  }),
  // ─── Flight Deck Share ───────────────────────────────────────────────────────
  flightDeck: router({
    saveShare: publicProcedure
      .input(z.object({ resultJson: z.string() }))
      .mutation(async ({ input }) => {
        const shareId = nanoid(12);
        await createFlightDeckShare(shareId, input.resultJson);
        return { shareId };
      }),
    getShare: publicProcedure
      .input(z.object({ shareId: z.string() }))
      .query(async ({ input }) => {
        const resultJson = await getFlightDeckShare(input.shareId);
        if (!resultJson) throw new TRPCError({ code: "NOT_FOUND", message: "Share not found" });
        return { resultJson };
      }),
    captureEmail: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
        phase: z.string().optional(),
        score: z.number().int().optional(),
        biggestBarrier: z.string().optional(),
        consentToContact: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        const id = await createFlightDeckEmailCapture({
          email: input.email,
          name: input.name,
          phase: input.phase,
          score: input.score,
          biggestBarrier: input.biggestBarrier,
          consentToContact: input.consentToContact,
          source: 'flight_deck_results',
        });
        // Notify owner of new Flight Deck email capture
        try {
          await notifyOwner({
            title: `✈️ New Flight Deck Email Captured`,
            content: `Name: ${input.name ?? 'Unknown'}\nEmail: ${input.email}\nPhase: ${input.phase ?? 'N/A'}\nScore: ${input.score ?? 'N/A'}\nBiggest Barrier: ${input.biggestBarrier ?? 'N/A'}`,
          });
        } catch (e) {
          // Non-fatal
        }
        return { ok: true, id };
      }),
  }),
  // ─── Analytics (admin only) ───────────────────────────────────────────────
  platform: router({
    stats: publicProcedure.query(async () => {
      return getPublicPlatformStats();
    }),
  }),
  analytics: router({
    overview: adminProcedure.query(async () => {
      return getLeadAnalytics();
    }),
    launchStats: adminProcedure.query(async () => {
      return getLaunchStats();
    }),
  }),
  // ─── Guide Email Subscribe ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  guides: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        source: z.string().optional(), // which guide page they subscribed from
      }))
      .mutation(async ({ input }) => {
        // Save as a flight deck email capture with source=guide_subscribe
        await createFlightDeckEmailCapture({
          email: input.email,
          consentToContact: true,
          source: input.source ?? 'guide_subscribe',
        });
        try {
          await notifyOwner({
            title: '📚 New Guide Email Subscriber',
            content: `Email: ${input.email}\nSource: ${input.source ?? 'guide_subscribe'}`,
          });
        } catch (e) {
          // Non-fatal
        }
        return { ok: true };
      }),
  }),
  calculator: router({
    saveSession: publicProcedure
      .input(z.object({
        route: z.string(),
        location: z.string(),
        pace: z.string(),
        experience: z.string(),
        funding: z.string(),
        totalEstimate: z.number().int(),
      }))
      .mutation(async ({ input }) => {
        await createCalcSession(input);
        return { ok: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
