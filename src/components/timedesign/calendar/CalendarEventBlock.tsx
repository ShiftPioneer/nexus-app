import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Repeat, Calendar, ListTodo, Sparkles } from "lucide-react";

export type CalendarItemType = "activity" | "task" | "habit";

export interface CalendarEvent {
  id: string;
  type: CalendarItemType;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  completed?: boolean;
  isRecurring?: boolean;
  category?: string;
  description?: string;
}

interface CalendarEventBlockProps {
  event: CalendarEvent;
  style: {
    top: string;
    height: string;
  };
  onClick: () => void;
  isWeekView?: boolean;
  onToggleComplete?: (id: string) => void;
}

// Apple Calendar-inspired color palette with semantic meaning
const colorStyles: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  // Activities - Primary brand colors
  purple: { bg: "bg-purple-500/20", border: "border-l-purple-500", text: "text-purple-100", accent: "bg-purple-500" },
  blue: { bg: "bg-blue-500/20", border: "border-l-blue-500", text: "text-blue-100", accent: "bg-blue-500" },
  indigo: { bg: "bg-indigo-500/20", border: "border-l-indigo-500", text: "text-indigo-100", accent: "bg-indigo-500" },
  cyan: { bg: "bg-cyan-500/20", border: "border-l-cyan-500", text: "text-cyan-100", accent: "bg-cyan-500" },
  // Tasks - Warm tones
  orange: { bg: "bg-orange-500/20", border: "border-l-orange-500", text: "text-orange-100", accent: "bg-orange-500" },
  red: { bg: "bg-red-500/20", border: "border-l-red-500", text: "text-red-100", accent: "bg-red-500" },
  yellow: { bg: "bg-yellow-500/20", border: "border-l-yellow-500", text: "text-yellow-100", accent: "bg-yellow-500" },
  // Habits - Nature tones  
  green: { bg: "bg-emerald-500/20", border: "border-l-emerald-500", text: "text-emerald-100", accent: "bg-emerald-500" },
  teal: { bg: "bg-teal-500/20", border: "border-l-teal-500", text: "text-teal-100", accent: "bg-teal-500" },
  // Default
  default: { bg: "bg-slate-500/20", border: "border-l-slate-400", text: "text-slate-100", accent: "bg-slate-500" },
};

const typeIcons: Record<CalendarItemType, React.ElementType> = {
  activity: Calendar,
  task: ListTodo,
  habit: Sparkles,
};

const CalendarEventBlock: React.FC<CalendarEventBlockProps> = ({
  event,
  style,
  onClick,
  isWeekView = false,
  onToggleComplete,
}) => {
  const { top, height } = style;
  const heightNum = parseInt(height, 10);
  const isCompact = heightNum < 40;
  const isTiny = heightNum < 25;
  
  const colors = colorStyles[event.color] || colorStyles.default;
  const TypeIcon = typeIcons[event.type];
  
  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleComplete && (event.type === "task" || event.type === "habit")) {
      onToggleComplete(event.id);
    }
  };

  // Format time display
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return minute === "00" ? `${displayHour}${ampm}` : `${displayHour}:${minute}${ampm}`;
  };

  return (
    <div
      style={{
        top,
        height,
        left: isWeekView ? "2px" : "0",
        right: isWeekView ? "2px" : "0",
        width: isWeekView ? "calc(100% - 4px)" : "100%",
      }}
      className={cn(
        "absolute rounded-md border-l-[3px] cursor-pointer",
        "transition-all duration-150 ease-out",
        "hover:scale-[1.02] hover:shadow-lg hover:z-30",
        "backdrop-blur-sm overflow-hidden",
        colors.bg,
        colors.border,
        event.completed && "opacity-60"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "h-full flex",
        isTiny ? "px-1 py-0.5 items-center" : "px-2 py-1 flex-col"
      )}>
        {/* Top row: Icon, Title, Time */}
        <div className={cn(
          "flex items-center gap-1 min-w-0",
          isTiny ? "flex-1" : ""
        )}>
          {/* Completion checkbox for tasks/habits */}
          {(event.type === "task" || event.type === "habit") && !isTiny && (
            <button 
              onClick={handleCheckClick}
              className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
            >
              {event.completed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-white/50 hover:text-white/80" />
              )}
            </button>
          )}
          
          {/* Type indicator for tiny blocks */}
          {isTiny && (
            <TypeIcon className={cn("h-3 w-3 flex-shrink-0", colors.text)} />
          )}
          
          {/* Title */}
          <span className={cn(
            "font-medium truncate flex-1",
            colors.text,
            isTiny ? "text-[10px]" : isCompact ? "text-xs" : "text-sm",
            event.completed && "line-through opacity-70"
          )}>
            {event.title}
          </span>
          
          {/* Recurring indicator */}
          {event.isRecurring && !isTiny && (
            <Repeat className={cn("h-3 w-3 flex-shrink-0 opacity-60", colors.text)} />
          )}
        </div>

        {/* Time display - only if not tiny */}
        {!isTiny && (
          <div className={cn(
            "flex items-center gap-1 mt-0.5",
            isCompact ? "text-[10px]" : "text-xs",
            "opacity-70",
            colors.text
          )}>
            <span>{formatTime(event.startTime)}</span>
            {!isCompact && (
              <>
                <span>-</span>
                <span>{formatTime(event.endTime)}</span>
              </>
            )}
          </div>
        )}

        {/* Description preview - only for larger blocks */}
        {!isCompact && !isTiny && heightNum > 60 && event.description && (
          <p className={cn(
            "text-[11px] mt-1 opacity-60 line-clamp-2",
            colors.text
          )}>
            {event.description}
          </p>
        )}

        {/* Type badge - only for larger blocks */}
        {heightNum > 80 && (
          <div className="mt-auto pt-1">
            <span className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-medium",
              "bg-white/10",
              colors.text
            )}>
              <TypeIcon className="h-2.5 w-2.5" />
              {event.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarEventBlock;
