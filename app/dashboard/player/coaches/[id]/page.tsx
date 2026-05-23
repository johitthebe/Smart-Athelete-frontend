"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/app/component/ToastContainer";

type Coach = {
  id: number;
  coach_name: string;
  email: string;
  bio: string;
  specializations: string[];
  accepting_requests: boolean;
  available_spots: number;
  rating: number;
  total_reviews: number;
  location: string;
  certifications: string[];
  total_athletes_coached: number;
  current_active_athletes: number;
  avg_improvement: string;
  availability: string;
  success_stories: string[];
};

type Review = {
  id: number;
  athlete_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export default function CoachPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const coachId = params.id as string;

  const [coach, setCoach] = useState<Coach | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCoachDetails();
    fetchReviews();
  }, [coachId]);

  const fetchCoachDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coaches/${coachId}/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCoach(data);
      } else {
        toast.error("Failed to load coach details");
      }
    } catch (error) {
      console.error("Error fetching coach:", error);
      toast.error("Error loading coach profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coaches/${coachId}/reviews/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.slice(0, 3)); // Show only 3 recent reviews
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleRequestCoach = async () => {
    if (!message.trim()) {
      toast.error("Please write a message to the coach");
      return;
    }

    setSubmitting(true);
    try {
      let csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];

      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({
          coach: coachId,
          message: message,
        }),
      });

      if (response.ok) {
        toast.success("Request sent successfully!");
        setShowRequestModal(false);
        setMessage("");
        router.push("/dashboard/player/my-requests");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Error sending request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading coach profile...</p>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Coach not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Coaches
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Coach Profile Preview</h1>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {coach.coach_name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{coach.coach_name}</h2>
              <p className="text-gray-600 mb-3">{coach.specializations?.[0] || "Professional Coach"}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(coach.rating || 4.8)}</div>
                <span className="text-sm font-medium text-gray-700">
                  {coach.rating || 4.8}/5
                </span>
                <span className="text-sm text-gray-500">
                  ({coach.total_reviews || 0} reviews)
                </span>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{coach.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>{coach.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Status */}
          <div className={`p-4 rounded-lg ${coach.accepting_requests ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{coach.accepting_requests ? '✅' : '❌'}</span>
                <span className={`font-medium ${coach.accepting_requests ? 'text-green-700' : 'text-red-700'}`}>
                  {coach.accepting_requests 
                    ? `Accepting Requests (${coach.available_spots || 0} spots available)`
                    : 'Not Accepting Requests'}
                </span>
              </div>
              {coach.accepting_requests && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                  Request Coach {coach.coach_name.split(' ')[0]} →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📖</span> ABOUT
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {coach.bio || "This coach hasn't added a bio yet."}
          </p>
        </div>

        {/* Certifications */}
        {coach.certifications && coach.certifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎓</span> CERTIFICATIONS
            </h3>
            <ul className="space-y-2">
              {coach.certifications.map((cert, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600">•</span>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> STATISTICS
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{coach.total_athletes_coached || 0}</p>
              <p className="text-sm text-gray-600">Athletes Coached</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{coach.current_active_athletes || 0}</p>
              <p className="text-sm text-gray-600">Currently Active</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{coach.avg_improvement || "N/A"}</p>
              <p className="text-sm text-gray-600">Avg Improvement</p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        {coach.specializations && coach.specializations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏃</span> SPECIALIZATIONS
            </h3>
            <ul className="space-y-2">
              {coach.specializations.map((spec, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600">•</span>
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💬</span> RECENT REVIEWS
            </h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="font-medium text-gray-900">{review.athlete_name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">&quot;{review.comment}&quot;</p>
                </div>
              ))}
            </div>
            {coach.total_reviews > 3 && (
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                View All {coach.total_reviews} Reviews →
              </button>
            )}
          </div>
        )}

        {/* Success Stories */}
        {coach.success_stories && coach.success_stories.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span> SUCCESS STORIES
            </h3>
            <ul className="space-y-2">
              {coach.success_stories.map((story, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-600">•</span>
                  {story}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Availability */}
        {coach.availability && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📅</span> AVAILABILITY
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{coach.availability}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {coach.accepting_requests && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Request Coach {coach.coach_name.split(' ')[0]}
            </button>
          )}
          <button
            onClick={() => window.location.href = `mailto:${coach.email}`}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Ask Question
          </button>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Request Coach {coach.coach_name}
            </h3>
            <p className="text-gray-600 mb-4">
              Write a message introducing yourself and explaining why you'd like to work with this coach.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in improving my running performance..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
              rows={5}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setMessage("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCoach}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
