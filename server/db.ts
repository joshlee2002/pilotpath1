import { and, asc, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  AdminNote,
  FlightSchool,
  InsertAdminNote,
  InsertFlightSchool,
  InsertIntroductionRequest,
  InsertLead,
  InsertLeadAssignment,
  InsertLicenceQuizLead,
  InsertSchoolWaitlistEntry,
  InsertUser,
  IntroductionRequest,
  Lead,
  LeadAssignment,
  SchoolWaitlistEntry,
  adminNotes,
  flightSchools,
  introductionRequests,
  leadAssignments,
  leads,
  licenceQuizLeads,
  schoolWaitlist,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export async function createLead(data: InsertLead): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0];
}

export async function updateLead(id: number, data: Partial<InsertLead>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set(data).where(eq(leads.id, id));
}

export async function deleteLead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(leads).where(eq(leads.id, id));
}

export interface LeadFilters {
  search?: string;
  country?: string;
  category?: string;
  status?: string;
  pilotGoal?: string;
  budgetRange?: string;
  startTimeframe?: string;
  minScore?: number;
  maxScore?: number;
  wantsFinanceInfo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "leadScore" | "intentScore";
  sortDir?: "asc" | "desc";
}

export async function listLeads(filters: LeadFilters = {}): Promise<{ items: Lead[]; total: number }> {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [];

  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(like(leads.fullName, term), like(leads.email, term), like(leads.country, term))
    );
  }
  if (filters.country) conditions.push(eq(leads.country, filters.country));
  if (filters.category) conditions.push(eq(leads.leadCategory, filters.category as Lead["leadCategory"]));
  if (filters.status) conditions.push(eq(leads.status, filters.status as Lead["status"]));
  if (filters.pilotGoal) conditions.push(eq(leads.pilotGoal, filters.pilotGoal));
  if (filters.budgetRange) conditions.push(eq(leads.budgetRange, filters.budgetRange));
  if (filters.startTimeframe) conditions.push(eq(leads.startTimeframe, filters.startTimeframe));
  if (filters.wantsFinanceInfo) conditions.push(eq(leads.wantsFinanceInfo, filters.wantsFinanceInfo));
  if (filters.minScore !== undefined) conditions.push(gte(leads.leadScore, filters.minScore));
  if (filters.maxScore !== undefined) conditions.push(lte(leads.leadScore, filters.maxScore));

  const where = conditions.length > 0 ? and(...(conditions as [])) : undefined;

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;
  const offset = (page - 1) * pageSize;

  const sortField = filters.sortBy ?? "createdAt";
  const sortDir = filters.sortDir ?? "desc";
  const orderCol = sortField === "leadScore" ? leads.leadScore : sortField === "intentScore" ? leads.intentScore : leads.createdAt;
  const orderExpr = sortDir === "asc" ? asc(orderCol) : desc(orderCol);
  const [items, countResult] = await Promise.all([
    db.select().from(leads).where(where).orderBy(orderExpr).limit(pageSize).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(leads).where(where),
  ]);

  return { items, total: Number(countResult[0]?.count ?? 0) };
}

export async function getAllLeadsForExport(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

// ─── Admin Notes ──────────────────────────────────────────────────────────────
export async function createAdminNote(data: InsertAdminNote): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(adminNotes).values(data);
}

export async function getAdminNotesByLeadId(leadId: number): Promise<AdminNote[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(adminNotes).where(eq(adminNotes.leadId, leadId)).orderBy(desc(adminNotes.createdAt));
}

// ─── Flight Schools ───────────────────────────────────────────────────────────
export async function createFlightSchool(data: InsertFlightSchool): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(flightSchools).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function updateFlightSchool(id: number, data: Partial<InsertFlightSchool>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(flightSchools).set(data).where(eq(flightSchools.id, id));
}

export async function deleteFlightSchool(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(flightSchools).where(eq(flightSchools.id, id));
}

export interface SchoolFilters {
  country?: string;
  integratedAtpl?: boolean;
  modularAtpl?: boolean;
  ppl?: boolean;
  financeAvailable?: string;
  activeOnly?: boolean;
}

export async function listFlightSchools(filters: SchoolFilters = {}): Promise<FlightSchool[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.activeOnly !== false) conditions.push(eq(flightSchools.active, true));
  if (filters.country) conditions.push(eq(flightSchools.country, filters.country));
  if (filters.integratedAtpl) conditions.push(eq(flightSchools.integratedAtpl, true));
  if (filters.modularAtpl) conditions.push(eq(flightSchools.modularAtpl, true));
  if (filters.ppl) conditions.push(eq(flightSchools.ppl, true));
  if (filters.financeAvailable) conditions.push(sql`${flightSchools.financeAvailable} = ${filters.financeAvailable}`);

  const where = conditions.length > 0 ? and(...(conditions as [])) : undefined;
  return db.select().from(flightSchools).where(where).orderBy(flightSchools.name);
}

export async function getFlightSchoolById(id: number): Promise<FlightSchool | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(flightSchools).where(eq(flightSchools.id, id)).limit(1);
  return result[0];
}

// ─── Lead Assignments ─────────────────────────────────────────────────────────
export async function createLeadAssignment(data: InsertLeadAssignment): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(leadAssignments).values(data);
}

export async function getLeadAssignments(leadId: number): Promise<LeadAssignment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leadAssignments).where(eq(leadAssignments.leadId, leadId));
}

// ─── School Matching ──────────────────────────────────────────────────────────
export async function matchSchoolsForLead(lead: {
  country?: string | null;
  preferredRoute?: string | null;
  budgetRange?: string | null;
  wantsFinanceInfo?: string | null;
  openToAbroad?: string | null;
}): Promise<FlightSchool[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(flightSchools.active, true)] as Parameters<typeof and>;

  // Country matching: if not open to abroad, filter by country
  if (lead.country && lead.openToAbroad === "No") {
    conditions.push(eq(flightSchools.country, lead.country));
  }

  // Route matching
  if (lead.preferredRoute === "Integrated ATPL") {
    conditions.push(eq(flightSchools.integratedAtpl, true));
  } else if (lead.preferredRoute === "Modular ATPL") {
    conditions.push(eq(flightSchools.modularAtpl, true));
  } else if (lead.preferredRoute === "PPL only") {
    conditions.push(eq(flightSchools.ppl, true));
  }

  // Finance matching
  if (lead.wantsFinanceInfo === "Yes") {
    conditions.push(sql`${flightSchools.financeAvailable} = 'yes'`);
  }

  const where = and(...(conditions as []));
  const results = await db.select().from(flightSchools).where(where).limit(6);
  return results;
}

// ─── Introduction Requests ────────────────────────────────────────────────────
export async function createIntroductionRequest(data: InsertIntroductionRequest): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(introductionRequests).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function getIntroductionRequestsByLeadId(leadId: number): Promise<IntroductionRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(introductionRequests).where(eq(introductionRequests.leadId, leadId));
}

export async function listAllIntroductionRequests(): Promise<IntroductionRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(introductionRequests).orderBy(introductionRequests.createdAt);
}

// ─── School Waitlist ─────────────────────────────────────────────────────────
export async function createSchoolWaitlistEntry(
  data: InsertSchoolWaitlistEntry
): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schoolWaitlist).values(data);
  return { id: (result[0] as { insertId: number }).insertId };
}

export async function listSchoolWaitlist(): Promise<SchoolWaitlistEntry[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolWaitlist).orderBy(desc(schoolWaitlist.createdAt));
}

// ─── Analytics ──────────────────────────────────────────────────────────────────
export async function getLaunchStats() {
  const db = await getDb();
  if (!db) return null;

  const allLeads = await db.select().from(leads);
  const allIntros = await db.select().from(introductionRequests);

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const recent = allLeads.filter(l => l.createdAt.getTime() >= sevenDaysAgo);
  const recentIntros = allIntros.filter(i => i.createdAt.getTime() >= sevenDaysAgo);

  const total7d = recent.length;
  const hot7d = recent.filter(l => l.leadCategory === 'Hot').length;
  const introLeads7d = new Set(recentIntros.map(i => i.leadId)).size;
  const introRate7d = total7d > 0 ? Math.round((introLeads7d / total7d) * 100) : 0;
  const avgScore7d = total7d > 0 ? Math.round(recent.reduce((s, l) => s + (l.leadScore ?? 0), 0) / total7d) : 0;
  const avgBudget7d = total7d > 0 ? (() => {
    const budgetMap: Record<string, number> = {};
    for (const l of recent) { const b = l.budgetRange ?? 'Unknown'; budgetMap[b] = (budgetMap[b] ?? 0) + 1; }
    return Object.entries(budgetMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  })() : 'N/A';

  const topSource7d = (() => {
    const srcMap: Record<string, number> = {};
    for (const l of recent) { const s = l.source ?? 'Unknown'; srcMap[s] = (srcMap[s] ?? 0) + 1; }
    return Object.entries(srcMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  })();

  const topCountry7d = (() => {
    const cMap: Record<string, number> = {};
    for (const l of recent) { const c = l.country ?? 'Unknown'; cMap[c] = (cMap[c] ?? 0) + 1; }
    return Object.entries(cMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  })();

  // Leads per day last 7 days
  const leadsPerDay7d: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dayStr = d.toISOString().slice(0, 10);
    leadsPerDay7d.push({ date: dayStr, count: recent.filter(l => l.createdAt.toISOString().slice(0, 10) === dayStr).length });
  }

  return {
    total7d,
    hot7d,
    introLeads7d,
    introRate7d,
    avgScore7d,
    avgBudget7d,
    topSource7d,
    topCountry7d,
    leadsPerDay7d,
    // All-time totals for context
    totalAllTime: allLeads.length,
    hotAllTime: allLeads.filter(l => l.leadCategory === 'Hot').length,
    introAllTime: new Set(allIntros.map(i => i.leadId)).size,
  };
}

export async function getLeadAnalytics() {
  const db = await getDb();
  if (!db) return null;

  const allLeads = await db.select().from(leads);
  const total = allLeads.length;
  if (total === 0) return { total: 0, hot: 0, warm: 0, cold: 0, introductionRequestRate: 0, avgScore: 0, countryBreakdown: {}, goalBreakdown: {}, fundingBreakdown: {}, budgetBreakdown: {}, scoreDistribution: [], leadsPerDay: [] };

  const hot = allLeads.filter(l => l.leadCategory === 'Hot').length;
  const warm = allLeads.filter(l => l.leadCategory === 'Warm').length;
  const cold = allLeads.filter(l => l.leadCategory === 'Cold').length;
  const avgScore = Math.round(allLeads.reduce((s, l) => s + (l.leadScore ?? 0), 0) / total);

  // Introduction request rate
  const allIntros = await db.select().from(introductionRequests);
  const leadsWithIntros = new Set(allIntros.map(i => i.leadId)).size;
  const introductionRequestRate = total > 0 ? Math.round((leadsWithIntros / total) * 100) : 0;

  // Country breakdown
  const countryBreakdown: Record<string, number> = {};
  for (const l of allLeads) {
    const c = l.country ?? 'Unknown';
    countryBreakdown[c] = (countryBreakdown[c] ?? 0) + 1;
  }

  // Goal breakdown
  const goalBreakdown: Record<string, number> = {};
  for (const l of allLeads) {
    const g = l.pilotGoal ?? 'Unknown';
    goalBreakdown[g] = (goalBreakdown[g] ?? 0) + 1;
  }

  // Funding breakdown
  const fundingBreakdown: Record<string, number> = {};
  for (const l of allLeads) {
    const f = l.fundingMethod ?? 'Unknown';
    fundingBreakdown[f] = (fundingBreakdown[f] ?? 0) + 1;
  }

  // Budget breakdown
  const budgetBreakdown: Record<string, number> = {};
  for (const l of allLeads) {
    const b = l.budgetRange ?? 'Unknown';
    budgetBreakdown[b] = (budgetBreakdown[b] ?? 0) + 1;
  }

  // Source breakdown
  const sourceBreakdown: Record<string, number> = {};
  for (const l of allLeads) {
    const s = (l as any).source ?? 'Unknown';
    if (s && s !== 'Unknown') sourceBreakdown[s] = (sourceBreakdown[s] ?? 0) + 1;
  }

  // Score distribution (buckets of 10)
  const scoreDistribution = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}–${i * 10 + 9}`,
    count: allLeads.filter(l => (l.leadScore ?? 0) >= i * 10 && (l.leadScore ?? 0) <= i * 10 + 9).length,
  }));

  // Leads per day (last 30 days)
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recentLeads = allLeads.filter(l => l.createdAt.getTime() >= thirtyDaysAgo);
  const leadsPerDayMap: Record<string, number> = {};
  for (const l of recentLeads) {
    const day = l.createdAt.toISOString().slice(0, 10);
    leadsPerDayMap[day] = (leadsPerDayMap[day] ?? 0) + 1;
  }
  const leadsPerDay = Object.entries(leadsPerDayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return {
    total,
    hot,
    warm,
    cold,
    introductionRequestRate,
    avgScore,
    countryBreakdown,
    goalBreakdown,
    fundingBreakdown,
    budgetBreakdown,
    sourceBreakdown,
    scoreDistribution,
    leadsPerDay,
  };
}

// ─── Licence Quiz Helpers ─────────────────────────────────────────────────────

export async function createLicenceQuizLead(
  data: Omit<InsertLicenceQuizLead, "id" | "createdAt" | "email" | "consentToContact" | "proceededToMainQuiz">
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const [result] = await db.insert(licenceQuizLeads).values({
    ...data,
    consentToContact: false,
    proceededToMainQuiz: false,
  });
  return { id: (result as any).insertId as number };
}

export async function updateLicenceQuizEmail(id: number, email: string, consentToContact: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(licenceQuizLeads).set({ email, consentToContact }).where(eq(licenceQuizLeads.id, id));
}

export async function getLicenceQuizStats(): Promise<Record<string, { total: number; proceededRate: number }>> {
  const db = await getDb();
  if (!db) return {};
  const rows = await db.select().from(licenceQuizLeads);
  const stats: Record<string, { total: number; proceeded: number }> = {};
  for (const row of rows) {
    const key = row.recommendedLicence;
    if (!stats[key]) stats[key] = { total: 0, proceeded: 0 };
    stats[key].total++;
    if (row.proceededToMainQuiz) stats[key].proceeded++;
  }
  return Object.fromEntries(
    Object.entries(stats).map(([k, v]) => [
      k,
      { total: v.total, proceededRate: v.total > 0 ? Math.round((v.proceeded / v.total) * 100) : 0 },
    ])
  );
}
