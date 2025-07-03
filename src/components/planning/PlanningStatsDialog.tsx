
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, TrendingUp, Trophy, Star, Clock, Briefcase } from "lucide-react";

interface PlanningStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Goal | Project | null;
  type: 'goals' | 'projects';
}

const PlanningStatsDialog = ({ open, onOpenChange, item, type }: PlanningStatsDialogProps) => {
  if (!item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-emerald-500 to-teal-600';
      case 'in-progress':
        return 'from-primary to-orange-600';
      case 'not-started':
        return 'from-slate-600 to-slate-700';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return Trophy;
      case 'in-progress':
        return TrendingUp;
      case 'not-started':
        return type === 'goals' ? Target : Briefcase;
      default:
        return type === 'goals' ? Target : Briefcase;
    }
  };

  const StatusIcon = getStatusIcon(item.status);
  const daysSinceCreated = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilTarget = item.targetDate ? Math.floor((new Date(item.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${getStatusColor(item.status)} shadow-lg`}>
              <StatusIcon className="h-6 w-6 text-white" />
            </div>
            {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="secondary" 
                  className={`bg-gradient-to-r ${getStatusColor(item.status)} text-white border-none shadow-md`}
                >
                  {item.status.replace('-', ' ')}
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Type</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-white font-medium">{item.type}</span>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Card className="bg-slate-800/50 border-slate-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Overall Progress</span>
                  <span className="text-lg font-bold text-white">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-3" />
              </div>
              
              {'milestones' in item && item.milestones && item.milestones.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-slate-300">Milestones</span>
                  </div>
                  <div className="space-y-2">
                    {item.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30">
                        <span className={`text-sm ${milestone.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {milestone.title}
                        </span>
                        <Badge variant={milestone.completed ? "default" : "secondary"}>
                          {milestone.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <Clock className="h-4 w-4" />
                  Days Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold text-white">{daysSinceCreated}</span>
                <p className="text-xs text-slate-400 mt-1">Since creation</p>
              </CardContent>
            </Card>
            
            {daysUntilTarget !== null && (
              <Card className="bg-slate-800/50 border-slate-700/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <Calendar className="h-4 w-4" />
                    Target Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className={`text-2xl font-bold ${daysUntilTarget < 0 ? 'text-red-400' : daysUntilTarget < 7 ? 'text-yellow-400' : 'text-white'}`}>
                    {Math.abs(daysUntilTarget)}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    {daysUntilTarget < 0 ? 'Days overdue' : 'Days remaining'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <Card className="bg-slate-800/50 border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-400">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningStatsDialog;
