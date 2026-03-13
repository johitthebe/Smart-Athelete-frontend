"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    fetchSuggestions();
  }, [activeTab]);

  const fetchSuggestions = async () => {
    setLoading(true);

    try {
      if (activeTab === "goals") {
        const response = await fetch("/api/performance/ai/goal-suggestions/pending/", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setGoalSuggestions(data);
        }
      } else {
        // Fetch ALL workout suggestions (suggested + added_to_plan)
        const response = await fetch("/api/performance/ai/workout-suggestions/active/", {
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
      console.log("Calling API:", "/api/performance/ai/goal-suggestions/generate/");
      
      // Get CSRF token - fetch it first if not present
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        console.log("CSRF token not found, fetching...");
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      console.log("CSRF Token:", csrfToken ? "Present" : "Missing");
      
      const response = await fetch("/api/performance/ai/goal-suggestions/generate/", {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setGoalSuggestions(data.suggestions);
        alert("Successfully generated suggestions!");
      } else {
        alert(`Failed to generate suggestions. Error: ${data.detail || data.error || JSON.stringify(data)}`);
      }
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      alert(`Error: ${error.message}. Make sure you're logged in.`);
    } finally {
      setGenerating(false);
    }
  };

  const generateWorkoutSuggestions = async () => {
    setGenerating(true);

    try {
      console.log("Calling API:", "/api/performance/ai/workout-suggestions/generate/");
      
      // Get CSRF token - fetch it first if not present
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        console.log("CSRF token not found, fetching...");
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      console.log("CSRF Token:", csrfToken ? "Present" : "Missing");
      
      const response = await fetch("/api/performance/ai/workout-suggestions/generate/", {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setWorkoutSuggestions(data.suggestions);
        alert("Successfully generated suggestions!");
      } else {
        alert(`Failed to generate suggestions. Error: ${data.detail || data.error || JSON.stringify(data)}`);
      }
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      alert(`Error: ${error.message}. Make sure you're logged in.`);
    } finally {
      setGenerating(false);
    }
  };

  const acceptGoal = async (id: number) => {
    try {
      // Get CSRF token
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`/api/performance/ai/goal-suggestions/${id}/accept/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Goal accepted and added to your goals!");
        fetchSuggestions();
      } else {
        alert(`Error: ${data.error || JSON.stringify(data)}`);
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
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`/api/performance/ai/goal-suggestions/${id}/reject/`, {
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
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`/api/performance/ai/workout-suggestions/${id}/add_to_plan/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Workout added to your training plan!");
        fetchSuggestions();
      } else {
        alert(`Error: ${data.error || JSON.stringify(data)}`);
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
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }
      
      const response = await fetch(`/api/performance/ai/workout-suggestions/${id}/dismiss/`, {
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

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case "recovery": return "🧘";
      case "endurance": return "🏃";
      case "intervals": return "⚡";
      case "speed": return "🚀";
      default: return "💪";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Suggestions</h1>
          <p className="text-gray-600 mt-2">Personalized goals and workouts powered by Llama 3 8B</p>
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
            🎯 Goal Suggestions
          </button>
          <button
            onClick={() => setActiveTab("workouts")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "workouts"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            💪 Workout Suggestions
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
                        <p className="text-gray-600">⏱️ {suggestion.deadline_weeks} weeks</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700">💡 Why this goal?</p>
                        <p className="text-gray-600">{suggestion.reasoning}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">🏋️ Training Required</p>
                        <p className="text-gray-600">{suggestion.training_required}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">✨ Key Tip</p>
                        <p className="text-gray-600">{suggestion.key_tip}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => acceptGoal(suggestion.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        ✅ Accept Goal
                      </button>
                      <button
                        onClick={() => rejectGoal(suggestion.id)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        ❌ Not Interested
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 New Suggestions</h3>
                    <div className="grid gap-6">
                      {workoutSuggestions.filter(w => w.status === "suggested").map((suggestion) => (
                        <div key={suggestion.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{getWorkoutTypeIcon(suggestion.workout_type)}</span>
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
                              <p className="text-sm font-medium text-gray-700">📋 Description</p>
                              <p className="text-gray-600">{suggestion.description}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">💡 Why this workout?</p>
                              <p className="text-gray-600">{suggestion.reasoning}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">🎯 Benefit</p>
                              <p className="text-gray-600">{suggestion.benefit}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => addWorkoutToPlan(suggestion.id)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              ➕ Add to Plan
                            </button>
                            <button
                              onClick={() => dismissWorkout(suggestion.id)}
                              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                              ❌ Dismiss
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Your Training Plan</h3>
                    <div className="grid gap-6">
                      {workoutSuggestions.filter(w => w.status === "added_to_plan").map((suggestion) => (
                        <div key={suggestion.id} className="bg-green-50 border-2 border-green-200 rounded-lg shadow p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{getWorkoutTypeIcon(suggestion.workout_type)}</span>
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{suggestion.name}</h3>
                                  <p className="text-gray-600 text-sm">
                                    {suggestion.target_value}{suggestion.target_unit} • {suggestion.intensity} • {suggestion.estimated_duration} min
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
                              ✅ In Plan
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div>
                              <p className="text-sm font-medium text-gray-700">📋 Description</p>
                              <p className="text-gray-600">{suggestion.description}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">🎯 Benefit</p>
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
                            <p className="text-sm text-gray-600 flex items-center">
                              💡 Tip: Log this workout when you complete it!
                            </p>
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
