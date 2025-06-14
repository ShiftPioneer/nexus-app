
import React from "react";

interface ActivityBlockProps {
  activity: TimeActivity;
  style: {
    top: string;
    height: string;
    className: string;
  };
  onEditActivity: (activity: TimeActivity) => void;
  isWeekView?: boolean;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({ 
  activity, 
  style, 
  onEditActivity, 
  isWeekView = false 
}) => {
  const { top, height, className } = style;
  
  const blockStyle = isWeekView 
    ? {
        top,
        height,
        width: `calc(100% - 8px)`,
        left: "4px"
      }
    : {
        top,
        height
      };

  return (
    <div 
      style={blockStyle}
      className={className} 
      onClick={() => onEditActivity(activity)}
    >
      <div className={`text-sm font-medium ${isWeekView ? 'truncate' : 'line-clamp-1'}`}>
        {activity.title}
      </div>
      <div className={`text-xs ${isWeekView ? 'truncate flex-nowrap' : 'flex items-center justify-between'}`}>
        <span>{activity.startTime} - {activity.endTime}</span>
      </div>
      {parseInt(height, 10) > 80 && activity.description && (
        <div className={`text-xs mt-1 ${isWeekView ? 'line-clamp-1' : 'line-clamp-2'}`}>
          {activity.description}
        </div>
      )}
    </div>
  );
};

export default ActivityBlock;
