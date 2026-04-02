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
  activity_type: { id: number; name: string; icon: string } | null;
  event: string;
  distance: number | null;
  duration: number | null;
  calories: number | null;
  intensity: number;
  notes: string;
  goal: { id: number; name: string } | null;
};

type Stats = {
  total_logs: number;
  total_distance: number;
  completed_goals: number;
  this_week_logs: number;
};

const statCards = (stats: Stats, activeGoals: Goal[], loading: boolean) => [
  {
    label: "Active Goals",
    value: loading ? "—" : String(activeGoals.length),
    sub: "in progress",
    iconClass: "stat-icon-navy",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "This Week",
    value: loading ? "—" : String(stats.this_week_logs),
    sub: "sessions logged",
    iconClass: "stat-icon-teal",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    label: "Total Distance",
    value: loading ? "—" : String(stats.total_distance),
    sub: "km all time",
    iconClass: "stat-icon-electric",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    label: "Goals Completed",
    value: loading ? "—" : String(stats.completed_goals),
    sub: "all time",
    iconClass: "stat-icon-success",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [recentLogs, setRecentLogs] = useState<PerformanceLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_logs: 0,
    total_distance: 0,
    completed_goals: 0,
    this_week_logs: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchUserData();
    fetchAllData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchActiveGoals(), fetchRecentLogs(), fetchStats()]);
    setStatsLoading(false);
  };

  const fetchStats = async () => {
    try {
      const [logsRes, goalsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/performance/performance-logs/`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/performance/goals/`, { credentials: "include" }),
      ]);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (logsRes.ok) {
        const data = await logsRes.json();
        const all: PerformanceLog[] = data.results || data;
        const totalDist = all.reduce((s, l) => s + (l.distance || 0), 0);
        const thisWeek = all.filter((l) => new Date(l.date) >= weekAgo).length;
        setStats((p) => ({ ...p, total_logs: all.length, total_distance: Math.round(totalDist * 10) / 10, this_week_logs: thisWeek }));
      }
      if (goalsRes.ok) {
        const data = await goalsRes.json();
        const all = data.results || data;
        setStats((p) => ({ ...p, completed_goals: all.filter((g: Goal) => g.status === "completed").length }));
      }
    } catch (e) {
      console.error("fetchStats error:", e);
    }
  };

  const fetchActiveGoals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance/goals/active/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setActiveGoals(data.slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance/performance-logs/?limit=5`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRecentLogs(data.results || data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatDuration = (s: number | null) => {
    if (!s) return "N/A";
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  const displayName =
    (user?.first_name || user?.last_name
      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
      : user?.username) || "Player";

  const cards = statCards(stats, activeGoals, statsLoading);

  return (
    <div
      className="mx-auto w-full max-w-7xl px-6 py-6 space-y-6"
      style={{ background: "var(--color-ice)", minHeight: "100vh" }}
    >
      {/* ── Welcome Header ───────────────────────────────────── */}
      <div
        className="rounded-xl px-7 py-5 flex items-center justify-between"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-slate)" }}>
            Here's your performance overview for today.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/player/log-performance")}
          className="btn btn-secondary btn-sm hidden sm:flex"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Performance
        </button>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card-stat">
            <div className="flex items-center gap-3 mb-3">
              <div className={`stat-icon ${c.iconClass}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={c.icon} />
                </svg>
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--color-slate)" }}>{c.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--color-ink)" }}>{c.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-slate-light)" }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Performance Logs */}
        <div
          className="lg:col-span-2"
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
              Recent Performance Logs
            </h2>
            <button
              onClick={() => router.push("/dashboard/player/log-performance")}
              className="btn btn-secondary btn-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Performance
            </button>
          </div>

          {/* Body */}
          {statsLoading ? (
            <div className="p-12 flex flex-col items-center gap-3">
              <div className="spinner spinner-lg" />
              <p className="text-sm" style={{ color: "var(--color-slate)" }}>Loading logs…</p>
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--color-ice)" }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-slate-light)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>No performance logs yet</p>
              <p className="text-sm mb-4" style={{ color: "var(--color-slate)" }}>Start tracking by logging your first workout.</p>
              <button
                onClick={() => router.push("/dashboard/player/log-performance")}
                className="btn btn-secondary btn-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Log Performance
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {recentLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg transition-all duration-150 cursor-default"
                  style={{ background: "var(--color-ice)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--color-navy-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--color-ice)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-electric-light)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-electric-dark)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                        {log.activity_type?.name || log.event || "Activity"}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-slate)" }}>{formatDate(log.date)}</p>
                      {log.goal && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-electric)" }}>
                          Goal: {log.goal.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {log.distance && (
                      <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{log.distance} km</p>
                    )}
                    {log.duration && (
                      <p className="text-xs" style={{ color: "var(--color-slate)" }}>{formatDuration(log.duration)}</p>
                    )}
                    {log.calories && (
                      <p className="text-xs font-medium" style={{ color: "var(--color-warning-dark)" }}>{log.calories} cal</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>Active Goals</h2>
            <button
              onClick={() => router.push("/dashboard/player/goals")}
              className="text-xs font-semibold transition-colors"
              style={{ color: "var(--color-electric)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-electric-dark)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-electric)")}
            >
              View all →
            </button>
          </div>

          {/* Body */}
          {statsLoading ? (
            <div className="p-12 flex flex-col items-center gap-3">
              <div className="spinner spinner-lg" />
              <p className="text-sm" style={{ color: "var(--color-slate)" }}>Loading goals…</p>
            </div>
          ) : activeGoals.length === 0 ? (
            <div className="p-10 flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--color-ice)" }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--color-slate-light)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>No active goals</p>
              <p className="text-xs mb-4" style={{ color: "var(--color-slate)" }}>Create your first goal to get started.</p>
              <button
                onClick={() => router.push("/dashboard/player/goals")}
                className="btn btn-primary btn-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create goal
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {activeGoals.map((goal) => {
                const pct = Math.min(goal.progress_percentage, 100);
                const fillClass =
                  pct < 33 ? "progress-fill-error" : pct < 67 ? "progress-fill-warning" : "progress-fill-success";

                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-lg"
                    style={{
                      background: "var(--color-ice)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
                        {goal.name}
                      </h3>
                      <span
                        className="badge badge-navy ml-2 flex-shrink-0"
                        style={{ fontSize: "10px" }}
                      >
                        {Math.round(pct)}%
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--color-slate)" }}>
                        {goal.description}
                      </p>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs" style={{ color: "var(--color-slate)" }}>
                        <span>Progress</span>
                        <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                          {goal.current_value} / {goal.target_value} {goal.target_unit}
                        </span>
                      </div>
                      {/* Progress track */}
                      <div
                        className="progress-track"
                        style={{ background: "var(--color-border)" }}
                      >
                        <div
                          className={`progress-fill ${fillClass}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[10px]" style={{ color: "var(--color-slate-light)" }}>
                        Deadline: {formatDate(goal.deadline)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
