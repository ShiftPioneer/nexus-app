
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock, AlertTriangle, Users, Trash2 } from "lucide-react";
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

interface MatrixViewProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: () => void;
}

const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onAddTask
}) => {
  const getQuadrantTasks = (urgent: boolean, important: boolean) => {
    return tasks.filter(task => {
      const isUrgent = task.priority === "urgent" || (task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
      const isImportant = task.priority === "urgent" || task.priority === "high";
      
      if (urgent && important) return isUrgent && isImportant;
      if (urgent && !important) return isUrgent && !isImportant;
      if (!urgent && important) return !isUrgent && isImportant;
      return !isUrgent && !isImportant;
    });
  };

  const quadrants = [
    {
      title: "Do First",
      subtitle: "Urgent & Important",
      tasks: getQuadrantTasks(true, true),
      color: "from-red-500 to-red-600",
      borderColor: "border-red-500/50",
      icon: AlertTriangle,
      action: "Do immediately"
    },
    {
      title: "Schedule",
      subtitle: "Important, Not Urgent",
      tasks: getQuadrantTasks(false, true),
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500/50",
      icon: Clock,
      action: "Plan for later"
    },
    {
      title: "Delegate",
      subtitle: "Urgent, Not Important",
      tasks: getQuadrantTasks(true, false),
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-500/50",
      icon: Users,
      action: "Assign to others"
    },
    {
      title: "Eliminate",
      subtitle: "Neither Urgent nor Important",
      tasks: getQuadrantTasks(false, false),
      color: "from-gray-500 to-gray-600",
      borderColor: "border-gray-500/50",
      icon: Trash2,
      action: "Remove from list"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Eisenhower Decision Matrix</h2>
        <p className="text-slate-400">Organize tasks by urgency and importance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {quadrants.map((quadrant, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`h-96 bg-slate-950/80 backdrop-blur-sm border-2 ${quadrant.borderColor} overflow-hidden`}>
              <CardHeader className={`bg-gradient-to-r ${quadrant.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <quadrant.icon className="h-5 w-5" />
                      {quadrant.title}
                    </CardTitle>
                    <p className="text-sm opacity-90">{quadrant.subtitle}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {quadrant.tasks.length}
                  </Badge>
                </div>
                <p className="text-xs opacity-75 italic">{quadrant.action}</p>
              </CardHeader>
              
              <CardContent className="p-4 h-64 overflow-y-auto scrollbar-none">
                {quadrant.tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <quadrant.icon className="h-8 w-8 text-slate-500 mb-2 opacity-50" />
                    <p className="text-sm text-slate-400 mb-3">No tasks in this quadrant</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddTask}
                      className="border-dashed"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quadrant.tasks.map((task, taskIndex) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: taskIndex * 0.05 }}
                        className="group"
                      >
                        <Card className="bg-slate-900/50 border-slate-700/30 hover:border-slate-600 transition-all duration-200 cursor-pointer">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-white text-sm line-clamp-1">
                                {task.title}
                              </h4>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => onTaskComplete(task.id)}
                                >
                                  ✓
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => onTaskEdit(task)}
                                >
                                  ✎
                                </Button>
                              </div>
                            </div>
                            
                            {task.description && (
                              <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  task.priority === 'urgent' ? 'border-red-400 text-red-400' :
                                  task.priority === 'high' ? 'border-orange-400 text-orange-400' :
                                  task.priority === 'medium' ? 'border-yellow-400 text-yellow-400' :
                                  'border-green-400 text-green-400'
                                }`}
                              >
                                {task.priority}
                              </Badge>
                              
                              {task.dueDate && (
                                <span className="text-xs text-slate-500">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MatrixView;
