// app/component/CoachSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    fetchUser();
    checkApprovalStatus();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

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
    }
  };

  const handleLogout = () => {
    if (confirm("Logout?")) {
      localStorage.clear();
      router.push("/auth/login");
    }
  };

  const navItems = [
    { href: "/dashboard/coach", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", requiresApproval: false },
    { href: "/dashboard/coach/credentials", label: "My Credentials", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", requiresApproval: false },
    { href: "/dashboard/coach/athletes", label: "My Athletes", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", requiresApproval: true },
    { href: "/dashboard/coach/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", requiresApproval: false },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h1 className="text-xl font-bold">Coach Panel</h1>
      </div>
      
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLocked = item.requiresApproval && !isApproved;
          
          return (
            <button
              key={item.href}
              onClick={() => !isLocked && router.push(item.href)}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : isLocked
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {!isApproved && (
        <div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 font-medium">Pending Approval</p>
          <p className="text-xs text-yellow-700 mt-1">Upload credentials to unlock features</p>
        </div>
      )}

      <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
        {user && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
