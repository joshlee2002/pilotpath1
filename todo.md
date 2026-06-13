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

## Phase 10 – AviatorIQ Rebrand & Platform Upgrade

- [x] Rename platform from PilotPath to AviatorIQ in all files (HTML title, nav, footer, meta, copy)
- [x] Update app title secret VITE_APP_TITLE to AviatorIQ
- [x] Update scoring engine to return 5 sub-scores (Readiness, Finance, Medical, Career, Pathway)
- [x] Rebuild results page with 5-dimension AviatorIQ score card
- [x] Replace "Visit School" links with "Request Introduction" checkbox flow
- [x] Add introduction_requests table to schema and router
- [x] Seed 50 real flight schools with country, type, finance, website data
- [x] Add finance matching layer on results page
- [x] Update admin dashboard to show introduction requests

## Phase 11 – Pilot Blueprint PDF & Admin Insights

- [x] Install PDF generation library (pdfkit or similar) on server
- [x] Build server-side PDF generator: cover page, score card, pilot profile, recommended route, cost estimate, timeline, matched schools, risks, next actions, disclaimer
- [x] Store generated PDF in S3 and save key to lead record
- [x] Add tRPC procedure to download/retrieve PDF by lead ID
- [x] Add download button on results page
- [x] Auto-email PDF to user on quiz submission (via notifyOwner pattern or direct email)
- [x] Admin insights panel: aggregate stats (avg budget, funding method distribution, goal breakdown, score band conversion)
- [x] Admin insights panel: country distribution chart
- [x] Admin insights panel: leads over time chart

## Phase 12 – Partner Page, Quiz Enhancement, PDF & Analytics

- [x] Partner With AviatorIQ school-facing sales page (/partner)
- [x] Add preferred contact method question to quiz (Email/Phone/WhatsApp/Any)
- [x] Add preferredContact field to leads schema and migration
- [x] Lead value estimation in admin dashboard (High/Medium/Low, not visible to users)
- [x] PDF Pilot Blueprint: server-side generation with pdfkit
- [x] PDF stored in S3, key saved to lead record
- [x] PDF download endpoint (tRPC procedure)
- [x] PDF download button on results page
- [x] Auto-email PDF to user on quiz submission
- [x] Admin analytics panel: completion stats, score distribution, budget averages, funding breakdown, country split, goal breakdown, leads over time
- [x] Wire /partner route in App.tsx and add to nav footer

## Phase 13 – Launch Prep (Stop After This)

- [x] Add "For Schools" link to top navigation bar
- [x] Add social sharing (Twitter/X and WhatsApp) to results page with user-centric copy
- [x] Add source tracking field to leads schema and migration
- [x] Add source question to quiz (Instagram, Facebook, Reddit, Google, YouTube, Friend, Other)
- [x] Show source column in admin lead table and detail panel
- [x] Add source breakdown to admin analytics panel

## Phase 13 – Launch Prep (Feature Complete After This)

- [x] Add "For Schools" link to top navigation bar (outlined button, distinct from CTA)
- [x] Add social sharing to results page (Twitter/X and WhatsApp, user-centric copy)
- [x] Add source field to leads schema (Instagram, Facebook, Reddit, Google, YouTube, Friend, Other)
- [x] Add "How did you hear about us?" question to quiz
- [x] Show source in admin lead table and detail panel
- [x] Add source breakdown to admin analytics panel
- [x] Build Launch Dashboard at top of admin: last 7 days stats (visitors, quiz starts, completions, completion rate, Flight Ready leads, intro requests, intro rate, top source, top country, avg budget)

## Phase 14 – Currency Conversion

- [x] Create CurrencyContext with geo-detection (ipapi.co), exchange rates, and formatPrice helper
- [x] Update Calculator page to use detected currency with live conversion
- [x] Update Schools directory price ranges to show converted currency
- [x] Update Results page cost estimates to show converted currency
- [x] Add manual currency switcher (flag + code) in PublicNav
- [x] Write vitest tests for currency formatting and conversion logic

## Phase 15 – Licence Quiz ("Which Pilot Licence Is Right For You?")

- [x] Add licenceQuizLeads table to drizzle schema and apply migration
- [x] Build scoring logic in server/licenceQuizScoring.ts (6 outcomes)
- [x] Add tRPC procedures: submitLicenceQuiz, getLicenceQuizStats
- [x] Build 8-step quiz UI at /quiz/licence
- [x] Build results page at /quiz/licence/results with immediate result display
- [x] Add email gate for detailed PDF breakdown (email + consent only)
- [x] Add social proof stat ("X% of users with this result take the career assessment")
- [x] Add AviatorIQ Career Assessment CTA funnel on results page
- [x] Add licence quiz entry point card on homepage
- [x] Add licence quiz link in PublicNav and footer
- [x] Register /quiz/licence and /quiz/licence/results routes in App.tsx
- [x] Write vitest tests for licence quiz scoring logic

## Phase 16 – Flight Deck Quiz ("How Close Are You To The Flight Deck?")

- [x] Build client-side scoring engine in client/src/lib/flightDeckScoring.ts
- [x] Build 6-question quiz UI at /quiz/flight-deck with dark aviation theme
- [x] Build results page at /quiz/flight-deck/results with Flight Potential Score, barrier card, timeline, and AviatorIQ CTA
- [x] Register routes in App.tsx
- [x] Add Flight Deck quiz as primary card in homepage QuizTeaserSection (3-card grid)
- [x] Update PublicNav Quizzes link to point to /quiz/flight-deck
- [x] Write vitest tests for flightDeckScoring engine (10 tests)
- [x] Write vitest tests for licenceQuizScoring engine (8 tests)

## Phase 17 – Monetisation: Finance Referral, Shareable Results, Guide Rewrites
- [x] finance_interests table added to schema and applied to live DB
- [x] flight_deck_shares table added to schema and applied to live DB
- [x] Finance referral lead capture card on Results page (email, name, phone capture + owner notification)
- [x] Finance referral card on FlightDeckResults page
- [x] Shareable Flight Deck result URL at /quiz/flight-deck/share/:shareId
- [x] Copy-link button on FlightDeckResults page (saves result to DB, generates share URL)
- [x] FlightDeckShare public page (loads result by shareId, CTA to take quiz)
- [x] Rewrite HowToBecomePilot guide (12 min, 6+ sections, tables, quiz CTA)
- [x] Rewrite AirlinePilotSalary guide (8 min, salary tables, airline comparison)
- [x] Rewrite Class1Medical guide (10 min, conditions table, AME info)
- [x] Rewrite FinanceGuide (10 min, funding sources table, cadet programmes)
- [x] Rewrite IntegratedVsModular guide (9 min, comparison table)
- [x] Rewrite PilotTrainingCosts guide (11 min, full cost breakdown table)
- [x] Rewrite BestRouteToAirline guide (9 min, cadet programme table)
- [x] Rewrite TrainingTimeline guide (8 min, timeline table)

## Phase 18 – Personalised Pilot Training Cost Calculator
- [x] Replace static Calculator.tsx with personalised multi-step calculator (5 inputs)
- [x] Client-side cost engine: route × location × pace × experience × funding adjustments
- [x] Live results panel: specific midpoint estimate, itemised breakdown, monthly payment plan
- [x] "What this means for you" insight paragraph based on inputs
- [x] calc_sessions table added to schema and applied to live DB (analytics)
- [x] tRPC procedure: saveCalcSession (saves inputs + result for analytics)
- [x] Write vitest tests for cost calculation engine

- [x] Add SEO meta tags (title, description, canonical) to all guide pages and tool pages
- [x] Add FAQ schema (JSON-LD) to all guide pages for rich snippets
- [x] Add Open Graph tags for social sharing
- [x] Remove direct school website links from Results page matched schools section
- [x] Remove direct school website links from Schools directory listing cards
- [x] Make "Request Introduction" the only school CTA on Results and Schools pages
- [x] Build Integrated vs Modular Decision Tool (/tools/integrated-vs-modular)
- [x] Build Class 1 Medical Readiness Check (/tools/class-1-medical-check)
- [x] Add both new tools to nav Tools dropdown and homepage tools section
