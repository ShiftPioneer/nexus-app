import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Clock, 
  MoreHorizontal, 
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  User,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const WaitingView: React.FC = () => {
  const { 
    waitingForTasks, 
    moveToActive, 
    deleteTask,
    completeTask,
    updateTask
  } = useUnifiedTasks();

  const [editingDelegation, setEditingDelegation] = useState<string | null>(null);
  const [delegatedTo, setDelegatedTo] = useState("");

  const handleSaveDelegation = () => {
    if (editingDelegation) {
      updateTask(editingDelegation, { delegatedTo });
      setEditingDelegation(null);
      setDelegatedTo("");
    }
  };

  // Separate by type
  const todoWaiting = waitingForTasks.filter(t => t.type === "todo");
  const notTodoWaiting = waitingForTasks.filter(t => t.type === "not-todo");

  if (waitingForTasks.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Nothing Waiting"
        description="Tasks you're waiting on others for will appear here. Delegate tasks from Active to track them."
      />
    );
  }

  const renderTaskCard = (task: typeof waitingForTasks[0], index: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "transition-all hover:shadow-md",
        task.type === "not-todo" && "border-l-4 border-l-red-500"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              task.type === "todo" ? "bg-green-500/20" : "bg-red-500/20"
            )}>
              {task.type === "todo" 
                ? <CheckCircle className="h-5 w-5 text-green-500" />
                : <XCircle className="h-5 w-5 text-red-500" />
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium">{task.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {task.type === "todo" ? "To Do" : "Not To Do"}
                </Badge>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm">
                {task.delegatedTo ? (
                  <button 
                    onClick={() => {
                      setEditingDelegation(task.id);
                      setDelegatedTo(task.delegatedTo || "");
                    }}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Waiting on: <strong>{task.delegatedTo}</strong></span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setEditingDelegation(task.id);
                      setDelegatedTo("");
                    }}
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <User className="h-4 w-4" />
                    <span>Add who you're waiting on</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Added {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveToActive(task.id)}
                className="gap-1.5"
              >
                <Play className="h-4 w-4" />
                Activate
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => completeTask(task.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          Waiting For
        </h2>
        <p className="text-muted-foreground mt-1">
          {waitingForTasks.length} task{waitingForTasks.length !== 1 ? 's' : ''} awaiting action from others
        </p>
      </div>

      {/* To Do Section */}
      {todoWaiting.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">To Do Tasks</h3>
            <Badge className="bg-green-500/20 text-green-500">{todoWaiting.length}</Badge>
          </div>
          <AnimatePresence>
            {todoWaiting.map((task, index) => renderTaskCard(task, index))}
          </AnimatePresence>
        </div>
      )}

      {/* Not To Do Section */}
      {notTodoWaiting.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Not To Do (Avoid)</h3>
            <Badge className="bg-red-500/20 text-red-500">{notTodoWaiting.length}</Badge>
          </div>
          <AnimatePresence>
            {notTodoWaiting.map((task, index) => renderTaskCard(task, todoWaiting.length + index))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Delegation Dialog */}
      <Dialog open={!!editingDelegation} onOpenChange={() => setEditingDelegation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Who are you waiting on?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="delegatedTo">Person or Team</Label>
            <Input
              id="delegatedTo"
              value={delegatedTo}
              onChange={(e) => setDelegatedTo(e.target.value)}
              placeholder="e.g., John, Design Team, Client..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDelegation(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDelegation}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaitingView;
