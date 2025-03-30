
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface FocusInsightsProps {
  stats: FocusStats;
}

const FocusInsights: React.FC<FocusInsightsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Focus Distribution</CardTitle>
          <CardDescription>Focus time by time of day</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="flex h-full items-end gap-2 pb-8 pt-4">
            {/* Mock chart bars - in a real app, use a charting library */}
            <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[10%]" />
            <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[60%]" />
            <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[20%]" />
            <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[15%]" />
            <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[40%]" />
            <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[30%]" />
          </div>
          <div className="flex justify-between px-2 text-xs text-muted-foreground">
            <div>6 AM</div>
            <div>9 AM</div>
            <div>12 PM</div>
            <div>3 PM</div>
            <div>6 PM</div>
            <div>9 PM</div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium">Peak Productivity Time</h4>
            <p className="text-sm text-muted-foreground">You're most productive between 8-10 AM</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>Your focus patterns and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Consistency Streak</h4>
              <p className="text-sm text-muted-foreground">
                You've completed at least one focus session for {stats.currentStreak} consecutive days!
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Longest Focus Session</h4>
              <p className="text-sm text-muted-foreground">
                Your longest uninterrupted focus session was {stats.longestSession.duration} minutes 
                on {format(stats.longestSession.date, "EEEE")}.
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Weekly Improvement</h4>
              <p className="text-sm text-muted-foreground">
                You've increased your total focus time by {stats.weeklyImprovement}% compared to last week.
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">Next Milestone</h4>
              <p className="text-sm text-muted-foreground">
                Complete 3 more focus sessions to unlock the "Focus Master" badge!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusInsights;
