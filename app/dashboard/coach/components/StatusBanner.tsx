"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";

type ApprovalStatus = "pending" | "approved" | "rejected";

type CoachStatus = {
  status: ApprovalStatus;
  rejection_reason?: string;
  credential_count: number;
};

export default function StatusBanner() {
  const [status, setStatus] = useState<CoachStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach/status/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (err) {
      console.error("Error fetching status:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!status) return null;

  // Approved status
  if (status.status === "approved") {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-4 mb-5">
        <h3 className="text-sm font-semibold text-green-900">You're approved!</h3>
        <p className="text-sm text-green-700 mt-1">
          Your coaching credentials have been verified. You can now access all coaching features.
        </p>
      </div>
    );
  }

  // Rejected status
  if (status.status === "rejected") {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-5">
        <h3 className="text-sm font-semibold text-red-900">Application Not Approved</h3>
        <p className="text-sm text-red-700 mt-1">
          <strong>Reason:</strong> {status.rejection_reason}
        </p>
        <p className="text-sm text-red-700 mt-2">
          You can upload new credentials and resubmit for review.
        </p>
        <div className="flex gap-2 mt-3">
          <Link
            href="/dashboard/coach/credentials"
            className="rounded-full bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
          >
            Upload New Credentials
          </Link>
          <a
            href="mailto:support@smartathlete.com"
            className="rounded-full border border-red-300 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // Pending status - no credentials uploaded
  if (status.credential_count === 0) {
    return (
      <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 mb-5">
        <h3 className="text-sm font-semibold text-yellow-900">Action Required: Upload Credentials</h3>
        <p className="text-sm text-yellow-700 mt-1">
          To become an approved coach, you need to upload your coaching credentials and certifications.
        </p>
        <Link
          href="/dashboard/coach/credentials"
          className="inline-block mt-3 rounded-full bg-yellow-600 px-4 py-2 text-xs font-medium text-white hover:bg-yellow-700"
        >
          Upload Credentials
        </Link>
      </div>
    );
  }

  // Pending status - credentials uploaded
  return (
    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-5">
      <h3 className="text-sm font-semibold text-blue-900">Your application is under review</h3>
      <p className="text-sm text-blue-700 mt-1">
        Credentials submitted - awaiting admin review. You'll be notified once your application is processed.
      </p>
    </div>
  );
}
