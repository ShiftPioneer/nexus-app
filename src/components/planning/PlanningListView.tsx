import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { CheckCircle2, Circle, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Goal, Project } from "@/types/planning";

interface PlanningListViewProps {
  goals?: Goal[];
  projects?: Project[];
  contentType: "goals" | "projects";
  onEditItem: (item: Goal | Project) => void;
}

const PlanningListView: React.FC<PlanningListViewProps> = ({
  goals = [],
  projects = [],
  contentType,
  onEditItem,
}) => {
  const items = contentType === "goals" ? goals : projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item: any) => (
        <Card key={item.id} className="group hover:shadow-md transition-shadow cursor-pointer" onClick={() => onEditItem(item)}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {contentType === "goals" ? (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    {item.title}
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    {item.title}
                  </>
                )}
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {contentType === "goals" ? item.timeframe : item.priority}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{item.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(item.startDate, "MMM d, yyyy")} - {format(item.endDate, "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {contentType === "goals" && item.milestones && item.milestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Milestones</h4>
                <ul className="space-y-1">
                  {item.milestones.map((milestone: any) => (
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

export default PlanningListView;
