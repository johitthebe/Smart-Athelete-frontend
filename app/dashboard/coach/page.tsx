"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function CoachDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, statusRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/me/`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/auth/coach/status/`, { credentials: "include" }),
      ]);

      if (userRes.ok) setUser(await userRes.json());
      if (statusRes.ok) setStatus(await statusRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isApproved = status?.status === "approved";

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isApproved ? "Welcome back!" : "Complete Your Profile"}
            </h2>
            <p className="text-sm text-gray-500">
              {isApproved
                ? "Manage your athletes and track their progress"
                : "Upload your credentials to get started"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">coach</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Status Banner */}
        {status && status.status === "pending" && status.credential_count === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
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

        {status && status.status === "approved" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-1">You're approved!</h3>
                <p className="text-sm text-green-700">
                  Your coaching credentials have been verified. You can now access all coaching features.
                </p>
              </div>
            </div>
          </div>
        )}

        {status && status.status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
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
                <p className="text-sm text-red-700 mb-4">
                  You can upload new credentials and resubmit for review.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/dashboard/coach/credentials")}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                  >
                    Upload New Credentials
                  </button>
                  <a
                    href="mailto:support@smartathlete.com"
                    className="px-6 py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {isApproved ? (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">My Athletes</p>
                <p className="text-3xl font-bold">5</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Improving</p>
                <p className="text-3xl font-bold">3</p>
                <p className="text-xs text-green-600 mt-1">athletes</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Needs Attention</p>
                <p className="text-3xl font-bold">1</p>
                <p className="text-xs text-gray-500 mt-1">athlete</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">Feedback Given</p>
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-gray-500 mt-1">this month</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 flex items-center justify-between border-b">
                <h3 className="text-lg font-semibold">My Athletes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
              </div>
              <div className="p-6 text-center text-gray-500">
                <p>Athlete management features coming soon</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
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
    </>
  );
}
