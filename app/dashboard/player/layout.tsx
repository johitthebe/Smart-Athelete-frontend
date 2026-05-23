"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import PlayerNavbar from "@/app/component/PlayerNavbar";
import PlayerSidebar from "@/app/component/PlayerSidebar";
import { NotificationProvider } from "@/app/context/NotificationContext";

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
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
        if (data.role !== 'athlete') {
          router.replace("/dashboard/coach");
        } else {
          // Check onboarding status for athletes
          const onboardingRes = await fetch(`${API_BASE_URL}/api/auth/onboarding/status/`, {
            credentials: "include",
            cache: 'no-store'
          });
          
          if (onboardingRes.ok) {
            const onboardingData = await onboardingRes.json();
            if (!onboardingData.completed) {
              // Redirect to onboarding if not completed
              router.replace("/auth/onboarding");
              return;
            }
          }
          
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
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50">
        <PlayerSidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <PlayerNavbar />
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}
