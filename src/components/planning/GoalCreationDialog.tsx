
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, CheckCircle, ChevronDown, Clock, Info, Layers, Target, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Goal, GoalStatus, Milestone } from "@/types/planning";
import { Card, CardContent } from "@/components/ui/card";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: Goal) => void;
  existingGoals: Goal[];
  existingGoal?: Goal | null;
}

const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
  existingGoals,
  existingGoal
}) => {
  const initialGoal: Goal = {
    id: "",
    title: "",
    description: "",
    status: "not-started" as GoalStatus,
    startDate: new Date(),
    timeframe: "monthly", // Default timeframe
    category: "",
    progress: 0,
    milestones: [],
  };

  const [goal, setGoal] = useState<Goal>(initialGoal);
  const [newMilestone, setNewMilestone] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [parentGoal, setParentGoal] = useState<string | null>(null);

  useEffect(() => {
    if (existingGoal) {
      setGoal(existingGoal);
      // Check if this is a sub-goal
      const parent = existingGoals.find(g => 
        g.subGoals?.some(sg => sg.id === existingGoal.id)
      );
      setParentGoal(parent?.id || null);
    } else {
      setGoal(initialGoal);
      setParentGoal(null);
    }
  }, [existingGoal, existingGoals]);

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.trim(),
        completed: false,
      };
      
      setGoal(prev => ({
        ...prev,
        milestones: [...prev.milestones, milestone]
      }));
      setNewMilestone("");
    }
  };

  const handleToggleMilestone = (id: string) => {
    setGoal(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setGoal(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
  };

  const calculateProgress = () => {
    const { milestones } = goal;
    if (!milestones.length) return 0;
    
    const completedCount = milestones.filter(m => m.completed).length;
    return Math.round((completedCount / milestones.length) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      ...goal,
      id: goal.id || Date.now().toString(),
      progress: calculateProgress(),
    };
    
    onGoalCreate(newGoal);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            {existingGoal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription>
            {existingGoal 
              ? "Update your goal details and track your progress."
              : "Add a new goal to guide your journey and achieve your vision."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Goal Details</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-6 py-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input 
                      id="title"
                      required
                      value={goal.title}
                      onChange={(e) => setGoal({...goal, title: e.target.value})}
                      placeholder="Enter goal title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={goal.description}
                      onChange={(e) => setGoal({...goal, description: e.target.value})}
                      placeholder="Describe your goal and why it matters to you"
                      className="mt-1 h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input 
                        id="category"
                        value={goal.category}
                        onChange={(e) => setGoal({...goal, category: e.target.value})}
                        placeholder="e.g. Career, Health, Learning"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={goal.status}
                        onValueChange={(value: GoalStatus) => setGoal({...goal, status: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left font-normal",
                              !goal.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {goal.startDate ? format(new Date(goal.startDate), "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(goal.startDate)}
                            onSelect={(date) => date && setGoal({...goal, startDate: date})}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left font-normal",
                              !goal.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {goal.dueDate ? format(new Date(goal.dueDate), "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={goal.dueDate ? new Date(goal.dueDate) : undefined}
                            onSelect={(date) => setGoal({...goal, dueDate: date || undefined})}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select 
                      value={goal.timeframe}
                      onValueChange={(value) => setGoal({...goal, timeframe: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="5-year">5 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {existingGoals.length > 0 && (
                    <div>
                      <Label htmlFor="parentGoal">Parent Goal (Optional)</Label>
                      <Select 
                        value={parentGoal || ""}
                        onValueChange={(value) => setParentGoal(value || null)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select parent goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Parent Goal</SelectItem>
                          {existingGoals
                            .filter(g => g.id !== goal.id && !g.subGoals?.find(sg => sg.id === goal.id))
                            .map(g => (
                              <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Info className="inline h-3 w-3 mr-1" />
                        Sub-goals automatically contribute to the parent goal's progress.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="milestones" className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Add Milestones</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Break down your goal into smaller, achievable milestones to track your progress.
                </p>
                
                <div className="flex space-x-2 mb-4">
                  <Input 
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="Add a milestone..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
                  />
                  <Button 
                    type="button"
                    onClick={handleAddMilestone}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {goal.milestones.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No milestones added yet. Add some milestones to track your progress.
                    </p>
                  ) : (
                    goal.milestones.map((milestone) => (
                      <Card key={milestone.id} className={cn(
                        "border",
                        milestone.completed ? "bg-primary/5 border-primary/20" : ""
                      )}>
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm" 
                              className={cn(
                                "h-6 w-6 p-0 rounded-full",
                                milestone.completed ? "text-primary" : "text-muted-foreground"
                              )}
                              onClick={() => handleToggleMilestone(milestone.id)}
                            >
                              <CheckCircle className={cn(
                                "h-5 w-5", 
                                milestone.completed ? "fill-current" : ""
                              )} />
                            </Button>
                            <span className={cn(
                              "text-sm",
                              milestone.completed ? "line-through text-muted-foreground" : ""
                            )}>
                              {milestone.title}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive/80"
                            onClick={() => handleRemoveMilestone(milestone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Current Progress</h4>
                  <Badge variant="outline">{calculateProgress()}%</Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Progress is automatically calculated based on completed milestones.
                </p>
              </div>
            </TabsContent>
            
            <DialogFooter className="px-6 py-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FF6500] hover:bg-[#E55A00]"
              >
                {existingGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;
