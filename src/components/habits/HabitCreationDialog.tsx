import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
interface HabitCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitCreate: (habit: Habit) => void;
  initialHabit?: Habit | null;
}
const HabitCreationDialog: React.FC<HabitCreationDialogProps> = ({
  open,
  onOpenChange,
  onHabitCreate,
  initialHabit = null
}) => {
  const [title, setTitle] = useState(initialHabit?.title || "");
  const [category, setCategory] = useState<HabitCategory>(initialHabit?.category || "health");
  const [target, setTarget] = useState<number>(initialHabit?.target || 21);
  const [type, setType] = useState<"daily" | "weekly" | "monthly">(initialHabit?.type || "daily");
  const [duration, setDuration] = useState(initialHabit?.duration || "10 minutes");
  const [scoreValue, setScoreValue] = useState(initialHabit?.scoreValue || 5);
  const [penaltyValue, setPenaltyValue] = useState(initialHabit?.penaltyValue || 10);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    const habit: Habit = {
      id: initialHabit?.id || `habit-${Date.now()}`,
      title,
      category,
      streak: initialHabit?.streak || 0,
      target,
      status: initialHabit?.status || "pending",
      completionDates: initialHabit?.completionDates || [],
      type,
      createdAt: initialHabit?.createdAt || new Date(),
      duration,
      scoreValue,
      penaltyValue
    };
    onHabitCreate(habit);
    resetForm();
  };
  const resetForm = () => {
    if (!initialHabit) {
      setTitle("");
      setCategory("health");
      setTarget(21);
      setType("daily");
      setDuration("10 minutes");
      setScoreValue(5);
      setPenaltyValue(10);
    }
  };
  const categoryOptions = [{
    value: "health",
    label: "Health"
  }, {
    value: "mindfulness",
    label: "Mindfulness"
  }, {
    value: "learning",
    label: "Learning"
  }, {
    value: "productivity",
    label: "Productivity"
  }, {
    value: "relationships",
    label: "Relationships"
  }, {
    value: "finance",
    label: "Finance"
  }, {
    value: "religion",
    label: "Religion"
  }, {
    value: "other",
    label: "Other"
  }];
  const commitmentOptions = [{
    value: "3",
    label: "3 Days"
  }, {
    value: "7",
    label: "7 Days"
  }, {
    value: "21",
    label: "21 Days"
  }, {
    value: "30",
    label: "30 Days"
  }, {
    value: "90",
    label: "90 Days"
  }, {
    value: "365",
    label: "365 Days"
  }, {
    value: "9999",
    label: "Forever"
  }];
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-lg bg-slate-950">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
            <DialogDescription>
              {initialHabit ? "Update your habit details below." : "Define your new habit to start building consistency"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Habit Name</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What habit would you like to build?" required />
              <p className="text-xs text-muted-foreground">
                Be specific (e.g., "Meditate for 10 minutes" instead of just "Meditate")
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(val: "daily" | "weekly" | "monthly") => setType(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(val: HabitCategory) => setCategory(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 10 minutes" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target">Initial Commitment</Label>
                <Select value={target.toString()} onValueChange={val => setTarget(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    {commitmentOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Gamification Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="scoreValue">Score Value (when completed)</Label>
                  <div className="flex items-center">
                    <Input id="scoreValue" type="number" min={1} value={scoreValue} onChange={e => setScoreValue(parseInt(e.target.value))} className="rounded-r-none" />
                    <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">points</span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="penaltyValue">Penalty Value (when missed)</Label>
                  <div className="flex items-center">
                    <Input id="penaltyValue" type="number" min={0} value={penaltyValue} onChange={e => setPenaltyValue(parseInt(e.target.value))} className="rounded-r-none" />
                    <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialHabit ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
};
export default HabitCreationDialog;