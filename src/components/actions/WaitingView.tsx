import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Clock, 
  ArrowRight,
  MoreHorizontal,
  Trash2,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedTask } from "@/types/unified-tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WaitingView: React.FC = () => {
  const { 
    waitingForTasks, 
    moveToActive, 
    deleteTask 
  } = useUnifiedTasks();

  if (waitingForTasks.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Nothing Waiting"
        description="Tasks you delegate or are waiting on others for will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            Waiting For
          </h2>
          <p className="text-slate-400 mt-1">
            {waitingForTasks.length} item{waitingForTasks.length !== 1 ? 's' : ''} waiting on others
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {waitingForTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Card className="bg-slate-900/80 border-slate-700/50 hover:border-yellow-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{task.title}</h3>
                      
                      {task.description && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3">
                        {task.delegatedTo && (
                          <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                            <User className="h-3 w-3 mr-1" />
                            {task.delegatedTo}
                          </Badge>
                        )}
                        
                        <span className="text-xs text-slate-500">
                          Since {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveToActive(task.id)}
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
                          <DropdownMenuItem 
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WaitingView;
