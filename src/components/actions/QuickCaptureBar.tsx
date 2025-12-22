import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Inbox, Zap, Clock, AlertTriangle, Lightbulb, FolderOpen, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { TaskType, TaskPriority } from "@/types/unified-tasks";
import { Badge } from "@/components/ui/badge";

const QuickCaptureBar: React.FC = () => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<TaskType>("todo");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>("medium");
  const { quickCapture, inboxTasks } = useUnifiedTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    quickCapture(title.trim(), selectedType, selectedPriority);
    setTitle("");
    setIsExpanded(false);
    setSelectedType("todo");
    setSelectedPriority("medium");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  const typeOptions = [
    { value: "todo" as TaskType, label: "Task", icon: Zap, color: "text-green-400", bg: "bg-green-500/20" },
    { value: "not-todo" as TaskType, label: "Avoid", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/20" },
    { value: "project" as TaskType, label: "Project", icon: FolderOpen, color: "text-orange-400", bg: "bg-orange-500/20" },
    { value: "reference" as TaskType, label: "Reference", icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  ];

  const priorityOptions = [
    { value: "low" as TaskPriority, label: "Low", icon: Clock, color: "text-blue-400" },
    { value: "medium" as TaskPriority, label: "Medium", icon: Zap, color: "text-yellow-400" },
    { value: "high" as TaskPriority, label: "High", icon: AlertTriangle, color: "text-red-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <Inbox className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1 relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              placeholder="Quick capture - what's on your mind?"
              className="h-12 text-base bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 pr-24"
            />
            
            {inboxTasks.length > 0 && (
              <Badge 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500/20 text-orange-400 border-orange-500/30"
              >
                {inboxTasks.length} in inbox
              </Badge>
            )}
          </div>
          
          <Button 
            type="submit"
            disabled={!title.trim()}
            className="h-12 px-6 bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white font-semibold shadow-lg border-none disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Capture
          </Button>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Type Selection */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400 w-16">Type:</span>
                  <div className="flex gap-2 flex-wrap">
                    {typeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSelectedType(option.value)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                            selectedType === option.value
                              ? `${option.bg} border-primary/50`
                              : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${selectedType === option.value ? option.color : "text-slate-400"}`} />
                          <span className={`text-sm ${selectedType === option.value ? "text-white" : "text-slate-400"}`}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Priority Selection */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400 w-16">Priority:</span>
                  <div className="flex gap-2">
                    {priorityOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSelectedPriority(option.value)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                            selectedPriority === option.value
                              ? "bg-slate-700/50 border-primary/50"
                              : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${selectedPriority === option.value ? option.color : "text-slate-400"}`} />
                          <span className={`text-sm ${selectedPriority === option.value ? "text-white" : "text-slate-400"}`}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <p className="text-xs text-slate-500">
                  <Lightbulb className="h-3 w-3 inline mr-1" />
                  Press Enter to capture, Escape to collapse. Items go to your inbox for clarification.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default QuickCaptureBar;
