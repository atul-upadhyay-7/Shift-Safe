# ShiftSafe repair work log

## Authority and rollout
- October 5, 2026: owner approved the six-stage repair plan and asked for step-by-step work with tracking.
- Local implementation is authorized. Each push still requires separate confirmation.
- Preserve existing accounts, Firebase email gate, custom sender domain and production financial safety blocks.
- No paid services, card collection, real payments or trial SMS sends.

## Issue register
| ID | Issue | Stage | Status |
|---|---|---|---|
| DEP-01 | Vulnerable dependency tree and mismatched updates | 1 | In progress |
| CI-01 | Lint/audit ignored, floating workflow actions | 1 | In progress |
| PR-01 | 14 open Dependabot updates | 1 | Diffs audited, reconciliation pending tested rollout |
| FLOW-01 | Incomplete worker journey and existing-user navigation | 2 | Pending |
| DATA-01 | Fabricated weather/AQI and random trigger fallbacks | 3 | Pending |
| GEO-01 | Default city/zone and imprecise location evidence | 3 | Pending |
| PRICE-01 | Fixed probabilities and fabricated model confidence | 4 | Pending |
| ELIG-01 | Unverified legal 90/120-day eligibility claim | 4 | Pending source review |
| FRAUD-01 | Unfitted random-tree forest and fabricated device inputs | 5 | Pending |
| CLAIM-01 | No isolated idempotent sandbox policy/claim/settlement path | 5 | Pending |
| EVID-01 | Upload success without storing evidence bytes | 5 | Pending |
| METRIC-01 | Fixed analytics samples and actuarial fallback ratios | 6 | Pending |
| DOC-01 | Obsolete production/architecture/link claims | 6 | Pending |

## Baseline - October 5, 2026
- Clean main and origin/main: ef5dffca8ca7ba516a2664c3f75554d19b467d45.
- Test suite: 26 passing tests. Typecheck, lint and build pass.
- npm audit: 19 affected package entries (1 critical, 15 high, 2 moderate, 1 low). Not evidence of exploitation.
- Public homepage and registration visually inspected. Registered-user dashboard routing source-inspected; no accounts reset.
- PRs #3-16 are open dependency/CI updates. #1-2 closed superseded updates. No feature PRs.

## Stage 1 - in progress, local only
Dependency selection is based on current registry metadata and advisory ranges, not blind PR merging. Next.js 16.2.6 in PR #13 is insufficient against newer ranges. Preserve compatible major lines where possible. Check transitive Firebase advisories without downgrading authentication. Record any vulnerability with no published fix as unresolved rather than suppressing it.

### Stage 1 result - October 5, local candidate awaiting push approval
- DEP-01: Next/eslint-config 16.3.8, React/React DOM/types 19.3.0, Tailwind/plugin 4.3.3, PostCSS 8.5.29, SQLite 12.11.1. Node 22 declared in package engines, .nvmrc and CI; types align to Node 22. Updated compatible transitive dependencies and pinned gRPC override 1.14.5 to remove Firebase's affected older gRPC without downgrading Firebase.
- ESLint 10.12.0 initially failed on legacy React rule APIs. Added official @eslint/compat adaptation, retaining checks. Fixed callback dependencies and initialization loading, moved city/zone update into its event handler, derived policy display state without synchronous effect copying, and used the navigation helper for sign-out. Three narrow initialization lint exceptions remain documented for URL/session hydration, not global rule disablement.
- CI-01: lint and security checks no longer ignore errors. All Actions references pinned to verified upstream commit SHAs. Checkout/setup-node v7, github-script v9, release v3 reviewed through their action contracts. Secret scan is push-only, avoiding secret-bearing execution of untrusted PR code. Workflow token quality/build permissions are read-only. Auto-label paths corrected for the real monorepo.
- Added security checker: production dependency audit must be zero; unknown full-tree advisories or audit-service failure fail. One documented development-only braces advisory has no published patch; its five transitive entries are visible, bounded and expire October 12. No assertion that all vulnerabilities are fixed.
- Dependabot now groups compatible Next, React, Tailwind and Node-types updates, reducing mismatched future PRs.
- PR-01: all 14 open PR diffs reviewed. #3,4,5,6,7,8,9,10,11,12,13,14,15,16 are superseded locally by this tested grouped update. None closed or merged remotely. Reconcile after approved deployment and remote CI verification, not before.
- Validation: clean npm ci; 28/28 tests (two new CI/security-guard tests); typecheck; lint; production build; security checker. Current runtime audit 0 advisories. Full audit 5 high package entries from one unfixed dev-only advisory, down from 19/1 critical.
- Local desktop/mobile browser checks: homepage -> registration, no client exceptions, no horizontal registration overflow; malformed email nonce rejected and stripped. Actual screenshot pixels inspected. Emoji rendering differs on the local Linux browser; text/layout/buttons remain legible. Real Google/email/SMS replay not done in this stage; no messages sent. Hosted CI and production pixels cannot be confirmed before push.
- Production unchanged. No PR closure, merge, DB reset, real payment or phone SMS. Existing production financial guards remain intact.

### Files changed in Stage 1
Root/frontend/backend package manifests and lockfile; .nvmrc; CI/label/size/release workflows; Dependabot config; ESLint compatibility config; admin/analytics/email/monitoring/policy/registration/service-request/navigation lint compatibility fixes; generated Next route typing reference; scripts/check-audit.mjs; tests/stage-one.test.ts; repair plan, this log and security exception record.
