import { Tag } from "lucide-react";
import { statusThemes } from "./themes";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatNumber } from '../utils/formatValues';

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
          {Object.entries(statusThemes).map(
            ([key, config]) =>
              key !== "received" && (
                <option key={key} value={key}>
                  {config.label}
                </option>
              )
          )}
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

interface FormattedNumberProps {
  value: number | string;
  className?: string;
  precision?: number;
  toolTipValue?: string;
}

export const FormattedNumber: React.FC<FormattedNumberProps> = ({ 
  value, 
  className = "", 
  precision = 1,
  toolTipValue = value 
}) => {
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (showTooltipState && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8, // 8px gap above the element
      });
    }
  }, [showTooltipState]);

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle invalid numbers
  if (isNaN(numericValue)) {
    return <span className={className}>{value}</span>;
  }

  const formattedValue = formatNumber(numericValue, precision);
  const fullValue = numericValue.toLocaleString();
  const isFormatted = formattedValue !== fullValue;

  const tooltip = toolTipValue && isFormatted && showTooltipState && (
    <div 
      className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-full"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      }}
    >
      {toolTipValue.toLocaleString()}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  );

  return (
    <>
      <span 
        ref={spanRef}
        className={`${className}`}
        onMouseEnter={() => toolTipValue && isFormatted && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
      >
        {formattedValue}
      </span>
      
      {typeof document !== 'undefined' && tooltip && createPortal(tooltip, document.body)}
    </>
  );
};

export default FormattedNumber;