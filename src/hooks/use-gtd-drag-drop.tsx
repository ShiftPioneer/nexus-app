
import { DropResult } from "react-beautiful-dnd";
import { TaskStatus } from "@/types/gtd";

export const useGTDDragDrop = (moveTask: (id: string, newStatus: TaskStatus) => void) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped back to its original location, do nothing
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    // Parse the droppable ID to get the appropriate task status
    let newStatus: TaskStatus;
    
    switch (destination.droppableId) {
      case "inbox":
      case "inbox-list":
        newStatus = "inbox";
        break;
      case "nextActions":
        newStatus = "next-action";
        break;
      case "projects":
        newStatus = "project";
        break;
      case "waitingFor":
        newStatus = "waiting-for";
        break;
      case "someday":
        newStatus = "someday";
        break;
      case "reference":
        newStatus = "reference";
        break;
      case "do-it":
        newStatus = "next-action";
        break;
      case "delegate-it":
        newStatus = "waiting-for";
        break;
      case "defer-it":
        newStatus = "someday";
        break;
      case "delete-it":
        newStatus = "deleted";
        break;
      default:
        newStatus = "inbox";
    }
    
    // Move the task
    moveTask(draggableId, newStatus);
    
    console.log(`Task ${draggableId} dragged from ${source.droppableId} to ${destination.droppableId} (new status: ${newStatus})`);
  };

  return { handleDragEnd };
};
