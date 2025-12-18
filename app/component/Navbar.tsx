"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4 px-6">
        {/* Left: logo */}
        <div className="flex items-center gap-2">
          {/* Replace with your logo image if you have one */}
          <span className="font-bold text-blue-700">Smart Athlete</span>
        </div>

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
          {/* Notification icon placeholder */}
          <button className="rounded-full border p-2">🔔</button>

          {/* Profile */}
          <Link href="/profile" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">Alex Johnson</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
