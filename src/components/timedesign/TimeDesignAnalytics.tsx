
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  Activity,
  Zap,
  Brain,
  Users,
  HeartPulse
} from "lucide-react";
import { motion } from "framer-motion";

interface TimeDesignAnalyticsProps {
  activities: TimeActivity[];
}

const TimeDesignAnalytics: React.FC<TimeDesignAnalyticsProps> = ({
  activities
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Calculate analytics data
  const timeDistribution = {
    work: 45,
    social: 20,
    health: 20,
    learning: 15
  };

  const productivityMetrics = {
    totalHours: 168,
    productiveHours: 52,
    personalHours: 48,
    restHours: 68
  };

  const weeklyTrends = [
    { day: "Mon", productive: 8, personal: 4, rest: 12 },
    { day: "Tue", productive: 7, personal: 5, rest: 12 },
    { day: "Wed", productive: 8, personal: 3, rest: 13 },
    { day: "Thu", productive: 9, personal: 4, rest: 11 },
    { day: "Fri", productive: 7, personal: 6, rest: 11 },
    { day: "Sat", productive: 6, personal: 8, rest: 10 },
    { day: "Sun", productive: 4, personal: 10, rest: 10 }
  ];

  const categoryIcons = {
    work: { icon: Zap, color: "purple" },
    social: { icon: Users, color: "orange" },
    health: { icon: HeartPulse, color: "green" },
    learning: { icon: Brain, color: "blue" }
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = "primary" 
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    trend?: number;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${
              color === "purple" ? "from-purple-500/20 to-indigo-500/20" :
              color === "orange" ? "from-orange-500/20 to-red-500/20" :
              color === "green" ? "from-green-500/20 to-emerald-500/20" :
              color === "blue" ? "from-blue-500/20 to-cyan-500/20" :
              "from-primary/20 to-orange-500/20"
            }`}>
              <Icon className={`h-6 w-6 ${
                color === "purple" ? "text-purple-400" :
                color === "orange" ? "text-orange-400" :
                color === "green" ? "text-green-400" :
                color === "blue" ? "text-blue-400" :
                "text-primary"
              }`} />
            </div>
            {trend && (
              <Badge className={`${trend > 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend > 0 ? "+" : ""}{trend}%
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-2xl">{value}</h3>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-slate-500 text-xs">{subtitle}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Time Analytics</h2>
        </div>
        
        <div className="flex gap-2">
          {["day", "week", "month"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`${
                selectedPeriod === period
                  ? "bg-primary text-white"
                  : "bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Productive Hours"
          value={`${productivityMetrics.productiveHours}h`}
          subtitle="This week"
          icon={Target}
          trend={12}
          color="purple"
        />
        <StatCard
          title="Personal Time"
          value={`${productivityMetrics.personalHours}h`}
          subtitle="This week"
          icon={HeartPulse}
          trend={-5}
          color="green"
        />
        <StatCard
          title="Rest & Sleep"
          value={`${productivityMetrics.restHours}h`}
          subtitle="This week"
          icon={Clock}
          trend={3}
          color="blue"
        />
        <StatCard
          title="Efficiency Score"
          value="87%"
          subtitle="Above average"
          icon={TrendingUp}
          trend={8}
          color="orange"
        />
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pie Chart Visualization */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Work segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#a78bfa"
                      strokeWidth="16"
                      strokeDasharray={`${timeDistribution.work} ${100 - timeDistribution.work}`}
                      strokeDashoffset="0"
                    />
                    {/* Social segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#fb923c"
                      strokeWidth="16"
                      strokeDasharray={`${timeDistribution.social} ${100 - timeDistribution.social}`}
                      strokeDashoffset={`${-timeDistribution.work}`}
                    />
                    {/* Health segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#4ade80"
                      strokeWidth="16"
                      strokeDasharray={`${timeDistribution.health} ${100 - timeDistribution.health}`}
                      strokeDashoffset={`${-(timeDistribution.work + timeDistribution.social)}`}
                    />
                    {/* Learning segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#60a5fa"
                      strokeWidth="16"
                      strokeDasharray={`${timeDistribution.learning} ${100 - timeDistribution.learning}`}
                      strokeDashoffset={`${-(timeDistribution.work + timeDistribution.social + timeDistribution.health)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">52h</div>
                      <div className="text-sm text-slate-400">This week</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(timeDistribution).map(([category, percentage]) => {
                  const { icon: Icon, color } = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${
                        color === "purple" ? "text-purple-400" :
                        color === "orange" ? "text-orange-400" :
                        color === "green" ? "text-green-400" :
                        "text-blue-400"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white font-medium capitalize">{category}</span>
                          <span className="text-slate-400">{percentage}%</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklyTrends.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-medium">{day.day}</span>
                    <span className="text-slate-400">{day.productive + day.personal}h</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div 
                      className="bg-purple-500 rounded-sm" 
                      style={{ width: `${(day.productive / 24) * 100}%` }}
                    />
                    <div 
                      className="bg-green-500 rounded-sm" 
                      style={{ width: `${(day.personal / 24) * 100}%` }}
                    />
                    <div 
                      className="bg-slate-600 rounded-sm" 
                      style={{ width: `${(day.rest / 24) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">Productivity Peak</span>
                </div>
                <p className="text-sm text-slate-300">
                  Your most productive hours are between 9-11 AM. Schedule important tasks during this window.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Time Balance</span>
                </div>
                <p className="text-sm text-slate-300">
                  Consider increasing personal time by 15% for better work-life balance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TimeDesignAnalytics;
