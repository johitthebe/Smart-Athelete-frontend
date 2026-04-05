"use client";

import { useState, useEffect } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import { API_BASE_URL } from "@/lib/config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

type Report = {
  id: number;
  athlete: number;
  athlete_name: string;
  title: string;
  time_range: string;
  analytics_data: any;
  athlete_notes: string;
  status: string;
  coach_feedback: string;
  submitted_at: string;
  reviewed_at: string | null;
};

export default function CoachReportsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "pending" 
        ? `${API_BASE_URL}/api/performance/reports/pending/`
        : `${API_BASE_URL}/api/performance/reports/reviewed/`;
      
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGiveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/reports/${selectedReport.id}/give_feedback/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify({ feedback: feedbackText }),
      });

      if (response.ok) {
        alert("Feedback sent successfully!");
        setFeedbackText("");
        setSelectedReport(null);
        fetchReports();
      } else {
        const error = await response.json();
        alert(`Failed to send feedback: ${error.error || JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("Failed to send feedback");
    }
  };

  const handleMarkReviewed = async (reportId: number) => {
    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/reports/${reportId}/mark_reviewed/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error("Error marking as reviewed:", error);
    }
  };

  const getProgressChartData = (analytics: any) => {
    if (!analytics || !analytics.progress_data || analytics.progress_data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = analytics.progress_data.map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });

    return {
      labels,
      datasets: [
        {
          label: "Performance",
          data: analytics.progress_data.map((item: any) => item.value || 0),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Athlete Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Review performance reports submitted by your athletes</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => { setActiveTab("pending"); setSelectedReport(null); }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Pending Review ({reports.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => { setActiveTab("reviewed"); setSelectedReport(null); }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "reviewed"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Reviewed
        </button>
      </div>

      {/* Content */}
      {selectedReport ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedReport(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to reports
          </button>

          {/* Report Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  From: {selectedReport.athlete_name} • {new Date(selectedReport.submitted_at).toLocaleDateString()}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {selectedReport.time_range}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                selectedReport.status === 'feedback_given' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {selectedReport.status.replace('_', ' ')}
              </span>
            </div>

            {selectedReport.athlete_notes && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Athlete's Notes:</p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{selectedReport.athlete_notes}</p>
              </div>
            )}
          </div>

          {/* Analytics Data */}
          {selectedReport.analytics_data && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedReport.analytics_data.total_sessions || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Improvement</p>
                  <p className="text-2xl font-bold text-gray-900">{(selectedReport.analytics_data.improvement_rate || 0).toFixed(1)}%</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Avg Intensity</p>
                  <p className="text-2xl font-bold text-gray-900">{(selectedReport.analytics_data.avg_intensity || 0).toFixed(1)}/10</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Total Distance</p>
                  <p className="text-2xl font-bold text-gray-900">{(selectedReport.analytics_data.total_distance || 0).toFixed(1)} km</p>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
                <div className="h-80">
                  <Line
                    data={getProgressChartData(selectedReport.analytics_data)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: true, position: "top" } },
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Feedback Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Feedback</h3>
            
            {selectedReport.coach_feedback ? (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 whitespace-pre-wrap">{selectedReport.coach_feedback}</p>
                <p className="text-xs text-green-600 mt-2">
                  Reviewed on {selectedReport.reviewed_at ? new Date(selectedReport.reviewed_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleGiveFeedback} className="space-y-4">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Provide detailed feedback on the athlete's performance..."
                  rows={6}
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    Send Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(selectedReport.id)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Mark as Reviewed (No Feedback)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              {activeTab === "pending" ? "Pending Reports" : "Reviewed Reports"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{reports.length} report{reports.length !== 1 ? "s" : ""}</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">No reports yet</p>
              <p className="text-sm text-gray-500">
                {activeTab === "pending" 
                  ? "No pending reports from athletes" 
                  : "No reviewed reports"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="p-5 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {report.time_range}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        From: {report.athlete_name}
                      </p>
                      {report.athlete_notes && (
                        <p className="text-sm text-gray-500 line-clamp-2">{report.athlete_notes}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(report.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
