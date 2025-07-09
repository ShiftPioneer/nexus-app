
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Inbox, Zap, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useGTD } from "../../GTDContext";

const QuickCaptureForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [context, setContext] = useState("");
  const [type, setType] = useState<"task" | "idea" | "project" | "reference">("task");
  const { addTask } = useGTD();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      context: context.trim() || undefined,
      type,
      status: "inbox",
      category: "inbox",
      clarified: false
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setContext("");
    setType("task");
  };

  const priorityOptions = [
    { value: "low", label: "Low", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
    { value: "medium", label: "Medium", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
    { value: "high", label: "High", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" }
  ];

  const typeOptions = [
    { value: "task", label: "Task", color: "text-green-400", bg: "bg-green-500/20" },
    { value: "idea", label: "Idea", color: "text-purple-400", bg: "bg-purple-500/20" },
    { value: "project", label: "Project", color: "text-orange-400", bg: "bg-orange-500/20" },
    { value: "reference", label: "Reference", color: "text-cyan-400", bg: "bg-cyan-500/20" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Quick Capture</CardTitle>
              <p className="text-slate-400 mt-1">Collect everything that has your attention</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="title" className="text-white font-semibold flex items-center gap-2">
                <span className="text-primary">*</span> What's on your mind?
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your thought, task, or idea..."
                className="h-12 text-base bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                required
              />
            </motion.div>

            {/* Type Selection */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label className="text-white font-semibold">Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value as any)}
                    className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                      type === option.value
                        ? `${option.bg} border-primary/50 shadow-lg`
                        : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                    }`}
                  >
                    <div className={`font-medium ${type === option.value ? option.color : "text-slate-300"}`}>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Priority Selection */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-white font-semibold">Priority Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value as any)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                      priority === option.value
                        ? `${option.bg} ${option.border} shadow-lg`
                        : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                    }`}
                  >
                    <option.icon 
                      className={`h-5 w-5 ${priority === option.value ? option.color : "text-slate-400"}`} 
                    />
                    <span className={`font-medium ${priority === option.value ? "text-white" : "text-slate-300"}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="description" className="text-white font-semibold">Additional Details</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional context or details..."
                rows={4}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none transition-all duration-200"
              />
            </motion.div>

            {/* Context */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="context" className="text-white font-semibold">Context</Label>
              <Input
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="@home, @office, @calls, @computer..."
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 transition-all duration-200"
              />
              <p className="text-xs text-slate-500">Use @ to specify where or how this can be done</p>
            </motion.div>

            {/* Submit Button - Updated styling */}
            <motion.div 
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                type="submit" 
                disabled={!title.trim()}
                className="w-full h-12 bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white font-semibold shadow-xl shadow-primary/25 border-none rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Plus className="h-5 w-5 mr-2" />
                Capture to Inbox
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickCaptureForm;
