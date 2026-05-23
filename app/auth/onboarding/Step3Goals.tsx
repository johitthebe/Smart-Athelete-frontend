interface Step3Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step3Goals({ formData, updateFormData, errors }: Step3Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Goals & Targets</h2>
      <p className="text-gray-600 mb-6">What do you want to achieve?</p>

      <div className="space-y-4">
        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Goal <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.primary_goal}
            onChange={(e) => updateFormData("primary_goal", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.primary_goal ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="endurance">Endurance</option>
            <option value="strength">Strength</option>
            <option value="speed">Speed</option>
            <option value="flexibility">Flexibility</option>
            <option value="general_fitness">General Fitness</option>
          </select>
          {errors.primary_goal && <p className="text-red-500 text-sm mt-1">{errors.primary_goal}</p>}
        </div>

        {/* Goal Timeframe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Timeframe <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.goal_timeframe}
            onChange={(e) => updateFormData("goal_timeframe", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.goal_timeframe ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
            <option value="1_year">1 Year</option>
            <option value="ongoing">Ongoing</option>
          </select>
          {errors.goal_timeframe && <p className="text-red-500 text-sm mt-1">{errors.goal_timeframe}</p>}
        </div>

        {/* Target Event (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Event (Optional)
          </label>
          <input
            type="text"
            value={formData.target_event}
            onChange={(e) => updateFormData("target_event", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
            placeholder="e.g., Marathon, Triathlon, Competition"
          />
        </div>

        {/* Target Event Date (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Event Date (Optional)
          </label>
          <input
            type="date"
            value={formData.target_event_date}
            onChange={(e) => updateFormData("target_event_date", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.target_event_date ? "border-red-500" : "border-gray-300"
            }`}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.target_event_date && <p className="text-red-500 text-sm mt-1">{errors.target_event_date}</p>}
        </div>
      </div>
    </div>
  );
}
