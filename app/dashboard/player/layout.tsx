"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import PlayerNavbar from "@/app/component/PlayerNavbar";
import PlayerSidebar from "@/app/component/PlayerSidebar";

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.role !== 'athlete') {
          router.push("/dashboard/coach");
        }
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <PlayerSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <PlayerNavbar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
