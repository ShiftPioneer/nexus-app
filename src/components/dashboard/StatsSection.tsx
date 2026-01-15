import React, { useEffect, useState } from "react";
import { Target, CheckCircle2, BarChart2, Repeat } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import { StatCard, StatCardGrid } from "@/components/ui/stat-card";

const StatsSection = () => {
  const { tasks } = useGTD();
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
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

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
      return { completed: 0, total: 0, rate: 0 };
    }

    const completedTasks = todayTasks.filter(task => task.status === "completed").length;
    return {
      completed: completedTasks,
      total: todayTasks.length,
      rate: Math.round(completedTasks / todayTasks.length * 100)
    };
  };

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

      // Get habit stats
      const savedHabits = localStorage.getItem('userHabits');
      if (savedHabits) {
        const habits = JSON.parse(savedHabits);
        let maxStreak = 0;
        let completedToday = 0;
        const today = new Date().toDateString();

        habits.forEach((habit: any) => {
          if (habit.streak > maxStreak) {
            maxStreak = habit.streak;
          }
          if (habit.status === "completed" || habit.completionDates?.some((date: any) => new Date(date).toDateString() === today)) {
            completedToday++;
          }
        });

        setHabitStats({
          streak: maxStreak,
          totalHabits: habits.length,
          completedToday: completedToday
        });
      } else {
        setHabitStats({ streak: 0, totalHabits: 0, completedToday: 0 });
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, []);

  const taskStats = calculateTaskStats();
  const productivityScore = Math.round(taskStats.rate * 0.4 + goalStats.progress * 0.4 + (habitStats.streak * 2));

  const statsData = [
    {
      title: "Goals Progress",
      value: `${goalStats.progress}%`,
      subtitle: `${goalStats.activeCount} active goals`,
      icon: Target,
      progress: goalStats.progress,
      progressColor: "bg-primary",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary"
    },
    {
      title: "Today's Tasks",
      value: taskStats.total > 0 ? `${taskStats.completed}/${taskStats.total}` : "N/A",
      subtitle: taskStats.total > 0 ? `${taskStats.rate}% completed` : "Add tasks for today",
      icon: CheckCircle2,
      progress: taskStats.rate,
      progressColor: "bg-emerald-400",
      iconBgColor: "bg-emerald-900/40",
      iconColor: "text-emerald-400"
    },
    {
      title: "Habit Streak",
      value: habitStats.totalHabits > 0 ? `${habitStats.streak} days` : "N/A",
      subtitle: habitStats.totalHabits > 0 ? `${habitStats.completedToday}/${habitStats.totalHabits} completed today` : "Create a habit",
      icon: Repeat,
      progress: habitStats.totalHabits > 0 ? Math.min(100, habitStats.streak / 30 * 100) : 0,
      progressColor: "bg-orange-400",
      iconBgColor: "bg-orange-900/40",
      iconColor: "text-orange-400"
    },
    {
      title: "Productivity",
      value: productivityScore.toString(),
      subtitle: "Score based on activity",
      icon: BarChart2,
      progress: Math.min(productivityScore, 100),
      progressColor: "bg-violet-400",
      iconBgColor: "bg-violet-900/40",
      iconColor: "text-violet-400"
    }
  ];

  return (
    <section className="mb-6">
      <StatCardGrid>
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            progress={stat.progress}
            progressColor={stat.progressColor}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
            index={index}
          />
        ))}
      </StatCardGrid>
    </section>
  );
};

export default StatsSection;
