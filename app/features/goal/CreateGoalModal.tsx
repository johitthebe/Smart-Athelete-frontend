"use client";

import { useState } from "react";
import { goalsAPI } from "@/lib/api";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void;
}

export default function CreateGoalModal({ isOpen, onClose, onGoalCreated }: CreateGoalModalProps) {
  const [event, setEvent] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await goalsAPI.create({
        event,
        target_value: parseFloat(targetValue),
        deadline,
      });

      // Reset form
      setEvent("");
      setTargetValue("");
      setDeadline("");
      
      onGoalCreated();
      onClose();
    } catch (err) {
      console.error("Error creating goal:", err);
      setError("Failed to create goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create New Goal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event/Exercise *
            </label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="e.g., 100m Sprint, 5K Run, Bench Press"
              className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Value *
            </label>
            <input
              type="number"
              step="0.01"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="e.g., 10.5 (seconds), 20 (minutes), 100 (kg)"
              className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline *
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Goal"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-full hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}