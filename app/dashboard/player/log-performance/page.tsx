"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { ensureCsrfToken, getFetchHeaders } from "@/lib/csrf";
import { useToast } from "@/app/component/ToastContainer";

type Goal = {
  id: number;
  name: string;
  status: string;
  activity_type: {
    id: number;
    name: string;
    icon: string;
  } | null;
};

type ActivityType = {
  id: number;
  name: string;
  icon: string;
  requires_distance: boolean;
  requires_duration: boolean;
};

export default function LogPerformancePage() {
  const router = useRouter();
  const toast = useToast();
  const [hasActiveGoals, setHasActiveGoals] = useState(false);
  const [checkingGoals, setCheckingGoals] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    goal_id: "",
    activity_type_id: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    distance: "",
    calories: "",
    intensity: "5",
    notes: "",
  });

  useEffect(() => {
    ensureCsrfToken();
    checkActiveGoals();
    fetchActivityTypes();
  }, []);

  const checkActiveGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/goals/check_active/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setHasActiveGoals(data.has_active_goals);

        if (data.has_active_goals) {
          fetchActiveGoals();
        }
      }
    } catch (err) {
      console.error("Error checking active goals:", err);
    } finally {
      setCheckingGoals(false);
    }
  };

  const fetchActiveGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/goals/active/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
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

  const handleActivityTypeChange = (activityTypeId: string) => {
    const activityType = activityTypes.find((at) => at.id === parseInt(activityTypeId));
    setSelectedActivityType(activityType || null);
    setFormData({ ...formData, activity_type_id: activityTypeId });
  };

  const handleGoalChange = (goalId: string) => {
    const selectedGoal = goals.find((g) => g.id === parseInt(goalId));
    
    // Auto-select activity type from goal if available
    if (selectedGoal && selectedGoal.activity_type) {
      const activityTypeId = selectedGoal.activity_type.id.toString();
      const activityType = activityTypes.find((at) => at.id === selectedGoal.activity_type!.id);
      setSelectedActivityType(activityType || null);
      setFormData({ 
        ...formData, 
        goal_id: goalId,
        activity_type_id: activityTypeId
      });
    } else {
      setFormData({ ...formData, goal_id: goalId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setSubmitting(true);

    try {
      const payload: any = {
        goal: parseInt(formData.goal_id),
        date: formData.date,
        intensity: parseInt(formData.intensity),
        notes: formData.notes,
      };

      if (formData.activity_type_id) {
        payload.activity_type_id = parseInt(formData.activity_type_id);
      }

      if (formData.duration) payload.duration = parseInt(formData.duration);
      if (formData.distance) payload.distance = parseFloat(formData.distance);
      if (formData.calories) payload.calories = parseInt(formData.calories);

      const response = await fetch(`${API_BASE_URL}/api/performance/performance-logs/`, {
        method: "POST",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Performance logged successfully! 🎉");
        setFormData({
          goal_id: formData.goal_id,
          activity_type_id: formData.activity_type_id,
          date: new Date().toISOString().split("T")[0],
          duration: "",
          distance: "",
          calories: "",
          intensity: "5",
          notes: "",
        });
      } else {
        toast.error(data.error || "Failed to log performance");
      }
    } catch (err) {
      toast.error("An error occurred while logging performance");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingGoals) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <p className="text-sm text-gray-500">Checking for active goals...</p>
      </div>
    );
  }

  if (!hasActiveGoals) {
    return (
      <div className="mx-auto w-full max-w-6xl px-8 py-6">
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Create a Goal First</h2>
          <p className="text-sm text-gray-600 mb-6">
            You need to create at least one active goal before you can log performance. Goals help
            you track your progress and stay motivated!
          </p>
          <button
            onClick={() => router.push("/dashboard/player/goals")}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Your First Goal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Log Performance</h1>
        <p className="text-sm text-gray-500 mt-1">Record your training activity</p>
      </header>

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

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Goal *</label>
              <select
                value={formData.goal_id}
                onChange={(e) => handleGoalChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                required
              >
                <option value="">Select a goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Activity Type {formData.activity_type_id && "(Auto-selected from goal)"}
              </label>
              <select
                value={formData.activity_type_id}
                onChange={(e) => handleActivityTypeChange(e.target.value)}
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder="e.g., 1800"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder="e.g., 5.0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder="e.g., 350"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Intensity (1-10)
              </label>
              <input
                type="number"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
              placeholder="How did it feel? Any observations..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? "Logging..." : "Log Performance"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/player")}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> At least one metric (distance, duration, or calories) is required.
          The date cannot be in the future.
        </p>
      </div>
    </div>
  );
}
