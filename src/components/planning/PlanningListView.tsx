import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, FolderKanban, Edit, Plus, Minus, CheckCircle, Clock, Play } from "lucide-react";
import { format } from "date-fns";
import PlanningFilters from "./PlanningFilters";

interface PlanningListViewProps {
  goals: Goal[];
  projects: Project[];
  contentType: 'goals' | 'projects';
  onEditItem: (item: Goal | Project) => void;
  onUpdateProgress: (item: Goal | Project, newProgress: number) => void;
}

interface GoalFilters {
  category: string;
  timeframe: string;
  priority: string;
  status: string;
}

interface ProjectFilters {
  category: string;
  status: string;
}

const PlanningListView: React.FC<PlanningListViewProps> = ({
  goals,
  projects,
  contentType,
  onEditItem,
  onUpdateProgress
}) => {
  const [items, setItems] = useState<(Goal | Project)[]>([]);
  const [filters, setFilters] = useState<GoalFilters | ProjectFilters>(
    contentType === 'goals' 
      ? { category: 'all', timeframe: 'all', priority: 'all', status: 'all' }
      : { category: 'all', status: 'all' }
  );

  useEffect(() => {
    setItems(contentType === 'goals' ? goals : projects);
  }, [goals, projects, contentType]);

  useEffect(() => {
    setFilters(
      contentType === 'goals' 
        ? { category: 'all', timeframe: 'all', priority: 'all', status: 'all' }
        : { category: 'all', status: 'all' }
    );
  }, [contentType]);

  const filteredItems = items.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    
    if (contentType === 'goals' && 'timeframe' in filters && 'priority' in filters) {
      const goalFilters = filters as GoalFilters;
      const goal = item as Goal;
      if (goalFilters.timeframe !== 'all' && goal.timeframe !== goalFilters.timeframe) return false;
      if (goalFilters.priority !== 'all' && goal.priority !== goalFilters.priority) return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setFilters(
      contentType === 'goals' 
        ? { category: 'all', timeframe: 'all', priority: 'all', status: 'all' }
        : { category: 'all', status: 'all' }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-500';
      case 'in-progress':
        return 'text-primary';
      case 'not-started':
        return 'text-slate-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Play;
      case 'not-started':
        return contentType === 'goals' ? Target : FolderKanban;
      default:
        return contentType === 'goals' ? Target : FolderKanban;
    }
  };

  const handleProgressChange = (item: Goal | Project, delta: number) => {
    const newProgress = Math.max(0, Math.min(100, item.progress + delta));
    onUpdateProgress(item, newProgress);
  };

  if (items.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              {contentType === 'goals' ? (
                <Target className="h-8 w-8 text-primary" />
              ) : (
                <FolderKanban className="h-8 w-8 text-secondary" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white">
              No {contentType} yet
            </h3>
            <p className="text-slate-400 max-w-md">
              Create your first {contentType === 'goals' ? 'goal' : 'project'} to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="space-y-6">
        <PlanningFilters
          filterType={contentType}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-white">
                No {contentType} match your filters
              </h3>
              <p className="text-slate-400 max-w-md">
                Try adjusting your filters or create a new {contentType === 'goals' ? 'goal' : 'project'}.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PlanningFilters
        filterType={contentType}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />
      
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isGoal = 'timeframe' in item;
          const StatusIcon = getStatusIcon(item.status);
          
          return (
            <Card key={item.id} className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <StatusIcon className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
                      <p className="text-sm text-slate-400 capitalize">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`${getStatusColor(item.status)} bg-slate-800`}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditItem(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">Progress</span>
                        <span className="text-sm font-bold text-white">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProgressChange(item, -10)}
                        disabled={item.progress <= 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProgressChange(item, 10)}
                        disabled={item.progress >= 100}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-4">
                      {item.endDate && (
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(item.endDate), "MMM dd, yyyy")}</span>
                        </div>
                      )}
                      
                      {isGoal && (item as Goal).milestones && (item as Goal).milestones.length > 0 && (
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{(item as Goal).milestones.filter(m => m.completed).length}/{(item as Goal).milestones.length} milestones</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      Created {format(new Date(item.createdAt), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanningListView;