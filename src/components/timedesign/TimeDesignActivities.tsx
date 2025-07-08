
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Edit, Trash, Clock, Calendar, Search, Filter, Plus, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeDesignActivitiesProps {
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
  onDeleteActivity: (id: string) => void;
}

const TimeDesignActivities: React.FC<TimeDesignActivitiesProps> = ({
  activities,
  onEditActivity,
  onDeleteActivity
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Filter activities based on search and category
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || activity.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(activity.startDate, "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, TimeActivity[]>);

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const getCategoryBadge = (category: string) => {
    const styles = {
      work: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border-purple-500/30",
      social: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-200 border-orange-500/30",
      health: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border-green-500/30",
      learning: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border-blue-500/30"
    };
    return (
      <Badge className={`${styles[category as keyof typeof styles]} border px-2 py-1 text-xs font-medium`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const categories = ["all", "work", "social", "health", "learning"];

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Activities Overview</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 min-w-[200px]"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
                className={`${
                  filterCategory === category
                    ? "bg-primary text-white"
                    : "bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Activities List */}
      <AnimatePresence mode="wait">
        {sortedDates.length > 0 ? (
          <motion.div
            key="activities-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {sortedDates.map((date, dateIndex) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dateIndex * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </h3>
                  <Separator className="flex-1 bg-slate-700" />
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                    {groupedActivities[date].length} activities
                  </Badge>
                </div>
                
                <div className="grid gap-3">
                  {groupedActivities[date]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((activity, activityIndex) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: activityIndex * 0.05 }}
                      >
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-black/25">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-white text-lg">
                                    {activity.title}
                                  </h4>
                                  {getCategoryBadge(activity.category)}
                                </div>
                                
                                {activity.description && (
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    {activity.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-4 flex-wrap">
                                  <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-primary font-medium">
                                      {activity.startTime} - {activity.endTime}
                                    </span>
                                  </div>
                                  
                                  {activity.syncWithGoogleCalendar && (
                                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Google Calendar
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEditActivity(activity)}
                                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDeleteActivity(activity.id)}
                                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm || filterCategory !== "all" ? "No activities found" : "No activities scheduled"}
                </h3>
                <p className="text-slate-400 mb-4">
                  {searchTerm || filterCategory !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Create a new activity to get started with your time design"}
                </p>
                {(!searchTerm && filterCategory === "all") && (
                  <Button className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Activity
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeDesignActivities;
