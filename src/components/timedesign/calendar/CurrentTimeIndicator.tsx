
import React from "react";

interface CurrentTimeIndicatorProps {
  getCurrentTimePosition: () => number;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ getCurrentTimePosition }) => {
  return (
    <div 
      className="absolute left-0 right-0 border-t-2 border-primary z-10" 
      style={{
        top: `${getCurrentTimePosition()}px`,
        width: '100%'
      }}
    >
      <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-primary animate-pulse border-2 border-slate-950"></div>
    </div>
  );
};

export default CurrentTimeIndicator;
