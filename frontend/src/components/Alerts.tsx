import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface BaseAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<BaseAlertProps> = ({ 
  message, 
  onDismiss, 
  className = "" 
}) => {
  return (
    <div className={`
      bg-gradient-to-r from-red-50 to-red-100 
      border border-red-200 
      rounded-2xl 
      p-4 
      shadow-sm 
      animate-in 
      slide-in-from-top-2 
      duration-300
      ${className}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800 leading-relaxed">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-red-200 transition-colors duration-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export const SuccessAlert: React.FC<BaseAlertProps> = ({ 
  message, 
  onDismiss, 
  className = "" 
}) => {
  return (
    <div className={`
      bg-gradient-to-r from-green-50 to-emerald-100 
      border border-green-200 
      rounded-2xl 
      p-4 
      shadow-sm 
      animate-in 
      slide-in-from-top-2 
      duration-300
      ${className}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800 leading-relaxed">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-green-200 transition-colors duration-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// Compound component for easier usage
interface AlertProps {
  type: 'error' | 'success';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, ...props }) => {
  if (type === 'error') {
    return <ErrorAlert {...props} />;
  }
  return <SuccessAlert {...props} />;
};
