
import React from "react";

interface SessionCompletionBannerProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SessionCompletionBanner: React.FC<SessionCompletionBannerProps> = ({
  isVisible,
  onComplete
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-lg p-4 flex items-center justify-between animate-fade-in">
      <div>
        <h3 className="text-lg font-medium text-green-800 dark:text-green-100">Focus Session Completed! 🎉</h3>
        <p className="text-sm text-green-600 dark:text-green-300">
          Great job! You've completed your focus session.
        </p>
      </div>
      <button 
        onClick={onComplete}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
      >
        Record Session
      </button>
    </div>
  );
};

export default SessionCompletionBanner;
