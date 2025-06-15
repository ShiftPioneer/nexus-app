
import React from "react";
import { Card } from "@/components/ui/card";

interface EmptyTasksCardProps {
  isToDoNot: boolean;
}

const EmptyTasksCard: React.FC<EmptyTasksCardProps> = ({ isToDoNot }) => {
  return (
    <Card className="text-center p-6 border-slate-700 text-slate-200 bg-slate-950">
      <p className="text-slate-400">No {isToDoNot ? "items" : "tasks"} to display</p>
    </Card>
  );
};

export default EmptyTasksCard;
