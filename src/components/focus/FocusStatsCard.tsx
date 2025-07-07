
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface FocusStats {
  totalSessions: number;
  totalMinutes: number;
  todayMinutes: number;
  currentStreak: number;
  weeklyGoal: number;
  completionRate: number;
}

interface FocusStatsCardProps {
  stats: FocusStats;
}

const FocusStatsCard: React.FC<FocusStatsCardProps> = ({ stats }) => {
  const progressPercentage = (stats.todayMinutes / stats.weeklyGoal) * 100;

  return (
    <Card className="h-fit bg-slate-950/80 backdrop-blur-sm border-slate-700/50 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Focus Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Today's Focus</span>
            <Badge variant="outline" className="text-emerald-400 border-emerald-400/50">
              {stats.todayMinutes}m
            </Badge>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Total Sessions</p>
                <p className="text-lg font-semibold text-white">{stats.totalSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400">Total Minutes</p>
                <p className="text-lg font-semibold text-white">{stats.totalMinutes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-400" />
              <div>
                <p className="text-xs text-slate-400">Streak</p>
                <p className="text-lg font-semibold text-white">{stats.currentStreak}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-400">Success Rate</p>
                <p className="text-lg font-semibold text-white">{stats.completionRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-2 pt-2 border-t border-slate-700/30">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Weekly Goal Progress</span>
            <span className="text-xs text-slate-300">{stats.todayMinutes}/{stats.weeklyGoal}m</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusStatsCard;
