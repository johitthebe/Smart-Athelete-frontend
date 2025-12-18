"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    try {
      // 1) Get CSRF cookie from Django
      await fetch("http://127.0.0.1:8000/api/csrf/", {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      // 2) Send login request (identifier = email or username)
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ identifier, password }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // non‑JSON error page
      }

      if (res.ok) {
        console.log("LOGIN DATA:", data);
        console.log("ROLE VALUE:", data?.user?.role);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        const role = data.user?.role;

        // direct dashboards if role already set
        if (role === "player" || role === "athlete") {
          router.push("/dashboard/player");
        } else if (role === "coach") {
          router.push("/dashboard/coach");
        } else {
          // no role yet → go to choose role page under auth
          router.push("/auth/choose-role");
        }
      } else {
        setError(data?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  const handleGoogleLogin = () => {
    // Start Google login; Django/allauth will redirect back to NEXT_URL
    window.location.href =
      "http://127.0.0.1:8000/accounts/google/login/?next=/post-login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
          Sign In to your account
        </h1>

        {/* Google login button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 rounded-md py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50"
        >
          <span className="h-5 w-5 rounded-full bg-white border border-gray-300 flex items-center justify-center">
            <span className="text-xs font-bold text-[#4285F4]">G</span>
          </span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

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
              <a href="#" className="text-xs text-[#173B80] hover:underline">
                Forget Password
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
