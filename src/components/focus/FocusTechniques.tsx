
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BrainCircuit, LayoutGrid } from "lucide-react";

interface FocusTechniquesProps {
  onStartTechnique: (technique: FocusTechnique) => void;
}

const FocusTechniques: React.FC<FocusTechniquesProps> = ({ onStartTechnique }) => {
  const techniques: FocusTechnique[] = [
    {
      name: "Pomodoro Technique",
      description: "Work in focused 25-minute intervals with short breaks",
      difficulty: "Beginner",
      bestFor: "Avoiding procrastination",
      structure: "25min work / 5min break",
      duration: 25,
      icon: Clock
    },
    {
      name: "Deep Work",
      description: "Extended period of distraction-free concentration",
      difficulty: "Intermediate",
      bestFor: "Complex tasks",
      structure: "90min+ focused blocks",
      duration: 90,
      icon: BrainCircuit
    },
    {
      name: "Time Blocking",
      description: "Schedule specific time blocks for different tasks",
      difficulty: "Advanced",
      bestFor: "Managing multiple priorities",
      structure: "Customized time blocks",
      duration: 60,
      icon: LayoutGrid
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techniques.map((technique, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  index === 0 ? "bg-purple-100 text-purple-700" :
                  index === 1 ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {/* Fix: Use React component properly */}
                  <technique.icon className="h-8 w-8" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-2">{technique.name}</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">
                {technique.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm">Difficulty</span>
                  <span className="text-sm">{technique.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best for</span>
                  <span className="text-sm">{technique.bestFor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Structure</span>
                  <span className="text-sm">{technique.structure}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => onStartTechnique(technique)}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Focus Environment Tips</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Physical Space</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Clear your workspace of distractions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Ensure proper lighting and comfortable seating</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Maintain comfortable temperature in your workspace</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Add plants or natural elements to your environment</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Digital Environment</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Use website blockers during focus sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Turn off notifications on all devices</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Close unnecessary tabs and applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Consider using ambient noise or focus music</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Mental Preparation</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Set clear intentions before starting</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Practice a 2-minute mindfulness exercise</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Use visualization to imagine successful completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Have water and healthy snacks nearby</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusTechniques;
