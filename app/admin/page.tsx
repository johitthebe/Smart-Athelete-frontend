"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "overview" | "users" | "benchmarks" | "system";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me/", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.role !== "admin") router.push("/dashboard/player");
      } else router.push("/auth/login");
    } catch (err) {
      router.push("/auth/login");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/users/stats/", { credentials: "include" });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (confirm("Logout?")) {
      localStorage.clear();
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <h1 className="text-xl font-bold">Athlete Tracker</h1>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === "overview" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => router.push("/admin/users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === "users" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-medium">User Management</span>
          </button>
          <button onClick={() => setActiveTab("benchmarks")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === "benchmarks" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="font-medium">Benchmarks</span>
          </button>
          <button onClick={() => setActiveTab("system")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === "system" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-medium">System Status</span>
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">{user.username?.[0]?.toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeTab === "overview" ? "Welcome back!" : activeTab === "users" ? "User Management" : activeTab === "benchmarks" ? "Benchmarks" : "System Status"}</h2>
              <p className="text-sm text-gray-500">{activeTab === "overview" ? "Here's your performance overview for today." : activeTab === "users" ? "Manage users, roles, and permissions" : activeTab === "benchmarks" ? "Configure performance benchmarks" : "Monitor system health"}</p>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">admin</p>
                  </div>
                </div>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <div className="p-8">
          {activeTab === "overview" && stats && (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><p className="text-sm text-gray-500 mb-1">Active Goals</p><p className="text-3xl font-bold">15</p></div>
                <div className="bg-white rounded-xl shadow-sm p-6"><div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div><p className="text-sm text-gray-500 mb-1">This Week</p><p className="text-3xl font-bold">20</p><p className="text-xs text-green-600 mt-1">performance logs</p></div>
                <div className="bg-white rounded-xl shadow-sm p-6"><div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div><p className="text-sm text-gray-500 mb-1">Total Logs</p><p className="text-3xl font-bold">20</p><p className="text-xs text-gray-500 mt-1">all time</p></div>
                <div className="bg-white rounded-xl shadow-sm p-6"><div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-3xl font-bold">2</p><p className="text-xs text-gray-500 mt-1">goals achieved</p></div>
              </div>
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Most recent activities</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Distance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Elevation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Pace</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">HR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Calories</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Power</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-500">26-05-25</td><td className="px-6 py-4"><div className="flex items-center gap-2"><span>🏋️</span><span className="text-sm font-medium text-blue-600">Lunch Weight Training</span></div></td><td className="px-6 py-4 text-sm text-gray-500">0km</td><td className="px-6 py-4 text-sm text-gray-500">0m</td><td className="px-6 py-4 text-sm text-gray-500">48:57</td><td className="px-6 py-4 text-sm text-gray-500">0.0km/h</td><td className="px-6 py-4 text-sm text-gray-500">97</td><td className="px-6 py-4 text-sm text-gray-500">208kcal</td><td className="px-6 py-4 text-sm text-gray-500">n/a</td></tr>
                      <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-500">26-05-25</td><td className="px-6 py-4"><div className="flex items-center gap-2"><span>🏃</span><span className="text-sm font-medium text-blue-600">Lunch Run</span></div></td><td className="px-6 py-4 text-sm text-gray-500">2.00km</td><td className="px-6 py-4 text-sm text-gray-500">0m</td><td className="px-6 py-4 text-sm text-gray-500">14:25</td><td className="px-6 py-4 text-sm text-gray-500">7:12/km</td><td className="px-6 py-4 text-sm text-gray-500">127</td><td className="px-6 py-4 text-sm text-gray-500">129kcal</td><td className="px-6 py-4 text-sm text-gray-500">203w</td></tr>
                      <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-500">23-05-25</td><td className="px-6 py-4"><div className="flex items-center gap-2"><span>🏋️</span><span className="text-sm font-medium text-blue-600">Morning Weight Training</span></div></td><td className="px-6 py-4 text-sm text-gray-500">0km</td><td className="px-6 py-4 text-sm text-gray-500">0m</td><td className="px-6 py-4 text-sm text-gray-500">52:40</td><td className="px-6 py-4 text-sm text-gray-500">0.0km/h</td><td className="px-6 py-4 text-sm text-gray-500">106</td><td className="px-6 py-4 text-sm text-gray-500">262kcal</td><td className="px-6 py-4 text-sm text-gray-500">n/a</td></tr>
                      <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-500">23-05-25</td><td className="px-6 py-4"><div className="flex items-center gap-2"><span>🏃</span><span className="text-sm font-medium text-blue-600">Morning Run</span></div></td><td className="px-6 py-4 text-sm text-gray-500">1.22km</td><td className="px-6 py-4 text-sm text-gray-500">0m</td><td className="px-6 py-4 text-sm text-gray-500">9:43</td><td className="px-6 py-4 text-sm text-gray-500">7:58/km</td><td className="px-6 py-4 text-sm text-gray-500">139</td><td className="px-6 py-4 text-sm text-gray-500">101kcal</td><td className="px-6 py-4 text-sm text-gray-500">196w</td></tr>
                      <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-sm text-gray-500">22-05-25</td><td className="px-6 py-4"><div className="flex items-center gap-2"><span>🏋️</span><span className="text-sm font-medium text-blue-600">Morning Weight Training</span></div></td><td className="px-6 py-4 text-sm text-gray-500">0km</td><td className="px-6 py-4 text-sm text-gray-500">0m</td><td className="px-6 py-4 text-sm text-gray-500">41:03</td><td className="px-6 py-4 text-sm text-gray-500">0.0km/h</td><td className="px-6 py-4 text-sm text-gray-500">90</td><td className="px-6 py-4 text-sm text-gray-500">154kcal</td><td className="px-6 py-4 text-sm text-gray-500">n/a</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {activeTab === "benchmarks" && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
              <h3 className="text-lg font-semibold mb-2">No benchmarks yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first benchmark</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Create Benchmark</button>
            </div>
          )}
          {activeTab === "system" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold mb-4">Database Status</h3><div className="space-y-3"><div className="flex justify-between"><span className="text-sm text-gray-600">Connection</span><span className="text-sm font-medium text-green-600">✓ Connected</span></div><div className="flex justify-between"><span className="text-sm text-gray-600">Total Records</span><span className="text-sm font-medium">{stats?.total_users || 0}</span></div><div className="flex justify-between"><span className="text-sm text-gray-600">Database Size</span><span className="text-sm font-medium">24.5 MB</span></div></div></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><h3 className="text-lg font-semibold mb-4">Performance</h3><div className="space-y-3"><div className="flex justify-between"><span className="text-sm text-gray-600">Response Time</span><span className="text-sm font-medium text-green-600">142ms</span></div><div className="flex justify-between"><span className="text-sm text-gray-600">Uptime</span><span className="text-sm font-medium">99.9%</span></div><div className="flex justify-between"><span className="text-sm text-gray-600">Active Sessions</span><span className="text-sm font-medium text-yellow-600">23</span></div></div></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
