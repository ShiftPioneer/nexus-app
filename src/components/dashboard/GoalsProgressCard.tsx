
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { useGoals } from "@/contexts/GoalContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GoalsProgressCard = () => {
  const { goals, getGoalsProgress } = useGoals();
  
  const activeGoals = goals.filter(goal => 
    goal.status === "in-progress" || goal.status === "not-started"
  );
  
  const progress = getGoalsProgress();
  const progressPercentage = Math.round(progress);
  
  return (
    <Card className="bg-[#1A0A0A] border-[#2D1E1E] text-white overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Goals Progress</h3>
            <p className="text-3xl font-bold">{progressPercentage}%</p>
            <p className="text-sm text-neutral-400">
              {activeGoals.length} active goal{activeGoals.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="w-16 h-16">
            <CircularProgressbar
              value={progressPercentage}
              text={`${progressPercentage}%`}
              strokeWidth={10}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#FF5722',
                textColor: '#FFFFFF',
                trailColor: '#2D1E1E',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgressCard;
