"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/app/component/ToastContainer";

type Request = {
  id: number;
  athlete: number;
  athlete_name: string;
  athlete_username: string;
  athlete_email: string;
  message: string;
  requested_at: string;
  expires_at: string;
};

export default function CoachPendingRequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/pending/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: number, athleteName: string) => {
    if (!confirm(`Accept ${athleteName} as your athlete?`)) return;

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/${requestId}/accept/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `${athleteName} accepted as your athlete! 🎉`);
        fetchRequests();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/${requestId}/reject/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (response.ok) {
        toast.success("Request rejected successfully");
        setRejecting(null);
        setRejectReason("");
        fetchRequests();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Requests</h1>
          <p className="text-gray-600 mt-1">Review and respond to athlete requests</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {request.athlete_name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.athlete_name}</h3>
                        <p className="text-sm text-gray-500">@{request.athlete_username}</p>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">{request.message}</p>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Expires: {new Date(request.expires_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id, request.athlete_name)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setRejecting(request.id)}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {rejecting === request.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (Optional)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Roster full, Different specialty needed..."
                      rows={3}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setRejecting(null);
                          setRejectReason("");
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
