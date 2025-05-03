
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface TimeActivity {
  id?: string;
  title: string;
  description: string;
  category: "work" | "social" | "health" | "learning";
  color?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  syncWithGoogleCalendar?: boolean;
}

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
  const [date, setDate] = useState<Date>(new Date());
  const [syncWithGoogleCalendar, setSyncWithGoogleCalendar] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);

  useEffect(() => {
    // Check if Google Calendar is connected (would be stored in localStorage in this mock)
    const isConnected = localStorage.getItem('googleCalendarConnected') === 'true';
    setGoogleCalendarConnected(isConnected);
    
    // Initialize the form when activity changes
    if (activity) {
      setDate(activity.startDate);
      setSyncWithGoogleCalendar(activity.syncWithGoogleCalendar || false);
    } else {
      setDate(new Date());
      setSyncWithGoogleCalendar(false);
    }
  }, [activity]);

  const form = useForm<TimeActivity>({
    defaultValues: activity || {
      title: "",
      description: "",
      category: "work",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const handleSave = (data: TimeActivity) => {
    const newActivity = {
      ...data,
      startDate: date,
      endDate: date,
      id: activity?.id,
      syncWithGoogleCalendar,
    };
    onSave(newActivity);
  };

  const connectGoogleCalendar = () => {
    // This would normally start the Google OAuth flow
    // For this prototype, we'll just simulate it with a localStorage flag
    localStorage.setItem('googleCalendarConnected', 'true');
    setGoogleCalendarConnected(true);
    
    alert("For this prototype, we're simulating Google Calendar connection. In a production app, this would initiate an OAuth flow.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "Create Activity"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter activity title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description of the activity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Google Calendar Integration Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Google Calendar Integration</h3>
              
              {!googleCalendarConnected ? (
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect your Google Calendar to sync activities
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2 w-fit"
                    onClick={connectGoogleCalendar}
                  >
                    Connect Google Calendar
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Sync with Google Calendar</FormLabel>
                    <FormDescription>
                      This activity will be added to your Google Calendar
                    </FormDescription>
                  </div>
                  <Switch 
                    checked={syncWithGoogleCalendar} 
                    onCheckedChange={setSyncWithGoogleCalendar} 
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {activity ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
