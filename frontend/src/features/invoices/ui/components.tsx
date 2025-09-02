import { Tag } from "lucide-react";
import { statusThemes } from "./themes";

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = statusThemes[status as keyof typeof statusThemes];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status}</span>
    </div>
  );
};

export const StatusSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}> = ({ value, onChange, label, required }) => {
  const selectedConfig = statusThemes[value as keyof typeof statusThemes];
  const Icon = selectedConfig?.icon || Tag;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white appearance-none cursor-pointer"
          required={required}
        >
          {Object.entries(statusThemes).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Status preview */}
      {value && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-2">Preview:</p>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${selectedConfig.color}`}
          >
            <Icon className="w-3 h-3" />
            <span className="capitalize">{selectedConfig.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};
