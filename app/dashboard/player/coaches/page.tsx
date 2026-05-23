"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type Coach = {
  id: number;
  coach_name: string;
  username: string;
  email: string;
  athlete_count: number;
  capacity_available: boolean;
  max_athletes: number | null;
};

export default function BrowseCoachesPage() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCoaches();
  }, [search]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/auth/coaches/available/${search ? `?search=${search}` : ''}`;
      const response = await fetch(url, { credentials: "include" });
      
      if (response.ok) {
        const data = await response.json();
        setCoaches(data.coaches);
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify({
          coach: selectedCoach.id,
          message: message
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || `Request sent to ${selectedCoach.coach_name}!`);
        setShowModal(false);
        setMessage("");
        setSelectedCoach(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Coaches</h1>
          <p className="text-gray-600 mt-1">Find and request a coach to guide your training</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coaches by name..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading coaches...</p>
          </div>
        ) : coaches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No coaches available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches.map((coach) => (
              <div key={coach.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {coach.coach_name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{coach.coach_name}</h3>
                    <p className="text-sm text-gray-500">@{coach.username}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Athletes:</span>
                    <span className="font-medium text-gray-900">
                      {coach.athlete_count}{coach.max_athletes ? ` / ${coach.max_athletes}` : ''}
                    </span>
                  </div>
                  {coach.capacity_available ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Accepting Requests
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      At Capacity
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/player/coaches/${coach.id}`)}
                    className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-sm"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCoach(coach);
                      setShowModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedCoach && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Request {selectedCoach.coach_name}
              </h2>
              <form onSubmit={handleRequestCoach} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Introduce yourself and explain your goals..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{message.length}/500</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    Send Request
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setMessage("");
                      setSelectedCoach(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
