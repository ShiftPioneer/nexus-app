import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedCard } from "@/components/ui/unified-card";

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
      <UnifiedCard variant="glass" className="p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Quick capture: What's on your mind?"
                className="h-12 rounded-xl pr-12"
                aria-label="Quick capture"
              />
              {inboxTasks.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground">
                  <Inbox className="h-4 w-4" />
                  <span className="text-sm">{inboxTasks.length}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!title.trim()}
              className="h-12 rounded-xl px-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Capture
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2 ml-1">
            Press Enter to capture → then clarify in your Inbox
          </p>
        </form>
      </UnifiedCard>
    </motion.div>
  );
};

export default QuickCaptureBar;
