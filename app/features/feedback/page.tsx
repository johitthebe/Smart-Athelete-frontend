"use client";

import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";

type FeedbackItem = {
  id: number;
  coachName: string;
  coachInitials: string;
  date: string;
  relatedEntry: string;   // e.g. "Sprint 100m - Nov 12"
  rating: number;         // 1–5
  text: string;
  attachmentName?: string;
};

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 1,
    coachName: "Sarah Williams",
    coachInitials: "SW",
    date: "November 26, 2024",
    relatedEntry: "Sprint 100m - Time Trial",
    rating: 5,
    text:
      "Excellent performance! Your starting technique has improved significantly. " +
      "Focus on maintaining your form in the last 20 meters to shave off those extra milliseconds.",
    attachmentName: "technique_analysis.pdf",
  },
  {
    id: 2,
    coachName: "Sarah Williams",
    coachInitials: "SW",
    date: "November 25, 2024",
    relatedEntry: "Bench Press - Week 10",
    rating: 4,
    text:
      "Good progress on strength building. Your form is solid. " +
      "Try adding some plyometric exercises to complement your strength work.",
  },
];

export default function FeedbackPage() {
  const totalFeedback = MOCK_FEEDBACK.length;
  const thisMonth = 3; // later compute from dates
  const avgRating = 4.3; // later compute from ratings

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Feedback from Coaches
          </h1>
          <p className="text-sm text-gray-500">
            Review feedback and guidance from your coaches.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Total feedback</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {totalFeedback}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">All time</p>
          </div>

          <div className="rounded-2xl bg-white border p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">This month</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {thisMonth}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              New feedback entries
            </p>
          </div>

          <div className="rounded-2xl bg-white border p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Average rating</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {avgRating.toFixed(1)}/5
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Performance rating
            </p>
          </div>
        </div>

        {/* Feedback list */}
        <div className="space-y-4">
          {MOCK_FEEDBACK.map((fb) => (
            <article
              key={fb.id}
              className="rounded-2xl bg-white border p-4 shadow-sm"
            >
              {/* Coach header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                    {fb.coachInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {fb.coachName}
                      </p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                        Coach
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">{fb.date}</p>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < fb.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>

              {/* Related performance entry */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-gray-500">
                  Related performance entry
                </p>
                <p className="text-xs text-blue-700">{fb.relatedEntry}</p>
              </div>

              {/* Feedback text */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-gray-500">
                  Feedback
                </p>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                  {fb.text}
                </p>
              </div>

              {/* Attachments */}
              {fb.attachmentName && (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-gray-500">
                    Attachments
                  </p>
                  <button className="mt-1 inline-flex items-center rounded-full border px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-50">
                    {fb.attachmentName}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
