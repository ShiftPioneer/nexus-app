
import { TaskStatus } from "@/types/gtd";

export const useGTDDragDrop = (moveTask: (id: string, newStatus: TaskStatus) => void) => {
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Parse the droppable ID to get the appropriate task status
    const newStatus = destination.droppableId as TaskStatus;
    
    // Move the task
    moveTask(draggableId, newStatus);
    
    console.log(`Task ${draggableId} dragged from ${source.droppableId} to ${destination.droppableId}`);
  };

  return { handleDragEnd };
};
