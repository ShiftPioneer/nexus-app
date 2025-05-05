
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, ClipboardCheck, BarChart2 } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";

const StatsSection = () => {
  const { tasks } = useGTD();
  const [goalStats, setGoalStats] = useState({ progress: 0, activeCount: 0 });
  const [habitStats, setHabitStats] = useState({ streak: 0, change: "+0" });
  
  // Calculate task stats
  const calculateTaskStats = () => {
    const totalTasks = tasks.filter(task => !task.isToDoNot).length;
    if (!totalTasks || totalTasks === 0) return { completed: 0, total: 0, rate: 0 };
    
    // Count tasks that have been completed
    const completedTasks = tasks.filter(task => task.status === "completed" && !task.isToDoNot).length;
    return { 
      completed: completedTasks, 
      total: totalTasks,
      rate: Math.round((completedTasks / totalTasks) * 100) 
    };
  };
  
  // Get goal stats from localStorage
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        const activeGoals = goals.filter((g: any) => g.status !== 'completed');
        
        let totalProgress = 0;
        activeGoals.forEach((goal: any) => {
          totalProgress += goal.progress || 0;
        });
        
        const avgProgress = activeGoals.length > 0 
          ? Math.round(totalProgress / activeGoals.length) 
          : 0;
          
        setGoalStats({
          progress: avgProgress,
          activeCount: activeGoals.length
        });
      }
      
      // Get habit stats
      const savedHabits = localStorage.getItem('habits');
      if (savedHabits) {
        const habits = JSON.parse(savedHabits);
        
        // Calculate max streak across all habits
        let maxStreak = 0;
        habits.forEach((habit: any) => {
          if (habit.streak > maxStreak) {
            maxStreak = habit.streak;
          }
        });
        
        // Get previous streak data if available
        const prevStats = localStorage.getItem('habitStats');
        let prevStreak = 0;
        if (prevStats) {
          try {
            const stats = JSON.parse(prevStats);
            prevStreak = stats.lastWeekStreak || 0;
          } catch (e) {
            console.error("Error parsing previous habit stats", e);
          }
        }
        
        const change = maxStreak - prevStreak;
        const changeStr = change >= 0 ? `+${change}` : `${change}`;
        
        setHabitStats({
          streak: maxStreak,
          change: `${changeStr} from last week`
        });
        
        // Save current stats for next comparison
        localStorage.setItem('habitStats', JSON.stringify({
          lastWeekStreak: maxStreak,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, []);
  
  const taskStats = calculateTaskStats();
  
  // Calculate productivity score (combination of task completion, goal progress, and habit streaks)
  const productivityScore = Math.round(
    (taskStats.rate * 0.4) + 
    (goalStats.progress * 0.4) + 
    (habitStats.streak * 2)
  );
  
  // Mock stats data with real calculated values
  const stats = [
    {
      title: "Habit Streak",
      value: `${habitStats.streak} days`,
      change: habitStats.change,
      icon: <CheckCircle className="h-8 w-8 text-success" />,
      color: "bg-success/10 border-success/20",
    },
    {
      title: "Goals Progress",
      value: `${goalStats.progress}%`,
      change: `${goalStats.activeCount} active goals`,
      icon: <Target className="h-8 w-8 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      title: "Tasks Completed",
      value: `${taskStats.completed}/${taskStats.total}`,
      change: `${taskStats.rate}% completion rate`,
      icon: <ClipboardCheck className="h-8 w-8 text-secondary" />,
      color: "bg-secondary/10 border-secondary/20",
    },
    {
      title: "Productivity Score",
      value: productivityScore.toString(),
      change: "+5 points this week",
      icon: <BarChart2 className="h-8 w-8 text-accent" />,
      color: "bg-accent/10 border-accent/20",
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`overflow-hidden card-hover border ${stat.color}`}>
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
                  width: stat.title.includes("Goals") ? stat.value : 
                         stat.title.includes("Tasks") ? `${taskStats.rate}%` :
                         stat.title.includes("Habit") ? `${Math.min(habitStats.streak * 10, 100)}%` :
                         `${Math.min(productivityScore, 100)}%`,
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
