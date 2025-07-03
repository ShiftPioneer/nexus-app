
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, TrendingUp, Plus, Edit, Trash2, Trophy, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoalsListProps {
  onCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsList = ({ onCreateGoal, onEditGoal, onDeleteGoal }: GoalsListProps) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('planningGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

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
        return Target;
      default:
        return Target;
    }
  };

  const handleDelete = (id: string, title: string) => {
    onDeleteGoal(id);
    toast({
      title: "Goal Deleted",
      description: `"${title}" has been removed from your goals.`
    });
  };

  if (goals.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-slate-900/50 border-slate-700/30 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/30 via-emerald-500/20 to-transparent rounded-full blur-3xl" />
        </div>
        
        <CardContent className="relative z-10 pt-16 pb-16 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-primary to-orange-600 shadow-2xl mb-6">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Goals Yet</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-md">
            Start your journey by creating your first goal. Set targets, track progress, and achieve greatness.
          </p>
          <Button 
            onClick={onCreateGoal}
            className="gap-2 bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25 border-none rounded-xl px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Create First Goal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const StatusIcon = getStatusIcon(goal.status);
          
          return (
            <Card key={goal.id} className="relative overflow-hidden bg-slate-900/50 border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getStatusColor(goal.status)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${getStatusColor(goal.status)} shadow-lg`}>
                      <StatusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white leading-tight">{goal.title}</CardTitle>
                      <p className="text-slate-400 text-sm mt-1">{goal.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditGoal(goal)}
                      className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.id, goal.title)}
                      className="h-8 w-8 p-0 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                {goal.description && (
                  <p className="text-slate-300 text-sm leading-relaxed">{goal.description}</p>
                )}
                
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Progress</span>
                    <span className="text-sm font-bold text-white">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                {/* Status and Timeline */}
                <div className="flex items-center justify-between pt-2">
                  <Badge 
                    variant="secondary" 
                    className={`bg-gradient-to-r ${getStatusColor(goal.status)} text-white border-none shadow-md`}
                  >
                    {goal.status.replace('-', ' ')}
                  </Badge>
                  
                  {goal.targetDate && (
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {/* Milestones indicator */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/30">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm text-slate-400">
                      {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;
