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

### Stage 1 rollout - October 5, 23:50 IST
- Owner approved Stage 1 push with "ok go" after the Stage 1 push/deploy question and reminder. Exact candidate af5e6b695fa3800492a7f2564dc8050910a10ac8 pushed, independently confirmed via origin/main and public remote SHA.
- GitHub hosted CI #20 succeeded: quality, security and build all success. https://github.com/atul-upadhyay-7/Shift-Safe/actions/runs/37354889068
- Vercel Ready/Latest/Production/Current for af5e6b6. https://vercel.com/atul1/shift-safe-dt/4LtRLfUWSQty1WhLKSV8i6T5BdWt
- Live homepage and registration pixels inspected. /api/health HTTP200, Neon up; unauthenticated session reports false and dashboard HTTP401. No account reset or real auth/SMS replay.
- Temporary Codespace used only after confirming live $0 budget with Stop usage=Yes and included discounts; deleted afterwards, All0.
- Dependabot automatically closed old PRs #3,#4,#7,#14. Manually closed remaining old superseded #5,#6,#8,#9,#10,#11,#12,#13,#15,#16 after CI/deploy passed. No old PR merged. Branches retained.
- Dependabot generated new PRs #17-21 after the grouped update. These are NOT superseded by af5e6b6: newer scanner/action revisions, Node26 types and SQLite13. Diffs reviewed; keep them open for a separate tested update decision. Node26 types do not match Node22 runtime. No blind merge.
- Remaining known development braces advisory still unpatched and bounded through October12. Stage2-6 remain open.
- This rollout entry is local and will be included in the next approved code push; no extra push for bookkeeping.

## Stage 2 - October 6, local candidate awaiting push approval
- FLOW-01: persisted, ordered profile -> eligibility -> quote -> review -> complete journey. Authenticated Google/login/home entry routes to review instead of duplicate registration. Progress is saved per worker; step skips are rejected, repeated transitions are idempotent, and stale concurrent transitions fail. Dashboard remains available; completing review never activates cover.
- FLOW-02: added profile corrections for name, food-delivery platform, city/area, actual income and activity. Saving restarts review and invalidates the prior assessment/quote, without changing identity, phone, policy, payment or claim records. Reassessment is not yet implemented, so the screen says unavailable rather than guessing.
- FLOW-03: server-side drafts scoped to an unexpired, freshly email-link-verified Google onboarding grant; reload restores work fields. Drafts exclude bank/UPI details, tokens and proofs. Grants remain one-use for registration. Resume lasts only as long as that grant; not a cross-device login-resume claim.
- SCOPE-01: new registration limited to Zomato/Swiggy food delivery. Existing legacy platform accounts retained; editing them requires picking a food-delivery platform. No account reset/migration to a new identity.
- DATA-01 (partial): removed client-side fabricated quote preview and fallback income 4200/days 6. Zero weekly days is preserved; blank activity is rejected. Earnings-range midpoint is no longer substituted for actual earnings. Removed the unpersisted hours/day input and profile-menu hours claim. The operating city must be selected, not silently defaulted to Mumbai. Later model/session/monitoring stages still have known fake/default calculations.
- Account journey displays saved profile/consents, eligibility snapshot and quote only where records exist. Legacy accounts get no invented assessment. Existing legal/pricing assumptions are explicitly labelled unvalidated prototype rules, not law, a trained prediction, live price or an underwriting approval.
- Additive worker_journeys/onboarding_drafts tables; atomic registration includes initial journey snapshot. No destructive migration, production write, policy activation, real payment, email or SMS.
- Validation: 34 tests passing; typecheck, strict lint, production build, security check and diff whitespace checks pass. New tests cover unauthenticated/cross-origin rejection, existing-account lazy initialization without resets, account isolation, ordered/repeated progression, proof expiry/use and private draft allowlist, food-only scope, blank activity rejection, quote invalidation and preservation of policy/contact state.
- Local browser acceptance: desktop 1280x900 and mobile 390x844, using a dedicated local fixture ledger only. Authentication redirect, registered-user /register -> journey, four saved stages after reload, completion, profile correction, verified-grant draft restoration and new account registration all passed with no client errors. Actual screenshot pixels inspected for profile, quote, review, edit, draft onboarding and new account. Fixed bottom nav overlays the full-page screenshot at its viewport position; normal scrolling keeps lower content/controls reachable. Local development indicator is not a deployed UI element.
- Production build initially refused local SQLite in production, as intended by the fail-closed guard. Browser fixtures therefore ran the development server without changing that production boundary. Real Google/email-link round trip and hosted deployment remain untested until an approved push; no credential/account reset or paid environment used.
- Dependency PRs #17-21 are not part of this candidate. Security caveat remains: runtime npm audit 0; one unfixed dev-only braces advisory represented by five package entries, exception expires October 12.
