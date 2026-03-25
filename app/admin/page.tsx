"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/component/AdminNavbar";
import AdminSidebar from "@/app/component/adminsidebar";
import { API_BASE_URL } from "@/lib/config";

type Stats = {
  total_users: number;
  athletes: number;
  coaches: number;
  admins: number;
  pending_coaches: number;
};

type PendingCoach = {
  id: number;
  coach_name: string;
  coach_email: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [pendingCoaches, setPendingCoaches] = useState<PendingCoach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchAllStats();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.role !== "admin") router.push("/dashboard/player");
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      router.push("/auth/login");
    }
  };

  const fetchAllStats = async () => {
    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/users/stats/`, { credentials: "include" });
      if (statsRes.ok) setStats(await statsRes.json());

      const exercisesRes = await fetch(`${API_BASE_URL}/api/admin/activity-types/`, { credentials: "include" });
      if (exercisesRes.ok) {
        const exercises = await exercisesRes.json();
        setExerciseCount(exercises.length);
      }

      const goalsRes = await fetch(`${API_BASE_URL}/api/performance/goals/`, { credentials: "include" });
      if (goalsRes.ok) {
        const goals = await goalsRes.json();
        setGoalsCount(goals.length);
      }

      const coachesRes = await fetch(`${API_BASE_URL}/api/admin/coaches/pending/`, { credentials: "include" });
      if (coachesRes.ok) {
        const coaches = await coachesRes.json();
        setPendingCoaches(coaches.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <AdminNavbar />
          <div className="p-8">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <AdminNavbar />
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">System overview and statistics</p>
          </div>

          <div className="space-y-6">
            {/* Single Row Stats with Clickable Cards */}
            <div className="grid grid-cols-5 gap-4">
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</p>
              </button>

              <button
                onClick={() => router.push("/admin/users?role=athlete")}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Athletes</p>
                <p className="text-3xl font-bold text-green-600">{stats?.athletes || 0}</p>
              </button>

              <button
                onClick={() => router.push("/admin/users?role=coach")}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Coaches</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.coaches || 0}</p>
              </button>

              <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-indigo-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-indigo-600">{goalsCount}</p>
              </div>

              <button
                onClick={() => router.push("/admin/exercises")}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-lg transition-all cursor-pointer text-left"
              >
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Exercises</p>
                <p className="text-3xl font-bold text-cyan-600">{exerciseCount}</p>
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Pending Coaches */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Coaches</h2>
                  <button
                    onClick={() => router.push("/admin/coaches/pending")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All →
                  </button>
                </div>
                {pendingCoaches.length > 0 ? (
                  <div className="space-y-3">
                    {pendingCoaches.map((coach) => (
                      <div key={coach.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{coach.coach_name}</p>
                          <p className="text-xs text-gray-500">{coach.coach_email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push("/admin/coaches/pending")}
                            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => router.push("/admin/coaches/pending")}
                            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No pending coaches</p>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">New athlete registered</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Goal completed by athlete</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">New coach application</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Performance log added</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
