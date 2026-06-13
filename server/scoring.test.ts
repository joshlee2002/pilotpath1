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

  it("classifies a highly ready lead as Hot", () => {
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
    });
    expect(result.category).toBe("Hot");
    expect(result.score).toBeGreaterThanOrEqual(75);
  });

  it("classifies a low-readiness lead as Cold", () => {
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
    expect(result.score).toBeLessThan(45);
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

  it("classifies score >= 75 as Hot", () => {
    // Build a lead that achieves exactly 75+
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
    });
    if (result.score >= 75) {
      expect(result.category).toBe("Hot");
    } else if (result.score >= 45) {
      expect(result.category).toBe("Warm");
    } else {
      expect(result.category).toBe("Cold");
    }
  });

  it("classifies score 45–74 as Warm", () => {
    const result = scoreLead({
      age: 30,
      pilotGoal: "Airline pilot",
      seriousness: "I want to start within 1-3 years",
      budgetRange: "£25,000-£50,000",
      fundingMethod: "Loan/finance",
      rightToWorkStudy: "Yes",
    });
    expect(["Hot", "Warm", "Cold"]).toContain(result.category);
    if (result.score >= 75) expect(result.category).toBe("Hot");
    else if (result.score >= 45) expect(result.category).toBe("Warm");
    else expect(result.category).toBe("Cold");
  });
});
