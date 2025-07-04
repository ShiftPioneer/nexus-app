
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Zap, Brain, BookOpen, Flame, Timer, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";

interface FocusTechniquesProps {
  onStartTechnique: (technique: FocusTechnique) => void;
}

const focusTechniques: FocusTechnique[] = [
  {
    name: "Pomodoro",
    description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.",
    difficulty: "Beginner",
    bestFor: "Breaking down work into intervals",
    structure: "25min work, 5min break × 4, then 15-30min break",
    duration: 25,
    icon: Clock
  },
  {
    name: "Deep Work",
    description: "Dedicate 50-90 minutes to distraction-free, high-concentration work on a single task.",
    difficulty: "Intermediate",
    bestFor: "Complex problem-solving and creative tasks",
    structure: "50-90min of uninterrupted focus",
    duration: 50,
    icon: Brain
  },
  {
    name: "52/17 Method",
    description: "Work for 52 minutes with intense focus, then recover with a 17-minute break.",
    difficulty: "Intermediate",
    bestFor: "Maintaining high energy and productivity",
    structure: "52min work, 17min break",
    duration: 52,
    icon: Zap
  },
  {
    name: "Flow State",
    description: "Create optimal conditions for achieving a state of complete immersion in your work.",
    difficulty: "Advanced",
    bestFor: "Creative work and deep thinking",
    structure: "90-120min of uninterrupted focus",
    duration: 90,
    icon: Flame
  },
  {
    name: "Timeboxing",
    description: "Allocate a fixed time period to each task, moving on when time is up regardless of completion.",
    difficulty: "Beginner",
    bestFor: "Managing multiple tasks and preventing perfectionism",
    structure: "Fixed time blocks for specific tasks",
    duration: 30,
    icon: Target
  },
  {
    name: "Deliberate Practice",
    description: "Focus on specific skill improvement with targeted practice and immediate feedback.",
    difficulty: "Advanced",
    bestFor: "Skill development and mastery",
    structure: "45min targeted practice sessions",
    duration: 45,
    icon: BookOpen
  }
];

const FocusTechniques: React.FC<FocusTechniquesProps> = ({ onStartTechnique }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<FocusTechnique | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredTechniques = activeTab === "all" 
    ? focusTechniques 
    : focusTechniques.filter(t => t.difficulty.toLowerCase() === activeTab.toLowerCase());

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Intermediate": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Advanced": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const tabItems = [
    { value: "all", label: "All Techniques", gradient: "from-slate-500 via-slate-400 to-slate-500" },
    { value: "beginner", label: "Beginner", gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
    { value: "intermediate", label: "Intermediate", gradient: "from-blue-500 via-indigo-500 to-purple-500" },
    { value: "advanced", label: "Advanced", gradient: "from-purple-500 via-pink-500 to-rose-500" }
  ];

  return (
    <>
      <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-primary" />
            Focus Techniques Library
          </CardTitle>
          <CardDescription className="text-slate-400">
            Scientifically proven methods to enhance your focus and productivity
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <ModernTabs value={activeTab} onValueChange={setActiveTab}>
            <ModernTabsList>
              {tabItems.map((tab) => (
                <ModernTabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  gradient={tab.gradient}
                >
                  {tab.label}
                </ModernTabsTrigger>
              ))}
            </ModernTabsList>
            
            {tabItems.map((tab) => (
              <ModernTabsContent key={tab.value} value={tab.value}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTechniques.map(technique => (
                    <Card 
                      key={technique.name} 
                      className="group overflow-hidden bg-slate-800/50 border-slate-700/30 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-orange-500/20 group-hover:from-primary/30 group-hover:to-orange-500/30 transition-all duration-300">
                              <technique.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                                {technique.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${getDifficultyColor(technique.difficulty)} border text-xs`}>
                                  {technique.difficulty}
                                </Badge>
                                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                                  <Timer className="h-3 w-3 mr-1" />
                                  {technique.duration}min
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
                          {technique.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0 pb-3">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-400">Best for:</span>
                            <p className="text-slate-300">{technique.bestFor}</p>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex gap-2 pt-0">
                        <Button 
                          onClick={() => onStartTechnique(technique)}
                          className="flex-1 bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-lg"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedTechnique(technique)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ModernTabsContent>
            ))}
          </ModernTabs>
        </CardContent>
      </Card>
      
      {/* Technique Details Dialog */}
      <Dialog open={!!selectedTechnique} onOpenChange={() => setSelectedTechnique(null)}>
        {selectedTechnique && (
          <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-orange-500/20">
                  <selectedTechnique.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-white">{selectedTechnique.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getDifficultyColor(selectedTechnique.difficulty)} border text-xs`}>
                      {selectedTechnique.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {selectedTechnique.duration} minutes
                    </Badge>
                  </div>
                </div>
              </div>
              <DialogDescription className="text-slate-400">
                {selectedTechnique.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-white">Best For</h4>
                <p className="text-sm text-slate-300">{selectedTechnique.bestFor}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-white">Structure</h4>
                <p className="text-sm text-slate-300">{selectedTechnique.structure}</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                <h4 className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  How to Use
                </h4>
                <ol className="text-sm space-y-2 list-decimal list-inside text-slate-300">
                  <li>Choose a specific task to focus on</li>
                  <li>Eliminate all potential distractions</li>
                  <li>Set a timer for {selectedTechnique.duration} minutes</li>
                  <li>Work with full concentration until the timer ends</li>
                  <li>Take a break before starting another session</li>
                </ol>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  onStartTechnique(selectedTechnique);
                  setSelectedTechnique(null);
                }} 
                className="w-full bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start {selectedTechnique.name} Technique
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default FocusTechniques;
