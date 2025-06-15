
import React from "react";
import { Briefcase, Users, HeartPulse, BrainCircuit, Activity as ActivityIcon } from "lucide-react";

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

const categoryIcons: Record<string, React.ElementType> = {
  work: Briefcase,
  social: Users,
  health: HeartPulse,
  learning: BrainCircuit,
  default: ActivityIcon
};

const ActivityBlock: React.FC<ActivityBlockProps> = ({ 
  activity, 
  style, 
  onEditActivity, 
  isWeekView = false 
}) => {
  const { top, height, className } = style;
  
  const blockStyle = isWeekView 
    ? { top, height, width: `calc(100% - 8px)`, left: "4px" }
    : { top, height };

  const Icon = categoryIcons[activity.category] || categoryIcons.default;

  return (
    <div 
      style={blockStyle}
      className={className} 
      onClick={() => onEditActivity(activity)}
    >
      <div className="flex items-start gap-2 h-full">
        <Icon className="h-4 w-4 mt-1 flex-shrink-0 opacity-80" />
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          <div className={`font-bold text-sm ${isWeekView ? 'truncate' : 'line-clamp-1'}`}>
            {activity.title}
          </div>
          <div className={`text-xs opacity-90 ${isWeekView ? 'truncate' : ''}`}>
            <span>{activity.startTime} - {activity.endTime}</span>
          </div>
          {parseInt(height, 10) > 40 && activity.description && (
            <div className={`text-xs mt-1 opacity-80 flex-grow ${isWeekView ? 'truncate' : 'line-clamp-2'}`}>
              {activity.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityBlock;
