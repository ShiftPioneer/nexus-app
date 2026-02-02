
import React from "react";
import { Briefcase, Users, HeartPulse, BrainCircuit, Activity as ActivityIcon, Link2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const heightNum = parseInt(height, 10);
  
  const blockStyle = isWeekView 
    ? { top, height, width: `calc(100% - 8px)`, left: "4px" }
    : { top, height };

  const Icon = categoryIcons[activity.category] || categoryIcons.default;
  const linkedCount = activity.linkedItems?.length || 0;

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
        <div className="text-xs opacity-90 mt-0.5 flex-shrink-0 flex items-center gap-2">
          <span>{activity.startTime} - {activity.endTime}</span>
          {linkedCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-white/20 text-white border-0">
              <Link2 className="h-2.5 w-2.5 mr-0.5" />
              {linkedCount}
            </Badge>
          )}
        </div>
        {heightNum > 60 && activity.description && !activity.linkedItems?.length && (
          <div className={`text-xs mt-1 opacity-75 flex-grow ${isWeekView ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {activity.description}
          </div>
        )}
        {/* Show linked items if block is tall enough */}
        {heightNum > 60 && linkedCount > 0 && (
          <div className="mt-1.5 space-y-0.5 flex-grow overflow-hidden">
            {activity.linkedItems!.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-1 text-[10px] opacity-80">
                <CheckCircle className={`h-2.5 w-2.5 ${item.completed ? 'text-green-300' : 'text-white/60'}`} />
                <span className={`truncate ${item.completed ? 'line-through' : ''}`}>{item.title}</span>
              </div>
            ))}
            {linkedCount > 3 && (
              <div className="text-[10px] opacity-60">+{linkedCount - 3} more</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityBlock;
