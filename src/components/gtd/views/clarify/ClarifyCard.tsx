
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Droppable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";

interface ClarifyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  droppableId: string;
  iconBgClass: string;
  iconTextClass: string;
  activeDropClass: string;
}

const ClarifyCard: React.FC<ClarifyCardProps> = ({
  icon,
  title,
  description,
  droppableId,
  iconBgClass,
  iconTextClass,
  activeDropClass,
}) => {
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${iconBgClass} ${iconTextClass} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center">{title}</h3>
        <p className="text-sm text-slate-400 text-center">
          {description}
        </p>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "mt-4 p-4 border border-dashed rounded-md min-h-[100px] transition-colors",
                snapshot.isDraggingOver ? activeDropClass : "border-slate-700"
              )}
            >
              <p className="text-sm text-center text-slate-500">
                {snapshot.isDraggingOver ? "Drop here!" : "Drag tasks here to categorize"}
              </p>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

export default ClarifyCard;
