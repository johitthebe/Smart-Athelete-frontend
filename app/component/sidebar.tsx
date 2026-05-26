"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import LogoutConfirmModal from "./LogoutConfirmModal";

const items = [
  { href: "/dashboard/player", label: "Home" },
  { href: "/features/performancelog", label: "Log Performance" },
  { href: "/features/history", label: "history" },
  { href: "/features/goal", label: "Goal" },
  { href: "/profile", label: "Profile" },
  { href: "/features/graph", label: "Graph" },
  { href: "/features/feedback", label: "Message" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Logout function: clear user + go to homepage
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
      
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("temp_user");
        localStorage.clear();
      }
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Redirect to home
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      router.push("/");
    }
  };

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] flex flex-col">
      <div className="px-6 py-4 font-semibold text-gray-700 border-b">
        Menu
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout button wired to function */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="m-3 mt-auto rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 text-left"
      >
        Logout
      </button>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
      />
    </aside>
  );
}
