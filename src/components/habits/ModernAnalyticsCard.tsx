
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, TrendingUp, Calendar, Award } from "lucide-react";
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
      gradient: "from-blue-500 to-purple-600"
    },
    {
      value: "trends",
      label: "Trends",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      value: "categories",
      label: "Categories",
      icon: Calendar,
      gradient: "from-orange-500 to-red-600"
    },
    {
      value: "streaks",
      label: "Streaks",
      icon: Award,
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-2xl">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 pointer-events-none" />
      
      <CardHeader className="relative z-10 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-orange-600 shadow-lg">
            <BarChart2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-white font-semibold">Analytics Dashboard</span>
            <p className="text-slate-400 text-sm font-normal mt-1">Deep insights into your habit patterns</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6">
        <Tabs value={statisticsTab} onValueChange={onStatisticsTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-xl p-1">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className={`
                  relative flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 overflow-hidden
                  data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} 
                  data-[state=active]:text-white data-[state=active]:shadow-lg
                  hover:bg-slate-700/50 text-slate-300
                `}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-6">
            <TabsContent value="overview" className="mt-0">
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30">
                <HabitStatisticsOverview habits={habits} />
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30">
                <HabitStatisticsTrends habits={habits} />
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-0">
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30">
                <HabitStatisticsCategories habits={habits} />
              </div>
            </TabsContent>
            
            <TabsContent value="streaks" className="mt-0">
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30">
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
