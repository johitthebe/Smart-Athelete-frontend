"use client";

import { useState } from "react";
import Navbar from "@/app/component/Navbar";
import Sidebar from "@/app/component/coachsidebar";

type ProgressStatus = "improving" | "stable" | "declining";

type Athlete = {
  id: number;
  name: string;
  lastUpdate: string;
  progress: ProgressStatus;
  score: number;
};

const ATHLETES: Athlete[] = [
  { id: 1, name: "Alex Johnson", lastUpdate: "2 hours ago", progress: "improving", score: 85 },
  { id: 2, name: "Emma Davis", lastUpdate: "1 day ago", progress: "stable", score: 78 },
  { id: 3, name: "Michael Chen", lastUpdate: "3 days ago", progress: "improving", score: 82 },
  { id: 4, name: "Sarah Martinez", lastUpdate: "1 week ago", progress: "declining", score: 68 },
  { id: 5, name: "James Wilson", lastUpdate: "2 days ago", progress: "improving", score: 90 },
];

function ProgressPill({ status }: { status: ProgressStatus }) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium";

  if (status === "improving") {
    return (
      <span className={`${base} bg-black text-white`}>
        <span>↗</span>
        improving
      </span>
    );
  }
  if (status === "declining") {
    return (
      <span className={`${base} bg-rose-500 text-white`}>
        <span>↘</span>
        declining
      </span>
    );
  }
  return (
    <span className={`${base} bg-gray-100 text-gray-700`}>
      stable
    </span>
  );
}

export default function CoachDashboardPage() {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const improving = ATHLETES.filter((a) => a.progress === "improving");
  const needsAttention = ATHLETES.filter((a) => a.progress === "declining");

  const avgScore =
    Math.round(
      (ATHLETES.reduce((sum, a) => sum + a.score, 0) / ATHLETES.length) * 10
    ) / 10;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6 space-y-5">
          {/* Page header */}
          <header className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Coach Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage and monitor your athletes.
            </p>
          </header>

          {/* Top summary row: original two cards + extra two */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Improving Performance card */}
            <div className="col-span-1 md:col-span-1 xl:col-span-2 rounded-2xl border bg-emerald-50/70 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-800">
                    Improving Performance
                  </p>
                  <p className="mt-4 text-xl font-semibold text-emerald-900">
                    {improving.length} Athletes
                  </p>
                </div>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">
                  ↗
                </span>
              </div>
              <div className="mt-5 space-y-2 text-xs text-emerald-900">
                {improving.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-full bg-white/60 px-3 py-1"
                  >
                    <span>{a.name}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px]">
                      {a.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention card */}
            <div className="col-span-1 md:col-span-1 xl:col-span-2 rounded-2xl border bg-rose-50/70 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-rose-800">
                    Needs Attention
                  </p>
                  <p className="mt-4 text-xl font-semibold text-rose-900">
                    {needsAttention.length} Athletes
                  </p>
                </div>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-xs text-rose-700">
                  ↘
                </span>
              </div>
              <div className="mt-5 space-y-2 text-xs text-rose-900">
                {needsAttention.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-full bg-white/60 px-3 py-1"
                  >
                    <span>{a.name}</span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px]">
                      {a.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra card: Squad Overview */}
            <div className="col-span-1 rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-600">
                Squad Overview
              </p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {avgScore}/100
              </p>
              <p className="text-xs text-gray-500">Average performance score</p>
              <div className="mt-4 space-y-1 text-xs text-gray-700">
                <p>{improving.length} improving</p>
                <p>{needsAttention.length} need attention</p>
                <p>
                  {ATHLETES.length - improving.length - needsAttention.length}{" "}
                  stable
                </p>
              </div>
            </div>

            {/* Extra card: Latest Test Completion (static demo) */}
            <div className="col-span-1 rounded-2xl border bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Latest Test Completion
                </p>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Yo-Yo Endurance Test
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <svg className="h-16 w-16">
                    <circle
                      className="text-gray-200"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="24"
                      cx="32"
                      cy="32"
                    />
                    <circle
                      className="text-gray-900"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="24"
                      cx="32"
                      cy="32"
                      strokeDasharray={2 * Math.PI * 24}
                      strokeDashoffset={2 * Math.PI * 24 * (1 - 8 / 12)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold">8/12</span>
                  </div>
                </div>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-900 mr-1" />
                    Completed: 8 athletes
                  </p>
                  <p>
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-300 mr-1" />
                    Pending: 4 athletes
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* My Athletes table */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                My Athletes
              </h2>
              <p className="text-xs text-gray-500">
                Manage your assigned players.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Player Name</th>
                    <th className="px-4 py-2 font-medium">Last Update</th>
                    <th className="px-4 py-2 font-medium">Progress</th>
                    <th className="px-4 py-2 font-medium">Score</th>
                    <th className="px-4 py-2 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ATHLETES.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {a.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {a.lastUpdate}
                      </td>
                      <td className="px-4 py-3">
                        <ProgressPill status={a.progress} />
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {a.score}/100
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedAthlete(a)}
                            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] text-gray-800 hover:bg-gray-100"
                          >
                            <span>👁</span>
                            View
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-[11px] font-medium text-white hover:bg-gray-900">
                            💬 Feedback
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Slide-over athlete detail */}
          {selectedAthlete && (
            <div className="fixed inset-0 z-40 flex">
              {/* backdrop */}
              <div
                className="flex-1 bg-black/30"
                onClick={() => setSelectedAthlete(null)}
              />
              {/* panel */}
              <div className="w-full max-w-md bg-white shadow-xl border-l flex flex-col">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <div>
                    <p className="text-xs text-gray-500">Athlete details</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedAthlete.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAthlete(null)}
                    className="rounded-full border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs text-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-500">Current score</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedAthlete.score}/100
                      </p>
                    </div>
                    <ProgressPill status={selectedAthlete.progress} />
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-600">
                      Recent tests (demo)
                    </p>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span>100m Sprint</span>
                        <span>10.9 s</span>
                      </li>
                      <li className="flex justify-between">
                        <span>5K Run</span>
                        <span>21:20</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Yo-Yo Endurance</span>
                        <span>17.3</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-gray-600">
                      Recent feedback
                    </p>
                    <div className="space-y-2">
                      <div className="rounded-xl border px-3 py-2">
                        <p className="text-[11px] text-gray-500">
                          2 days ago
                        </p>
                        <p>Great improvement in start phase. Keep current warmup.</p>
                      </div>
                      <div className="rounded-xl border px-3 py-2">
                        <p className="text-[11px] text-gray-500">
                          1 week ago
                        </p>
                        <p>Focus on relaxation in mid-race, avoid overstriding.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t px-5 py-3 flex gap-2">
                  <button className="flex-1 rounded-full border px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50">
                    Add Feedback
                  </button>
                  <button className="flex-1 rounded-full bg-black px-3 py-2 text-xs font-medium text-white hover:bg-gray-900">
                    Set New Goal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
