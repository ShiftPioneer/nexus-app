
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { Check } from "lucide-react";
import Checklist from "./reflect/Checklist";
import StatsCard from "./reflect/StatsCard";
import ReflectionQuestions from "./reflect/ReflectionQuestions";

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

  const weeklyChecklistLabels = {
    reviewCollectionPoints: "Review and empty collection points",
    processNotes: "Process all notes and materials",
    reviewPreviousCalendar: "Review previous calendar data",
    reviewUpcomingCalendar: "Review upcoming calendar",
    reviewWaitingFor: "Review waiting for list",
    reviewProjects: "Review projects list",
    reviewNextActions: "Review next actions list",
    reviewSomedayMaybe: "Review someday/maybe list",
    beCreative: "Be creative and courageous",
  };

  const monthlyChecklistLabels = {
    reviewGoals: "Review goals and objectives",
    reviewProjectOutcomes: "Review project outcomes",
    evaluatePerformance: "Evaluate last month's performance",
    planNextMonth: "Plan next month's objectives",
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
      <Checklist
        title="Weekly Review Checklist"
        icon={<Check className="mr-2 h-5 w-5" />}
        items={weeklyChecklist}
        setItems={setWeeklyChecklist}
        itemLabels={weeklyChecklistLabels}
        showActions={true}
      />

      <Checklist
        title="Monthly Review"
        icon={<Check className="mr-2 h-5 w-5" />}
        items={monthlyChecklist}
        setItems={setMonthlyChecklist}
        itemLabels={monthlyChecklistLabels}
        description="Take time to review your bigger picture goals and adjust your projects and next actions accordingly."
      />

      <StatsCard taskCounts={taskCounts} />
      <ReflectionQuestions questions={reflectionQuestions} />
    </div>
  );
};

export default ReflectView;
