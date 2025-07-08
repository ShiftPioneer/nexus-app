
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Trash2, RotateCcw, MoreHorizontal, Calendar } from "lucide-react";
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
  deleted?: boolean;
  deletedAt?: Date;
}

interface DeletedTaskCardProps {
  task: Task;
  index: number;
  onTaskRestore: (taskId: string) => void;
  onTaskPermanentDelete: (taskId: string) => void;
}

const DeletedTaskCard: React.FC<DeletedTaskCardProps> = ({
  task,
  index,
  onTaskRestore,
  onTaskPermanentDelete
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 text-red-400';
      case 'high': return 'border-orange-500 text-orange-400';
      case 'medium': return 'border-yellow-500 text-yellow-400';
      case 'low': return 'border-green-500 text-green-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'todo' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 opacity-75">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Type Indicator */}
            <div className="pt-1">
              <div className={`w-3 h-3 rounded-full ${task.type === 'todo' ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-slate-300 line-through">
                      {task.title}
                    </h3>
                    <Badge variant="outline" className={getTypeColor(task.type)}>
                      {task.type === 'todo' ? 'To Do' : 'Not To Do'}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
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
                      onClick={() => onTaskRestore(task.id)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore Task
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onTaskPermanentDelete(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Forever
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Task Metadata */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-slate-500">{task.category}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {task.deletedAt && (
                    <div className="flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      Deleted {new Date(task.deletedAt).toLocaleDateString()}
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Display */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs py-0 px-1 text-slate-500 border-slate-600">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs py-0 px-1 text-slate-500 border-slate-600">
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
  );
};

export default DeletedTaskCard;
