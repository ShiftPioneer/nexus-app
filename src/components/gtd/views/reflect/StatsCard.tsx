
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface StatCountProps {
  value: number;
  label: string;
  color: string;
}

const StatCount: React.FC<StatCountProps> = ({ value, label, color }) => (
  <div>
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

interface StatsCardProps {
  taskCounts: {
    nextActions: number;
    projects: number;
    waitingFor: number;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ taskCounts }) => {
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Stats & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-400 mb-2">Task Breakdown</h4>
          <div className="flex justify-around text-center">
            <StatCount 
              value={taskCounts.nextActions} 
              label="Next Actions"
              color="text-blue-500"
            />
            <StatCount 
              value={taskCounts.projects} 
              label="Projects"
              color="text-purple-500"
            />
            <StatCount 
              value={taskCounts.waitingFor} 
              label="Waiting For"
              color="text-green-500"
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2">Top Contexts</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
              work
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
              home
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300">
              personal
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
