import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`card-bg rounded-xl p-6 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
          <p className="text-gray-400">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
