
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Calendar, Clock, Tag, Edit, Trash2, Archive } from "lucide-react";
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

interface ModernTasksListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: () => void;
  title: string;
  emptyMessage: string;
  showCompleted?: boolean;
}

const ModernTasksList: React.FC<ModernTasksListProps> = ({
  tasks,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  title,
  emptyMessage,
  showCompleted = true
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'deleted'>('all');
  
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'deleted':
        return false; // Will be handled separately
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 text-red-400';
      case 'high': return 'border-orange-500 text-orange-400';
      case 'medium': return 'border-yellow-500 text-yellow-400';
      case 'low': return 'border-green-500 text-green-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const handleTaskAction = (action: string, task: Task) => {
    switch (action) {
      case 'edit':
        onTaskEdit(task);
        break;
      case 'delete':
        onTaskDelete(task.id);
        break;
      case 'complete':
        onTaskComplete(task.id);
        break;
      default:
        break;
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        icon={Plus}
        title="No Tasks Yet"
        description={emptyMessage}
        action={
          <Button 
            onClick={onAddTask}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Task
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400">
            {filteredTasks.filter(t => !t.completed).length} active, {filteredTasks.filter(t => t.completed).length} completed
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Done' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(key as any)}
                className={filter === key ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"}
              >
                {label}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={onAddTask}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={`bg-slate-950/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600 transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="pt-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onTaskComplete(task.id)}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
                          <DropdownMenuItem 
                            onClick={() => handleTaskAction('edit', task)}
                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleTaskAction('complete', task)}
                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            {task.completed ? (
                              <>
                                <Archive className="h-4 w-4 mr-2" />
                                Mark Incomplete
                              </>
                            ) : (
                              <>
                                <Calendar className="h-4 w-4 mr-2" />
                                Mark Complete
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem 
                            onClick={() => handleTaskAction('delete', task)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Task Metadata */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        {/* Priority Badge */}
                        <Badge variant="outline" className={`text-xs ${getPriorityBadgeColor(task.priority)}`}>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mr-1`} />
                          {task.priority}
                        </Badge>

                        {/* Category */}
                        <span className="text-xs text-slate-500">{task.category}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-slate-500" />
                            <span className="text-xs text-slate-500">
                              {task.tags.length} tag{task.tags.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags Display */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs py-0 px-1 text-slate-400 border-slate-600">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0 px-1 text-slate-400 border-slate-600">
                            +{task.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModernTasksList;
