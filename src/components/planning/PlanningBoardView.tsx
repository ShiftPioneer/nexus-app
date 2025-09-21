import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, Target, Play, CheckCircle, FolderKanban, Edit, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import PlanningFilters from "./PlanningFilters";

interface PlanningBoardViewProps {
  goals: Goal[];
  projects: Project[];
  contentType: 'goals' | 'projects';
  onEditItem: (item: Goal | Project) => void;
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

const PlanningBoardView: React.FC<PlanningBoardViewProps> = ({ 
  contentType, 
  onEditItem 
}) => {
  const [items, setItems] = useState<(Goal | Project)[]>([]);
  const [filters, setFilters] = useState<GoalFilters | ProjectFilters>(
    contentType === 'goals' 
      ? { category: 'all', timeframe: 'all', priority: 'all', status: 'all' }
      : { category: 'all', status: 'all' }
  );

  // Load data from localStorage based on contentType
  useEffect(() => {
    const storageKey = contentType === 'goals' ? 'planningGoals' : 'planningProjects';
    const savedItems = localStorage.getItem(storageKey);
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, [contentType]);

  // Reset filters when content type changes
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

  const getStatusItems = (status: string) => {
    return filteredItems.filter(item => item.status === status);
  };

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

  const columns = [
    { 
      status: 'not-started', 
      title: 'Not Started', 
      icon: contentType === 'goals' ? Target : FolderKanban,
      color: 'text-slate-500'
    },
    { 
      status: 'in-progress', 
      title: 'In Progress', 
      icon: Play,
      color: 'text-primary'
    },
    { 
      status: 'completed', 
      title: 'Completed', 
      icon: CheckCircle,
      color: 'text-emerald-500'
    }
  ];

  const renderCard = (item: Goal | Project) => {
    const StatusIcon = getStatusIcon(item.status);
    
    return (
      <Card key={item.id} className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-colors group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <StatusIcon className={`h-4 w-4 ${getStatusColor(item.status)} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-semibold text-white truncate">{item.title}</CardTitle>
                <p className="text-xs text-slate-400 capitalize">{item.category}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditItem(item)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {item.description && (
            <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Progress</span>
              <span className="text-xs font-semibold text-white">{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-1.5" />
          </div>
          
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            {item.endDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(item.endDate), "MMM dd")}</span>
              </div>
            )}
            
            {'milestones' in item && item.milestones && item.milestones.length > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
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
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              {contentType === 'goals' ? (
                <Target className="h-8 w-8 text-primary" />
              ) : (
                <ClipboardList className="h-8 w-8 text-secondary" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white">
              No {contentType} yet
            </h3>
            <p className="text-slate-400 max-w-md">
              Create your first {contentType === 'goals' ? 'goal' : 'project'} to get started on your planning journey.
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const statusItems = getStatusItems(column.status);
          const StatusIcon = column.icon;
          
          return (
            <Card key={column.status} className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <StatusIcon className={`h-5 w-5 ${column.color}`} />
                  {column.title}
                  <Badge variant="secondary" className="ml-auto bg-slate-700 text-slate-300">
                    {statusItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statusItems.map((item) => renderCard(item))}
                {statusItems.length === 0 && (
                  <p className="text-slate-400 text-center py-8 text-sm">
                    No {column.title.toLowerCase()} {contentType}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanningBoardView;