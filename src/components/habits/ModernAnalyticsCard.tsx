
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, TrendingUp, Calendar, Award, Target, Activity } from "lucide-react";
import HabitStatisticsOverview from "./HabitStatisticsOverview";
import HabitStatisticsTrends from "./HabitStatisticsTrends";
import HabitStatisticsCategories from "./HabitStatisticsCategories";
import HabitStatisticsStreaks from "./HabitStatisticsStreaks";

interface ModernAnalyticsCardProps {
  habits: Habit[];
  statisticsTab: string;
  onStatisticsTabChange: (tab: string) => void;
}

const ModernAnalyticsCard: React.FC<ModernAnalyticsCardProps> = ({
  habits,
  statisticsTab,
  onStatisticsTabChange
}) => {
  const tabItems = [
    {
      value: "overview",
      label: "Overview",
      icon: BarChart2,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
      description: "General statistics"
    },
    {
      value: "trends",
      label: "Trends",
      icon: TrendingUp,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
      description: "Progress patterns"
    },
    {
      value: "categories",
      label: "Categories",
      icon: Target,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-500/10 via-red-500/10 to-pink-500/10",
      description: "Habit groupings"
    },
    {
      value: "streaks",
      label: "Streaks",
      icon: Award,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10",
      description: "Consistency tracking"
    }
  ];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950/80 to-slate-900/80 border-slate-700/30 shadow-2xl backdrop-blur-sm">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <CardHeader className="relative z-10 border-b border-slate-700/30 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-red-500 shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
            <p className="text-slate-400 text-sm font-normal mt-1">Deep insights into your habit patterns and progress</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-8">
        <Tabs value={statisticsTab} onValueChange={onStatisticsTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm rounded-2xl p-2 shadow-inner">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className={cn(
                  "group relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all duration-300 overflow-hidden",
                  "data-[state=active]:shadow-lg data-[state=active]:shadow-black/20",
                  "hover:bg-slate-700/30 text-slate-400 hover:text-slate-200",
                  statisticsTab === tab.value && `bg-gradient-to-r ${tab.gradient} text-white shadow-xl`
                )}
              >
                {/* Background gradient for active state */}
                {statisticsTab === tab.value && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.bgGradient} opacity-20`} />
                )}
                
                {/* Icon container */}
                <div className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                  statisticsTab === tab.value 
                    ? "bg-white/20 shadow-lg" 
                    : "bg-slate-700/50 group-hover:bg-slate-600/50"
                )}>
                  <tab.icon className="h-4 w-4" />
                </div>
                
                {/* Text content */}
                <div className="text-center">
                  <span className="font-semibold text-xs">{tab.label}</span>
                  <p className="text-xs opacity-80 mt-1">{tab.description}</p>
                </div>
                
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-6">
            <TabsContent value="overview" className="mt-0">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsOverview habits={habits} />
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsTrends habits={habits} />
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-0">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsCategories habits={habits} />
              </div>
            </TabsContent>
            
            <TabsContent value="streaks" className="mt-0">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsStreaks habits={habits} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModernAnalyticsCard;
