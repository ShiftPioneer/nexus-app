
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
import { Calendar } from "@/components/ui/calendar";
import { format, addWeeks, addMonths, addYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: Goal) => void;
  existingGoals: Goal[];
  initialGoal?: Goal | null;
}

interface TimeframeQuestion {
  question: string;
  placeholder: string;
}

const timeframeQuestions: Record<string, { title: string; questions: TimeframeQuestion[] }> = {
  lifetime: {
    title: "🏆 LIFETIME GOAL: Defining Your Legacy",
    questions: [
      { question: "What do I truly want to achieve in my lifetime?", placeholder: "Think beyond money—impact, fulfillment, lifestyle" },
      { question: "Why does this matter to me?", placeholder: "Deep reason, beyond surface motivation" },
      { question: "Who do I need to become to make this happen?", placeholder: "Skills, mindset, discipline?" },
      { question: "What kind of life do I want to live daily?", placeholder: "Not just at the peak—every single day" },
      { question: "If I died today, what would I regret not doing?", placeholder: "Force clarity" },
      { question: "What am I willing to sacrifice or endure to achieve this?", placeholder: "Nothing great comes easy" },
    ]
  },
  decade: {
    title: "🔟 10-YEAR GOAL: The Game Plan",
    questions: [
      { question: "What must I achieve in 10 years to be on track for my lifetime vision?", placeholder: "Be specific" },
      { question: "What level of success will make me say, 'I'm on the right path'?", placeholder: "Key indicators of progress" },
      { question: "What's the biggest challenge I will face, and how will I overcome it?", placeholder: "Obstacles and solutions" },
      { question: "What are the 3 biggest milestones I must hit to reach this goal?", placeholder: "Break it down" },
      { question: "Who can I learn from to shortcut the journey?", placeholder: "Mentors, books, courses?" },
    ]
  },
  year: {
    title: "📅 1-YEAR GOAL: Focus & Execution",
    questions: [
      { question: "What is the most important goal I must achieve this year?", placeholder: "Single biggest priority" },
      { question: "If I ONLY achieved this one thing, would I be satisfied?", placeholder: "Make it count" },
      { question: "What must I master this year to reach my 10-year goal?", placeholder: "Skills, habits, systems" },
      { question: "What's the biggest obstacle I will face, and how will I handle it?", placeholder: "Key challenges" },
      { question: "What are the 3 critical milestones I must hit?", placeholder: "Quarterly targets" },
    ]
  },
  quarter: {
    title: "🏁 QUARTERLY GOAL: Sprint Mode",
    questions: [
      { question: "What's the single most important thing to achieve in the next 90 days?", placeholder: "Biggest driver" },
      { question: "What are the 3 biggest priorities to make it happen?", placeholder: "Actionable & measurable" },
      { question: "What's holding me back from achieving this, and how do I remove the roadblocks?", placeholder: "Identify constraints" },
      { question: "How will I measure success at the end of this quarter?", placeholder: "Key metrics" },
    ]
  },
  month: {
    title: "📆 MONTHLY GOAL: Micro Wins, Big Results",
    questions: [
      { question: "What's the #1 result I need this month?", placeholder: "Most impactful outcome" },
      { question: "What must I focus on weekly to make sure I hit this goal?", placeholder: "Mini milestones" },
      { question: "What specific actions should I repeat daily for momentum?", placeholder: "Daily habits" },
      { question: "What's my biggest potential distraction, and how do I eliminate it?", placeholder: "Obstacles to overcome" },
    ]
  },
  week: {
    title: "📅 WEEKLY GOALS: Action & Accountability",
    questions: [
      { question: "What's the ONE thing I must achieve this week?", placeholder: "Focus on impact" },
      { question: "What 3 key actions will move me closer to my monthly goal?", placeholder: "Prioritize" },
      { question: "What's stopping me from executing, and how will I overcome it?", placeholder: "Execution blockers" },
      { question: "What will I do daily to keep momentum?", placeholder: "Small, repeatable tasks" },
    ]
  }
};

const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
  existingGoals,
  initialGoal = null,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("health");
  const [timeframe, setTimeframe] = useState<Goal["timeframe"]>("month");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [blockingGoals, setBlockingGoals] = useState<string[]>([]);
  const [blockedByGoals, setBlockedByGoals] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startDateInputValue, setStartDateInputValue] = useState("");
  const [endDateInputValue, setEndDateInputValue] = useState("");

  // If an initial goal is provided, populate the form with its values
  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setCategory(initialGoal.category);
      setTimeframe(initialGoal.timeframe);
      setStartDate(initialGoal.startDate);
      setEndDate(initialGoal.endDate);
      setStartDateInputValue(format(initialGoal.startDate, "yyyy-MM-dd"));
      setEndDateInputValue(format(initialGoal.endDate, "yyyy-MM-dd"));
      setBlockingGoals(initialGoal.blockingGoals || []);
      setBlockedByGoals(initialGoal.blockedByGoals || []);
    } else {
      resetForm();
    }
  }, [initialGoal, open]);

  // Update end date based on start date and timeframe
  const calculateEndDate = (start: Date, tf: string): Date => {
    switch (tf) {
      case "week":
        return addWeeks(start, 1);
      case "month":
        return addMonths(start, 1);
      case "quarter":
        return addMonths(start, 3);
      case "year":
        return addYears(start, 1);
      case "decade":
        return addYears(start, 10);
      case "lifetime":
        return addYears(start, 50);
      default:
        return addMonths(start, 1);
    }
  };

  // When timeframe or start date changes, recalculate end date
  useEffect(() => {
    const newEndDate = calculateEndDate(startDate, timeframe);
    setEndDate(newEndDate);
    setEndDateInputValue(format(newEndDate, "yyyy-MM-dd"));
  }, [timeframe, startDate]);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    setStartDateInputValue(format(date, "yyyy-MM-dd"));
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    setEndDateInputValue(format(date, "yyyy-MM-dd"));
  };

  const handleStartDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDateInputValue(value);
    
    // Try to create a date from the input
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setStartDate(date);
    }
  };

  const handleEndDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDateInputValue(value);
    
    // Try to create a date from the input
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setEndDate(date);
    }
  };

  const handleSubmit = () => {
    const newGoal: Goal = {
      id: initialGoal?.id || "",
      title,
      description,
      category,
      timeframe,
      progress: initialGoal?.progress || 0,
      startDate,
      endDate,
      status: initialGoal?.status || "not-started",
      milestones: initialGoal?.milestones || [],
      blockingGoals,
      blockedByGoals,
      timeframeAnswers: Object.entries(answers).map(([index, answer]) => ({
        questionIndex: parseInt(index),
        answer
      }))
    };
    
    onGoalCreate(newGoal);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("health");
    setTimeframe("month");
    
    const now = new Date();
    setStartDate(now);
    setStartDateInputValue(format(now, "yyyy-MM-dd"));
    
    const newEndDate = calculateEndDate(now, "month");
    setEndDate(newEndDate);
    setEndDateInputValue(format(newEndDate, "yyyy-MM-dd"));
    
    setBlockingGoals([]);
    setBlockedByGoals([]);
    setAnswers({});
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your goal title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as Goal["category"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="wealth">Wealth</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="spirituality">Spirituality</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={timeframe}
                onValueChange={(val) => setTimeframe(val as Goal["timeframe"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="decade">Decade</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  value={startDateInputValue} 
                  onChange={handleStartDateInputChange}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="px-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && handleStartDateChange(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  value={endDateInputValue} 
                  onChange={handleEndDateInputChange}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="px-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && handleEndDateChange(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {timeframeQuestions[timeframe] && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">{timeframeQuestions[timeframe].title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Answer these questions to clarify your goal and increase your chances of success.
                </p>
              </div>
              
              {timeframeQuestions[timeframe].questions.map((q, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`question-${index}`}>{q.question}</Label>
                  <Textarea
                    id={`question-${index}`}
                    value={answers[index] || ''}
                    onChange={(e) => setAnswers({...answers, [index]: e.target.value})}
                    placeholder={q.placeholder}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}

          {existingGoals.length > 0 && (
            <>
              <div className="space-y-2 border-t pt-4 mt-4">
                <h3 className="text-md font-semibold">Goal Dependencies</h3>
                <Label>Blocking</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                  {existingGoals
                    .filter(goal => initialGoal ? goal.id !== initialGoal.id : true)
                    .map(goal => (
                    <div key={`blocking-${goal.id}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id={`blocking-${goal.id}`}
                        checked={blockingGoals.includes(goal.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBlockingGoals([...blockingGoals, goal.id]);
                          } else {
                            setBlockingGoals(blockingGoals.filter(id => id !== goal.id));
                          }
                        }}
                      />
                      <label htmlFor={`blocking-${goal.id}`} className="text-sm">{goal.title}</label>
                    </div>
                  ))}
                  {existingGoals.filter(goal => initialGoal ? goal.id !== initialGoal.id : true).length === 0 && 
                    <p className="text-sm text-muted-foreground">No existing goals to select</p>
                  }
                </div>
              </div>

              <div className="space-y-2">
                <Label>Blocked By</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                  {existingGoals
                    .filter(goal => initialGoal ? goal.id !== initialGoal.id : true)
                    .map(goal => (
                    <div key={`blockedby-${goal.id}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id={`blockedby-${goal.id}`}
                        checked={blockedByGoals.includes(goal.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBlockedByGoals([...blockedByGoals, goal.id]);
                          } else {
                            setBlockedByGoals(blockedByGoals.filter(id => id !== goal.id));
                          }
                        }}
                      />
                      <label htmlFor={`blockedby-${goal.id}`} className="text-sm">{goal.title}</label>
                    </div>
                  ))}
                  {existingGoals.filter(goal => initialGoal ? goal.id !== initialGoal.id : true).length === 0 && 
                    <p className="text-sm text-muted-foreground">No existing goals to select</p>
                  }
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {initialGoal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;
