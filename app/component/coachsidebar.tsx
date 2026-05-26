// app/component/CoachSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import LogoutConfirmModal from "./LogoutConfirmModal";

const navItems = [
  { href: "/dashboard/coach",             label: "Dashboard",       icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", requiresApproval: false },
  { href: "/dashboard/coach/credentials", label: "My Credentials",  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", requiresApproval: false },
  { href: "/dashboard/coach/requests",    label: "Pending Requests",icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", requiresApproval: true },
  { href: "/dashboard/coach/capacity",    label: "Capacity Control",icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", requiresApproval: true },
  { href: "/dashboard/coach/athletes",    label: "My Athletes",     icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", requiresApproval: true },
  { href: "/dashboard/coach/training-analysis", label: "Training Analysis", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", requiresApproval: true },
  { href: "/dashboard/coach/reports",     label: "Athlete Reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", requiresApproval: true },
  { href: "/dashboard/coach/messages",    label: "Messages",        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", requiresApproval: true },
  { href: "/dashboard/coach/profile",     label: "Profile",         icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", requiresApproval: false },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/coach/status/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setIsApproved(data.status === "approved");
      }
    } catch (err) {
      console.error("Error checking approval:", err);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Get CSRF token
      let csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
      });

      console.log("Logout response:", response.status);
      
      // Clear localStorage regardless of response
      localStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force redirect to login
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed", err);
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  return (
    <aside className="w-64 flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <img 
          src="/logo.svg" 
          alt="Smart Athlete Logo" 
          className="w-10 h-10 object-contain"
        />
        <div>
          <p className="font-bold text-sm text-gray-900">Smart Athlete</p>
          <p className="text-xs text-gray-500">Coach Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLocked = item.requiresApproval && !isApproved;

          return (
            <button
              key={item.href}
              onClick={() => !isLocked && router.push(item.href)}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : isLocked
                  ? "text-gray-400 cursor-not-allowed opacity-55"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
              </svg>
              <span className="flex-1">{item.label}</span>
              {isLocked && (
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pending approval warning */}
      {!isApproved && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs font-semibold text-amber-800">⏳ Pending Approval</p>
          <p className="text-xs mt-0.5 text-amber-700">Upload credentials to unlock all features</p>
        </div>
      )}

      {/* User footer */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
      />
    </aside>
  );
}
