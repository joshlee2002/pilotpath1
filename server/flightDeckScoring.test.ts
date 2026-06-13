import { describe, it, expect } from "vitest";
import { scoreFlightDeckQuiz } from "./flightDeckScoring";

const highProfile = {
  dream: "airline_captain",
  barrier: "cost",
  age: "18_25",
  budget: "funded",
  experience: "ppl",
  timeline: "asap",
};

const lowProfile = {
  dream: "not_sure",
  barrier: "medical",
  age: "over45",
  budget: "none",
  experience: "none",
  timeline: "someday",
};

describe("scoreFlightDeckQuiz", () => {
  it("returns a score between 0 and 100", () => {
    const r = scoreFlightDeckQuiz(highProfile);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });

  it("high profile scores Flight Ready (>=75)", () => {
    const r = scoreFlightDeckQuiz(highProfile);
    expect(r.score).toBeGreaterThanOrEqual(75);
    expect(r.phase).toBe("Flight Ready");
  });

  it("low profile scores Exploration (<45)", () => {
    const r = scoreFlightDeckQuiz(lowProfile);
    expect(r.score).toBeLessThan(45);
    expect(r.phase).toBe("Exploration");
  });

  it("mid profile scores Development (45-74)", () => {
    const mid = {
      dream: "private_jet",
      barrier: "time",
      age: "26_35",
      budget: "moderate",
      experience: "trial",
      timeline: "two_five",
    };
    const r = scoreFlightDeckQuiz(mid);
    expect(r.score).toBeGreaterThanOrEqual(45);
    expect(r.score).toBeLessThan(75);
    expect(r.phase).toBe("Development");
  });

  it("returns all required fields", () => {
    const r = scoreFlightDeckQuiz(highProfile);
    expect(r).toHaveProperty("headline");
    expect(r).toHaveProperty("subheadline");
    expect(r).toHaveProperty("biggestBarrier");
    expect(r).toHaveProperty("barrierAdvice");
    expect(r).toHaveProperty("estimatedTimeline");
    expect(r).toHaveProperty("recommendedRoute");
    expect(r).toHaveProperty("shareText");
  });

  it("fun dream recommends PPL", () => {
    const r = scoreFlightDeckQuiz({ ...highProfile, dream: "fun" });
    expect(r.recommendedRoute).toContain("PPL");
  });

  it("airline captain with funded budget and asap timeline recommends Integrated ATPL", () => {
    const r = scoreFlightDeckQuiz({ ...highProfile, budget: "funded", timeline: "asap" });
    expect(r.recommendedRoute).toContain("Integrated ATPL");
  });

  it("share text includes score and phase", () => {
    const r = scoreFlightDeckQuiz(highProfile);
    expect(r.shareText).toContain(String(r.score));
    expect(r.shareText).toContain(r.phase);
  });

  it("medical barrier gives appropriate advice about AME", () => {
    const r = scoreFlightDeckQuiz({ ...highProfile, barrier: "medical" });
    expect(r.barrierAdvice).toContain("AME");
  });

  it("cost barrier gives appropriate advice about funding", () => {
    const r = scoreFlightDeckQuiz({ ...highProfile, barrier: "cost" });
    expect(r.barrierAdvice).toContain("modular");
  });
});
