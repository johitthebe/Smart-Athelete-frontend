"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type Athlete = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  last_activity?: string;
  performance_trend?: number;
  active_goals?: number;
  status?: string;
};

export default function CoachDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, statusRes, athletesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/auth/coach/status/`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/coach/athletes/`, { credentials: "include" }),
      ]);

      if (userRes.ok) setUser(await userRes.json());
      if (statusRes.ok) setStatus(await statusRes.json());
      if (athletesRes.ok) {
        const data = await athletesRes.json();
        console.log("Athletes data:", data);
        setAthletes(data);
        if (data && data.length > 0) {
          setSelectedAthlete(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isApproved = status?.status === "approved";

  const getInitials = (athlete: Athlete) => {
    if (athlete.first_name && athlete.last_name) {
      return `${athlete.first_name[0]}${athlete.last_name[0]}`.toUpperCase();
    }
    return athlete.username.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (athlete: Athlete) => {
    if (athlete.first_name || athlete.last_name) {
      return `${athlete.first_name || ""} ${athlete.last_name || ""}`.trim();
    }
    return athlete.username;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return { class: "bg-gray-100 text-gray-700", label: "Unknown" };
    
    const badges: Record<string, { class: string; label: string }> = {
      active: { class: "bg-green-100 text-green-700", label: "Active" },
      warning: { class: "bg-orange-100 text-orange-700", label: "Warning" },
      inactive: { class: "bg-red-100 text-red-700", label: "Inactive" },
    };
    return badges[status] || badges.active;
  };

  const activeAthletes = athletes.filter(a => a.status === "active").length;
  const needsAttention = athletes.filter(a => a.status === "inactive" || a.status === "warning").length;
  const improvingAthletes = athletes.filter(a => (a.performance_trend || 0) > 0).length;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your athletes' progress and provide feedback
        </p>
      </div>

      {/* Status Banners */}
      {status && status.status === "pending" && status.credential_count === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-1">Action Required: Upload Credentials</h3>
              <p className="text-sm text-yellow-700 mb-4">
                To become an approved coach, you need to upload your coaching credentials and certifications.
              </p>
              <button
                onClick={() => router.push("/dashboard/coach/credentials")}
                className="px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm"
              >
                Upload Credentials Now
              </button>
            </div>
          </div>
        </div>
      )}

      {status && status.status === "pending" && status.credential_count > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">Your application is under review</h3>
              <p className="text-sm text-blue-700">
                Credentials submitted - awaiting admin review. You'll be notified once your application is processed.
              </p>
            </div>
          </div>
        </div>
      )}

      {status && status.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-1">Application Not Approved</h3>
              <p className="text-sm text-red-700 mb-2">
                <strong>Reason:</strong> {status.rejection_reason}
              </p>
              <button
                onClick={() => router.push("/dashboard/coach/credentials")}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
              >
                Upload New Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content - Only show if approved */}
      {isApproved ? (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Athletes</p>
                  <p className="text-2xl font-bold text-gray-900">{athletes.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Improving</p>
                  <p className="text-2xl font-bold text-gray-900">{improvingAthletes}</p>
                  <p className="text-xs text-green-600">athletes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Needs Attention</p>
                  <p className="text-2xl font-bold text-gray-900">{needsAttention}</p>
                  <p className="text-xs text-gray-500">athletes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAthletes}</p>
                  <p className="text-xs text-gray-500">athletes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Needs Attention Section */}
          {needsAttention > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Athletes Needing Attention
              </h2>
              <div className="space-y-3">
                {athletes
                  .filter(a => a.status === "inactive" || a.status === "warning")
                  .map(athlete => (
                    <div key={athlete.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(athlete)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{getDisplayName(athlete)}</p>
                          <p className="text-xs text-gray-600">
                            {athlete.status === "inactive" ? "No activity in 5+ days" : "Performance needs review"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/dashboard/coach/athletes/${athlete.id}`)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Athletes Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 flex items-center justify-between border-b">
                <h2 className="text-base font-semibold text-gray-900">My Athletes</h2>
                <button
                  onClick={() => router.push("/dashboard/coach/athletes")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </button>
              </div>
              
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading athletes...</p>
                </div>
              ) : athletes.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-1">No athletes assigned yet</p>
                  <p className="text-sm text-gray-500">Athletes will appear here once they're assigned to you</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athlete</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {athletes.map(athlete => {
                        const badge = getStatusBadge(athlete.status);
                        const trend = athlete.performance_trend || 0;
                        
                        return (
                          <tr
                            key={athlete.id}
                            onClick={() => {
                              setSelectedAthlete(athlete);
                              router.push(`/dashboard/coach/athletes/${athlete.id}`);
                            }}
                            className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedAthlete?.id === athlete.id ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {getInitials(athlete)}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{getDisplayName(athlete)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.class}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {athlete.last_activity || "No data"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-semibold ${
                                trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"
                              }`}>
                                {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend).toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                              {athlete.active_goals || 0}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/dashboard/coach/athletes")}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-medium">View All Athletes</span>
                  </button>
                  
                  <button
                    onClick={() => router.push("/dashboard/coach/credentials")}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Manage Credentials</span>
                  </button>
                </div>
              </div>

              {selectedAthlete && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Selected Athlete</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(selectedAthlete)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{getDisplayName(selectedAthlete)}</p>
                      <p className="text-xs text-gray-500">{selectedAthlete.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard/coach/athletes/${selectedAthlete.id}`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    View Full Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Approval Required</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Your coaching features are currently locked. Please upload your credentials and wait for admin approval.
          </p>
          <button
            onClick={() => router.push("/dashboard/coach/credentials")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Upload Credentials
          </button>
        </div>
      )}
    </div>
  );
}
