"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import SuccessToast from "@/app/component/SuccessToast";

interface GoalSuggestion {
  id: number;
  event: string;
  target_value: string;
  unit: string;
  deadline_weeks: number;
  difficulty_level: string;
  reasoning: string;
  training_required: string;
  key_tip: string;
  status: string;
  suggested_at: string;
}

interface WorkoutSuggestion {
  id: number;
  workout_type: string;
  name: string;
  description: string;
  target_value: string;
  target_unit: string;
  intensity: string;
  estimated_duration: number;
  reasoning: string;
  benefit: string;
  status: string;
  suggested_at: string;
}

export default function AISuggestionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"goals" | "workouts">("goals");
  const [goalSuggestions, setGoalSuggestions] = useState<GoalSuggestion[]>([]);
  const [workoutSuggestions, setWorkoutSuggestions] = useState<WorkoutSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    checkAuthAndFetch();
  }, [activeTab]);

  const checkAuthAndFetch = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" });
      if (!res.ok) {
        window.location.href = "/auth/login";
        return;
      }
      fetchSuggestions();
    } catch {
      window.location.href = "/auth/login";
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);

    try {
      if (activeTab === "goals") {
        const response = await fetch(`${API_BASE_URL}/api/performance/ai/goal-suggestions/pending/`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setGoalSuggestions(data);
        }
      } else {
        // Fetch ALL workout suggestions (suggested + added_to_plan)
        const response = await fetch(`${API_BASE_URL}/api/performance/ai/workout-suggestions/active/`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setWorkoutSuggestions(data);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateGoalSuggestions = async () => {
    setGenerating(true);
    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/performance/ai/goal-suggestions/generate/`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please log in again.");
        window.location.href = "/auth/login";
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        alert("Session expired. Please log in again.");
        window.location.href = "/auth/login";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setGoalSuggestions(data.suggestions);
      } else {
        alert(`Failed to generate suggestions: ${data.detail || data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      alert("Failed to generate suggestions. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const generateWorkoutSuggestions = async () => {
    setGenerating(true);
    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/performance/ai/workout-suggestions/generate/`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please log in again.");
        window.location.href = "/auth/login";
        return;
      }

      const contentType2 = response.headers.get("content-type");
      if (!contentType2 || !contentType2.includes("application/json")) {
        alert("Session expired. Please log in again.");
        window.location.href = "/auth/login";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setWorkoutSuggestions(data.suggestions);
      } else {
        alert(`Failed to generate suggestions: ${data.detail || data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      alert("Failed to generate suggestions. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const acceptGoal = async (id: number) => {
    try {
      // Get CSRF token
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/performance/ai/goal-suggestions/${id}/accept/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setToastMessage("Goal accepted and added to your goals!");
        setShowSuccessToast(true);
        fetchSuggestions();
      } else {
        alert(`Error: ${data.error || "Failed to accept goal"}`);
      }
    } catch (error) {
      console.error("Error accepting goal:", error);
      alert("Failed to accept goal. Check console for details.");
    }
  };

  const rejectGoal = async (id: number) => {
    try {
      // Get CSRF token
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/performance/ai/goal-suggestions/${id}/reject/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error("Error rejecting goal:", error);
    }
  };

  const addWorkoutToPlan = async (id: number) => {
    try {
      // Get CSRF token
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/performance/ai/workout-suggestions/${id}/add_to_plan/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setToastMessage("Workout added to your training plan!");
        setShowSuccessToast(true);
        fetchSuggestions();
      } else {
        alert(`Error: ${data.error || "Failed to add workout"}`);
      }
    } catch (error) {
      console.error("Error adding workout:", error);
      alert("Failed to add workout. Check console for details.");
    }
  };

  const dismissWorkout = async (id: number) => {
    try {
      // Get CSRF token
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`${API_BASE_URL}/api/performance/ai/workout-suggestions/${id}/dismiss/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok) {
        fetchSuggestions();
      }
    } catch (error) {
      console.error("Error dismissing workout:", error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "conservative": return "bg-green-100 text-green-800";
      case "recommended": return "bg-blue-100 text-blue-800";
      case "ambitious": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case "recovery": return "Recovery";
      case "endurance": return "Endurance";
      case "intervals": return "Intervals";
      case "speed": return "Speed";
      default: return "Workout";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Suggestions</h1>
          <p className="text-gray-600 mt-2">Personalized goals and workouts powered by Llama 3 8B</p>
        </div>

        {/* Quick Action: Log Performance */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Ready to train?</h3>
                <p className="text-blue-100 text-sm">Log your performance to get better AI suggestions</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard/player/log-performance")}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Log Performance</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("goals")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "goals"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Goal Suggestions
          </button>
          <button
            onClick={() => setActiveTab("workouts")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "workouts"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Workout Suggestions
          </button>
        </div>

        {activeTab === "goals" && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Goal Suggestions</h2>
                  <p className="text-gray-600 text-sm mt-1">AI analyzes your performance to suggest personalized goals</p>
                </div>
                <button
                  onClick={generateGoalSuggestions}
                  disabled={generating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {generating ? "Generating..." : "Generate Suggestions"}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading suggestions...</p>
              </div>
            ) : goalSuggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">No goal suggestions yet</p>
                <p className="text-gray-500 text-sm mt-2">Click "Generate New Suggestions" to get AI-powered goal recommendations</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {goalSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {suggestion.event}: {suggestion.target_value}{suggestion.unit}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(suggestion.difficulty_level)}`}>
                            {suggestion.difficulty_level}
                          </span>
                        </div>
                        <p className="text-gray-600">{suggestion.deadline_weeks} weeks</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Why this goal?</p>
                        <p className="text-gray-600">{suggestion.reasoning}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Training Required</p>
                        <p className="text-gray-600">{suggestion.training_required}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Key Tip</p>
                        <p className="text-gray-600">{suggestion.key_tip}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => acceptGoal(suggestion.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Accept Goal
                      </button>
                      <button
                        onClick={() => rejectGoal(suggestion.id)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Not Interested
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "workouts" && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Workout Suggestions</h2>
                  <p className="text-gray-600 text-sm mt-1">AI creates personalized workouts based on your training history</p>
                </div>
                <button
                  onClick={generateWorkoutSuggestions}
                  disabled={generating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {generating ? "Generating..." : "Generate Suggestions"}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading suggestions...</p>
              </div>
            ) : workoutSuggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">No workout suggestions yet</p>
                <p className="text-gray-500 text-sm mt-2">Click "Generate New Suggestions" to get AI-powered workout recommendations</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Suggested Workouts */}
                {workoutSuggestions.filter(w => w.status === "suggested").length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">New Suggestions</h3>
                    <div className="grid gap-6">
                      {workoutSuggestions.filter(w => w.status === "suggested").map((suggestion) => (
                        <div key={suggestion.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-500 uppercase">{getWorkoutTypeLabel(suggestion.workout_type)}</span>
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{suggestion.name}</h3>
                                  <p className="text-gray-600 text-sm">
                                    {suggestion.target_value}{suggestion.target_unit} • {suggestion.intensity} • {suggestion.estimated_duration} min
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {suggestion.workout_type}
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Description</p>
                              <p className="text-gray-600">{suggestion.description}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Why this workout?</p>
                              <p className="text-gray-600">{suggestion.reasoning}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Benefit</p>
                              <p className="text-gray-600">{suggestion.benefit}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => addWorkoutToPlan(suggestion.id)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Add to Plan
                            </button>
                            <button
                              onClick={() => dismissWorkout(suggestion.id)}
                              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Plan */}
                {workoutSuggestions.filter(w => w.status === "added_to_plan").length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Training Plan</h3>
                    <div className="grid gap-6">
                      {workoutSuggestions.filter(w => w.status === "added_to_plan").map((suggestion) => (
                        <div key={suggestion.id} className="bg-green-50 border-2 border-green-200 rounded-lg shadow p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-500 uppercase">{getWorkoutTypeLabel(suggestion.workout_type)}</span>
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{suggestion.name}</h3>
                                  <p className="text-gray-600 text-sm">
                                    {suggestion.target_value}{suggestion.target_unit} • {suggestion.intensity} • {suggestion.estimated_duration} min
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
                              In Plan
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Description</p>
                              <p className="text-gray-600">{suggestion.description}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Benefit</p>
                              <p className="text-gray-600">{suggestion.benefit}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => dismissWorkout(suggestion.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                            >
                              Remove from Plan
                            </button>
                            <button
                              onClick={() => router.push("/dashboard/player/log-performance")}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Log This Workout
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
