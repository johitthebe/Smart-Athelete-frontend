"use client";

import { useState, useEffect } from "react";

type Benchmark = {
  id: number;
  event: string;
  gender: string;
  age_group: string;
  performance_level: string;
  benchmark_value: number;
  unit: string;
  description?: string;
  created_at: string;
};

export default function CoachBenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    event: "",
    gender: "male",
    age_group: "18-25",
    performance_level: "beginner",
    benchmark_value: "",
    unit: "minutes",
    description: "",
  });

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const fetchBenchmarks = async () => {
    try {
      const response = await fetch("/api/performance/benchmarks/", {
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
    setError("");
    setSuccess("");

    try {
      // Get CSRF token
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch("/api/performance/benchmarks/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({
          ...formData,
          benchmark_value: parseFloat(formData.benchmark_value),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Benchmark created successfully!");
        setShowCreateForm(false);
        setFormData({
          event: "",
          gender: "male",
          age_group: "18-25",
          performance_level: "beginner",
          benchmark_value: "",
          unit: "minutes",
          description: "",
        });
        fetchBenchmarks();
      } else {
        setError(data.error || data.detail || "Failed to create benchmark");
      }
    } catch (err: any) {
      setError("An error occurred: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this benchmark?")) return;

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`/api/performance/benchmarks/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
      });

      if (response.ok) {
        setSuccess("Benchmark deleted successfully");
        fetchBenchmarks();
      } else {
        setError("Failed to delete benchmark");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    }
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-blue-100 text-blue-700",
      advanced: "bg-purple-100 text-purple-700",
      elite: "bg-red-100 text-red-700",
    };
    return badges[level as keyof typeof badges] || badges.beginner;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Performance Benchmarks</h1>
          <p className="text-sm text-gray-500">Set performance standards for athletes</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          {showCreateForm ? "Cancel" : "+ Create Benchmark"}
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

      {showCreateForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Create New Benchmark</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Event *
                </label>
                <input
                  type="text"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="e.g., 5K Run, 10K Run, Marathon"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Age Group *
                </label>
                <select
                  value={formData.age_group}
                  onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  required
                >
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-55">46-55</option>
                  <option value="56+">56+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Performance Level *
                </label>
                <select
                  value={formData.performance_level}
                  onChange={(e) => setFormData({ ...formData, performance_level: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Benchmark Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.benchmark_value}
                  onChange={(e) => setFormData({ ...formData, benchmark_value: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="e.g., 25.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="e.g., minutes, km, mph"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder="Additional notes about this benchmark..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                Create Benchmark
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">All Benchmarks</h2>
          <p className="text-xs text-gray-500">
            {benchmarks.length} benchmark{benchmarks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : benchmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-4">No benchmarks yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              Create Your First Benchmark
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {benchmarks.map((benchmark) => (
              <div key={benchmark.id} className="border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{benchmark.event}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getLevelBadge(
                          benchmark.performance_level
                        )}`}
                      >
                        {benchmark.performance_level}
                      </span>
                    </div>
                    {benchmark.description && (
                      <p className="text-sm text-gray-600 mb-2">{benchmark.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Target: {benchmark.benchmark_value} {benchmark.unit}
                      </span>
                      <span>•</span>
                      <span>Gender: {benchmark.gender}</span>
                      <span>•</span>
                      <span>Age: {benchmark.age_group}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(benchmark.id)}
                    className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
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
  );
}
