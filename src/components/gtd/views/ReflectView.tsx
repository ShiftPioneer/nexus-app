
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, BarChart3, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const ReflectView: React.FC = () => {
  const { tasks } = useGTD();
  const [weeklyChecklist, setWeeklyChecklist] = useState({
    reviewCollectionPoints: false,
    processNotes: false,
    reviewPreviousCalendar: false,
    reviewUpcomingCalendar: false,
    reviewWaitingFor: false,
    reviewProjects: false,
    reviewNextActions: false,
    reviewSomedayMaybe: false,
    beCreative: false,
  });

  const [monthlyChecklist, setMonthlyChecklist] = useState({
    reviewGoals: false,
    reviewProjectOutcomes: false,
    evaluatePerformance: false,
    planNextMonth: false,
  });

  const handleWeeklyCheck = (item: keyof typeof weeklyChecklist) => {
    setWeeklyChecklist({
      ...weeklyChecklist,
      [item]: !weeklyChecklist[item],
    });
  };

  const handleMonthlyCheck = (item: keyof typeof monthlyChecklist) => {
    setMonthlyChecklist({
      ...monthlyChecklist,
      [item]: !monthlyChecklist[item],
    });
  };

  const handleCompleteAllWeekly = () => {
    const allChecked = Object.fromEntries(
      Object.keys(weeklyChecklist).map(key => [key, true])
    ) as typeof weeklyChecklist;
    setWeeklyChecklist(allChecked);
  };

  const handleResetWeekly = () => {
    const allUnchecked = Object.fromEntries(
      Object.keys(weeklyChecklist).map(key => [key, false])
    ) as typeof weeklyChecklist;
    setWeeklyChecklist(allUnchecked);
  };

  // Count tasks by status
  const taskCounts = {
    nextActions: tasks.filter(t => t.status === "next-action").length,
    projects: tasks.filter(t => t.status === "project").length,
    waitingFor: tasks.filter(t => t.status === "waiting-for").length,
  };

  const reflectionQuestions = [
    "What went well this week?",
    "What could be improved for next week?",
    "Are my current projects aligned with my goals?",
    "What contexts are most active right now?",
    "Do I need to reconsider any of my someday/maybe items?",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-900 border-slate-700 text-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Weekly Review Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(weeklyChecklist).map(([key, checked]) => (
            <div key={key} className="flex items-start space-x-2">
              <Checkbox 
                id={key} 
                checked={checked} 
                onCheckedChange={() => handleWeeklyCheck(key as keyof typeof weeklyChecklist)}
                className="mt-1 border-orange-500 text-orange-500"
              />
              <label 
                htmlFor={key} 
                className={`text-sm ${checked ? "line-through text-slate-500" : "text-slate-300"}`}
              >
                {key === "reviewCollectionPoints" && "Review and empty collection points"}
                {key === "processNotes" && "Process all notes and materials"}
                {key === "reviewPreviousCalendar" && "Review previous calendar data"}
                {key === "reviewUpcomingCalendar" && "Review upcoming calendar"}
                {key === "reviewWaitingFor" && "Review waiting for list"}
                {key === "reviewProjects" && "Review projects list"}
                {key === "reviewNextActions" && "Review next actions list"}
                {key === "reviewSomedayMaybe" && "Review someday/maybe list"}
                {key === "beCreative" && "Be creative and courageous"}
              </label>
            </div>
          ))}
          
          <div className="pt-4 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetWeekly}
            >
              Reset
            </Button>
            <Button
              onClick={handleCompleteAllWeekly}
              className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
              size="sm"
            >
              Complete All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700 text-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Monthly Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">
            Take time to review your bigger picture goals and adjust your projects and next actions accordingly.
          </p>
          
          {Object.entries(monthlyChecklist).map(([key, checked]) => (
            <div key={key} className="flex items-start space-x-2 mb-3">
              <Checkbox 
                id={key} 
                checked={checked} 
                onCheckedChange={() => handleMonthlyCheck(key as keyof typeof monthlyChecklist)}
                className="mt-1 border-orange-500 text-orange-500"
              />
              <label 
                htmlFor={key} 
                className={`text-sm ${checked ? "line-through text-slate-500" : "text-slate-300"}`}
              >
                {key === "reviewGoals" && "Review goals and objectives"}
                {key === "reviewProjectOutcomes" && "Review project outcomes"}
                {key === "evaluatePerformance" && "Evaluate last month's performance"}
                {key === "planNextMonth" && "Plan next month's objectives"}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700 text-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Stats & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Task Breakdown</h4>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-semibold text-blue-500">{taskCounts.nextActions}</p>
                <p className="text-xs text-slate-500">Next Actions</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-purple-500">{taskCounts.projects}</p>
                <p className="text-xs text-slate-500">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-green-500">{taskCounts.waitingFor}</p>
                <p className="text-xs text-slate-500">Waiting For</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Top Contexts</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
                work
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
                home
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
                personal
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700 text-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Reflection Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {reflectionQuestions.map((question, index) => (
              <li key={index} className="text-slate-300">
                {question}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReflectView;
