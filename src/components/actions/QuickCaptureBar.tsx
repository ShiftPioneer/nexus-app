import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Inbox, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Target,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedCard } from "@/components/ui/unified-card";
import { TaskType } from "@/types/unified-tasks";
import { cn } from "@/lib/utils";

const QuickCaptureBar: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskType, setTaskType] = useState<"todo" | "not-todo">("todo");
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask, inboxTasks } = useUnifiedTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Derive priority from Eisenhower
    const priority = urgent && important ? "urgent" : 
                     !urgent && important ? "high" : 
                     urgent && !important ? "medium" : "low";

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      type: taskType,
      status: "inbox",
      priority,
      category: "general",
      urgent,
      important,
      clarified: false,
      completed: false,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setUrgent(false);
    setImportant(false);
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isExpanded) {
      handleSubmit(e);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const derivedPriority = urgent && important ? "Do First" : 
                          !urgent && important ? "Schedule" : 
                          urgent && !important ? "Delegate" : "Consider";

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <UnifiedCard variant="glass" className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Task Type Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTaskType("todo")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm",
                taskType === "todo" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <CheckCircle className="h-4 w-4" />
              To Do
            </button>
            <button
              type="button"
              onClick={() => setTaskType("not-todo")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm",
                taskType === "not-todo" 
                  ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <XCircle className="h-4 w-4" />
              Not To Do
            </button>
            
            {inboxTasks.length > 0 && (
              <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
                <Inbox className="h-4 w-4" />
                <span className="text-sm font-medium">{inboxTasks.length} in inbox</span>
              </div>
            )}
          </div>

          {/* Main Input Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={taskType === "todo" 
                  ? "What do you need to do?" 
                  : "What should you avoid doing?"
                }
                className="h-12 rounded-xl pr-12"
                aria-label="Quick capture"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={toggleExpand}
                className="h-12 rounded-xl px-4"
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
              
              <Button
                type="submit"
                disabled={!title.trim()}
                className={cn(
                  "h-12 rounded-xl px-6",
                  taskType === "todo" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                    : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                )}
              >
                <Plus className="h-5 w-5 mr-2" />
                Capture
              </Button>
            </div>
          </div>

          {/* Expanded Form */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4 border-t border-border/50 mt-4">
                  {/* Description */}
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Description (optional)
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={taskType === "todo" 
                        ? "Add more details about this task..." 
                        : "Why should you avoid this? What triggers it?"
                      }
                      className="resize-none rounded-xl"
                      rows={2}
                    />
                  </div>

                  {/* Eisenhower Priority */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm text-muted-foreground">
                        Priority (Eisenhower Matrix)
                      </Label>
                      <Badge variant="outline" className="capitalize">
                        {derivedPriority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between rounded-xl border bg-card/50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <div>
                            <div className="text-sm font-medium">Urgent</div>
                            <div className="text-xs text-muted-foreground">Time-sensitive</div>
                          </div>
                        </div>
                        <Switch checked={urgent} onCheckedChange={setUrgent} />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border bg-card/50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">Important</div>
                            <div className="text-xs text-muted-foreground">Goal-aligned</div>
                          </div>
                        </div>
                        <Switch checked={important} onCheckedChange={setImportant} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground mt-3 ml-1">
            {isExpanded 
              ? "Fill in details and click Capture to add to your inbox"
              : "Press Enter to quick capture → click expand for more options"
            }
          </p>
        </form>
      </UnifiedCard>
    </motion.div>
  );
};

export default QuickCaptureBar;
