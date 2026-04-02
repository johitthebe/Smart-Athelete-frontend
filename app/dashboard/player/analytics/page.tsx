"use client";

import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { API_BASE_URL } from "@/lib/config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

type TimeRange = "week" | "month" | "3months" | "year";
type ComparisonMode = "self" | "benchmark" | "peers";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("self");
  const [selectedMetric, setSelectedMetric] = useState<"distance" | "duration" | "intensity">("distance");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/performance/analytics/?range=${timeRange}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceTrendData = () => {
    if (!analytics?.progress_data || analytics.progress_data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const sortedData = [...analytics.progress_data].sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedData.map((item: any) => {
      const date = new Date(item.date);
      if (timeRange === "week") {
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      } else if (timeRange === "month") {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Your Performance",
          data: sortedData.map((item: any) => item.value || 0),
          borderColor: "var(--color-electric)",
          backgroundColor: "rgba(46, 107, 230, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
        },
        ...(comparisonMode === "benchmark" && analytics.benchmark_data ? [{
          label: "Benchmark",
          data: sortedData.map(() => analytics.benchmark_value || 0),
          borderColor: "var(--color-teal)",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          tension: 0,
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
        }] : []),
      ],
    };
  };

  const getActivityDistributionData = () => {
    if (!analytics?.activity_breakdown || analytics.activity_breakdown.length === 0) {
      return { labels: [], datasets: [] };
    }

    const activities = analytics.activity_breakdown.slice(0, 6);
    
    return {
      labels: activities.map((a: any) => a.name || 'Unknown'),
      datasets: [{
        data: activities.map((a: any) => a.count || 0),
        backgroundColor: [
          'var(--color-electric)',
          'var(--color-teal)',
          'var(--color-success)',
          'var(