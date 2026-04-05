"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      res = await fetch("/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ identifier, password }),
      });
    } catch (networkErr) {
      // fetch() itself threw — backend is unreachable
      console.error("Network error — backend not reachable:", networkErr);
      setError(
        "Cannot reach the server. Make sure the backend is running on port 8000."
      );
      return;
    }

    console.log("Login response status:", res.status);

    // ── 2. Handle non-OK responses ────────────────────────────────
    if (!res.ok) {
      // Try to parse an error message; fall back gracefully
      let message = "Invalid credentials. Please try again.";
      try {
        const data = await res.json();
        console.error("Login failed:", data);
        if (data?.error) message = data.error;
        else if (data?.detail) message = data.detail;
        else if (data?.non_field_errors) message = data.non_field_errors[0];
        else if (typeof data === "string") message = data;
      } catch {
        // Body was empty or not JSON — use the status code for context
        if (res.status === 401 || res.status === 403) {
          message = "Invalid username/email or password.";
        } else if (res.status >= 500) {
          message = `Server error (${res.status}). Check that Django is running.`;
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          Sign In to your account
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
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
