
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, Zap, AlertTriangle, Clock, CheckCircle } from "lucide-react";
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
  title?: string;
  type?: 'todo' | 'not-todo';
}

const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  title = "Eisenhower Matrix",
  type = 'todo'
}) => {
  const getMatrixQuadrant = (task: Task) => {
    const isUrgent = task.priority === 'urgent' || task.priority === 'high';
    const isImportant = task.priority === 'urgent' || task.priority === 'medium';
    
    if (isUrgent && isImportant) return 'urgent-important';
    if (!isUrgent && isImportant) return 'not-urgent-important';
    if (isUrgent && !isImportant) return 'urgent-not-important';
    return 'not-urgent-not-important';
  };

  const getTasksByQuadrant = (quadrant: string) => {
    return tasks.filter(task => getMatrixQuadrant(task) === quadrant && !task.completed);
  };

  const quadrants = [
    {
      id: 'urgent-important',
      title: type === 'todo' ? 'Do It Now' : 'Eliminate Immediately',
      subtitle: 'Urgent & Important',
      color: type === 'todo' ? 'from-red-500 to-red-600' : 'from-red-600 to-red-700',
      icon: AlertTriangle,
      description: type === 'todo' ? 'Critical tasks requiring immediate attention' : 'Harmful habits to stop immediately'
    },
    {
      id: 'not-urgent-important',
      title: type === 'todo' ? 'Schedule It' : 'Avoid Strategically',
      subtitle: 'Not Urgent & Important',
      color: type === 'todo' ? 'from-blue-500 to-blue-600' : 'from-blue-600 to-blue-700',
      icon: Calendar,
      description: type === 'todo' ? 'Important tasks to plan and schedule' : 'Important habits to avoid with planning'
    },
    {
      id: 'urgent-not-important',
      title: type === 'todo' ? 'Delegate It' : 'Minimize Quickly',
      subtitle: 'Urgent & Not Important',
      color: type === 'todo' ? 'from-orange-500 to-orange-600' : 'from-orange-600 to-orange-700',
      icon: Zap,
      description: type === 'todo' ? 'Urgent but less important tasks' : 'Urgent distractions to minimize'
    },
    {
      id: 'not-urgent-not-important',
      title: type === 'todo' ? 'Delete It' : 'Ignore Completely',
      subtitle: 'Not Urgent & Not Important',
      color: type === 'todo' ? 'from-gray-500 to-gray-600' : 'from-gray-600 to-gray-700',
      icon: type === 'todo' ? Clock : CheckCircle,
      description: type === 'todo' ? 'Low priority tasks to eliminate' : 'Minor habits not worth attention'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${type === 'todo' ? 'from-orange-500 to-amber-600' : 'from-red-500 to-pink-600'} flex items-center justify-center shadow-lg`}>
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {type === 'todo' 
            ? 'Prioritize your tasks using the Eisenhower Matrix. Focus on what matters most.'
            : 'Identify and eliminate activities that drain your energy and time.'
          }
        </p>
      </motion.div>

      {/* Matrix Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {quadrants.map((quadrant, index) => {
          const Icon = quadrant.icon;
          const quadrantTasks = getTasksByQuadrant(quadrant.id);
          
          return (
            <motion.div
              key={quadrant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 h-full">
                <CardHeader className="pb-4">
                  <div className={`p-4 rounded-t-lg bg-gradient-to-r ${quadrant.color}`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {quadrant.title}
                          </CardTitle>
                          <p className="text-sm opacity-90">{quadrant.subtitle}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {quadrantTasks.length}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2 opacity-80">
                      {quadrant.description}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 min-h-64">
                  {quadrantTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-sm mb-4">
                        No {type === 'todo' ? 'tasks' : 'items'} in this quadrant
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onAddTask}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {type === 'todo' ? 'Task' : 'Item'}
                      </Button>
                    </div>
                  ) : (
                    quadrantTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        className="group p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white line-clamp-1 flex-1">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onTaskComplete(task.id)}
                              className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onTaskEdit(task)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                task.priority === 'urgent' ? 'border-red-500 text-red-400' :
                                task.priority === 'high' ? 'border-orange-500 text-orange-400' :
                                task.priority === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                'border-green-500 text-green-400'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-slate-500">{task.category}</span>
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
                            {task.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs py-0 px-1">
                                +{task.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                  
                  {quadrantTasks.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 mt-3"
                      onClick={onAddTask}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {type === 'todo' ? 'Task' : 'Item'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MatrixView;
