import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Leads ────────────────────────────────────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  // Basic details
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  age: int("age"),
  // Pilot goal
  pilotGoal: varchar("pilotGoal", { length: 100 }),
  seriousness: varchar("seriousness", { length: 100 }),
  spokenToSchool: varchar("spokenToSchool", { length: 100 }),
  // Training route
  preferredRoute: varchar("preferredRoute", { length: 100 }),
  openToAbroad: varchar("openToAbroad", { length: 100 }),
  // Financial
  fundingMethod: varchar("fundingMethod", { length: 100 }),
  budgetRange: varchar("budgetRange", { length: 100 }),
  wantsFinanceInfo: varchar("wantsFinanceInfo", { length: 20 }),
  // Suitability
  educationLevel: varchar("educationLevel", { length: 100 }),
  class1Medical: varchar("class1Medical", { length: 100 }),
  flyingExperience: varchar("flyingExperience", { length: 100 }),
  rightToWorkStudy: varchar("rightToWorkStudy", { length: 50 }),
  // Intent
  biggestConcern: varchar("biggestConcern", { length: 100 }),
  startTimeframe: varchar("startTimeframe", { length: 100 }),
  wantsSchoolContact: varchar("wantsSchoolContact", { length: 10 }),
  // Source tracking
  source: varchar("source", { length: 100 }),
  preferredContact: varchar("preferredContact", { length: 50 }),
  contactConsentSchools: boolean("contactConsentSchools").default(true),
  contactConsentFinance: boolean("contactConsentFinance").default(false),
  contactConsentMedical: boolean("contactConsentMedical").default(false),
  contactConsentPartners: boolean("contactConsentPartners").default(false),
  // Consent
  consentToContact: boolean("consentToContact").default(false).notNull(),
  consentToShare: boolean("consentToShare").default(false).notNull(),
  // AI
  writtenAnswer: text("writtenAnswer"),
  aiSummary: text("aiSummary"),
  aiRoadmap: text("aiRoadmap"),
  // Scoring
  leadScore: int("leadScore").default(0).notNull(),
  leadCategory: mysqlEnum("leadCategory", ["Hot", "Warm", "Cold"]).default("Cold").notNull(),
  leadValue: mysqlEnum("leadValue", ["High", "Medium", "Low"]).default("Low").notNull(),
  /** Intent Score (0–100) — hidden from users, admin-only commercial intent signal */
  intentScore: int("intentScore").default(0).notNull(),
  // PDF
  pdfKey: varchar("pdfKey", { length: 500 }),
  // Status
  status: mysqlEnum("status", [
    "New",
    "Reviewed",
    "Contacted",
    "Sent to School",
    "School Interested",
    "Not Suitable",
    "Converted",
    "Archived",
  ])
    .default("New")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─── Flight Schools ───────────────────────────────────────────────────────────
export const flightSchools = mysqlTable("flight_schools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  airport: varchar("airport", { length: 100 }),
  courses: text("courses"),
  integratedAtpl: boolean("integratedAtpl").default(false),
  modularAtpl: boolean("modularAtpl").default(false),
  ppl: boolean("ppl").default(false),
  priceRange: varchar("priceRange", { length: 100 }),
  financeAvailable: mysqlEnum("financeAvailable", ["yes", "no", "unknown"]).default("unknown"),
  accommodationAvailable: mysqlEnum("accommodationAvailable", ["yes", "no", "unknown"]).default("unknown"),
  airlinePartnerships: text("airlinePartnerships"),
  website: varchar("website", { length: 500 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FlightSchool = typeof flightSchools.$inferSelect;
export type InsertFlightSchool = typeof flightSchools.$inferInsert;

// ─── Lead Assignments ─────────────────────────────────────────────────────────
export const leadAssignments = mysqlTable("lead_assignments", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  schoolId: int("schoolId").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  status: varchar("status", { length: 100 }),
  notes: text("notes"),
  estimatedValue: int("estimatedValue"),
});

export type LeadAssignment = typeof leadAssignments.$inferSelect;
export type InsertLeadAssignment = typeof leadAssignments.$inferInsert;

// ─── Admin Notes ──────────────────────────────────────────────────────────────
export const adminNotes = mysqlTable("admin_notes", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  note: text("note").notNull(),
  authorId: int("authorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminNote = typeof adminNotes.$inferSelect;
export type InsertAdminNote = typeof adminNotes.$inferInsert;

// ─── School Waitlist ─────────────────────────────────────────────────────────
export const schoolWaitlist = mysqlTable("school_waitlist", {
  id: int("id").autoincrement().primaryKey(),
  schoolName: varchar("schoolName", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  website: varchar("website", { length: 500 }),
  coursesOffered: text("coursesOffered"),
  financeAvailable: boolean("financeAvailable").default(false),
  interestedInLeads: boolean("interestedInLeads").default(true),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SchoolWaitlistEntry = typeof schoolWaitlist.$inferSelect;
export type InsertSchoolWaitlistEntry = typeof schoolWaitlist.$inferInsert;

// ─── Introduction Requests ────────────────────────────────────────────────────
export const introductionRequests = mysqlTable("introduction_requests", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  schoolId: int("schoolId").notNull(),
  schoolName: varchar("schoolName", { length: 255 }),
  status: mysqlEnum("status", ["Pending", "Sent", "Responded", "Declined"]).default("Pending").notNull(),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IntroductionRequest = typeof introductionRequests.$inferSelect;
export type InsertIntroductionRequest = typeof introductionRequests.$inferInsert;

// ─── Licence Quiz Leads ───────────────────────────────────────────────────────
export const licenceQuizLeads = mysqlTable("licence_quiz_leads", {
  id: int("id").autoincrement().primaryKey(),
  // Quiz answers
  goal: varchar("goal", { length: 50 }),           // professional | recreational | business | exploring
  timeCommitment: varchar("timeCommitment", { length: 50 }), // fulltime | parttime | flexible | limited
  budget: varchar("budget", { length: 50 }),        // under10k | 10k_30k | 30k_80k | 80k_130k | over130k | unsure
  wantsCommercial: varchar("wantsCommercial", { length: 50 }), // yes_commercial | maybe | no
  experience: varchar("experience", { length: 50 }), // none | trial | has_licence | experienced
  location: varchar("location", { length: 50 }),   // uk | europe | north_america | aus_nz | other
  speedPriority: varchar("speedPriority", { length: 50 }), // fast | balanced | slow
  mainPriority: varchar("mainPriority", { length: 50 }), // get_flying | career | research | value
  // Result
  recommendedLicence: varchar("recommendedLicence", { length: 50 }).notNull(), // LAPL | PPL | CPL | Integrated_ATPL | Modular_ATPL | FAA_PPL
  // Email capture (optional — gated behind detailed breakdown)
  email: varchar("email", { length: 320 }),
  consentToContact: boolean("consentToContact").default(false).notNull(),
  // Funnel tracking
  proceededToMainQuiz: boolean("proceededToMainQuiz").default(false).notNull(),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LicenceQuizLead = typeof licenceQuizLeads.$inferSelect;
export type InsertLicenceQuizLead = typeof licenceQuizLeads.$inferInsert;
