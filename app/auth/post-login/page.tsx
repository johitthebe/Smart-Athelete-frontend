"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function PostLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [needsRole, setNeedsRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"athlete" | "coach_pending" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        
        // If user already has a role, redirect to appropriate dashboard
        if (data.role && data.role !== 'none') {
          redirectToDashboard(data.role);
        } else {
          // User needs to select a role (Google OAuth user)
          setNeedsRole(true);
          setLoading(false);
        }
      } else {
        // Not authenticated, redirect to login
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Error checking user status:", err);
      router.push("/auth/login");
    }
  };

  const redirectToDashboard = (role: string) => {
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

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google/complete-signup/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (res.ok) {
        const data = await res.json();
        redirectToDashboard(data.user.role);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to set role");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error setting role:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  if (loading && !needsRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (needsRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome to Smart Athlete!
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Please select your role to continue
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setSelectedRole("athlete")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                selectedRole === "athlete"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === "athlete" ? "border-blue-600" : "border-gray-300"
                }`}>
                  {selectedRole === "athlete" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">I'm an Athlete</p>
                  <p className="text-sm text-gray-600">Track performance and connect with coaches</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole("coach_pending")}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                selectedRole === "coach_pending"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === "coach_pending" ? "border-blue-600" : "border-gray-300"
                }`}>
                  {selectedRole === "coach_pending" && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">I'm a Coach</p>
                  <p className="text-sm text-gray-600">Guide athletes and manage training</p>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
