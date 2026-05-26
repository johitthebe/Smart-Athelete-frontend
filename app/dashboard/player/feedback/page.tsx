"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useNotifications } from "@/app/context/NotificationContext";
import { useToast } from "@/app/component/ToastContainer";

type Feedback = {
  id: number;
  coach_name: string;
  feedback_type: string;
  title: string;
  message: string;
  is_read: boolean;
  is_acknowledged: boolean;
  read_at: string | null;
  acknowledged_at: string | null;
  rating: number | null;
  created_at: string;
  goal_details: {
    id: number;
    name: string;
    progress: number;
  } | null;
  performance_log_details: {
    id: number;
    date: string;
    activity: string;
  } | null;
};

export default function FeedbackPage() {
  const toast = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "unacknowledged">("all");
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const { refreshNotifications } = useNotifications();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/feedback/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (feedbackId: number) => {
    try {
      let csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];

      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/feedback/${feedbackId}/mark_read/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
      });

      if (response.ok) {
        toast.success("Feedback marked as read");
        fetchFeedback();
        refreshNotifications();
      } else {
        toast.error("Failed to mark feedback as read");
      }
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      toast.error("Failed to mark feedback as read");
    }
  };

  const markAllAsRead = async () => {
    const unreadCount = feedback.filter((f) => !f.is_read).length;
    
    if (unreadCount === 0) {
      toast.info("No unread feedback");
      return;
    }

    try {
      let csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];

      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/feedback/mark_all_read/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${data.count} feedback items marked as read! ✅`);
        fetchFeedback();
        refreshNotifications();
      } else {
        toast.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const acknowledgeFeedback = async (feedbackId: number) => {
    try {
      let csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];

      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/feedback/${feedbackId}/acknowledge/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ rating: rating > 0 ? rating : null }),
      });

      if (response.ok) {
        toast.success("Feedback acknowledged! 🎉");
        fetchFeedback();
        refreshNotifications();
        setSelectedFeedback(null);
        setRating(0);
      } else {
        toast.error("Failed to acknowledge feedback");
      }
    } catch (error) {
      console.error("Error acknowledging feedback:", error);
      toast.error("Failed to acknowledge feedback");
    }
  };

  const handleFeedbackClick = (fb: Feedback) => {
    setSelectedFeedback(fb);
    setRating(fb.rating || 0);
    if (!fb.is_read) {
      markAsRead(fb.id);
    }
  };

  const filteredFeedback = feedback.filter((fb) => {
    if (filter === "unread") return !fb.is_read;
    if (filter === "unacknowledged") return !fb.is_acknowledged;
    return true;
  });

  const getFeedbackTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-700",
      performance: "bg-blue-100 text-blue-700",
      goal: "bg-green-100 text-green-700",
      technique: "bg-purple-100 text-purple-700",
      motivation: "bg-orange-100 text-orange-700",
    };
    return colors[type] || colors.general;
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coach Feedback</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and acknowledge feedback from your coaches
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({feedback.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread ({feedback.filter((f) => !f.is_read).length})
          </button>
          <button
            onClick={() => setFilter("unacknowledged")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unacknowledged"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Needs Acknowledgment ({feedback.filter((f) => !f.is_acknowledged).length})
          </button>
        </div>
        
        {feedback.filter((f) => !f.is_read).length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
          >
            Mark All Read
          </button>
        )}
      </div>

      {filteredFeedback.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback yet</h3>
          <p className="text-gray-500">
            {filter === "all"
              ? "Your coaches haven't provided any feedback yet"
              : filter === "unread"
              ? "You've read all your feedback"
              : "You've acknowledged all your feedback"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feedback List */}
          <div className="space-y-3">
            {filteredFeedback.map((fb) => (
              <div
                key={fb.id}
                onClick={() => handleFeedbackClick(fb)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedFeedback?.id === fb.id
                    ? "border-blue-500 bg-blue-50"
                    : !fb.is_read
                    ? "border-blue-200 bg-blue-50/50 hover:bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{fb.title}</h3>
                      {!fb.is_read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">From: {fb.coach_name}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getFeedbackTypeColor(
                      fb.feedback_type
                    )}`}
                  >
                    {fb.feedback_type}
                  </span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{fb.message}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                  {fb.is_acknowledged && (
                    <span className="text-green-600 font-medium">✓ Acknowledged</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Detail */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            {selectedFeedback ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedFeedback.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      From: {selectedFeedback.coach_name}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded ${getFeedbackTypeColor(
                      selectedFeedback.feedback_type
                    )}`}
                  >
                    {selectedFeedback.feedback_type}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Received</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedFeedback.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedFeedback.goal_details && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 font-medium mb-1">Related Goal</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedFeedback.goal_details.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Progress: {selectedFeedback.goal_details.progress.toFixed(1)}%
                    </p>
                  </div>
                )}

                {selectedFeedback.performance_log_details && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-1">
                      Related Activity
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedFeedback.performance_log_details.activity}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(
                        selectedFeedback.performance_log_details.date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedFeedback.message}
                  </p>
                </div>

                {selectedFeedback.is_acknowledged ? (
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <svg
                      className="w-8 h-8 text-green-600 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-green-700">
                      Acknowledged on{" "}
                      {new Date(selectedFeedback.acknowledged_at!).toLocaleDateString()}
                    </p>
                    {selectedFeedback.rating && (
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <span className="text-sm text-green-700">Your rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= selectedFeedback.rating!
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate this feedback (optional)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <svg
                              className={`w-8 h-8 ${
                                star <= (hoveredStar || rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </button>
                        ))}
                        {rating > 0 && (
                          <button
                            type="button"
                            onClick={() => setRating(0)}
                            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {rating > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {rating === 1 && "Not helpful"}
                          {rating === 2 && "Somewhat helpful"}
                          {rating === 3 && "Helpful"}
                          {rating === 4 && "Very helpful"}
                          {rating === 5 && "Extremely helpful"}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => acknowledgeFeedback(selectedFeedback.id)}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                    >
                      Acknowledge Feedback
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Select a feedback to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
