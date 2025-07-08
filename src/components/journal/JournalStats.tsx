import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Hash, Flame, TrendingUp, Target, Brain, Award } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface JournalStatsProps {
  entries: JournalEntry[];
}

const JournalStats: React.FC<JournalStatsProps> = ({ entries }) => {
  const todayEntries = entries.filter(entry => 
    format(entry.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );
  
  const uniqueTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));
  
  const streak = entries.reduce((streak, entry, index) => {
    if (index === 0) return entries.length > 0 ? 1 : 0;
    const prevDate = new Date(entries[index - 1].date);
    prevDate.setDate(prevDate.getDate() - 1);
    return format(prevDate, "yyyy-MM-dd") === format(entry.date, "yyyy-MM-dd") ? streak + 1 : streak;
  }, 0);

  const totalWords = entries.reduce((total, entry) => {
    return total + (entry.content ? entry.content.split(' ').length : 0);
  }, 0);

  const avgMood = entries.length > 0 
    ? entries.reduce((sum, entry) => {
        const moodValue = entry.mood === 'positive' ? 5 : 
                         entry.mood === 'mixed' ? 4 : 
                         entry.mood === 'neutral' ? 3 : 
                         entry.mood === 'negative' ? 2 : 3;
        return sum + moodValue;
      }, 0) / entries.length 
    : 0;

  const stats = [
    {
      title: "Total Entries",
      value: entries.length.toString(),
      subtitle: "Journal entries written",
      icon: BookOpen,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      progress: Math.min((entries.length / 50) * 100, 100), // Goal: 50 entries
    },
    {
      title: "Today's Entries",
      value: todayEntries.length.toString(),
      subtitle: "Written today",
      icon: Calendar,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
      progress: todayEntries.length > 0 ? 100 : 0,
    },
    {
      title: "Current Streak",
      value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
      subtitle: "Consecutive days",
      icon: Flame,
      gradient: "from-red-500/20 to-orange-500/20",
      iconColor: "text-red-400",
      progress: Math.min((streak / 30) * 100, 100), // Goal: 30 day streak
    },
    {
      title: "Unique Tags",
      value: uniqueTags.length.toString(),
      subtitle: "Different topics",
      icon: Hash,
      gradient: "from-purple-500/20 to-indigo-500/20",
      iconColor: "text-purple-400",
      progress: Math.min((uniqueTags.length / 20) * 100, 100), // Goal: 20 tags
    },
    {
      title: "Total Words",
      value: totalWords.toLocaleString(),
      subtitle: "Words written",
      icon: Brain,
      gradient: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400",
      progress: Math.min((totalWords / 10000) * 100, 100), // Goal: 10k words
    },
    {
      title: "Average Mood",
      value: avgMood > 0 ? `${avgMood.toFixed(1)}/5` : 'N/A',
      subtitle: "Emotional state",
      icon: Award,
      gradient: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400",
      progress: avgMood > 0 ? (avgMood / 5) * 100 : 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <span>Journal Analytics</span>
              <p className="text-sm font-normal text-slate-400 mt-1">Track your writing progress and patterns</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.title}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{stat.subtitle}</span>
                    <span className={`${stat.iconColor} font-medium`}>
                      {Math.round(stat.progress)}%
                    </span>
                  </div>
                  <Progress 
                    value={stat.progress} 
                    className="h-2 bg-slate-800"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights Section */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-indigo-950/20 to-purple-950/20 border-indigo-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Quick Insights</h3>
                  <p className="text-sm text-slate-400">Your journaling patterns</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <p className="text-sm text-indigo-300 font-medium mb-1">Most Active Day</p>
                  <p className="text-white">
                    {entries.length > 0 ? "Today" : "No data yet"}
                  </p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <p className="text-sm text-purple-300 font-medium mb-1">Avg. Entry Length</p>
                  <p className="text-white">
                    {entries.length > 0 ? `${Math.round(totalWords / entries.length)} words` : "No entries"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JournalStats;