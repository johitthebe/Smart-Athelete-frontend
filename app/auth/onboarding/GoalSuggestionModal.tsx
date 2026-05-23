"use client";

import { useState } from "react";

interface GoalSuggestion {
  difficulty_level: string;
  event: string;
  target_value: number;
  unit: string;
  deadline_weeks: number;
  reasoning: string;
  training_required: string;
  key_tip: string;
}

interface GoalSuggestionModalProps {
  suggestions: GoalSuggestion[];
  onAccept: () => void;
  onSkip: () => void;
}

export default function GoalSuggestionModal({ suggestions, onAccept, onSkip }: GoalSuggestionModalProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalSuggestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "conservative":
        return "bg-green-100 text-green-800 border-green-300";
      case "recommended":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ambitious":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case "conservative":
        return "🟢 Conservative";
      case "recommended":
        return "⭐ Recommended";
      case "ambitious":
        return "🔥 Ambitious";
      default:
        return level;
    }
  };

  const handleAcceptGoal = async (goal: GoalSuggestion) => {
    setIsCreating(true);

    try {
      const csrfToken = getCookie("csrftoken");

      // Calculate deadline date
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + goal.deadline_weeks * 7);

      const goalData = {
        name: `${goal.event} Goal`,
        description: goal.reasoning,
        target_metric: goal.event,
        target_value: goal.target_value,
        target_unit: goal.unit,
        deadline: deadlineDate.toISOString().split("T")[0],
        status: "active",
      };

      console.log("Creating goal with data:", goalData);

      const response = await fetch("http://localhost:8000/api/performance/goals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify(goalData),
      });

      const responseData = await response.json();
      console.log("Goal creation response:", responseData);

      if (response.ok) {
        // Goal created successfully, redirect to dashboard
        console.log("Goal created successfully, redirecting to dashboard");
        onAccept();
      } else {
        console.error("Failed to create goal:", responseData);
        // Still redirect to dashboard even if goal creation fails
        alert("Goal creation failed, but you can create goals manually from your dashboard.");
        onAccept();
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      // Still redirect to dashboard even on network error
      alert("Network error creating goal, but you can create goals manually from your dashboard.");
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">🎯 Your Personalized Goal Suggestions</h2>
          <p className="text-gray-600 mt-2">
            Based on your profile, we've generated 3 goal options. Choose one to get started, or skip to set your own goals later.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedGoal === suggestion
                  ? "border-[#173B80] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedGoal(suggestion)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                      suggestion.difficulty_level
                    )}`}
                  >
                    {getDifficultyLabel(suggestion.difficulty_level)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {suggestion.target_value} {suggestion.unit}
                  </div>
                  <div className="text-sm text-gray-600">{suggestion.event}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">⏱️ Timeline:</span>
                  <span className="text-gray-600 ml-2">{suggestion.deadline_weeks} weeks</span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">💡 Why this goal:</span>
                  <p className="text-gray-600 mt-1">{suggestion.reasoning}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">📋 Training required:</span>
                  <p className="text-gray-600 mt-1">{suggestion.training_required}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <span className="font-medium text-yellow-800">💪 Key Tip:</span>
                  <p className="text-yellow-700 mt-1">{suggestion.key_tip}</p>
                </div>
              </div>

              {selectedGoal === suggestion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptGoal(suggestion);
                  }}
                  disabled={isCreating}
                  className="w-full mt-4 px-4 py-2 bg-[#173B80] text-white rounded-lg hover:bg-[#102a5a] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {isCreating ? "Creating Goal..." : "Accept This Goal"}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onSkip}
            disabled={isCreating}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip for Now - I'll Set My Own Goals
          </button>
        </div>
      </div>
    </div>
  );
}
