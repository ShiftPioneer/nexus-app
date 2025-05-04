
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Zap, Brain, BookOpen, Flame } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface FocusTechniquesProps {
  onStartTechnique: (technique: FocusTechnique) => void;
}

// Sample focus techniques
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
  const { toast } = useToast();
  
  const filteredTechniques = activeTab === "all" 
    ? focusTechniques 
    : focusTechniques.filter(t => t.difficulty.toLowerCase() === activeTab.toLowerCase());
  
  const handleStartTechnique = (technique: FocusTechnique) => {
    onStartTechnique(technique);
    toast({
      title: `${technique.name} Started`,
      description: `You've started a ${technique.duration} minute ${technique.name} session.`,
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Focus Techniques
          </CardTitle>
          <CardDescription>
            Scientifically proven methods to enhance your focus and productivity
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Techniques</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTechniques.map((technique) => (
              <Card key={technique.name} className="overflow-hidden border border-accent hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{technique.name}</CardTitle>
                      <CardDescription className="line-clamp-2 h-10">
                        {technique.description}
                      </CardDescription>
                    </div>
                    <div className="bg-muted rounded-full p-2 text-primary">
                      <technique.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{technique.difficulty}</Badge>
                      <Badge variant="outline">{technique.duration}min</Badge>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleStartTechnique(technique)}
                  >
                    Start Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedTechnique(technique)}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Technique details dialog */}
      <Dialog open={!!selectedTechnique} onOpenChange={(open) => !open && setSelectedTechnique(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedTechnique && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-2 rounded-full text-primary-foreground">
                    <selectedTechnique.icon className="h-5 w-5" />
                  </div>
                  <DialogTitle>{selectedTechnique.name}</DialogTitle>
                </div>
                <DialogDescription>
                  {selectedTechnique.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Difficulty</h4>
                    <p className="text-sm">{selectedTechnique.difficulty}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Duration</h4>
                    <p className="text-sm">{selectedTechnique.duration} minutes</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Best For</h4>
                  <p className="text-sm">{selectedTechnique.bestFor}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Structure</h4>
                  <p className="text-sm">{selectedTechnique.structure}</p>
                </div>
                
                <div className="bg-accent/50 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">How to Use</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Choose a specific task to focus on</li>
                    <li>Eliminate all potential distractions</li>
                    <li>Set a timer for {selectedTechnique.duration} minutes</li>
                    <li>Work with full concentration until the timer ends</li>
                    <li>Take a short break before starting another session</li>
                  </ol>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => {
                    handleStartTechnique(selectedTechnique);
                    setSelectedTechnique(null);
                  }}
                  className="w-full"
                >
                  Start {selectedTechnique.name} Technique
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FocusTechniques;
