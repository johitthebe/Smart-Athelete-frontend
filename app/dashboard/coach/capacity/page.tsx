"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/app/component/ToastContainer";

type CapacityStatus = {
  accepting_requests: boolean;
  max_athletes: number | null;
  current_athletes: number;
  capacity_available: number | null;
  paused_at: string | null;
  pause_reason: string;
  pending_requests: number;
};

export default function CoachCapacityPage() {
  const toast = useToast();
  const [status, setStatus] = useState<CapacityStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pauseReason, setPauseReason] = useState("");
  const [showPauseModal, setShowPauseModal] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coaches/capacity-status/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coaches/pause-requests/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify({ reason: pauseReason }),
      });

      if (response.ok) {
        toast.success("New requests paused successfully! ⏸️");
        setShowPauseModal(false);
        setPauseReason("");
        fetchStatus();
      }
    } catch (error) {
      console.error("Error pausing:", error);
      toast.error("Failed to pause requests");
    }
  };

  const handleResume = async () => {
    if (!confirm("Resume accepting new athlete requests?")) return;

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coaches/resume-requests/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok) {
        toast.success("Now accepting requests! ✅");
        fetchStatus();
      }
    } catch (error) {
      console.error("Error resuming:", error);
      toast.error("Failed to resume requests");
    }
  };

  if (loading || !status) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Capacity Management</h1>
          <p className="text-gray-600 mt-1">Control your athlete capacity and availability</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium mb-1">Current Athletes</p>
              <p className="text-3xl font-bold text-blue-900">{status.current_athletes}</p>
              {status.max_athletes && (
                <p className="text-sm text-blue-600 mt-1">of {status.max_athletes} max</p>
              )}
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-purple-900">{status.pending_requests}</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium mb-1">Status</p>
              <p className="text-lg font-bold text-green-900">
                {status.accepting_requests ? "Accepting" : "Paused"}
              </p>
            </div>
          </div>

          {status.paused_at && status.pause_reason && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 mb-1">Paused Since:</p>
              <p className="text-sm text-yellow-800">{new Date(status.paused_at).toLocaleDateString()}</p>
              <p className="text-sm font-medium text-yellow-900 mt-2 mb-1">Reason:</p>
              <p className="text-sm text-yellow-800">{status.pause_reason}</p>
            </div>
          )}

          <div className="flex gap-3">
            {status.accepting_requests ? (
              <button
                onClick={() => setShowPauseModal(true)}
                className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
              >
                Pause New Requests
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Resume Accepting Requests
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• When accepting: You appear in athlete browse and can receive requests</li>
            <li>• When paused: Hidden from browse, existing athletes unchanged</li>
            <li>• Auto-pause: System pauses you when max capacity reached</li>
            <li>• Resume anytime: Turn accepting back on when ready</li>
          </ul>
        </div>

        {showPauseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pause New Requests</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={pauseReason}
                    onChange={(e) => setPauseReason(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., At comfortable capacity, Taking a break..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePause}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm"
                  >
                    Confirm Pause
                  </button>
                  <button
                    onClick={() => {
                      setShowPauseModal(false);
                      setPauseReason("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
