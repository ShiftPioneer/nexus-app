
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Target } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TimeframeQuestions from "./TimeframeQuestions";

interface GoalCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal?: Goal | null;
  existingGoals: Goal[];
  onGoalCreate: (goal: Goal) => void;
}

const categories = [
  { value: 'wealth' as const, label: 'Wealth & Finance', icon: '💰' },
  { value: 'health' as const, label: 'Health & Fitness', icon: '🏃' },
  { value: 'relationships' as const, label: 'Relationships', icon: '❤️' },
  { value: 'spirituality' as const, label: 'Spirituality', icon: '🧘' },
  { value: 'education' as const, label: 'Education & Learning', icon: '📚' },
  { value: 'career' as const, label: 'Career & Business', icon: '💼' }
];

const timeframes = [
  { value: 'week' as const, label: 'Weekly Goal', duration: '1 week' },
  { value: 'month' as const, label: 'Monthly Goal', duration: '1 month' },
  { value: 'quarter' as const, label: 'Quarterly Goal', duration: '3 months' },
  { value: 'year' as const, label: 'Annual Goal', duration: '1 year' },
  { value: 'decade' as const, label: 'Decade Goal', duration: '10 years' },
  { value: 'lifetime' as const, label: 'Lifetime Goal', duration: 'Lifetime' }
];

const GoalCreationDialog: React.FC<GoalCreationDialogProps> = ({
  open,
  onOpenChange,
  initialGoal,
  existingGoals,
  onGoalCreate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Goal['category'] | '',
    timeframe: '' as Goal['timeframe'] | '',
    startDate: new Date(),
    endDate: new Date(),
    priority: 'medium' as Goal['priority'],
    status: 'not-started' as Goal['status'],
    progress: 0,
    milestones: [] as Array<{ id: string; title: string; completed: boolean; dueDate: Date }>,
    tags: [] as string[],
    motivationalQuotes: [] as string[],
    reflectionAnswers: {} as Record<string, string>
  });

  const [newMilestone, setNewMilestone] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showTimeframeQuestions, setShowTimeframeQuestions] = useState(false);

  useEffect(() => {
    if (initialGoal) {
      setFormData({
        title: initialGoal.title,
        description: initialGoal.description || '',
        category: initialGoal.category,
        timeframe: initialGoal.timeframe,
        startDate: initialGoal.startDate,
        endDate: initialGoal.endDate,
        priority: initialGoal.priority,
        status: initialGoal.status,
        progress: initialGoal.progress,
        milestones: initialGoal.milestones.map(m => ({ ...m, dueDate: m.dueDate })),
        tags: initialGoal.tags || [],
        motivationalQuotes: initialGoal.motivationalQuotes || [],
        reflectionAnswers: initialGoal.reflectionAnswers || {}
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        timeframe: '',
        startDate: new Date(),
        endDate: new Date(),
        priority: 'medium',
        status: 'not-started',
        progress: 0,
        milestones: [],
        tags: [],
        motivationalQuotes: [],
        reflectionAnswers: {}
      });
    }
  }, [initialGoal, open]);

  const handleTimeframeChange = (timeframe: Goal['timeframe']) => {
    setFormData(prev => ({ ...prev, timeframe }));
    setShowTimeframeQuestions(true);
  };

  const handleReflectionAnswers = (answers: Record<string, string>) => {
    setFormData(prev => ({ ...prev, reflectionAnswers: { ...prev.reflectionAnswers, ...answers } }));
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      const milestone = {
        id: `milestone-${Date.now()}`,
        title: newMilestone.trim(),
        completed: false,
        dueDate: new Date()
      };
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, milestone]
      }));
      setNewMilestone('');
    }
  };

  const removeMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.timeframe) return;

    // Convert reflection answers to the correct format
    const timeframeAnswers = Object.entries(formData.reflectionAnswers).map(([key, answer], index) => ({
      questionIndex: index,
      answer
    }));

    const goal: Goal = {
      id: initialGoal?.id || `goal-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category as Goal['category'],
      timeframe: formData.timeframe as Goal['timeframe'],
      startDate: formData.startDate,
      endDate: formData.endDate,
      priority: formData.priority,
      status: formData.status,
      progress: formData.progress,
      milestones: formData.milestones,
      tags: formData.tags,
      motivationalQuotes: formData.motivationalQuotes,
      reflectionAnswers: formData.reflectionAnswers,
      timeframeAnswers,
      createdAt: initialGoal?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onGoalCreate(goal);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            {initialGoal ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Goal Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your goal title"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category *</Label>
              <Select value={formData.category} onValueChange={(value: Goal['category']) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal in detail"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
            />
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe" className="text-white">Timeframe *</Label>
            <Select value={formData.timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-slate-700">
                    <div className="flex flex-col">
                      <span>{tf.label}</span>
                      <span className="text-xs text-slate-400">{tf.duration}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Questions */}
          {showTimeframeQuestions && formData.timeframe && (
            <TimeframeQuestions
              timeframe={formData.timeframe}
              answers={formData.reflectionAnswers}
              onAnswersChange={handleReflectionAnswers}
            />
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                      !formData.startDate && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                    className="bg-slate-800"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-white">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                      !formData.endDate && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                    className="bg-slate-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Goal['priority']) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="low" className="text-white hover:bg-slate-700">Low Priority</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-slate-700">Medium Priority</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-slate-700">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={(value: Goal['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="not-started" className="text-white hover:bg-slate-700">Not Started</SelectItem>
                  <SelectItem value="in-progress" className="text-white hover:bg-slate-700">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-slate-700">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <Label className="text-white">Milestones</Label>
            <div className="flex gap-2">
              <Input
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="Add a milestone"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
              />
              <Button onClick={addMilestone} size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                  <span className="text-white">{milestone.title}</span>
                  <Button
                    onClick={() => removeMilestone(milestone.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="text-white">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-slate-700 text-white hover:bg-slate-600 cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.category || !formData.timeframe}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg"
            >
              {initialGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCreationDialog;
