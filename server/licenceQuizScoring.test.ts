import { describe, it, expect } from "vitest";
import { scoreLicenceQuiz } from "./licenceQuizScoring";

const atplProfile = {
  goal: "professional",
  timeCommitment: "fulltime",
  budget: "over130k",
  wantsCommercial: "yes_commercial",
  experience: "none",
  location: "uk",
  speedPriority: "fast",
  mainPriority: "career",
};

const pplProfile = {
  goal: "recreational",
  timeCommitment: "parttime",
  budget: "30k_80k",
  wantsCommercial: "no",
  experience: "none",
  location: "uk",
  speedPriority: "balanced",
  mainPriority: "research",
};

const laplProfile = {
  goal: "recreational",
  timeCommitment: "limited",
  budget: "under10k",
  wantsCommercial: "no",
  experience: "none",
  location: "europe",
  speedPriority: "slow",
  mainPriority: "value",
};

const faaProfile = {
  goal: "recreational",
  timeCommitment: "parttime",
  budget: "10k_30k",
  wantsCommercial: "no",
  experience: "none",
  location: "north_america",
  speedPriority: "balanced",
  mainPriority: "get_flying",
};

describe("scoreLicenceQuiz", () => {
  it("recommends Integrated ATPL for fast-track professional in UK with high budget", () => {
    const r = scoreLicenceQuiz(atplProfile);
    expect(r.licence).toBe("Integrated_ATPL");
  });

  it("recommends PPL for recreational UK pilot with moderate budget", () => {
    const r = scoreLicenceQuiz(pplProfile);
    expect(r.licence).toBe("PPL");
  });

  it("recommends LAPL for budget-limited recreational European pilot", () => {
    const r = scoreLicenceQuiz(laplProfile);
    expect(r.licence).toBe("LAPL");
  });

  it("recommends FAA PPL for North American recreational pilot", () => {
    const r = scoreLicenceQuiz(faaProfile);
    expect(r.licence).toBe("FAA_PPL");
  });

  it("recommends Modular ATPL for professional with limited budget and time", () => {
    const r = scoreLicenceQuiz({
      ...atplProfile,
      budget: "30k_80k",
      timeCommitment: "parttime",
      speedPriority: "slow",
    });
    expect(r.licence).toBe("Modular_ATPL");
  });

  it("returns all required result fields", () => {
    const r = scoreLicenceQuiz(atplProfile);
    expect(r).toHaveProperty("licence");
    expect(r).toHaveProperty("title");
    expect(r).toHaveProperty("tagline");
    expect(r).toHaveProperty("description");
    expect(r).toHaveProperty("estimatedCost");
    expect(r).toHaveProperty("estimatedTimeline");
    expect(r).toHaveProperty("bullets");
    expect(r).toHaveProperty("bestFor");
    expect(r).toHaveProperty("ctaText");
  });

  it("bullets is a non-empty array", () => {
    const r = scoreLicenceQuiz(pplProfile);
    expect(Array.isArray(r.bullets)).toBe(true);
    expect(r.bullets.length).toBeGreaterThan(0);
  });

  it("experienced pilot with commercial goal gets CPL or ATPL", () => {
    const r = scoreLicenceQuiz({
      ...atplProfile,
      experience: "has_licence",
      budget: "30k_80k",
      timeCommitment: "parttime",
    });
    expect(["CPL", "Modular_ATPL"]).toContain(r.licence);
  });
});
