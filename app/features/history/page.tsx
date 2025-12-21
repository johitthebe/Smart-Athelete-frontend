"use client";

import { useState } from "react";
import Navbar from "@/app/component/Navbar";
import Sidebar from "@/app/component/sidebar";

type HistoryRow = {
  id: number;
  date: string;
  testType: string;
  score: string;
  status: "Improved" | "Declined" | "Stable";
  notes?: string;
};

const MOCK_HISTORY: HistoryRow[] = [
  {
    id: 1,
    date: "2025-11-01",
    testType: "100m Sprint",
    score: "10.8 s",
    status: "Improved",
    notes: "New personal best.",
  },
  {
    id: 2,
    date: "2025-10-15",
    testType: "100m Sprint",
    score: "11.1 s",
    status: "Stable",
    notes: "Close to last result.",
  },
  {
    id: 3,
    date: "2025-10-01",
    testType: "5K Run",
    score: "21:30",
    status: "Improved",
    notes: "Better pacing in middle laps.",
  },
  {
    id: 4,
    date: "2025-09-10",
    testType: "Vertical Jump",
    score: "58 cm",
    status: "Declined",
    notes: "Minor fatigue from previous session.",
  },
  {
    id: 5,
    date: "2025-09-01",
    testType: "Yo-Yo Endurance",
    score: "Level 17.3",
    status: "Stable",
    notes: "Maintained performance.",
  },
];

function StatusPill({ status }: { status: HistoryRow["status"] }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium";
  if (status === "Improved") {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700`}>
        ● Improved
      </span>
    );
  }
  if (status === "Declined") {
    return (
      <span className={`${base} bg-red-100 text-red-700`}>● Declined</span>
    );
  }
  return (
    <span className={`${base} bg-slate-100 text-slate-700`}>● Stable</span>
  );
}

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All Time");
  const [testFilter, setTestFilter] = useState("All Tests");

  const filtered = MOCK_HISTORY.filter((row) => {
    const matchesSearch =
      row.testType.toLowerCase().includes(search.toLowerCase()) ||
      row.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesTest =
      testFilter === "All Tests" || row.testType === testFilter;
    return matchesSearch && matchesTest;
  });

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Performance History
              </h1>
              <p className="text-sm text-gray-500">
                Review all your past test results and trends.
              </p>
            </div>
          </div>

          {/* Filters */}
          <section className="rounded-2xl bg-white border p-4 shadow-sm space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by test type or notes..."
                  className="w-full rounded-full border px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="rounded-full border bg-white px-3 py-1.5 text-xs text-gray-700"
                >
                  <option>All Time</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>

                <select
                  value={testFilter}
                  onChange={(e) => setTestFilter(e.target.value)}
                  className="rounded-full border bg-white px-3 py-1.5 text-xs text-gray-700"
                >
                  <option>All Tests</option>
                  <option>100m Sprint</option>
                  <option>5K Run</option>
                  <option>Vertical Jump</option>
                  <option>Yo-Yo Endurance</option>
                </select>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border p-4 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Test</th>
                    <th className="px-4 py-2 font-medium">Score</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 text-gray-700">
                        {row.date}
                      </td>
                      <td className="px-4 py-2 text-gray-900 font-medium">
                        {row.testType}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        {row.score}
                      </td>
                      <td className="px-4 py-2">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-4 py-2 text-gray-600 max-w-xs">
                        {row.notes || "-"}
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400 text-xs"
                      >
                        No history found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
