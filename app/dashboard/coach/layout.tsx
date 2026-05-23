"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import CoachNavbar from "@/app/component/CoachNavbar";
import CoachSidebar from "@/app/component/coachsidebar";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Check auth when page becomes visible (e.g., after back button)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also check on focus
    window.addEventListener('focus', checkAuth);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { 
        credentials: "include",
        cache: 'no-store' // Prevent caching
      });
      if (res.ok) {
        const data = await res.json();
        if (data.role !== 'coach' && data.role !== 'coach_pending') {
          router.replace("/dashboard/player");
        } else {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } else {
        router.replace("/auth/login");
      }
    } catch (err) {
      router.replace("/auth/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <CoachSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <CoachNavbar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
