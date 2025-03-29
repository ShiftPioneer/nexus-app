
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { format } from "date-fns";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: Omit<Goal, "id">) => void;
}

const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newGoal: Omit<Goal, "id"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as Goal["category"],
      timeframe: formData.get("timeframe") as Goal["timeframe"],
      progress: 0,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      status: "not-started",
      milestones: [],
    };
    
    onGoalCreate(newGoal);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            Set a new goal and track your progress towards achieving it.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input id="title" name="title" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wealth">Wealth</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="spirituality">Spirituality</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select name="timeframe" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short Term</SelectItem>
                  <SelectItem value="long-term">Long Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="date"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="date"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
                required 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;
