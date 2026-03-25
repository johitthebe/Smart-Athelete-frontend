"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

type Request = {
  id: number;
  coach: number;
  coach_name: string;
  coach_username: string;
  status: string;
  message: string;
  rejection_reason: string;
  requested_at: string;
  expires_at: string;
  responded_at: string | null;
  is_expired: boolean;
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/my-requests/`, {
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

  const handleCancel = async (requestId: number) => {
    if (!confirm("Cancel this request?")) return;

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/coach-requests/${requestId}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok || response.status === 204) {
        alert("Request cancelled");
        fetchRequests();
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  const getStatusBadge = (request: Request) => {
    if (request.status === 'pending') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
    } else if (request.status === 'accepted') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Accepted</span>;
    } else if (request.status === 'rejected') {
      return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Rejected</span>;
    } else if (request.status === 'expired') {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Expired</span>;
    } else if (request.status === 'cancelled') {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Cancelled</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Coach Requests</h1>
          <p className="text-gray-600 mt-1">Track your requests to coaches</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No requests yet</p>
            <a
              href="/dashboard/player/coaches"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              Browse Coaches
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{request.coach_name}</h3>
                      {getStatusBadge(request)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">@{request.coach_username}</p>
                    
                    {request.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>
                    )}

                    {request.status === 'rejected' && request.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-800">{request.rejection_reason}</p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
                      {request.status === 'pending' && (
                        <span>Expires: {new Date(request.expires_at).toLocaleDateString()}</span>
                      )}
                      {request.responded_at && (
                        <span>Responded: {new Date(request.responded_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(request.id)}
                      className="ml-4 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
