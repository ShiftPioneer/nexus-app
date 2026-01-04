import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Inbox, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  Trash2,
  Calendar,
  MoreHorizontal,
  Zap,
  Target,
  AlertTriangle,
  Coffee
} from "lucide-react";
import { motion } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedTask } from "@/types/unified-tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const InboxView: React.FC = () => {
  const { 
    inboxTasks, 
    clarifyTask, 
    deleteTask, 
    moveToSomeday,
    moveToWaitingFor
  } = useUnifiedTasks();

  const handleClarify = (task: UnifiedTask, urgent: boolean, important: boolean) => {
    clarifyTask(task.id, urgent, important);
  };

  const quadrants = [
    { 
      urgent: true, 
      important: true, 
      label: "Do First", 
      icon: Zap,
      gradient: "from-red-500 to-orange-500", 
      description: "Urgent & Important" 
    },
    { 
      urgent: false, 
      important: true, 
      label: "Schedule", 
      icon: Target,
      gradient: "from-blue-500 to-indigo-500", 
      description: "Important, plan time" 
    },
    { 
      urgent: true, 
      important: false, 
      label: "Delegate", 
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-orange-400", 
      description: "Quick or delegate" 
    },
    { 
      urgent: false, 
      important: false, 
      label: "Consider", 
      icon: Coffee,
      gradient: "from-slate-500 to-slate-600", 
      description: "Optional / low impact" 
    },
  ];

  // Separate by type
  const todoInbox = inboxTasks.filter(t => t.type === "todo");
  const notTodoInbox = inboxTasks.filter(t => t.type === "not-todo");

  if (inboxTasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Inbox Zero!"
        description="All caught up! Your inbox is empty. Use Quick Capture above to add new items."
      />
    );
  }

  const renderTaskCard = (task: UnifiedTask, index: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "backdrop-blur-sm transition-all hover:shadow-md",
        task.type === "not-todo" && "border-l-4 border-l-red-500"
      )}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                task.type === "todo" ? "bg-green-500/20" : "bg-red-500/20"
              )}>
                {task.type === "todo" 
                  ? <CheckCircle className="h-5 w-5 text-green-500" />
                  : <XCircle className="h-5 w-5 text-red-500" />
                }
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {task.type === "todo" ? "To Do" : "Not To Do"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Captured {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => moveToWaitingFor(task.id, "")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Move to Waiting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => moveToSomeday(task.id)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Move to Someday
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Eisenhower Matrix Clarification */}
          <div className="mt-5 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Clarify: Where does this belong?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quadrants.map(({ urgent, important, label, icon: Icon, gradient, description }) => (
                <button
                  key={`${urgent}-${important}`}
                  onClick={() => handleClarify(task, urgent, important)}
                  className={cn(
                    "p-3 rounded-xl bg-gradient-to-r transition-all text-left group hover:scale-[1.02] hover:shadow-lg",
                    gradient,
                    "bg-opacity-20 hover:bg-opacity-30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-white" />
                    <span className="font-medium text-white text-sm">{label}</span>
                  </div>
                  <p className="text-xs text-white/70">{description}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Inbox className="h-5 w-5 text-white" />
            </div>
            Inbox
          </h2>
          <p className="text-muted-foreground mt-1">
            {inboxTasks.length} item{inboxTasks.length !== 1 ? 's' : ''} to clarify
          </p>
        </div>
      </div>

      {/* To Do Items Section */}
      {todoInbox.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Things to Do</h3>
            <Badge className="bg-green-500/20 text-green-500">{todoInbox.length}</Badge>
          </div>
          <div className="grid gap-4">
            {todoInbox.map((task, index) => renderTaskCard(task, index))}
          </div>
        </div>
      )}

      {/* Not To Do Items Section */}
      {notTodoInbox.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Things to Avoid</h3>
            <Badge className="bg-red-500/20 text-red-500">{notTodoInbox.length}</Badge>
          </div>
          <div className="grid gap-4">
            {notTodoInbox.map((task, index) => renderTaskCard(task, todoInbox.length + index))}
          </div>
        </div>
      )}

      {/* GTD Philosophy Note */}
      <div className="p-4 bg-muted/50 rounded-xl">
        <h4 className="font-medium mb-2">GTD Clarification Process</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Do First:</strong> Handle immediately - both urgent and important</li>
          <li>• <strong>Schedule:</strong> Plan specific time - important but not urgent</li>
          <li>• <strong>Delegate:</strong> Give to someone else or do quickly - urgent but not important</li>
          <li>• <strong>Consider:</strong> Question if needed - neither urgent nor important</li>
        </ul>
      </div>
    </div>
  );
};

export default InboxView;
