
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
import TimeframeQuestions from "./TimeframeQuestions";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  // Optional timeframe-specific questions
  weeklyQuestion1: z.string().optional(),
  weeklyQuestion2: z.string().optional(),
  weeklyQuestion3: z.string().optional(),
  weeklyQuestion4: z.string().optional(),
  monthlyQuestion1: z.string().optional(),
  monthlyQuestion2: z.string().optional(),
  monthlyQuestion3: z.string().optional(),
  monthlyQuestion4: z.string().optional(),
  quarterlyQuestion1: z.string().optional(),
  quarterlyQuestion2: z.string().optional(),
  quarterlyQuestion3: z.string().optional(),
  quarterlyQuestion4: z.string().optional(),
  yearlyQuestion1: z.string().optional(),
  yearlyQuestion2: z.string().optional(),
  yearlyQuestion3: z.string().optional(),
  yearlyQuestion4: z.string().optional(),
  yearlyQuestion5: z.string().optional(),
  decadeQuestion1: z.string().optional(),
  decadeQuestion2: z.string().optional(),
  decadeQuestion3: z.string().optional(),
  decadeQuestion4: z.string().optional(),
  decadeQuestion5: z.string().optional(),
  lifetimeQuestion1: z.string().optional(),
  lifetimeQuestion2: z.string().optional(),
  lifetimeQuestion3: z.string().optional(),
  lifetimeQuestion4: z.string().optional(),
  lifetimeQuestion5: z.string().optional(),
  lifetimeQuestion6: z.string().optional(),
});

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: Goal) => void;
  initialGoal: Goal | null;
  existingGoals: Goal[];
}

const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
  initialGoal,
  existingGoals,
}) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 3));
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneInput, setMilestoneInput] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState<Date>(new Date());
  const isEditMode = !!initialGoal;
  const [showTimeframeQuestions, setShowTimeframeQuestions] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialGoal?.title || "",
      description: initialGoal?.description || "",
      category: initialGoal?.category || "career",
      timeframe: initialGoal?.timeframe || "quarter",
    },
  });

  // Set form defaults when initialGoal changes
  useEffect(() => {
    if (initialGoal) {
      const formValues: any = {
        title: initialGoal.title,
        description: initialGoal.description,
        category: initialGoal.category,
        timeframe: initialGoal.timeframe,
      };
      
      // Set timeframe question answers if they exist
      if (initialGoal.timeframeAnswers) {
        initialGoal.timeframeAnswers.forEach(item => {
          const fieldName = getTimeframeQuestionField(initialGoal.timeframe, item.questionIndex);
          if (fieldName) {
            formValues[fieldName] = item.answer;
          }
        });
      }
      
      form.reset(formValues);
      
      setStartDate(new Date(initialGoal.startDate));
      setEndDate(new Date(initialGoal.endDate));
      setMilestones(initialGoal.milestones || []);
    } else {
      form.reset({
        title: "",
        description: "",
        category: "career",
        timeframe: "quarter",
      });
      setStartDate(new Date());
      setEndDate(addMonths(new Date(), 3));
      setMilestones([]);
    }
  }, [initialGoal, open]);

  const getTimeframeQuestionField = (timeframe: string, index: number): string => {
    return `${timeframe}Question${index + 1}`;
  };

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
    // Extract timeframe-specific questions and answers
    const timeframeAnswers: { questionIndex: number; answer: string }[] = [];
    const timeframe = data.timeframe;
    
    // Determine which questions to extract based on timeframe
    const questionFields: string[] = [];
    if (timeframe === "week") {
      questionFields.push("weeklyQuestion1", "weeklyQuestion2", "weeklyQuestion3", "weeklyQuestion4");
    } else if (timeframe === "month") {
      questionFields.push("monthlyQuestion1", "monthlyQuestion2", "monthlyQuestion3", "monthlyQuestion4");
    } else if (timeframe === "quarter") {
      questionFields.push("quarterlyQuestion1", "quarterlyQuestion2", "quarterlyQuestion3", "quarterlyQuestion4");
    } else if (timeframe === "year") {
      questionFields.push("yearlyQuestion1", "yearlyQuestion2", "yearlyQuestion3", "yearlyQuestion4", "yearlyQuestion5");
    } else if (timeframe === "decade") {
      questionFields.push("decadeQuestion1", "decadeQuestion2", "decadeQuestion3", "decadeQuestion4", "decadeQuestion5");
    } else if (timeframe === "lifetime") {
      questionFields.push("lifetimeQuestion1", "lifetimeQuestion2", "lifetimeQuestion3", "lifetimeQuestion4", "lifetimeQuestion5", "lifetimeQuestion6");
    }
    
    // Extract answers for the relevant questions
    questionFields.forEach((field, index) => {
      const answer = data[field as keyof typeof data];
      if (answer && typeof answer === 'string' && answer.trim() !== '') {
        timeframeAnswers.push({
          questionIndex: index,
          answer: answer.trim()
        });
      }
    });

    const newGoal: Goal = {
      id: initialGoal?.id || uuidv4(),
      title: data.title,
      description: data.description || "",
      category: data.category as any,
      timeframe: data.timeframe as any,
      progress: initialGoal?.progress || 0,
      startDate: startDate,
      endDate: endDate,
      milestones: milestones,
      status: initialGoal?.status || "not-started",
      timeframeAnswers: timeframeAnswers
    };

    onGoalCreate(newGoal);

    // Save to localStorage as well to ensure it appears on dashboard
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      let updatedGoals = [];
      
      if (savedGoals) {
        const existingGoals = JSON.parse(savedGoals);
        
        if (isEditMode) {
          // Update existing goal
          updatedGoals = existingGoals.map((goal: Goal) => 
            goal.id === newGoal.id ? newGoal : goal
          );
        } else {
          // Add new goal
          updatedGoals = [...existingGoals, newGoal];
        }
      } else {
        updatedGoals = [newGoal];
      }
      
      localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
      
      toast({
        title: isEditMode ? "Plan Updated" : "Plan Created",
        description: `Your plan has been ${isEditMode ? 'updated' : 'created'} and saved.`
      });
    } catch (error) {
      console.error("Failed to save goal to localStorage:", error);
      
      toast({
        title: "Warning",
        description: "Your plan was created but may not appear on the dashboard.",
        variant: "destructive"
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>
            Define your plan with clear milestones to track progress.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plan title" {...field} />
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
                    <Textarea
                      placeholder="What do you want to achieve?"
                      className="min-h-[80px]"
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
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="pointer-events-auto">
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
                    <FormLabel>Timeframe</FormLabel>
                    <Select
                      onValueChange={(value) => handleTimeframeChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="pointer-events-auto">
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
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Milestones</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowTimeframeQuestions(!showTimeframeQuestions)}
                >
                  {showTimeframeQuestions ? "Hide Questions" : "Show Questions"}
                </Button>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    placeholder="Add milestone"
                    className="flex-1"
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
                          "w-[130px] pl-3 text-left font-normal",
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
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={milestoneDueDate}
                        onSelect={(date) => date && setMilestoneDueDate(date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMilestone}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => handleToggleMilestone(milestone.id)}
                        className="rounded-sm"
                      />
                      <span className={cn(milestone.completed && "line-through text-muted-foreground")}>
                        {milestone.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(milestone.dueDate), "PP")}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {showTimeframeQuestions && (
              <TimeframeQuestions timeframe={form.getValues().timeframe} form={form} />
            )}

            <DialogFooter>
              <Button type="submit">{isEditMode ? "Update Plan" : "Create Plan"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;
