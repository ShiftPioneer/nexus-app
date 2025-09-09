
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

  // Calculate real analytics data from activities
  const calculateMetrics = () => {
    const now = new Date();
    const periodStart = selectedPeriod === "day" ? 
      new Date(now.getFullYear(), now.getMonth(), now.getDate()) :
      selectedPeriod === "week" ?
      new Date(now.setDate(now.getDate() - now.getDay())) :
      new Date(now.getFullYear(), now.getMonth(), 1);

    const filteredActivities = activities.filter(activity => {
      const activityDate = new Date(activity.startDate);
      return activityDate >= periodStart;
    });

    // Calculate time distribution by category
    const categoryTotals = filteredActivities.reduce((acc, activity) => {
      const start = new Date(`${activity.startDate.toDateString()} ${activity.startTime}`);
      const end = new Date(`${activity.endDate.toDateString()} ${activity.endTime}`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
      
      acc[activity.category] = (acc[activity.category] || 0) + duration;
      return acc;
    }, {} as Record<string, number>);

    const totalHours = Object.values(categoryTotals).reduce((sum, hours) => sum + hours, 0);
    
    const timeDistribution = {
      work: totalHours > 0 ? Math.round((categoryTotals.work || 0) / totalHours * 100) : 0,
      social: totalHours > 0 ? Math.round((categoryTotals.social || 0) / totalHours * 100) : 0,
      health: totalHours > 0 ? Math.round((categoryTotals.health || 0) / totalHours * 100) : 0,
      learning: totalHours > 0 ? Math.round((categoryTotals.learning || 0) / totalHours * 100) : 0
    };

    const productiveHours = (categoryTotals.work || 0) + (categoryTotals.learning || 0);
    const personalHours = (categoryTotals.social || 0) + (categoryTotals.health || 0);
    const restHours = selectedPeriod === "week" ? 168 - totalHours : 24 - totalHours;

    return {
      timeDistribution,
      productivityMetrics: {
        totalHours: Math.round(totalHours),
        productiveHours: Math.round(productiveHours),
        personalHours: Math.round(personalHours),
        restHours: Math.round(Math.max(0, restHours))
      },
      filteredActivities
    };
  };

  const { timeDistribution, productivityMetrics, filteredActivities } = calculateMetrics();

  const weeklyTrends = (() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames.map(day => {
      const dayActivities = activities.filter(activity => {
        const activityDay = dayNames[new Date(activity.startDate).getDay()];
        return activityDay === day;
      });

      let productive = 0, personal = 0;
      dayActivities.forEach(activity => {
        const start = new Date(`${activity.startDate.toDateString()} ${activity.startTime}`);
        const end = new Date(`${activity.endDate.toDateString()} ${activity.endTime}`);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        if (activity.category === 'work' || activity.category === 'learning') {
          productive += duration;
        } else {
          personal += duration;
        }
      });

      return {
        day,
        productive: Math.round(productive),
        personal: Math.round(personal),
        rest: Math.round(24 - productive - personal)
      };
    });
  })();

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
      <Card className="bg-card hover:border-primary/30 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              color === "purple" ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20" :
              color === "orange" ? "bg-gradient-to-r from-primary/20 to-primary/30" :
              color === "green" ? "bg-gradient-to-r from-success/20 to-success/30" :
              color === "blue" ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20" :
              "bg-gradient-to-r from-primary/20 to-primary/30"
            }`}>
              <Icon className={`h-6 w-6 ${
                color === "purple" ? "text-purple-400" :
                color === "orange" ? "text-primary" :
                color === "green" ? "text-success" :
                color === "blue" ? "text-blue-400" :
                "text-primary"
              }`} />
            </div>
            {trend && (
              <Badge className={`${trend > 0 ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend > 0 ? "+" : ""}{trend}%
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-2xl">{value}</h3>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-muted-foreground/70 text-xs">{subtitle}</p>
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
          <h2 className="text-2xl font-bold text-foreground">Time Analytics</h2>
        </div>
        
        <div className="flex gap-2">
          {["day", "week", "month"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
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
            title="Activities Completed"
            value={filteredActivities.length.toString()}
            subtitle={`This ${selectedPeriod}`}
            icon={TrendingUp}
            trend={filteredActivities.length > 0 ? 8 : 0}
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
          <Card className="bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
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
                      <div className="text-2xl font-bold text-foreground">{productivityMetrics.totalHours}h</div>
                      <div className="text-sm text-muted-foreground">This {selectedPeriod}</div>
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
                          <span className="text-foreground font-medium capitalize">{category}</span>
                          <span className="text-muted-foreground">{percentage}%</span>
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
          <Card className="bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
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
                    <span className="text-foreground font-medium">{day.day}</span>
                    <span className="text-muted-foreground">{day.productive + day.personal}h</span>
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
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-success/10 to-success/20 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">Productivity Peak</span>
                </div>
                <p className="text-sm text-foreground/80">
                  Your most productive hours are between 9-11 AM. Schedule important tasks during this window.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Time Balance</span>
                </div>
                <p className="text-sm text-foreground/80">
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
