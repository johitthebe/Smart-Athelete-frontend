"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/component/adminsidebar";
import AdminNavbar from "@/app/component/AdminNavbar";
import { API_BASE_URL } from "@/lib/config";
import { ensureCsrfToken, getFetchHeaders } from "@/lib/csrf";
import { useToast } from "@/app/component/ToastContainer";

type PendingCoach = {
  id: number;
  coach: number;
  coach_name: string;
  coach_email: string;
  coach_username: string;
  status: string;
  credential_count: number;
  created_at: string;
  credentials: Array<{
    id: number;
    credential_name: string;
    credential_type: string;
    issuing_organization: string;
    issue_date: string;
    file_url: string;
    uploaded_at: string;
  }>;
};

export default function PendingCoachesPage() {
  const toast = useToast();
  const [coaches, setCoaches] = useState<PendingCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState<PendingCoach | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    ensureCsrfToken();
    fetchPendingCoaches();
  }, []);

  const fetchPendingCoaches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/coaches/pending/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCoaches(data);
      }
    } catch (err) {
      console.error("Error fetching pending coaches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (coachId: number) => {
    if (!confirm("Are you sure you want to approve this coach?")) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/coaches/${coachId}/approve/`, {
        method: "POST",
        credentials: "include",
        headers: getFetchHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Coach approved successfully! ✅");
        setSelectedCoach(null);
        fetchPendingCoaches();
      } else {
        setError(data.error || "Failed to approve coach");
      }
    } catch (err) {
      setError("An error occurred while approving");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCoach) return;

    if (rejectionReason.trim().length < 20) {
      setError("Rejection reason must be at least 20 characters");
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/coaches/${selectedCoach.coach}/reject/`, {
        method: "POST",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Coach rejected successfully");
        setSelectedCoach(null);
        setShowRejectForm(false);
        setRejectionReason("");
        fetchPendingCoaches();
      } else {
        setError(data.error || "Failed to reject coach");
      }
    } catch (err) {
      setError("An error occurred while rejecting");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AdminNavbar />
        <div className="flex-1 mx-auto w-full max-w-7xl px-6 py-6 space-y-5">
          {/* Header */}
          <header>
            <h1 className="text-xl font-semibold text-gray-900">Pending Coach Applications</h1>
            <p className="text-sm text-gray-500">Review and approve coach credentials</p>
          </header>

          {/* Success/Error Messages */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Coaches List */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : coaches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No pending coach applications</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Coach Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Credentials</th>
                      <th className="px-4 py-3 font-medium">Submitted</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {coaches.map((coach) => (
                      <tr key={coach.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {coach.coach_name || coach.coach_username}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{coach.coach_email}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            {coach.credential_count} file{coach.credential_count !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(coach.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedCoach(coach)}
                              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Coach Detail Modal */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Coach Application</h2>
                <p className="text-sm text-gray-500">{selectedCoach.coach_name || selectedCoach.coach_username}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCoach(null);
                  setShowRejectForm(false);
                  setRejectionReason("");
                  setError("");
                }}
                className="rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Coach Info */}
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Coach Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedCoach.coach_name || selectedCoach.coach_username}</p>
                  <p><span className="font-medium">Email:</span> {selectedCoach.coach_email}</p>
                  <p><span className="font-medium">Username:</span> {selectedCoach.coach_username}</p>
                  <p><span className="font-medium">Applied:</span> {new Date(selectedCoach.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Credentials */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Uploaded Credentials ({selectedCoach.credential_count})</h3>
                <div className="space-y-2">
                  {selectedCoach.credentials.map((cred) => (
                    <div key={cred.id} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{cred.credential_name}</h4>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {cred.credential_type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{cred.issuing_organization}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Issued: {new Date(cred.issue_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={cred.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </a>
                          <a
                            href={cred.file_url}
                            download
                            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reject Form */}
              {showRejectForm && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                    rows={4}
                    placeholder="Enter reason for rejection (minimum 20 characters)..."
                  />
                  <p className="text-xs text-red-600 mt-1">
                    {rejectionReason.length}/20 characters minimum
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 flex gap-2 justify-end">
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    disabled={processing}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedCoach.coach)}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Approve Coach"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason("");
                    }}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    disabled={processing || rejectionReason.trim().length < 20}
                  >
                    {processing ? "Processing..." : "Confirm Rejection"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
