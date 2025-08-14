
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const activitySchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  category: z.enum(["work", "social", "health", "learning"]),
  color: z.enum(["purple", "blue", "green", "orange", "red"]),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)" }),
  syncWithGoogleCalendar: z.boolean(),
}).refine(data => {
    const startDateTime = new Date(data.startDate);
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute);
    
    const endDateTime = new Date(data.endDate);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    endDateTime.setHours(endHour, endMinute);
    
    return endDateTime > startDateTime;
}, {
    message: "End time must be after start time.",
    path: ["endTime"],
});

type ActivityFormValues = z.infer<typeof activitySchema>;

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
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "work",
      color: "purple",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      syncWithGoogleCalendar: false,
    },
  });

  useEffect(() => {
    if (open) {
        if (activity) {
          // Auto-adjust end time when start time changes for new activities
          const defaultEndTime = (() => {
            if (!activity.id && activity.startTime) {
              const [hours, minutes] = activity.startTime.split(':').map(Number);
              const endHour = hours + 1;
              return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            return activity.endTime || "10:00";
          })();

          form.reset({
            ...activity,
            title: activity.id ? activity.title : '', // Empty title for new drag-created activities
            description: activity.description || "",
            endTime: defaultEndTime,
          });
        } else {
          form.reset({
            title: "",
            description: "",
            category: "work",
            color: "purple",
            startDate: new Date(),
            endDate: new Date(),
            startTime: "09:00",
            endTime: "10:00",
            syncWithGoogleCalendar: false,
          });
        }
    }
  }, [activity, open, form]);

  // Smart time adjustment
  const watchStartTime = form.watch('startTime');
  const watchCategory = form.watch('category');
  
  useEffect(() => {
    if (watchStartTime && (!activity?.id)) {
      const [hours, minutes] = watchStartTime.split(':').map(Number);
      const endHour = hours + 1;
      const newEndTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      form.setValue('endTime', newEndTime);
    }
  }, [watchStartTime, form, activity?.id]);

  // Smart color adjustment based on category
  useEffect(() => {
    if (watchCategory && (!activity?.id)) {
      const categoryColors: Record<string, TimeActivity['color']> = {
        work: 'purple',
        social: 'orange', 
        health: 'green',
        learning: 'blue'
      };
      form.setValue('color', categoryColors[watchCategory] || 'purple');
    }
  }, [watchCategory, form, activity?.id]);


  const handleSave = (values: ActivityFormValues) => {
    const activityToSave: TimeActivity = {
      id: activity?.id || "",
      title: values.title,
      description: values.description || "",
      category: values.category,
      color: values.color,
      startDate: values.startDate,
      endDate: values.endDate,
      startTime: values.startTime,
      endTime: values.endTime,
      syncWithGoogleCalendar: values.syncWithGoogleCalendar,
    };
    onSave(activityToSave);
  };

  const colors: TimeActivity['color'][] = ["purple", "blue", "green", "orange", "red"];
  const colorMap: Record<TimeActivity['color'], string> = {
    purple: "bg-purple-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
    red: "bg-red-400",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{activity?.id ? "Edit Activity" : "New Activity"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {activity?.id ? "Edit the details of your activity." : "Add a new activity to your calendar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-semibold">Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter activity title" {...field} className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary" />
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
                  <FormLabel className="text-primary font-semibold">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details about this activity" rows={3} {...field} className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700 focus:ring-primary">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 text-white border-slate-700">
                          <SelectItem value="work" className="focus:bg-primary/20">Work</SelectItem>
                          <SelectItem value="social" className="focus:bg-primary/20">Social</SelectItem>
                          <SelectItem value="health" className="focus:bg-primary/20">Health</SelectItem>
                          <SelectItem value="learning" className="focus:bg-primary/20">Learning</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-700 rounded-md h-10">
                            {colors.map((c) => (
                                <div
                                key={c}
                                className={`h-6 w-6 rounded-full cursor-pointer transition-all ${field.value === c ? 'ring-2 ring-offset-2 ring-primary ring-offset-slate-950' : ''} ${colorMap[c]}`}
                                onClick={() => field.onChange(c)}
                                />
                            ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-primary font-semibold">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start pl-3 text-left font-normal bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="text-white"
                            classNames={{
                              day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary",
                              day_today: "bg-primary/20 text-primary-foreground",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-primary font-semibold">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start pl-3 text-left font-normal bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="text-white"
                             classNames={{
                              day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary",
                              day_today: "bg-primary/20 text-primary-foreground",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold">End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="syncWithGoogleCalendar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/80 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-primary font-semibold">Sync with Google Calendar</FormLabel>
                    <FormDescription className="text-slate-400">
                      Add or update this activity on your Google Calendar.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-700"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                {activity?.id ? "Save Changes" : "Create Activity"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
