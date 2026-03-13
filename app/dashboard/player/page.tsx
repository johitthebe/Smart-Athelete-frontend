"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type Goal = {
  id: number;
  name: string;
  description: string;
  target_value: number;
  current_value: number;
  target_unit: string;
  deadline: string;
  status: string;
  progress_percentage: number;
};

type PerformanceLog = {
  id: number;
  date: string;
  activity_type: {
    id: number;
    name: string;
    icon: string;
  } | null;
  event: string;
  distance: number | null;
  duration: number | null;
  calories: number | null;
  intensity: number;
  notes: string;
  goal: {
    id: number;
    name: string;
  } | null;
};

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [recentLogs, setRecentLogs] = useState<PerformanceLog[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchUserData();
    fetchAllData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchActiveGoals(),
      fetchRecentLogs(),
    ]);
    setStatsLoading(false);
  };

  const fetchActiveGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/goals/active/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setActiveGoals(data.slice(0, 3)); // Show only top 3
      }
    } catch (error) {
      console.error("Error fetching active goals:", error);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/performance-logs/?limit=5`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRecentLogs(data.results || data);
      }
    } catch (error) {
      console.error("Error fetching recent logs:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const displayName =
    (user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : user?.username) || "Player";

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      {/* Welcome Header */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName}! 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's your performance overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : activeGoals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : recentLogs.filter(log => {
                const logDate = new Date(log.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return logDate >= weekAgo;
              }).length}</p>
              <p className="text-xs text-green-600">performance logs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : recentLogs.length}</p>
              <p className="text-xs text-gray-500">recent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : activeGoals.filter(g => g.status === 'completed').length}</p>
              <p className="text-xs text-gray-500">goals achieved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Performance Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 flex items-center justify-between border-b">
            <h2 className="text-base font-semibold text-gray-900">Recent Performance Logs</h2>
            <button
              onClick={() => router.push("/dashboard/player/log-performance")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Performance
            </button>
          </div>
          {statsLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading logs...</p>
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">No performance logs yet</p>
              <p className="text-sm text-gray-500 mb-4">Start tracking your performance by logging your first workout.</p>
              <button
                onClick={() => router.push("/dashboard/player/log-performance")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Log Performance
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {recentLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                      {log.activity_type?.icon || '🏃'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{log.activity_type?.name || log.event || 'Activity'}</p>
                      <p className="text-sm text-gray-500">{formatDate(log.date)}</p>
                      {log.goal && <p className="text-xs text-blue-600">Goal: {log.goal.name}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    {log.distance && <p className="text-sm font-semibold text-gray-900">{log.distance} km</p>}
                    {log.duration && <p className="text-xs text-gray-500">{formatDuration(log.duration)}</p>}
                    {log.calories && <p className="text-xs text-orange-600">{log.calories} cal</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Goals Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 flex items-center justify-between border-b">
            <h2 className="text-base font-semibold text-gray-900">Active Goals</h2>
            <button
              onClick={() => router.push("/dashboard/player/goals")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>
          {statsLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading goals...</p>
            </div>
          ) : activeGoals.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">No active goals</p>
              <p className="text-sm text-gray-500 mb-4">Create your first goal.</p>
              <button
                onClick={() => router.push("/dashboard/player/goals")}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create your first goal
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded-full">
                      {Math.round(goal.progress_percentage)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{goal.description || 'No description'}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{goal.current_value} / {goal.target_value} {goal.target_unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">Deadline: {formatDate(goal.deadline)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
