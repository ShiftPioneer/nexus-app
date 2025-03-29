
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Energy = () => {
  const { toast } = useToast();
  
  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "The Energy Hub feature is under development and will be available soon!",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Energy Hub
            </h1>
            <p className="text-muted-foreground">Track your energy levels, exercise, nutrition, and well-being</p>
          </div>
          <Button onClick={handleComingSoon} className="gap-2">
            <Activity size={18} />
            Track Energy
          </Button>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Energy & Well-being</CardTitle>
            <CardDescription>Monitor and optimize your physical and mental energy</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Zap className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Energy Hub Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're developing comprehensive tools to help you track energy levels, 
              exercise, nutrition, sleep, and overall well-being.
            </p>
            <Button onClick={handleComingSoon}>Get Notified When Ready</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Energy;
