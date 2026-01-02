import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";

const QuickCaptureBar: React.FC = () => {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { quickCapture, inboxTasks } = useUnifiedTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    quickCapture(title.trim());
    setTitle("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Quick capture: What's on your mind?"
              className="h-12 pl-4 pr-12 bg-slate-900/80 border-slate-700/50 focus:border-primary/50 text-white placeholder:text-slate-500 rounded-xl"
            />
            {inboxTasks.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
                <Inbox className="h-4 w-4" />
                <span className="text-sm">{inboxTasks.length}</span>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={!title.trim()}
            className="h-12 px-6 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Capture
          </Button>
        </div>
        
        <p className="text-xs text-slate-500 mt-2 ml-1">
          Press Enter to capture → then clarify in your Inbox
        </p>
      </form>
    </motion.div>
  );
};

export default QuickCaptureBar;
