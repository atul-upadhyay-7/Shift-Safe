import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
test("saved-record loads reject superseded results and clear stale support data", () => {
 const admin=readFileSync("frontend/app/admin/page.tsx","utf8"),support=readFileSync("frontend/app/service-requests/page.tsx","utf8");
 assert.match(admin,/version !== requestVersion.current/);
 assert.match(admin,/async function logout\(\) \{ \+\+requestVersion.current/);
 assert.match(admin,/No note added/);
 assert.match(support,/setRequests\(\[\]\)/);
 assert.match(support,/version !== requestVersion.current/);
 assert.match(support,/databaseTimestampMs\(timestamp\)/);
 assert.match(support,/formError \? null : requests.length === 0/);
 assert.match(support,/!isLoading && !formError &&/);
});
test("visible product branding is ShiftSafe without DT", () => {
 for(const file of ["frontend/app/page.tsx","frontend/app/layout.tsx","frontend/public/manifest.json","frontend/src/components/ui/Navigation.tsx","frontend/lib/receipt-generator.ts","frontend/app/api/claims/export/route.ts"]){
  const source=readFileSync(file,"utf8");
  assert.doesNotMatch(source,/ShiftSafe[- ]DT|>DT<|>DT<\/span>/);
 }
 assert.equal(JSON.parse(readFileSync("frontend/public/manifest.json","utf8")).name,"ShiftSafe");
});
test("rejected visual system is not part of the saved-state candidate", () => {
 for(const file of ["frontend/app/globals.css","frontend/src/components/providers/ThemeProvider.tsx","frontend/src/components/ui/RecordOverview.tsx","frontend/next.config.mjs"])
  assert.equal(readFileSync(file,"utf8"),execFileSync("git",["show",`160aa3960d05e2932a0c72efcef59faba61c72ef:${file}`],{encoding:"utf8"}));
 for(const file of ["frontend/app/admin/page.tsx","frontend/app/service-requests/page.tsx","frontend/app/page.tsx","frontend/app/layout.tsx"])
  assert.doesNotMatch(readFileSync(file,"utf8"),/admin-workspace|admin-record-grid|support-workspace|PRODUCT\./);
});
