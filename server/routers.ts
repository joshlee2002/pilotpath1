import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAdminNote,
  createFlightSchool,
  createLead,
  createLeadAssignment,
  deleteLead,
  deleteFlightSchool,
  getAdminNotesByLeadId,
  getAllLeadsForExport,
  getFlightSchoolById,
  getLeadAssignments,
  getLeadById,
  listFlightSchools,
  listLeads,
  matchSchoolsForLead,
  updateFlightSchool,
  updateLead,
} from "./db";
import { scoreLead } from "./scoring";

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
        const { score, category } = scoreLead({
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
        });

        // Generate AI summary (non-blocking, best-effort)
        let aiSummary: string | undefined;
        try {
          const summaryPrompt = `You are an aviation training advisor. Summarise this pilot training enquiry in 2-3 sentences for an admin dashboard. Be concise and factual. Use cautious language.

Lead details:
- Name: ${input.fullName}
- Country: ${input.country ?? "Unknown"}
- Age: ${input.age ?? "Unknown"}
- Goal: ${input.pilotGoal ?? "Unknown"}
- Seriousness: ${input.seriousness ?? "Unknown"}
- Route: ${input.preferredRoute ?? "Unknown"}
- Budget: ${input.budgetRange ?? "Unknown"}
- Funding: ${input.fundingMethod ?? "Unknown"}
- Start timeframe: ${input.startTimeframe ?? "Unknown"}
- Concern: ${input.biggestConcern ?? "Unknown"}
- Medical: ${input.class1Medical ?? "Unknown"}
- Written answer: ${input.writtenAnswer ?? "None"}

Lead score: ${score}/100 (${category})`;

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

        const leadId = await createLead({
          ...input,
          leadScore: score,
          leadCategory: category,
          aiSummary,
          status: "New",
        });

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

        return { leadId, score, category, matchedSchools };
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

        return { lead, matchedSchools };
      }),

    generateRoadmap: publicProcedure
      .input(z.object({ leadId: z.number() }))
      .mutation(async ({ input }) => {
        const lead = await getLeadById(input.leadId);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND" });

        // Return cached roadmap if available
        if (lead.aiRoadmap) {
          return { roadmap: lead.aiRoadmap };
        }

        const prompt = `You are an expert aviation career advisor. Generate a personalised pilot training roadmap for this candidate. Format your response as structured JSON.

Candidate profile:
- Name: ${lead.fullName}
- Age: ${lead.age ?? "Unknown"}
- Country: ${lead.country ?? "Unknown"}
- Goal: ${lead.pilotGoal ?? "Unknown"}
- Preferred route: ${lead.preferredRoute ?? "Unknown"}
- Budget: ${lead.budgetRange ?? "Unknown"}
- Funding: ${lead.fundingMethod ?? "Unknown"}
- Wants finance info: ${lead.wantsFinanceInfo ?? "Unknown"}
- Medical status: ${lead.class1Medical ?? "Unknown"}
- Flying experience: ${lead.flyingExperience ?? "Unknown"}
- Start timeframe: ${lead.startTimeframe ?? "Unknown"}
- Open to abroad: ${lead.openToAbroad ?? "Unknown"}
- Biggest concern: ${lead.biggestConcern ?? "Unknown"}
- Written answer: ${lead.writtenAnswer ?? "None provided"}
- Readiness score: ${lead.leadScore}/100 (${lead.leadCategory})

Return a JSON object with these exact keys:
{
  "pilotGoalSummary": "1-2 sentence summary of their goal",
  "recommendedRoute": "The recommended training route name",
  "routeRationale": "2-3 sentences explaining why this route suits them",
  "estimatedCostMin": number (GBP, no currency symbol),
  "estimatedCostMax": number (GBP, no currency symbol),
  "estimatedDuration": "e.g. 18-24 months",
  "readinessLabel": "Strong Candidate | Developing Candidate | Early-Stage Researcher",
  "readinessExplanation": "1-2 sentences about their readiness",
  "nextSteps": ["step 1", "step 2", "step 3", "step 4"],
  "medicalAdvice": "1-2 sentences about Class 1 Medical",
  "financeConsiderations": "1-2 sentences about financing",
  "schoolTypeRecommendation": "What type of school to look for",
  "disclaimer": "This report is guidance only and not official career, medical or financial advice. Always consult qualified professionals before making training decisions."
}

Use cautious, helpful language. Do not invent specific school prices unless they are well-established industry averages. Do not make promises about employment or medical approval.`;

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
});

export type AppRouter = typeof appRouter;
