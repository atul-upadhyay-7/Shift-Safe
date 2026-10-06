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
| METRIC-01 | Fixed analytics samples and actuarial fallback ratios | 6 | Candidate tested; push pending |
| DOC-01 | Obsolete production/architecture/link claims | 6 | Candidate tested; push pending |

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

### Stage 2 rollout - October 6, 00:10 IST
- User approved the exact e464732 push/deploy question with "Yes do it" at 00:02:45. Remote main independently verified by ls-remote and fetch as e4647322a04df9550ddc5b687ad596f97deb45e8. No further commit pushed.
- Hosted CI run #26: https://github.com/atul-upadhyay-7/Shift-Safe/actions/runs/37357457071 . Code Quality, Security Audit and Build all completed/success, confirmed through API and pixels. Earlier interim run-number label #21 was wrong; run ID/URL was correct.
- Vercel Ready/Latest/Production/Current: https://vercel.com/atul1/shift-safe-dt/C6FqsHNTRHNcXzJHWD3QngjbWgFT . Hobby, no upgrade. Production /api/health HTTP200 Neon up; /api/journey401; invalid draft proof401. Live journey redirects unauthenticated access to login; actual login/deployment/CI pixels inspected.
- Temporary 2-core Codespace used only under live verified $0 billed usage and existing $0 Stop usage cap, then deleted (All0). No paid usage/card change, real Google/email/SMS replay, identity reset, payment or activation. Five new Dependabot PRs unchanged.
- Live authenticated user journey remains untested; local isolated fixture acceptance is not asserted as production replay. Model/legal/evidence work remains for later stages.

## Stage 3 - October 6, work in progress, NOT tested candidate
- Initial shared environment provider and configured threshold module added. Weather route removes OpenWeather/AQICN fake fallbacks, uses real Open-Meteo current modelled weather and hourly preceding-hour rain, CAMS-global US AQI, source timestamps/units/attribution. Unknown locations rejected, no Mumbai default. Missing/stale sources produce partial/unavailable and no inferred trigger.
- Backend triggers now share those rules/provider with zero payout authority. Platform website probes removed as unsupported delivery-app evidence. Trigger route uses the authenticated worker's stored city/zone rather than client-supplied account context.
- City-center GPS reference cannot grant a verified street-level location. Further GPS authentication/freshness validation pending.
- Current provider documentation and actual Mumbai responses checked. Sources https://open-meteo.com/en/docs , https://open-meteo.com/en/docs/air-quality-api , https://open-meteo.com/en/terms . Free API is noncommercial only; CAMS-global roughly 45 km and US AQI, not street-sensor/Indian AQI.
- Typecheck passes. Consumer null/partial/error handling, GPS freshness/auth, screenshot-evidence honesty, tests and full acceptance remain. No commit/push, no production change. Do not treat this as complete.

### Stage 3 local result - October 6, candidate awaiting push approval
- DATA-01/EVID-01: removed fabricated weather/AQI and random trigger fallback. Shared Open-Meteo provider carries model quality, coordinates/precision, provider observation and retrieval times, units, preceding-hour rain, attribution, missing/stale status and reasons. Future hourly rain never substitutes for completed-hour rain; malformed/null data and incompatible units fail closed. AQI is explicitly US scale from coarse CAMS-global, not Indian AQI or street sensors.
- RULE-01: versioned prototype thresholds used by weather route, backend trigger previews and monitoring explanation. Rain 30 mm/preceding hour, temperature 42°C, US AQI 200, freshness weather60/air120/GPS15 minutes. These are configured assumptions, not legal/insurance rules. Trigger previews carry zero payout authority; no real claim eligibility.
- LOC-01: unknown places rejected instead of Mumbai substitution. City map is explicitly city-center, not a mapped work zone; removed Nominatim request-per-check. Client coordinates are labelled client-reported. GPS route requires authenticated identity, recorded location consent, actual accuracy and timestamp less than15 minutes old; stored profile determines reference area. City-center comparison never returns verified-zone status. Client GPS is not anti-spoofing evidence.
- EVID-02: removed fake screenshot-upload success/demo evidence, invented six-hour loss amount, submit-claim path and instant-payment claims from monitoring. File choice stays local and is clearly not uploaded/submitted/verified. Genuine evidence ingestion remains unsupported for later isolated sandbox work. Website probes no longer assert delivery-app outage or payout eligibility.
- UI: null weather/rain/wind/air values show unavailable, not32°C/65AQI/zero rain; failed refresh clears prior observations. Dashboard pills label US AQI and city-center estimates with attribution. Monitoring shows partial/unavailable, source times and rule provenance. Unsupported fraud/review/payout automation is labelled disabled, not production-ready. Other dashboard pricing/fraud/analytics legacy assumptions remain assigned to later stages.
- Validation:39 tests pass; typecheck, strict lint, production build, security and whitespace checks pass. Provider tests cover unknown/invalid coordinates, genuine zero, preceding vs future rain, exact threshold boundaries, missing/null/malformed data, stale/future time, units, partial provider failure and no payment eligibility. GPS tests cover auth,15-minute expiry, missing accuracy and no city-center verification.
- Actual provider responses checked for Mumbai through forecast/current and CAMS-global APIs; schema/units/timestamps match. These are real model results, not fixture observations. Sources https://open-meteo.com/en/docs , https://open-meteo.com/en/docs/air-quality-api , https://open-meteo.com/en/terms . Free API noncommercial only, <10000/day, <5000/hour, <600/minute, no guarantee. Five-minute caching plus app route limit reduces calls but is not an account-wide multi-instance quota guarantee.
- Desktop/mobile isolated fixture browser checks: unavailable/missing and configured-threshold states, no horizontal overflow or client errors. Actual pixels inspected after entrance animations; corrected an inherited green safe/covered banner found during first inspection. Full-page fixed-nav overlay and local dev indicator are screenshot artifacts; lower content reachable by scrolling. Real sensor/GPS round trip and hosted provider connectivity remain unverified until deployment. No live account reset, email/SMS, payment or paid service.

### Stage 3 rollout - October 6, 00:28 IST
- Original user00:24:00 quote-reply approved exact d7275a5 push/deploy. Remote main ls-remote/fetch confirmed d7275a50be1dd9c09d73f0b4cc11332b5672da68. Hosted CI#27 all jobs successful: https://github.com/atul-upadhyay-7/Shift-Safe/actions/runs/37359789145 .
- Vercel Ready/Latest/Production/Current, Hobby: https://vercel.com/atul1/shift-safe-dt/2fVsiwCQPphw6Ciifh79Bt8D1zb7 . CI/deployment/login pixels inspected.
- Live Mumbai weather routeHTTP200 real modelled data: provider weather18:45Z/rain18:00Z/US-AQI18:00Z, fetched18:57Z. Values27.5°C, preceding-hour rain0mm, US AQI98. Unknown city/invalid latitude400, health200 Neon up. No real-worker authenticated GPS/monitoring replay; local fixtures remain separately labelled.
- Temporary Codespace deleted All0. Existing zero-dollar Stop usage cap checked; no billing upgrade/card/payment/SMS/email/reset. Five new dependency PRs unchanged. Remaining project stages4-6 not completed.

## Stage4 candidate: honest quote provenance

- Added versioned ERA5 historical weather proxy with explicit actual schedule, authenticated saved income/city binding, preceding-hour boundaries, threshold union,98% completeness and fail-closed provider/units/timezone validation.
- Persisted source/model/sample/formula/limitations snapshots; profile edits invalidate them; old fixed-tier records are preserved but never displayed as current historical estimates.
- Removed lifetime90/120 legal insurance gate, fabricated ward risks,2025 disaster locks and DPDP compliance certification. Participation checks are prototype-only. Registration creates an unpriced pending placeholder, never a charged/active policy.
- Retired anonymous parameter pricing and analytics simulation output. Quote journey displays actual source, schedule, formula, exclusions and no-trained-model caveats; review without quote remains possible.
- Added historical unit/missing/duplicate/union/midnight/zero/schedule tests and auth/persistence/stored-input/invalidation/no-financial-write contract tests. Updated earlier assertions for removed legal gate and unpriced policy semantics.
-45 tests pass; typecheck, strict lint, production build and security checks pass. Runtime npm advisories0, existing development-only braces exception remains untilOct12.
- Real provider acceptance in isolated worker fixture:2025-09-30..2026-09-29, daily9-18 IST,3285/3285 valid hours,3 rain-threshold hours, no heat hours.₹2.10 comes from an illustrative₹4000 input and stated assumptions, not a real worker/price or learned loss rate. Mobile/desktop actual API, reload persistence and finish-review/no-payment passed; rendered screenshots inspected. No authenticated real worker replay.
- Remaining: variable/overnight schedules, historical AQI and other perils, legal/insurer approval, loss calibration, globally durable rate limits, evidence ingestion, sandbox lifecycle and full analytics/E2E audit. No push/deploy before separate candidate approval.

### Stage4 rollout
- Original user02:53:27 "Ok" quote-replied the exact8f43878 push/deploy question, after an earlier ambiguous generic approval was paused. Only8f43878 pushed. Fresh remote SHA and fetch match.
- CI28 all three jobs success: https://github.com/atul-upadhyay-7/Shift-Safe/actions/runs/37376127891 . Vercel Hobby Ready Latest Production Current: https://vercel.com/atul1/shift-safe-dt/48KsFERPFg3yDV4u6CK9R44NKpsH . CI/deployment/login pixels inspected.
- Live health200 Neon up; anonymous premium401 (no old fixed defaults); quote401 same origin anonymous and403 wrong origin. Unauthenticated journey redirects to login. No authenticated real-worker quote replay or financial mutation.
- Temporary2-core environment under fresh$0 budget Stop usage Yes deleted; All0 confirmed. No cards, paid upgrade or billing change. Health endpoint legacy ML "operational/passRate100" remains for Stage6 audit, not evidence of trained quote model.

## Stage5 candidate: isolated no-money lifecycle
- Added separate sandbox policies/events/claims/receipts; no live financial tables touched. Versioned server quote/profile/date/limit guards, one current policy, deterministic duplicate prevention and transaction locks.
- Added model-event check with fresh source provenance, in-schedule/window rain/heat only. Precise work zone/activity/loss absent -> zero-amount rule review, no trained fraud score or automatic approval.
- Added explicit synthetic missing-evidence/complete-fixture scenarios. Only complete synthetic fixture can settle. Receipt/policy shared-cap serialization, idempotent replay and transactional rollback. All receipts simulated, no external reference/money.
- Authenticated /sandbox with clear labels, separate nav/journey link, saved reload; no recurring workflow or live financial enablement.
-54 tests pass; typecheck/strict lint/build/security pass. Runtime advisories0; unchanged dev braces exceptionOct12. Isolated PostgreSQL SQL execution via Neon adapter passed8 lifecycle/overlap tests; hosted-Neon concurrency not replayed. Mobile/desktop actual ERA5 quote -> simulation -> review/receipt -> reload tested in fixture only; pixels inspected. No real worker/production ledger mutation.
- Docs SANDBOX-LIFECYCLE.md records assumptions and limitations. No push/deploy before candidate approval.

### Stage5 rollout and corrective candidate
- e9fe7ff approved by original06:54:47 Yes quote-reply to exact Stage5 push question; exact remote SHA confirmed. Vercel Ready Current Hobby, live auth/origin gates401/403, health Neon up. Temporary environment deleted All0.
- Hosted CI29 failed ESLint react-hooks/purity on Date.now() in render added in the final expiry-label edit. Earlier lint passed but final redirected lint failure was not checked before candidate report. This was an execution/check-gating error, not a hosting discrepancy. Corrective candidate uses server snapshot asOf timestamp and labels expiry state as of last refresh; no guard disabled.
- Corrective lint/typecheck54tests/build and actual provider mobile/desktop lifecycle all pass with shell stop-on-error. Requires separate push approval. CI29 https://github.com/atul-upadhyay-7/Shift-Safe/actions/runs/37399263815 ; deployment https://vercel.com/atul1/shift-safe-dt/CG21yMX5sr8rDSN1xwzb6EDCukxd . Stage5 not closed until hosted corrective CI success.
- Corrective087a2b8 approved by original07:20:47 Yes quote-reply, exact SHA independently confirmed on main. Hosted CI30 success all jobs, Vercel Hobby Ready Latest Production Current. https://github.com/atul-upadhyay-7/Shift-Safe/actions/runs/37401435159 ; https://vercel.com/atul1/shift-safe-dt/2zpbKWAwoSstBYLToP6B7Uk5kdiE . Pixels inspected. Anonymous sandbox401, wrong-origin403, health200 Neon up, /sandbox->login verified. No production authenticated lifecycle replay. Temporary environment deleted All0; no paid/billing change. Stage5 rollout closed; Stage6 remains.

## Stage6 candidate: truthful analytics and full acceptance
- METRIC-01: owner-scoped all-time stored ledger aggregates; paid premium from payment rows, not policy face values. Sandbox totals separate. Zero/non-finite denominators unavailable; no invented BCR/forecast/stress-test/chart history.
- Removed fabricated historical city table, model samples, trained forest labels and operational100% self-test health. Public model-health exposes no private aggregate. No loss/fraud training or validation claimed.
- Replaced dashboard/analytics/actuarial with clean persisted-record views; claims/policies are truthful read-only legacy views. Preserved data and financial blocks, removed obsolete trigger/payment/fraud/receipt simulators. Admin metric view and support resolution remain usable, with source/status limitations. New support priorities remain user-selected, old classifier metadata suppressed from assessment output, revoked-owner checks added.
- Full-route audit found admin bonus creation/approval could manufacture live commitments/paid statuses without settlement. Those mutations now503, historical reads retained. No production bonus or other record changed.
- README replaced obsolete architecture/production/ML/cron claims. Added analytics contract, corrected manifest/meta previews and environment comments. Header says Prototype; active legacy policy labels are not presented as actual cover. Mobile nav reduced to five usable tabs; other record routes remain linked. Browser zoom no longer disabled.
- Local fixtures only: actual ERA5 quote -> sandbox confirmation -> missing evidence review and synthetic complete fixture -> capped simulated receipt -> reload passed. No external bank/UPI reference. Worker-support creation -> administrator resolved -> worker reload passed on390px/mobile and1280px/desktop. Admin metrics/reload/logout/login gate, dashboard links, profile/legacy/support route headings, analytics error-no-samples and keyboard focus passed. Actual rendered dashboard/error/admin/receipt pixels inspected. Earlier full desktop sandbox replay was Stage5; Stage6 actual-provider flow repeated mobile.
- Original new-user Google/email, verification and resumable onboarding contract covered by isolated regression tests; no new email/SMS or live Google/new-worker signup replay in acceptance. No employer product exists; administrator is not an employer. No claim that every external provider/account action or full signed-in production journey has been replayed.
- Live before push is still087a2b8: login/register screens load; sandbox/admin API401 anonymous, sandbox->login, health200 Neon. Legacy live metadata/ML health false labels remain until this candidate is deployed. No authenticated production-worker financial/fixture mutations. Hosted Stage6 CI/deployment verification remains pending separate push approval.
- Final stop-on-error gates after last source edits: strict lint, typecheck,61/61 tests, production build, security checker and diff whitespace pass. Runtime advisories0; documented dev-only braces exception still expiresOctober12. This is not an all-vulnerabilities-fixed or production-ready claim. No push until exact-candidate approval.
