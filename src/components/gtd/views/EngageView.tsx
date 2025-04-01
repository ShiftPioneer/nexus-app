
import React, { useState } from "react";
import { useGTD, GTDTask } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Lightbulb, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const FocusTechnique = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonAction 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  buttonText: string;
  buttonAction: () => void;
}) => (
  <Card className="bg-blue-600 text-white mb-2">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {icon}
      </div>
      <p className="text-sm text-blue-100 mb-4">{description}</p>
      <Button 
        variant="secondary" 
        size="sm"
        onClick={buttonAction}
        className="bg-white text-blue-600 hover:bg-blue-50"
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

const EngageView: React.FC = () => {
  const { tasks } = useGTD();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const nextActionTasks = tasks.filter(t => t.status === "next-action");
  const filteredTasks = selectedContext 
    ? nextActionTasks.filter(t => t.context === selectedContext) 
    : nextActionTasks;
  
  const contexts = Array.from(new Set(tasks.map(t => t.context).filter(Boolean)));
  
  const handleStartPomodoro = () => {
    setIsTimerRunning(true);
    // Here you would actually start a timer, but for this example we'll just toggle state
    setTimeout(() => {
      setIsTimerRunning(false);
    }, 3000); // Just for demonstration
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card className="bg-slate-900 border-slate-700 text-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Clock className="mr-2 h-5 w-5" />
              Focus Session
            </CardTitle>
            <p className="text-sm text-slate-400">
              Eliminate distractions and focus on one task
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-600 rounded-md p-4 mb-6">
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
                <Button variant="link" className="text-white underline text-xs">
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
                  onClick={() => setIsTimerRunning(false)}
                >
                  End Session
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <h3 className="text-xl font-semibold mb-2">Ready to Focus?</h3>
                <p className="text-slate-400 mb-4">Select a task from your Next Actions list</p>
                <Button 
                  className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
                  onClick={handleStartPomodoro}
                >
                  Start Focus Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="border border-slate-700 rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Next Actions</h2>
            <Button 
              className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
            >
              + Add Task
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10 bg-slate-800 border-slate-700 text-slate-200"
              />
            </div>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No tasks match the selected filter. Add a task or change your filter.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center p-3 bg-slate-800 border border-slate-700 rounded-md hover:border-slate-600 transition-all">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-200">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-400 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={handleStartPomodoro}
                  >
                    Focus
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-700 text-slate-200">
          <CardHeader className="pb-2">
            <CardTitle>
              Context Filtering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant={selectedContext === null ? "default" : "outline"}
              className={`w-full mb-2 ${selectedContext === null ? "bg-[#FF5722] hover:bg-[#FF6E40] text-white" : ""}`}
              onClick={() => setSelectedContext(null)}
            >
              All Tasks
            </Button>
            
            {contexts.map((context) => (
              <Button
                key={context}
                variant={selectedContext === context ? "default" : "outline"}
                className={`w-full mb-2 ${selectedContext === context ? "bg-[#FF5722] hover:bg-[#FF6E40] text-white" : ""}`}
                onClick={() => setSelectedContext(context)}
              >
                @{context}
              </Button>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-700 text-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
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
        
        <Card className="bg-slate-900 border-slate-700 text-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Focus Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FocusTechnique
              title="Pomodoro"
              description="Work for 25 minutes, then take a 5-minute break."
              icon={<Clock className="h-5 w-5" />}
              buttonText="Try Now"
              buttonAction={handleStartPomodoro}
            />
            
            <FocusTechnique
              title="Time Blocking"
              description="Dedicate specific time blocks to focused work."
              icon={<Calendar className="h-5 w-5" />}
              buttonText="Learn More"
              buttonAction={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngageView;
