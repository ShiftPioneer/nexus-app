
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  DollarSign, 
  Heart, 
  Briefcase, 
  GraduationCap,
  Users,
  Zap,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalsListProps {
  onCreateGoal: () => void;
  onEditGoal: (goal: any) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ onCreateGoal, onEditGoal, onDeleteGoal }) => {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('planningGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health": return Heart;
      case "career": return Briefcase;
      case "education": return GraduationCap;
      case "relationships": return Users;
      case "wealth": return DollarSign;
      case "personal": return Zap;
      default: return Target;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "health": return "from-green-500 to-emerald-600";
      case "career": return "from-blue-500 to-indigo-600";
      case "education": return "from-purple-500 to-violet-600";
      case "relationships": return "from-pink-500 to-rose-600";
      case "wealth": return "from-orange-500 to-lime-500";
      case "personal": return "from-cyan-500 to-teal-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "on-hold": return "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300";
      case "not-started": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "not-started": return "Not Started";
      case "in-progress": return "In Progress";
      case "on-hold": return "On Hold";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDeadline = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (goals.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first goal to track your progress and achieve your dreams.
          </p>
          <Button onClick={onCreateGoal} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const IconComponent = getCategoryIcon(goal.category);
        const daysUntil = getDaysUntilDeadline(goal.deadline);
        const isOverdue = daysUntil !== null && daysUntil < 0;
        const isUrgent = daysUntil !== null && daysUntil <= 7 && daysUntil >= 0;

        return (
          <Card key={goal.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            {/* Category gradient header */}
            <div className={cn("h-2 bg-gradient-to-r", getCategoryGradient(goal.category))} />
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-r text-white",
                    getCategoryGradient(goal.category)
                  )}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {goal.title}
                    </CardTitle>
                    <Badge className={getStatusColor(goal.status)} variant="secondary">
                      {getStatusText(goal.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditGoal(goal)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {goal.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {goal.description}
                </p>
              )}

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold">{goal.progress || 0}%</span>
                </div>
                <Progress 
                  value={goal.progress || 0} 
                  className="h-3"
                />
              </div>

              {/* Deadline */}
              {goal.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className={cn(
                    isOverdue ? "text-red-600 font-medium" :
                    isUrgent ? "text-lime-600 font-medium" :
                    "text-muted-foreground"
                  )}>
                    {formatDate(goal.deadline)}
                    {daysUntil !== null && (
                      <span className="ml-1">
                        {isOverdue ? `(${Math.abs(daysUntil)} days overdue)` :
                         daysUntil === 0 ? "(Due today)" :
                         `(${daysUntil} days left)`}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Milestones */}
              {goal.milestones && goal.milestones.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Milestones</span>
                  </div>
                  <div className="space-y-1">
                    {goal.milestones.slice(0, 3).map((milestone: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          milestone.completed ? "bg-green-500" : "bg-gray-300"
                        )} />
                        <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                    {goal.milestones.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{goal.milestones.length - 3} more milestones
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalsList;
