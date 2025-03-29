
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Mindset = () => {
  const { toast } = useToast();
  
  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "The Mindset OS feature is under development and will be available soon!",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Mindset OS
            </h1>
            <p className="text-muted-foreground">Develop your mindset, affirmations, and beliefs</p>
          </div>
          <Button onClick={handleComingSoon} className="gap-2">
            <Sparkles size={18} />
            Vision Board
          </Button>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Mindset Development</CardTitle>
            <CardDescription>Tools to develop your mindset, affirmations, and belief systems</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Brain className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Mindset OS Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're building tools to help you develop positive mindsets, track affirmations, 
              create vision boards, and work on your core beliefs.
            </p>
            <Button onClick={handleComingSoon}>Get Notified When Ready</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Mindset;
