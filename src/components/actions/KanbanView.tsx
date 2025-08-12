
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  type: 'todo' | 'not-todo';
}

interface KanbanViewProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: () => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onAddTask
}) => {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'from-blue-500 to-indigo-600' },
    { id: 'in-progress', title: 'In Progress', color: 'from-orange-500 to-amber-600' },
    { id: 'review', title: 'Review', color: 'from-purple-500 to-pink-600' },
    { id: 'completed', title: 'Completed', color: 'from-green-500 to-emerald-600' }
  ];

  const getTasksByStatus = (status: string) => {
    switch (status) {
      case 'todo':
        return tasks.filter(task => !task.completed && task.type === 'todo');
      case 'in-progress':
        return tasks.filter(task => !task.completed && task.priority === 'high');
      case 'review':
        return tasks.filter(task => !task.completed && task.priority === 'urgent');
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return [];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 min-w-max p-6">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            className="w-80 bg-slate-950/50 backdrop-blur-sm rounded-2xl border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-4 rounded-t-2xl bg-gradient-to-r ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {getTasksByStatus(column.id).length}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-none">
              {getTasksByStatus(column.id).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="bg-slate-950/90 border-slate-700/50 hover:border-slate-600 transition-all duration-200 cursor-pointer hover:shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white line-clamp-2">{task.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onTaskEdit(task)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span className="text-xs text-slate-400 capitalize">{task.priority}</span>
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs py-0">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs py-0">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <Button
                variant="outline"
                className="w-full border-dashed border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300"
                onClick={onAddTask}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;
