"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/component/adminsidebar";
import AdminNavbar from "@/app/component/AdminNavbar";
import { API_BASE_URL } from "@/lib/config";
import { ensureCsrfToken, getFetchHeaders } from "@/lib/csrf";

type Assignment = {
  id: number;
  coach: number;
  coach_name: string;
  coach_email: string;
  coach_username: string;
  athlete: number;
  athlete_name: string;
  athlete_email: string;
  athlete_username: string;
  assigned_by_name: string;
  assigned_at: string;
  is_active: boolean;
  notes: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
};

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [coaches, setCoaches] = useState<User[]>([]);
  const [athletes, setAthletes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    coach: "",
    athlete: "",
    notes: "",
  });

  useEffect(() => {
    ensureCsrfToken();
    fetchAssignments();
    fetchCoaches();
    fetchAthletes();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/assignments/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/?role=coach`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCoaches(data);
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
    }
  };

  const fetchAthletes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/?role=athlete`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAthletes(data);
      }
    } catch (err) {
      console.error("Error fetching athletes:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/assignments/`, {
        method: "POST",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Assignment created successfully");
        setShowForm(false);
        setFormData({ coach: "", athlete: "", notes: "" });
        fetchAssignments();
      } else {
        setError(data.error || data.non_field_errors?.[0] || "Failed to create assignment");
      }
    } catch (err) {
      setError("An error occurred while creating assignment");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleActive = async (assignment: Assignment) => {
    if (!confirm(`${assignment.is_active ? "Deactivate" : "Activate"} this assignment?`)) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/assignments/${assignment.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify({ is_active: !assignment.is_active }),
      });

      if (response.ok) {
        setSuccess(`Assignment ${assignment.is_active ? "deactivated" : "activated"} successfully`);
        fetchAssignments();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update assignment");
      }
    } catch (err) {
      setError("An error occurred while updating assignment");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (assignment: Assignment) => {
    if (!confirm(`Delete assignment: ${assignment.coach_name} → ${assignment.athlete_name}?`)) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/assignments/${assignment.id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: getFetchHeaders(),
      });

      if (response.ok) {
        setSuccess("Assignment deleted successfully");
        fetchAssignments();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete assignment");
      }
    } catch (err) {
      setError("An error occurred while deleting assignment");
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
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Coach-Athlete Assignments</h1>
                <p className="text-sm text-gray-500">Manage coach and athlete relationships</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + New Assignment
              </button>
            </header>

            {/* Success/Error Messages */}
            {success && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Assignments Table */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : assignments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No assignments yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first assignment
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Coach</th>
                        <th className="px-4 py-3 font-medium">Athlete</th>
                        <th className="px-4 py-3 font-medium">Assigned By</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{assignment.coach_name}</p>
                              <p className="text-xs text-gray-500">{assignment.coach_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{assignment.athlete_name}</p>
                              <p className="text-xs text-gray-500">{assignment.athlete_email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{assignment.assigned_by_name}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(assignment.assigned_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                assignment.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {assignment.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleToggleActive(assignment)}
                                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                disabled={processing}
                              >
                                {assignment.is_active ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => handleDelete(assignment)}
                                className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                                disabled={processing}
                              >
                                Delete
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">New Assignment</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coach *</label>
                <select
                  value={formData.coach}
                  onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a coach</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.first_name} {coach.last_name} ({coach.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Athlete *</label>
                <select
                  value={formData.athlete}
                  onChange={(e) => setFormData({ ...formData, athlete: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select an athlete</option>
                  {athletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.first_name} {athlete.last_name} ({athlete.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Optional notes about this assignment..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  disabled={processing}
                >
                  {processing ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
