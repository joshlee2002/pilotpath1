import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  AdminNote,
  FlightSchool,
  InsertAdminNote,
  InsertFlightSchool,
  InsertLead,
  InsertLeadAssignment,
  InsertUser,
  Lead,
  LeadAssignment,
  adminNotes,
  flightSchools,
  leadAssignments,
  leads,
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

  const [items, countResult] = await Promise.all([
    db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(pageSize).offset(offset),
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
