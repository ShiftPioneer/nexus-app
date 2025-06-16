
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Circle, CircleDashed, CheckCircle2, Calendar, Clock, Edit, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlanningBoardViewProps {
  goals?: Goal[];
  projects?: Project[];
  contentType: "goals" | "projects";
  onEditItem: (item: Goal | Project) => void;
}

const PlanningBoardView: React.FC<PlanningBoardViewProps> = ({
  goals = [],
  projects = [],
  contentType,
  onEditItem,
}) => {
  const items = contentType === "goals" ? goals : projects;

  const notStartedItems = items.filter(item => item.status === "not-started");
  const inProgressItems = items.filter(item => item.status === "in-progress");
  const completedItems = items.filter(item => item.status === "completed");

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "No deadline";
    try {
      return format(new Date(date), "MMM d");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'not-started':
        return { 
          icon: CircleDashed, 
          title: 'Not Started', 
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20'
        };
      case 'in-progress':
        return { 
          icon: Circle, 
          title: 'In Progress', 
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'completed':
        return { 
          icon: CheckCircle2, 
          title: 'Completed', 
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      default:
        return { 
          icon: Circle, 
          title: 'Unknown', 
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20'
        };
    }
  };

  const renderItem = (item: Goal | Project, index: number) => {
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className="mb-3 bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-200 group">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 flex-1">
                {item.title}
              </h3>
              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditItem(item)}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {item.description && (
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {item.description}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-400">Progress</span>
                  <span className="text-xs font-semibold text-orange-400">{item.progress || 0}%</span>
                </div>
                <Progress 
                  value={item.progress || 0} 
                  className="h-1.5"
                  indicatorClassName={cn(
                    "transition-all duration-300",
                    {
                      "bg-green-400": (item.progress || 0) === 100,
                      "bg-orange-400": (item.progress || 0) > 0 && (item.progress || 0) < 100,
                      "bg-slate-600": (item.progress || 0) === 0
                    }
                  )}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.endDate)}</span>
                </div>
                
                {contentType === 'goals' && 'milestones' in item && item.milestones && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{item.milestones.filter(m => m.completed).length}/{item.milestones.length}</span>
                  </div>
                )}
              </div>

              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs w-fit capitalize",
                  item.status === 'completed' ? 'border-green-500/30 text-green-400' :
                  item.status === 'in-progress' ? 'border-blue-500/30 text-blue-400' :
                  'border-slate-500/30 text-slate-400'
                )}
              >
                {item.status.replace('-', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderColumn = (status: string, items: (Goal | Project)[], index: number) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <motion.div
        key={status}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="flex-1 min-w-0"
      >
        <Card className={cn("h-full bg-slate-950/20 backdrop-blur-sm border-slate-800", config.borderColor)}>
          <CardHeader className={cn("pb-3", config.bgColor)}>
            <CardTitle className="flex items-center gap-3 text-base">
              <div className={cn("p-2 rounded-lg", config.bgColor, config.borderColor, "border")}>
                <IconComponent className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1">
                <div className={cn("font-semibold", config.color)}>{config.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {items.length} {contentType === 'goals' ? 'goals' : 'projects'}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {items.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {items.map((item, itemIndex) => renderItem(item, itemIndex))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className={cn("w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center", config.bgColor)}>
                  <IconComponent className={cn("h-6 w-6", config.color)} />
                </div>
                <p className="text-sm text-slate-400 mb-2">No {contentType} here</p>
                <p className="text-xs text-slate-500">
                  {status === 'not-started' ? 'Create new items to get started' :
                   status === 'in-progress' ? 'Move items here when working on them' :
                   'Completed items will appear here'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {renderColumn('not-started', notStartedItems, 0)}
      {renderColumn('in-progress', inProgressItems, 1)}
      {renderColumn('completed', completedItems, 2)}
    </div>
  );
};

export default PlanningBoardView;
