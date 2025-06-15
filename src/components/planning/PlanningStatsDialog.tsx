
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
import { format, formatDistanceToNow, isPast } from "date-fns";
import { Target, Briefcase, Clock, Calendar, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanningStatsDialogProps {
  item: Goal | Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PlanningStatsDialog: React.FC<PlanningStatsDialogProps> = ({ item, open, onOpenChange }) => {
  if (!item) return null;

  const isGoal = 'milestones' in item;

  const daysRemaining = item.endDate ? formatDistanceToNow(new Date(item.endDate), { addSuffix: true }) : 'N/A';
  const isOverdue = item.endDate ? isPast(new Date(item.endDate)) : false;

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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {isGoal ? <Target className="text-primary" /> : <Briefcase className="text-primary" />}
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Statistics for your {isGoal ? 'goal' : 'project'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Badge className={cn(getCategoryColor(item.category))}>{item.category}</Badge>
            <Badge variant={getStatusBadgeVariant(item.status)}>{item.status.replace('-', ' ')}</Badge>
          </div>
        
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-300">Overall Progress</span>
              <span className="text-sm font-bold">{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-500" />
              <div>
                <div className="text-slate-400">Start Date</div>
                <div className="font-medium">{format(new Date(item.startDate), 'MMM d, yyyy')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500" />
              <div>
                <div className="text-slate-400">End Date</div>
                <div className={cn("font-medium", isOverdue && 'text-red-400')}>{format(new Date(item.endDate), 'MMM d, yyyy')}</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
                 <div className="font-medium text-slate-400">Time remaining: {daysRemaining}</div>
            </div>
          </div>
          
          {isGoal && item.milestones && item.milestones.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Milestones</h4>
              <div className="space-y-2">
                {item.milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center gap-2 text-sm">
                    {milestone.completed ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-500" />}
                    <span className={cn(milestone.completed ? 'line-through text-slate-500' : '')}>{milestone.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningStatsDialog;
