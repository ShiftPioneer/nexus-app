import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useGoals } from "@/contexts/GoalContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const GoalsProgressCard = () => {
  const {
    goals,
    getGoalsProgress
  } = useGoals();
  const activeGoals = goals.filter(goal => goal.status === "in-progress" || goal.status === "not-started");
  const progress = getGoalsProgress();
  const progressPercentage = Math.round(progress);
  return <Card className="bg-[#1A0A0A] border-[#2D1E1E] text-white overflow-hidden">
      
    </Card>;
};
export default GoalsProgressCard;