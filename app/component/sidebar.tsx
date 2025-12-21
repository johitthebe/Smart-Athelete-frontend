"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { href: "/dashboard/player", label: "Home" },
  { href: "/features/performancelog", label: "Log Performance" },
  { href: "/features/history", label: "history" },
  { href: "/features/goal", label: "Goal" },
  { href: "/profile", label: "Profile" },
  { href: "/features/graph", label: "Graph" },
  { href: "/features/feedback", label: "Message" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Logout function: clear user + go to homepage
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("temp_user");
    }
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] flex flex-col">
      <div className="px-6 py-4 font-semibold text-gray-700 border-b">
        Menu
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout button wired to function */}
      <button
        onClick={handleLogout}
        className="m-3 mt-auto rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 text-left"
      >
        Logout
      </button>
    </aside>
  );
}
