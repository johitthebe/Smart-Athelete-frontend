"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  // helper to read csrftoken cookie
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
      await fetch("http://localhost:8000/api/csrf/", {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      // 2) Send register request with CSRF + cookies
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // non‑JSON error (like HTML 403 page)
      }

      if (res.ok) {
        // User is now logged in automatically
        // Redirect to choose role page
        router.push("/auth/choose-role");
      } else {
        console.log("REGISTER ERROR:", data);
        
        // Handle specific error messages
        let errorMessage = "Registration failed.";
        
        if (data?.username) {
          errorMessage = Array.isArray(data.username) 
            ? data.username[0] 
            : "Username already exists or is invalid.";
        } else if (data?.email) {
          errorMessage = Array.isArray(data.email)
            ? data.email[0]
            : "Email already exists or is invalid.";
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.detail) {
          errorMessage = data.detail;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6">
        {/* back button etc. – keep whatever UI you already have here */}

        <h1 className="text-3xl md:text-4xl font-semibold text-center text-blue-600 mb-10">
          Create your free account
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First / Last name row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#173B80] text-white py-3 rounded-md text-sm font-medium hover:bg-[#102a5a] transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
