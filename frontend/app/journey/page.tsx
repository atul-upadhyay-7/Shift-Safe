"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/frontend/components/providers/AppProvider";
import { JOURNEY_STEPS, type JourneyStep } from "@/lib/shared/journey";
import { safeReplace } from "@/lib/client/navigation";

type Journey = {
  step: JourneyStep;
  worker: { name: string; platform: string; city: string; zone: string; avg_weekly_income: number; active_delivery_days: number; days_worked_this_week: number; insurance_opted_out: number };
  phoneVerified: boolean;
  eligibility: { eligible: boolean; reason: string; warnings?: string[]; insuranceOptedOut?: boolean } | null;
  consents: { gps_location: number; bank_upi: number; platform_activity: number; recorded_at: string } | null;
  quote: { weeklyPremium: number; coverageAmount: number; status: string; calculatedAt: string } | null;
  policy: { id: string; status: string } | null;
};
const LABELS = { profile: "Work profile", eligibility: "Eligibility", quote: "Quote", review: "Review", complete: "Complete" };
export default function JourneyPage() {
  const router = useRouter();
  const { isLoggedIn, isBootstrapping } = useAppState();
  const [data, setData] = useState<Journey | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<JourneyStep | null>(null);
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/journey", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not load your journey");
      setData(body); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load your journey"); }
  }, []);
  useEffect(() => {
    if (isBootstrapping) return;
    if (!isLoggedIn) { safeReplace(router, "/login"); return; }
    // Load the account snapshot from the server when authentication settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [isBootstrapping, isLoggedIn, router, load]);
  async function advance() {
    if (!data) return;
    const next = JOURNEY_STEPS[JOURNEY_STEPS.indexOf(data.step) + 1];
    if (!next) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step: next }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not save progress");
      setView(null); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save progress"); }
    finally { setBusy(false); }
  }
  if (isBootstrapping || (!data && !error)) return <div className="p-8 text-center">Loading your saved journey...</div>;
  if (!data) return <div className="p-8 text-center"><p role="alert">{error}</p><button onClick={load} className="mt-4 underline">Retry</button></div>;
  const step = view || (data.step === "complete" ? "review" : data.step);
  const index = JOURNEY_STEPS.indexOf(data.step);
  return <main className="max-w-lg mx-auto px-4 py-6 pb-28 space-y-5">
    <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-bold">Your protection journey</h1><Link href="/dashboard" className="text-sm underline">Dashboard</Link></div>
    <p className="text-sm text-gray-600">Saved to your account. Return to this page to resume or review your profile.</p>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Prototype only. Reviewing a quote does not buy insurance or activate cover. Payments, claims and payouts remain disabled.</div>
    <nav aria-label="Journey progress" className="flex flex-wrap gap-2">{JOURNEY_STEPS.filter(s => s !== "complete").map((s, i) => <button key={s} disabled={i > index} onClick={() => setView(s)} aria-current={step === s ? "step" : undefined} className={`rounded-lg px-3 py-2 text-sm border ${step === s ? "bg-primary-500 text-white" : "bg-white"} disabled:opacity-40`}>{i + 1}. {LABELS[s]}</button>)}</nav>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <h2 className="text-xl font-bold">{LABELS[step]}</h2>
      {step === "profile" && <><dl className="grid grid-cols-2 gap-3 text-sm"><dt>Name</dt><dd>{data.worker.name}</dd><dt>Platform</dt><dd>{data.worker.platform}</dd><dt>Area</dt><dd>{data.worker.zone}, {data.worker.city}</dd><dt>Reported weekly income</dt><dd>₹{data.worker.avg_weekly_income.toLocaleString("en-IN")}</dd><dt>Reported days this week</dt><dd>{data.worker.days_worked_this_week}</dd><dt>Lifetime delivery days</dt><dd>{data.worker.active_delivery_days}</dd><dt>Contact phone</dt><dd>{data.phoneVerified ? "Verified" : "Not verified"}</dd></dl><p className="text-xs text-gray-500">Work details are self-reported, not platform-verified. Contact phone is separate from your Google sign-in identity.</p><Link href="/profile" className="inline-block text-sm underline">Correct work details</Link></>}
      {step === "eligibility" && <><p>{data.worker.insurance_opted_out ? "You chose not to request insurance." : data.eligibility ? data.eligibility.reason : "No saved eligibility assessment is available for this existing account. We will not infer eligibility from a policy record."}</p>{data.eligibility?.warnings?.length ? <ul className="list-disc pl-5 text-sm">{data.eligibility.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul> : null}<p className="text-sm text-amber-800">These are the existing prototype&apos;s configured rules, not verified legal requirements. Its 90/120-day claims are under review. This is not an underwriting approval.</p><p className="text-sm">Recorded consents: {data.consents ? `location ${data.consents.gps_location ? "yes" : "no"}, payout data ${data.consents.bank_upi ? "yes" : "no"}, platform activity ${data.consents.platform_activity ? "yes" : "no"}` : "not available"}.</p></>}
      {step === "quote" && <>{data.quote ? <><dl className="grid grid-cols-2 gap-3"><dt>Saved weekly estimate</dt><dd>₹{data.quote.weeklyPremium}</dd><dt>Saved weekly limit</dt><dd>₹{data.quote.coverageAmount}</dd><dt>Record status</dt><dd>{data.quote.status}</dd></dl><p className="text-sm text-gray-600">Saved at {data.quote.calculatedAt}. The current pricing engine still uses unvalidated assumptions. This is an illustrative estimate, not an offer, trained-model prediction or live price.</p></> : <p>No saved quote is available. You can review your profile without buying cover.</p>}</>}
      {step === "review" && <><p>You have reviewed your work profile, eligibility record and any saved quote.</p><p className="text-sm text-gray-600">{data.policy ? `Existing policy record status: ${data.policy.status}.` : "There is no policy record on this account."} Completing this review does not change that status, charge money or activate cover.</p>{data.step === "complete" && <p className="text-sm text-green-700">Review complete. Your progress is saved.</p>}</>}
    </section>
    {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
    {data.step !== "complete" && step === data.step ? <button disabled={busy} onClick={advance} className="w-full rounded-xl bg-primary-500 py-3 font-bold text-white disabled:opacity-50">{busy ? "Saving..." : data.step === "review" ? "Finish review - no payment" : "Save and continue"}</button> : <button onClick={() => setView(null)} className="text-sm underline">{data.step === "complete" ? "Return to review" : "Resume current step"}</button>}
    {data.step === "complete" && <Link href="/dashboard" className="block rounded-xl bg-primary-500 py-3 text-center font-bold text-white">Open dashboard</Link>}
  </main>;
}
