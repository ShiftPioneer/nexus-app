
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Knowledge = () => {
  const { toast } = useToast();
  
  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "The Knowledge Hub feature is under development and will be available soon!",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Knowledge Hub
            </h1>
            <p className="text-muted-foreground">Manage your learning, books, and resources</p>
          </div>
          <Button onClick={handleComingSoon} className="gap-2">
            <PlusSquare size={18} />
            Add Resource
          </Button>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Knowledge Management</CardTitle>
            <CardDescription>Track your learning journey and organize resources</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Knowledge Hub Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're developing a knowledge management system with book tracking, 
              skill progress, learning resources, and mind mapping tools.
            </p>
            <Button onClick={handleComingSoon}>Get Notified When Ready</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Knowledge;
