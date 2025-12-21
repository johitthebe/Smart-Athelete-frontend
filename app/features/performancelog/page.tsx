"use client";

import { useState } from "react";
import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";

const PERFORMANCE_CATEGORIES = ["Speed", "Endurance", "Strength", "Agility"];
const UNITS = ["seconds", "meters", "reps", "kg"];

export default function PerformanceLogPage() {
  const [category, setCategory] = useState("Speed");
  const [testName, setTestName] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/performance/
    console.log({ category, testName, value, unit, date, notes });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto w-full max-w-4xl px-6 py-6 space-y-4">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Add Performance Data
          </h1>
          <p className="text-sm text-gray-500">
            Record your latest performance results.
          </p>
        </div>

        {/* Main form card */}
        <section className="rounded-2xl bg-white border p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Performance Entry Form
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your performance data. The system will automatically
              calculate a performance score.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Performance category */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">
                Performance Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
              >
                {PERFORMANCE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Test name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">
                Test Name *
              </label>
              <input
                type="text"
                placeholder="Select test type"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Value + Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 10.5"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select unit
                  </option>
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add any additional notes about this performance..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
              >
                + Save Performance
              </button>
              <button
                type="button"
                className="rounded-full border bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        {/* Quick tip card */}
        <section className="rounded-2xl border bg-[#f5f8ff] p-4 text-sm text-gray-700">
          <p className="font-medium mb-1">💡 Quick Tip</p>
          <p className="text-xs text-gray-600">
            Record your performances consistently to track your progress over
            time. The auto-generated score helps you compare different types of
            performances.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
