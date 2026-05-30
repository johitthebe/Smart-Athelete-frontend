"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

interface TESData {
  overall_score: number;
  status: string;
  athlete: {
    id: number;
    name: string;
    username: string;
  };
  consistency: any;
  recovery: any;
  goal_progress: any;
  root_cause: any;
  solution_plan: any;
  coach_feedback: string;
  predictions: any;
}

export default function AthleteDetailedTESPage() {
  const router = useRouter();
  const params = useParams();
  const athleteId = params?.athleteId;
  
  const [tesData, setTesData] = useState<TESData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (athleteId) {
      fetchTESAnalysis();
    }
  }, [athleteId]);

  const fetchTESAnalysis = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance/tes/athlete/${athleteId}/`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setTesData(data);
      } else {
        alert("Failed to load training analysis");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching TES:", error);
      alert("Error loading analysis");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const copyFeedback = () => {
    if (tesData?.coach_feedback) {
      navigator.clipboard.writeText(tesData.coach_feedback);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const getScoreBar = (score: number) => {
    const percentage = score;
    let color = "bg-red-500";
    if (score >= 85) color = "bg-green-500";
    else if (score >= 70) color = "bg-blue-500";
    else if (score >= 60) color = "bg-yellow-500";
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#173B80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Analyzing training data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tesData) return null;

  const { consistency, recovery, goal_progress, root_cause, solution_plan, predictions } = tesData;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← Back to Athletes
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              TRAINING EFFECTIVENESS ANALYSIS
            </h1>
            <p className="text-gray-600">
              {tesData.athlete.name} (@{tesData.athlete.username})
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Overall Score</div>
            <div className={`text-5xl font-bold ${
              tesData.overall_score >= 85 ? "text-green-600" :
              tesData.overall_score >= 70 ? "text-blue-600" :
              tesData.overall_score >= 60 ? "text-yellow-600" : "text-red-600"
            }`}>
              {tesData.overall_score}/100
            </div>
            <div className="text-sm font-medium text-gray-700 mt-1">
              {tesData.overall_score >= 85 ? "⭐ Excellent" :
               tesData.overall_score >= 70 ? "✅ Good" :
               tesData.overall_score >= 60 ? "⚠️ Needs Improvement" : "🚨 Critical"}
            </div>
          </div>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 COMPONENT BREAKDOWN</h2>
        
        {/* Consistency */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">1. CONSISTENCY (30% weight)</h3>
            <span className="text-2xl font-bold text-gray-900">{consistency.score}/100</span>
          </div>
          {getScoreBar(consistency.score)}
          <div className="mt-3 space-y-1 text-sm">
            <p>• Workouts: {consistency.workouts_completed}/{consistency.workouts_expected} completed ({consistency.completion_rate}%)</p>
            {consistency.problem_days && consistency.problem_days.length > 0 && (
              <p className="text-red-600">• Pattern: Missing {consistency.problem_days[0].day}s ({consistency.problem_days[0].completed} out of {consistency.problem_days[0].expected})</p>
            )}
            <p>• Streak: {consistency.current_streak} days {consistency.current_streak === 0 && "(broken)"}</p>
            <p>• Weekend: {consistency.weekend_rate}% {consistency.weekend_rate >= 80 ? "✅" : "⚠️"} | Weekday: {consistency.weekday_rate}% {consistency.weekday_rate >= 70 ? "✅" : "⚠️"}</p>
          </div>
        </div>

        {/* Recovery */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">2. RECOVERY & FATIGUE (30% weight)</h3>
            <span className="text-2xl font-bold text-gray-900">{recovery.score}/100</span>
          </div>
          {getScoreBar(recovery.score)}
          <div className="mt-3 space-y-1 text-sm">
            <p>• Perceived Effort: {recovery.avg_perceived_effort}/10 {recovery.avg_perceived_effort > 8 ? "(Too high! 🚨)" : ""}</p>
            <p>• Feeling: Tired {recovery.tired_rate}% of time {recovery.tired_rate > 40 ? "⚠️" : "✅"}</p>
            <p>• Recovery Score: {recovery.score}/100 ({recovery.status})</p>
            <p className={recovery.rest_days_14d === 0 ? "text-red-600 font-medium" : ""}>
              • Rest Days: {recovery.rest_days_14d} in last 14 days {recovery.rest_days_14d === 0 && "🚨"}
            </p>
          </div>
        </div>

        {/* Goal Progress */}
        {goal_progress.has_goals !== false && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">3. GOAL PROGRESS (40% weight)</h3>
              <span className="text-2xl font-bold text-gray-900">{goal_progress.score}/100</span>
            </div>
            {getScoreBar(goal_progress.score)}
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium">Goal: "{goal_progress.goal_name}"</p>
              <p>• Current: {goal_progress.current_value}{goal_progress.unit} | Target: {goal_progress.target_value}{goal_progress.unit}</p>
              <p>• Progress: {goal_progress.progress_pct}% complete</p>
              <p>• Days Left: {goal_progress.days_remaining} days</p>
              <p className={goal_progress.on_track ? "text-green-600" : "text-red-600"}>
                • Status: {goal_progress.on_track ? "On Track ✅" : "Behind Target 📉"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Root Cause Analysis */}
      {root_cause && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-900 mb-4">🚨 ROOT CAUSE ANALYSIS</h2>
          <div className="bg-white rounded p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2">The Root Cause Chain:</h3>
            <div className="space-y-2">
              {root_cause.cause_chain && root_cause.cause_chain.map((cause: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">{idx + 1}.</span>
                  <span className="text-gray-700">{cause}</span>
                </div>
              ))}
            </div>
          </div>
          {root_cause.issues && root_cause.issues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900">Critical Findings:</h3>
              {root_cause.issues.map((issue: any, idx: number) => (
                <div key={idx} className="bg-white rounded p-3">
                  <span className="font-medium text-red-600">{issue.severity.toUpperCase()}:</span>
                  <span className="ml-2 text-gray-700">{issue.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Solution Plan */}
      {solution_plan && solution_plan.phases && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">✅ INTEGRATED SOLUTION PLAN</h2>
          <p className="text-sm text-gray-600 mb-4">Total Duration: {solution_plan.total_duration}</p>
          
          {solution_plan.phases.map((phase: any) => (
            <div key={phase.phase} className="bg-white rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2">
                PHASE {phase.phase}: {phase.name} ({phase.duration})
              </h3>
              
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Immediate Actions:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {phase.actions.map((action: string, idx: number) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Expected Outcome:</p>
                <div className="text-sm text-gray-600">
                  {Object.entries(phase.expected_outcome).map(([key, value]) => (
                    <p key={key}>• {key.replace(/_/g, ' ')}: {String(value)}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Predictions */}
      {predictions && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">📈 PREDICTED IMPROVEMENTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded p-3 text-center">
              <div className="text-sm text-gray-600">Current</div>
              <div className="text-3xl font-bold text-gray-900">{predictions.overall.current}</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-sm text-gray-600">Week 2</div>
              <div className="text-3xl font-bold text-green-600">{predictions.overall.week_2}</div>
              <div className="text-xs text-green-600">+{predictions.overall.week_2 - predictions.overall.current}</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-sm text-gray-600">Week 4</div>
              <div className="text-3xl font-bold text-green-600">{predictions.overall.week_4}</div>
              <div className="text-xs text-green-600">+{predictions.overall.week_4 - predictions.overall.current}</div>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <div className="text-sm text-gray-600">Week 8</div>
              <div className="text-3xl font-bold text-green-600">{predictions.overall.week_8}</div>
              <div className="text-xs text-green-600">+{predictions.overall.week_8 - predictions.overall.current}</div>
            </div>
          </div>
        </div>
      )}

      {/* Coach Feedback */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">💬 READY-TO-SEND FEEDBACK</h2>
          <button
            onClick={copyFeedback}
            className="px-4 py-2 bg-[#173B80] text-white rounded-lg hover:bg-[#102a5a] transition-colors"
          >
            {copySuccess ? "✓ Copied!" : "Copy Feedback"}
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
            {tesData.coach_feedback}
          </pre>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Send to Athlete
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Message
          </button>
        </div>
      </div>
    </div>
  );
}
