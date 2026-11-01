# EventSense (Jashn) — 8-Slide Pitch Deck Outline

---

## Slide 1: Title & Hook
- **Headline**: **EventSense (Jashn)**
- **Sub-headline**: *The GenAI Celebration Planner where Festivities Meet Flawless Math.*
- **Visual**: Editorial ivory parchment background, deep oxblood branding, and a celebration dashboard preview.
- **Key Message**: Transforming fragmented WhatsApp notes and broken spreadsheets into structured, deterministic celebration roadmaps for weddings, birthdays, and festivals.

---

## Slide 2: The Problem — The Indian Celebration Chaos
- **Headline**: Celebrations are Emotionally High-Stakes and Mathematically Unforgiving.
- **Bullet Points**:
  - **Budget Blindspots**: ₹10 Lakh budgets explode into ₹16 Lakh due to hidden plate additions, last-minute vendor advances, and missing buffers.
  - **Dynamic Invariants**: Indian celebrations aren't static. A +50 guest increase breaks catering plate minimums, seating charts, and photography schedules.
  - **Generic SaaS Mismatch**: Existing tools look like blue enterprise Jira boards and have no understanding of Indian muhurats, sangeet logistics, or community diwali permits.

---

## Slide 3: The Solution — EventSense
- **Headline**: Natural Language Input. Deterministic Output. Editorial Design.
- **Three Pillars**:
  1. **Conversational Intake**: Describe in plain words; AI extracts parameters and catches contradictions before you spend a rupee.
  2. **Deterministic Arithmetic Engine**: The LLM *never* computes money or dates. All math is executed strictly in tested TypeScript code.
  3. **Visual Diff Replanning**: When family RSVPs surge (+70 guests), EventSense rebalances the budget and shows a side-by-side confirmable diff.

---

## Slide 4: Architectural Innovation & AI Rules
- **Headline**: Guardrails That Prevent AI Hallucinations.
- **Key Architecture Points**:
  - **Rule 1 (Zero Math in LLM)**: Isolated `/lib/engine` handles per-head costs, allocations, and backward scheduling.
  - **Rule 4 (No Change Without Diff)**: State is immutable until the user confirms the side-by-side before/after modal.
  - **Rule 5 (Free-Tier Guards & Offline Grace)**: SHA-256 prompt caching, daily IP rate caps, exponential backoff, and instant fallback to pre-computed templates. The app never displays a blank error.
  - **Rule 6 (Privacy First)**: Client-side PII scrubbing strips phone numbers and names before invoking external APIs.

---

## Slide 5: The Product Experience
- **Headline**: Designed for Celebration Hosts, Not Corporate Project Managers.
- **Feature Showcase**:
  - **Interactive Budget Donut & 3 Trade-Offs**: "Where can I save?" toggles with exact rupee impact computed by code.
  - **Backward Timeline Planning**: Milestones projected from celebration day (`T - 180d` to `T - 0d`) with critical path indicators.
  - **Tunable Quote Comparisons**: Adjust Pricing vs Quality sliders to rank real vendor bids.
  - **AI Outreach Generator**: Ready-to-copy WhatsApp messages with placeholders (`{{YourName}}`, `{{EventDate}}`).

---

## Slide 6: Security & Zero-Paid Tech Stack
- **Headline**: Built Entirely on Free, Secure, Local-First Infrastructure.
- **Stack Overview**:
  - **Frontend & Server**: Next.js 15 (App Router), TypeScript Strict, Tailwind CSS.
  - **Data Layer**: Prisma ORM + Local SQLite file (Zero hosting costs).
  - **AI Engine**: Google Gemini Free Tier (`GEMINI_MODEL`).
  - **Security Standards**: Strict Content Security Policy (CSP), HSTS, X-Frame-Options, in-memory IP rate limiting, Gitleaks pre-commit secret scanning, and Dependabot automation.

---

## Slide 7: Market Opportunity & Traction Potential
- **Headline**: Tapping into the \$50B+ Indian Wedding and Event Economy.
- **Key Metrics**:
  - Over 10 million weddings and 50 million milestone celebrations hosted annually across India.
  - Average middle-class celebration spends between ₹5 Lakh and ₹25 Lakh.
  - **B2C Organic Flywheel**: Event hosts share 128-bit read-only links with family members, turning guests into future hosts.
  - **Zero Customer Acquisition Cost**: Runs local-first with free self-hosting or free Vercel deployment.

---

## Slide 8: The Vision & Roadmap
- **Headline**: From Planning Tool to India's Celebration Operating System.
- **Milestones**:
  - **Phase 1 (MVP - Today)**: Deterministic budgeting, replanning diff engine, vendor vetting, and calendar export.
  - **Phase 2**: Collaborative multi-family voting on catering tastings and decor themes.
  - **Phase 3**: Direct UPI milestone escrows and vetted local artisan directories.
- **Call to Action**: Experience EventSense at `https://github.com/Saatvik-G/Jashn.git`.
