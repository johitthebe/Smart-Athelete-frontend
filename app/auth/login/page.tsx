"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import SuccessToast from "@/app/component/SuccessToast";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Already logged in, redirect to appropriate dashboard
        if (data.role === 'admin') {
          router.replace("/admin");
        } else if (data.role === 'coach' || data.role === 'coach_pending') {
          router.replace("/dashboard/coach");
        } else {
          router.replace("/dashboard/player");
        }
      } else {
        setChecking(false);
      }
    } catch (err) {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let res: Response;

    // ── 1. Fire the request ───────────────────────────────────────
    try {
      const csrfToken = getCookie("csrftoken");
      res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ username: identifier, password }),
      });
    } catch (networkErr) {
      // fetch() itself threw — backend is unreachable
      console.error("Network error — backend not reachable:", networkErr);
      setError(
        "Cannot connect to the server. Please ensure the backend is running on port 8000 and try again."
      );
      return;
    }

    console.log("Login response status:", res.status);

    // ── 2. Handle non-OK responses ────────────────────────────────
    if (!res.ok) {
      // Try to parse an error message with detailed explanations
      let message = "Login failed. Please check your credentials and try again.";
      try {
        const data = await res.json();
        console.error("Login failed:", data);
        
        // Check if email verification is required
        if (data?.requires_verification && data?.email) {
          setVerificationEmail(data.email);
          setError("Your email is not verified. Please verify your email to login.");
          return;
        }
        
        // Check for specific error types
        if (data?.error) {
          const errorMsg = data.error.toLowerCase();
          if (errorMsg.includes('email not verified')) {
            setVerificationEmail(data.email || identifier);
            message = "Your email is not verified. Please verify your email to login.";
          } else if (errorMsg.includes('invalid credentials') || errorMsg.includes('invalid username') || errorMsg.includes('invalid password')) {
            message = "Invalid username/email or password. Please check your credentials and try again.";
          } else if (errorMsg.includes('account disabled') || errorMsg.includes('inactive')) {
            message = "Your account has been disabled. Please contact support for assistance.";
          } else if (errorMsg.includes('not found')) {
            message = "No account found with these credentials. Please check your username/email or sign up.";
          } else {
            message = data.error;
          }
        } else if (data?.detail) {
          const detailMsg = data.detail.toLowerCase();
          if (detailMsg.includes('credentials') || detailMsg.includes('authentication')) {
            message = "Invalid username/email or password. Please try again.";
          } else {
            message = data.detail;
          }
        } else if (data?.non_field_errors) {
          message = Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors;
        } else if (typeof data === "string") {
          message = data;
        }
      } catch {
        // Body was empty or not JSON — use the status code for context
        if (res.status === 401 || res.status === 403) {
          message = "Invalid username/email or password. Please check your credentials.";
        } else if (res.status === 429) {
          message = "Too many login attempts. Please wait a few minutes and try again.";
        } else if (res.status >= 500) {
          message = `Server error (${res.status}). The server is experiencing issues. Please try again later.`;
        } else if (res.status === 400) {
          message = "Invalid login request. Please ensure all fields are filled correctly.";
        }
      }
      setError(message);
      return;
    }

    // ── 3. Success ────────────────────────────────────────────────
    let data: any = {};
    try {
      data = await res.json();
    } catch {
      // Shouldn't happen on 2xx, but guard anyway
    }
    console.log("Login successful:", data);

    // Show success toast
    setShowSuccessToast(true);

    // Redirect after brief delay to show toast
    setTimeout(() => {
      const role = data.user?.role;
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "coach" || role === "coach_pending") {
        router.push("/dashboard/coach");
      } else if (role === "athlete") {
        router.push("/dashboard/player");
      } else {
        router.push("/auth/choose-role");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message="Login successful! Redirecting to dashboard..."
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          Sign In to your account
        </h1>

        {error && (
          <div className="mb-4">
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            {verificationEmail && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push(`/auth/verify-email?email=${encodeURIComponent(verificationEmail)}`)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                >
                  Go to email verification
                </button>
              </div>
            )}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#173B80]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#173B80]"
            />
            <div className="mt-2 text-right">
              <a href="/auth/forgot-password" className="text-xs text-[#173B80] hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-[#173B80] text-white py-3 rounded-md text-sm font-medium hover:bg-[#102a5a] transition-colors"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-[#173B80] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
