
import React from "react";
import { GTDTask } from "../../GTDContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TasksPanelProps {
  filteredTasks: GTDTask[];
  handleStartPomodoro: () => void;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ filteredTasks, handleStartPomodoro }) => {
  return (
    <div className="border border-slate-700 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Next Actions</h2>
        <Button className="bg-[#FF5722] hover:bg-[#FF6E40] text-white">
          + Add Task
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 bg-slate-800 border-slate-700 text-slate-200"
          />
        </div>
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">No tasks match the selected filter. Add a task or change your filter.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <div key={task.id} className="flex items-center p-3 bg-slate-800 border border-slate-700 rounded-md hover:border-slate-600 transition-all">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-200">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-slate-400 line-clamp-1">{task.description}</p>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={handleStartPomodoro}
              >
                Focus
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPanel;
