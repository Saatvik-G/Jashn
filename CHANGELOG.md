# Changelog

All notable changes to **EventSense (Jashn)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-01

### Added
- **Core Deterministic Engines (`/lib/engine`)**:
  - `budget.ts`: Percentage-split calculation by event type, cost-per-head math, overrun detection, budget health states (`HEALTHY`, `TIGHT`, `OVERRUN`), and 3 code-computed trade-offs.
  - `timeline.ts`: Backward milestone scheduling from event date, compressed timeline risk detector, and "This Week" priority filter.
  - `diff.ts`: Side-by-side state diff engine computing guest deltas, budget deltas, cost-per-head deltas, category shifts, injected tasks, and capacity warnings.
- **Security & Privacy Guardrails (`/lib/gemini`)**:
  - `privacy.ts`: Client-side PII scrubber removing emails, phone numbers, and addresses with placeholders (`{{YourName}}`, `{{VendorName}}`).
  - `cache.ts`: SHA-256 prompt hashing LRU cache, per-IP rate limiting, and daily call counters.
  - `offline_templates.ts`: Curated celebration templates providing zero-crash offline execution.
  - `client.ts`: Google Gemini free-tier client with bounded prompt delimiters and Zod-validated function calling.
- **UI & Celebratory Design System**:
  - Warm editorial aesthetic: Ivory parchment (`#FAF7F2`), deep oxblood (`#4A0E17`), marigold (`#D97706`), and sage green (`#5F7A61`).
  - Optical typography: *Fraunces* display serif and *Instrument Sans* humanist body.
  - Interactive Recharts category allocation donut chart.
  - Replan Drawer with side-by-side before/after visual diff confirmation modal.
  - Vendor comparison module with tunable weighted quote scoring and ready-to-copy WhatsApp/Email drafts.
  - Ideas and dietary menus catalog with one-click "Add to Plan".
- **Stretch Export Features**:
  - RFC 5545 `.ics` calendar export for milestone schedules.
  - Print-CSS stylesheet for PDF generation.
  - Cryptographic 128-bit hex token read-only share view (`/share/[token]`) with expiration and instant revocation.
- **Database & Seed Data**:
  - Prisma ORM with local SQLite file (`prisma/dev.db`).
  - Seed script generating 3 realistic celebration events: Royal Jaipur Palace Wedding (150 guests, ₹12L), Aarav's 7th Space Birthday (45 guests, ₹45K), and Gulmohar Society Diwali Mela (400 families, ₹3.5L).
- **Quality & Repo Hygiene**:
  - Vitest test suite covering mathematical engine calculations, schedule projections, diff generation, and prompt injection defense.
  - Playwright E2E smoke test verifying the replanning flow.
  - Strict Content-Security-Policy (CSP), HSTS, and HTTP security headers in `next.config.ts`.
  - Comprehensive `THREAT_MODEL.md` and `SECURITY.md`.
  - GitHub Actions CI pipeline and Dependabot configuration.
