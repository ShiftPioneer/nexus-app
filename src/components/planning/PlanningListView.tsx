
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Calendar, TrendingUp, Edit, Trophy, Star, Briefcase, Plus, Minus } from "lucide-react";

interface PlanningListViewProps {
  goals: Goal[];
  projects: Project[];
  contentType: 'goals' | 'projects';
  onEditItem: (item: Goal | Project) => void;
  onUpdateProgress: (item: Goal | Project, newProgress: number) => void;
}

const PlanningListView = ({ goals, projects, contentType, onEditItem, onUpdateProgress }: PlanningListViewProps) => {
  const items = contentType === 'goals' ? goals : projects;
  
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
        return contentType === 'goals' ? Target : Briefcase;
      default:
        return contentType === 'goals' ? Target : Briefcase;
    }
  };

  const handleProgressChange = (item: Goal | Project, delta: number) => {
    const newProgress = Math.max(0, Math.min(100, item.progress + delta));
    onUpdateProgress(item, newProgress);
  };

  if (items.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-slate-900/50 border-slate-700/30 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/30 via-emerald-500/20 to-transparent rounded-full blur-3xl" />
        </div>
        
        <CardContent className="relative z-10 pt-16 pb-16 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-primary to-orange-600 shadow-2xl mb-6">
            {contentType === 'goals' ? <Target className="h-10 w-10 text-white" /> : <Briefcase className="h-10 w-10 text-white" />}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No {contentType === 'goals' ? 'Goals' : 'Projects'} Yet</h3>
          <p className="text-slate-400 text-lg max-w-md">
            Create your first {contentType === 'goals' ? 'goal' : 'project'} to start tracking progress and achieving success.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const StatusIcon = getStatusIcon(item.status);
        
        return (
          <Card key={item.id} className="bg-slate-900/50 border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Icon and Basic Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${getStatusColor(item.status)} shadow-lg flex-shrink-0`}>
                    <StatusIcon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          variant="secondary" 
                          className={`bg-gradient-to-r ${getStatusColor(item.status)} text-white border-none shadow-md`}
                        >
                          {item.status.replace('-', ' ')}
                        </Badge>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditItem(item)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-700/50 text-slate-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                    )}
                    
                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-300">Progress</span>
                            <span className="text-sm font-bold text-white">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                        
                        {/* Progress Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProgressChange(item, -10)}
                            disabled={item.progress <= 0}
                            className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProgressChange(item, 10)}
                            disabled={item.progress >= 100}
                            className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Footer Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                        <div className="flex items-center gap-4">
                          {item.endDate && (
                            <div className="flex items-center gap-1 text-slate-400 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(item.endDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {'milestones' in item && item.milestones && item.milestones.length > 0 && (
                            <div className="flex items-center gap-1 text-slate-400 text-sm">
                              <Star className="h-4 w-4 text-primary" />
                              <span>{item.milestones.filter(m => m.completed).length}/{item.milestones.length} milestones</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          Created {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanningListView;
