
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimeDesign = () => {
  const { toast } = useToast();
  
  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "The Time Design feature is under development and will be available soon!",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Time Design
            </h1>
            <p className="text-muted-foreground">Plan your day with time blocking, deep work sessions, and focus</p>
          </div>
          <Button onClick={handleComingSoon} className="gap-2">
            <Calendar size={18} />
            Open Calendar
          </Button>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Time Design</CardTitle>
            <CardDescription>Design your day with intention using our time planning tools</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Time Design Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're building a powerful time management system with time blocking, pomodoro timer, 
              deep work scheduling, and calendar integrations.
            </p>
            <Button onClick={handleComingSoon}>Get Notified When Ready</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TimeDesign;
