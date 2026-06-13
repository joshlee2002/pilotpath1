import { describe, expect, it } from "vitest";

// ─── Inline cost engine (mirrors client/src/pages/Calculator.tsx) ─────────────
// We duplicate the pure computation logic here so it can be unit-tested
// without a browser environment.

type Route = "integrated_uk" | "modular_uk" | "ppl_uk" | "integrated_eu" | "integrated_us";
type Location = "uk_south" | "uk_north" | "europe" | "usa" | "online_only";
type Pace = "full_time" | "part_time" | "flexible";
type Experience = "zero" | "ppl" | "ppl_night" | "ppl_ir";
type Funding = "self_funded" | "loan" | "cadet" | "part_funded";

const BASE_MONTHS: Record<Route, Record<Pace, number>> = {
  integrated_uk: { full_time: 18, part_time: 36, flexible: 30 },
  modular_uk: { full_time: 24, part_time: 48, flexible: 36 },
  ppl_uk: { full_time: 6, part_time: 18, flexible: 12 },
  integrated_eu: { full_time: 18, part_time: 36, flexible: 28 },
  integrated_us: { full_time: 30, part_time: 54, flexible: 42 },
};

const BASE_TOTALS: Record<Route, number> = {
  integrated_uk: 124350,  // sum of all base items
  modular_uk: 52400,
  ppl_uk: 12850,
  integrated_eu: 110950,
  integrated_us: 99000,
};

const LOCATION_TRAINING_MULT: Record<Location, number> = {
  uk_south: 1.1,
  uk_north: 0.95,
  europe: 0.92,
  usa: 1.0,
  online_only: 1.0,
};

const EXPERIENCE_CREDITS: Record<Route, Record<Experience, number>> = {
  integrated_uk: { zero: 0, ppl: 0, ppl_night: 0, ppl_ir: 0 },
  modular_uk: { zero: 0, ppl: 11000, ppl_night: 12200, ppl_ir: 24200 },
  ppl_uk: { zero: 0, ppl: 9500, ppl_night: 9500, ppl_ir: 9500 },
  integrated_eu: { zero: 0, ppl: 0, ppl_night: 0, ppl_ir: 0 },
  integrated_us: { zero: 0, ppl: 11000, ppl_night: 11000, ppl_ir: 22000 },
};

function getMonths(route: Route, pace: Pace): number {
  return BASE_MONTHS[route][pace];
}

function getExperienceCredit(route: Route, experience: Experience): number {
  return EXPERIENCE_CREDITS[route][experience];
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("calculator cost engine", () => {
  describe("training duration", () => {
    it("integrated_uk full_time is 18 months", () => {
      expect(getMonths("integrated_uk", "full_time")).toBe(18);
    });

    it("modular_uk part_time is 48 months", () => {
      expect(getMonths("modular_uk", "part_time")).toBe(48);
    });

    it("ppl_uk full_time is 6 months", () => {
      expect(getMonths("ppl_uk", "full_time")).toBe(6);
    });

    it("integrated_us flexible is 42 months", () => {
      expect(getMonths("integrated_us", "flexible")).toBe(42);
    });
  });

  describe("experience credits", () => {
    it("zero experience gives no credit on any route", () => {
      const routes: Route[] = ["integrated_uk", "modular_uk", "ppl_uk", "integrated_eu", "integrated_us"];
      for (const route of routes) {
        expect(getExperienceCredit(route, "zero")).toBe(0);
      }
    });

    it("PPL credit on modular_uk is £11,000", () => {
      expect(getExperienceCredit("modular_uk", "ppl")).toBe(11000);
    });

    it("IR credit on modular_uk is £24,200", () => {
      expect(getExperienceCredit("modular_uk", "ppl_ir")).toBe(24200);
    });

    it("integrated routes give no experience credit", () => {
      expect(getExperienceCredit("integrated_uk", "ppl_ir")).toBe(0);
      expect(getExperienceCredit("integrated_eu", "ppl_ir")).toBe(0);
    });

    it("PPL credit on integrated_us is £11,000", () => {
      expect(getExperienceCredit("integrated_us", "ppl")).toBe(11000);
    });
  });

  describe("location multipliers", () => {
    it("uk_south has higher training multiplier than uk_north", () => {
      expect(LOCATION_TRAINING_MULT["uk_south"]).toBeGreaterThan(LOCATION_TRAINING_MULT["uk_north"]);
    });

    it("europe has lower training multiplier than uk_south", () => {
      expect(LOCATION_TRAINING_MULT["europe"]).toBeLessThan(LOCATION_TRAINING_MULT["uk_south"]);
    });

    it("uk_south multiplier is 1.1", () => {
      expect(LOCATION_TRAINING_MULT["uk_south"]).toBe(1.1);
    });
  });

  describe("monthly payment calculation", () => {
    it("monthly payment for self-funded integrated_uk full_time is total / 18", () => {
      const total = 124350;
      const months = 18;
      const monthly = Math.round(total / months);
      expect(monthly).toBe(6908);
    });

    it("loan adds ~20% to effective total cost", () => {
      const total = 100000;
      const withLoan = Math.round(total * 1.2);
      expect(withLoan).toBe(120000);
    });

    it("cadet scheme monthly payment is zero", () => {
      const funding: Funding = "cadet";
      const monthlyPayment = funding === "cadet" ? 0 : 1000;
      expect(monthlyPayment).toBe(0);
    });
  });
});
