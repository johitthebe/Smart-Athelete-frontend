"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import SuccessToast from "@/app/component/SuccessToast";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Refs for OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        // Focus last filled input or last input
        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
    
    // Focus last filled input or last input
    const lastIndex = Math.min(digits.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetch(`${API_BASE_URL}/api/csrf/`, {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({
          email,
          otp_code: otpCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Email verified successfully!");
        setShowSuccessToast(true);
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          router.push("/auth/login?verified=true");
        }, 2000);
      } else {
        setError(data.error || "Verification failed. Please try again.");
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      await fetch(`${API_BASE_URL}/api/csrf/`, {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Verification code sent! Check your email.");
        setCanResend(false);
        setCountdown(60); // 60 second cooldown
        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.error || "Failed to resend code. Please try again.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message="Email verified successfully! Redirecting to login..."
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-600 mb-8">
            We've sent a 6-digit code to<br />
            <span className="font-semibold text-gray-800">{email}</span>
          </p>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">{success}</p>
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerify}>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-[#173B80] text-white py-3 rounded-lg font-medium hover:bg-[#102a5a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || resending}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resending ? (
                "Sending..."
              ) : canResend ? (
                "Resend Code"
              ) : (
                `Resend in ${countdown}s`
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            The verification code will expire in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
