
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: TimeActivity | null;
  onSave: (activity: TimeActivity) => void;
}

const ActivityDialog: React.FC<ActivityDialogProps> = ({
  open,
  onOpenChange,
  activity,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [color, setColor] = useState("purple");
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [syncWithGoogle, setSyncWithGoogle] = useState(false);

  // Reset form when activity changes or dialog opens
  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description || "");
      setCategory(activity.category || "work");
      setColor(activity.color || "purple");
      
      const activityDate = activity.startDate instanceof Date 
        ? activity.startDate 
        : new Date(activity.startDate);
      setDate(activityDate);
      
      setStartTime(activity.startTime);
      setEndTime(activity.endTime);
      setSyncWithGoogle(activity.syncWithGoogleCalendar || false);
    } else {
      // Default values for new activity
      setTitle("");
      setDescription("");
      setCategory("work");
      setColor("purple");
      setDate(new Date());
      setStartTime("09:00");
      setEndTime("10:00");
      setSyncWithGoogle(false);
    }
  }, [activity, open]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const updatedActivity: TimeActivity = {
      id: activity?.id || `activity-${Date.now()}`,
      title,
      description,
      category,
      color,
      startDate: date,
      endDate: date,
      startTime,
      endTime,
      syncWithGoogleCalendar: syncWithGoogle,
    };

    onSave(updatedActivity);
    onOpenChange(false);
  };

  const categoryOptions = [
    { value: "work", label: "Work", color: "purple" },
    { value: "social", label: "Social", color: "orange" },
    { value: "health", label: "Health", color: "green" },
    { value: "study", label: "Study", color: "blue" },
    { value: "personal", label: "Personal", color: "pink" },
  ];

  const getCategoryColor = (categoryValue: string) => {
    return categoryOptions.find(opt => opt.value === categoryValue)?.color || "slate";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "New Activity"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Activity title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this activity"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setColor(getCategoryColor(e.target.value));
              }}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {["purple", "orange", "green", "blue", "pink", "slate"].map(
                  colorOption => (
                    <button
                      key={colorOption}
                      type="button"
                      className={`h-10 rounded-md border ${
                        color === colorOption ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{
                        backgroundColor: 
                          colorOption === "purple" ? "#8b5cf6" :
                          colorOption === "orange" ? "#f97316" :
                          colorOption === "green" ? "#10b981" :
                          colorOption === "blue" ? "#3b82f6" :
                          colorOption === "pink" ? "#ec4899" :
                          "#64748b"
                      }}
                      onClick={() => setColor(colorOption)}
                      aria-label={`Select ${colorOption} color`}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sync-google"
              checked={syncWithGoogle}
              onChange={(e) => setSyncWithGoogle(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="sync-google" className="text-sm font-normal">
              Sync with Google Calendar
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {activity ? "Update" : "Create"} Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
