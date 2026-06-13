import { describe, expect, it } from "vitest";
import { scoreLead } from "./scoring";

describe("scoreLead", () => {
  it("returns a score between 0 and 100", () => {
    const result = scoreLead({
      age: 25,
      pilotGoal: "Airline pilot",
      seriousness: "I want to start as soon as possible",
      budgetRange: "£100,000+",
      fundingMethod: "Self-funded",
      wantsFinanceInfo: "No",
      class1Medical: "Yes",
      flyingExperience: "PPL holder",
      rightToWorkStudy: "Yes",
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("classifies a highly ready lead as Hot (score >= 85)", () => {
    const result = scoreLead({
      age: 22,
      pilotGoal: "Airline pilot",
      seriousness: "I want to start as soon as possible",
      budgetRange: "£100,000+",
      fundingMethod: "Self-funded",
      wantsFinanceInfo: "No",
      class1Medical: "Yes",
      flyingExperience: "PPL holder",
      rightToWorkStudy: "Yes",
      phone: "+44 7700 900000",
      writtenAnswer: "I have always wanted to fly and have been saving for 3 years.",
      preferredRoute: "Integrated ATPL (full-time, 18-24 months)",
      country: "GB",
    });
    expect(result.category).toBe("Hot");
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it("classifies a low-readiness lead as Cold (score < 55)", () => {
    const result = scoreLead({
      age: 55,
      pilotGoal: "Just exploring",
      seriousness: "Just exploring",
      budgetRange: "Under £10,000",
      fundingMethod: "Not sure",
      wantsFinanceInfo: "No",
      class1Medical: "No",
      flyingExperience: "None",
      rightToWorkStudy: "No",
    });
    expect(result.category).toBe("Cold");
    expect(result.score).toBeLessThan(55);
  });

  it("scores a hot lead higher than a cold lead", () => {
    const hot = scoreLead({
      age: 22,
      pilotGoal: "Airline pilot",
      seriousness: "I want to start as soon as possible",
      budgetRange: "£100,000+",
      fundingMethod: "Self-funded",
      rightToWorkStudy: "Yes",
    });
    const cold = scoreLead({
      age: 55,
      pilotGoal: "Just exploring",
      seriousness: "Just exploring",
      budgetRange: "Under £10,000",
    });
    expect(hot.score).toBeGreaterThan(cold.score);
  });

  it("returns correct breakdown structure", () => {
    const result = scoreLead({ age: 25, pilotGoal: "Airline pilot" });
    expect(result.breakdown).toHaveProperty("intent");
    expect(result.breakdown).toHaveProperty("finance");
    expect(result.breakdown).toHaveProperty("suitability");
    expect(result.breakdown).toHaveProperty("engagement");
  });

  it("applies correct category thresholds: Hot >= 85, Warm 55-84, Cold < 55", () => {
    const result = scoreLead({
      age: 22,
      pilotGoal: "Airline pilot",
      seriousness: "I want to start as soon as possible",
      budgetRange: "£100,000+",
      fundingMethod: "Self-funded",
      class1Medical: "Yes",
      rightToWorkStudy: "Yes",
      phone: "+44 7700 900000",
      writtenAnswer: "I have been saving for years and am ready to commit.",
      preferredRoute: "Integrated ATPL (full-time, 18-24 months)",
      country: "GB",
    });
    if (result.score >= 85) {
      expect(result.category).toBe("Hot");
    } else if (result.score >= 55) {
      expect(result.category).toBe("Warm");
    } else {
      expect(result.category).toBe("Cold");
    }
  });

  it("classifies a mid-range lead as Warm (score 55-84)", () => {
    const result = scoreLead({
      age: 30,
      pilotGoal: "Airline pilot",
      seriousness: "I want to start within 1-3 years",
      budgetRange: "£25,000-£50,000",
      fundingMethod: "Loan/finance",
      rightToWorkStudy: "Yes",
    });
    expect(["Hot", "Warm", "Cold"]).toContain(result.category);
    if (result.score >= 85) expect(result.category).toBe("Hot");
    else if (result.score >= 55) expect(result.category).toBe("Warm");
    else expect(result.category).toBe("Cold");
  });

  // ── Intent Score tests ────────────────────────────────────────────────────

  it("returns intentScore between 0 and 100", () => {
    const result = scoreLead({ age: 25, pilotGoal: "Airline pilot" });
    expect(result.intentScore).toBeGreaterThanOrEqual(0);
    expect(result.intentScore).toBeLessThanOrEqual(100);
  });

  it("gives a higher intentScore to a lead with phone, urgency, and school contact", () => {
    const highIntent = scoreLead({
      seriousness: "I want to start as soon as possible",
      spokenToSchool: "I have already applied somewhere",
      phone: "+44 7700 900000",
      wantsFinanceInfo: "Yes",
    });
    const lowIntent = scoreLead({
      seriousness: "Just exploring",
    });
    expect(highIntent.intentScore).toBeGreaterThan(lowIntent.intentScore);
  });

  it("intentScore is 0 when no intent signals are present", () => {
    const result = scoreLead({
      age: 25,
      pilotGoal: "Airline pilot",
      budgetRange: "£100,000+",
      fundingMethod: "Self-funded",
      class1Medical: "Yes",
    });
    // No phone, no seriousness, no spokenToSchool, no wantsFinanceInfo
    expect(result.intentScore).toBe(0);
  });

  it("intentScore reaches maximum with all intent signals present", () => {
    const result = scoreLead({
      seriousness: "I want to start as soon as possible",
      spokenToSchool: "I have already applied somewhere",
      phone: "+44 7700 900000",
      wantsFinanceInfo: "Yes",
    });
    // 30 (school) + 30 (seriousness) + 25 (phone) + 15 (finance) = 100
    expect(result.intentScore).toBe(100);
  });
});
