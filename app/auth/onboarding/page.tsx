"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Step components
import Step1AccountProfile from "./Step1AccountProfile";
import Step2FitnessBackground from "./Step2FitnessBackground";
import Step3Goals from "./Step3Goals";
import Step4TrainingPreferences from "./Step4TrainingPreferences";
import Step5HealthMotivation from "./Step5HealthMotivation";
import GoalSuggestionModal from "./GoalSuggestionModal";

interface OnboardingFormData {
  // Step 1 - Physical Profile only (name/username/email already collected at signup)
  age: number;
  gender: string;
  height: number;
  height_unit: string;
  weight: number;
  weight_unit: string;
  body_type: string;
  
  // Step 2
  fitness_level: string;
  primary_sport: string;
  years_training: number;
  current_performance_baseline: string;
  
  // Step 3
  primary_goal: string;
  goal_timeframe: string;
  target_event: string;
  target_event_date: string;
  
  // Step 4
  weekly_availability: number;
  preferred_intensity: string;
  preferred_training_time: string;
  equipment_access: string[];
  
  // Step 5
  injury_history: string;
  medical_conditions: string;
  current_activity_level: string;
  motivation_level: number;
  guidance_preference: string;
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [goalSuggestions, setGoalSuggestions] = useState<any[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    // Step 1 - Physical Profile
    age: 25,
    gender: "male",
    height: 170,
    height_unit: "cm",
    weight: 70,
    weight_unit: "kg",
    body_type: "mesomorph",
    
    // Step 2
    fitness_level: "intermediate",
    primary_sport: "",
    years_training: 0,
    current_performance_baseline: "",
    
    // Step 3
    primary_goal: "general_fitness",
    goal_timeframe: "3_months",
    target_event: "",
    target_event_date: "",
    
    // Step 4
    weekly_availability: 3,
    preferred_intensity: "moderate",
    preferred_training_time: "evening",
    equipment_access: [],
    
    // Step 5
    injury_history: "",
    medical_conditions: "",
    current_activity_level: "moderately_active",
    motivation_level: 7,
    guidance_preference: "structured_plan",
  });

  // Load saved draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("onboarding_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    }
  }, []);

  // Save draft to localStorage on form data change
  useEffect(() => {
    localStorage.setItem("onboarding_draft", JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.age < 13 || formData.age > 120) newErrors.age = "Age must be between 13 and 120";
      if (formData.height <= 0) newErrors.height = "Height must be positive";
      if (formData.weight <= 0) newErrors.weight = "Weight must be positive";
    }

    if (step === 2) {
      if (!formData.fitness_level) newErrors.fitness_level = "Fitness level is required";
      if (!formData.primary_sport.trim()) newErrors.primary_sport = "Primary sport is required";
      if (formData.years_training < 0) newErrors.years_training = "Years training cannot be negative";
      if (!formData.current_performance_baseline.trim()) newErrors.current_performance_baseline = "Performance baseline is required";
    }

    if (step === 3) {
      if (!formData.primary_goal) newErrors.primary_goal = "Primary goal is required";
      if (!formData.goal_timeframe) newErrors.goal_timeframe = "Goal timeframe is required";
      if (formData.target_event_date) {
        const targetDate = new Date(formData.target_event_date);
        if (targetDate < new Date()) {
          newErrors.target_event_date = "Target event date must be in the future";
        }
      }
    }

    if (step === 4) {
      if (formData.weekly_availability < 1 || formData.weekly_availability > 7) {
        newErrors.weekly_availability = "Weekly availability must be between 1 and 7 days";
      }
      if (!formData.preferred_intensity) newErrors.preferred_intensity = "Preferred intensity is required";
      if (!formData.preferred_training_time) newErrors.preferred_training_time = "Preferred training time is required";
    }

    if (step === 5) {
      if (!formData.current_activity_level) newErrors.current_activity_level = "Current activity level is required";
      if (formData.motivation_level < 1 || formData.motivation_level > 10) {
        newErrors.motivation_level = "Motivation level must be between 1 and 10";
      }
      if (!formData.guidance_preference) newErrors.guidance_preference = "Guidance preference is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitProfile = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const token = getCookie("token");
      const csrfToken = getCookie("csrftoken");

      // Prepare data - convert empty strings to null for optional date fields
      const submitData = {
        ...formData,
        target_event_date: formData.target_event_date || null,
      };

      console.log("Submitting profile data:", submitData);

      const response = await fetch("http://localhost:8000/api/auth/onboarding/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      console.log("Profile creation response:", data);

      if (response.ok) {
        // Clear localStorage draft
        localStorage.removeItem("onboarding_draft");
        
        // Show goal suggestions modal if available
        if (data.goal_suggestions && data.goal_suggestions.length > 0) {
          setGoalSuggestions(data.goal_suggestions);
          setShowGoalModal(true);
          
          // Fallback: redirect after 60 seconds if user doesn't interact with modal
          setTimeout(() => {
            console.log("Timeout reached, redirecting to dashboard");
            router.replace("/dashboard/player");
          }, 60000);
        } else {
          // No suggestions, redirect directly to dashboard
          console.log("No goal suggestions, redirecting to dashboard");
          router.replace("/dashboard/player");
        }
      } else {
        console.error("Profile creation failed:", data);
        if (response.status === 409) {
          // Profile already exists
          alert("Profile already exists. Redirecting to dashboard...");
          router.replace("/dashboard/player");
        } else if (data.errors) {
          console.error("Validation errors:", data.errors);
          setErrors(data.errors);
          alert(`Validation errors: ${JSON.stringify(data.errors, null, 2)}`);
        } else {
          alert(data.error || "Failed to create profile");
        }
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalAccepted = () => {
    // Clear localStorage and redirect to dashboard
    localStorage.removeItem("onboarding_draft");
    router.replace("/dashboard/player");
  };

  const handleGoalSkipped = () => {
    // Clear localStorage and redirect to dashboard
    localStorage.removeItem("onboarding_draft");
    router.replace("/dashboard/player");
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#173B80] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span className={currentStep >= 1 ? "text-[#173B80] font-medium" : ""}>Physical</span>
            <span className={currentStep >= 2 ? "text-[#173B80] font-medium" : ""}>Fitness</span>
            <span className={currentStep >= 3 ? "text-[#173B80] font-medium" : ""}>Goals</span>
            <span className={currentStep >= 4 ? "text-[#173B80] font-medium" : ""}>Training</span>
            <span className={currentStep >= 5 ? "text-[#173B80] font-medium" : ""}>Health</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {currentStep === 1 && (
            <Step1AccountProfile
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <Step2FitnessBackground
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <Step3Goals
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <Step4TrainingPreferences
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 5 && (
            <Step5HealthMotivation
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={goToNextStep}
              className="px-6 py-2 bg-[#173B80] text-white rounded-lg hover:bg-[#102a5a] transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitProfile}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Complete Profile"}
            </button>
          )}
        </div>
      </div>

      {/* Goal Suggestion Modal */}
      {showGoalModal && (
        <GoalSuggestionModal
          suggestions={goalSuggestions}
          onAccept={handleGoalAccepted}
          onSkip={handleGoalSkipped}
        />
      )}
    </div>
  );
}
