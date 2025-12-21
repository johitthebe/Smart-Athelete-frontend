// app/component/CoachSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard/coach", label: "Overview" },
  { href: "/dashboard/coach/athletes", label: "My Athletes" },
  { href: "/dashboard/coach/tests", label: "Tests & Sessions" },
  { href: "/dashboard/coach/reports", label: "Reports" },
  { href: "/dashboard/coach/messages", label: "Messages" },
  { href: "/dashboard/coach/settings", label: "Settings" },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // hit your Django logout endpoint
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
      // clear any client storage if you use it
      localStorage.removeItem("user");
      // redirect to login
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

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        className="mt-4 w-full rounded-full border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </aside>
  );
}
