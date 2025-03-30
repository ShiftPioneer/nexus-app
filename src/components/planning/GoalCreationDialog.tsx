
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
import { format } from "date-fns";
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

  // If an initial goal is provided, populate the form with its values
  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setCategory(initialGoal.category);
      setTimeframe(initialGoal.timeframe);
      setStartDate(initialGoal.startDate);
      setEndDate(initialGoal.endDate);
      setBlockingGoals(initialGoal.blockingGoals || []);
      setBlockedByGoals(initialGoal.blockedByGoals || []);
    } else {
      resetForm();
    }
  }, [initialGoal]);

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
      blockedByGoals
    };
    
    onGoalCreate(newGoal);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("health");
    setTimeframe("month");
    setStartDate(new Date());
    setEndDate(new Date());
    setBlockingGoals([]);
    setBlockedByGoals([]);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {existingGoals.length > 0 && (
            <>
              <div className="space-y-2">
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
