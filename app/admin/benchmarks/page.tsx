"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/component/adminsidebar";
import AdminNavbar from "@/app/component/AdminNavbar";
import { API_BASE_URL } from "@/lib/config";
import { ensureCsrfToken, getFetchHeaders } from "@/lib/csrf";

type Benchmark = {
  id: number;
  benchmark_type: string;
  athlete_name: string | null;
  event: string;
  level: string;
  benchmark_value: number;
  unit: string;
  description: string;
  created_at: string;
};

export default function AdminBenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState<Benchmark | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    benchmark_type: "general",
    athlete_name: "",
    event: "",
    level: "general",
    benchmark_value: "",
    unit: "seconds",
    description: "",
  });

  useEffect(() => {
    ensureCsrfToken();
    fetchBenchmarks();
  }, []);

  const fetchBenchmarks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/benchmarks/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setBenchmarks(data);
      }
    } catch (err) {
      console.error("Error fetching benchmarks:", err);
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
      const url = editingBenchmark
        ? `${API_BASE_URL}/api/admin/benchmarks/${editingBenchmark.id}/`
        : `${API_BASE_URL}/api/admin/benchmarks/`;

      const response = await fetch(url, {
        method: editingBenchmark ? "PUT" : "POST",
        credentials: "include",
        headers: getFetchHeaders(),
        body: JSON.stringify({
          ...formData,
          benchmark_value: parseFloat(formData.benchmark_value),
          athlete_name: formData.benchmark_type === "athlete" ? formData.athlete_name : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingBenchmark ? "Benchmark updated successfully" : "Benchmark created successfully");
        setShowForm(false);
        setEditingBenchmark(null);
        setFormData({
          benchmark_type: "general",
          athlete_name: "",
          event: "",
          level: "general",
          benchmark_value: "",
          unit: "seconds",
          description: "",
        });
        fetchBenchmarks();
      } else {
        setError(data.error || data.athlete_name?.[0] || data.event?.[0] || "Failed to save benchmark");
      }
    } catch (err) {
      setError("An error occurred while saving");
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (benchmark: Benchmark) => {
    setEditingBenchmark(benchmark);
    setFormData({
      benchmark_type: benchmark.benchmark_type,
      athlete_name: benchmark.athlete_name || "",
      event: benchmark.event,
      level: benchmark.level,
      benchmark_value: benchmark.benchmark_value.toString(),
      unit: benchmark.unit,
      description: benchmark.description || "",
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (benchmark: Benchmark) => {
    if (!confirm(`Delete benchmark: ${benchmark.event}?`)) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/benchmarks/${benchmark.id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: getFetchHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Benchmark deleted successfully");
        fetchBenchmarks();
      } else {
        setError(data.error || "Failed to delete benchmark");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBenchmark(null);
    setFormData({
      benchmark_type: "general",
      athlete_name: "",
      event: "",
      level: "general",
      benchmark_value: "",
      unit: "seconds",
      description: "",
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
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Benchmark Management</h1>
                <p className="text-sm text-gray-500">Manage performance benchmarks and athlete standards</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Benchmark
              </button>
            </header>

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

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : benchmarks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No benchmarks yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first benchmark
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Athlete/Level</th>
                        <th className="px-4 py-3 font-medium">Event</th>
                        <th className="px-4 py-3 font-medium">Value</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {benchmarks.map((benchmark) => (
                        <tr key={benchmark.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                benchmark.benchmark_type === "athlete"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {benchmark.benchmark_type === "athlete" ? "Athlete" : "General"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {benchmark.benchmark_type === "athlete" ? benchmark.athlete_name : benchmark.level}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{benchmark.event}</td>
                          <td className="px-4 py-3 text-gray-900 font-semibold">
                            {benchmark.benchmark_value} {benchmark.unit}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(benchmark)}
                                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                disabled={processing}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(benchmark)}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingBenchmark ? "Edit Benchmark" : "Add New Benchmark"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Benchmark Type *</label>
                <select
                  value={formData.benchmark_type}
                  onChange={(e) => setFormData({ ...formData, benchmark_type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="general">General Standard</option>
                  <option value="athlete">Athlete Benchmark</option>
                </select>
              </div>

              {formData.benchmark_type === "athlete" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Athlete Name *</label>
                  <input
                    type="text"
                    value={formData.athlete_name}
                    onChange={(e) => setFormData({ ...formData, athlete_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Cristiano Ronaldo, Usain Bolt"
                    required={formData.benchmark_type === "athlete"}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event *</label>
                <input
                  type="text"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 100m Sprint, Marathon"
                  required
                />
              </div>

              {formData.benchmark_type === "general" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., U18, Elite, Professional"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.benchmark_value}
                    onChange={(e) => setFormData({ ...formData, benchmark_value: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 9.58"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., seconds, km"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Additional context about this benchmark..."
                />
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
                  {processing ? "Saving..." : editingBenchmark ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
