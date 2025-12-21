
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
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-start gap-1.5">
          <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-80" />
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-sm leading-tight ${isWeekView ? 'truncate' : 'line-clamp-2'}`}>
              {activity.title}
            </div>
          </div>
        </div>
        <div className="text-xs opacity-90 mt-0.5 flex-shrink-0">
          {activity.startTime} - {activity.endTime}
        </div>
        {parseInt(height, 10) > 60 && activity.description && (
          <div className={`text-xs mt-1 opacity-75 flex-grow ${isWeekView ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {activity.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityBlock;
