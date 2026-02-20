"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type Feedback = {
  id: number;
  coach_name: string;
  feedback_type: string;
  title: string;
  message: string;
  performance_log_details: {
    id: number;
    date: string;
    activity: string;
  } | null;
  goal_details: {
    id: number;
    name: string;
    progress: number;
  } | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export default function FeedbackPage() {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, [filter]);

  const fetchFeedback = async () => {
    try {
      const endpoint = filter === "unread" 
        ? `${API_BASE_URL}/api/performance/feedback/unread/`
        : `${API_BASE_URL}/api/performance/feedback/`;
      
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbackList(filter === "unread" ? data.feedback : data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (feedbackId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/performance/feedback/${feedbackId}/mark_read/`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchFeedback();
      }
    } catch (error) {
      console.error("Error marking feedback as read:", error);
    }
  };

  const openFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    if (!feedback.is_read) {
      markAsRead(feedback.id);
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-700",
      performance: "bg-green-100 text-green-700",
      goal: "bg-purple-100 text-purple-700",
      technique: "bg-orange-100 text-orange-700",
      motivation: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getFeedbackTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      general: "💬",
      performance: "📊",
      goal: "🎯",
      technique: "🔧",
      motivation: "💪",
    };
    return icons[type] || "📝";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = feedbackList.filter((f) => !f.is_read).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Coach Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">
          View feedback and guidance from your coaches
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            filter === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Feedback
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            filter === "unread"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading feedback...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && feedbackList.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900 mb-1">
            {filter === "unread" ? "No unread feedback" : "No feedback yet"}
          </p>
          <p className="text-sm text-gray-500">
            Your coaches will provide feedback on your performance here
          </p>
        </div>
      )}

      {/* Feedback List */}
      {!loading && feedbackList.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback List */}
          <div className="lg:col-span-1 space-y-3">
            {feedbackList.map((feedback) => (
              <div
                key={feedback.id}
                onClick={() => openFeedback(feedback)}
                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                  selectedFeedback?.id === feedback.id
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : feedback.is_read
                    ? "border-gray-100"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getFeedbackTypeIcon(feedback.feedback_type)}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{feedback.coach_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(feedback.created_at)}</p>
                    </div>
                  </div>
                  {!feedback.is_read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">{feedback.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{feedback.message}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getFeedbackTypeColor(
                    feedback.feedback_type
                  )}`}
                >
                  {feedback.feedback_type}
                </span>
              </div>
            ))}
          </div>

          {/* Feedback Detail */}
          <div className="lg:col-span-2">
            {selectedFeedback ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getFeedbackTypeIcon(selectedFeedback.feedback_type)}</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedFeedback.title}</h2>
                      <p className="text-sm text-gray-500">
                        From {selectedFeedback.coach_name} • {formatDate(selectedFeedback.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getFeedbackTypeColor(
                      selectedFeedback.feedback_type
                    )}`}
                  >
                    {selectedFeedback.feedback_type}
                  </span>
                </div>

                {/* Associated Goal or Performance Log */}
                {(selectedFeedback.goal_details || selectedFeedback.performance_log_details) && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    {selectedFeedback.goal_details && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-purple-600">🎯</span>
                        <span className="text-gray-700">
                          Related to goal: <strong>{selectedFeedback.goal_details.name}</strong> (
                          {selectedFeedback.goal_details.progress}% complete)
                        </span>
                      </div>
                    )}
                    {selectedFeedback.performance_log_details && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">📊</span>
                        <span className="text-gray-700">
                          Related to workout: <strong>{selectedFeedback.performance_log_details.activity}</strong> on{" "}
                          {new Date(selectedFeedback.performance_log_details.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Message */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>

                {/* Read Status */}
                {selectedFeedback.is_read && selectedFeedback.read_at && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Read on {formatDate(selectedFeedback.read_at)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <p className="text-base font-medium text-gray-900 mb-1">Select a feedback</p>
                <p className="text-sm text-gray-500">Click on a feedback item to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
