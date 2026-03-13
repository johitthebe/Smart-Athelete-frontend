"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { ensureCsrfToken, getFetchHeaders } from "@/lib/csrf";

type Goal = {
  id: number;
  name: string;
  description: string;
  target_metric: string;
  target_value: number;
  target_unit: string;
  current_value: number;
  deadline: string;
  status: string;
  activity_type: {
    id: number;
    name: string;
    icon: string;
  } | null;
  progress: {
    percentage: number;
    current_value: number;
    target_value: number;
    remaining: number;
  };
  log_count: number;
  created_at: string;
};

type ActivityType = {
  id: number;
  name: string;
  icon: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    activity_type_id: "",
    target_metric: "distance",
    target_value: "",
    target_unit: "km",
    deadline: "",
  });

  useEffect(() => {
    ensureCsrfToken();
    fetchGoals();
    fetchActivityTypes();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/goals/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/activity-types/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setActivityTypes(data);
      }
    } catch (err) {
      console.error("Error fetching activity types:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/goals/`, {
        method: "POST",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify({
          ...formData,
          target_value: parseFloat(formData.target_value),
          activity_type_id: formData.activity_type_id ? parseInt(formData.activity_type_id) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Goal created successfully!");
        setShowCreateForm(false);
        setFormData({
          name: "",
          description: "",
          activity_type_id: "",
          target_metric: "distance",
          target_value: "",
          target_unit: "km",
          deadline: "",
        });
        fetchGoals();
      } else {
        setError(data.error || Object.values(data).flat().join(", "));
      }
    } catch (err) {
      setError("An error occurred while creating the goal");
    }
  };

  const handleMarkComplete = async (goalId: number) => {
    if (!confirm("Mark this goal as complete?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/performance/goals/${goalId}/mark_completed/`,
        {
          method: "POST",
          credentials: "include",
          headers: getFetchHeaders(),
        }
      );

      if (response.ok) {
        setSuccess("Goal marked as complete!");
        fetchGoals();
      }
    } catch (err) {
      setError("Failed to mark goal as complete");
    }
  };

  const handleDelete = async (goalId: number) => {
    try {
      // First, check what will be deleted
      const checkResponse = await fetch(
        `${API_BASE_URL}/api/performance/goals/${goalId}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: getFetchHeaders(),
        }
      );

      const checkData = await checkResponse.json();

      if (!confirm(`${checkData.message}\n\nAre you sure?`)) return;

      // Proceed with deletion
      const response = await fetch(
        `${API_BASE_URL}/api/performance/goals/${goalId}/?confirm=true`,
        {
          method: "DELETE",
          credentials: "include",
          headers: getFetchHeaders(),
        }
      );

      if (response.ok) {
        setSuccess("Goal deleted successfully");
        fetchGoals();
      }
    } catch (err) {
      setError("Failed to delete goal");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      on_hold: "bg-yellow-100 text-yellow-700",
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
          <p className="text-sm text-gray-500 mt-1">Track your training objectives</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showCreateForm ? "Cancel" : "+ Create Goal"}
        </button>
      </header>

      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Goal Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder="e.g., Run 50km this month"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder="Describe your goal..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={formData.activity_type_id}
                  onChange={(e) => setFormData({ ...formData, activity_type_id: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                >
                  <option value="">Select activity type</option>
                  {activityTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Target Metric *
                </label>
                <select
                  value={formData.target_metric}
                  onChange={(e) => setFormData({ ...formData, target_metric: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  required
                >
                  <option value="distance">Distance</option>
                  <option value="duration">Duration</option>
                  <option value="calories">Calories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Target Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="e.g., 50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.target_unit}
                  onChange={(e) => setFormData({ ...formData, target_unit: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="e.g., km, minutes, kcal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Goals</h2>
          <p className="text-sm text-gray-500">
            {goals.length} goal{goals.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-900 mb-1">No goals yet</p>
            <p className="text-sm text-gray-500 mb-4">Create your first goal to start tracking your progress</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {goal.activity_type && (
                        <span className="text-lg">{goal.activity_type.icon}</span>
                      )}
                      <h3 className="font-medium text-gray-900">{goal.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(
                          goal.status
                        )}`}
                      >
                        {goal.status}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Target: {goal.target_value} {goal.target_unit}
                      </span>
                      <span>•</span>
                      <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{goal.log_count} logs</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {goal.status === "active" && (
                      <button
                        onClick={() => handleMarkComplete(goal.id)}
                        className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {goal.progress.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(goal.progress.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {goal.progress.current_value.toFixed(1)} / {goal.target_value} {goal.target_unit}
                    </span>
                    <span>{goal.progress.remaining.toFixed(1)} {goal.target_unit} remaining</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
