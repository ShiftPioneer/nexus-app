import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface TimeDesignAnalyticsProps {
  activities: TimeActivity[];
}
const TimeDesignAnalytics: React.FC<TimeDesignAnalyticsProps> = ({
  activities
}) => {
  // In a real app, you'd calculate these values based on actual activities
  const timeDistribution = {
    work: 50,
    social: 17,
    health: 17,
    learning: 16
  };
  const productiveTime = {
    work: 75,
    learning: 25
  };
  const personalTime = {
    social: 50,
    health: 50
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="rounded-lg bg-slate-950">
          <CardTitle>Time Usage Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center bg-slate-950">
          <div className="w-64 h-64 relative">
            {/* Simple pie chart visualization */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Work segment - Purple */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a78bfa" strokeWidth="20" strokeDasharray={`${timeDistribution.work} ${100 - timeDistribution.work}`} transform="rotate(-90 50 50)" />
              {/* Social segment - Orange */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fb923c" strokeWidth="20" strokeDasharray={`${timeDistribution.social} ${100 - timeDistribution.social}`} strokeDashoffset={`${-timeDistribution.work}`} transform="rotate(-90 50 50)" />
              {/* Health segment - Green */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4ade80" strokeWidth="20" strokeDasharray={`${timeDistribution.health} ${100 - timeDistribution.health}`} strokeDashoffset={`${-(timeDistribution.work + timeDistribution.social)}`} transform="rotate(-90 50 50)" />
              {/* Learning segment - Blue */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#60a5fa" strokeWidth="20" strokeDasharray={`${timeDistribution.learning} ${100 - timeDistribution.learning}`} strokeDashoffset={`${-(timeDistribution.work + timeDistribution.social + timeDistribution.health)}`} transform="rotate(-90 50 50)" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold">24 hrs</div>
                <div className="text-sm text-muted-foreground">This week</div>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="px-6 pb-6 grid grid-cols-4 gap-2 rounded-lg bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-400"></div>
            <span className="text-sm">Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-400"></div>
            <span className="text-sm">Social</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <span className="text-sm">Health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
            <span className="text-sm">Learning</span>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-950 rounded-lg">
        <CardHeader>
          <CardTitle>Productive Time</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-44 h-44 relative">
            {/* Simple pie chart visualization */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Work segment - Purple */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a78bfa" strokeWidth="20" strokeDasharray={`${productiveTime.work} ${100 - productiveTime.work}`} transform="rotate(-90 50 50)" />
              {/* Learning segment - Blue */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#60a5fa" strokeWidth="20" strokeDasharray={`${productiveTime.learning} ${100 - productiveTime.learning}`} strokeDashoffset={`${-productiveTime.work}`} transform="rotate(-90 50 50)" />
            </svg>
          </div>
        </CardContent>
        <div className="px-6 pb-6 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-400"></div>
            <span className="text-sm">Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
            <span className="text-sm">Learning</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader className="rounded-lg bg-slate-950">
          <CardTitle>Personal Time</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center bg-slate-950">
          <div className="w-44 h-44 relative">
            {/* Simple pie chart visualization */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Social segment - Orange */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fb923c" strokeWidth="20" strokeDasharray={`${personalTime.social} ${100 - personalTime.social}`} transform="rotate(-90 50 50)" />
              {/* Health segment - Green */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4ade80" strokeWidth="20" strokeDasharray={`${personalTime.health} ${100 - personalTime.health}`} strokeDashoffset={`${-personalTime.social}`} transform="rotate(-90 50 50)" />
            </svg>
          </div>
        </CardContent>
        <div className="px-6 pb-6 grid grid-cols-2 gap-2 bg-slate-950 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-400"></div>
            <span className="text-sm">Social</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <span className="text-sm">Health</span>
          </div>
        </div>
      </Card>
    </div>;
};
export default TimeDesignAnalytics;