import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  title: string;
  type: "task" | "habit";
}

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ScheduleItem | null;
  activities: TimeActivity[];
  onSchedule: (itemId: string, itemTitle: string, itemType: "task" | "habit", activityId: string | null, date: Date, startTime: string, endTime: string) => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onOpenChange,
  item,
  activities,
  onSchedule,
}) => {
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedActivityId, setSelectedActivityId] = useState<string | "standalone">("standalone");

  // Filter activities for the selected date
  const activitiesForDate = activities.filter(
    (a) => format(a.startDate, "yyyy-MM-dd") === format(scheduleDate, "yyyy-MM-dd")
  );

  const handleSchedule = () => {
    if (!item) return;
    
    onSchedule(
      item.id,
      item.title,
      item.type,
      selectedActivityId === "standalone" ? null : selectedActivityId,
      scheduleDate,
      startTime,
      endTime
    );
    onOpenChange(false);
  };

  // Generate time options
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      const label = format(new Date(`2000-01-01T${time}`), "h:mm a");
      timeOptions.push({ value: time, label });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-slate-950 border-slate-800 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Schedule {item?.type === "habit" ? "Habit" : "Task"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Block time for "{item?.title}" on your calendar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-primary font-semibold">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {format(scheduleDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={(d) => d && setScheduleDate(d)}
                  initialFocus
                  className="p-3 text-white"
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                    day_today: "bg-primary/20 text-primary-foreground",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-primary font-semibold">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 max-h-60">
                  {timeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-white hover:bg-slate-800">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-primary font-semibold">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 max-h-60">
                  {timeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-white hover:bg-slate-800">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attach to Activity */}
          <div className="space-y-2">
            <Label className="text-primary font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Attach to Activity (Optional)
            </Label>
            <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="Create as standalone or attach" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="standalone" className="text-white hover:bg-slate-800">
                  📅 Create as standalone block
                </SelectItem>
                {activitiesForDate.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs text-slate-500 font-medium">
                      Activities on {format(scheduleDate, "MMM d")}:
                    </div>
                    {activitiesForDate.map((activity) => (
                      <SelectItem
                        key={activity.id}
                        value={activity.id}
                        className="text-white hover:bg-slate-800"
                      >
                        🔗 {activity.title} ({activity.startTime} - {activity.endTime})
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              {selectedActivityId === "standalone"
                ? "This will create a new time block on your calendar"
                : "This will be attached as a sub-item to the selected activity"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700">
            Cancel
          </Button>
          <Button onClick={handleSchedule} className="bg-primary hover:bg-primary/90">
            <Clock className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
