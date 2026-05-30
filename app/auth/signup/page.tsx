"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import SuccessToast from "@/app/component/SuccessToast";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
      await fetch(`${API_BASE_URL}/api/csrf/`, {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      // 2) Send register request with CSRF + cookies
      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
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
        // Registration successful - redirect to email verification
        setShowSuccessToast(true);
        
        // Redirect to email verification page after a brief delay
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        console.log("REGISTER ERROR:", data);
        
        // Handle specific error messages with detailed explanations
        let errorMessage = "Registration failed. Please try again.";
        
        // Check for field-specific errors
        if (data?.username) {
          const usernameError = Array.isArray(data.username) ? data.username[0] : data.username;
          if (usernameError.toLowerCase().includes('already exists') || usernameError.toLowerCase().includes('taken')) {
            errorMessage = "This username is already taken. Please choose a different username.";
          } else if (usernameError.toLowerCase().includes('invalid')) {
            errorMessage = "Invalid username. Use only letters, numbers, and underscores.";
          } else {
            errorMessage = `Username error: ${usernameError}`;
          }
        } else if (data?.email) {
          const emailError = Array.isArray(data.email) ? data.email[0] : data.email;
          if (emailError.toLowerCase().includes('already exists') || emailError.toLowerCase().includes('taken')) {
            errorMessage = "This email is already registered. Please use a different email or try logging in.";
          } else if (emailError.toLowerCase().includes('invalid')) {
            errorMessage = "Invalid email address. Please enter a valid email.";
          } else {
            errorMessage = `Email error: ${emailError}`;
          }
        } else if (data?.password) {
          const passwordError = Array.isArray(data.password) ? data.password[0] : data.password;
          if (passwordError.toLowerCase().includes('too short')) {
            errorMessage = "Password is too short. Please use at least 8 characters.";
          } else if (passwordError.toLowerCase().includes('too common')) {
            errorMessage = "This password is too common. Please choose a more secure password.";
          } else if (passwordError.toLowerCase().includes('numeric')) {
            errorMessage = "Password cannot be entirely numeric. Please include letters.";
          } else {
            errorMessage = `Password error: ${passwordError}`;
          }
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.detail) {
          errorMessage = data.detail;
        } else if (data?.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors;
        } else if (res.status === 400) {
          errorMessage = "Invalid registration data. Please check all fields and try again.";
        } else if (res.status === 500) {
          errorMessage = "Server error. Please try again later or contact support.";
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Network or server error:", err);
      setError("Cannot connect to the server. Please ensure the backend is running and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message="Account created successfully! Redirecting..."
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      
      <div className="w-full max-w-xl px-6">
        {/* back button etc. – keep whatever UI you already have here */}

        <h1 className="text-3xl md:text-4xl font-semibold text-center text-blue-600 mb-10">
          Create your free account
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          You'll receive a verification code via email after registration
        </p>

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
