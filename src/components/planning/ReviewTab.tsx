import React, { useState } from "react";
import { Check, BarChart3, TrendingUp, Target, Calendar, Brain, Lightbulb, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ChecklistItems {
  [key: string]: boolean;
}

interface ReviewTabProps {
  goals: any[];
  projects: any[];
}

const ReviewTab: React.FC<ReviewTabProps> = ({ goals, projects }) => {
  const [weeklyChecklist, setWeeklyChecklist] = useState<ChecklistItems>({
    reviewInbox: false,
    processNotes: false,
    reviewPreviousCalendar: false,
    reviewUpcomingCalendar: false,
    reviewWaitingFor: false,
    reviewProjects: false,
    reviewGoals: false,
    reviewSomedayMaybe: false,
    beCreative: false
  });

  const [monthlyChecklist, setMonthlyChecklist] = useState<ChecklistItems>({
    reviewGoals: false,
    reviewProjectOutcomes: false,
    evaluatePerformance: false,
    planNextMonth: false
  });

  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});

  const weeklyChecklistLabels = {
    reviewInbox: "Process inbox to zero",
    processNotes: "Process all notes and materials",
    reviewPreviousCalendar: "Review previous calendar data",
    reviewUpcomingCalendar: "Review upcoming calendar",
    reviewWaitingFor: "Follow up on waiting-for items",
    reviewProjects: "Review active projects",
    reviewGoals: "Check goal progress",
    reviewSomedayMaybe: "Review someday/maybe list",
    beCreative: "Brainstorm new ideas"
  };

  const monthlyChecklistLabels = {
    reviewGoals: "Review long-term goals",
    reviewProjectOutcomes: "Evaluate project outcomes",
    evaluatePerformance: "Assess overall performance",
    planNextMonth: "Set next month's priorities"
  };

  const reflectionQuestions = [
    "What went well this week?",
    "What could be improved for next week?",
    "Are my current projects aligned with my goals?",
    "What's blocking my progress?",
    "What should I start, stop, or continue doing?"
  ];

  const weeklyProgress = Math.round((Object.values(weeklyChecklist).filter(Boolean).length / Object.values(weeklyChecklist).length) * 100);
  const monthlyProgress = Math.round((Object.values(monthlyChecklist).filter(Boolean).length / Object.values(monthlyChecklist).length) * 100);

  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status !== 'completed').length;

  const toggleChecklistItem = (checklist: ChecklistItems, setChecklist: React.Dispatch<React.SetStateAction<ChecklistItems>>, itemKey: string) => {
    setChecklist(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const markAllComplete = (setChecklist: React.Dispatch<React.SetStateAction<ChecklistItems>>, labels: Record<string, string>) => {
    const allComplete = Object.keys(labels).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as ChecklistItems);
    setChecklist(allComplete);
  };

  const resetChecklist = (setChecklist: React.Dispatch<React.SetStateAction<ChecklistItems>>, labels: Record<string, string>) => {
    const allIncomplete = Object.keys(labels).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as ChecklistItems);
    setChecklist(allIncomplete);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-2xl">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Weekly Review
            </h2>
            <p className="text-slate-400">Reflect, review, and realign your priorities</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{weeklyProgress}%</p>
                <p className="text-sm text-slate-400">Weekly Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{monthlyProgress}%</p>
                <p className="text-sm text-slate-400">Monthly Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeGoals}</p>
                <p className="text-sm text-slate-400">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeProjects}</p>
                <p className="text-sm text-slate-400">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Checklists */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Weekly Review Checklist */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">Weekly Checklist</CardTitle>
                  <CardDescription className="text-slate-400">Complete your weekly review</CardDescription>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {Object.values(weeklyChecklist).filter(Boolean).length}/{Object.values(weeklyChecklist).length}
              </Badge>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(weeklyChecklistLabels).map(([key, label]) => (
              <div 
                key={key} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  weeklyChecklist[key] 
                    ? 'bg-cyan-500/10 border border-cyan-500/30' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50'
                }`}
                onClick={() => toggleChecklistItem(weeklyChecklist, setWeeklyChecklist, key)}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${
                  weeklyChecklist[key] 
                    ? 'bg-cyan-500 border-cyan-500' 
                    : 'border-slate-600'
                }`}>
                  {weeklyChecklist[key] && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-sm ${weeklyChecklist[key] ? 'text-cyan-300 line-through' : 'text-slate-300'}`}>
                  {label}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-3">
              <Button 
                onClick={() => markAllComplete(setWeeklyChecklist, weeklyChecklistLabels)}
                size="sm" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Complete All
              </Button>
              <Button 
                onClick={() => resetChecklist(setWeeklyChecklist, weeklyChecklistLabels)}
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Review Checklist */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">Monthly Review</CardTitle>
                  <CardDescription className="text-slate-400">Big picture check-in</CardDescription>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {Object.values(monthlyChecklist).filter(Boolean).length}/{Object.values(monthlyChecklist).length}
              </Badge>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(monthlyChecklistLabels).map(([key, label]) => (
              <div 
                key={key} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  monthlyChecklist[key] 
                    ? 'bg-purple-500/10 border border-purple-500/30' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50'
                }`}
                onClick={() => toggleChecklistItem(monthlyChecklist, setMonthlyChecklist, key)}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${
                  monthlyChecklist[key] 
                    ? 'bg-purple-500 border-purple-500' 
                    : 'border-slate-600'
                }`}>
                  {monthlyChecklist[key] && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-sm ${monthlyChecklist[key] ? 'text-purple-300 line-through' : 'text-slate-300'}`}>
                  {label}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-3">
              <Button 
                onClick={() => markAllComplete(setMonthlyChecklist, monthlyChecklistLabels)}
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Complete All
              </Button>
              <Button 
                onClick={() => resetChecklist(setMonthlyChecklist, monthlyChecklistLabels)}
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reflection Questions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Reflection Questions</CardTitle>
                <CardDescription className="text-slate-400">Take time to reflect on your progress</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {reflectionQuestions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">{question}</Label>
                <Textarea
                  value={reflectionAnswers[`question-${index}`] || ''}
                  onChange={(e) => setReflectionAnswers(prev => ({
                    ...prev,
                    [`question-${index}`]: e.target.value
                  }))}
                  placeholder="Write your thoughts..."
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-500 min-h-[80px] resize-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReviewTab;
