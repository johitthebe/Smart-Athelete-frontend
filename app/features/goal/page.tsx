"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "@/app/component/Navbar";
import Sidebar from "@/app/component/sidebar";
import { goalsAPI, benchmarksAPI, type Goal, type Benchmark } from "@/lib/api";
import CreateGoalModal from "./CreateGoalModal";

type BenchmarkType = "personal" | "coach" | "athlete";

function formatNumber(v: number) {
  return v.toFixed(1);
}

function GoalCard({ goal, onUpdate }: { goal: Goal; onUpdate: () => void }) {
  const [benchmarkType, setBenchmarkType] = useState<BenchmarkType>("personal");

  const { label, target, gap, gapLabel, progressPercent, status, statusClass } =
    useMemo(() => {
      const labelMap: Record<BenchmarkType, string> = {
        personal: "Personal target",
        coach: "Coach standard",
        athlete: "Athlete benchmark",
      };

      // For now, use the goal's target_value as the benchmark
      // In a real app, you might have different targets for different benchmark types
      const target = goal.target_value;

      const betterOrEqual = goal.current_value <= target;
      const diff = goal.current_value - target;
      const gapLabel =
        diff === 0
          ? "On target"
          : diff > 0
          ? `+${formatNumber(diff)} slower`
          : `-${formatNumber(Math.abs(diff))} faster`;

      let rawRatio = target / goal.current_value;
      if (!isFinite(rawRatio) || rawRatio < 0) rawRatio = 0;
      const progressPercent = Math.max(0, Math.min(100, rawRatio * 100));

      const diffPercent = ((goal.current_value - target) / target) * 100;
      let status = "On track";
      let statusClass =
        "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700";

      if (goal.status === 'completed') {
        status = "Completed";
        statusClass =
          "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700";
      } else if (betterOrEqual) {
        status = "Target achieved";
        statusClass =
          "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700";
      } else if (diffPercent <= 5) {
        status = "Near target";
        statusClass =
          "inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700";
      } else if (diffPercent <= 15) {
        status = "Needs improvement";
        statusClass =
          "inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700";
      } else {
        status = "Far from target";
        statusClass =
          "inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700";
      }

      return {
        label: labelMap[benchmarkType],
        target,
        gap: diff,
        gapLabel,
        progressPercent,
        status,
        statusClass,
      };
    }, [benchmarkType, goal]);

  const handleMarkCompleted = async () => {
    try {
      await goalsAPI.markCompleted(goal.id);
      onUpdate();
    } catch (error) {
      console.error("Error marking goal as completed:", error);
    }
  };

  const deadlineDate = new Date(goal.deadline);
  const today = new Date();
  const daysDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const overdueText = daysDiff < 0 
    ? `Overdue by ${Math.abs(daysDiff)} days`
    : daysDiff === 0 
    ? "Due today"
    : `${daysDiff} days remaining`;

  return (
    <section className="rounded-2xl bg-white border p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">{goal.event}</h2>
          <p className="text-xs text-gray-500">
            Comparing against: <span className="font-medium">{label}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <select
            value={benchmarkType}
            onChange={(e) => setBenchmarkType(e.target.value as BenchmarkType)}
            className="rounded-xl border bg-gray-50 px-3 py-1.5 text-xs text-gray-800"
          >
            <option value="personal">Personal target</option>
            <option value="coach">Coach standard</option>
            <option value="athlete">Athlete benchmark</option>
          </select>

          <span className={statusClass}>{status}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gray-900 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-800">
        <div>
          <p className="text-[11px] uppercase text-gray-500 mb-0.5">Current</p>
          <p className="font-semibold">{formatNumber(goal.current_value)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500 mb-0.5">Target</p>
          <p className="font-semibold">{formatNumber(target)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500 mb-0.5">Gap</p>
          <p
            className={`font-semibold ${
              gap <= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {gapLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium ${daysDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {overdueText}
        </p>
        
        {goal.status === 'active' && goal.current_value <= goal.target_value && (
          <button
            onClick={handleMarkCompleted}
            className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200"
          >
            Mark Complete
          </button>
        )}
      </div>
    </section>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsAPI.getAll();
      setGoals(data);
      setError("");
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to load goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6 space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading goals...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Goal Management
              </h1>
              <p className="text-sm text-gray-500">
                Set and track your performance goals.
              </p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              <span className="text-lg leading-none">+</span>
              Add New Goal
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {goals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No goals found. Create your first goal to get started!</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                <span className="text-lg leading-none">+</span>
                Add New Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={fetchGoals} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGoalCreated={fetchGoals}
      />
    </main>
  );
}