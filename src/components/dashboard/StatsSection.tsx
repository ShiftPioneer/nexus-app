import React, { useEffect, useState } from "react";
import { Target, CheckCircle2, BarChart2, Repeat } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import { motion } from "framer-motion";

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
  const productivityScore = Math.round(taskStats.rate * 0.4 + goalStats.progress * 0.4 + (habitStats.streak * 2));

  const statsData = [{
    title: "Goals Progress",
    value: `${goalStats.progress}%`,
    change: `${goalStats.activeCount} active goals`,
    icon: Target,
    progress: goalStats.progress,
    color: "text-primary bg-primary/20",
    progressColor: "bg-primary"
  }, {
    title: "Today's Tasks",
    value: taskStats.total > 0 ? `${taskStats.completed}/${taskStats.total}` : "N/A",
    change: taskStats.total > 0 ? `${taskStats.rate}% completed` : "Add tasks for today",
    icon: CheckCircle2,
    progress: taskStats.rate,
    color: "text-blue-400 bg-blue-900/40",
    progressColor: "bg-blue-400"
  }, {
    title: "Habit Streak",
    value: habitStats.totalHabits > 0 ? `${habitStats.streak} days` : "N/A",
    change: habitStats.totalHabits > 0 ? `${habitStats.completedToday}/${habitStats.totalHabits} completed today` : "Create a habit",
    icon: Repeat,
    progress: habitStats.totalHabits > 0 ? Math.min(100, habitStats.streak / 30 * 100) : 0,
    color: "text-green-400 bg-green-900/40",
    progressColor: "bg-green-400"
  }, {
    title: "Productivity",
    value: productivityScore.toString(),
    change: "Score based on activity",
    icon: BarChart2,
    progress: Math.min(productivityScore, 100),
    color: "text-purple-400 bg-purple-900/40",
    progressColor: "bg-purple-400"
  }];
  return <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6">
      {statsData.map((stat, index) => <motion.div key={index} className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/50 p-3 sm:p-4 md:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/60 hover:shadow-primary/10" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay: index * 0.1
    }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-slate-400 truncate">{stat.title}</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-50 mt-0.5 sm:mt-1 truncate">{stat.value}</h3>
            </div>
            <div className={`rounded-lg p-2 sm:p-3 flex-shrink-0 ${stat.color}`}>
              <stat.icon className="h-4 w-4 sm:h-5 md:h-6 sm:w-5 md:w-6" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="h-1.5 sm:h-2 w-full rounded-full bg-slate-700/50">
              <motion.div className={`h-1.5 sm:h-2 rounded-full ${stat.progressColor}`} initial={{
              width: 0
            }} animate={{
              width: `${stat.progress}%`
            }} transition={{
              duration: 1,
              ease: "circOut",
              delay: 0.5 + index * 0.1
            }} />
            </div>
            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-slate-500 truncate">{stat.change}</p>
          </div>
        </motion.div>)}
    </section>;
};
export default StatsSection;
