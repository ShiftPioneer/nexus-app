
import React, { useState } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
}

interface HabitCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitCreate: (habit: Habit) => void;
}

const CATEGORIES = [
  "mindfulness",
  "health",
  "learning",
  "productivity",
  "finance",
  "relationship",
  "career",
];

const HabitCreationDialog: React.FC<HabitCreationDialogProps> = ({
  open,
  onOpenChange,
  onHabitCreate,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("mindfulness");
  const [type, setType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [target, setTarget] = useState(10);
  const [scoreValue, setScoreValue] = useState(5);
  const [penaltyValue, setPenaltyValue] = useState(10);
  
  const handleSubmit = () => {
    const newHabit: Habit = {
      id: "",
      title,
      category,
      streak: 0,
      target,
      status: "pending",
      completionDates: [],
      type,
      createdAt: new Date()
    };
    
    onHabitCreate(newHabit);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle("");
    setCategory("mindfulness");
    setType("daily");
    setTarget(10);
    setScoreValue(5);
    setPenaltyValue(10);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What habit would you like to build?"
            />
            <p className="text-xs text-muted-foreground">Be specific (e.g., "Meditate for 10 minutes" instead of just "Meditate")</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as "daily" | "weekly" | "monthly")}
              >
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
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="10 minutes"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target">Initial Commitment</Label>
            <Select
              value={String(target)}
              onValueChange={(val) => setTarget(parseInt(val, 10))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="10">10 Days</SelectItem>
                <SelectItem value="21">21 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="66">66 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-4">Gamification Settings</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">Score Value (when completed)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="score"
                    type="number"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <span className="text-muted-foreground">points</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="penalty">Penalty Value (when missed)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="penalty"
                    type="number"
                    value={penaltyValue}
                    onChange={(e) => setPenaltyValue(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <span className="text-muted-foreground">points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Create Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitCreationDialog;
