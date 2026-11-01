# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of EventSense (Jashn) seriously. If you discover a security vulnerability, please report it privately.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security issues by emailing:
**security-reports@eventsense.local** (or directly contact the repository maintainer via private message on GitHub).

### What to Include in Your Report
1. A clear description of the vulnerability and its potential impact.
2. Step-by-step instructions or proof-of-concept (PoC) code to reproduce the issue.
3. Relevant environment details (Node version, browser version, OS).
4. Any proposed remediation or patches if available.

### Our Commitment
- **Acknowledgment**: Within 48 hours of receipt.
- **Assessment & Triage**: Within 5 business days.
- **Resolution & Release**: Critical vulnerabilities patched and released as an advisory fix within 14 days.
- **Credit**: We will credit your responsible disclosure in our security release notes (unless you request anonymity).

## Scope & Security Architecture Principles
EventSense is built under a strict zero-paid-dependency, local-first model:
- **No Client Secrets**: API keys are server-side only and never transmitted to the browser.
- **Zero Raw SQL**: All database operations use Prisma ORM parameterized statements.
- **No Client PII to LLM**: Sensitive user details (names, phone numbers, emails, addresses) are stripped before invoking LLM endpoints.
- **Deterministic Math**: Financial and timeline calculations are never executed by AI models.
- **Input Sanitization**: Strict Content Security Policy (CSP), Zod schema validation, and HTML sanitization prevent XSS and code execution.
