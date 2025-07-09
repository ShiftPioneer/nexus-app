
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { Check, BarChart3, TrendingUp, Target, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Checklist from "./reflect/Checklist";
import StatsCard from "./reflect/StatsCard";
import ReflectionQuestions from "./reflect/ReflectionQuestions";

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

  // Count tasks by status
  const taskCounts = {
    nextActions: tasks.filter(t => t.status === "next-action").length,
    projects: tasks.filter(t => t.status === "project").length,
    waitingFor: tasks.filter(t => t.status === "waiting-for").length
  };

  const reflectionQuestions = [
    "What went well this week?",
    "What could be improved for next week?",
    "Are my current projects aligned with my goals?",
    "What contexts are most active right now?",
    "Do I need to reconsider any of my someday/maybe items?"
  ];

  const handleWeeklyChecklistUpdate = (items: ChecklistItems) => {
    setWeeklyChecklist(current => ({ ...current, ...items }));
  };

  const handleMonthlyChecklistUpdate = (items: ChecklistItems) => {
    setMonthlyChecklist(current => ({ ...current, ...items }));
  };

  // Calculate completion percentages
  const weeklyProgress = Math.round((Object.values(weeklyChecklist).filter(Boolean).length / Object.values(weeklyChecklist).length) * 100);
  const monthlyProgress = Math.round((Object.values(monthlyChecklist).filter(Boolean).length / Object.values(monthlyChecklist).length) * 100);

  return (
    <div className="space-y-8">
      {/* Review Progress Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{weeklyProgress}%</p>
                <p className="text-sm text-slate-400">Weekly Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
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

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{taskCounts.nextActions + taskCounts.projects}</p>
                <p className="text-sm text-slate-400">Active Items</p>
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
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Checklist 
          title="Weekly Review Checklist" 
          icon={<Check className="mr-2 h-5 w-5" />} 
          items={weeklyChecklist} 
          setItems={handleWeeklyChecklistUpdate} 
          itemLabels={weeklyChecklistLabels} 
          showActions={true} 
        />

        <Checklist 
          title="Monthly Review" 
          icon={<Check className="mr-2 h-5 w-5" />} 
          items={monthlyChecklist} 
          setItems={handleMonthlyChecklistUpdate} 
          itemLabels={monthlyChecklistLabels} 
          description="Take time to review your bigger picture goals and adjust your projects and next actions accordingly." 
        />
      </motion.div>

      {/* Stats and Reflection */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <StatsCard taskCounts={taskCounts} />
        <ReflectionQuestions questions={reflectionQuestions} />
      </motion.div>
    </div>
  );
};

export default ReflectView;
