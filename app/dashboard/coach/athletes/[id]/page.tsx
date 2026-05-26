"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import SuccessToast from "@/app/component/SuccessToast";
import { useToast } from "@/app/component/ToastContainer";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Athlete = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

type Goal = {
  id: number;
  name: string;
  target_value: number;
  current_value: number;
  target_unit: string;
  progress_percentage: number;
  status: string;
  deadline: string;
};

type PerformanceLog = {
  id: number;
  date: string;
  activity_type: { name: string; icon: string } | null;
  distance: number | null;
  duration: number | null;
  calories: number | null;
  intensity: number;
  notes: string;
};

type Feedback = {
  id: number;
  feedback_type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_acknowledged: boolean;
};

export default function AthleteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const athleteId = params.id as string;
  const toast = useToast();

  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<PerformanceLog[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    feedback_type: "general",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchAthleteData();
  }, [athleteId]);

  const fetchAthleteData = async () => {
    setLoading(true);
    try {
      // Fetch athlete info (from assignment)
      const assignmentRes = await fetch(`${API_BASE_URL}/api/auth/coaches/my-athletes/`, {
        credentials: "include",
      });
      if (assignmentRes.ok) {
        const data = await assignmentRes.json();
        // Handle both array and object with athletes property
        const assignments = Array.isArray(data) ? data : (data.athletes || []);
        const assignment = assignments.find((a: any) => a.athlete === parseInt(athleteId));
        if (assignment) {
          const [firstName, ...lastNameParts] = (assignment.athlete_name || '').split(' ');
          setAthlete({
            id: assignment.athlete,
            username: assignment.athlete_username || assignment.athlete_name || 'Unknown',
            first_name: firstName || '',
            last_name: lastNameParts.join(' ') || '',
            email: assignment.athlete_email || '',
          });
        } else {
          console.error("Athlete not found in assignments list. Looking for ID:", athleteId);
          console.error("Available assignments:", assignments);
        }
      } else {
        console.error("Failed to fetch assignments:", assignmentRes.status);
      }

      // Fetch athlete's goals
      const goalsRes = await fetch(`${API_BASE_URL}/api/performance/goals/?athlete=${athleteId}`, {
        credentials: "include",
      });
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      }

      // Fetch athlete's performance logs
      const logsRes = await fetch(`${API_BASE_URL}/api/performance/performance-logs/?athlete=${athleteId}&limit=20`, {
        credentials: "include",
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.results || logsData);
      }

      // Fetch feedback given to this athlete
      const feedbackRes = await fetch(`${API_BASE_URL}/api/performance/feedback/?athlete=${athleteId}`, {
        credentials: "include",
      });
      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData);
      }

    } catch (error) {
      console.error("Error fetching athlete data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`${API_BASE_URL}/api/performance/feedback/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify({
          ...feedbackForm,
          athlete: athleteId,
        }),
      });

      if (response.ok) {
        toast.success("Feedback sent successfully! 🎉");
        setFeedbackForm({ feedback_type: "general", title: "", message: "" });
        setShowFeedbackForm(false);
        fetchAthleteData();
      } else {
        const error = await response.json();
        toast.error(`Failed to send feedback: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to send feedback");
    }
  };

  const getProgressChartData = () => {
    if (logs.length === 0) return { labels: [], datasets: [] };

    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedLogs.map(log => new Date(log.date).toLocaleDateString()),
      datasets: [
        {
          label: "Distance (km)",
          data: sortedLogs.map(log => log.distance || 0),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
        {
          label: "Intensity",
          data: sortedLogs.map(log => log.intensity),
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading athlete data...</p>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Athlete Not Found</h2>
          <p className="text-gray-500 mb-6">
            This athlete is not assigned to you or the ID is invalid.
          </p>
          <button
            onClick={() => router.push('/dashboard/coach')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const displayName = athlete.first_name || athlete.last_name
    ? `${athlete.first_name} ${athlete.last_name}`.trim()
    : athlete.username;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-sm text-gray-500">@{athlete.username} • {athlete.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/dashboard/coach/messages?compose=true&athlete=${athleteId}`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            💬 Message
          </button>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showFeedbackForm ? "Cancel" : "📝 Give Feedback"}
          </button>
        </div>
      </div>

      {/* Feedback Form */}
      {showFeedbackForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Provide Feedback</h2>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback Type *
              </label>
              <select
                value={feedbackForm.feedback_type}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback_type: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="general">General Feedback</option>
                <option value="performance">Performance Review</option>
                <option value="goal">Goal-Specific</option>
                <option value="technique">Technique Improvement</option>
                <option value="motivation">Motivational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Brief title for the feedback"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Detailed feedback message..."
                rows={6}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Send Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.filter(g => g.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Avg Intensity</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.length > 0 ? (logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length).toFixed(1) : '0'}/10
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Feedback Given</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h2>
        {logs.length > 0 ? (
          <div className="h-80">
            <Line
              data={getProgressChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No performance data yet</p>
        )}
      </div>

      {/* Goals and Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h2>
          {goals.filter(g => g.status === 'active').length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active goals</p>
          ) : (
            <div className="space-y-4">
              {goals.filter(g => g.status === 'active').map((goal) => (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{goal.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{goal.current_value.toFixed(1)} / {goal.target_value} {goal.target_unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {logs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No activity logs yet</p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{log.activity_type?.icon || '🏃'}</span>
                    <div>
                      <p className="font-medium text-gray-900">{log.activity_type?.name || 'Activity'}</p>
                      <p className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {log.distance && <p className="text-sm font-semibold text-gray-900">{log.distance} km</p>}
                    <p className="text-xs text-gray-500">Intensity: {log.intensity}/10</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback History</h2>
        {feedback.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No feedback given yet</p>
        ) : (
          <div className="space-y-4">
            {feedback.map((fb) => (
              <div key={fb.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{fb.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{fb.feedback_type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{new Date(fb.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-2 mt-1">
                      {fb.is_read && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          ✓ Read
                        </span>
                      )}
                      {fb.is_acknowledged && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          ✓ Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{fb.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
