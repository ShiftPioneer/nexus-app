import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, ClipboardCheck, BarChart2 } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
const StatsSection = () => {
  const {
    tasks
  } = useGTD();
  const [goalStats, setGoalStats] = useState({
    progress: 0,
    activeCount: 0
  });
  const [habitStats, setHabitStats] = useState({
    streak: 0,
    totalHabits: 0,
    completedToday: 0
  });

  // Calculate task stats
  const calculateTaskStats = () => {
    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Filter tasks for today (either status is "today" or due date is today)
    const todayTasks = tasks.filter(task => {
      if (task.status === "today") return true;
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const taskDateString = taskDate.toISOString().split('T')[0];
        return taskDateString === todayString;
      }
      return false;
    }).filter(task => task.status !== "deleted" && !task.isToDoNot);
    if (todayTasks.length === 0) {
      return {
        completed: 0,
        total: 0,
        rate: 0
      };
    }
    const completedTasks = todayTasks.filter(task => task.status === "completed").length;
    return {
      completed: completedTasks,
      total: todayTasks.length,
      rate: Math.round(completedTasks / todayTasks.length * 100)
    };
  };

  // Get habit stats from localStorage
  useEffect(() => {
    try {
      // Get goal stats
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        const activeGoals = goals.filter((g: any) => g.status !== 'completed');
        let totalProgress = 0;
        activeGoals.forEach((goal: any) => {
          totalProgress += goal.progress || 0;
        });
        const avgProgress = activeGoals.length > 0 ? Math.round(totalProgress / activeGoals.length) : 0;
        setGoalStats({
          progress: avgProgress,
          activeCount: activeGoals.length
        });
      }

      // Get habit stats from userHabits instead of habits
      const savedHabits = localStorage.getItem('userHabits');
      if (savedHabits) {
        const habits = JSON.parse(savedHabits);

        // Calculate max streak across all habits
        let maxStreak = 0;
        let completedToday = 0;
        const today = new Date().toDateString();
        habits.forEach((habit: any) => {
          if (habit.streak > maxStreak) {
            maxStreak = habit.streak;
          }

          // Check if completed today
          if (habit.status === "completed" || habit.completionDates && habit.completionDates.some((date: any) => new Date(date).toDateString() === today)) {
            completedToday++;
          }
        });
        setHabitStats({
          streak: maxStreak,
          totalHabits: habits.length,
          completedToday: completedToday
        });
      } else {
        // If no habits exist, set default values
        setHabitStats({
          streak: 0,
          totalHabits: 0,
          completedToday: 0
        });
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, []);
  const taskStats = calculateTaskStats();

  // Calculate productivity score (combination of task completion, goal progress, and habit streaks)
  const productivityScore = Math.round(taskStats.rate * 0.4 + goalStats.progress * 0.4 + habitStats.streak * 2);

  // Mock stats data with real calculated values
  const stats = [{
    title: "Habit Streak",
    value: habitStats.totalHabits > 0 ? `${habitStats.streak} days` : "No habits",
    change: habitStats.totalHabits > 0 ? `${habitStats.completedToday}/${habitStats.totalHabits} completed today` : "Create your first habit",
    icon: <CheckCircle className="h-8 w-8 text-success" />,
    color: "bg-success/10 border-success/20"
  }, {
    title: "Goals Progress",
    value: `${goalStats.progress}%`,
    change: `${goalStats.activeCount} active goals`,
    icon: <Target className="h-8 w-8 text-primary" />,
    color: "bg-primary/10 border-primary/20"
  }, {
    title: "Tasks Completed",
    value: taskStats.total > 0 ? `${taskStats.completed}/${taskStats.total}` : "No tasks today",
    change: taskStats.total > 0 ? `${taskStats.rate}% completion rate` : "Schedule tasks for today",
    icon: <ClipboardCheck className="h-8 w-8 text-secondary" />,
    color: "bg-secondary/10 border-secondary/20"
  }, {
    title: "Productivity Score",
    value: productivityScore.toString(),
    change: "+5 points this week",
    icon: <BarChart2 className="h-8 w-8 text-accent" />,
    color: "bg-accent/10 border-accent/20"
  }];
  return <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => <Card key={index} className={`overflow-hidden card-hover border ${stat.color}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground text-green-600">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1 text-green-600">{stat.change}</p>
              </div>
              <div>{stat.icon}</div>
            </div>
            
            {/* Simple progress indicator */}
            <div className="progress-bar-bg mt-4">
              <div className={`progress-bar-fill animate-progress`} style={{
            width: stat.title.includes("Goals") ? `${goalStats.progress}%` : stat.title.includes("Tasks") ? `${taskStats.rate}%` : stat.title.includes("Habit") ? `${Math.min(habitStats.streak * 10, 100)}%` : `${Math.min(productivityScore, 100)}%`,
            backgroundColor: stat.icon.props.className.includes("success") ? "#39D98A" : stat.icon.props.className.includes("primary") ? "#FF6500" : stat.icon.props.className.includes("secondary") ? "#024CAA" : "#00D4FF"
          }}></div>
            </div>
          </CardContent>
        </Card>)}
    </section>;
};
export default StatsSection;