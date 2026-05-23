interface Step4Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step4TrainingPreferences({ formData, updateFormData, errors }: Step4Props) {
  const equipmentOptions = [
    "Gym membership",
    "Dumbbells",
    "Barbell",
    "Resistance bands",
    "Treadmill",
    "Stationary bike",
    "Pull-up bar",
    "Yoga mat",
    "None - bodyweight only",
  ];

  const toggleEquipment = (equipment: string) => {
    const current = formData.equipment_access || [];
    if (current.includes(equipment)) {
      updateFormData("equipment_access", current.filter((e: string) => e !== equipment));
    } else {
      updateFormData("equipment_access", [...current, equipment]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Training Preferences</h2>
      <p className="text-gray-600 mb-6">Tell us about your training availability and preferences</p>

      <div className="space-y-4">
        {/* Weekly Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weekly Availability (Days per week) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.weekly_availability}
            onChange={(e) => updateFormData("weekly_availability", parseInt(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.weekly_availability ? "border-red-500" : "border-gray-300"
            }`}
            min="1"
            max="7"
          />
          {errors.weekly_availability && (
            <p className="text-red-500 text-sm mt-1">{errors.weekly_availability}</p>
          )}
        </div>

        {/* Preferred Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Intensity <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferred_intensity}
            onChange={(e) => updateFormData("preferred_intensity", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.preferred_intensity ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="low">Low - Easy, comfortable pace</option>
            <option value="moderate">Moderate - Challenging but sustainable</option>
            <option value="high">High - Intense, pushing limits</option>
            <option value="varied">Varied - Mix of all intensities</option>
          </select>
          {errors.preferred_intensity && (
            <p className="text-red-500 text-sm mt-1">{errors.preferred_intensity}</p>
          )}
        </div>

        {/* Preferred Training Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Training Time <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferred_training_time}
            onChange={(e) => updateFormData("preferred_training_time", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.preferred_training_time ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="morning">Morning (5 AM - 11 AM)</option>
            <option value="afternoon">Afternoon (11 AM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 10 PM)</option>
            <option value="flexible">Flexible - Any time</option>
          </select>
          {errors.preferred_training_time && (
            <p className="text-red-500 text-sm mt-1">{errors.preferred_training_time}</p>
          )}
        </div>

        {/* Equipment Access */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment Access (Select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {equipmentOptions.map((equipment) => (
              <label
                key={equipment}
                className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(formData.equipment_access || []).includes(equipment)}
                  onChange={() => toggleEquipment(equipment)}
                  className="w-4 h-4 text-[#173B80] border-gray-300 rounded focus:ring-[#173B80]"
                />
                <span className="text-sm text-gray-700">{equipment}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
