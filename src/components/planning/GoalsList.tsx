
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { CheckCircle2, Circle, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalsListProps {
  goals: Goal[];
  onGoalUpdate: (goal: Goal) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onGoalUpdate }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wealth":
        return "from-orange-500 to-yellow-500";
      case "health":
        return "from-green-500 to-emerald-500";
      case "relationships":
        return "from-pink-500 to-rose-500";
      case "spirituality":
        return "from-purple-500 to-indigo-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full bg-gradient-to-br flex items-center justify-center",
                  getCategoryColor(goal.category)
                )}>
                  <Target className="h-4 w-4 text-white" />
                </div>
                {goal.title}
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {goal.timeframe === "short-term" ? "Short Term" : "Long Term"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{goal.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(goal.startDate, "MMM d, yyyy")} - {format(goal.endDate, "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {goal.milestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Milestones</h4>
                <ul className="space-y-1">
                  {goal.milestones.map((milestone) => (
                    <li key={milestone.id} className="flex items-center gap-2 text-sm">
                      {milestone.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={cn(
                        milestone.completed && "line-through text-muted-foreground"
                      )}>
                        {milestone.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GoalsList;
