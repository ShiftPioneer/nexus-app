
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, formatDistanceToNow, isPast, differenceInDays } from "date-fns";
import { Target, Briefcase, Clock, Calendar, CheckCircle, Circle, TrendingUp, Award, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanningStatsDialogProps {
  item: Goal | Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'goals' | 'projects';
}

const PlanningStatsDialog: React.FC<PlanningStatsDialogProps> = ({ item, open, onOpenChange, type }) => {
  if (!item) return null;

  const isGoal = type === 'goals';
  const daysRemaining = item.endDate ? formatDistanceToNow(new Date(item.endDate), { addSuffix: true }) : 'N/A';
  const isOverdue = item.endDate ? isPast(new Date(item.endDate)) : false;
  const totalDays = item.startDate && item.endDate ? differenceInDays(new Date(item.endDate), new Date(item.startDate)) : 0;
  const daysPassed = item.startDate ? differenceInDays(new Date(), new Date(item.startDate)) : 0;
  const timeProgress = totalDays > 0 ? Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100) : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wealth": return "bg-orange-500 hover:bg-orange-600";
      case "health": return "bg-green-500 hover:bg-green-600";
      case "relationships": return "bg-pink-500 hover:bg-pink-600";
      case "spirituality": return "bg-purple-500 hover:bg-purple-600";
      case "education": return "bg-blue-500 hover:bg-blue-600";
      case "career": return "bg-blue-500 hover:bg-blue-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'outline';
      default: return 'secondary';
    }
  };

  const getProgressLevel = (progress: number) => {
    if (progress >= 80) return { level: "Excellent", icon: Award, color: "text-green-400" };
    if (progress >= 60) return { level: "Good", icon: TrendingUp, color: "text-blue-400" };
    if (progress >= 40) return { level: "Fair", icon: Flame, color: "text-orange-400" };
    return { level: "Needs Focus", icon: Target, color: "text-red-400" };
  };

  const progressLevel = getProgressLevel(item.progress || 0);
  const ProgressIcon = progressLevel.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {isGoal ? <Target className="text-orange-400" /> : <Briefcase className="text-blue-400" />}
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Detailed analytics and progress tracking for your {isGoal ? 'goal' : 'project'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Badge className={cn(getCategoryColor(item.category), "text-white font-medium")}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Badge>
            <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
              {item.status.replace('-', ' ')}
            </Badge>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ProgressIcon className={cn("h-5 w-5", progressLevel.color)} />
                <span className="text-sm font-medium text-slate-300">Progress Level</span>
              </div>
              <span className={cn("text-sm font-bold", progressLevel.color)}>{progressLevel.level}</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Overall Progress</span>
                <span className="text-lg font-bold text-orange-400">{item.progress || 0}%</span>
              </div>
              <Progress value={item.progress || 0} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Time Progress</span>
                <span className="text-sm font-bold text-slate-400">{Math.round(timeProgress)}%</span>
              </div>
              <Progress value={timeProgress} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Started</span>
                <span>Current</span>
                <span>Deadline</span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-slate-800/50 p-3 rounded-lg">
              <Calendar size={16} className="text-slate-500" />
              <div>
                <div className="text-slate-400">Start Date</div>
                <div className="font-medium text-slate-200">{format(new Date(item.startDate), 'MMM d, yyyy')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-3 rounded-lg">
              <Clock size={16} className="text-slate-500" />
              <div>
                <div className="text-slate-400">End Date</div>
                <div className={cn("font-medium", isOverdue ? 'text-red-400' : 'text-slate-200')}>
                  {format(new Date(item.endDate), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-300">Time Remaining</span>
            </div>
            <div className={cn("font-medium", isOverdue ? 'text-red-400' : 'text-orange-400')}>
              {daysRemaining}
              {isOverdue && " (Overdue)"}
            </div>
          </div>
          
          {/* Milestones Section for Goals */}
          {isGoal && 'milestones' in item && item.milestones && item.milestones.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-slate-200 flex items-center gap-2">
                <CheckCircle size={16} className="text-orange-400" />
                Milestones ({item.milestones.filter(m => m.completed).length}/{item.milestones.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {item.milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center gap-3 text-sm bg-slate-800/30 p-2 rounded">
                    {milestone.completed ? 
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0" /> : 
                      <Circle size={16} className="text-slate-500 flex-shrink-0" />
                    }
                    <div className="flex-1">
                      <span className={cn(milestone.completed ? 'line-through text-slate-500' : 'text-slate-200')}>
                        {milestone.title}
                      </span>
                      <div className="text-xs text-slate-400">
                        Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 p-4 rounded-lg border border-orange-500/20">
            <h4 className="text-sm font-semibold text-orange-400 mb-2">Performance Insights</h4>
            <div className="space-y-1 text-xs text-slate-300">
              {item.progress === 0 && <p>• Consider breaking this down into smaller, actionable steps</p>}
              {item.progress > 0 && item.progress < 50 && <p>• You're making progress! Keep the momentum going</p>}
              {item.progress >= 50 && item.progress < 100 && <p>• Great progress! You're more than halfway there</p>}
              {item.progress === 100 && <p>• Congratulations! You've completed this {isGoal ? 'goal' : 'project'}</p>}
              {isOverdue && <p>• This is overdue - consider adjusting the timeline or priority</p>}
              {timeProgress > (item.progress || 0) + 20 && <p>• Progress is behind schedule - time to accelerate!</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningStatsDialog;
