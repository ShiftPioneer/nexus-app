
import React from "react";

interface CurrentTimeIndicatorProps {
  getCurrentTimePosition: () => number;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ getCurrentTimePosition }) => {
  return (
    <div 
      className="absolute left-0 right-0 border-t-2 border-red-500 dark:border-red-400 z-10" 
      style={{
        top: `${getCurrentTimePosition()}px`,
        width: '100%'
      }}
    >
      <div className="absolute -left-3 -top-2 w-4 h-4 rounded-full bg-red-500 dark:bg-red-400"></div>
    </div>
  );
};

export default CurrentTimeIndicator;
