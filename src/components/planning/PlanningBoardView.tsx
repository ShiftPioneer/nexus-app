
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Calendar, TrendingUp, Edit, Trophy, Star, Briefcase } from "lucide-react";

interface PlanningBoardViewProps {
  goals: Goal[];
  projects: Project[];
  contentType: 'goals' | 'projects';
  onEditItem: (item: Goal | Project) => void;
}

const PlanningBoardView = ({ goals, projects, contentType, onEditItem }: PlanningBoardViewProps) => {
  const items = contentType === 'goals' ? goals : projects;
  
  const getStatusItems = (status: string) => {
    return items.filter(item => item.status === status);
  };

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

  const columns = [
    { id: 'not-started', title: 'Not Started', status: 'not-started' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'completed', title: 'Completed', status: 'completed' }
  ];

  const renderCard = (item: Goal | Project) => {
    const StatusIcon = getStatusIcon(item.status);
    
    return (
      <Card key={item.id} className="bg-slate-900/50 border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${getStatusColor(item.status)} shadow-lg`}>
                <StatusIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-semibold text-white leading-tight truncate">{item.title}</CardTitle>
                <p className="text-xs text-slate-400 mt-1">{item.type}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditItem(item)}
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-700/50 text-slate-400 hover:text-white"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {item.description && (
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>
          )}
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Progress</span>
              <span className="text-xs font-semibold text-white">{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-1.5" />
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            {item.targetDate && (
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Calendar className="h-3 w-3" />
                <span>{new Date(item.targetDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {'milestones' in item && item.milestones && item.milestones.length > 0 && (
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Star className="h-3 w-3 text-primary" />
                <span>{item.milestones.filter(m => m.completed).length}/{item.milestones.length}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
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
            Start organizing your {contentType === 'goals' ? 'goals' : 'projects'} using this board view to track progress efficiently.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Board View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnItems = getStatusItems(column.status);
          
          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r ${getStatusColor(column.status)} shadow-lg`}>
                    <span className="text-white text-sm font-bold">{columnItems.length}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-700/50">
                  {columnItems.length}
                </Badge>
              </div>
              
              {/* Column Content */}
              <div className="space-y-3 min-h-[400px]">
                {columnItems.length > 0 ? (
                  columnItems.map(renderCard)
                ) : (
                  <Card className="bg-slate-900/30 border-slate-700/20 border-dashed">
                    <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center">
                      <div className="text-slate-500 text-sm">
                        No {contentType === 'goals' ? 'goals' : 'projects'} {column.title.toLowerCase()}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanningBoardView;
