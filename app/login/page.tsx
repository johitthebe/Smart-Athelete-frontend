"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1) Get CSRF cookie from Django
      await fetch("http://127.0.0.1:8000/api/csrf/", {
  method: "GET",
  credentials: "include",
 });

      // 2) Read csrftoken from cookie
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
        return null;
      };

      const csrfToken = getCookie("csrftoken");

      // 3) Send login request with CSRF header and cookies
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ username, password }),
      });

      // If backend returns HTML error page, avoid JSON parse crash
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // non‑JSON response => generic error
      }

      if (res.ok) {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // redirect based on role
        if (data.user?.role === "player") {
          router.push("/dashboard/player");
        } else if (data.user?.role === "coach") {
          router.push("/dashboard/coach");
        } else {
          router.push("/");
        }
      } else {
        setError(data?.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#173B80] text-white py-2 rounded-md text-sm font-medium hover:bg-[#102a5a] transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
