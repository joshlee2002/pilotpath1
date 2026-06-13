/**
 * PilotPath Analytics
 * Tracks exactly 6 events via Umami (built-in analytics) and window.umami if available.
 */

type AnalyticsEvent =
  | "quiz_started"
  | "quiz_completed"
  | "lead_submitted"
  | "hot_lead_generated"
  | "school_recommendation_clicked"
  | "contact_requested";

export function trackEvent(event: AnalyticsEvent, data?: Record<string, string | number | boolean>) {
  try {
    // Umami analytics (built-in)
    if (typeof window !== "undefined" && (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } }).umami) {
      (window as unknown as { umami: { track: (e: string, d?: unknown) => void } }).umami.track(event, data);
    }
  } catch (e) {
    // Analytics failures should never break the app
  }
}

export const Analytics = {
  quizStarted: () => trackEvent("quiz_started"),
  quizCompleted: () => trackEvent("quiz_completed"),
  leadSubmitted: (score: number, category: string) =>
    trackEvent("lead_submitted", { score, category }),
  hotLeadGenerated: (country?: string) =>
    trackEvent("hot_lead_generated", { country: country ?? "unknown" }),
  schoolRecommendationClicked: (schoolName: string) =>
    trackEvent("school_recommendation_clicked", { school: schoolName }),
  contactRequested: () => trackEvent("contact_requested"),
};
