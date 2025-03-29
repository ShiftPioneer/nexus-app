
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ChevronRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  dueDate: string;
  milestones: { text: string; completed: boolean }[];
}

const GoalSection = () => {
  const goals: Goal[] = [
    {
      id: "1",
      title: "Run a 10K race",
      category: "Health",
      progress: 65,
      dueDate: "July 30, 2023",
      milestones: [
        { text: "Complete 5K training program", completed: true },
        { text: "Run 8K without stopping", completed: true },
        { text: "Register for local 10K event", completed: false },
        { text: "Complete the race", completed: false },
      ]
    },
    {
      id: "2",
      title: "Learn intermediate Spanish",
      category: "Personal",
      progress: 40,
      dueDate: "December 15, 2023",
      milestones: [
        { text: "Complete beginner course", completed: true },
        { text: "Learn 500 common words", completed: true },
        { text: "Have a 5-minute conversation", completed: false },
        { text: "Pass intermediate exam", completed: false },
      ]
    }
  ];
  
  const { toast } = useToast();
  
  const handleViewGoals = () => {
    toast({
      description: "Goals section coming soon!",
    });
  };

  return (
    <section className="mb-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Active Goals</CardTitle>
              <CardDescription>Your progress towards key objectives</CardDescription>
            </div>
            <Button onClick={handleViewGoals} variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {goals.map((goal) => (
            <div 
              key={goal.id}
              className="mb-4 last:mb-0 border rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Target className="h-3.5 w-3.5 text-secondary" />
                    <span className="text-sm text-muted-foreground">{goal.category}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Due {goal.dueDate}</span>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-primary">
                  {goal.progress}%
                </div>
              </div>
              
              <div className="mt-3 progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${goal.progress}%`,
                    backgroundColor: goal.category === 'Health' ? '#39D98A' : '#024CAA'
                  }}
                ></div>
              </div>
              
              <div className="mt-4 space-y-2">
                {goal.milestones.slice(0, 2).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-success/20' : 'bg-muted/30'
                    }`}>
                      <CheckCircle2 
                        className={`h-3.5 w-3.5 ${
                          milestone.completed ? 'text-success' : 'text-muted-foreground/50'
                        }`} 
                      />
                    </div>
                    <span className={`text-sm ${
                      milestone.completed ? 'text-muted-foreground line-through' : ''
                    }`}>
                      {milestone.text}
                    </span>
                  </div>
                ))}
                
                {goal.milestones.length > 2 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-1 h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Show {goal.milestones.length - 2} more milestones
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default GoalSection;
