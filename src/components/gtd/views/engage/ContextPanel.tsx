
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Filter, Search } from "lucide-react";
import { useGTD } from "../../GTDContext";
import { GTDTask } from "@/types/gtd";

interface ContextPanelProps {
  selectedContext: string;
  onContextChange: (context: string) => void;
}

const ContextPanel: React.FC<ContextPanelProps> = ({ selectedContext, onContextChange }) => {
  const { tasks } = useGTD();
  const [showAddContext, setShowAddContext] = useState(false);
  const [newContext, setNewContext] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Get all unique contexts from tasks
  const contexts = Array.from(new Set(tasks.map(task => task.context).filter(Boolean))) as string[];

  const filteredTasks = tasks.filter(task => {
    const contextMatch = selectedContext === "all" || task.context === selectedContext;
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter;
    const statusMatch = task.status === "next-action" || task.status === "today";
    return contextMatch && priorityMatch && statusMatch;
  });

  const addNewContext = () => {
    if (newContext.trim()) {
      onContextChange(newContext.trim());
      setNewContext("");
      setShowAddContext(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-red-500/50 text-red-300 bg-red-500/10";
      case "high": return "border-orange-500/50 text-orange-300 bg-orange-500/10";
      case "medium": return "border-yellow-500/50 text-yellow-300 bg-yellow-500/10";
      case "low": return "border-green-500/50 text-green-300 bg-green-500/10";
      default: return "border-slate-500/50 text-slate-300 bg-slate-500/10";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-blue-400" />
            Contexts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Context Selection */}
          <div className="space-y-2">
            <Label className="text-slate-300">Current Context</Label>
            <Select value={selectedContext} onValueChange={onContextChange}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Contexts</SelectItem>
                {contexts.map(context => (
                  <SelectItem key={context} value={context}>{context}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add New Context */}
          {showAddContext ? (
            <div className="space-y-2">
              <Label className="text-slate-300">New Context</Label>
              <div className="flex gap-2">
                <Input
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="@home, @office, @phone..."
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Button onClick={addNewContext} size="sm">Add</Button>
                <Button onClick={() => setShowAddContext(false)} variant="outline" size="sm">Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowAddContext(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Context
            </Button>
          )}

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label className="text-slate-300">Priority Filter</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Context Stats */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-sm">Context Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Tasks:</span>
              <span className="text-white">{filteredTasks.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Active Contexts:</span>
              <span className="text-white">{contexts.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions for Context */}
      {filteredTasks.length > 0 && (
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-sm">Available Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredTasks.slice(0, 3).map(task => (
              <div key={task.id} className="p-2 bg-slate-800/50 rounded border border-slate-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{task.title}</span>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
            {filteredTasks.length > 3 && (
              <p className="text-slate-400 text-xs text-center">
                +{filteredTasks.length - 3} more tasks
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContextPanel;
