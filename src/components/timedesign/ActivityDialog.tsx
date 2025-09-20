import React, { useEffect, useState } from "react";
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
import { Calendar as CalendarIcon, Trash2, Plus, Link, Upload, Repeat } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const activitySchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  category: z.enum(["work", "social", "health", "learning", "studies", "sport", "leisure"]),
  color: z.enum(["purple", "blue", "green", "orange", "red", "indigo", "cyan", "yellow"]),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)" }),
  syncWithGoogleCalendar: z.boolean(),
  notes: z.string().optional(),
  links: z.array(z.string()).optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).optional(),
  recurrenceEnd: z.date().optional(),
  recurrenceDays: z.array(z.string()).optional(),
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
  onDelete?: (id: string) => void;
}

const ActivityDialog: React.FC<ActivityDialogProps> = ({
  open,
  onOpenChange,
  activity,
  onSave,
  onDelete,
}) => {
  const [newLink, setNewLink] = useState("");
  
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
      notes: "",
      links: [],
      isRecurring: false,
      recurrencePattern: "daily",
      recurrenceDays: [],
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
            notes: activity.notes || "",
            links: activity.links || [],
            isRecurring: activity.isRecurring || false,
            recurrencePattern: activity.recurrencePattern || "daily",
            recurrenceDays: activity.recurrenceDays || [],
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
            notes: "",
            links: [],
            isRecurring: false,
            recurrencePattern: "daily",
            recurrenceDays: [],
          });
        }
    }
  }, [activity, open, form]);

  // Smart date/time adjustment
  const watchStartTime = form.watch('startTime');
  const watchStartDate = form.watch('startDate');
  const watchEndTime = form.watch('endTime');
  const watchEndDate = form.watch('endDate');
  const watchCategory = form.watch('category');
  const watchIsRecurring = form.watch('isRecurring');
  
  // Auto-adjust end time when start time changes (for new activities or when end time becomes invalid)
  useEffect(() => {
    if (watchStartTime) {
      const [startHours, startMinutes] = watchStartTime.split(':').map(Number);
      const [endHours, endMinutes] = watchEndTime.split(':').map(Number);
      
      // Check if we need to adjust end time
      const needsAdjustment = (!activity?.id) || // New activity
        (startHours * 60 + startMinutes >= endHours * 60 + endMinutes); // End time is not after start time
      
      if (needsAdjustment) {
        const endHour = startHours + 1;
        const newEndTime = `${endHour.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
        form.setValue('endTime', newEndTime);
      }
    }
  }, [watchStartTime, watchEndTime, form, activity?.id]);

  // Auto-adjust end date when start date changes
  useEffect(() => {
    if (watchStartDate && watchEndDate) {
      // If end date is before start date, set end date to start date
      if (watchEndDate < watchStartDate) {
        form.setValue('endDate', watchStartDate);
      }
    }
  }, [watchStartDate, watchEndDate, form]);

  // Smart color adjustment based on category - only for new activities without existing color preference
  useEffect(() => {
    if (watchCategory && (!activity?.id || !activity?.color)) {
      const categoryColors: Record<string, TimeActivity['color']> = {
        work: 'purple',
        studies: 'indigo',
        sport: 'yellow',
        leisure: 'cyan',
        social: 'orange', 
        health: 'green',
        learning: 'blue'
      };
      form.setValue('color', categoryColors[watchCategory] || 'purple');
    }
  }, [watchCategory, form, activity?.id, activity?.color]);

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
      notes: values.notes || "",
      links: values.links || [],
      isRecurring: values.isRecurring || false,
      recurrencePattern: values.recurrencePattern,
      recurrenceEnd: values.recurrenceEnd,
      recurrenceDays: values.recurrenceDays || [],
    };
    onSave(activityToSave);
  };

  const handleDelete = () => {
    if (activity?.id && onDelete) {
      onDelete(activity.id);
      onOpenChange(false);
    }
  };

  const addLink = () => {
    if (newLink.trim()) {
      const currentLinks = form.getValues('links') || [];
      form.setValue('links', [...currentLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = form.getValues('links') || [];
    form.setValue('links', currentLinks.filter((_, i) => i !== index));
  };

  // Order colors to match category order: work, studies, sport, leisure, social, health, learning
  const colors: TimeActivity['color'][] = ["purple", "indigo", "yellow", "cyan", "orange", "green", "blue", "red"];
  const colorMap: Record<TimeActivity['color'], string> = {
    purple: "bg-purple-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
    red: "bg-red-400",
    indigo: "bg-indigo-400",
    cyan: "bg-cyan-400",
    yellow: "bg-yellow-400",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-slate-950 border-slate-800 text-slate-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">{activity?.id ? "Edit Activity" : "New Activity"}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {activity?.id ? "Edit the details of your activity." : "Add a new activity to your calendar."}
              </DialogDescription>
            </div>
            {activity?.id && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
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
                          <SelectItem value="studies" className="focus:bg-primary/20">Studies</SelectItem>
                          <SelectItem value="sport" className="focus:bg-primary/20">Sport</SelectItem>
                          <SelectItem value="leisure" className="focus:bg-primary/20">Leisure</SelectItem>
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
            
            {/* Recurrence Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/80 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-primary font-semibold flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        Repeat Activity
                      </FormLabel>
                      <FormDescription className="text-slate-400">
                        Set up recurring schedule for this activity
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

              {watchIsRecurring && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recurrencePattern"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">Repeat Pattern</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-900 border-slate-700">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 text-white border-slate-700">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recurrenceEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-primary font-semibold">End Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start pl-3 text-left font-normal bg-slate-900 border-slate-700 hover:bg-slate-800",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                {field.value ? format(field.value, "PPP") : <span>No end date</span>}
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
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Notes Section */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-semibold">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes or details..." 
                      rows={4} 
                      {...field} 
                      className="bg-slate-900 border-slate-700 focus:ring-primary focus:border-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Links Section */}
            <div className="space-y-3">
              <FormLabel className="text-primary font-semibold flex items-center gap-2">
                <Link className="h-4 w-4" />
                Links & Resources
              </FormLabel>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a link (URL)"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="bg-slate-900 border-slate-700"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                />
                <Button
                  type="button"
                  onClick={addLink}
                  className="bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {form.watch('links')?.length > 0 && (
                <div className="space-y-2">
                  {form.watch('links')?.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-700">
                      <Link className="h-4 w-4 text-blue-400" />
                      <span className="flex-1 text-sm text-slate-300 truncate">{link}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(index)}
                        className="h-6 w-6 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-slate-700" />
            
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