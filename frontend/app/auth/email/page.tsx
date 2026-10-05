"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { safeReplace } from "@/lib/client/navigation";
export default function EmailActionPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  useEffect(() => {
    // Reading a mail link never consumes it automatically: scanners and previews cannot unlock onboarding.
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") !== "verifyEmail" || !params.get("oobCode")) setError("This is not an onboarding email verification link.");
  }, []);
  const [busy, setBusy] = useState(false);
  return <main className="max-w-md mx-auto px-4 py-12 space-y-5"><h1 className="text-3xl font-bold">Open your Work Profile</h1><p className="text-gray-600">Confirm this email link to unlock the next onboarding step. Email verification proves inbox access, not delivery work or insurance eligibility.</p>{error && <p role="alert" className="text-red-600">{error}</p>}<button disabled={busy || !!error} className="btn btn-primary w-full disabled:opacity-50" onClick={async () => {
    setBusy(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const continueUrl = new URL(params.get("continueUrl") || "", window.location.origin);
      if (continueUrl.origin !== window.location.origin || continueUrl.pathname !== "/auth/email") throw new Error("This link does not belong to this app.");
      const response = await fetch("/api/auth/email/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challenge: continueUrl.searchParams.get("challenge"), oobCode: params.get("oobCode") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Cannot confirm this link.");
      sessionStorage.setItem("shiftsafe-email-onboarding", JSON.stringify(data));
      window.history.replaceState(null, "", "/auth/email");
      safeReplace(router, "/register");
    } catch (err) { setError(err instanceof Error ? err.message : "Cannot confirm this link."); }
    finally { setBusy(false); }
  }}>{busy ? "Checking link..." : "Verify email and open Work Profile"}</button><a href="/register" className="text-orange-700 underline">Request a new link</a></main>;
}
