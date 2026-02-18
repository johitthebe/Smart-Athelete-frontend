"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type BenchmarkComparison = {
  goal_id: number;
  goal_name: string;
  event: string;
  activity_type: string | null;
  target_value: number;
  current_value: number | null;
  best_value: number | null;
  progress_percentage: number;
  unit: string;
  benchmark: {
    value: number;
    level: string;
    athlete_name: string | null;
  } | null;
  users_beaten: number;
  total_competitors: number;
  status: string;
};

function fmt(value: number, unit: string): string {
  if (unit === "minutes") {
    const m = Math.floor(value);
    const s = Math.round((value - m) * 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  if (unit === "seconds") return `${value.toFixed(2)}s`;
  if (unit === "meters" || unit === "km") return `${value.toFixed(2)}${unit}`;
  return `${value} ${unit}`;
}

function gap(pb: number | null, target: number, unit: string): string {
  if (!pb) return "—";
  const diff = Math.abs(pb - target);
  if (pb <= target) return "✓ Beaten!";
  return `${fmt(diff, unit)} away`;
}

function getMotivationMessage(beaten: number, total: number): string {
  if (total === 0) return "Be the first to set a benchmark in this event!";
  const pct = Math.round((beaten / total) * 100);
  if (pct >= 90) return "Elite level! You're in the top 10% of all athletes.";
  if (pct >= 75) return "Outstanding! Most athletes haven't reached your level.";
  if (pct >= 50) return "Above average and still climbing. Keep pushing!";
  if (pct >= 25) return "Growing fast. Every session is making you stronger.";
  return "The journey starts here. Every rep counts!";
}


export default function BenchmarkPage() {
  const router = useRouter();
  const [comparisons, setComparisons] = useState<BenchmarkComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/benchmark-comparison/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setComparisons(data.comparisons || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = comparisons.filter(
    (c) =>
      c.goal_name.toLowerCase().includes(search.toLowerCase()) ||
      c.event.toLowerCase().includes(search.toLowerCase())
  );

  const totalBeaten = comparisons.reduce((sum, c) => sum + c.users_beaten, 0);
  const totalCompetitors = comparisons.reduce((sum, c) => sum + c.total_competitors, 0);
  const avgProgress =
    comparisons.length > 0
      ? comparisons.reduce((sum, c) => sum + c.progress_percentage, 0) / comparisons.length
      : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Benchmark Comparison</h1>
        <p className="text-sm text-gray-500 mt-1">
          Compare your performance with world records and track your progress
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-900">Privacy First</p>
            <p className="text-sm text-green-700 mt-1">
              You'll never see where others rank. We only show how many athletes you've surpassed — motivating without discouraging.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && comparisons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Athletes Surpassed</p>
                <p className="text-2xl font-bold text-gray-900">{totalBeaten}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Better Than</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCompetitors > 0 ? Math.round((totalBeaten / totalCompetitors) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">{comparisons.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search your goals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your benchmarks...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900 mb-1">
            {search ? `No goals found for "${search}"` : "No active goals with benchmarks yet"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Create a goal and link it to a benchmark to start comparing your performance
          </p>
          <button
            onClick={() => router.push("/dashboard/player/goals")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Benchmark Cards */}
      {!loading &&
        filtered.map((comparison) => {
          const isOpen = openCard === comparison.goal_id;
          const hasPB = comparison.best_value !== null;
          const motivation = getMotivationMessage(comparison.users_beaten, comparison.total_competitors);

          return (
            <div
              key={comparison.goal_id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setOpenCard(isOpen ? null : comparison.goal_id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{comparison.goal_name}</h3>
                    <p className="text-sm text-gray-500">{comparison.event}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasPB && comparison.benchmark && comparison.best_value! <= comparison.benchmark.value && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ✓ Record Beaten
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* World Record Info */}
                {comparison.benchmark && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏆</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                          {comparison.benchmark.level}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {comparison.benchmark.athlete_name || "Professional Standard"}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-yellow-600">
                        {fmt(comparison.benchmark.value, comparison.unit)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
                    <p className="text-xs text-gray-500 mb-1">
                      {comparison.benchmark ? "World Record" : "Target"}
                    </p>
                    <p className="text-base font-bold text-yellow-600">
                      {comparison.benchmark
                        ? fmt(comparison.benchmark.value, comparison.unit)
                        : fmt(comparison.target_value, comparison.unit)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                    <p className="text-xs text-gray-500 mb-1">Your Best</p>
                    <p className="text-base font-bold text-blue-600">
                      {hasPB ? fmt(comparison.best_value!, comparison.unit) : "—"}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                    <p className="text-xs text-gray-500 mb-1">Gap</p>
                    <p className="text-base font-bold text-green-600">
                      {comparison.benchmark
                        ? gap(comparison.best_value, comparison.benchmark.value, comparison.unit)
                        : gap(comparison.best_value, comparison.target_value, comparison.unit)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Progress to goal</span>
                    <span className="font-semibold text-blue-600">
                      {comparison.progress_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.min(comparison.progress_percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Users Beaten */}
                {comparison.total_competitors > 0 && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-900">
                        <strong>You've surpassed {comparison.users_beaten} athletes</strong> out of{" "}
                        {comparison.total_competitors} who track this event
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-4">
                  {/* Personal Progress */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">📈 Your Personal Progress</h4>
                    {hasPB ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 mb-1">Current</p>
                          <p className="text-lg font-bold text-gray-900">
                            {fmt(comparison.current_value || 0, comparison.unit)}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 mb-1">Personal Best</p>
                          <p className="text-lg font-bold text-blue-600">
                            {fmt(comparison.best_value!, comparison.unit)}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 mb-1">Goal</p>
                          <p className="text-lg font-bold text-yellow-600">
                            {fmt(comparison.target_value, comparison.unit)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Log your first workout to see your journey here!
                      </p>
                    )}
                  </div>

                  {/* Activity Stats */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">🔥 Your Activity</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{comparison.users_beaten}</p>
                        <p className="text-xs text-gray-500">Athletes surpassed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{comparison.total_competitors}</p>
                        <p className="text-xs text-gray-500">Total competitors</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(comparison.progress_percentage)}%
                        </p>
                        <p className="text-xs text-gray-500">Progress</p>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Info */}
                  {comparison.benchmark && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">📋 Benchmark Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Record Holder</span>
                          <span className="font-medium text-gray-900">
                            {comparison.benchmark.athlete_name || "Standard"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Level</span>
                          <span className="font-medium text-gray-900">{comparison.benchmark.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Record Value</span>
                          <span className="font-medium text-yellow-600">
                            {fmt(comparison.benchmark.value, comparison.unit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Athletes Tracking</span>
                          <span className="font-medium text-gray-900">
                            {comparison.total_competitors} athletes
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Motivation Message */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-900 italic">💬 {motivation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
