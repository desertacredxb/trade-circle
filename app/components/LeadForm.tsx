"use client";

import { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Eye,
  EyeOff,
  Shield,
  Zap,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  language: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface ApiResponse {
  message: string;
}

type Step = "form" | "otp" | "verified";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const OTP_RESEND_SECONDS = 60;

const COUNTRY_OPTIONS = [
  { code: "+91", flag: "🇮🇳", label: "🇮🇳 +91" },
  { code: "+1", flag: "🇺🇸", label: "🇺🇸 +1" },
  { code: "+44", flag: "🇬🇧", label: "🇬🇧 +44" },
] as const;

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Gujarati",
  "Telgu",
  "Tamil",
  "Kannada",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: T & { message?: string } = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiResponse).message ?? "Something went wrong.");
  }

  return data;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TrustBadgesProps {}

function TrustBadges(_: TrustBadgesProps) {
  return (
    <div className="flex justify-center gap-8 mt-6 text-gray-400 text-sm">
      <span className="flex items-center gap-2">
        <CheckCircle size={16} /> 100% Free
      </span>
      <span className="flex items-center gap-2">
        <Shield size={16} /> Secure
      </span>
      <span className="flex items-center gap-2">
        <Zap size={16} /> Instant Access
      </span>
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle: string;
}

function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
        <BarChart3 className="text-black" size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <p className="text-red-400 text-sm text-center">{message}</p>;
}

// ─── Verified Screen ──────────────────────────────────────────────────────────

interface VerifiedScreenProps {
  fullName: string;
}

interface VerifiedScreenProps {
  fullName: string;
}

function VerifiedScreen({ fullName }: VerifiedScreenProps) {
  const router = useRouter();

  // Change URL when screen loads
  useEffect(() => {
    router.replace("/thank-you");
  }, [router]);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-3xl border border-white/20 p-10 md:p-14 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="https://res.cloudinary.com/dpekvrij7/image/upload/v1776407430/logo-01_u6spbo.svg"
              alt="CFT logo image"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center">
              <CheckCircle className="text-black" size={40} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-3">
            Thank You for Joining Close Friends Traders!
          </h2>

          {/* Welcome */}
          <p className="text-gray-300 text-lg mb-3">
            Welcome aboard{" "}
            <span className="text-white font-semibold">{fullName}</span> 🎉
          </p>

          {/* Description */}
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Your mobile number has been successfully verified and your
            <span className="text-white font-semibold">
              {" "}
              Close Friends Traders{" "}
            </span>
            account is now active.
            <br />
            <br />
            You can now start exploring powerful trading tools, market insights,
            and opportunities designed to help you trade smarter and grow
            faster.
          </p>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} /> Account Verified
            </span>

            <span className="flex items-center gap-2">
              <Shield size={16} /> Secure Platform
            </span>

            <span className="flex items-center gap-2">
              <Zap size={16} /> Ready to Trade
            </span>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <button
              onClick={() => router.push("/dashboard")}
              className="gold-gradient text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface OtpScreenProps {
  phone: string;
  countryCode: string;
  onVerified: () => void;
  onBack: () => void;
}

function OtpScreen({ phone, countryCode, onVerified, onBack }: OtpScreenProps) {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(OTP_RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendTimer = () => {
    setResendTimer(OTP_RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startResendTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await apiFetch<ApiResponse>("api/leads/verify-phone-otp", {
        phone,
        countryCode,
        otp,
      });
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);

    try {
      await apiFetch<ApiResponse>("api/leads/resend-otp", {
        phone,
        countryCode,
      });
      startResendTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const formattedTimer = `00:${String(resendTimer).padStart(2, "0")}`;

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-3xl border border-white/20 p-8 md:p-12">
          <h2 className="text-white">Thank You For the Registration</h2>
          <CardHeader
            title="Verify Your Number"
            subtitle={`OTP sent to ${countryCode} ${phone}`}
          />

          <div className="space-y-6">
            <p className="text-gray-400 text-sm">
              Enter the 6-digit code we sent to your mobile number.
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="• • • • • •"
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-(--brand-gold) transition"
            />

            <ErrorMessage message={error} />

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || otp.length < 6}
              className="w-full gold-gradient cursor-pointer text-black py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Verify OTP
            </button>

            {/* Resend timer */}
            <div className="text-center text-sm text-gray-400">
              {resendTimer > 0 ? (
                <span>
                  Resend OTP in{" "}
                  <span className="text-(--brand-gold) font-semibold tabular-nums">
                    {formattedTimer}
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-(--brand-gold) font-semibold hover:underline disabled:opacity-60 cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-400 text-sm hover:text-white transition cursor-pointer"
            >
              ← Back to Registration
            </button>
          </div>
        </div>

        <TrustBadges />
      </div>
    </section>
  );
}

// ─── Registration Form ────────────────────────────────────────────────────────

interface RegistrationFormProps {
  onSuccess: (data: FormData) => void;
}

function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    language: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));
    setError("");
  };

  const validate = (): string | null => {
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!formData.terms) return "Please accept the Terms and Conditions.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiFetch<ApiResponse>("api/leads/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        language: formData.language,
        password: formData.password,
      });
      onSuccess(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-form" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-3xl border border-white/20 p-8 md:p-12">
          <CardHeader
            title="Open Your Close Friends Traders Account"
            subtitle="Start Trading in 2 Minutes | Completely Free"
          />

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <input
              name="fullName"
              type="text"
              placeholder="Full Name*"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-(--brand-gold) transition"
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email Address (optional)"
              value={formData.email}
              onChange={handleChange}
              // required
              autoComplete="email"
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-(--brand-gold) transition"
            />

            {/* Phone */}
            <div className="flex items-center border border-white/20 rounded-lg overflow-hidden focus-within:border-(--brand-gold) transition">
              <div className="relative">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="appearance-none bg-transparent px-4 py-3 pr-8 text-white focus:outline-none"
                >
                  {COUNTRY_OPTIONS.map((c) => (
                    <option
                      key={c.code}
                      value={c.code}
                      className="bg-(--brand-dark)"
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <input
                name="phone"
                type="tel"
                placeholder="Mobile Number*"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-white"
              />
            </div>

            {/* Language */}
            <div className="relative">
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="w-full appearance-none bg-transparent border border-white/20 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-(--brand-gold) transition"
              >
                <option value="" className="bg-(--brand-dark)">
                  Select Language*
                </option>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang} value={lang} className="bg-(--brand-dark)">
                    {lang}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create Password*"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-(--brand-gold) transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password*"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-(--brand-gold) transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <input
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 accent-(--brand-gold)"
              />
              <p>
                I agree to the{" "}
                <span className="text-(--brand-gold)">Privacy Policies</span>{" "}
                and{" "}
                <span className="text-(--brand-gold)">
                  Terms and Conditions
                </span>
                , and I consent to receive SMS and RCS messages from Close
                Friends Traders.
              </p>
            </div>

            <ErrorMessage message={error} />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-black py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Register
            </button>
          </form>
        </div>

        <TrustBadges />
      </div>
    </section>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function LeadForm() {
  const [step, setStep] = useState<Step>("form");
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleRegistrationSuccess = (data: FormData) => {
    setSubmittedData(data);
    setStep("otp");
  };

  if (step === "verified" && submittedData) {
    return <VerifiedScreen fullName={submittedData.fullName} />;
  }

  if (step === "otp" && submittedData) {
    return (
      <OtpScreen
        phone={submittedData.phone}
        countryCode={submittedData.countryCode}
        onVerified={() => setStep("verified")}
        onBack={() => setStep("form")}
      />
    );
  }

  return <RegistrationForm onSuccess={handleRegistrationSuccess} />;
}
