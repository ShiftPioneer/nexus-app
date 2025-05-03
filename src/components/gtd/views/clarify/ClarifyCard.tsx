
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GTDTask } from "@/components/gtd/GTDContext";
import TaskItem from "../TaskItem";

export interface ClarifyCardProps {
  id: string;
  droppableId: string;
  title: string;
  description: string;
  iconBgClass: string;
  iconTextClass: string;
  activeDropClass: string;
  icon: React.ReactNode;
  tasks?: GTDTask[];
}

const ClarifyCard: React.FC<ClarifyCardProps> = ({
  id,
  droppableId,
  title,
  description,
  iconBgClass,
  iconTextClass,
  activeDropClass,
  icon,
  tasks = [],
}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`border-2 transition-colors ${snapshot.isDraggingOver ? activeDropClass : ''}`}
        >
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className={`rounded-full p-2 ${iconBgClass}`}>
              <div className={iconTextClass}>{icon}</div>
            </div>
            <div>
              <h4 className="text-base font-medium">{title}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </CardHeader>
          <CardContent className="min-h-[100px]">
            {tasks.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-16 text-muted-foreground text-sm">
                Drop tasks here
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Droppable>
  );
};

export default ClarifyCard;
