import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
interface FocusStatsCardProps {
  stats: FocusStats;
}
const FocusStatsCard: React.FC<FocusStatsCardProps> = ({
  stats
}) => {
  return <Card className="lg:col-span-3 rounded-lg bg-slate-950">
      <CardHeader className="bg-slate-950 rounded-lg">
        <CardTitle>Focus Stats</CardTitle>
        <CardDescription>Your productivity insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-blue-400">Today</span>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{stats.todayMinutes || 0} minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-green-500">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-green-500">This Week</span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">{stats.weekMinutes || 0} minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-orange-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-500">
                  <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 7.5H21" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 14L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 22H5C3.895 22 3 21.105 3 20V9C3 7.895 3.895 7 5 7H19C20.105 7 21 7.895 21 9V20C21 21.105 20.105 22 19 22Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-yellow-500">Current Streak</span>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-yellow-500 rounded-full text-xs">{stats.currentStreak || 0} days</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-purple-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-purple-500">Total Sessions</span>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{stats.totalSessions || 0} sessions</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Top Focus Categories</h4>
          {stats.categoryStats && stats.categoryStats.length > 0 ? <div className="space-y-3">
              {stats.categoryStats.map((stat, index) => <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{stat.category}</span>
                    <span>{stat.sessions} sessions</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${stat.category === "Deep Work" ? "bg-purple-600" : stat.category === "Study" ? "bg-blue-500" : stat.category === "Creative" ? "bg-orange-500" : "bg-green-500"}`} style={{
                width: `${stat.percentage}%`
              }}></div>
                  </div>
                </div>)}
            </div> : <div className="text-center py-4 text-muted-foreground">
              <p>Complete focus sessions to see your stats</p>
            </div>}
        </div>
      </CardContent>
    </Card>;
};
export default FocusStatsCard;