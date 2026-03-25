"use client";

import { useState, useEffect } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import { API_BASE_URL } from "@/lib/config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

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
};

type TimeRange = "week" | "month" | "year";

export default function PerformanceReportsPage() {
  const [logs, setLogs] = useState<PerformanceLog[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [showShareModal, setShowShareModal] = useState(false);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [shareForm, setShareForm] = useState({
    coach: "",
    title: "",
    athlete_notes: "",
  });

  useEffect(() => {
    fetchAnalytics();
    fetchCoaches();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      console.log("Fetching analytics for range:", timeRange);
      const response = await fetch(`${API_BASE_URL}/api/performance/analytics/?range=${timeRange}`, {
        credentials: "include",
      });
      
      console.log("Analytics response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Analytics data:", data);
        setAnalytics(data);
      } else {
        console.error("Failed to fetch analytics:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/reports/my_coaches/`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoaches(data);
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  const handleShareReport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/reports/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify({
          ...shareForm,
          time_range: timeRange,
          analytics_data: analytics,
        }),
      });

      if (response.ok) {
        alert("Report shared with coach successfully!");
        setShowShareModal(false);
        setShareForm({ coach: "", title: "", athlete_notes: "" });
      } else {
        const error = await response.json();
        alert(`Failed to share report: ${error.error || JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error("Error sharing report:", error);
      alert("Failed to share report");
    }
  };

  const getProgressData = () => {
    if (!analytics || !analytics.progress_data || analytics.progress_data.length === 0) {
      return { labels: [], data: [] };
    }

    try {
      const labels = analytics.progress_data.map((item: any) => {
        const date = new Date(item.date);
        if (timeRange === "week") {
          return date.toLocaleDateString("en-US", { weekday: "short" });
        } else if (timeRange === "month") {
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } else {
          return date.toLocaleDateString("en-US", { month: "short" });
        }
      });

      const data = analytics.progress_data.map((item: any) => item.value || 0);

      return { labels, data };
    } catch (error) {
      console.error("Error processing progress data:", error);
      return { labels: [], data: [] };
    }
  };

  const getMonthlyAverages = () => {
    if (!analytics || !analytics.progress_data || analytics.progress_data.length === 0) {
      return { labels: [], data: [] };
    }

    try {
      const monthlyData: { [key: string]: { total: number; count: number } } = {};

      analytics.progress_data.forEach((item: any) => {
        const month = new Date(item.date).toLocaleDateString("en-US", { month: "short" });
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, count: 0 };
        }
        monthlyData[month].total += item.value || 0;
        monthlyData[month].count += 1;
      });

      const labels = Object.keys(monthlyData);
      const data = labels.map((month) => 
        monthlyData[month].count > 0 
          ? monthlyData[month].total / monthlyData[month].count 
          : 0
      );

      return { labels, data };
    } catch (error) {
      console.error("Error processing monthly data:", error);
      return { labels: [], data: [] };
    }
  };

  const getActivityBreakdown = () => {
    if (!analytics || !analytics.activity_breakdown || analytics.activity_breakdown.length === 0) {
      return { labels: [], data: [] };
    }

    try {
      const activities = analytics.activity_breakdown.slice(0, 6);
      const labels = activities.map((a: any) => a.name || 'Unknown');
      const data = activities.map((a: any) => (a.avg_intensity || 0) * 10);

      return { labels, data };
    } catch (error) {
      console.error("Error processing activity data:", error);
      return { labels: [], data: [] };
    }
  };

  const insights = analytics ? {
    totalSessions: analytics.total_sessions,
    avgIntensity: analytics.avg_intensity,
    totalDistance: analytics.total_distance,
    improvement: analytics.improvement_rate,
  } : {
    totalSessions: 0,
    avgIntensity: 0,
    totalDistance: 0,
    improvement: 0,
  };

  const progressData = getProgressData();
  const monthlyData = getMonthlyAverages();
  const activityData = getActivityBreakdown();
  const hasData = analytics && analytics.total_sessions > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
            <p className="text-gray-600 mt-1">Visual analysis of your training progress</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              disabled={!hasData || coaches.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm"
            >
              📤 Share with Coach
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share Report with Coach</h2>
              <form onSubmit={handleShareReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Coach *
                  </label>
                  <select
                    value={shareForm.coach}
                    onChange={(e) => setShareForm({ ...shareForm, coach: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a coach</option>
                    {coaches.map((coach) => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name} (@{coach.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    value={shareForm.title}
                    onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., Monthly Progress Report"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Notes (Optional)
                  </label>
                  <textarea
                    value={shareForm.athlete_notes}
                    onChange={(e) => setShareForm({ ...shareForm, athlete_notes: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Add any comments or questions for your coach..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    Share Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading performance data...</p>
          </div>
        ) : !hasData ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">No performance data yet</p>
            <p className="text-gray-600">Start logging your workouts to see performance reports and insights.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{insights.totalSessions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Improvement</p>
                    <p className="text-2xl font-bold text-gray-900">{insights.improvement.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Avg Intensity</p>
                    <p className="text-2xl font-bold text-gray-900">{insights.avgIntensity.toFixed(1)}/10</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Distance</p>
                    <p className="text-2xl font-bold text-gray-900">{insights.totalDistance.toFixed(1)} km</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Progress Over Time</h2>
                <p className="text-sm text-gray-600">Track your performance improvement</p>
              </div>
              <div className="h-80">
                {progressData.labels.length > 0 ? (
                  <Line
                    data={{
                      labels: progressData.labels,
                      datasets: [
                        {
                          label: "Performance (km or minutes)",
                          data: progressData.data,
                          borderColor: "#2563eb",
                          backgroundColor: "rgba(37, 99, 235, 0.1)",
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.parsed.y.toFixed(2)} km/min`,
                          },
                        },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available for selected time range
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Averages</h2>
                <p className="text-sm text-gray-600">Compare your average performance across months</p>
              </div>
              <div className="h-80">
                {monthlyData.labels.length > 0 ? (
                  <Bar
                    data={{
                      labels: monthlyData.labels,
                      datasets: [
                        {
                          label: "Average Performance",
                          data: monthlyData.data,
                          backgroundColor: "#22c55e",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true, position: "top" },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No monthly data available
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Activity Analysis</h2>
                <p className="text-sm text-gray-600">Intensity breakdown by activity type</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-80">
                  {activityData.labels.length > 0 ? (
                    <Radar
                      data={{
                        labels: activityData.labels,
                        datasets: [
                          {
                            label: "Average Intensity",
                            data: activityData.data,
                            backgroundColor: "rgba(129, 140, 248, 0.2)",
                            borderColor: "#6366f1",
                            pointBackgroundColor: "#6366f1",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                        plugins: {
                          legend: { display: false },
                        },
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No activity data available
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {activityData.labels.map((label, i) => (
                    <div key={`activity-${i}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{label}</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {activityData.data[i].toFixed(1)}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="font-semibold text-blue-900 mb-2">Key Insights</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                  <li>You've completed {insights.totalSessions} training sessions in this period</li>
                  <li>Your performance has {insights.improvement >= 0 ? 'improved' : 'decreased'} by {Math.abs(insights.improvement).toFixed(1)}%</li>
                  <li>Average training intensity: {insights.avgIntensity.toFixed(1)}/10</li>
                  <li>Total distance covered: {insights.totalDistance.toFixed(1)} km</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
