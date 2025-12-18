"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export default function PlayerDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : user?.username || "Player";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 py-6">
        {/* Sidebar */}
        <aside className="w-64 rounded-xl bg-white p-4 shadow-sm">
          <nav className="space-y-2">
            <div className="mb-4 text-xs font-semibold text-gray-400">
              Menu
            </div>
            <button className="flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              🏠 Home
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700">
              📊 Log Performance
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700">
              🎯 Goal
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700">
              👤 Profile
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700">
              💬 Message
            </button>
            <button className="mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
              Create
            </button>
          </nav>

          <button className="mt-10 flex items-center gap-2 text-xs text-gray-500">
            ⏏ Logout
          </button>
        </aside>

        {/* Main dashboard content */}
        <section className="flex-1 space-y-4">
          {/* Top: welcome + success */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Welcome back, {displayName}!
              </h1>
              <p className="text-sm text-gray-500">
                Track your performance and achieve your goals.
              </p>
            </div>
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Successfully logged in
            </div>
          </div>

          {/* Top 4 cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="h-24 rounded-xl bg-white shadow-sm" />
            <div className="h-24 rounded-xl bg-white shadow-sm" />
            <div className="h-24 rounded-xl bg-white shadow-sm" />
            <div className="h-24 rounded-xl bg-white shadow-sm" />
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 rounded-xl bg-white shadow-sm" />
            <div className="h-64 rounded-xl bg-white shadow-sm" />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 rounded-xl bg-white shadow-sm" />
            <div className="h-40 rounded-xl bg-white shadow-sm" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
