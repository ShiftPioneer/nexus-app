import React from "react";
import WeekHeader from "./WeekHeader";
import WeekTimeColumn from "./WeekTimeColumn";
import WeekDayColumn from "./WeekDayColumn";

interface WeekCalendarViewProps {
  weekDays: Date[];
  hours: number[];
  formatHour: (hour: number) => string;
  getCurrentTimePosition: () => number;
  filteredActivities: TimeActivity[];
  scheduledTasks?: Array<{
    id: string;
    title: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    scheduledEndTime?: string;
    completed?: boolean;
  }>;
  scheduledHabits?: Array<{
    id: string;
    title: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    scheduledEndTime?: string;
    status?: string;
  }>;
  onEditActivity: (activity: TimeActivity) => void;
  onEditTask?: (taskId: string) => void;
  onEditHabit?: (habitId: string) => void;
  onToggleTaskComplete?: (taskId: string) => void;
  onToggleHabitComplete?: (habitId: string) => void;
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => void;
}

const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
  weekDays,
  hours,
  formatHour,
  getCurrentTimePosition,
  filteredActivities,
  scheduledTasks = [],
  scheduledHabits = [],
  onEditActivity,
  onEditTask,
  onEditHabit,
  onToggleTaskComplete,
  onToggleHabitComplete,
  onCreateActivity,
}) => {
  return (
    <div className="min-h-[1728px] overflow-x-auto">
      <WeekHeader weekDays={weekDays} />

      <div className="grid grid-cols-[3.5rem,repeat(7,1fr)] relative">
        <WeekTimeColumn hours={hours} formatHour={formatHour} />

        {weekDays.map((day, dayIndex) => (
          <WeekDayColumn
            key={dayIndex}
            day={day}
            dayIndex={dayIndex}
            hours={hours}
            activities={filteredActivities}
            scheduledTasks={scheduledTasks}
            scheduledHabits={scheduledHabits}
            getCurrentTimePosition={getCurrentTimePosition}
            onEditActivity={onEditActivity}
            onEditTask={onEditTask}
            onEditHabit={onEditHabit}
            onToggleTaskComplete={onToggleTaskComplete}
            onToggleHabitComplete={onToggleHabitComplete}
            onCreateActivity={onCreateActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendarView;
