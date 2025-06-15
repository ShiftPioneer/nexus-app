
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Target, Briefcase, BarChart3, Clock, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import PlanningStatsDialog from "./PlanningStatsDialog";

interface PlanningListViewProps {
  goals?: Goal[];
  projects?: Project[];
  contentType: "goals" | "projects";
  onEditItem: (item: Goal | Project) => void;
  onUpdateProgress: (item: Goal | Project, progress: number) => void;
}

const PlanningListView: React.FC<PlanningListViewProps> = ({
  goals = [],
  projects = [],
  contentType,
  onEditItem,
  onUpdateProgress,
}) => {
  const [editingProgress, setEditingProgress] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [statsItem, setStatsItem] = useState<Goal | Project | null>(null);

  const getCategoryIcon = (category: string) => {
    const badgeClass = "text-white text-xs px-2.5 py-1 rounded-full";
    switch (category) {
      case "wealth":
        return <Badge className={cn(badgeClass, "bg-orange-500 hover:bg-orange-600")}>Wealth</Badge>;
      case "health":
        return <Badge className={cn(badgeClass, "bg-green-500 hover:bg-green-600")}>Health</Badge>;
      case "relationships":
        return <Badge className={cn(badgeClass, "bg-pink-500 hover:bg-pink-600")}>Relationships</Badge>;
      case "spirituality":
        return <Badge className={cn(badgeClass, "bg-purple-500 hover:bg-purple-600")}>Spirituality</Badge>;
      case "education":
        return <Badge className={cn(badgeClass, "bg-blue-500 hover:bg-blue-600")}>Education</Badge>;
      case "career":
        return <Badge className={cn(badgeClass, "bg-indigo-500 hover:bg-indigo-600")}>Career</Badge>;
      default:
        return <Badge className={cn(badgeClass, "bg-gray-500 hover:bg-gray-600")}>{category}</Badge>;
    }
  };

  const handleProgressEditStart = (item: Goal | Project) => {
    setEditingProgress(item.id);
    setTempProgress(item.progress);
  };
  
  const handleProgressSave = (item: Goal | Project) => {
    onUpdateProgress(item, tempProgress);
    setEditingProgress(null);
  };

  const renderItem = (item: Goal | Project) => {
    const isGoal = 'milestones' in item;
    const progressBeingEdited = editingProgress === item.id;

    return (
      <Card
        key={item.id}
        className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors duration-300 rounded-2xl shadow-lg"
      >
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                  {isGoal ? (
                    <Target className="h-5 w-5 text-primary" />
                  ) : (
                    <Briefcase className="h-5 w-5 text-primary" />
                  )}
                </div>
                <h3 onClick={() => onEditItem(item)} className="cursor-pointer text-lg font-semibold text-slate-100 hover:text-primary transition-colors">{item.title}</h3>
              </div>
              {getCategoryIcon(item.category)}
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Progress</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{progressBeingEdited ? tempProgress : item.progress}%</span>
                  {!progressBeingEdited ? (
                    <button onClick={() => handleProgressEditStart(item)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md">
                      <Edit size={14} />
                    </button>
                  ) : (
                    <button onClick={() => handleProgressSave(item)} className="text-green-400 hover:text-green-300 transition-colors p-1 rounded-md">
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
              {progressBeingEdited ? (
                <Slider
                  value={[tempProgress]}
                  onValueChange={(value) => setTempProgress(value[0])}
                  max={100}
                  step={1}
                />
              ) : (
                <Progress value={item.progress} className="h-2" indicatorClassName="bg-primary" />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary/70" />
              <span>
                {format(new Date(item.startDate), "MMM d, yyyy")} - {format(new Date(item.endDate), "MMM d, yyyy")}
              </span>
            </div>
            <button 
              onClick={() => setStatsItem(item)}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Stats</span>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const items = contentType === "goals" ? goals : projects;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(renderItem)}
      </div>
      <PlanningStatsDialog 
        item={statsItem}
        open={!!statsItem}
        onOpenChange={() => setStatsItem(null)}
      />
    </>
  );
};

export default PlanningListView;
