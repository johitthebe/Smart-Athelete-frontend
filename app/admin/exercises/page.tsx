"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/component/adminsidebar";
import AdminNavbar from "@/app/component/AdminNavbar";
import { API_BASE_URL } from "@/lib/config";
import { ensureCsrfToken, getFetchHeaders } from "@/lib/csrf";

type ActivityType = {
  id: number;
  name: string;
  icon: string;
  requires_distance: boolean;
  requires_duration: boolean;
  created_at: string;
};

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ActivityType | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    icon: "🏃",
    requires_distance: true,
    requires_duration: true,
  });

  const commonIcons = ["🏃", "🚴", "🏊", "🏋️", "⚽", "🏀", "🎾", "⛳", "🧘", "🥊", "🤸", "🏐", "🏈", "⚾"];

  useEffect(() => {
    ensureCsrfToken(); // Ensure CSRF token is available
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/activity-types/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (err) {
      console.error("Error fetching exercises:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const url = editingExercise
        ? `${API_BASE_URL}/api/admin/activity-types/${editingExercise.id}/`
        : `${API_BASE_URL}/api/admin/activity-types/`;

      const response = await fetch(url, {
        method: editingExercise ? "PUT" : "POST",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingExercise ? "Exercise updated successfully" : "Exercise created successfully");
        setShowForm(false);
        setEditingExercise(null);
        setFormData({
          name: "",
          icon: "🏃",
          requires_distance: true,
          requires_duration: true,
        });
        fetchExercises();
      } else {
        setError(data.error || data.name?.[0] || "Failed to save exercise");
      }
    } catch (err) {
      setError("An error occurred while saving");
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (exercise: ActivityType) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      icon: exercise.icon,
      requires_distance: exercise.requires_distance,
      requires_duration: exercise.requires_duration,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (exercise: ActivityType) => {
    if (!confirm(`Are you sure you want to delete "${exercise.name}"?`)) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/activity-types/${exercise.id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: getFetchHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Exercise deleted successfully");
        fetchExercises();
      } else {
        setError(data.error || "Failed to delete exercise");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExercise(null);
    setFormData({
      name: "",
      icon: "🏃",
      requires_distance: true,
      requires_duration: true,
    });
    setError("");
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
                <h1 className="text-xl font-semibold text-gray-900">Exercise Management</h1>
                <p className="text-sm text-gray-500">Manage exercises available for goals and performance logs</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Exercise
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

            {/* Exercises Grid */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : exercises.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No exercises yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first exercise
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="rounded-xl border p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{exercise.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                            <p className="text-xs text-gray-500">ID: {exercise.id}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className={exercise.requires_distance ? "text-green-600" : "text-gray-400"}>
                            {exercise.requires_distance ? "✓" : "✗"} Distance
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={exercise.requires_duration ? "text-green-600" : "text-gray-400"}>
                            {exercise.requires_duration ? "✓" : "✗"} Duration
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(exercise)}
                          className="flex-1 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          disabled={processing}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exercise)}
                          className="flex-1 rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          disabled={processing}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
              <h2 className="text-lg font-semibold text-gray-900">
                {editingExercise ? "Edit Exercise" : "Add New Exercise"}
              </h2>
              <button
                onClick={handleCancel}
                className="rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Running, Cycling, Swimming"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {commonIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 hover:border-blue-500 ${
                        formData.icon === icon ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Or enter custom emoji"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requires_distance}
                    onChange={(e) => setFormData({ ...formData, requires_distance: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Requires Distance</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requires_duration}
                    onChange={(e) => setFormData({ ...formData, requires_duration: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Requires Duration</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
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
                  {processing ? "Saving..." : editingExercise ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
