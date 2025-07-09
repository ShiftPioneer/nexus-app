
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import GoalProgressControl from "../GoalProgressControl";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (goalId: string, newProgress: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wealth': return '💰';
      case 'health': return '🏃';
      case 'relationships': return '❤️';
      case 'spirituality': return '🧘';
      case 'education': return '📚';
      case 'career': return '💼';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wealth': return 'from-emerald-500 to-green-600';
      case 'health': return 'from-blue-500 to-cyan-600';
      case 'relationships': return 'from-pink-500 to-rose-600';
      case 'spirituality': return 'from-purple-500 to-indigo-600';
      case 'education': return 'from-orange-500 to-red-600';
      case 'career': return 'from-slate-500 to-slate-600';
      default: return 'from-primary to-orange-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in-progress': return 'bg-primary/20 text-primary border-primary/30';
      case 'not-started': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'week': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'month': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'quarter': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'year': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'decade': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'lifetime': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-slate-900/80 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(goal.category)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(goal.category)} shadow-lg`}>
              <span className="text-xl">{getCategoryIcon(goal.category)}</span>
            </div>
            <div>
              <Badge className={`${getTimeframeColor(goal.timeframe)} font-medium border`}>
                <Calendar className="h-3 w-3 mr-1" />
                {goal.timeframe}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.id)}
              className="h-8 w-8 p-0 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardTitle className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-200">
          {goal.title}
        </CardTitle>
        
        {goal.description && (
          <p className="text-slate-400 text-sm line-clamp-2 mb-4">
            {goal.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={`${getStatusColor(goal.status)} font-medium border`}>
            {goal.status.replace('-', ' ')}
          </Badge>
        </div>

        <GoalProgressControl
          currentProgress={goal.progress}
          onUpdateProgress={(newProgress) => onUpdateProgress(goal.id, newProgress)}
        />

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(new Date(goal.endDate), 'MMM dd, yyyy')}</span>
          </div>
          {goal.milestones && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
