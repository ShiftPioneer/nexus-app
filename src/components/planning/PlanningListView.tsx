
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Target, Briefcase, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PlanningListViewProps {
  goals: Goal[];
  projects: Project[];
  contentType: "goals" | "projects";
  onUpdateGoal: (goal: Goal) => void;
  onUpdateProject: (project: Project) => void;
}

const PlanningListView: React.FC<PlanningListViewProps> = ({
  goals,
  projects,
  contentType,
  onUpdateGoal,
  onUpdateProject,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wealth":
        return <Badge className="bg-orange-500">Wealth</Badge>;
      case "health":
        return <Badge className="bg-green-500">Health</Badge>;
      case "relationships":
        return <Badge className="bg-pink-500">Relationships</Badge>;
      case "spirituality":
        return <Badge className="bg-purple-500">Spirituality</Badge>;
      case "education":
        return <Badge className="bg-blue-500">Education</Badge>;
      case "career":
        return <Badge className="bg-blue-500">Career</Badge>;
      default:
        return <Badge className="bg-gray-500">{category}</Badge>;
    }
  };

  const renderGoals = () => {
    return goals.map((goal) => (
      <Card key={goal.id} className="group hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{goal.title}</h3>
              </div>
              {getCategoryIcon(goal.category)}
            </div>
            
            <p className="text-muted-foreground">{goal.description}</p>
            
            <div>
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2 mt-1" />
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {format(goal.startDate, "MMM d, yyyy")} - {format(goal.endDate, "MMM d, yyyy")}
                </span>
              </div>
              <div>
                <BarChart3 className="h-4 w-4 inline-block mr-1" />
                Stats
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderProjects = () => {
    return projects.map((project) => (
      <Card key={project.id} className="group hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{project.title}</h3>
              </div>
              {getCategoryIcon(project.category)}
            </div>
            
            <p className="text-muted-foreground">{project.description}</p>
            
            <div>
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2 mt-1" />
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {format(project.startDate, "MMM d, yyyy")} - {format(project.endDate, "MMM d, yyyy")}
                </span>
              </div>
              <div>
                <BarChart3 className="h-4 w-4 inline-block mr-1" />
                Stats
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contentType === "goals" ? renderGoals() : renderProjects()}
    </div>
  );
};

export default PlanningListView;
