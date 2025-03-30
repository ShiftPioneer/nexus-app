
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

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
  const [category, setCategory] = useState<TimeActivity["category"]>("work");
  const [color, setColor] = useState<TimeActivity["color"]>("purple");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [syncWithGoogleCalendar, setSyncWithGoogleCalendar] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description || "");
      setCategory(activity.category);
      setColor(activity.color);
      setStartDate(format(activity.startDate, "yyyy-MM-dd"));
      setEndDate(format(activity.endDate, "yyyy-MM-dd"));
      setStartTime(activity.startTime);
      setEndTime(activity.endTime);
      setSyncWithGoogleCalendar(activity.syncWithGoogleCalendar || false);
    } else {
      resetForm();
    }
  }, [activity, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("work");
    setColor("purple");
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setEndDate(format(new Date(), "yyyy-MM-dd"));
    setStartTime("09:00");
    setEndTime("10:00");
    setSyncWithGoogleCalendar(false);
  };

  const handleSave = () => {
    const newActivity: TimeActivity = {
      id: activity?.id || "",
      title,
      description,
      category,
      color,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime,
      endTime,
      syncWithGoogleCalendar,
    };
    
    onSave(newActivity);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "New Activity"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter activity title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this activity"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as TimeActivity["category"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                <div 
                  className={`h-5 w-5 rounded-full cursor-pointer ${color === "purple" ? "ring-2 ring-offset-2 ring-primary" : ""} bg-purple-400`}
                  onClick={() => setColor("purple")}
                />
                <div 
                  className={`h-5 w-5 rounded-full cursor-pointer ${color === "blue" ? "ring-2 ring-offset-2 ring-primary" : ""} bg-blue-400`}
                  onClick={() => setColor("blue")}
                />
                <div 
                  className={`h-5 w-5 rounded-full cursor-pointer ${color === "green" ? "ring-2 ring-offset-2 ring-primary" : ""} bg-green-400`}
                  onClick={() => setColor("green")}
                />
                <div 
                  className={`h-5 w-5 rounded-full cursor-pointer ${color === "orange" ? "ring-2 ring-offset-2 ring-primary" : ""} bg-orange-400`}
                  onClick={() => setColor("orange")}
                />
                <div 
                  className={`h-5 w-5 rounded-full cursor-pointer ${color === "red" ? "ring-2 ring-offset-2 ring-primary" : ""} bg-red-400`}
                  onClick={() => setColor("red")}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <Label htmlFor="sync-calendar">Sync with Google Calendar</Label>
              <p className="text-sm text-muted-foreground">
                Add this activity to your Google Calendar
              </p>
            </div>
            <Switch
              id="sync-calendar"
              checked={syncWithGoogleCalendar}
              onCheckedChange={setSyncWithGoogleCalendar}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
