import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { format, isAfter, addDays } from "date-fns";
import { 
  CalendarIcon, 
  Edit, 
  Target, 
  ClipboardList, 
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import PlanningStatsDialog from "./PlanningStatsDialog";

interface PlanningListViewProps {
  goals?: Goal[];
  projects?: Project[];
  contentType: 'goals' | 'projects';
  onEditItem: (item: Goal | Project) => void;
  onUpdateProgress: (item: Goal | Project, newProgress: number) => void;
}

const PlanningListView: React.FC<PlanningListViewProps> = ({
  goals = [],
  projects = [],
  contentType,
  onEditItem,
  onUpdateProgress,
}) => {
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Goal | Project | null>(null);

  const items = contentType === 'goals' ? goals : projects;

  function formatDate(date: string | Date | undefined) {
    if (!date) return "No deadline";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  }

  function isOverdue(date: string | Date | undefined) {
    if (!date) return false;
    try {
      return isAfter(new Date(), new Date(date));
    } catch (error) {
      return false;
    }
  }

  function isDueSoon(date: string | Date | undefined) {
    if (!date) return false;
    try {
      const dueDate = new Date(date);
      const soon = addDays(new Date(), 3);
      return !isAfter(dueDate, soon) && !isAfter(new Date(), dueDate);
    } catch (error) {
      return false;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'not-started':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  }

  const handleProgressChange = (item: Goal | Project, newProgress: number[]) => {
    console.log("Progress change:", item.title, newProgress[0]);
    onUpdateProgress(item, newProgress[0]);
  };

  const handleStatsClick = (item: Goal | Project) => {
    console.log("Stats clicked for:", item.title);
    setSelectedItem(item);
    setStatsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="border-slate-800 bg-slate-950/40 backdrop-blur-sm hover:bg-slate-900/50 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-blue-500/20 flex items-center justify-center border border-orange-500/20">
                    {contentType === 'goals' ? (
                      <Target className="h-6 w-6 text-orange-400" />
                    ) : (
                      <ClipboardList className="h-6 w-6 text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-100 truncate">
                        {item.title}
                      </h3>
                      <Badge className={cn("text-xs", getStatusColor(item.status))}>
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Due: {formatDate(item.endDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>Started: {formatDate(item.startDate)}</span>
                      </div>
                      
                      {contentType === 'goals' && 'milestones' in item && item.milestones && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3 w-3" />
                          <span>
                            {item.milestones.filter(m => m.completed).length}/{item.milestones.length} Milestones
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatsClick(item)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Stats
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditItem(item)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Progress</span>
                  <span className="text-sm font-semibold text-orange-400">{item.progress || 0}%</span>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={item.progress || 0} 
                    className="h-2"
                    indicatorClassName={cn(
                      "transition-all duration-300",
                      {
                        "bg-green-400": (item.progress || 0) === 100,
                        "bg-orange-400": (item.progress || 0) > 0 && (item.progress || 0) < 100,
                        "bg-slate-600": (item.progress || 0) === 0
                      }
                    )}
                  />
                  
                  <div className="px-1">
                    <Slider
                      value={[item.progress || 0]}
                      onValueChange={(values) => handleProgressChange(item, values)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {(isOverdue(item.endDate) || isDueSoon(item.endDate)) && (
                  <div className="flex items-center gap-2 mt-3">
                    <TrendingUp className={cn("h-4 w-4", {
                      "text-red-400": isOverdue(item.endDate),
                      "text-yellow-400": isDueSoon(item.endDate)
                    })} />
                    <span className={cn("text-sm font-medium", {
                      "text-red-400": isOverdue(item.endDate),
                      "text-yellow-400": isDueSoon(item.endDate)
                    })}>
                      {isOverdue(item.endDate) ? "Overdue!" : "Due soon"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {selectedItem && (
        <PlanningStatsDialog
          open={statsDialogOpen}
          onOpenChange={setStatsDialogOpen}
          item={selectedItem}
          type={contentType}
        />
      )}
    </div>
  );
};

export default PlanningListView;
