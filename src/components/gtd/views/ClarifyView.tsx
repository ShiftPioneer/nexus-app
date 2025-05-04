
import React from "react";
import { useGTD } from "../GTDContext";
import DraggableTaskItem from "./clarify/DraggableTaskItem";
import InboxTasksList from "./clarify/InboxTasksList";
import { Clock, List, Bookmark, Archive, Trash2 } from "lucide-react";
import { Droppable } from "react-beautiful-dnd";

const ClarifyView: React.FC = () => {
  const { tasks, setActiveView } = useGTD();
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  
  const handleAddTask = () => {
    setActiveView("capture");
  };
  
  const handleGoToCapture = () => {
    setActiveView("capture");
  };

  // Decision cards with clearer descriptions and styles
  const decisionCards = [
    {
      id: "do-it",
      title: "Do It",
      description: "If it takes less than 2 minutes, do it now.",
      icon: <div className="bg-amber-600 p-3 rounded-full text-white"><Clock className="h-6 w-6" /></div>,
      activeClass: "bg-amber-600/20 border-amber-500"
    },
    {
      id: "delegate-it",
      title: "Delegate It",
      description: "If someone else should do it, delegate and track.",
      icon: <div className="bg-blue-600 p-3 rounded-full text-white"><List className="h-6 w-6" /></div>,
      activeClass: "bg-blue-600/20 border-blue-500"
    },
    {
      id: "defer-it",
      title: "Defer It",
      description: "Schedule it for later if it requires more time.",
      icon: <div className="bg-purple-600 p-3 rounded-full text-white"><Bookmark className="h-6 w-6" /></div>,
      activeClass: "bg-purple-600/20 border-purple-500"
    },
    {
      id: "reference",
      title: "Reference",
      description: "Store it if it might be useful later.",
      icon: <div className="bg-green-600 p-3 rounded-full text-white"><Archive className="h-6 w-6" /></div>,
      activeClass: "bg-green-600/20 border-green-500"
    },
    {
      id: "delete-it",
      title: "Delete It",
      description: "Remove it if it's no longer relevant or needed.",
      icon: <div className="bg-red-600 p-3 rounded-full text-white"><Trash2 className="h-6 w-6" /></div>,
      activeClass: "bg-red-600/20 border-red-500"
    }
  ];
  
  return (
    <div className="space-y-8 bg-black/20 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Clarify Your Inbox</h2>
      
      <InboxTasksList 
        tasks={inboxTasks} 
        onAddTask={handleAddTask} 
        onGoToCapture={handleGoToCapture} 
      />
      
      <div className="grid gap-4">
        <div className="text-xl font-medium text-white mb-1">Decide what to do with each item</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {decisionCards.map((card) => (
            <Droppable key={card.id} droppableId={card.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-slate-800/80 border-2 border-transparent rounded-xl overflow-hidden transition-colors ${snapshot.isDraggingOver ? card.activeClass : ''}`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex flex-col items-center text-center">
                      {card.icon}
                      <h3 className="text-white font-semibold mt-3">{card.title}</h3>
                      <p className="text-slate-300 text-sm mt-1">{card.description}</p>
                    </div>
                    <div className="min-h-[100px] mt-4 bg-black/20 rounded-lg p-2 flex items-center justify-center">
                      {snapshot.isDraggingOver ? (
                        <p className="text-white/70 text-sm">Drop here</p>
                      ) : (
                        <p className="text-white/50 text-xs">Drag tasks here</p>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClarifyView;
