interface Step2Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step2FitnessBackground({ formData, updateFormData, errors }: Step2Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Fitness Background</h2>
      <p className="text-gray-600 mb-6">Help us understand your current fitness level and experience</p>

      <div className="space-y-4">
        {/* Fitness Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fitness Level <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.fitness_level}
            onChange={(e) => updateFormData("fitness_level", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.fitness_level ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="beginner">Beginner - Just starting out</option>
            <option value="intermediate">Intermediate - Regular training for 6+ months</option>
            <option value="advanced">Advanced - Consistent training for 2+ years</option>
            <option value="elite">Elite - Competitive athlete</option>
          </select>
          {errors.fitness_level && <p className="text-red-500 text-sm mt-1">{errors.fitness_level}</p>}
        </div>

        {/* Primary Sport */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Sport/Activity <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.primary_sport}
            onChange={(e) => updateFormData("primary_sport", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.primary_sport ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Running, Cycling, Swimming, Weightlifting"
          />
          {errors.primary_sport && <p className="text-red-500 text-sm mt-1">{errors.primary_sport}</p>}
        </div>

        {/* Years Training */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Training Experience <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.years_training}
            onChange={(e) => updateFormData("years_training", parseFloat(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.years_training ? "border-red-500" : "border-gray-300"
            }`}
            min="0"
            step="0.5"
            placeholder="0.5, 1, 2, etc."
          />
          {errors.years_training && <p className="text-red-500 text-sm mt-1">{errors.years_training}</p>}
        </div>

        {/* Current Performance Baseline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Performance Baseline <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.current_performance_baseline}
            onChange={(e) => updateFormData("current_performance_baseline", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.current_performance_baseline ? "border-red-500" : "border-gray-300"
            }`}
            rows={4}
            placeholder="Describe your current performance level. Examples:
- Running: Can run 5km in 30 minutes
- Cycling: Average 20km/h for 1 hour
- Weightlifting: Bench press 60kg for 5 reps
- Swimming: Can swim 500m freestyle in 12 minutes"
          />
          {errors.current_performance_baseline && (
            <p className="text-red-500 text-sm mt-1">{errors.current_performance_baseline}</p>
          )}
        </div>
      </div>
    </div>
  );
}
