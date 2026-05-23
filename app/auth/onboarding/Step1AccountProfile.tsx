interface Step1Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step1AccountProfile({ formData, updateFormData, errors }: Step1Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Physical Profile</h2>
      <p className="text-gray-600 mb-6">Tell us about your physical attributes to personalize your training</p>

      <div className="space-y-4">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData("age", parseInt(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
              errors.age ? "border-red-500" : "border-gray-300"
            }`}
            min="13"
            max="120"
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData("gender", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.height}
              onChange={(e) => updateFormData("height", parseFloat(e.target.value))}
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
                errors.height ? "border-red-500" : "border-gray-300"
              }`}
              step="0.1"
            />
            <select
              value={formData.height_unit}
              onChange={(e) => updateFormData("height_unit", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
            >
              <option value="cm">cm</option>
              <option value="ft">ft</option>
            </select>
          </div>
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => updateFormData("weight", parseFloat(e.target.value))}
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent ${
                errors.weight ? "border-red-500" : "border-gray-300"
              }`}
              step="0.1"
            />
            <select
              value={formData.weight_unit}
              onChange={(e) => updateFormData("weight_unit", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.body_type}
            onChange={(e) => updateFormData("body_type", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173B80] focus:border-transparent"
          >
            <option value="ectomorph">Ectomorph (Lean, hard to gain weight)</option>
            <option value="mesomorph">Mesomorph (Muscular, athletic build)</option>
            <option value="endomorph">Endomorph (Larger frame, easier to gain weight)</option>
            <option value="not_sure">Not Sure</option>
          </select>
        </div>
      </div>
    </div>
  );
}
