
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { BarChart2, TrendingUp, Target, Award, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
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
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      value: "trends", 
      label: "Trends",
      icon: TrendingUp,
      gradient: "from-emerald-500 via-green-500 to-teal-500"
    },
    {
      value: "categories",
      label: "Categories", 
      icon: Target,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      value: "streaks",
      label: "Streaks",
      icon: Award,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    }
  ];

  return (
    <Card className="relative overflow-hidden bg-slate-900/80 border-slate-700/50 shadow-2xl backdrop-blur-sm">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <CardHeader className="relative z-10 border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-red-500 shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
            <p className="text-slate-400 text-sm font-normal mt-1">
              Deep insights into your habit patterns and progress
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-8">
        <ModernTabs value={statisticsTab} onValueChange={onStatisticsTabChange} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 mb-8">
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <div className="space-y-6">
            <ModernTabsContent value="overview">
              <div className="p-8 rounded-2xl bg-slate-800/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsOverview habits={habits} />
              </div>
            </ModernTabsContent>
            
            <ModernTabsContent value="trends">
              <div className="p-8 rounded-2xl bg-slate-800/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsTrends habits={habits} />
              </div>
            </ModernTabsContent>
            
            <ModernTabsContent value="categories">
              <div className="p-8 rounded-2xl bg-slate-800/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsCategories habits={habits} />
              </div>
            </ModernTabsContent>
            
            <ModernTabsContent value="streaks">
              <div className="p-8 rounded-2xl bg-slate-800/20 border border-slate-700/20 backdrop-blur-sm">
                <HabitStatisticsStreaks habits={habits} />
              </div>
            </ModernTabsContent>
          </div>
        </ModernTabs>
      </CardContent>
    </Card>
  );
};

export default ModernAnalyticsCard;
