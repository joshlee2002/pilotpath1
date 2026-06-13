# PilotPath TODO

## Phase 1 – Schema & Design System
- [x] Create database schema (leads, flight_schools, lead_assignments, admin_notes)
- [x] Apply schema migration via SQL
- [x] Set up design tokens (aviation colour palette, typography, global CSS)
- [x] Update index.html with Google Fonts

## Phase 2 – Server Routers
- [x] Lead submission procedure (public)
- [x] Lead scoring engine (server-side utility)
- [x] AI roadmap generation procedure (server-side, uses LLM)
- [x] AI admin lead summary procedure (server-side, uses LLM)
- [x] Admin: list leads with filters/search/pagination
- [x] Admin: update lead status and notes
- [x] Admin: CSV export
- [x] Admin: assign lead to school
- [x] Admin: delete lead
- [x] Flight schools: list/filter (public)
- [x] Flight schools: CRUD (admin)
- [x] School matching logic (post-quiz)
- [x] Owner notification on Hot lead

## Phase 3 – Marketing Home Page
- [x] Public navigation bar (logo, links, CTA button)
- [x] Hero section with headline and CTA
- [x] How it works section (3 steps)
- [x] Training routes section (Airline, Private, Corporate, Instructor)
- [x] Trust/social proof section
- [x] Training cost teaser section
- [x] Flight school matching teaser section
- [x] Footer with links

## Phase 4 – Multi-Step Quiz
- [x] Quiz page with progress bar
- [x] Section 1: Basic details (name, email, phone, country, city, age)
- [x] Section 2: Pilot goal and seriousness
- [x] Section 3: Training route preference
- [x] Section 4: Financial qualification
- [x] Section 5: Suitability (education, medical, experience)
- [x] Section 6: Intent and objections
- [x] Optional AI free-text answer box
- [x] GDPR consent checkbox (required)
- [x] Submit and trigger lead scoring

## Phase 5 – AI Personalised Report
- [x] Results/roadmap page
- [x] AI-generated training route recommendation
- [x] Estimated cost range display
- [x] Readiness score display (Hot/Warm/Cold badge)
- [x] Matched flight schools section
- [x] Next steps section
- [x] Disclaimer section

## Phase 6 – Admin Dashboard
- [x] Role-gated admin route (admin only)
- [x] Lead table with score, category badge, status
- [x] Search leads by name/email
- [x] Filter by country, score, goal, timeframe, budget, category
- [x] View full lead detail modal/page
- [x] AI summary display per lead
- [x] Add admin notes
- [x] Change lead status (8 statuses)
- [x] Mark contacted / sent to school
- [x] Assign lead to school
- [x] Delete lead
- [x] CSV export button
- [x] Admin: flight school management (add/edit/toggle active)

## Phase 7 – Flight School Directory & Cost Calculator
- [x] Public flight school directory page
- [x] Filter by country, training type, finance available
- [x] School profile cards
- [x] Training cost calculator page
- [x] Calculator: choose route (Integrated ATPL, Modular ATPL, PPL)
- [x] Calculator: choose country
- [x] Calculator: show estimated cost breakdown

## Phase 8 – SEO Guide Pages & Analytics
- [x] Guide: How to become a pilot
- [x] Guide: How much does pilot training cost?
- [x] Guide: Integrated vs Modular pilot training
- [x] Guide: What is a Class 1 Medical?
- [x] Guide: Airline pilot salary guide
- [x] Guide: Best route to become an airline pilot
- [x] Guide: Can I become a pilot without rich parents? (Finance guide)
- [x] Guide: How long does pilot training take? (Timeline guide)
- [x] Analytics: quiz started event
- [x] Analytics: quiz completed event
- [x] Analytics: lead submitted event
- [x] Analytics: hot lead generated event
- [x] Analytics: school recommendation clicked event
- [x] Analytics: contact requested event
- [x] Owner email notification on Hot lead (via notifyOwner)

## Phase 9 – Polish & Delivery
- [x] Wire all routes in App.tsx
- [x] Privacy Policy page
- [x] Terms page
- [x] Contact page
- [x] 404 page
- [x] Mobile responsiveness check
- [x] Vitest unit tests for scoring engine
- [x] Vitest unit tests for lead router
- [x] Final checkpoint
