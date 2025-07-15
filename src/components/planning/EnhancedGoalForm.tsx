
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TimeframeQuestions from "./TimeframeQuestions";

interface EnhancedGoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: Goal) => void;
  initialGoal?: Goal | null;
}

const EnhancedGoalForm: React.FC<EnhancedGoalFormProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
  initialGoal
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("career");
  const [timeframe, setTimeframe] = useState<Goal['timeframe']>("quarter");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [timeframeAnswersRecord, setTimeframeAnswersRecord] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setCategory(initialGoal.category);
      setTimeframe(initialGoal.timeframe);
      setStartDate(new Date(initialGoal.startDate));
      setEndDate(new Date(initialGoal.endDate));
      setMilestones(initialGoal.milestones || []);
      
      // Convert timeframeAnswers array to Record format for TimeframeQuestions
      const answersRecord: Record<string, string> = {};
      if (initialGoal.timeframeAnswers) {
        initialGoal.timeframeAnswers.forEach((item, index) => {
          answersRecord[`question-${index}`] = item.answer;
        });
      }
      setTimeframeAnswersRecord(answersRecord);
    } else {
      resetForm();
    }
  }, [initialGoal, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("career");
    setTimeframe("quarter");
    setStartDate(new Date());
    setEndDate(new Date());
    setMilestones([]);
    setTimeframeAnswersRecord({});
  };

  const handleTimeframeAnswerChange = (answers: Record<string, string>) => {
    setTimeframeAnswersRecord(answers);
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: "",
      completed: false,
      dueDate: new Date()
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert Record format back to array format for storage
    const timeframeAnswers = Object.entries(timeframeAnswersRecord).map(([key, answer], index) => ({
      questionIndex: index,
      answer: answer || ''
    }));

    const goalData: Goal = {
      id: initialGoal?.id || Date.now().toString(),
      title,
      description,
      category: category as Goal['category'],
      timeframe,
      progress: initialGoal?.progress || 0,
      startDate,
      endDate,
      milestones,
      status: initialGoal?.status || "not-started",
      priority: initialGoal?.priority || "medium",
      tags: initialGoal?.tags || [],
      motivationalQuotes: initialGoal?.motivationalQuotes || [],
      reflectionAnswers: initialGoal?.reflectionAnswers || {},
      timeframeAnswers,
      createdAt: initialGoal?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onGoalCreate(goalData);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {initialGoal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white font-medium">Goal Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your goal title"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal in detail"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white font-medium">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="wealth">💰 Wealth</SelectItem>
                    <SelectItem value="health">🏃 Health</SelectItem>
                    <SelectItem value="relationships">❤️ Relationships</SelectItem>
                    <SelectItem value="spirituality">🧘 Spirituality</SelectItem>
                    <SelectItem value="education">📚 Education</SelectItem>
                    <SelectItem value="career">💼 Career</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeframe" className="text-white font-medium">Timeframe</Label>
                <Select value={timeframe} onValueChange={(value: Goal['timeframe']) => {
                  setTimeframe(value);
                  setTimeframeAnswersRecord({}); // Reset answers when timeframe changes
                }}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="week">📅 Week</SelectItem>
                    <SelectItem value="month">🗓️ Month</SelectItem>
                    <SelectItem value="quarter">🏁 Quarter</SelectItem>
                    <SelectItem value="year">🎯 Year</SelectItem>
                    <SelectItem value="decade">🏆 Decade</SelectItem>
                    <SelectItem value="lifetime">👑 Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white font-medium">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-white",
                        !startDate && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-white font-medium">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-white",
                        !endDate && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white font-medium">Milestones</Label>
                  <Button
                    type="button"
                    onClick={addMilestone}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex gap-2 items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                        placeholder="Milestone title"
                        className="flex-1 bg-slate-900 border-slate-600 text-white text-sm"
                      />
                      <Button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <TimeframeQuestions
            timeframe={timeframe}
            answers={timeframeAnswersRecord}
            onAnswersChange={handleTimeframeAnswerChange}
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!title.trim()}
            >
              {initialGoal ? "Update Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedGoalForm;
