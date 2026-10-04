"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/frontend/components/providers/AppProvider";
import { calculateWeeklyPremium } from "@/backend/engines/premium-engine";
import { safePush } from "@/lib/client/navigation";

type Step = "phone" | "otp" | "persona" | "profile" | "calculating";

const CITIES = [
  // Tier 1 Metro
  {
    name: "Mumbai",
    zones: [
      "Andheri East",
      "Andheri West",
      "Bandra",
      "Dharavi",
      "Kurla",
      "Powai",
      "Worli",
      "Thane",
      "Navi Mumbai",
    ],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  {
    name: "Delhi",
    zones: ["Connaught Place", "Lajpat Nagar", "Saket", "Dwarka"],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  {
    name: "Bengaluru",
    zones: [
      "Koramangala",
      "Indiranagar",
      "HSR Layout",
      "Whitefield",
      "Electronic City",
    ],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  {
    name: "Hyderabad",
    zones: ["Gachibowli", "HITEC City", "Banjara Hills", "Secunderabad"],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  {
    name: "Pune",
    zones: ["Koregaon Park", "Hinjawadi", "Kharadi", "Viman Nagar"],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  {
    name: "Chennai",
    zones: ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR"],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  // Tier 2 Urban
  {
    name: "Gurugram",
    zones: ["Cyber City", "DLF Phase 1-3", "Sohna Road"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Noida",
    zones: ["Sector 62", "Sector 18", "Greater Noida"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Jaipur",
    zones: ["Malviya Nagar", "C-Scheme", "Vaishali Nagar", "Mansarovar"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Lucknow",
    zones: ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Ahmedabad",
    zones: ["SG Highway", "Navrangpura", "Satellite", "Prahlad Nagar"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Vadodara",
    zones: ["Alkapuri", "Fatehgunj", "Sayajigunj", "Manjalpur", "Gotri"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Surat",
    zones: ["Adajan", "Vesu", "Athwa", "Varachha"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Kolkata",
    zones: ["Salt Lake", "Park Street", "New Town", "Howrah"],
    tier: 1,
    tierLabel: "Tier 1 · Metro",
  },
  {
    name: "Nagpur",
    zones: ["Dharampeth", "Sadar", "Sitabuldi", "Civil Lines"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Indore",
    zones: ["Vijay Nagar", "Palasia", "Bhawarkuan", "AB Road"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Bhopal",
    zones: ["MP Nagar", "Arera Colony", "New Market", "Habibganj"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Patna",
    zones: ["Boring Road", "Kankarbagh", "Bailey Road", "Rajendra Nagar"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Chandigarh",
    zones: ["Sector 17", "Sector 22", "Sector 35", "Industrial Area"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Coimbatore",
    zones: ["RS Puram", "Gandhipuram", "Peelamedu", "Saravanampatti"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Kochi",
    zones: ["Ernakulam", "Fort Kochi", "Edappally", "Kakkanad"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  {
    name: "Visakhapatnam",
    zones: ["MVP Colony", "Dwaraka Nagar", "Gajuwaka", "Seethammadhara"],
    tier: 2,
    tierLabel: "Tier 2 · Urban",
  },
  // Tier 3 Emerging
  {
    name: "Other",
    zones: ["Custom Location"],
    tier: 3,
    tierLabel: "Tier 3 · Emerging",
  },
];

const DELIVERY_PERSONAS = [
  {
    id: "food_delivery",
    emoji: "🍕",
    title: "Food Delivery",
    subtitle: "Zomato / Swiggy",
    platforms: ["Zomato", "Swiggy"],
    color: "#f97316",
    bgColor: "#f9731615",
    borderColor: "#f9731640",
  },
  {
    id: "grocery_delivery",
    emoji: "🛒",
    title: "Grocery Delivery",
    subtitle: "Zepto / Blinkit",
    platforms: ["Zepto", "Blinkit"],
    color: "#10b981",
    bgColor: "#10b98115",
    borderColor: "#10b98140",
  },
  {
    id: "ecommerce",
    emoji: "📦",
    title: "E-commerce",
    subtitle: "Amazon Flex",
    platforms: ["Amazon Flex"],
    color: "#3b82f6",
    bgColor: "#3b82f615",
    borderColor: "#3b82f640",
  },
];

const EARNING_RANGES = [
  { label: "₹2,000 – ₹4,000", value: "3000", tag: "Part-time" },
  { label: "₹4,001 – ₹8,000", value: "6000", tag: "Regular" },
  { label: "₹8,001 – ₹12,000", value: "10000", tag: "Full-time" },
  { label: "₹12,001+", value: "14000", tag: "Power rider" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { refreshSession } = useAppState();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [registrationProof, setRegistrationProof] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [selectedPersona, setSelectedPersona] = useState("");
  const [selectedEarningRange, setSelectedEarningRange] = useState("");

  const [form, setForm] = useState({
    name: "",
    platform: "Zomato",
    city: "Mumbai",
    zone: "Andheri East",
    customCity: "",
    customZone: "",
    avgWeeklyEarnings: "",
    hoursPerDay: "",
    daysWorkedThisWeek: "6",
    totalActiveDeliveryDays: "",
    daysActiveInLast30: "",
    consentGps: false,
    consentPayout: false,
    consentActivity: false,
    payoutMethod: "upi",
    upiId: "",
    bankAccount: "",
    ifscCode: "",
    wantInsurance: true,
  });

  const [premiumResult, setPremiumResult] = useState<ReturnType<
    typeof calculateWeeklyPremium
  > | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isIndianPhoneValid = /^[6-9]\d{9}$/.test(phone);

  const update = (key: string, val: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  // Update zones when city changes
  const currentCity = CITIES.find((c) => c.name === form.city) || CITIES[0];
  useEffect(() => {
    if (!currentCity.zones.includes(form.zone)) {
      update("zone", currentCity.zones[0]);
    }
  }, [form.city]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus first OTP box
  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSendOtp = async () => {
    if (!isIndianPhoneValid) {
      setPhoneError("Enter a valid Indian mobile number (starts with 6-9).");
      return;
    }

    setPhoneError("");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      const data = await res.json();
      if (!res.ok) { setPhoneError(data.error || "Phone verification is unavailable"); return; }
    } catch { setPhoneError("Phone verification is unavailable"); return; }
    setStep("otp");
  };

  const verifyOtpCode = async (otpCode: string) => {
    if (otpVerifying) return;

    setOtpVerifying(true);
    setOtpError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data?.error || "OTP verification failed");
        return;
      }

      setRegistrationProof(String(data.registrationProof || ""));
      setStep("persona");
    } catch {
      setOtpError("Unable to verify OTP right now. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are filled.
    if (newOtp.every((d) => d !== "")) {
      void verifyOtpCode(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    const persona = DELIVERY_PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      update("platform", persona.platforms[0]);
    }
  };

  const handlePersonaContinue = () => {
    if (!selectedPersona || !form.city) return;
    // Apply selected earning range to form
    if (selectedEarningRange) {
      update("avgWeeklyEarnings", selectedEarningRange);
    }
    setStep("profile");
  };

  const handleCalculatePremium = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    if (!registrationProof) { setSubmitError("Verify your phone before registration."); setIsSubmitting(false); return; }
    if (form.daysActiveInLast30 === "") { setSubmitError("Enter your activity days in the last 30 days."); setIsSubmitting(false); return; }
    if (!form.totalActiveDeliveryDays || !Number.isInteger(Number(form.totalActiveDeliveryDays)) || Number(form.totalActiveDeliveryDays) < 0) { setSubmitError("Enter your actual lifetime active delivery days."); setIsSubmitting(false); return; }
    setStep("calculating");

    const finalCity =
      form.city === "Other" && form.customCity ? form.customCity : form.city;
    const finalZone =
      form.city === "Other" && form.customZone ? form.customZone : form.zone;
    const daysWorked = parseInt(form.daysWorkedThisWeek) || 6;

    const result = calculateWeeklyPremium(
      finalZone,
      parseFloat(form.avgWeeklyEarnings) || 4200,
      form.platform,
      0,
      "clear",
      finalCity,
      daysWorked,
      Number(form.totalActiveDeliveryDays),
    );

    // Pricing comes from the server; no client-only plan multiplier.
    setPremiumResult(result);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone,
          platform: form.platform,
          city: finalCity,
          zone: finalZone,
          shiftType: "full_day",
          avgWeeklyIncome: parseFloat(form.avgWeeklyEarnings) || 4200,
          vehicleType: "bike",
          daysWorkedThisWeek: parseInt(form.daysWorkedThisWeek) || 6,
          totalActiveDeliveryDays: Number(form.totalActiveDeliveryDays),
          registrationProof,
          daysActiveInLast30: Number(form.daysActiveInLast30),
          consents: { gpsLocation: form.consentGps, bankUpi: form.consentPayout, platformActivity: form.consentActivity },
          wantInsurance: form.wantInsurance,
          payoutMethod: form.payoutMethod,
          upiId: form.upiId,
          bankAccount: form.bankAccount,
          ifscCode: form.ifscCode,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        setSubmitError(data?.error || "Unable to complete registration.");
        setStep("profile");
        return;
      }

      await refreshSession();
      safePush(router, "/dashboard");
    } catch {
      setSubmitError("Unable to complete registration right now.");
      setStep("profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress bar
  const stepIndex = ["phone", "otp", "persona", "profile", "calculating"].indexOf(step);
  const progressPercent = Math.min(100, ((stepIndex + 1) / 5) * 100);

  return (
    <div className="max-w-md mx-auto min-h-[75vh] flex flex-col fade-in px-4 pt-4 pb-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Step {stepIndex + 1} of 5
          </div>
          <div className="text-[10px] text-gray-400">
            {step === "phone" && "Phone"}
            {step === "otp" && "Verify OTP"}
            {step === "persona" && "Work Profile"}
            {step === "profile" && "Details"}
            {step === "calculating" && "AI Quote"}
          </div>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary-500 to-orange-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* step 1: phone input */}
        {step === "phone" && (
          <div className="w-full">
            <div
              className="w-16 h-16 rounded-[1.25rem] mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
              }}
            >
              <span style={{ transform: "rotate(-15deg) scale(1.1)" }}>🛵</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                <span className="text-slate-900">Get </span>
                <span className="text-gradient-orange">Protected</span>
              </h1>
              <p className="text-sm text-gray-600">
                Enter your mobile number to get started
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2">
                Mobile Number
              </label>
              <div className="relative flex items-stretch bg-white border border-slate-200 rounded-xl focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all overflow-hidden shadow-sm">
                <div className="flex items-center px-4 bg-slate-50 border-r border-slate-200">
                  <span className="text-gray-700 font-bold tracking-wide">
                    +91
                  </span>
                </div>
                <input
                  className="flex-1 px-4 text-lg py-4 outline-none text-slate-900 bg-transparent placeholder-slate-400 font-medium"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhoneError("");
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  }}
                  type="tel"
                  maxLength={10}
                />
              </div>
              {phoneError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {phoneError}
                </p>
              )}
            </div>

            <button
              onClick={handleSendOtp}
              disabled={!isIndianPhoneValid}
              className="btn btn-primary w-full text-lg font-bold py-4 rounded-xl mt-6 disabled:opacity-50"
            >
              Send OTP →
            </button>

            <p className="text-xs text-center text-gray-500 mt-6">
              By continuing, you agree to our{" "}
              <span className="text-primary-500">Terms</span> and{" "}
              <span className="text-primary-500 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        )}

        {/* step 2: otp verification */}
        {step === "otp" && (
          <div className="w-full">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl bg-primary-500/10 border border-primary-500/20">
                🔐
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-slate-900">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-600">Sent to +91-{phone}</p>
            </div>

            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              ))}
            </div>

            {otpError && (
              <div className="text-center text-sm text-red-500 font-medium mb-3">
                {otpError}
              </div>
            )}

            {otpVerifying && (
              <div className="text-center text-xs text-primary-500 font-semibold mb-3">
                Verifying OTP...
              </div>
            )}

            <p className="text-center text-xs text-amber-700">Local test mode. No SMS was sent. Use your operator-configured code.</p>

            <button
              onClick={() => setStep("phone")}
              className="btn btn-ghost w-full mt-6 text-sm"
            >
              ← Change Number
            </button>
          </div>
        )}

        {/* step 4: delivery persona + city + earnings */}
        {step === "persona" && (
          <div className="w-full">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl bg-emerald-500/10 border border-emerald-500/20">
                📍
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-slate-900">
                Your Work Profile
              </h1>
              <p className="text-sm text-gray-600">
                Select your delivery persona and operating city
              </p>
            </div>

            <div className="space-y-4">
              {/* Delivery Persona */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2.5">
                  Delivery Persona
                </label>
                <div className="space-y-2.5">
                  {DELIVERY_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaSelect(persona.id)}
                      className={`w-full flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPersona === persona.id
                          ? "shadow-md scale-[1.01]"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                      style={
                        selectedPersona === persona.id
                          ? {
                              background: persona.bgColor,
                              borderColor: persona.borderColor,
                            }
                          : {}
                      }
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{
                          background: persona.bgColor,
                          border: `1.5px solid ${persona.borderColor}`,
                        }}
                      >
                        {persona.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {persona.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {persona.subtitle}
                        </div>
                      </div>
                      {selectedPersona === persona.id && (
                        <div
                          className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: persona.color }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating City */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Operating City
                </label>
                <select
                  className="select-field"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} — {c.tierLabel}
                    </option>
                  ))}
                </select>
                {form.city === "Other" && (
                  <input
                    className="input-field mt-2"
                    value={form.customCity}
                    onChange={(e) => update("customCity", e.target.value)}
                    placeholder="Enter your City or Town"
                  />
                )}
              </div>

              {/* Weekly Earnings Range */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2.5">
                  Weekly Earnings Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EARNING_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedEarningRange(range.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedEarningRange === range.value
                          ? "bg-primary-50 border-primary-500 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`text-sm font-bold ${selectedEarningRange === range.value ? "text-primary-600" : "text-slate-700"}`}
                      >
                        {range.label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {range.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500">Activity is self-reported in this stage. Identity and platform verification are not configured; no KYC verification is claimed.</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep("otp")}
                className="px-5 py-3 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5"
              >
                ‹ Back
              </button>
              <button
                onClick={handlePersonaContinue}
                disabled={!selectedPersona || !form.city}
                className="flex-1 btn btn-primary text-base font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>✦</span> Continue to Details
              </button>
            </div>
          </div>
        )}

        {/* step 4: profile setup */}
        {step === "profile" && (
          <div className="w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-slate-900">
                Complete Profile
              </h1>
              <p className="text-sm text-gray-600">
                Final details to calculate your premium
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              {/* Platform (auto-set from persona but editable) */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Platform
                </label>
                <select
                  className="select-field"
                  value={form.platform}
                  onChange={(e) => update("platform", e.target.value)}
                >
                  {(
                    DELIVERY_PERSONAS.find((p) => p.id === selectedPersona)
                      ?.platforms || [
                      "Zomato",
                      "Swiggy",
                      "Amazon Flex",
                      "Blinkit",
                      "Zepto",
                    ]
                  ).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Your Delivery Zone
                </label>
                <select
                  className="select-field"
                  value={form.zone}
                  onChange={(e) => update("zone", e.target.value)}
                >
                  {currentCity.zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
                {form.city === "Other" && form.zone === "Custom Location" && (
                  <input
                    className="input-field mt-2"
                    value={form.customZone}
                    onChange={(e) => update("customZone", e.target.value)}
                    placeholder="Enter your specific district or zone"
                  />
                )}
                {currentCity && (
                  <div
                    className={`mt-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1.5 ${
                      currentCity.tier === 1
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : currentCity.tier === 2
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-primary-50 text-primary-600 border border-primary-200"
                    }`}
                  >
                    <span>
                      {currentCity.tier === 1
                        ? "🏙️"
                        : currentCity.tier === 2
                          ? "🌆"
                          : "🏘️"}
                    </span>
                    {currentCity.tierLabel} ·{" "}
                    {currentCity.tier === 1
                      ? "Quote uses the base city multiplier"
                      : currentCity.tier === 2
                        ? "Quote uses the Tier 2 city multiplier"
                        : "Quote uses the Tier 3 city multiplier"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Average Weekly Earnings (₹)
                </label>
                <input
                  className="input-field"
                  type="number"
                  value={form.avgWeeklyEarnings}
                  onChange={(e) => update("avgWeeklyEarnings", e.target.value)}
                  placeholder="4200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">Lifetime Active Delivery Days</label>
                <input className="input-field" type="number" min="0" max="36500" value={form.totalActiveDeliveryDays} onChange={(e) => update("totalActiveDeliveryDays", e.target.value)} placeholder="Your actual activity history" />
                <p className="text-xs text-gray-500 mt-1">Enter days you actually delivered. Eligibility is checked without changing the existing thresholds.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">Active Days in the Last 30 Days</label>
                <input className="input-field" type="number" min="0" max="30" value={form.daysActiveInLast30} onChange={(e) => update("daysActiveInLast30", e.target.value)} />
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <label className="flex gap-2"><input type="checkbox" checked={form.consentGps} onChange={(e) => update("consentGps", e.target.checked)} />I consent to location use for claim verification.</label>
                <label className="flex gap-2"><input type="checkbox" checked={form.consentPayout} onChange={(e) => update("consentPayout", e.target.checked)} />I consent to payout-detail use for insurance payments.</label>
                <label className="flex gap-2"><input type="checkbox" checked={form.consentActivity} onChange={(e) => update("consentActivity", e.target.checked)} />I consent to activity-data use for eligibility checks.</label>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Days Worked This Week
                </label>
                <select
                  className="select-field"
                  value={form.daysWorkedThisWeek}
                  onChange={(e) => update("daysWorkedThisWeek", e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>
                      {d} day{d > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-gray-400 mt-1">
                  Coverage eligibility based on overall activity history, not
                  just this week
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Hours Worked / Day
                </label>
                <input
                  className="input-field"
                  type="number"
                  value={form.hoursPerDay}
                  onChange={(e) => update("hoursPerDay", e.target.value)}
                  placeholder="8"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                  Payout Method
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => update("payoutMethod", "upi")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-all ${form.payoutMethod === "upi" ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-slate-200 text-slate-500"}`}
                  >
                    UPI ID
                  </button>
                  <button
                    onClick={() => update("payoutMethod", "bank")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-all ${form.payoutMethod === "bank" ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-slate-200 text-slate-500"}`}
                  >
                    Bank Account
                  </button>
                </div>

                {form.payoutMethod === "upi" ? (
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                      UPI ID (for payouts)
                    </label>
                    <input
                      className="input-field"
                      value={form.upiId}
                      onChange={(e) => update("upiId", e.target.value)}
                      placeholder="name@upi"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                        Account Number
                      </label>
                      <input
                        className="input-field"
                        value={form.bankAccount}
                        onChange={(e) => update("bankAccount", e.target.value)}
                        placeholder="123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">
                        IFSC Code
                      </label>
                      <input
                        className="input-field"
                        value={form.ifscCode}
                        onChange={(e) =>
                          update("ifscCode", e.target.value.toUpperCase())
                        }
                        placeholder="HDFC0001"
                      />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">Your quote is assigned from eligibility and activity. Registration alone does not activate cover.</p>

              {/* insurance opt-in / opt-out */}
              <div className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Want Insurance Coverage?
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {form.wantInsurance
                        ? "Request an eligibility check and pending quote"
                        : "No insurance policy will be created"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => update("wantInsurance", !form.wantInsurance)}
                  className={`relative w-12 h-6 rounded-full transition-all ${form.wantInsurance ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${form.wantInsurance ? "left-6" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep("persona")}
                className="px-5 py-3 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                ‹ Back
              </button>
              <button
                onClick={handleCalculatePremium}
                disabled={
                  isSubmitting ||
                  !form.name.trim() ||
                  !form.avgWeeklyEarnings ||
                  !form.hoursPerDay ||
                  form.totalActiveDeliveryDays === "" ||
                  form.daysActiveInLast30 === "" ||
                  (form.payoutMethod === "bank" && (!form.bankAccount.trim() || !form.ifscCode.trim()))
                }
                className="flex-1 btn btn-primary text-base font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Submitting..."
                  : form.wantInsurance
                    ? "Calculate My Premium →"
                    : "Complete Registration →"}
              </button>
            </div>

            {submitError && (
              <div className="text-xs text-red-500 font-medium mt-3 text-center">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* step 5: ai calculating */}
        {step === "calculating" && (
          <div className="w-full text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl bg-primary-500/10 border border-primary-500/20">
              🧠
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {form.wantInsurance
                ? "Calculating your risk profile..."
                : "Setting up your account..."}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Parametric Pricing Model v3.0
            </p>

            <div className="w-12 h-12 mx-auto border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-6" />

            {premiumResult && form.wantInsurance && (
              <div className="glass-card p-5 text-left mt-4 fade-in">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                      Weekly Premium
                    </div>
                    <div className="text-2xl font-bold text-primary-500">
                      ₹{premiumResult.weeklyPremium}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {premiumResult.premiumTierName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                      Max Payout (50%)
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{premiumResult.maxPayoutPerWeek?.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      50% cap applied
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Risk Score: {premiumResult.riskScore}/100 ·{" "}
                  {premiumResult.riskLabel}
                </div>
                {premiumResult.isEligible === false && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-xs font-semibold text-amber-700">
                      ⚠️ Not yet eligible
                    </div>
                    <div className="text-[11px] text-amber-600 mt-0.5">
                      {premiumResult.eligibilityReason}
                    </div>
                  </div>
                )}
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                    Pricing Formula
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    P({premiumResult.pricingBreakdown?.triggerProbability}) × ₹
                    {premiumResult.pricingBreakdown?.avgIncomeLostPerDay}/day ×{" "}
                    {premiumResult.pricingBreakdown?.daysExposed}d = ₹
                    {premiumResult.pricingBreakdown?.rawPremium} → Fixed ₹
                    {premiumResult.weeklyPremium}
                  </div>
                </div>
              </div>
            )}

            {premiumResult && !form.wantInsurance && (
              <div className="glass-card p-5 text-left mt-4 fade-in">
                <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold">
                  ⚠️ Insurance coverage opted out
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  No cover is active. Enrollment will require eligibility and payment verification.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
