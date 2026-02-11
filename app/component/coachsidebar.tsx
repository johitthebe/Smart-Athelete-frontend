// app/component/CoachSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

const navItems = [
  { href: "/dashboard/coach", label: "Overview", requiresApproval: false },
  { href: "/dashboard/coach/credentials", label: "My Credentials", requiresApproval: false },
  { href: "/dashboard/coach/athletes", label: "My Athletes", requiresApproval: true },
  { href: "/dashboard/coach/tests", label: "Tests & Sessions", requiresApproval: true },
  { href: "/dashboard/coach/reports", label: "Reports", requiresApproval: true },
  { href: "/dashboard/coach/messages", label: "Messages", requiresApproval: true },
  { href: "/dashboard/coach/settings", label: "Settings", requiresApproval: false },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach/status/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsApproved(data.status === "approved");
      }
    } catch (err) {
      console.error("Error checking approval status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen px-4 py-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">Coach Panel</h2>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLocked = item.requiresApproval && !isApproved && !loading;

          if (isLocked) {
            return (
              <div
                key={item.href}
                className="block rounded-full px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                title="Available after approval"
              >
                {item.label}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {!isApproved && !loading && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
          <p className="text-xs text-yellow-800">
            <strong>Pending Approval</strong>
            <br />
            Upload credentials to unlock all features
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 w-full rounded-full border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </aside>
  );
}
