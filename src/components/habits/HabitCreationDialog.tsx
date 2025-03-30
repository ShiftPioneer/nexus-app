
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  initialHabit = null,
}) => {
  const [title, setTitle] = useState(initialHabit?.title || "");
  const [category, setCategory] = useState<string>(initialHabit?.category || "health");
  const [target, setTarget] = useState<number>(initialHabit?.target || 21);
  const [type, setType] = useState<"daily" | "weekly" | "monthly">(initialHabit?.type || "daily");
  
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
    }
  };
  
  const categoryOptions = [
    { value: "health", label: "Health" },
    { value: "mindfulness", label: "Mindfulness" },
    { value: "learning", label: "Learning" },
    { value: "productivity", label: "Productivity" },
    { value: "relationships", label: "Relationships" },
    { value: "finance", label: "Finance" },
    { value: "other", label: "Other" },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
            <DialogDescription>
              {initialHabit 
                ? "Update your habit details below."
                : "Add a new habit to track. Consistent habits lead to long-term success."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Habit Name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Morning Meditation"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Frequency</Label>
              <Select value={type} onValueChange={(val: "daily" | "weekly" | "monthly") => setType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="target">Target (days)</Label>
              <Input
                id="target"
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                It takes at least 21 days to form a habit (recommended)
              </p>
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
    </Dialog>
  );
};

export default HabitCreationDialog;
