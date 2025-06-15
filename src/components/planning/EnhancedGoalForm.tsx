import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
interface EnhancedGoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreate: (goal: any) => void;
  initialGoal?: any;
}
const EnhancedGoalForm: React.FC<EnhancedGoalFormProps> = ({
  open,
  onOpenChange,
  onGoalCreate,
  initialGoal
}) => {
  const [step, setStep] = useState(1);
  const [timeframe, setTimeframe] = useState("");
  const [formData, setFormData] = useState<any>({});
  const timeframeQuestions = {
    lifetime: [{
      key: "achievement",
      label: "What do I truly want to achieve in my lifetime?",
      placeholder: "Think beyond money—impact, fulfillment, lifestyle"
    }, {
      key: "meaning",
      label: "Why does this matter to me?",
      placeholder: "Deep reason, beyond surface motivation"
    }, {
      key: "identity",
      label: "Who do I need to become to make this happen?",
      placeholder: "Skills, mindset, discipline?"
    }, {
      key: "lifestyle",
      label: "What kind of life do I want to live daily?",
      placeholder: "Not just at the peak—every single day"
    }, {
      key: "regret",
      label: "If I died today, what would I regret not doing?",
      placeholder: "Force clarity"
    }, {
      key: "sacrifice",
      label: "What am I willing to sacrifice or endure to achieve this?",
      placeholder: "Nothing great comes easy"
    }],
    decade: [{
      key: "track",
      label: "What must I achieve in 10 years to be on track for my lifetime vision?",
      placeholder: "Be specific"
    }, {
      key: "success",
      label: "What level of success will make me say, 'I'm on the right path'?",
      placeholder: "Key indicators of progress"
    }, {
      key: "challenge",
      label: "What's the biggest challenge I will face, and how will I overcome it?",
      placeholder: "Obstacles and solutions"
    }, {
      key: "milestones",
      label: "What are the 3 biggest milestones I must hit to reach this goal?",
      placeholder: "Break it down"
    }, {
      key: "shortcut",
      label: "Who can I learn from to shortcut the journey?",
      placeholder: "Mentors, books, courses?"
    }],
    year: [{
      key: "priority",
      label: "What is the most important goal I must achieve this year?",
      placeholder: "Single biggest priority"
    }, {
      key: "satisfaction",
      label: "If I ONLY achieved this one thing, would I be satisfied?",
      placeholder: "Make it count"
    }, {
      key: "master",
      label: "What must I master this year to reach my 10-year goal?",
      placeholder: "Skills, habits, systems"
    }, {
      key: "obstacle",
      label: "What's the biggest obstacle I will face, and how will I handle it?",
      placeholder: "Key challenges"
    }, {
      key: "milestones",
      label: "What are the 3 critical milestones I must hit?",
      placeholder: "Quarterly targets"
    }],
    quarter: [{
      key: "achievement",
      label: "What's the single most important thing to achieve in the next 90 days?",
      placeholder: "Biggest driver"
    }, {
      key: "priorities",
      label: "What are the 3 biggest priorities to make it happen?",
      placeholder: "Actionable & measurable"
    }, {
      key: "roadblocks",
      label: "What's holding me back from achieving this, and how do I remove the roadblocks?",
      placeholder: "Identify constraints"
    }, {
      key: "measurement",
      label: "How will I measure success at the end of this quarter?",
      placeholder: "Key metrics"
    }],
    month: [{
      key: "result",
      label: "What's the #1 result I need this month?",
      placeholder: "Most impactful outcome"
    }, {
      key: "weekly",
      label: "What must I focus on weekly to make sure I hit this goal?",
      placeholder: "Mini milestones"
    }, {
      key: "daily",
      label: "What specific actions should I repeat daily for momentum?",
      placeholder: "Daily habits"
    }, {
      key: "distraction",
      label: "What's my biggest potential distraction, and how do I eliminate it?",
      placeholder: "Obstacles to overcome"
    }],
    week: [{
      key: "focus",
      label: "What's the ONE thing I must achieve this week?",
      placeholder: "Focus on impact"
    }, {
      key: "actions",
      label: "What 3 key actions will move me closer to my monthly goal?",
      placeholder: "Prioritize"
    }, {
      key: "execution",
      label: "What's stopping me from executing, and how will I overcome it?",
      placeholder: "Execution blockers"
    }, {
      key: "momentum",
      label: "What will I do daily to keep momentum?",
      placeholder: "Small, repeatable tasks"
    }]
  };
  const handleTimeframeSelect = (selectedTimeframe: string) => {
    setTimeframe(selectedTimeframe);
    setStep(2);
  };
  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleSubmit = () => {
    const goal = {
      id: initialGoal?.id || Date.now().toString(),
      title: formData.title || `${timeframe} Goal`,
      timeframe,
      category: formData.category || "career",
      startDate: new Date(),
      endDate: getEndDate(timeframe),
      progress: 0,
      status: "not-started",
      responses: formData,
      ...formData
    };
    onGoalCreate(goal);
    onOpenChange(false);
    setStep(1);
    setFormData({});
    setTimeframe("");
  };
  const getEndDate = (tf: string) => {
    const now = new Date();
    switch (tf) {
      case "week":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case "month":
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      case "quarter":
        return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
      case "year":
        return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      case "decade":
        return new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
      case "lifetime":
        return new Date(now.getFullYear() + 50, now.getMonth(), now.getDate());
      default:
        return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
    }
  };
  const getTimeframeIcon = (tf: string) => {
    switch (tf) {
      case "lifetime":
        return "🏆";
      case "decade":
        return "🎯";
      case "year":
        return "📅";
      case "quarter":
        return "🏃";
      case "month":
        return "📊";
      case "week":
        return "⚡";
      default:
        return "📝";
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-slate-900">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Create New Goal" : `${getTimeframeIcon(timeframe)} ${timeframe.toUpperCase()} GOAL: ${timeframe === "lifetime" ? "Defining Your Legacy" : timeframe === "decade" ? "The Game Plan" : timeframe === "year" ? "Focus & Execution" : timeframe === "quarter" ? "Sprint Mode" : timeframe === "month" ? "Micro Wins, Big Results" : "Action & Accountability"}`}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && <div className="space-y-6">
            <p className="text-muted-foreground">Choose your goal timeframe to get specific questions designed for that time horizon.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {["lifetime", "decade", "year", "quarter", "month", "week"].map(tf => <Button key={tf} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => handleTimeframeSelect(tf)}>
                  <span className="text-2xl">{getTimeframeIcon(tf)}</span>
                  <span className="capitalize font-medium">{tf}</span>
                </Button>)}
            </div>
          </div>}

        {step === 2 && timeframe && <div className="space-y-6">
            <p className="text-muted-foreground">
              Answer these questions to clarify your goal and increase your chances of success.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-cyan-600">Goal Title</label>
                <Input value={formData.title || ""} onChange={e => handleInputChange("title", e.target.value)} placeholder={`Enter your ${timeframe} goal title`} className="bg-slate-900" />
              </div>

              <div>
                <label className="text-sm font-medium text-cyan-600">Category</label>
                <Select value={formData.category || ""} onValueChange={value => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="wealth">Wealth</SelectItem>
                    <SelectItem value="relationships">Relationships</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="spirituality">Spirituality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {timeframeQuestions[timeframe]?.map(question => <div key={question.key} className="space-y-2">
                  <label className="text-sm font-medium text-cyan-600">{question.label}</label>
                  <Textarea value={formData[question.key] || ""} onChange={e => handleInputChange(question.key, e.target.value)} placeholder={question.placeholder} rows={3} />
                </div>)}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="text-orange-600">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title}>
                Create Goal
              </Button>
            </div>
          </div>}
      </DialogContent>
    </Dialog>;
};
export default EnhancedGoalForm;