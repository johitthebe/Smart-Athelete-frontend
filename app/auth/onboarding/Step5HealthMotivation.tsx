interface Step5Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step5HealthMotivation({ formData, updateFormData, errors }: Step5Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Health & Motivation</h2>
      <p className="text-gray-600 mb-6">Help us create safe and appropriate recommendations for you</p>

      <div className="space-y-4">
        {/* Injury History (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Injury History (Optional)
          </label>
          <textarea
            value={formData.injury_history}
            onChange={(e) => updateFormData("injury_history", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
            rows={3}
            placeholder="List any past or current injuries that might affect your training (e.g., knee pain, shoulder injury, etc.)"
          />
        </div>

        {/* Medical Conditions (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Conditions (Optional)
          </label>
          <textarea
            value={formData.medical_conditions}
            onChange={(e) => updateFormData("medical_conditions", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
            rows={3}
            placeholder="List any medical conditions we should be aware of (e.g., asthma, diabetes, heart conditions, etc.)"
          />
        </div>

        {/* Current Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Activity Level <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.current_activity_level}
            onChange={(e) => updateFormData("current_activity_level", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.current_activity_level ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="sedentary">Sedentary - Little to no exercise</option>
            <option value="lightly_active">Lightly Active - Light exercise 1-3 days/week</option>
            <option value="moderately_active">Moderately Active - Moderate exercise 3-5 days/week</option>
            <option value="very_active">Very Active - Hard exercise 6-7 days/week</option>
            <option value="extremely_active">Extremely Active - Very hard exercise & physical job</option>
          </select>
          {errors.current_activity_level && (
            <p className="text-red-500 text-sm mt-1">{errors.current_activity_level}</p>
          )}
        </div>

        {/* Motivation Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivation Level (1-10) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={formData.motivation_level}
              onChange={(e) => updateFormData("motivation_level", parseInt(e.target.value))}
              className="flex-1"
              min="1"
              max="10"
            />
            <span className="text-2xl font-bold text-[#173B80] w-12 text-center">
              {formData.motivation_level}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
          {errors.motivation_level && (
            <p className="text-red-500 text-sm mt-1">{errors.motivation_level}</p>
          )}
        </div>

        {/* Guidance Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guidance Preference <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.guidance_preference}
            onChange={(e) => updateFormData("guidance_preference", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.guidance_preference ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="self_directed">Self Directed - I prefer to plan my own workouts</option>
            <option value="structured_plan">Structured Plan - I want a detailed training plan</option>
            <option value="coach_guided">Coach Guided - I want personalized coaching</option>
          </select>
          {errors.guidance_preference && (
            <p className="text-red-500 text-sm mt-1">{errors.guidance_preference}</p>
          )}
        </div>
      </div>
    </div>
  );
}
