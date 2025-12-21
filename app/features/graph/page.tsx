"use client";

import Navbar from "@/app/component/Navbar";
import Sidebar from "@/app/component/sidebar";
import { Line, Bar, Radar } from "react-chartjs-2";
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

const LINE_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
];

const LINE_DATA = [60, 65, 68, 70, 75, 78, 82, 85, 88, 90, 93];

const BAR_LABELS = ["Aug", "Sep", "Oct", "Nov"];
const BAR_DATA = [82, 88, 90, 92];

const RADAR_LABELS = [
  "Speed",
  "Strength",
  "Endurance",
  "Power",
  "Flexibility",
  "Agility",
];

const RADAR_DATA = [92, 78, 87, 85, 73, 88];

export default function PerformanceVisualizationPage() {
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
                Performance Visualization
              </h1>
              <p className="text-sm text-gray-500">
                Visual analysis of your performance trends.
              </p>
            </div>
            <select className="rounded-full border bg-white px-3 py-1.5 text-xs text-gray-700">
              <option>Last Year</option>
              <option>Last 6 Months</option>
              <option>Last Month</option>
            </select>
          </div>

          {/* Line chart */}
          <section className="rounded-2xl bg-white border p-4 shadow-sm space-y-3">
            <div>
              <h2 className="text-xs font-semibold text-gray-800">
                Progress Over Time
              </h2>
              <p className="text-[11px] text-gray-500">
                Track your performance improvement throughout the year.
              </p>
            </div>
            <div className="h-64">
              <Line
                data={{
                  labels: LINE_LABELS,
                  datasets: [
                    {
                      label: "Performance Score",
                      data: LINE_DATA,
                      borderColor: "#2563eb",
                      backgroundColor: "rgba(37, 99, 235, 0.15)",
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: {
                    y: { min: 0, max: 100, ticks: { stepSize: 20 } },
                  },
                }}
              />
            </div>
          </section>

          {/* Bar chart */}
          <section className="rounded-2xl bg-white border p-4 shadow-sm space-y-3">
            <div>
              <h2 className="text-xs font-semibold text-gray-800">
                Monthly Average Scores
              </h2>
              <p className="text-[11px] text-gray-500">
                Compare your average performance across recent months.
              </p>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels: BAR_LABELS,
                  datasets: [
                    {
                      label: "Average Score",
                      data: BAR_DATA,
                      backgroundColor: "#22c55e",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: {
                    y: { min: 0, max: 100, ticks: { stepSize: 20 } },
                  },
                }}
              />
            </div>
          </section>

          {/* Radar chart + insights */}
          <section className="rounded-2xl bg-white border p-4 shadow-sm space-y-4">
            <div>
              <h2 className="text-xs font-semibold text-gray-800">
                Strengths & Weaknesses Analysis
              </h2>
              <p className="text-[11px] text-gray-500">
                Identify your strongest and weakest performance categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-64">
                <Radar
                  data={{
                    labels: RADAR_LABELS,
                    datasets: [
                      {
                        label: "Performance",
                        data: RADAR_DATA,
                        backgroundColor: "rgba(129, 140, 248, 0.25)",
                        borderColor: "#6366f1",
                        pointBackgroundColor: "#6366f1",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 20, display: false },
                      },
                    },
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>

              <div className="text-xs text-gray-700 space-y-1">
                {RADAR_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b last:border-0 py-1"
                  >
                    <span>{label}</span>
                    <span className="font-semibold">
                      {RADAR_DATA[i]}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-purple-50 px-4 py-3 text-xs text-purple-900 space-y-1">
              <p className="font-semibold text-sm">Key Insights</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Your speed performance has improved significantly this year.</li>
                <li>Strength is your area with the most potential for improvement.</li>
                <li>You have maintained consistent progress for 3 consecutive months.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
