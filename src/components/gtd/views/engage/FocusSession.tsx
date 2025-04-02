
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FocusSessionProps {
  isTimerRunning: boolean;
  handleStartPomodoro: () => void;
  handleEndSession: () => void;
}

const FocusSession: React.FC<FocusSessionProps> = ({ 
  isTimerRunning, 
  handleStartPomodoro, 
  handleEndSession 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const startFocusSession = () => {
    handleStartPomodoro();
    // Navigate to the Focus page
    navigate('/focus');
    toast({
      title: "Focus Session Started",
      description: "Your focus session has begun. Stay focused!",
    });
  };
  
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Clock className="mr-2 h-5 w-5 text-[#0FA0CE]" />
          Focus Session
        </CardTitle>
        <p className="text-sm text-slate-400">
          Eliminate distractions and focus on one task
        </p>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="bg-[#0FA0CE]/20 rounded-md p-4 mb-6 border border-[#0FA0CE]/30">
          <h3 className="text-sm text-blue-100 mb-2">Recent Focus Stats</h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">25</p>
              <p className="text-xs text-blue-100">Minutes Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-blue-100">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">95%</p>
              <p className="text-xs text-blue-100">Completion Rate</p>
            </div>
            <Button variant="link" className="text-white underline text-xs" onClick={() => navigate('/focus')}>
              View all <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        {isTimerRunning ? (
          <div className="text-center py-6">
            <h3 className="text-2xl font-semibold mb-2">Focus Mode Active</h3>
            <p className="text-slate-400 mb-4">Working on your task...</p>
            <Progress value={45} className="h-2 mb-2" />
            <p className="text-sm text-slate-500">11:23 remaining</p>
            <Button 
              variant="destructive" 
              className="mt-4"
              onClick={handleEndSession}
            >
              End Session
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-xl font-semibold mb-2">Ready to Focus?</h3>
            <p className="text-slate-400 mb-4">Select a task from your Next Actions list</p>
            <Button 
              className="bg-[#0FA0CE] hover:bg-[#0D8CB4] text-white"
              onClick={startFocusSession}
            >
              Start Focus Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusSession;
