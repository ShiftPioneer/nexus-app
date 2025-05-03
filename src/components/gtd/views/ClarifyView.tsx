
import React from "react";
import { useGTD } from "../GTDContext";
import { Droppable } from "react-beautiful-dnd";
import ClarifyCard from "./clarify/ClarifyCard";
import InboxTasksList from "./clarify/InboxTasksList";
import { CheckCircle2, Clock, List, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClarifyView: React.FC = () => {
  const { tasks, moveTask, addTask, setActiveView } = useGTD();
  const { toast } = useToast();
  
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  
  const handleAddTask = () => {
    setActiveView("capture");
  };
  
  const handleGoToCapture = () => {
    setActiveView("capture");
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Clarify Your Tasks</h2>
      
      <InboxTasksList 
        tasks={inboxTasks} 
        onAddTask={handleAddTask} 
        onGoToCapture={handleGoToCapture}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ClarifyCard
          droppableId="next-action"
          title="Next Action"
          description="Tasks that can be done immediately"
          icon={<CheckCircle2 className="h-8 w-8" />}
          iconBgClass="bg-green-600"
          activeDropClass="bg-green-600/20 border-green-500"
        />
        
        <ClarifyCard
          droppableId="project"
          title="Project"
          description="Complex tasks requiring multiple actions"
          icon={<List className="h-8 w-8" />}
          iconBgClass="bg-purple-600"
          activeDropClass="bg-purple-600/20 border-purple-500"
        />
        
        <ClarifyCard
          droppableId="waiting-for"
          title="Waiting For"
          description="Tasks delegated to others"
          icon={<Clock className="h-8 w-8" />}
          iconBgClass="bg-orange-600"
          activeDropClass="bg-orange-600/20 border-orange-500"
        />
        
        <ClarifyCard
          droppableId="someday"
          title="Someday/Maybe"
          description="Tasks to consider in the future"
          icon={<Bookmark className="h-8 w-8" />}
          iconBgClass="bg-blue-600"
          activeDropClass="bg-blue-600/20 border-blue-500"
        />
      </div>
    </div>
  );
};

export default ClarifyView;
