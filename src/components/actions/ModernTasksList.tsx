
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  Flag, 
  Calendar,
  Star,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Trash2,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [viewMode, setViewMode] = useState<"all" | "active" | "completed">("all");

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = searchTerm === "" || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      const matchesViewMode = viewMode === "all" || 
        (viewMode === "active" && !task.completed) ||
        (viewMode === "completed" && task.completed);
      
      return matchesSearch && matchesPriority && matchesViewMode;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 border-red-500/30 text-red-300";
      case "high":
        return "bg-orange-500/10 border-orange-500/30 text-orange-300";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
      case "low":
        return "bg-green-500/10 border-green-500/30 text-green-300";
      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-300";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-3 w-3" />;
      case "high":
        return <Flag className="h-3 w-3" />;
      case "medium":
        return <Circle className="h-3 w-3" />;
      case "low":
        return <Circle className="h-3 w-3 opacity-50" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{activeTasks} active</span>
              <span>•</span>
              <span>{completedTasks} completed</span>
              <span>•</span>
              <span>{tasks.length} total</span>
            </div>
          </div>
          
          <Button
            onClick={onAddTask}
            className="bg-primary hover:bg-primary/80 text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="created">Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50 text-center p-12">
          <CheckCircle2 className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
          <p className="text-slate-400 mb-6">{emptyMessage}</p>
          <Button onClick={onAddTask} className="bg-primary hover:bg-primary/80 text-white">
            Create Your First Task
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  onComplete={() => onTaskComplete(task.id)}
                  onEdit={() => onTaskEdit(task)}
                  onDelete={() => onTaskDelete(task.id)}
                  getPriorityColor={getPriorityColor}
                  getPriorityIcon={getPriorityIcon}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete, 
  getPriorityColor, 
  getPriorityIcon 
}: {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getPriorityColor: (priority: string) => string;
  getPriorityIcon: (priority: string) => React.ReactNode;
}) => {
  const [showActions, setShowActions] = useState(false);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate && 
    new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <Card 
      className={`
        bg-slate-900/80 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group
        ${task.completed ? 'opacity-60' : ''}
        ${isOverdue ? 'border-red-500/30 bg-red-500/5' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="mt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={onComplete}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`
                  font-medium text-white group-hover:text-blue-300 transition-colors
                  ${task.completed ? 'line-through text-slate-400' : ''}
                `}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {getPriorityIcon(task.priority)}
                    <span className="ml-1 capitalize">{task.priority}</span>
                  </Badge>

                  {task.dueDate && (
                    <div className={`
                      flex items-center gap-1
                      ${isOverdue ? 'text-red-400' : isDueToday ? 'text-yellow-400' : 'text-slate-400'}
                    `}>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {isDueToday ? 'Due today' : 
                         isOverdue ? 'Overdue' : 
                         `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onEdit}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernTasksList;
