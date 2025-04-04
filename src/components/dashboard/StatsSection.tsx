
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Calendar, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/contexts/HabitContext";
import { useGoals } from "@/contexts/GoalContext";
import { useTasks } from "@/contexts/TaskContext";

/**
 * Calculates the productivity score based on goals, tasks and habits completion rates
 */
const calculateProductivityScore = (
  weeklyGoalCompleted: boolean,
  habitsCompletionRate: number,
  tasksCompletionRate: number
) => {
  let score = 0;
  
  // Goal achievement: +15 points for weekly goal completion
  if (weeklyGoalCompleted) {
    score += 15;
  }
  
  // Habits achievement
  if (habitsCompletionRate >= 0.7) { // > 70%
    score += 10;
  } else if (habitsCompletionRate >= 0.3) { // > 30%
    score += 5;
  }
  
  // Tasks achievement
  if (tasksCompletionRate >= 0.7) { // > 70%
    score += 10;
  } else if (tasksCompletionRate >= 0.3) { // > 30%
    score += 5;
  }
  
  return score;
};

const StatsSection = () => {
  const navigate = useNavigate();
  const { habits, dailyStreak } = useHabits();
  const { goals, getGoalsProgress } = useGoals();
  const { tasks, getCompletionRate } = useTasks();
  
  const activeGoals = goals?.filter(goal => goal.status !== "completed") || [];
  const goalsProgress = getGoalsProgress() || 0;
  
  const totalTasks = tasks?.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && 
      taskDate.getDate() === today.getDate() && 
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear();
  }) || [];
  
  const completedTasks = totalTasks.filter(task => task.completed);
  const completionRate = getCompletionRate();
  
  const weeklyGoalCompleted = goals?.some(goal => 
    goal.timeframe === "week" && goal.status === "completed"
  ) || false;
  
  const habitsCompletionRate = habits?.length ? 
    habits.filter(h => h.status === "completed").length / habits.length : 0;
  
  const tasksCompletionRate = totalTasks.length ? 
    completedTasks.length / totalTasks.length : 0;
  
  const productivityScore = calculateProductivityScore(
    weeklyGoalCompleted,
    habitsCompletionRate,
    tasksCompletionRate
  );
  
  // Helper for navigation
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Stats data connected to actual application state
  const stats = [
    {
      title: "Habit Streak",
      value: `${dailyStreak} day${dailyStreak !== 1 ? 's' : ''}`,
      change: `+${dailyStreak - (dailyStreak > 0 ? 1 : 0)} from last week`,
      icon: <CheckCircle className="h-8 w-8 text-success" />,
      color: "bg-success/10 border-success/20",
      onClick: () => navigateTo("/habits"),
    },
    {
      title: "Goals Progress",
      value: `${Math.round(goalsProgress)}%`,
      change: `${activeGoals.length} active goal${activeGoals.length !== 1 ? 's' : ''}`,
      icon: <Target className="h-8 w-8 text-primary" />,
      color: "bg-primary/10 border-primary/20",
      onClick: () => navigateTo("/planning"),
    },
    {
      title: "Tasks Completed",
      value: `${completedTasks.length}/${totalTasks.length}`,
      change: `${Math.round(completionRate * 100)}% completion rate`,
      icon: <Calendar className="h-8 w-8 text-secondary" />,
      color: "bg-secondary/10 border-secondary/20",
      onClick: () => navigateTo("/tasks"),
    },
    {
      title: "Productivity Score",
      value: String(productivityScore),
      change: `+${productivityScore - (productivityScore > 5 ? 5 : 0)} points this week`,
      icon: <BarChart2 className="h-8 w-8 text-accent" />,
      color: "bg-accent/10 border-accent/20",
      onClick: () => navigateTo("/stats"),
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`overflow-hidden card-hover border ${stat.color} cursor-pointer`}
          onClick={stat.onClick}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div>{stat.icon}</div>
            </div>
            
            {/* Simple progress indicator */}
            <div className="progress-bar-bg mt-4">
              <div 
                className={`progress-bar-fill animate-progress`}
                style={{ 
                  width: stat.title.includes("Progress") ? stat.value : `${Math.random() * 100}%`,
                  backgroundColor: stat.icon.props.className.includes("success") ? "#39D98A" : 
                                stat.icon.props.className.includes("primary") ? "#FF6500" :
                                stat.icon.props.className.includes("secondary") ? "#024CAA" : "#00D4FF"
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default StatsSection;
