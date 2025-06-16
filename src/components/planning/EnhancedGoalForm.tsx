
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, addMonths, addQuarters, addYears } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  status: z.string().min(1, "Status is required"),
  progress: z.number().min(0).max(100),
});

interface EnhancedGoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: Goal) => void;
  initialGoal: Goal | null;
}

const EnhancedGoalForm: React.FC<EnhancedGoalFormProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
  initialGoal,
}) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 3));
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState<Date>(new Date());
  const isEditMode = !!initialGoal;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "career",
      timeframe: "quarter",
      status: "not-started",
      progress: 0,
    },
  });

  // Set form defaults when initialGoal changes
  useEffect(() => {
    if (initialGoal) {
      form.reset({
        title: initialGoal.title,
        description: initialGoal.description,
        category: initialGoal.category,
        timeframe: initialGoal.timeframe,
        status: initialGoal.status,
        progress: initialGoal.progress || 0,
      });
      
      setStartDate(new Date(initialGoal.startDate));
      setEndDate(new Date(initialGoal.endDate));
      setMilestones(initialGoal.milestones || []);
    } else {
      form.reset({
        title: "",
        description: "",
        category: "career",
        timeframe: "quarter",
        status: "not-started",
        progress: 0,
      });
      setStartDate(new Date());
      setEndDate(addMonths(new Date(), 3));
      setMilestones([]);
    }
  }, [initialGoal, open, form]);

  const handleAddMilestone = () => {
    if (milestoneInput.trim()) {
      const newMilestone: Milestone = {
        id: uuidv4(),
        title: milestoneInput.trim(),
        completed: false,
        dueDate: milestoneDueDate,
      };
      setMilestones([...milestones, newMilestone]);
      setMilestoneInput("");
    }
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id));
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      )
    );
  };

  const handleTimeframeChange = (timeframe: string) => {
    form.setValue("timeframe", timeframe);
    const now = new Date();
    
    let newEndDate;
    switch (timeframe) {
      case "week":
        newEndDate = addDays(now, 7);
        break;
      case "month":
        newEndDate = addMonths(now, 1);
        break;
      case "quarter":
        newEndDate = addQuarters(now, 1);
        break;
      case "year":
        newEndDate = addYears(now, 1);
        break;
      case "decade":
        newEndDate = addYears(now, 10);
        break;
      default:
        newEndDate = addMonths(now, 3);
    }
    
    setEndDate(newEndDate);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const newGoal: Goal = {
      id: initialGoal?.id || uuidv4(),
      title: data.title,
      description: data.description || "",
      category: data.category as any,
      timeframe: data.timeframe as any,
      progress: data.progress,
      startDate: startDate,
      endDate: endDate,
      milestones: milestones,
      status: data.status as any,
    };

    console.log("Submitting goal:", newGoal);
    onGoalCreate(newGoal);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-100">
            {isEditMode ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Define your goal with clear milestones to track progress.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-orange-500 font-medium">Goal Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter goal title" 
                      className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-orange-500" 
                      {...field} 
                    />
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
                  <FormLabel className="text-orange-500 font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you want to achieve?"
                      className="min-h-[80px] bg-slate-900/50 border-slate-700 text-slate-100 focus:border-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-500 font-medium">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="wealth">Wealth & Finance</SelectItem>
                        <SelectItem value="health">Health & Fitness</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                        <SelectItem value="spirituality">Spirituality</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-500 font-medium">Timeframe</FormLabel>
                    <Select
                      onValueChange={(value) => handleTimeframeChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Select a timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="quarter">Quarter</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="decade">Decade</SelectItem>
                        <SelectItem value="lifetime">Lifetime</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-500 font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-500 font-medium">
                      Progress: {field.value}%
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem className="flex flex-col">
                <FormLabel className="text-orange-500 font-medium">Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal bg-slate-900/50 border-slate-700 text-slate-100 hover:bg-slate-800",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              <FormItem className="flex flex-col">
                <FormLabel className="text-orange-500 font-medium">End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal bg-slate-900/50 border-slate-700 text-slate-100 hover:bg-slate-800",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      {endDate ? (
                        format(endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </div>

            <div className="space-y-3">
              <FormLabel className="text-orange-500 font-medium">Milestones</FormLabel>
              <div className="flex space-x-2">
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    placeholder="Add milestone"
                    className="flex-1 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-orange-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddMilestone();
                      }
                    }}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[130px] pl-3 text-left font-normal bg-slate-900/50 border-slate-700 text-slate-100 hover:bg-slate-800",
                          !milestoneDueDate && "text-muted-foreground"
                        )}
                      >
                        {milestoneDueDate ? (
                          format(milestoneDueDate, "PP")
                        ) : (
                          <span>Due date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
                      <Calendar
                        mode="single"
                        selected={milestoneDueDate}
                        onSelect={(date) => date && setMilestoneDueDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMilestone}
                  className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => handleToggleMilestone(milestone.id)}
                        className="rounded-sm w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className={cn("text-slate-200", milestone.completed && "line-through text-slate-500")}>
                        {milestone.title}
                      </span>
                      <span className="text-xs text-slate-400">
                        {format(new Date(milestone.dueDate), "PP")}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
              >
                {isEditMode ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedGoalForm;
