"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";
import Sidebar from "@/app/component/sidebar";

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
  (user?.first_name || user?.last_name
    ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
    : user?.username) || "Player";
    
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar (search + profile etc.) */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar menu */}
        <Sidebar />

        {/* Main dashboard area */}
        <section className="flex-1 p-8 space-y-6">
          {/* Header: welcome + status chip */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {displayName}!
              </h1>
              <p className="text-sm text-gray-500">
                Track your performance and achieve your goals.
              </p>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700">
              Successfully logged in
            </div>
          </div>

          {/* Top four summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-gray-500 mb-1">Sessions this week</p>
              <p className="text-2xl font-semibold text-gray-900">4</p>
              <p className="text-[11px] text-emerald-600 mt-1">+1 vs last week</p>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-gray-500 mb-1">Best 1500m time</p>
              <p className="text-2xl font-semibold text-gray-900">4:42</p>
              <p className="text-[11px] text-gray-400 mt-1">Goal: 4:30</p>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-gray-500 mb-1">Weekly distance</p>
              <p className="text-2xl font-semibold text-gray-900">32 km</p>
              <p className="text-[11px] text-emerald-600 mt-1">On track</p>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-gray-500 mb-1">Consistency streak</p>
              <p className="text-2xl font-semibold text-gray-900">7 days</p>
              <p className="text-[11px] text-gray-400 mt-1">Keep it going</p>
            </div>
          </div>

          {/* Middle row: performance chart + goals progress */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Performance chart card */}
            <div className="xl:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-gray-800">
                    Performance overview
                  </h2>
                  <div className="flex gap-2 rounded-full border bg-gray-50 text-xs text-gray-600 px-1 py-0.5">
                    <button className="rounded-full bg-white px-3 py-1 shadow-sm">
                      Line chart
                    </button>
                    <button className="rounded-full px-3 py-1">
                      Radar chart
                    </button>
                  </div>
                </div>
                <select className="text-xs border rounded-md px-2 py-1 text-gray-600">
                  <option>Week</option>
                  <option>Month</option>
                </select>
              </div>

              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Performance chart (integrate real chart later)
              </div>

              <div className="flex justify-between text-[11px] text-gray-400 mt-2">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
            </div>

            {/* Goals progress card */}
            <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-gray-800">
                Goals progress
              </h2>

              {/* Goal 1 */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Run 1500m under 4:30</span>
                  <span>30%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: "30%" }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">45 days left</p>
              </div>

              {/* Goal 2 */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Weekly distance 40 km</span>
                  <span>60%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: "60%" }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">3 days left</p>
              </div>

              {/* Goal 3 */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>3 strength sessions / week</span>
                  <span>80%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: "80%" }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">On track</p>
              </div>
            </div>
          </div>

          {/* Bottom row: comparison + coach messages */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Comparison card */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-800">
                  Comparison
                </h2>
                <select className="text-xs border rounded-md px-2 py-1 text-gray-600">
                  <option>Usain Bolt</option>
                </select>
              </div>

              <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                Comparison chart (integrate real chart later)
              </div>

              <div className="mt-4 flex justify-between text-xs text-gray-600">
                <span>You</span>
                <span>Usain Bolt</span>
              </div>
            </div>

            {/* Coach messages */}
            <div className="xl:col-span-2 rounded-xl border bg-white p-4 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-gray-800 mb-1">
                Coach feedback
              </h2>

              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-700"
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Coach William</span>
                    <span>Nov 11</span>
                  </div>
                  <p>
                    Excellent work on reaching 10 seconds for your 100m run. Your
                    form has improved significantly. Keep focusing on your
                    acceleration out of the blocks.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
