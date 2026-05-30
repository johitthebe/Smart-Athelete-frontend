"use client";

import { useState, useEffect } from "react";
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
import { API_BASE_URL } from "@/lib/config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type PerformanceLog = {
  id: number;
  date: string;
  activity_type: { name: string; icon: string } | null;
  distance: number | null;
  duration: number | null;
  calories: number | null;
  intensity: number;
  value: number;
};

type ComparisonPeriod = "week" | "month" | "quarter" | "year";

export default function ActivityAnalysisPage() {
  const [logs, setLogs] = useState<PerformanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>("month");
  const [selectedMetric, setSelectedMetric] = useState<"distance" | "duration" | "intensity" | "calories">("distance");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/performance-logs/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const logsData = data.results || data;
        setLogs(logsData);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate period boundaries
  const getPeriodData = () => {
    const now = new Date();
    const periods: { current: PerformanceLog[]; previous: PerformanceLog[] } = {
      current: [],
      previous: [],
    };

    let currentStart: Date, previousStart: Date, previousEnd: Date;

    switch (comparisonPeriod) {
      case "week":
        currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousEnd = currentStart;
        break;
      case "month":
        currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        previousEnd = currentStart;
        break;
      case "quarter":
        currentStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        previousEnd = currentStart;
        break;
      case "year":
        currentStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        previousStart = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        previousEnd = currentStart;
        break;
    }

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate >= currentStart && logDate <= now) {
        periods.current.push(log);
      } else if (logDate >= previousStart && logDate < previousEnd) {
        periods.previous.push(log);
      }
    });

    return periods;
  };

  // Calculate statistics for a period
  const calculateStats = (logs: PerformanceLog[]) => {
    if (logs.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        avgIntensity: 0,
        avgDistance: 0,
        avgDuration: 0,
        avgCalories: 0,
      };
    }

    const totalDistance = logs.reduce((sum, log) => sum + (log.distance || 0), 0);
    const totalDuration = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const totalCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0);
    const totalIntensity = logs.reduce((sum, log) => sum + log.intensity, 0);

    return {
      totalSessions: logs.length,
      totalDistance: totalDistance,
      totalDuration: totalDuration,
      totalCalories: totalCalories,
      avgIntensity: totalIntensity / logs.length,
      avgDistance: totalDistance / logs.length,
      avgDuration: totalDuration / logs.length,
      avgCalories: totalCalories / logs.length,
    };
  };

  // Calculate improvement percentage
  const calculateImprovement = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const periodData = getPeriodData();
  const currentStats = calculateStats(periodData.current);
  const previousStats = calculateStats(periodData.previous);

  // Improvements
  const improvements = {
    sessions: calculateImprovement(currentStats.totalSessions, previousStats.totalSessions),
    distance: calculateImprovement(currentStats.totalDistance, previousStats.totalDistance),
    duration: calculateImprovement(currentStats.totalDuration, previousStats.totalDuration),
    calories: calculateImprovement(currentStats.totalCalories, previousStats.totalCalories),
    intensity: calculateImprovement(currentStats.avgIntensity, previousStats.avgIntensity),
  };

  // Trend Chart Data
  const getTrendChartData = () => {
    const currentLogs = periodData.current.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const previousLogs = periodData.previous.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = currentLogs.map((log) => new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }));

    const getValue = (log: PerformanceLog) => {
      switch (selectedMetric) {
        case "distance": return log.distance || 0;
        case "duration": return log.duration || 0;
        case "calories": return log.calories || 0;
        case "intensity": return log.intensity;
      }
    };

    return {
      labels,
      datasets: [
        {
          label: `Current ${comparisonPeriod}`,
          data: currentLogs.map(getValue),
          borderColor: "#2E6BE6",
          backgroundColor: "rgba(46, 107, 230, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: `Previous ${comparisonPeriod}`,
          data: previousLogs.slice(0, currentLogs.length).map(getValue),
          borderColor: "#64748B",
          backgroundColor: "rgba(100, 116, 139, 0.1)",
          tension: 0.4,
          fill: true,
          borderDash: [5, 5],
        },
      ],
    };
  };

  // Comparison Bar Chart
  const getComparisonBarData = () => {
    return {
      labels: ["Sessions", "Avg Distance", "Avg Duration", "Avg Intensity", "Avg Calories"],
      datasets: [
        {
          label: `Current ${comparisonPeriod}`,
          data: [
            currentStats.totalSessions,
            currentStats.avgDistance,
            currentStats.avgDuration / 60, // Convert to hours
            currentStats.avgIntensity,
            currentStats.avgCalories / 100, // Scale down
          ],
          backgroundColor: "#2E6BE6",
        },
        {
          label: `Previous ${comparisonPeriod}`,
          data: [
            previousStats.totalSessions,
            previousStats.avgDistance,
            previousStats.avgDuration / 60,
            previousStats.avgIntensity,
            previousStats.avgCalories / 100,
          ],
          backgroundColor: "#64748B",
        },
      ],
    };
  };

  // Activity Distribution
  const getActivityDistribution = () => {
    const activityCounts: { [key: string]: number } = {};
    periodData.current.forEach((log) => {
      const activity = log.activity_type?.name || "Other";
      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
    });

    return {
      labels: Object.keys(activityCounts),
      datasets: [
        {
          data: Object.values(activityCounts),
          backgroundColor: [
            "#2E6BE6",
            "#00C2A8",
            "#F59E0B",
            "#EF4444",
            "#10B981",
            "#8B5CF6",
          ],
        },
      ],
    };
  };

  // Performance Radar
  const getPerformanceRadar = () => {
    const normalize = (value: number, max: number) => (value / max) * 10;

    return {
      labels: ["Consistency", "Intensity", "Distance", "Duration", "Calories"],
      datasets: [
        {
          label: `Current ${comparisonPeriod}`,
          data: [
            normalize(currentStats.totalSessions, Math.max(currentStats.totalSessions, previousStats.totalSessions, 1)),
            currentStats.avgIntensity,
            normalize(currentStats.avgDistance, Math.max(currentStats.avgDistance, previousStats.avgDistance, 1)),
            normalize(currentStats.avgDuration, Math.max(currentStats.avgDuration, previousStats.avgDuration, 1)),
            normalize(currentStats.avgCalories, Math.max(currentStats.avgCalories, previousStats.avgCalories, 1)),
          ],
          backgroundColor: "rgba(46, 107, 230, 0.2)",
          borderColor: "#2E6BE6",
          pointBackgroundColor: "#2E6BE6",
        },
        {
          label: `Previous ${comparisonPeriod}`,
          data: [
            normalize(previousStats.totalSessions, Math.max(currentStats.totalSessions, previousStats.totalSessions, 1)),
            previousStats.avgIntensity,
            normalize(previousStats.avgDistance, Math.max(currentStats.avgDistance, previousStats.avgDistance, 1)),
            normalize(previousStats.avgDuration, Math.max(currentStats.avgDuration, previousStats.avgDuration, 1)),
            normalize(previousStats.avgCalories, Math.max(currentStats.avgCalories, previousStats.avgCalories, 1)),
          ],
          backgroundColor: "rgba(100, 116, 139, 0.2)",
          borderColor: "#64748B",
          pointBackgroundColor: "#64748B",
        },
      ],
    };
  };

  const getImprovementColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getImprovementIcon = (value: number) => {
    if (value > 0) return "↑";
    if (value < 0) return "↓";
    return "→";
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading activity analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          Compare your performance across different time periods
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comparison Period
          </label>
          <div className="flex gap-2">
            {(["week", "month", "quarter", "year"] as ComparisonPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setComparisonPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  comparisonPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric to Track
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="distance">Distance</option>
            <option value="duration">Duration</option>
            <option value="intensity">Intensity</option>
            <option value="calories">Calories</option>
          </select>
        </div>
      </div>

      {/* Improvement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Sessions", value: improvements.sessions, current: currentStats.totalSessions, previous: previousStats.totalSessions },
          { label: "Distance", value: improvements.distance, current: currentStats.totalDistance.toFixed(1), previous: previousStats.totalDistance.toFixed(1), unit: "km" },
          { label: "Duration", value: improvements.duration, current: (currentStats.totalDuration / 60).toFixed(1), previous: (previousStats.totalDuration / 60).toFixed(1), unit: "hrs" },
          { label: "Intensity", value: improvements.intensity, current: currentStats.avgIntensity.toFixed(1), previous: previousStats.avgIntensity.toFixed(1), unit: "/10" },
          { label: "Calories", value: improvements.calories, current: currentStats.totalCalories.toFixed(0), previous: previousStats.totalCalories.toFixed(0), unit: "kcal" },
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-2xl font-bold text-gray-900">{item.current}</p>
              {item.unit && <span className="text-xs text-gray-500">{item.unit}</span>}
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-semibold ${getImprovementColor(item.value)}`}>
                {getImprovementIcon(item.value)} {Math.abs(item.value).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">vs previous</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Was: {item.previous}{item.unit ? ` ${item.unit}` : ""}</p>
          </div>
        ))}
      </div>

      {/* Trend Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Trend: {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
        </h2>
        <div className="h-80">
          <Line
            data={getTrendChartData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: "top" },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      let label = context.dataset.label || "";
                      if (label) label += ": ";
                      label += context.parsed.y?.toFixed(2) ?? '0';
                      return label;
                    },
                  },
                },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Comparison Bar Chart & Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Period Comparison</h2>
          <div className="h-80">
            <Bar
              data={getComparisonBarData()}
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
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            <Doughnut
              data={getActivityDistribution()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "right" },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Performance Radar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Profile</h2>
        <div className="h-96 flex items-center justify-center">
          <Radar
            data={getPerformanceRadar()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: "top" },
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 10,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Key Insights</h2>
        <div className="space-y-3">
          {improvements.sessions > 10 && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-gray-900">Great Consistency!</p>
                <p className="text-sm text-gray-600">
                  You've increased your training sessions by {improvements.sessions.toFixed(1)}% compared to the previous {comparisonPeriod}.
                </p>
              </div>
            </div>
          )}
          {improvements.intensity > 5 && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-medium text-gray-900">Intensity Boost!</p>
                <p className="text-sm text-gray-600">
                  Your average intensity has improved by {improvements.intensity.toFixed(1)}%. Keep pushing!
                </p>
              </div>
            </div>
          )}
          {improvements.distance > 15 && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-medium text-gray-900">Distance Champion!</p>
                <p className="text-sm text-gray-600">
                  You've covered {improvements.distance.toFixed(1)}% more distance this {comparisonPeriod}!
                </p>
              </div>
            </div>
          )}
          {currentStats.totalSessions === 0 && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-medium text-gray-900">Start Logging!</p>
                <p className="text-sm text-gray-600">
                  Log your first performance to see detailed analytics and track your progress.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
