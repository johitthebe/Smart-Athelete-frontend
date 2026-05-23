"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/component/AdminNavbar";
import AdminSidebar from "@/app/component/adminsidebar";
import { API_BASE_URL } from "@/lib/config";

type Activity = {
  id: number;
  user: {
    id: number;
    username: string;
    full_name: string;
    role: string;
  };
  action_type: string;
  action_label: string;
  description: string;
  metadata: any;
  created_at: string;
};

type Stats = {
  total_activities: number;
  by_type: { action_type: string; count: number }[];
  most_active_users: { user__username: string; user__role: string; count: number }[];
  goals_created: number;
  goals_completed: number;
  workouts_logged: number;
};

export default function ActivityTracking() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    action_type: "",
    days: "7",
    limit: "50",
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [filter]);

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

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.action_type) params.append("action_type", filter.action_type);
      params.append("days", filter.days);
      params.append("limit", filter.limit);

      const [activitiesRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/activities/feed/?${params}`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/auth/activities/stats/?days=${filter.days}`, { credentials: "include" }),
      ]);

      if (activitiesRes.ok) setActivities(await activitiesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Error fetching activity data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (actionType: string) => {
    if (actionType.includes("goal")) return "text-blue-700 bg-blue-50 border border-blue-100";
    if (actionType.includes("workout") || actionType.includes("performance")) return "text-green-700 bg-green-50 border border-green-100";
    if (actionType.includes("coach")) return "text-purple-700 bg-purple-50 border border-purple-100";
    if (actionType.includes("login") || actionType.includes("registered")) return "text-gray-700 bg-gray-50 border border-gray-200";
    return "text-indigo-700 bg-indigo-50 border border-indigo-100";
  };

  const getRoleColor = (role: string) => {
    if (role === "athlete") return "bg-green-100 text-green-700";
    if (role === "coach") return "bg-purple-100 text-purple-700";
    if (role === "admin") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <AdminNavbar />
          <div className="p-8">
            <p className="text-gray-500">Loading activity data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Activity Tracking</h1>
            <p className="text-sm text-gray-500">Monitor all user actions across the system</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#173B80" }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Total Activities</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: "#173B80" }}>{stats.total_activities}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Goals Created</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">{stats.goals_created}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats.goals_completed}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Workouts Logged</p>
                </div>
                <p className="text-3xl font-bold text-purple-600">{stats.workouts_logged}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                <select
                  value={filter.action_type}
                  onChange={(e) => setFilter({ ...filter, action_type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={{ focusRing: "2px solid #173B80" }}
                >
                  <option value="">All Actions</option>
                  <option value="goal_created">Goal Created</option>
                  <option value="goal_completed">Goal Completed</option>
                  <option value="workout_logged">Workout Logged</option>
                  <option value="performance_logged">Performance Logged</option>
                  <option value="user_registered">User Registered</option>
                  <option value="user_login">User Login</option>
                  <option value="coach_request_sent">Coach Request Sent</option>
                  <option value="coach_approved">Coach Approved</option>
                </select>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  value={filter.days}
                  onChange={(e) => setFilter({ ...filter, days: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                >
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
                <select
                  value={filter.limit}
                  onChange={(e) => setFilter({ ...filter, limit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time user actions across the platform</p>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getActionColor(activity.action_type)}`}>
                        {activity.action_label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <button
                            onClick={() => router.push(`/admin/users/${activity.user.id}`)}
                            className="font-semibold text-gray-900 hover:underline"
                            style={{ color: "#173B80" }}
                          >
                            {activity.user.full_name || activity.user.username}
                          </button>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(activity.user.role)}`}>
                            {activity.user.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        {Object.keys(activity.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              View metadata
                            </summary>
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3 font-mono">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </div>
                          </details>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{formatDate(activity.created_at)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 font-medium">No activities found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
