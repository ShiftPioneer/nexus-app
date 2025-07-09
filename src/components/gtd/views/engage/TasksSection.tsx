
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TasksSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: any[];
  emptyMessage: string;
  emptyActionText: string;
  onEmptyAction: () => void;
  onStartFocus: (task: any) => void;
  onCompleteTask: (taskId: string) => void;
  onMoveToToday?: (taskId: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  title,
  description,
  icon,
  tasks,
  emptyMessage,
  emptyActionText,
  onEmptyAction,
  onStartFocus,
  onCompleteTask,
  onMoveToToday
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            <CardDescription className="text-slate-400 text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 mb-4">{emptyMessage}</p>
            <Button 
              onClick={onEmptyAction}
              className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white"
            >
              {emptyActionText}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/30 p-4 hover:bg-slate-800/60 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white mb-1 truncate">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    {task.priority && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {task.context && (
                      <span className="px-2 py-1 rounded-md bg-slate-700/50 text-slate-300">
                        {task.context}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-1">
                        {task.tags.slice(0, 2).map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 rounded-md bg-primary/20 text-primary text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onStartFocus(task)}
                      className="h-8 w-8 p-0 hover:bg-primary/20 text-primary hover:text-primary"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    {onMoveToToday && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMoveToToday(task.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-500/20 text-blue-400 hover:text-blue-400"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCompleteTask(task.id)}
                      className="h-8 w-8 p-0 hover:bg-green-500/20 text-green-400 hover:text-green-400"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
