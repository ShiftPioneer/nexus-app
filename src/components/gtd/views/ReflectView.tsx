
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { Check, BarChart3, TrendingUp, Target, Calendar, Users, Brain, Lightbulb, CheckCircle, Star } from "lucide-react";
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

const ReflectView: React.FC = () => {
  const { tasks } = useGTD();
  
  const [weeklyChecklist, setWeeklyChecklist] = useState<ChecklistItems>({
    reviewCollectionPoints: false,
    processNotes: false,
    reviewPreviousCalendar: false,
    reviewUpcomingCalendar: false,
    reviewWaitingFor: false,
    reviewProjects: false,
    reviewNextActions: false,
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
    reviewCollectionPoints: "Review and empty collection points",
    processNotes: "Process all notes and materials",
    reviewPreviousCalendar: "Review previous calendar data",
    reviewUpcomingCalendar: "Review upcoming calendar",
    reviewWaitingFor: "Review waiting for list",
    reviewProjects: "Review projects list",
    reviewNextActions: "Review next actions list",
    reviewSomedayMaybe: "Review someday/maybe list",
    beCreative: "Be creative and courageous"
  };

  const monthlyChecklistLabels = {
    reviewGoals: "Review goals and objectives",
    reviewProjectOutcomes: "Review project outcomes",
    evaluatePerformance: "Evaluate last month's performance",
    planNextMonth: "Plan next month's objectives"
  };

  const reflectionQuestions = [
    "What went well this week?",
    "What could be improved for next week?",
    "Are my current projects aligned with my goals?",
    "What contexts are most active right now?",
    "Do I need to reconsider any of my someday/maybe items?"
  ];

  const taskCounts = {
    nextActions: tasks.filter(t => t.status === "next-action").length,
    projects: tasks.filter(t => t.status === "project").length,
    waitingFor: tasks.filter(t => t.status === "waiting-for").length,
    completed: tasks.filter(t => t.status === "completed").length,
    total: tasks.length
  };

  const weeklyProgress = Math.round((Object.values(weeklyChecklist).filter(Boolean).length / Object.values(weeklyChecklist).length) * 100);
  const monthlyProgress = Math.round((Object.values(monthlyChecklist).filter(Boolean).length / Object.values(monthlyChecklist).length) * 100);

  const toggleChecklistItem = (checklist: ChecklistItems, setChecklist: React.Dispatch<React.SetStateAction<ChecklistItems>>, itemKey: string) => {
    setChecklist(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const markAllComplete = (checklist: ChecklistItems, setChecklist: React.Dispatch<React.SetStateAction<ChecklistItems>>) => {
    const allComplete = Object.keys(checklist).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as ChecklistItems);
    setChecklist(allComplete);
  };

  const resetChecklist = (checklist: ChecklistItems, setChecklist: React.Dispatch<React.SetStateAction<ChecklistItems>>) => {
    const allIncomplete = Object.keys(checklist).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as ChecklistItems);
    setChecklist(allIncomplete);
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen p-6">
      {/* Header Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-2xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Weekly Review & Reflection
            </h1>
            <p className="text-slate-400 text-lg">Take time to review your progress and plan ahead</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{weeklyProgress}%</p>
                <p className="text-sm text-slate-400">Weekly Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{monthlyProgress}%</p>
                <p className="text-sm text-slate-400">Monthly Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{taskCounts.nextActions + taskCounts.projects}</p>
                <p className="text-sm text-slate-400">Active Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-orange-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{taskCounts.completed}</p>
                <p className="text-sm text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Checklists */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Weekly Review Checklist */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Weekly Review Checklist</CardTitle>
                  <CardDescription className="text-slate-400">Complete your weekly review process</CardDescription>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {Object.values(weeklyChecklist).filter(Boolean).length}/{Object.values(weeklyChecklist).length}
              </Badge>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(weeklyChecklistLabels).map(([key, label]) => (
              <div 
                key={key} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  weeklyChecklist[key] 
                    ? 'bg-cyan-500/10 border border-cyan-500/30' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50'
                }`}
                onClick={() => toggleChecklistItem(weeklyChecklist, setWeeklyChecklist, key)}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-200 ${
                  weeklyChecklist[key] 
                    ? 'bg-cyan-500 border-cyan-500' 
                    : 'border-slate-600 hover:border-cyan-500/50'
                }`}>
                  {weeklyChecklist[key] && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className={`text-sm ${weeklyChecklist[key] ? 'text-cyan-300 line-through' : 'text-slate-300'}`}>
                  {label}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => markAllComplete(weeklyChecklist, setWeeklyChecklist)}
                size="sm" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Mark All Complete
              </Button>
              <Button 
                onClick={() => resetChecklist(weeklyChecklist, setWeeklyChecklist)}
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Monthly Review</CardTitle>
                  <CardDescription className="text-slate-400">Review your bigger picture goals</CardDescription>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {Object.values(monthlyChecklist).filter(Boolean).length}/{Object.values(monthlyChecklist).length}
              </Badge>
            </div>
            <Progress value={monthlyProgress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(monthlyChecklistLabels).map(([key, label]) => (
              <div 
                key={key} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  monthlyChecklist[key] 
                    ? 'bg-purple-500/10 border border-purple-500/30' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50'
                }`}
                onClick={() => toggleChecklistItem(monthlyChecklist, setMonthlyChecklist, key)}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-200 ${
                  monthlyChecklist[key] 
                    ? 'bg-purple-500 border-purple-500' 
                    : 'border-slate-600 hover:border-purple-500/50'
                }`}>
                  {monthlyChecklist[key] && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className={`text-sm ${monthlyChecklist[key] ? 'text-purple-300 line-through' : 'text-slate-300'}`}>
                  {label}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => markAllComplete(monthlyChecklist, setMonthlyChecklist)}
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Mark All Complete
              </Button>
              <Button 
                onClick={() => resetChecklist(monthlyChecklist, setMonthlyChecklist)}
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

      {/* Stats and Reflection */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Stats & Insights</CardTitle>
                <CardDescription className="text-slate-400">Your productivity overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Task Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{taskCounts.nextActions}</div>
                  <div className="text-xs text-slate-500">Next Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{taskCounts.projects}</div>
                  <div className="text-xs text-slate-500">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{taskCounts.waitingFor}</div>
                  <div className="text-xs text-slate-500">Waiting For</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Top Contexts</h4>
              <div className="flex flex-wrap gap-2">
                {['work', 'home', 'personal'].map((context) => (
                  <Badge key={context} variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-600/50">
                    {context}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reflection Questions */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Reflection Questions</CardTitle>
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
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 resize-none"
                  rows={2}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReflectView;
