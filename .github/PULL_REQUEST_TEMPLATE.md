## Description
<!-- Provide a brief description of changes introduced by this PR -->

## Type of Change
- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] chore: Maintenance or dependencies
- [ ] test: Unit or integration test addition
- [ ] docs: Documentation update

## Security & Quality Checklist
- [ ] No API keys, secrets, or credentials committed (.env files verified gitignored)
- [ ] No PII transmitted to external LLM services
- [ ] All input validated with Zod schemas
- [ ] Deterministic mathematical calculations kept strictly in `/lib/engine`
- [ ] Content Security Policy and HTTP security headers intact
- [ ] Unit tests added / updated and passing (`npm run test`)
- [ ] TypeScript strict mode passing with zero errors (`npm run typecheck`)
- [ ] ESLint clean (`npm run lint`)
- [ ] npm audit clean of high/critical vulnerabilities
