
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, CircleDashed, CheckCircle2 } from "lucide-react";

interface PlanningBoardViewProps {
  goals?: Goal[];
  projects?: Project[];
  contentType: "goals" | "projects";
  onEditItem: (item: Goal | Project) => void;
}

const PlanningBoardView: React.FC<PlanningBoardViewProps> = ({
  goals = [],
  projects = [],
  contentType,
  onEditItem,
}) => {
  const items = contentType === "goals" ? goals : projects;

  const notStartedItems = items.filter(item => item.status === "not-started");
  const inProgressItems = items.filter(item => item.status === "in-progress");
  const completedItems = items.filter(item => item.status === "completed");

  const renderItem = (item: any) => {
    return (
      <Card key={item.id} className="mb-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEditItem(item)}>
        <CardContent className="p-4">
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {item.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CircleDashed className="h-5 w-5" />
            Not Started
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {notStartedItems.length ? (
            notStartedItems.map(renderItem)
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Drag {contentType} here to set as not started
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Circle className="h-5 w-5" />
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {inProgressItems.length ? (
            inProgressItems.map(renderItem)
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Drag {contentType} here to set as in progress
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {completedItems.length ? (
            completedItems.map(renderItem)
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Drag {contentType} here to set as completed
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningBoardView;
