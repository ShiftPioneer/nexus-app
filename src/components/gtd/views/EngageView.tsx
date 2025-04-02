
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import FocusTechnique from "./engage/FocusTechnique";
import FocusSession from "./engage/FocusSession";
import TasksPanel from "./engage/TasksPanel";
import ContextPanel from "./engage/ContextPanel";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EngageView: React.FC = () => {
  const { tasks } = useGTD();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const navigate = useNavigate();
  
  const nextActionTasks = tasks.filter(t => t.status === "next-action");
  const filteredTasks = selectedContext 
    ? nextActionTasks.filter(t => t.context === selectedContext) 
    : nextActionTasks;
  
  const contexts = Array.from(new Set(tasks.map(t => t.context).filter(Boolean)));
  
  const handleStartPomodoro = () => {
    setIsTimerRunning(true);
    // Navigate to Focus page in actual implementation
    navigate('/focus');
  };
  
  const handleEndSession = () => {
    setIsTimerRunning(false);
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:col-span-2 space-y-6">
        <FocusSession 
          isTimerRunning={isTimerRunning}
          handleStartPomodoro={handleStartPomodoro}
          handleEndSession={handleEndSession}
        />
        
        <TasksPanel 
          filteredTasks={filteredTasks}
          handleStartPomodoro={handleStartPomodoro}
        />
      </div>
      
      <div className="space-y-6">
        <ContextPanel 
          contexts={contexts}
          selectedContext={selectedContext}
          setSelectedContext={setSelectedContext}
        />
        
        <Card className="bg-slate-900 border-slate-700 text-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#0FA0CE]" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Your calendar events will appear here.</p>
              <Button variant="outline">
                Connect Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-700 text-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-[#0FA0CE]" />
              Focus Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FocusTechnique
              title="Pomodoro"
              description="Work for 25 minutes, then take a 5-minute break."
              icon={<Clock className="h-5 w-5 text-[#0FA0CE]" />}
              buttonText="Try Now"
              buttonAction={handleStartPomodoro}
            />
            
            <FocusTechnique
              title="Time Blocking"
              description="Dedicate specific time blocks to focused work."
              icon={<Calendar className="h-5 w-5 text-[#0FA0CE]" />}
              buttonText="Learn More"
              buttonAction={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default EngageView;
