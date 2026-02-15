"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type Athlete = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

type Goal = {
  id: number;
  name: string;
  target_value: number;
  target_unit: string;
  current_value: number;
  status: string;
  progress: {
    percentage: number;
  };
  deadline: string;
};

type PerformanceLog = {
  id: number;
  date: string;
  activity_type: {
    name: string;
    icon: string;
  } | null;
  distance: number | null;
  duration: number | null;
  calories: number | null;
  intensity: number;
  notes: string;
};

export default function AthleteProfilePage() {
  const params = useParams();
  const router = useRouter();
  const athleteId = params.id;

  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recentLogs, setRecentLogs] = useState<PerformanceLog[]>([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    currentStreak: 0,
    avgSessionsPerWeek: 0,
    improvementRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchAthleteData();
  }, [athleteId]);

  const fetchAthleteData = async () => {
    try {
      // Fetch athlete info
      const athleteRes = await fetch(`${API_BASE_URL}/api/admin/users/${athleteId}/`, {
        credentials: "include",
      });
      if (athleteRes.ok) {
        const athleteData = await athleteRes.json();
        setAthlete(athleteData);
      }

      // Fetch athlete's goals
      const goalsRes = await fetch(`${API_BASE_URL}/api/performance/goals/?athlete=${athleteId}`, {
        credentials: "include",
      });
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      }

      // Fetch recent performance logs
      const logsRes = await fetch(
        `${API_BASE_URL}/api/performance/performance-logs/?athlete=${athleteId}&limit=5`,
        {
          credentials: "include",
        }
      );
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setRecentLogs(logsData);
      }

      // Calculate stats (mock data for now)
      setStats({
        totalWorkouts: 45,
        currentStreak: 12,
        avgSessionsPerWeek: 3.5,
        improvementRate: 8,
      });
    } catch (err) {
      console.error("Error fetching athlete data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    // TODO: Implement feedback API
    alert("Feedback sent successfully!");
    setFeedback("");
    setShowFeedbackForm(false);
  };

  const getIntensityStars = (intensity: number) => {
    return "⭐".repeat(Math.min(intensity, 5));
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <p className="text-sm text-gray-500">Loading athlete profile...</p>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <p className="text-sm text-red-600">Athlete not found</p>
      </div>
    );
  }

  const displayName = athlete.first_name || athlete.last_name
    ? `${athlete.first_name} ${athlete.last_name}`.trim()
    : athlete.username;

  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              🏃 {displayName} - Athlete Profile
            </h1>
            <p className="text-sm text-gray-500">{athlete.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Give Feedback
          </button>
          <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Message Athlete
          </button>
        </div>
      </div>

      {/* Feedback Form */}
      {showFeedbackForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Send Feedback</h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
            rows={4}
            placeholder="Write your feedback here..."
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSendFeedback}
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              Send Feedback
            </button>
            <button
              onClick={() => setShowFeedbackForm(false)}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">Total Workouts</p>
            <p className="text-2xl font-bold text-blue-900">{stats.totalWorkouts}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-green-900">{stats.currentStreak} days</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 mb-1">Avg Sessions/Week</p>
            <p className="text-2xl font-bold text-purple-900">{stats.avgSessionsPerWeek}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 mb-1">Improvement Rate</p>
            <p className="text-2xl font-bold text-orange-900">+{stats.improvementRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Goals */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            🎯 Active Goals ({activeGoals.length})
          </h2>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-gray-500">No active goals</p>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{goal.name}</h3>
                    <span className="text-xs font-medium text-blue-600">
                      {goal.progress.percentage.toFixed(0)}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(goal.progress.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {goal.current_value.toFixed(1)} / {goal.target_value} {goal.target_unit}
                    </span>
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Chart Placeholder */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">📊 Progress Chart</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 text-sm">
            Performance chart will be displayed here
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">📝 Recent Workouts</h2>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-gray-500">No workouts logged yet</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{log.activity_type?.icon || "🏃"}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      : {log.activity_type?.name || "Workout"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {log.distance && <span>{log.distance}km</span>}
                      {log.duration && <span>{formatDuration(log.duration)}</span>}
                      {log.calories && <span>{log.calories} kcal</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{getIntensityStars(log.intensity)}</p>
                  {log.notes && (
                    <p className="text-xs text-gray-500 max-w-xs truncate">{log.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coach Insights */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">💡 Coach Insights</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✅</span>
            <span className="text-gray-700">Consistent training pattern</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✅</span>
            <span className="text-gray-700">Good improvement trend over last month</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-gray-700">Consider adding more variety to workouts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-600">💡</span>
            <span className="text-gray-700">Recovery days are well-balanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
