
import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO, setHours, setMinutes } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TimeDesignCalendarProps {
  currentDate: Date;
  viewType: "day" | "week";
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
}

const TimeDesignCalendar: React.FC<TimeDesignCalendarProps> = ({
  currentDate,
  viewType,
  activities,
  onEditActivity
}) => {
  const { toast } = useToast();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [draggedActivity, setDraggedActivity] = useState<TimeActivity | null>(null);
  
  // Get days to display based on view type
  const getDaysToDisplay = () => {
    if (viewType === "day") return [currentDate];
    
    const weekStart = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };
  
  const days = getDaysToDisplay();
  
  // Filter activities for the current view (day or week)
  const getActivitiesForDay = (day: Date) => {
    return activities.filter(activity => {
      const activityDate = activity.startDate instanceof Date 
        ? activity.startDate 
        : typeof activity.startDate === 'string'
        ? parseISO(activity.startDate)
        : new Date(activity.startDate);
      
      return isSameDay(activityDate, day);
    });
  };
  
  const getActivitiesForHour = (day: Date, hour: number) => {
    const activitiesForDay = getActivitiesForDay(day);
    return activitiesForDay.filter(activity => {
      const startHour = parseInt(activity.startTime.split(':')[0], 10);
      return startHour === hour;
    });
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-purple-500 border-purple-600';
      case 'social': return 'bg-orange-500 border-orange-600';
      case 'health': return 'bg-green-500 border-green-600';
      case 'study': return 'bg-blue-500 border-blue-600';
      case 'personal': return 'bg-pink-500 border-pink-600';
      default: return 'bg-slate-500 border-slate-600';
    }
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    const activity = activities.find(a => a.id === draggableId);
    if (!activity) return;
    
    // Parse source and destination IDs to get day index and hour
    const [sourceDay, sourceHour] = source.droppableId.split('-').map(Number);
    const [destDay, destHour] = destination.droppableId.split('-').map(Number);
    
    // Calculate the new day and hour
    const newDay = days[destDay];
    
    // Create a new activity with updated time
    const updatedActivity = {
      ...activity,
      startDate: newDay,
      startTime: `${destHour.toString().padStart(2, '0')}:${activity.startTime.split(':')[1]}`,
    };
    
    // Calculate endTime based on duration
    const startHour = parseInt(activity.startTime.split(':')[0], 10);
    const startMinute = parseInt(activity.startTime.split(':')[1], 10);
    const endHour = parseInt(activity.endTime.split(':')[0], 10);
    const endMinute = parseInt(activity.endTime.split(':')[1], 10);
    
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const newEndHour = Math.floor((destHour * 60 + startMinute + durationMinutes) / 60);
    const newEndMinute = (destHour * 60 + startMinute + durationMinutes) % 60;
    
    updatedActivity.endTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`;
    
    // Call the edit function
    onEditActivity(updatedActivity);
    
    toast({
      title: "Activity moved",
      description: `"${activity.title}" moved to ${format(newDay, "EEE, MMM d")} at ${updatedActivity.startTime}`,
    });
  };
  
  return (
    <div className="h-[calc(100vh-320px)] overflow-y-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="min-w-full grid" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
          {/* Time column */}
          <div className="bg-muted/30 border-r">
            {hours.map((hour) => (
              <div key={`hour-${hour}`} className="h-20 border-b pl-2 pr-1 flex items-center justify-end">
                <span className="text-xs text-muted-foreground">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {days.map((day, dayIndex) => (
            <div key={`day-${dayIndex}`} className="min-w-[150px]">
              {/* Day header */}
              <div className="h-10 bg-muted/50 border-b flex items-center justify-center sticky top-0 z-10">
                <span className="font-medium">{format(day, "EEE, MMM d")}</span>
              </div>
              
              {/* Hour cells */}
              {hours.map((hour) => (
                <Droppable key={`${dayIndex}-${hour}`} droppableId={`${dayIndex}-${hour}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-20 border-b border-r relative ${
                        snapshot.isDraggingOver ? "bg-blue-100/30 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      {/* Activities for this hour */}
                      {getActivitiesForHour(day, hour).map((activity, activityIndex) => (
                        <Draggable
                          key={activity.id}
                          draggableId={activity.id}
                          index={activityIndex}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`absolute p-1 rounded-md border text-white ${getCategoryColor(activity.category || 'default')} shadow-sm z-10 cursor-pointer`}
                              style={{
                                left: '4px',
                                right: '4px',
                                height: '70px',
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.7 : 1,
                              }}
                              onClick={() => onEditActivity(activity)}
                            >
                              <div className="text-xs font-medium truncate">
                                {activity.title}
                              </div>
                              <div className="text-xs opacity-90 flex justify-between mt-1">
                                <span>
                                  {activity.startTime} - {activity.endTime}
                                </span>
                                <span className="bg-white/30 px-1 rounded text-[10px]">
                                  {activity.category}
                                </span>
                              </div>
                              {activity.description && (
                                <div className="text-[10px] mt-1 opacity-90 line-clamp-2">
                                  {activity.description}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TimeDesignCalendar;
