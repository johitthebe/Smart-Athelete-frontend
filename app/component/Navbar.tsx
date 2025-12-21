"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const displayName =
    (user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : user?.username) || "Player";

  // choose dashboard path based on role if you want
  const dashboardHref =
    user?.role === "coach" ? "/dashboard/coach" : "/dashboard/player";

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4 px-6">
        {/* Left: logo -> dashboard */}
        <Link href={dashboardHref} className="flex items-center gap-2">
          <span className="font-bold text-blue-700">Smart Athlete</span>
        </Link>

        {/* Middle: search */}
        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full border px-4 py-2 text-sm"
          />
        </div>

        {/* Right: icons + profile */}
        <div className="flex items-center gap-4">
          <button className="rounded-full border p-2">🔔</button>
          <Link href="/profile" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">{displayName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
