"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

interface AthleteTES {
  athlete_id: number;
  athlete_name: string;
  athlete_username: string;
  overall_score: number;
  status: string;
  consistency_score: number;
  recovery_score: number;
  goal_progress_score: number;
  needs_attention: boolean;
  critical: boolean;
}

export default function TrainingAnalysisPage() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<AthleteTES[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_athletes: 0,
    needs_attention: 0,
    critical: 0
  });

  useEffect(() => {
    fetchAthletesTES();
  }, []);

  const fetchAthletesTES = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance/tes/my-athletes/`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAthletes(data.athletes || []);
        setStats({
          total_athletes: data.total_athletes,
          needs_attention: data.needs_attention,
          critical: data.critical
        });
      }
    } catch (error) {
      console.error("Error fetching TES data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-green-100 text-green-800",
      "Good": "bg-blue-100 text-blue-800",
      "Needs Improvement": "bg-yellow-100 text-yellow-800",
      "Critical": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#173B80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading training analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Training Effectiveness Analysis</h1>
        <p className="text-gray-600">Monitor your athletes' training effectiveness and identify who needs attention</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Total Athletes</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total_athletes}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-1">Needs Attention</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.needs_attention}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-600 mb-1">Critical</div>
          <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
        </div>
      </div>

      {/* Athletes List */}
      {athletes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No athletes assigned yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Athlete
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall TES
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consistency
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recovery
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goal Progress
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {athletes.map((athlete) => (
                <tr key={athlete.athlete_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{athlete.athlete_name}</div>
                      <div className="text-sm text-gray-500">@{athlete.athlete_username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(athlete.overall_score)}`}>
                      <span className="text-2xl font-bold">{athlete.overall_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{athlete.consistency_score}</div>
                    <div className="text-xs text-gray-500">/ 100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{athlete.recovery_score}</div>
                    <div className="text-xs text-gray-500">/ 100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{athlete.goal_progress_score}</div>
                    <div className="text-xs text-gray-500">/ 100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(athlete.status)}`}>
                      {athlete.status}
                    </span>
                    {athlete.critical && (
                      <div className="mt-1">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          🚨 Critical
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/dashboard/coach/training-analysis/${athlete.athlete_id}`)}
                      className="text-[#173B80] hover:text-[#102a5a] font-medium"
                    >
                      View Analysis →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
